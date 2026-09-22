import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { countryRegion } from "../js/regions.js";

test("Malta moves to Europe and only the five Central Asian states are separated", () => {
  const { countries } = JSON.parse(readFileSync(new URL("../data/processed/global-cdi-coverage.json", import.meta.url), "utf8"));
  const sovereign = countries.filter(country => country.scope === "sovereign_195");
  const centralAsia = sovereign.filter(country => countryRegion(country.iso3, country.region) === "Central Asia");
  assert.deepEqual(centralAsia.map(country => country.iso3).sort(), ["KAZ", "KGZ", "TJK", "TKM", "UZB"]);
  assert.equal(countryRegion("MLT", "Middle East, North Africa, Afghanistan & Pakistan"), "Europe");
  for (const country of sovereign) {
    const region = countryRegion(country.iso3, country.region);
    assert.notEqual(region, "Europe & Central Asia");
    if (country.iso3 !== "MLT" && country.region.trim() !== "Europe & Central Asia") {
      assert.equal(region, country.region.trim());
    }
  }
});
