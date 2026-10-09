"use client";

import * as React from "react";
import { toast } from "sonner";
import { AsyncButton } from "@/components/candidates/async-button";
import { Rating } from "@/components/candidates/rating";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Press to run a fake 2s send. Every third press fails, to show the error state. */
export function AsyncButtonDemo({ variant }: { variant: React.ComponentProps<typeof AsyncButton>["variant"] }) {
  const presses = React.useRef(0);
  return (
    <AsyncButton
      variant={variant}
      onAction={async (report) => {
        presses.current += 1;
        for (const p of [18, 41, 63, 86, 100]) {
          await wait(350);
          report(p);
        }
        if (presses.current % 3 === 0) throw new Error("network");
      }}
    >
      Send request
    </AsyncButton>
  );
}

export function RatingDemo({ variant }: { variant: React.ComponentProps<typeof Rating>["variant"] }) {
  return <Rating variant={variant} label="How was your experience?" onValueChange={(v) => toast(`Rated ${v} of 5`)} />;
}
