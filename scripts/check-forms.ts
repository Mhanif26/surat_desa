// Run: bun scripts/check-forms.ts — password, phone and date-of-birth logic used by the candidates.
import assert from "node:assert/strict"
import { checkPassword } from "../lib/password"
import { groupDigits, normalizePhone } from "../lib/phone"
import { dateProblem, partsToIso } from "../lib/date-parts"

// password
assert.equal(checkPassword("").strength, 0)
assert.equal(checkPassword("password1").common, true)
assert.equal(checkPassword("password1").strength, 0)
assert.equal(checkPassword("abcdefgh").valid, false)
assert.equal(checkPassword("Abcdef1!").valid, true)
assert.equal(checkPassword("Abcdef1!").strength, 4)
assert.equal(checkPassword("Correct horse 7 staple!").strength, 4)

// phone (Indonesia: trunk 0, +62, 0062, 62…)
const ok = (r: ReturnType<typeof normalizePhone>) => ("e164" in r ? r.e164 : r.error)
assert.equal(ok(normalizePhone("0812-3456-7890", "ID")), "+6281234567890")
assert.equal(ok(normalizePhone("+62 812 3456 7890", "ID")), "+6281234567890")
assert.equal(ok(normalizePhone("0062 81234567890", "ID")), "+6281234567890")
assert.equal(ok(normalizePhone("6281234567890", "ID")), "+6281234567890")
assert.equal(ok(normalizePhone("0812", "ID")), "too-short")
assert.equal(ok(normalizePhone("+65 8123 4567", "ID")), "wrong-country")
assert.equal(ok(normalizePhone("8123 4567", "SG")), "+6581234567")
assert.equal(ok(normalizePhone("(201) 555-0123", "US")), "+12015550123")
assert.equal(ok(normalizePhone("", "US")), "empty")
assert.equal(groupDigits("81234567890"), "812 3456 7890")

// dates
const today = new Date("2026-10-10")
assert.equal(partsToIso(17, 8, 1965, today), "1965-08-17")
assert.equal(partsToIso(31, 2, 2000, today), "")
assert.equal(partsToIso(29, 2, 2024, today), "2024-02-29")
assert.equal(partsToIso(1, 1, 2030, today), "")
assert.equal(dateProblem("31", "02", "2001", today), "That day doesn’t exist in that month.")
assert.equal(dateProblem("12", "13", "2001", today), "Month must be between 1 and 12.")
assert.equal(dateProblem("1", "1", "2030", today), "That date is in the future.")
assert.equal(dateProblem("17", "08", "196", today), "")
console.log("forms: ok")
