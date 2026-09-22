const CENTRAL_ASIA = new Set(["KAZ", "KGZ", "TJK", "TKM", "UZB"]);

// Keep source classifications intact; apply CDI's display grouping centrally.
export function countryRegion(code, sourceRegion) {
  if (CENTRAL_ASIA.has(code)) return "Central Asia";
  if (code === "MLT" || sourceRegion.trim() === "Europe & Central Asia") return "Europe";
  return sourceRegion.trim();
}
