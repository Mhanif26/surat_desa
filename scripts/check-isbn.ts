// Run: bun scripts/check-isbn.ts
import assert from "node:assert/strict"
import { isValidIsbn } from "../lib/isbn"

assert.ok(isValidIsbn("978-0-306-40615-7")) // ISBN-13
assert.ok(isValidIsbn("9780141036144"))
assert.ok(isValidIsbn("0-306-40615-2")) // ISBN-10
assert.ok(isValidIsbn("080442957X")) // X check digit
assert.ok(!isValidIsbn("9780306406158")) // wrong check digit
assert.ok(!isValidIsbn("0306406153"))
assert.ok(!isValidIsbn("12345"))
assert.ok(!isValidIsbn("97803064061XX"))
console.log("isbn: ok")
