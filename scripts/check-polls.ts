// Run: bun scripts/check-polls.ts — the vote API trusts nothing outside lib/polls.ts.
import assert from "node:assert/strict"
import { isVote } from "../lib/polls"

assert.ok(isVote("rating", "a"))
assert.ok(isVote("vs-switch", "iconiq"))
assert.ok(isVote("vs-switch", "merge"))
assert.ok(isVote("iq-autocomplete", "keep"))
assert.ok(!isVote("rating", "z"))
assert.ok(!isVote("vs-switch", "keep"))
assert.ok(!isVote("iq-nope", "keep"))
assert.ok(!isVote("__proto__", "a"))
assert.ok(!isVote("vs-", "shadcn"))
assert.ok(!isVote("toString", "a"))
assert.ok(!isVote(42, "a"))
console.log("polls: ok")
