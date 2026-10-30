import assert from "node:assert/strict";
import { musinaEvidence, musinaSampleN } from "../src/data/musinaEvidence.js";
import { musinaWardPaths } from "../src/data/musinaGeography.js";

assert.equal(musinaEvidence.length, 6);
assert.equal(musinaWardPaths.length, 6);
assert.equal(musinaSampleN, 629);
assert.equal(musinaEvidence.reduce((sum, row) => sum + row.n, 0), 629);
for (const row of musinaEvidence) {
  const geo = musinaWardPaths.find(feature => feature.ward === row.ward);
  assert.ok(geo && geo.region.startsWith("M"), "Ward " + row.ward + " has a geographical outline");
  if (row.ward >= 3) assert.ok(geo.detail?.startsWith("M"), "Town-area ward " + row.ward + " must have an inset path");
  for (const metric of ["crossedYearly", "bornZimbabwe", "permanent"]) {
    const v = row[metric];
    assert.ok(v.count <= v.valid && v.valid <= row.n, "Numerator/denominator must be coherent");
    assert.ok(Math.abs(v.pct - 100 * v.count / v.valid) < .051,
      "Ward " + row.ward + " " + metric + " displayed percentage must match counts");
  }
}
const ward2 = musinaEvidence.find(x => x.ward === 2);
assert.equal(ward2.crossedYearly.count, 87);
assert.equal(ward2.crossedYearly.valid, 107);
assert.equal(ward2.crossedYearly.pct, 81.3);
console.log("PASS: 629 study respondents, six ward outlines, four inset outlines, audited numerator/denominator fractions.");
