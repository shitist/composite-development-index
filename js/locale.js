export function resolveDeviceLanguage(languages = []) {
  const candidates = Array.isArray(languages) ? languages : [languages];
  const primary = candidates.find((language) => typeof language === "string" && language.trim());
  return /^(zh|cmn|yue)(-|$)/i.test(primary ?? "") ? "zh" : "en";
}
