import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const svg = readFileSync(new URL("../public/assets/research-geographies.svg", import.meta.url), "utf8");
const paths = [...svg.matchAll(/<path d="([^"]+)"/g)].map(m => m[1]);
assert.equal(paths.length, 51, "Natural Earth features should remain in the atlas");
const coords = paths.flatMap(d => [...d.matchAll(/[ML](-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map(m => [Number(m[1]), Number(m[2])]));
assert.ok(coords.length > 1000, "Preserve meaningful cartographic geometry");
const xs = coords.map(p => p[0]), ys = coords.map(p => p[1]);
const width = Math.max(...xs) - Math.min(...xs);
const height = Math.max(...ys) - Math.min(...ys);
const ratio = width / height;
assert.ok(ratio > 0.87 && ratio < 1.14, "Africa locator should no longer have an exaggerated horizontal extent; got " + ratio);
for (const city of ["ACCRA", "NAIROBI", "JOHANNESBURG", "MUSINA"]) assert.ok(svg.includes(">" + city + "</text>"), "Retain " + city + " locator");
assert.match(svg, /Natural Earth 1:110 million/);
console.log("PASS: African geography aspect ratio " + ratio.toFixed(2) + ", 51 preserved country paths and 4 city labels.");
