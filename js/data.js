export const SNAPSHOT = {
  id: "cdi-2024-v1.1-20260921-global",
  label: "CDI 2024 全球数据版",
  labelEn: "CDI 2024 Global Dataset",
  formulaVersion: "CDI 1.1",
  accessed: "2026-09-21",
  countryCount: 195,
  scoredCountryCount: 156,
  note: "覆盖 193 个联合国会员国、圣座与巴勒斯坦国。"
};

export const SOURCES = {
  worldBank: {
    name: "世界银行 World Development Indicators",
    nameEn: "World Bank World Development Indicators",
    short: "World Bank WDI",
    url: "https://data.worldbank.org/"
  },
  worldBankResourceTotal: {
    name: "世界银行 WDI · 总自然资源租金（2017—2021）",
    nameEn: "World Bank WDI · total natural resource rents, 2017–2021",
    short: "World Bank WDI",
    url: "https://data.worldbank.org/indicator/NY.GDP.TOTL.RT.ZS"
  },
  worldBankForestRents: {
    name: "世界银行 WDI · 森林租金（2017—2021）",
    nameEn: "World Bank WDI · forest rents, 2017–2021",
    short: "World Bank WDI",
    url: "https://data.worldbank.org/indicator/NY.GDP.FRST.RT.ZS"
  },
  wipo: {
    name: "WIPO Statistics Database · 2024 PCT country-of-origin fact sheet",
    nameEn: "WIPO Statistics Database · 2024 PCT applications by country of origin",
    short: "WIPO",
    url: "https://www.wipo.int/edocs/statistics-country-profile/en/_list/l5.pdf"
  },
  nature: {
    name: "Nature Index 2025 Research Leaders · Share 2024",
    nameEn: "Nature Index 2025 Research Leaders · 2024 Share",
    short: "Nature Index",
    url: "https://www.nature.com/nature-index/research-leaders/2025/country/all/global"
  },
  clarivate: {
    name: "Clarivate Highly Cited Researchers · 2025 当前名单",
    nameEn: "Clarivate Highly Cited Researchers · 2025 list",
    short: "Clarivate HCR",
    url: "https://clarivate.com/highly-cited-researchers/"
  },
  unEnergy: {
    name: "UNSD 2025 Energy Statistics Pocketbook · 2022 人均用电",
    nameEn: "UNSD 2025 Energy Statistics Pocketbook · 2022 electricity use per capita",
    short: "UNSD Energy",
    url: "https://desapublications.un.org/file/21030/download"
  },
  lpi: {
    name: "世界银行 Logistics Performance Index 2023 及历史版",
    nameEn: "World Bank Logistics Performance Index · 2023 and earlier editions",
    short: "World Bank LPI",
    url: "https://lpi.worldbank.org/"
  },
  unScope: {
    name: "联合国会员国名单与非会员观察员国名单",
    nameEn: "United Nations member states and non-member observer states",
    short: "United Nations",
    url: "https://www.un.org/about-us/member-states"
  }
};

export const INDICATORS = {
  gni: { label: "人均 GNI（PPP）", labelEn: "GNI per capita (PPP)", unit: "国际元", unitEn: "international dollars", targetYear: 2024, method: "L(x; 1,000, 80,000)", decimals: 0 },
  pct: { label: "PCT 国际专利申请量", labelEn: "PCT international patent applications", unit: "件", unitEn: "applications", targetYear: 2024, method: "C(x; 100,000)", decimals: 0 },
  nature: { label: "Nature Index Share", labelEn: "Nature Index Share", unit: "Share", unitEn: "Share", targetYear: 2024, method: "C(x; 50,000)", decimals: 2 },
  hcr: { label: "高被引研究者", labelEn: "Highly Cited Researchers", unit: "人", unitEn: "researchers", targetYear: 2025, method: "C(x; 3,000)", decimals: 0 },
  life: { label: "出生时预期寿命", labelEn: "Life expectancy at birth", unit: "岁", unitEn: "years", targetYear: 2024, method: "V(x; 20, 85)", decimals: 2 },
  electricity: { label: "人均用电量", labelEn: "Electricity use per capita", unit: "kWh/人", unitEn: "kWh/person", targetYear: 2023, method: "L(x; 500, 10,000)", decimals: 0 },
  internet: { label: "互联网使用率", labelEn: "Individuals using the Internet", unit: "%", unitEn: "%", targetYear: 2024, method: "直接取百分比", decimals: 2 },
  lpi: { label: "物流绩效指数 LPI", labelEn: "Logistics Performance Index (LPI)", unit: "1–5", unitEn: "1–5", targetYear: 2023, method: "V(x; 1, 5)", decimals: 2 },
  water: { label: "至少基本饮水服务", labelEn: "At least basic drinking water services", unit: "%", unitEn: "%", targetYear: 2024, method: "直接取百分比", decimals: 2 }
};

export const DIMENSIONS = {
  economy: { label: "经济", labelEn: "Economy", weight: 0.3, indicators: ["gni"] },
  knowledge: { label: "知识生产、科研与技术创新", labelEn: "Knowledge production, science and technology", shortLabel: "知识科研创新", shortLabelEn: "Knowledge & innovation", weight: 0.3, indicators: ["pct", "nature", "hcr"] },
  health: { label: "健康", labelEn: "Health", weight: 0.2, indicators: ["life"] },
  infrastructure: { label: "基础设施", labelEn: "Infrastructure", weight: 0.2, indicators: ["electricity", "internet", "lpi", "water"] }
};

export const STATUS_LABELS = {
  observed: { zh: "直接值", en: "Direct value" },
  substituted_older_year: { zh: "最近年份", en: "Latest available year" },
  substituted_alternative_source: { zh: "UNSD 数据", en: "UNSD data" },
  inferred_zero: { zh: "按 0 计", en: "Counted as 0" },
  missing: { zh: "暂无数据", en: "Unavailable" },
  invalid: { zh: "数据无效", en: "Invalid" }
};
