import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { BlobPreconditionFailedError, get, put } from "@vercel/blob";
import { cookies } from "next/headers";
import { isVote, type PollState, type PollStore } from "@/lib/polls";

// Votes live in one JSON file: a private Vercel Blob (polls.json) when the
// project has a Blob store linked, else data/polls.json on local disk.
const BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
const FILE = path.join(process.cwd(), "data", "polls.json");
const COOKIE = "poll_voter";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const empty = (): PollStore => ({ tallies: {}, voters: {} });

/** etag is the Blob version we read, so a write can refuse to clobber a newer one. */
async function load(): Promise<{ store: PollStore; etag?: string }> {
  if (BLOB) {
    const res = await get("polls.json", { access: "private", useCache: false });
    if (!res || res.statusCode !== 200) return { store: empty() };
    return { store: await new Response(res.stream).json(), etag: res.blob.etag };
  }
  try {
    return { store: JSON.parse(await readFile(FILE, "utf8")) };
  } catch (error) {
    // Missing file = no votes yet. Anything else (bad JSON) must fail loudly,
    // or the next write would replace every vote with an empty store.
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { store: empty() };
    throw error;
  }
}

async function save(store: PollStore, etag?: string) {
  const json = JSON.stringify(store, null, 2) + "\n";
  if (BLOB) {
    // No etag = file doesn't exist yet; without allowOverwrite a racing create fails instead of clobbering.
    await put("polls.json", json, {
      access: "private", contentType: "application/json", addRandomSuffix: false,
      ...(etag ? { ifMatch: etag } : { allowOverwrite: false }),
    });
    return;
  }
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(`${FILE}.tmp`, json);
  await rename(`${FILE}.tmp`, FILE); // atomic: a crash never leaves half a file
}

// Serialize writes in this process; across serverless instances the Blob etag
// check catches a lost race and we re-read and retry.
let queue: Promise<unknown> = Promise.resolve();
function mutate<T>(fn: (store: PollStore) => T): Promise<T> {
  const run = queue.then(async () => {
    for (let attempt = 1; ; attempt++) {
      const { store, etag } = await load();
      const result = fn(store);
      try {
        await save(store, etag);
        return result;
      } catch (error) {
        const lostRace = error instanceof BlobPreconditionFailedError || (BLOB && !etag);
        if (!lostRace || attempt >= 5) throw error;
      }
    }
  });
  queue = run.catch(() => {});
  return run;
}

async function voterId() {
  const jar = await cookies();
  let id = jar.get(COOKIE)?.value;
  // Only trust our own UUIDs; a crafted cookie like "__proto__" must not become a key.
  if (!id || !UUID.test(id)) {
    id = crypto.randomUUID();
    jar.set(COOKIE, id, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 365, path: "/" });
  }
  return id;
}

const view = (store: PollStore, voter: string): PollState => ({
  tallies: store.tallies,
  mine: store.voters[voter] ?? {},
});

export async function GET() {
  const [{ store }, voter] = await Promise.all([load(), voterId()]);
  return Response.json(view(store, voter));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { poll, option } = body ?? {};
  if (!isVote(poll, option)) {
    return Response.json({ error: "Unknown poll or option" }, { status: 400 });
  }

  const voter = await voterId();
  const state = await mutate((store) => {
    const mine = (store.voters[voter] ??= {});
    if (!mine[poll]) {
      // One vote per browser per poll, like X polls.
      mine[poll] = option;
      const tally = (store.tallies[poll] ??= {});
      tally[option] = (tally[option] ?? 0) + 1;
    }
    return view(store, voter);
  });
  return Response.json(state);
}
