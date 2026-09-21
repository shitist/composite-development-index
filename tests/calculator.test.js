import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  calculateAvailableDimensions,
  calculateCountry,
  calculateDataset,
  calculateResourceAdjustment,
  clip,
  linear,
  logCount,
  logGoalpost
} from "../js/calculator.js";
import { DIMENSIONS, INDICATORS, SOURCES, STATUS_LABELS } from "../js/data.js";

const payload = JSON.parse(
  readFileSync(new URL("../data/processed/global-cdi-coverage.json", import.meta.url), "utf8")
);
const resourcePayload = JSON.parse(
  readFileSync(new URL("../data/processed/nonrenewable-resource-rents-2017-2021.json", import.meta.url), "utf8")
);
const resourcesByCode = new Map(resourcePayload.countries.map((country) => [country.iso3, country]));
const COUNTRIES = payload.countries
  .filter((country) => country.scope === "sovereign_195")
  .map((country) => ({
    code: country.iso3,
    expected: country.cdi,
    expectedStatus: country.score_status,
    data: {
      ...Object.fromEntries(Object.entries(country.indicators).map(([key, item]) => [key, item.value])),
      resourceRent: resourcesByCode.get(country.iso3)?.averagePercent ?? null
    }
  }));

test("normalization boundaries are clipped to 0–100", () => {
  assert.equal(logGoalpost(1000, 1000, 80000), 0);
  assert.equal(logGoalpost(80000, 1000, 80000), 100);
  assert.equal(logGoalpost(126630, 1000, 80000), 100);
  assert.equal(logCount(0, 3000), 0);
  assert.equal(logCount(3000, 3000), 100);
  assert.equal(linear(20, 20, 85), 0);
  assert.equal(linear(85, 20, 85), 100);
  assert.equal(clip(-10), 0);
  assert.equal(clip(110), 100);
});

test("missing data is not silently converted to zero", () => {
  const incomplete = { ...COUNTRIES[0], data: { ...COUNTRIES[0].data, lpi: null } };
  const result = calculateCountry(incomplete);
  assert.equal(result.eligible, false);
  assert.deepEqual(result.missing, ["lpi"]);
  assert.equal(result.total, null);
});

test("a country can enter each dimension ranking when that dimension is complete", () => {
  const incomplete = {
    data: {
      gni: 30000,
      pct: 10,
      nature: 5,
      hcr: 2,
      life: 75,
      electricity: 4000,
      internet: 80,
      lpi: null,
      water: 95,
      resourceRent: null
    }
  };
  const result = calculateCountry(incomplete);

  assert.equal(result.eligible, false);
  assert.ok(Number.isFinite(result.availableDimensions.economy));
  assert.ok(Number.isFinite(result.availableDimensions.knowledge));
  assert.ok(Number.isFinite(result.availableDimensions.health));
  assert.equal(result.availableDimensions.infrastructure, null);
});

test("dimension availability is calculated independently from CDI eligibility", () => {
  const counts = Object.keys(DIMENSIONS).map((dimension) => [
    dimension,
    COUNTRIES.filter((country) => Number.isFinite(calculateAvailableDimensions(country.data).dimensions[dimension])).length
  ]);

  assert.deepEqual(Object.fromEntries(counts), {
    economy: 186,
    knowledge: 195,
    health: 194,
    infrastructure: 159
  });
});

test("the sovereign scope contains 195 unique country codes", () => {
  const codes = COUNTRIES.map((country) => country.code);
  assert.equal(codes.length, 195);
  assert.equal(new Set(codes).size, codes.length);
});

test("global snapshot reproduces every audited base score and every insufficient-data decision", () => {
  const calculated = calculateDataset(COUNTRIES);
  for (const country of calculated) {
    const shouldBeEligible = country.expectedStatus !== "insufficient_data";
    assert.equal(country.result.eligible, shouldBeEligible, `${country.code}: eligibility mismatch`);
    if (shouldBeEligible) {
      assert.ok(
        Math.abs(country.result.baseTotal - country.expected) <= 0.0001,
        `${country.code}: expected base ${country.expected}, got ${country.result.baseTotal}`
      );
    } else {
      assert.equal(country.result.total, null);
      assert.ok(country.result.missing.length > 0, `${country.code}: missing list should not be empty`);
    }
  }
});

test("dimension contributions add exactly to the displayed CDI before rounding", () => {
  for (const country of COUNTRIES) {
    const result = calculateCountry(country);
    if (!result.eligible) continue;
    const sum = Object.values(result.contributions).reduce((total, value) => total + value, 0);
    assert.ok(Math.abs(sum - result.total) < 1e-12);
  }
});

test("resource adjustment is continuous at the 10% threshold and stops at K=60", () => {
  assert.equal(calculateResourceAdjustment(80, 0, 10).points, 0);
  assert.equal(calculateResourceAdjustment(80, 60, 40).points, 0);
  assert.ok(Math.abs(calculateResourceAdjustment(80, 0, 20).points - 2.4) < 1e-12);
  assert.ok(Math.abs(calculateResourceAdjustment(80, 30, 20).points - 0.6) < 1e-12);
  assert.ok(calculateResourceAdjustment(80, 0, 10.001).points < 0.001);
});

test("the current sovereign snapshot applies the resource adjustment to 24 countries", () => {
  const calculated = calculateDataset(COUNTRIES);
  const adjusted = calculated.filter((country) => country.result.adjustment?.applied);
  assert.equal(adjusted.length, 24);
  assert.ok(adjusted.some((country) => country.code === "BRN"));
  assert.ok(adjusted.some((country) => country.code === "KAZ"));
  assert.ok(!adjusted.some((country) => country.code === "NOR"));
});

test("every visible data label has Chinese and English copy", () => {
  for (const indicator of Object.values(INDICATORS)) {
    assert.ok(indicator.label);
    assert.ok(indicator.labelEn);
    assert.ok(indicator.unit);
    assert.ok(indicator.unitEn);
  }
  for (const dimension of Object.values(DIMENSIONS)) {
    assert.ok(dimension.label);
    assert.ok(dimension.labelEn);
  }
  for (const source of Object.values(SOURCES)) {
    assert.ok(source.name);
    assert.ok(source.nameEn);
  }
  for (const status of Object.values(STATUS_LABELS)) {
    assert.ok(status.zh);
    assert.ok(status.en);
  }
});
