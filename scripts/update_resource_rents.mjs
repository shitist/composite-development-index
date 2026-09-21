import { readFile, writeFile } from "node:fs/promises";

const ROOT = new URL("../", import.meta.url);
const COUNTRY_DATA_URL = new URL("data/processed/global-cdi-coverage.json", ROOT);
const OUTPUT_URL = new URL("data/processed/nonrenewable-resource-rents-2017-2021.json", ROOT);
const START_YEAR = 2017;
const END_YEAR = 2021;
const THRESHOLD_PERCENT = 10;
const TOTAL_RENTS = "NY.GDP.TOTL.RT.ZS";
const FOREST_RENTS = "NY.GDP.FRST.RT.ZS";

async function fetchIndicator(indicator) {
  const url = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?date=${START_YEAR}:${END_YEAR}&format=json&per_page=30000`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${indicator}: HTTP ${response.status}`);
  const payload = await response.json();
  return {
    url,
    values: new Map(
      (payload[1] ?? [])
        .filter((row) => row.value !== null && row.value !== undefined)
        .map((row) => [`${row.countryiso3code}|${row.date}`, Number(row.value)])
    )
  };
}

const countryPayload = JSON.parse(await readFile(COUNTRY_DATA_URL, "utf8"));
const countryCodes = countryPayload.countries
  .filter((country) => country.scope === "sovereign_195")
  .map((country) => country.iso3);

const [total, forest] = await Promise.all([
  fetchIndicator(TOTAL_RENTS),
  fetchIndicator(FOREST_RENTS)
]);

const countries = countryCodes.map((iso3) => {
  const annual = [];
  for (let year = START_YEAR; year <= END_YEAR; year += 1) {
    const key = `${iso3}|${year}`;
    if (!total.values.has(key) || !forest.values.has(key)) continue;
    const value = Math.max(0, total.values.get(key) - forest.values.get(key));
    annual.push({ year, value: Number(value.toFixed(9)) });
  }

  const averagePercent = annual.length
    ? annual.reduce((sum, item) => sum + item.value, 0) / annual.length
    : null;

  return {
    iso3,
    averagePercent: averagePercent === null ? null : Number(averagePercent.toFixed(9)),
    years: annual.map((item) => item.year),
    annual,
    status: annual.length === END_YEAR - START_YEAR + 1
      ? "complete"
      : annual.length > 0
        ? "partial"
        : "missing"
  };
});

const output = {
  id: "world-bank-nonrenewable-resource-rents-2017-2021",
  accessed: "2026-09-21",
  unit: "% of GDP",
  period: { start: START_YEAR, end: END_YEAR },
  thresholdPercent: THRESHOLD_PERCENT,
  definition: "Annual total natural resource rents minus annual forest rents; the country value is the mean of available annual observations.",
  indicators: {
    totalNaturalResourceRents: TOTAL_RENTS,
    forestRents: FOREST_RENTS
  },
  sources: {
    totalNaturalResourceRents: total.url,
    forestRents: forest.url
  },
  countries
};

await writeFile(OUTPUT_URL, `${JSON.stringify(output, null, 2)}\n`, "utf8");

const complete = countries.filter((country) => country.status === "complete").length;
const partial = countries.filter((country) => country.status === "partial").length;
const missing = countries.filter((country) => country.status === "missing").length;
console.log(`Wrote ${countries.length} countries: ${complete} complete, ${partial} partial, ${missing} missing.`);
