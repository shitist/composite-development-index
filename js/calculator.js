export const FORMULA_VERSION = "CDI 1.1";
export const RESOURCE_RENTS_THRESHOLD_PERCENT = 10;

export function clip(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function logGoalpost(value, lower, upper) {
  assertFinite(value, "value");
  if (value <= 0 || lower <= 0 || upper <= lower) {
    throw new RangeError("对数目标值及上下限必须为正，且上限必须大于下限。");
  }
  return clip((100 * Math.log(value / lower)) / Math.log(upper / lower));
}

export function logCount(value, upper) {
  assertFinite(value, "value");
  if (value < 0 || upper <= 0) {
    throw new RangeError("计数不得小于 0，且上限必须为正。");
  }
  return clip((100 * Math.log1p(value)) / Math.log1p(upper));
}

export function linear(value, lower, upper) {
  assertFinite(value, "value");
  if (upper <= lower) {
    throw new RangeError("线性标准化上限必须大于下限。");
  }
  return clip((100 * (value - lower)) / (upper - lower));
}

export function calculateResourceAdjustment(economy, knowledge, resourceRentPercent) {
  assertFinite(economy, "economy");
  assertFinite(knowledge, "knowledge");
  assertFinite(resourceRentPercent, "resourceRentPercent");

  const normalizedRentPercent = clip(resourceRentPercent, 0, 100);
  const excessRentShare = Math.max(
    normalizedRentPercent - RESOURCE_RENTS_THRESHOLD_PERCENT,
    0
  ) / 100;
  const technologyWeakness = Math.pow(Math.max(60 - knowledge, 0) / 60, 2);
  const points = 0.3 * economy * excessRentShare * technologyWeakness;

  return {
    applied: points > 0,
    points,
    resourceRentPercent: normalizedRentPercent,
    thresholdPercent: RESOURCE_RENTS_THRESHOLD_PERCENT,
    excessRentPercent: excessRentShare * 100,
    technologyWeakness
  };
}

function assertFinite(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${label} 缺失或不是有限数值。`);
  }
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

export function calculateAvailableDimensions(raw) {
  const indicators = {
    gni: isFiniteNumber(raw.gni) ? logGoalpost(raw.gni, 1000, 80000) : null,
    pct: isFiniteNumber(raw.pct) ? logCount(raw.pct, 100000) : null,
    nature: isFiniteNumber(raw.nature) ? logCount(raw.nature, 50000) : null,
    hcr: isFiniteNumber(raw.hcr) ? logCount(raw.hcr, 3000) : null,
    life: isFiniteNumber(raw.life) ? linear(raw.life, 20, 85) : null,
    electricity: isFiniteNumber(raw.electricity) ? logGoalpost(raw.electricity, 500, 10000) : null,
    internet: isFiniteNumber(raw.internet) ? clip(raw.internet) : null,
    lpi: isFiniteNumber(raw.lpi) ? linear(raw.lpi, 1, 5) : null,
    water: isFiniteNumber(raw.water) ? clip(raw.water) : null
  };

  const dimensions = {
    economy: indicators.gni,
    knowledge: [indicators.pct, indicators.nature, indicators.hcr].every(isFiniteNumber)
      ? 0.4 * indicators.pct + 0.4 * indicators.nature + 0.2 * indicators.hcr
      : null,
    health: indicators.life,
    infrastructure: [indicators.electricity, indicators.internet, indicators.lpi, indicators.water].every(isFiniteNumber)
      ? (indicators.electricity + indicators.internet + indicators.lpi + indicators.water) / 4
      : null
  };

  return { indicators, dimensions };
}

export function calculateCountry(country) {
  const raw = country.data;
  const required = ["gni", "pct", "nature", "hcr", "life", "electricity", "internet", "lpi", "water", "resourceRent"];
  const missing = required.filter((key) => !isFiniteNumber(raw[key]));
  const available = calculateAvailableDimensions(raw);

  if (missing.length > 0) {
    return {
      eligible: false,
      missing,
      total: null,
      dimensions: null,
      indicators: null,
      availableDimensions: available.dimensions,
      availableIndicators: available.indicators
    };
  }

  const { indicators, dimensions } = available;

  const baseContributions = {
    economy: dimensions.economy * 0.3,
    knowledge: dimensions.knowledge * 0.3,
    health: dimensions.health * 0.2,
    infrastructure: dimensions.infrastructure * 0.2
  };

  const baseTotal = Object.values(baseContributions).reduce((sum, value) => sum + value, 0);
  const adjustment = calculateResourceAdjustment(
    dimensions.economy,
    dimensions.knowledge,
    raw.resourceRent
  );
  const contributions = {
    ...baseContributions,
    economy: baseContributions.economy - adjustment.points
  };
  const total = baseTotal - adjustment.points;
  return {
    eligible: true,
    missing: [],
    total,
    baseTotal,
    dimensions,
    contributions,
    baseContributions,
    adjustment,
    indicators,
    availableDimensions: dimensions,
    availableIndicators: indicators
  };
}

export function calculateDataset(countries) {
  const calculated = countries.map((country) => ({ ...country, result: calculateCountry(country) }));
  const ranked = calculated
    .filter((country) => country.result.eligible)
    .sort((a, b) => b.result.total - a.result.total)
    .map((country, index) => ({ ...country, rank: index + 1 }));
  const rankByCode = new Map(ranked.map((country) => [country.code, country.rank]));

  return calculated.map((country) => ({
    ...country,
    rank: rankByCode.get(country.code) ?? null
  }));
}
