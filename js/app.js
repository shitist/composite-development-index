import { calculateDataset, FORMULA_VERSION } from "./calculator.js?v=20260921b";
import { DIMENSIONS, INDICATORS, SNAPSHOT, SOURCES, STATUS_LABELS } from "./data.js?v=20260921b";
import { resolveDeviceLanguage } from "./locale.js?v=20260921c";

const indicatorEntries = Object.entries(INDICATORS);
const dimensionEntries = Object.entries(DIMENSIONS);
const regionNames = {
  "East Asia & Pacific": { zh: "东亚与太平洋", en: "East Asia & Pacific" },
  "Europe & Central Asia": { zh: "欧洲与中亚", en: "Europe & Central Asia" },
  "Latin America & Caribbean": { zh: "拉丁美洲与加勒比", en: "Latin America & Caribbean" },
  "Middle East, North Africa, Afghanistan & Pakistan": { zh: "中东、北非、阿富汗与巴基斯坦", en: "Middle East, North Africa, Afghanistan & Pakistan" },
  "North America": { zh: "北美", en: "North America" },
  "South Asia": { zh: "南亚", en: "South Asia" },
  "Sub-Saharan Africa": { zh: "撒哈拉以南非洲", en: "Sub-Saharan Africa" }
};
const regionDisplay = new Intl.DisplayNames(["zh-CN"], { type: "region" });

const TEXT = {
  zh: {
    unknown: "未知",
    loadFailed: "数据文件未能加载",
    serveApp: "请通过本地服务器或 GitHub Pages 打开本应用，不要直接双击 HTML 文件。",
    skip: "跳到主要内容",
    home: "CDI 首页",
    product: "综合发展指数",
    country: "国家",
    compare: "比较",
    ranking: "排名",
    method: "方法",
    install: "安装",
    display: "显示",
    mainNavigation: "主要导航",
    switchLanguage: "Switch to English",
    displaySettings: "显示设置",
    closeDisplay: "关闭显示设置",
    density: "信息密度",
    compact: "紧凑",
    standard: "标准",
    relaxed: "宽松",
    bilingualNames: "显示双语国名",
    countryQuery: "国家查询",
    countryTitle: "国家 CDI 查询",
    countryIntro: "查询 195 个国家的发展数据。",
    selectCountry: "选择国家",
    filterCountries: "搜索国家或代码",
    noCountries: "没有匹配的国家",
    cdiRank: "CDI 排名",
    cdiStatus: "CDI 状态",
    resourceAdjustment: "资源依赖修正",
    resourceAdjustmentApplied: "该国已进行资源依赖减分修正",
    nonrenewableResourceRents: "非可再生资源租金",
    resourceThreshold: "启动线",
    resourceYears: "取值年份",
    scoreBeforeAdjustment: "修正前 CDI",
    adjustmentDeduction: "减分",
    incomplete: "数据暂不完整",
    missing: "缺少",
    dataUpdated: "数据更新",
    noScore: "暂无总分",
    primaryDimensions: "一级维度",
    fourDimensions: "四个维度",
    weight: "权重",
    contribution: "贡献",
    dataStatus: "输入数据",
    indicatorsTitle: "九个指标与数据状态",
    remainingData: "其余数据见下表。",
    indicator: "指标",
    rawValue: "原始值",
    year: "年份",
    status: "状态",
    score: "得分",
    source: "来源",
    points: "分",
    compareTitle: "国家比较",
    compareSet: "比较对象",
    addCountry: "添加国家",
    chooseCountry: "选择一个国家",
    totalScore: "总分",
    cdiTotal: "CDI 总分",
    dimensionsComparison: "四个维度比较",
    rankingTitle: "CDI 排名",
    rankingNotice: "其余国家因数据不足暂不进入名次。",
    dimensionRankingNotice: "按该分类现有数据排名。",
    sortBy: "排序依据",
    region: "地区",
    allRegions: "全部地区",
    position: "序位",
    methodTitle: "计算方法",
    methodIntro: "CDI 由经济、知识科研创新、健康和基础设施四个维度组成。",
    totalFormula: "CDI 总公式",
    adjustmentMethod: "修正项",
    resourceMethodTitle: "资源依赖修正",
    resourceMeasure: "资源依赖度",
    resourceMeasureCopy: "N 为 2017—2021 年非可再生资源租金占 GDP 比例的平均值，由总自然资源租金减去森林租金得到。",
    researchWeakness: "科研不足系数",
    researchWeaknessCopy: "科研得分达到 60 时不修正；低于 60 后，修正强度按平方曲线增加。",
    correctionCalculation: "修正计算",
    correctionCalculationCopy: "资源比例不超过 10% 时不修正；超过后只计算高于 10% 的部分。",
    resourceMethodRule: "N ≤ 10% 或 K ≥ 60 时，P = 0。当前数据中共有 24 个国家触发该修正。",
    standardization: "标准化函数",
    logGoalpost: "对数目标值",
    logGoalpostUse: "用于人均 GNI 与人均用电量。",
    zeroCount: "允许为零的计数",
    zeroCountUse: "用于 PCT、Nature Share 与高被引研究者人数。",
    linearGoalpost: "线性目标值",
    linearGoalpostUse: "用于预期寿命与 LPI。",
    dimensionsAndWeights: "维度与权重",
    sources: "数据来源",
    sourceKicker: "来源",
    dataUse: "数据取值",
    dataRule1: "各项数据优先采用目标年份；目标年份缺失时，采用最近可用年份，并注明实际年份。",
    dataRule2: "WDI 未收录人均用电量时，使用 UNSD 2022 年数据。",
    dataRule3: "PCT、Nature 与 HCR 的来源表收录了全部正值国家，未列出的国家按 0 计算。",
    dataRule4: "九项指标及资源租金数据齐全后计算 CDI；缺少任一项必要数据时，暂不显示总分。",
    installed: "CDI 已安装到设备。",
    offlineUnavailable: "离线模式暂不可用。",
    metaDescription: "综合发展指数（CDI）国家查询、比较、排名与计算方法。"
  },
  en: {
    unknown: "Unknown",
    loadFailed: "The data file could not be loaded",
    serveApp: "Open this app through a local server or GitHub Pages instead of opening the HTML file directly.",
    skip: "Skip to main content",
    home: "CDI home",
    product: "Composite Development Index",
    country: "Country",
    compare: "Compare",
    ranking: "Ranking",
    method: "Method",
    install: "Install",
    display: "Display",
    mainNavigation: "Main navigation",
    switchLanguage: "切换到中文",
    displaySettings: "Display settings",
    closeDisplay: "Close display settings",
    density: "Information density",
    compact: "Compact",
    standard: "Standard",
    relaxed: "Relaxed",
    bilingualNames: "Show bilingual country names",
    countryQuery: "Country lookup",
    countryTitle: "Country CDI Lookup",
    countryIntro: "Explore development data for 195 countries.",
    selectCountry: "Select a country",
    filterCountries: "Search country or code",
    noCountries: "No matching country",
    cdiRank: "CDI rank",
    cdiStatus: "CDI status",
    resourceAdjustment: "Resource-dependence adjustment",
    resourceAdjustmentApplied: "A resource-dependence score reduction is applied to this country",
    nonrenewableResourceRents: "Non-renewable resource rents",
    resourceThreshold: "Activation threshold",
    resourceYears: "Observation years",
    scoreBeforeAdjustment: "CDI before adjustment",
    adjustmentDeduction: "Score reduction",
    incomplete: "Data incomplete",
    missing: "Missing",
    dataUpdated: "Data updated",
    noScore: "No score",
    primaryDimensions: "Primary dimensions",
    fourDimensions: "Four dimensions",
    weight: "Weight",
    contribution: "Contribution",
    dataStatus: "Input data",
    indicatorsTitle: "Nine indicators and data status",
    remainingData: "Available data are shown below.",
    indicator: "Indicator",
    rawValue: "Raw value",
    year: "Year",
    status: "Status",
    score: "Score",
    source: "Source",
    points: "points",
    compareTitle: "Country Comparison",
    compareSet: "Countries",
    addCountry: "Add country",
    chooseCountry: "Choose a country",
    totalScore: "Total score",
    cdiTotal: "CDI score",
    dimensionsComparison: "Four-dimension comparison",
    rankingTitle: "CDI Ranking",
    rankingNotice: "Countries with insufficient data are not ranked yet.",
    dimensionRankingNotice: "Ranked by the available data for this dimension.",
    sortBy: "Sort by",
    region: "Region",
    allRegions: "All regions",
    position: "Rank",
    methodTitle: "Method",
    methodIntro: "CDI combines four dimensions: economy, knowledge and innovation, health, and infrastructure.",
    totalFormula: "CDI formula",
    adjustmentMethod: "Adjustment",
    resourceMethodTitle: "Resource-dependence adjustment",
    resourceMeasure: "Resource dependence",
    resourceMeasureCopy: "N is the 2017–2021 mean of non-renewable resource rents as a share of GDP, calculated as total natural resource rents minus forest rents.",
    researchWeakness: "Research-capacity shortfall",
    researchWeaknessCopy: "No adjustment applies at a knowledge score of 60 or above. Below 60, the adjustment intensity rises on a squared curve.",
    correctionCalculation: "Adjustment calculation",
    correctionCalculationCopy: "No adjustment applies at or below 10%. Above 10%, only the share exceeding the threshold is counted.",
    resourceMethodRule: "P = 0 when N ≤ 10% or K ≥ 60. The current dataset applies this adjustment to 24 countries.",
    standardization: "Normalization functions",
    logGoalpost: "Logarithmic goalpost",
    logGoalpostUse: "Used for GNI per capita and electricity use per capita.",
    zeroCount: "Zero-inclusive count",
    zeroCountUse: "Used for PCT applications, Nature Index Share, and Highly Cited Researchers.",
    linearGoalpost: "Linear goalpost",
    linearGoalpostUse: "Used for life expectancy and LPI.",
    dimensionsAndWeights: "Dimensions and weights",
    sources: "Data sources",
    sourceKicker: "Sources",
    dataUse: "Data selection",
    dataRule1: "Target-year data are used when available. Otherwise, the latest available observation is used and its actual year is shown.",
    dataRule2: "Where WDI has no electricity-use value, the UNSD 2022 value is used.",
    dataRule3: "The PCT, Nature, and HCR tables include every positive country value; countries not listed are counted as 0.",
    dataRule4: "CDI is calculated when all nine indicators and the resource-rent input are available. If any required value is missing, no total is shown.",
    installed: "CDI has been installed.",
    offlineUnavailable: "Offline mode is currently unavailable.",
    metaDescription: "Composite Development Index country lookup, comparison, ranking, and methodology."
  }
};

function initialLanguage() {
  const fromUrl = new URLSearchParams(window.location.search).get("lang");
  if (["zh", "en"].includes(fromUrl)) return fromUrl;
  try {
    const stored = window.localStorage.getItem("cdi-language");
    if (["zh", "en"].includes(stored)) return stored;
  } catch {
    // The app still works when storage is unavailable.
  }
  return resolveDeviceLanguage(navigator.languages?.length ? navigator.languages : navigator.language);
}

const state = {
  selectedCode: "USA",
  compareCodes: new Set(["USA", "CHN", "FRA", "GBR"]),
  rankingSort: "total",
  rankingRegion: "all",
  language: initialLanguage(),
  showBilingual: false,
  deferredInstallPrompt: null
};

function t(key) {
  return TEXT[state.language][key] ?? TEXT.zh[key] ?? key;
}

async function loadCountries() {
  const countryUrl = new URL("../data/processed/global-cdi-coverage.json", import.meta.url);
  const resourceUrl = new URL("../data/processed/nonrenewable-resource-rents-2017-2021.json", import.meta.url);
  const [countryResponse, resourceResponse] = await Promise.all([fetch(countryUrl), fetch(resourceUrl)]);
  if (!countryResponse.ok) throw new Error(`${t("loadFailed")}: HTTP ${countryResponse.status}`);
  if (!resourceResponse.ok) throw new Error(`${t("loadFailed")}: HTTP ${resourceResponse.status}`);
  const [payload, resourcePayload] = await Promise.all([
    countryResponse.json(),
    resourceResponse.json()
  ]);
  const resourcesByCode = new Map(resourcePayload.countries.map((item) => [item.iso3, item]));
  return payload.countries
    .filter((country) => country.scope === "sovereign_195")
    .map((country) => {
      let nameZh = country.name;
      try {
        nameZh = regionDisplay.of(country.iso2) || country.name;
      } catch {
        // Some special codes are not present in every browser's Intl dataset.
      }
      const resourceRent = resourcesByCode.get(country.iso3) ?? null;
      return {
        code: country.iso3,
        iso2: country.iso2,
        name: nameZh,
        nameEn: country.name,
        regionKey: country.region.trim(),
        scoreStatus: country.score_status,
        auditScore: country.cdi,
        resourceRent,
        observations: country.indicators,
        data: {
          ...Object.fromEntries(indicatorEntries.map(([key]) => [key, country.indicators[key]?.value ?? null])),
          resourceRent: resourceRent?.averagePercent ?? null
        }
      };
    });
}

let dataset;
try {
  dataset = calculateDataset(await loadCountries());
} catch (error) {
  document.querySelector("#view-country").innerHTML = `
    <div class="page-shell load-error">
      <h1>${t("loadFailed")}</h1>
      <p>${escapeHtml(error.message)}</p>
      <p>${t("serveApp")}</p>
    </div>`;
  throw error;
}

const ranked = [...dataset].filter((item) => item.result.eligible).sort((a, b) => a.rank - b.rank);

const views = new Map(
  [...document.querySelectorAll("[data-view]")].map((element) => [element.dataset.view, element])
);

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function countryByCode(code) {
  return dataset.find((country) => country.code === code) ?? dataset.find((country) => country.code === "USA") ?? dataset[0];
}

function currentRoute() {
  const route = window.location.hash.replace("#", "").split("?")[0];
  return views.has(route) ? route : "country";
}

function formatScore(value) {
  return typeof value === "number" ? value.toFixed(2) : "—";
}

function formatRaw(value, decimals = 2) {
  if (typeof value !== "number") return state.language === "en" ? "Unavailable" : "缺失";
  return new Intl.NumberFormat(state.language === "en" ? "en-US" : "zh-CN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals === 0 ? 0 : Math.min(decimals, 1)
  }).format(value);
}

function formatYears(years = []) {
  if (!years.length) return "—";
  if (years.length === 1) return String(years[0]);
  const continuous = years.every((year, index) => index === 0 || year === years[index - 1] + 1);
  return continuous ? `${years[0]}–${years.at(-1)}` : years.join(state.language === "en" ? ", " : "、");
}

function countryName(country, bilingual = state.showBilingual) {
  const primary = state.language === "en" ? country.nameEn : country.name;
  const secondary = state.language === "en" ? country.name : country.nameEn;
  return bilingual && primary !== secondary ? `${primary} / ${secondary}` : primary;
}

function countrySearchLabel(country) {
  return `${countryName(country)} (${country.code})`;
}

function regionName(countryOrKey) {
  const key = typeof countryOrKey === "string" ? countryOrKey : countryOrKey.regionKey;
  return regionNames[key]?.[state.language] ?? key;
}

function indicatorLabel(meta) {
  return state.language === "en" ? meta.labelEn : meta.label;
}

function indicatorUnit(meta) {
  return state.language === "en" ? meta.unitEn : meta.unit;
}

function dimensionLabel(meta, short = false) {
  if (state.language === "en") return (short ? meta.shortLabelEn : meta.labelEn) ?? meta.labelEn;
  return (short ? meta.shortLabel : meta.label) ?? meta.label;
}

function statusLabel(status) {
  return STATUS_LABELS[status]?.[state.language] || status || t("unknown");
}

function statusClass(status) {
  if (status === "observed") return "observed";
  if (status === "missing" || status === "invalid") return "missing";
  return "qualified";
}

function sourceLabel(url) {
  if (!url) return "—";
  if (url.includes("worldbank.org")) return state.language === "en" ? "World Bank" : "世界银行";
  if (url.includes("wipo.int")) return "WIPO";
  if (url.includes("nature.com")) return "Nature Index";
  if (url.includes("clarivate.com")) return "Clarivate";
  if (url.includes("desapublications.un.org")) return "UNSD";
  try {
    return new URL(url).hostname;
  } catch {
    return t("source");
  }
}

function bar(value, label, tone = "ink") {
  const safe = Math.max(0, Math.min(100, Number(value) || 0));
  return `
    <div class="bar" role="img" aria-label="${escapeHtml(label)} ${formatScore(value)} ${t("points")}">
      <span class="bar__fill bar__fill--${tone}" style="--value:${safe}%"></span>
    </div>`;
}

function sectionKicker(index, label) {
  return `<p class="section-kicker"><span>${String(index).padStart(2, "0")}</span>${escapeHtml(label)}</p>`;
}

function missingNames(country) {
  return country.result.missing.map((key) => {
    if (key === "resourceRent") return t("nonrenewableResourceRents");
    return INDICATORS[key] ? indicatorLabel(INDICATORS[key]) : key;
  });
}

function renderCountry() {
  const country = countryByCode(state.selectedCode);
  const { result } = country;
  const missing = missingNames(country);
  const rankMarkup = result.eligible
    ? `<span class="label">${t("cdiRank")}</span><strong>${country.rank}/${ranked.length}</strong>`
    : `<span class="label">${t("cdiStatus")}</span><strong class="status-word">${t("incomplete")}</strong><span class="muted">${t("missing")}${state.language === "en" ? ": " : "："}${escapeHtml(missing.join(state.language === "en" ? ", " : "、"))}</span>`;
  const orderedCountries = [...dataset]
    .sort((a, b) => countryName(a, false).localeCompare(countryName(b, false), state.language === "en" ? "en" : "zh-CN"));
  const countryOptions = orderedCountries.map((item) => {
    const searchText = `${item.name} ${item.nameEn} ${item.code}`.toLocaleLowerCase();
    return `<button class="country-picker__option ${item.code === country.code ? "is-selected" : ""}" type="button" role="option" aria-selected="${item.code === country.code}" data-country-code="${item.code}" data-search="${escapeHtml(searchText)}">${escapeHtml(countrySearchLabel(item))}</button>`;
  }).join("");

  views.get("country").innerHTML = `
    <div class="page-shell">
      <header class="page-intro page-intro--split page-intro--compact">
        <div>
          ${sectionKicker(1, t("countryQuery"))}
          <h1 id="country-view-title">${t("countryTitle")}</h1>
          <p class="page-intro__copy">${t("countryIntro")}</p>
        </div>
        <div class="country-select-label">
          <span id="country-picker-label">${t("selectCountry")}</span>
          <div id="country-picker" class="country-picker">
            <div class="country-picker__control">
              <input id="country-picker-input" class="country-picker__input" type="search" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="country-picker-menu" aria-labelledby="country-picker-label" value="${escapeHtml(countrySearchLabel(country))}" placeholder="${t("filterCountries")}" autocomplete="off" spellcheck="false" />
              <button id="country-picker-toggle" class="country-picker__toggle" type="button" aria-label="${t("selectCountry")}" aria-haspopup="listbox" aria-expanded="false" aria-controls="country-picker-menu"></button>
            </div>
            <div id="country-picker-menu" class="country-picker__menu" hidden>
              <div class="country-picker__options" role="listbox" aria-labelledby="country-picker-label">${countryOptions}</div>
              <p id="country-picker-empty" class="country-picker__empty" hidden>${t("noCountries")}</p>
            </div>
          </div>
        </div>
      </header>

      <section class="score-hero ${result.eligible ? "" : "score-hero--missing"}" aria-label="${escapeHtml(countryName(country))} CDI">
        <div class="score-hero__identity">
          <p class="eyebrow">${country.code} · ${escapeHtml(regionName(country))}</p>
          <h2>${escapeHtml(countryName(country))}</h2>
          <p class="snapshot-label">${state.language === "en" ? SNAPSHOT.labelEn : SNAPSHOT.label}<br>${t("dataUpdated")} ${SNAPSHOT.accessed}</p>
        </div>
        <div class="score-hero__number">
          ${result.eligible
            ? `<span class="score-hero__value">${formatScore(result.total)}</span>`
            : `<span class="score-hero__unavailable">${t("noScore")}</span>`}
        </div>
        <div class="score-hero__rank">${rankMarkup}</div>
      </section>

      ${result.eligible && result.adjustment.applied ? `
        <section class="resource-adjustment" aria-labelledby="resource-adjustment-title">
          <div class="resource-adjustment__lead">
            <p class="label">${t("resourceAdjustment")}</p>
            <h2 id="resource-adjustment-title">${t("resourceAdjustmentApplied")}</h2>
            <p>${state.language === "en"
              ? `Non-renewable resource rents equal ${formatScore(result.adjustment.resourceRentPercent)}% of GDP.`
              : `非可再生资源租金占 GDP 的 ${formatScore(result.adjustment.resourceRentPercent)}%。`}</p>
          </div>
          <dl class="resource-adjustment__facts">
            <div><dt>${t("nonrenewableResourceRents")}</dt><dd>${formatScore(result.adjustment.resourceRentPercent)}%</dd></div>
            <div><dt>${t("resourceYears")}</dt><dd>${formatYears(country.resourceRent?.years)}</dd></div>
            <div><dt>${t("scoreBeforeAdjustment")}</dt><dd>${formatScore(result.baseTotal)}</dd></div>
            <div><dt>${t("adjustmentDeduction")}</dt><dd>−${formatScore(result.adjustment.points)}</dd></div>
          </dl>
        </section>` : ""}

      ${result.eligible ? `
        <section class="content-section" aria-labelledby="dimensions-title">
          <div class="section-heading">
            <div>${sectionKicker(2, t("primaryDimensions"))}<h2 id="dimensions-title">${t("fourDimensions")}</h2></div>
          </div>
          <div class="dimension-list">
            ${dimensionEntries.map(([key, meta]) => `
              <article class="dimension-row">
                <div class="dimension-row__label"><h3>${escapeHtml(dimensionLabel(meta))}</h3><span>${t("weight")} ${(meta.weight * 100).toFixed(0)}%</span></div>
                <div class="dimension-row__measure">
                  ${bar(result.dimensions[key], dimensionLabel(meta))}
                  <span class="dimension-row__score">${formatScore(result.dimensions[key])}</span>
                </div>
                <div class="dimension-row__contribution"><span>${t("contribution")}</span><strong>${formatScore(result.contributions[key])}</strong></div>
              </article>`).join("")}
          </div>
        </section>` : `
        <section class="content-section missing-panel" aria-labelledby="missing-title">
          ${sectionKicker(2, t("dataStatus"))}
          <h2 id="missing-title">${t("incomplete")}</h2>
          <p>${t("missing")}${state.language === "en" ? ": " : "："}${escapeHtml(missing.join(state.language === "en" ? ", " : "、"))}${state.language === "en" ? ". " : "。"}${t("remainingData")}</p>
        </section>`}

      <section class="content-section" aria-labelledby="raw-title">
        <div class="section-heading">
          <div>${sectionKicker(3, t("dataStatus"))}<h2 id="raw-title">${t("indicatorsTitle")}</h2></div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>${t("indicator")}</th><th>${t("rawValue")}</th><th>${t("year")}</th><th>${t("status")}</th><th>${t("score")}</th><th>${t("source")}</th></tr></thead>
            <tbody>
              ${indicatorEntries.map(([key, meta]) => {
                const observation = country.observations[key] || {};
                const source = observation.source;
                return `<tr>
                  <th scope="row">${escapeHtml(indicatorLabel(meta))}</th>
                  <td data-label="${t("rawValue")}">${formatRaw(observation.value, meta.decimals)} <span class="unit">${escapeHtml(indicatorUnit(meta))}</span></td>
                  <td data-label="${t("year")}">${observation.year ?? "—"}</td>
                  <td data-label="${t("status")}"><span class="status-badge status-badge--${statusClass(observation.status)}">${escapeHtml(statusLabel(observation.status))}</span></td>
                  <td data-label="${t("score")}"><strong>${result.indicators ? formatScore(result.indicators[key]) : "—"}</strong></td>
                  <td data-label="${t("source")}">${source ? `<a href="${escapeHtml(source)}" target="_blank" rel="noreferrer">${escapeHtml(sourceLabel(source))}<span class="external" aria-hidden="true">↗</span></a>` : "—"}</td>
                </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
      </section>

    </div>`;

  const picker = document.querySelector("#country-picker");
  const pickerInput = document.querySelector("#country-picker-input");
  const pickerToggle = document.querySelector("#country-picker-toggle");
  const pickerMenu = document.querySelector("#country-picker-menu");
  const pickerOptionsContainer = document.querySelector(".country-picker__options");
  const pickerOptions = [...document.querySelectorAll(".country-picker__option")];
  const pickerEmpty = document.querySelector("#country-picker-empty");
  const selectedOption = pickerOptions.find((option) => option.dataset.countryCode === country.code);
  const showAllOptions = () => {
    pickerOptions.forEach((option) => { option.hidden = false; });
    pickerEmpty.hidden = true;
  };
  const filterOptions = (query) => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    let visibleCount = 0;
    pickerOptions.forEach((option) => {
      option.hidden = !option.dataset.search.includes(normalizedQuery);
      if (!option.hidden) visibleCount += 1;
    });
    pickerEmpty.hidden = visibleCount !== 0;
    pickerOptionsContainer.scrollTop = 0;
  };
  const setPickerOpen = (open, resetQuery = true) => {
    pickerMenu.hidden = !open;
    pickerInput.setAttribute("aria-expanded", String(open));
    pickerToggle.setAttribute("aria-expanded", String(open));
    if (open) {
      if (resetQuery) {
        pickerInput.value = countrySearchLabel(country);
        showAllOptions();
      }
      if (selectedOption && resetQuery) {
        pickerOptionsContainer.scrollTop = Math.max(
          0,
          selectedOption.offsetTop - pickerOptionsContainer.offsetTop
        );
      }
    } else {
      pickerInput.value = countrySearchLabel(country);
    }
  };
  pickerInput.addEventListener("focus", () => {
    if (pickerMenu.hidden) setPickerOpen(true);
    pickerInput.select();
  });
  pickerInput.addEventListener("click", () => {
    if (pickerMenu.hidden) setPickerOpen(true);
  });
  pickerInput.addEventListener("input", () => {
    if (pickerMenu.hidden) setPickerOpen(true, false);
    filterOptions(pickerInput.value);
  });
  pickerInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setPickerOpen(false);
      pickerInput.blur();
    }
    if (event.key === "Enter") {
      const firstVisible = pickerOptions.find((option) => !option.hidden);
      if (!firstVisible) return;
      event.preventDefault();
      state.selectedCode = firstVisible.dataset.countryCode;
      renderAll();
    }
  });
  pickerToggle.addEventListener("click", () => {
    const shouldOpen = pickerMenu.hidden;
    setPickerOpen(shouldOpen);
    if (shouldOpen) {
      pickerInput.focus();
      pickerInput.select();
    }
  });
  picker.addEventListener("focusout", (event) => {
    if (!picker.contains(event.relatedTarget)) setPickerOpen(false);
  });
  pickerOptions.forEach((option) => {
    option.addEventListener("click", () => {
      state.selectedCode = option.dataset.countryCode;
      renderAll();
    });
  });
}

function renderCompare() {
  const selected = [...state.compareCodes].map(countryByCode).filter((country) => country.result.eligible);
  const available = ranked.filter((country) => !state.compareCodes.has(country.code));
  views.get("compare").innerHTML = `
    <div class="page-shell">
      <header class="page-intro page-intro--compact">
        ${sectionKicker(1, t("compare"))}
        <h1 id="compare-view-title">${t("compareTitle")}</h1>
      </header>

      <section class="selector-block" aria-labelledby="compare-selector-title">
        <div class="selector-block__heading"><h2 id="compare-selector-title">${t("compareSet")}</h2><span>${selected.length} / 5</span></div>
        <div>
          <div class="selected-countries">
            ${selected.map((country) => `<button class="compare-token" type="button" data-remove-code="${country.code}" ${selected.length <= 2 ? "disabled" : ""}>${escapeHtml(countryName(country))}<span aria-hidden="true">×</span></button>`).join("")}
          </div>
          <label class="compare-add-label">${t("addCountry")}
            <select id="compare-add" ${selected.length >= 5 ? "disabled" : ""}>
              <option value="">${t("chooseCountry")}</option>
              ${available.map((country) => `<option value="${country.code}">${escapeHtml(countryName(country))} · ${country.code}</option>`).join("")}
            </select>
          </label>
        </div>
      </section>

      <section class="content-section compare-section" aria-labelledby="compare-chart-title">
        <div class="section-heading"><div>${sectionKicker(2, t("totalScore"))}<h2 id="compare-chart-title">${t("cdiTotal")}</h2></div></div>
        <div class="comparison-bars">
          ${selected.map((country, index) => `
            <div class="comparison-row">
              <div class="comparison-row__name"><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(countryName(country))}</div>
              ${bar(country.result.total, `${countryName(country, false)} CDI`, country.code === state.selectedCode ? "accent" : "ink")}
              <strong>${formatScore(country.result.total)}</strong>
            </div>`).join("")}
        </div>
      </section>

      <section class="content-section" aria-label="${t("dimensionsComparison")}">
        <div class="table-wrap">
          <table class="data-table comparison-table">
            <thead><tr><th>${t("country")}</th><th>CDI</th>${dimensionEntries.map(([, meta]) => `<th>${escapeHtml(dimensionLabel(meta, true))}</th>`).join("")}</tr></thead>
            <tbody>${selected.map((country) => `<tr><th scope="row">${escapeHtml(countryName(country))}</th><td><strong>${formatScore(country.result.total)}</strong></td>${dimensionEntries.map(([key]) => `<td>${formatScore(country.result.dimensions[key])}</td>`).join("")}</tr>`).join("")}</tbody>
          </table>
        </div>
      </section>
    </div>`;

  document.querySelector("#compare-add").addEventListener("change", (event) => {
    if (!event.target.value || state.compareCodes.size >= 5) return;
    state.compareCodes.add(event.target.value);
    renderCompare();
  });
  document.querySelectorAll("[data-remove-code]").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.compareCodes.size <= 2) return;
      state.compareCodes.delete(button.dataset.removeCode);
      renderCompare();
    });
  });
}

function sortValue(country) {
  return state.rankingSort === "total"
    ? country.result.total
    : country.result.availableDimensions[state.rankingSort];
}

function rankingPool() {
  if (state.rankingSort === "total") return ranked;
  return dataset.filter((country) => Number.isFinite(sortValue(country)));
}

function renderRanking() {
  const pool = rankingPool();
  const regions = [...new Set(pool.map((country) => country.regionKey))]
    .sort((a, b) => regionName(a).localeCompare(regionName(b), state.language === "en" ? "en" : "zh-CN"));
  const rows = pool
    .filter((country) => state.rankingRegion === "all" || country.regionKey === state.rankingRegion)
    .sort((a, b) => sortValue(b) - sortValue(a));
  views.get("ranking").innerHTML = `
    <div class="page-shell">
      <header class="page-intro page-intro--split page-intro--compact">
        <div>${sectionKicker(1, t("ranking"))}<h1 id="ranking-view-title">${t("rankingTitle")}</h1><p class="page-intro__copy">${t(state.rankingSort === "total" ? "rankingNotice" : "dimensionRankingNotice")}</p></div>
        <div class="ranking-controls">
          <label>${t("sortBy")}<select id="ranking-sort"><option value="total">${t("cdiTotal")}</option>${dimensionEntries.map(([key, meta]) => `<option value="${key}" ${state.rankingSort === key ? "selected" : ""}>${escapeHtml(dimensionLabel(meta, true))}</option>`).join("")}</select></label>
          <label>${t("region")}<select id="ranking-region"><option value="all">${t("allRegions")}</option>${regions.map((region) => `<option value="${escapeHtml(region)}" ${state.rankingRegion === region ? "selected" : ""}>${escapeHtml(regionName(region))}</option>`).join("")}</select></label>
        </div>
      </header>
      <section class="ranking-list" aria-label="${t("rankingTitle")}">
        <div class="ranking-list__head"><span>${t("position")}</span><span>${t("country")}</span><span>${state.rankingSort === "total" ? "CDI" : escapeHtml(dimensionLabel(DIMENSIONS[state.rankingSort], true))}</span><span>0–100</span></div>
        ${rows.map((country, index) => `
          <button class="ranking-row ${country.code === state.selectedCode ? "ranking-row--selected" : ""}" type="button" data-country-code="${country.code}" ${country.code === state.selectedCode ? 'aria-current="true"' : ""}>
            <span class="ranking-row__rank">${String(index + 1).padStart(2, "0")}</span>
            <span class="ranking-row__country">${escapeHtml(countryName(country))}<small>${country.code} · ${escapeHtml(regionName(country))}</small></span>
            <strong>${formatScore(sortValue(country))}</strong>${bar(sortValue(country), countryName(country, false), country.code === state.selectedCode ? "accent" : "ink")}
          </button>`).join("")}
      </section>
    </div>`;

  document.querySelector("#ranking-sort").value = state.rankingSort;
  document.querySelector("#ranking-sort").addEventListener("change", (event) => { state.rankingSort = event.target.value; renderRanking(); });
  document.querySelector("#ranking-region").addEventListener("change", (event) => { state.rankingRegion = event.target.value; renderRanking(); });
  document.querySelectorAll("[data-country-code]").forEach((row) => {
    row.addEventListener("click", () => {
      state.selectedCode = row.dataset.countryCode;
      renderAll();
      window.location.hash = "country";
    });
  });
}

function renderMethod() {
  views.get("method").innerHTML = `
    <div class="page-shell method-page">
      <header class="page-intro page-intro--compact">
        ${sectionKicker(1, t("method"))}
        <h1 id="method-view-title">${t("methodTitle")}</h1>
        <p class="page-intro__copy">${t("methodIntro")}</p>
      </header>
      <section class="formula-hero" aria-label="${t("totalFormula")}"><span>${FORMULA_VERSION}</span><code>CDI* = 0.30E + 0.30K + 0.20H + 0.20F − P</code></section>
      <section class="method-grid" aria-label="${t("standardization")}">
        <article><span>01</span><h2>${t("logGoalpost")}</h2><code>L(x; a,b) = clip[100 × ln(x/a) / ln(b/a)]</code><p>${t("logGoalpostUse")}</p></article>
        <article><span>02</span><h2>${t("zeroCount")}</h2><code>C(x; b) = clip[100 × ln(1+x) / ln(1+b)]</code><p>${t("zeroCountUse")}</p></article>
        <article><span>03</span><h2>${t("linearGoalpost")}</h2><code>V(x; a,b) = clip[100 × (x-a) / (b-a)]</code><p>${t("linearGoalpostUse")}</p></article>
      </section>
      <section class="content-section" aria-labelledby="method-dimensions-title">
        <div class="section-heading"><div>${sectionKicker(2, t("dimensionsAndWeights"))}<h2 id="method-dimensions-title">${t("primaryDimensions")}</h2></div></div>
        <div class="method-dimensions">
          <article><span class="method-dimensions__weight">30%</span><h3>${escapeHtml(dimensionLabel(DIMENSIONS.economy))} E</h3><code>E = L(GNI; 1,000, 80,000)</code></article>
          <article><span class="method-dimensions__weight">30%</span><h3>${escapeHtml(dimensionLabel(DIMENSIONS.knowledge, true))} K</h3><code>K = 0.4·C(PCT) + 0.4·C(Nature) + 0.2·C(HCR)</code></article>
          <article><span class="method-dimensions__weight">20%</span><h3>${escapeHtml(dimensionLabel(DIMENSIONS.health))} H</h3><code>H = V(${state.language === "en" ? "life expectancy" : "预期寿命"}; 20, 85)</code></article>
          <article><span class="method-dimensions__weight">20%</span><h3>${escapeHtml(dimensionLabel(DIMENSIONS.infrastructure))} F</h3><code>F = ${state.language === "en" ? "(electricity + internet + LPI + water) / 4" : "(用电 + 互联网 + LPI + 基本饮水) / 4"}</code></article>
        </div>
      </section>
      <section class="content-section" aria-labelledby="resource-method-title">
        <div class="section-heading"><div>${sectionKicker(3, t("adjustmentMethod"))}<h2 id="resource-method-title">${t("resourceMethodTitle")}</h2></div></div>
        <div class="resource-method">
          <article>
            <span>01</span>
            <div><h3>${t("resourceMeasure")}</h3><code>N = mean(total resource rents − forest rents)</code><p>${t("resourceMeasureCopy")}</p></div>
          </article>
          <article>
            <span>02</span>
            <div><h3>${t("researchWeakness")}</h3><code>T = [max(60 − K, 0) / 60]²</code><p>${t("researchWeaknessCopy")}</p></div>
          </article>
          <article>
            <span>03</span>
            <div><h3>${t("correctionCalculation")}</h3><code>X = max(N − 10%, 0)<br>P = 0.30E × X × T<br>CDI* = CDI − P</code><p>${t("correctionCalculationCopy")}</p></div>
          </article>
        </div>
        <p class="resource-method__rule">${t("resourceMethodRule")}</p>
      </section>
      <section class="content-section" aria-labelledby="source-title">
        <div class="section-heading"><div>${sectionKicker(4, t("sourceKicker"))}<h2 id="source-title">${t("sources")}</h2></div></div>
        <ol class="source-list">${Object.values(SOURCES).map((source, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(state.language === "en" ? source.nameEn : source.name)}<span class="external" aria-hidden="true">↗</span></a></li>`).join("")}</ol>
      </section>
      <section class="method-rule">
        <h2>${t("dataUse")}</h2>
        <div>
          <p>${t("dataRule1")}</p>
          <p>${t("dataRule2")}</p>
          <p>${t("dataRule3")}</p>
          <p>${t("dataRule4")}</p>
        </div>
      </section>
    </div>`;
}

function renderAll() {
  renderChrome();
  renderCountry();
  renderCompare();
  renderRanking();
  renderMethod();
  updateRoute();
}

function updateRoute() {
  const route = currentRoute();
  views.forEach((element, name) => { element.hidden = name !== route; });
  document.querySelectorAll("[data-route]").forEach((link) => {
    const active = link.dataset.route === route;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  document.title = `${routeTitle(route)} · CDI`;
}

function routeTitle(route) {
  return { country: t("country"), compare: t("compare"), ranking: t("ranking"), method: t("method") }[route] ?? t("product");
}

function renderChrome() {
  document.documentElement.lang = state.language === "en" ? "en" : "zh-CN";
  document.body.dataset.language = state.language;
  document.querySelector("#skip-link").textContent = t("skip");
  document.querySelector("#wordmark").setAttribute("aria-label", t("home"));
  document.querySelector("#wordmark-name").textContent = t("product");
  document.querySelector("[data-route='country']").textContent = t("country");
  document.querySelector("[data-route='compare']").textContent = t("compare");
  document.querySelector("[data-route='ranking']").textContent = t("ranking");
  document.querySelector("[data-route='method']").textContent = t("method");
  document.querySelector(".primary-nav").setAttribute("aria-label", t("mainNavigation"));
  const languageButton = document.querySelector("#language-toggle");
  languageButton.textContent = state.language === "en" ? "中文" : "EN";
  languageButton.setAttribute("aria-label", t("switchLanguage"));
  document.querySelector("#install-button").textContent = t("install");
  document.querySelector("#tweaks-toggle").textContent = t("display");
  document.querySelector("#tweaks-title").textContent = t("displaySettings");
  document.querySelector("#tweaks-close").setAttribute("aria-label", t("closeDisplay"));
  document.querySelector("#density-legend").textContent = t("density");
  document.querySelector("#density-compact").textContent = t("compact");
  document.querySelector("#density-standard").textContent = t("standard");
  document.querySelector("#density-relaxed").textContent = t("relaxed");
  document.querySelector("#bilingual-name-label").textContent = t("bilingualNames");
  document.querySelector("#bilingual-name-toggle").checked = state.showBilingual;
  document.querySelector('meta[name="description"]').setAttribute("content", t("metaDescription"));
  document.querySelector('link[rel="manifest"]').setAttribute("href", state.language === "en" ? "./manifest.en.webmanifest" : "./manifest.webmanifest");
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => { toast.hidden = true; }, 2400);
}

function setupTweaks() {
  const panel = document.querySelector("#tweaks-panel");
  const toggle = document.querySelector("#tweaks-toggle");
  const close = document.querySelector("#tweaks-close");
  const setOpen = (open) => {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (open) panel.querySelector("input")?.focus();
  };
  toggle.addEventListener("click", () => setOpen(panel.hidden));
  close.addEventListener("click", () => setOpen(false));
  document.querySelectorAll("input[name='density']").forEach((input) => {
    input.addEventListener("change", (event) => { document.body.dataset.density = event.target.value; });
  });
  document.querySelector("#bilingual-name-toggle").addEventListener("change", (event) => {
    state.showBilingual = event.target.checked;
    renderAll();
  });
}

function setupLanguage() {
  document.querySelector("#language-toggle").addEventListener("click", () => {
    state.language = state.language === "en" ? "zh" : "en";
    try {
      window.localStorage.setItem("cdi-language", state.language);
    } catch {
      // Language switching does not depend on storage.
    }
    const url = new URL(window.location.href);
    url.searchParams.set("lang", state.language);
    window.history.replaceState(null, "", url);
    renderAll();
  });
}

function setupCountryPickerDismissal() {
  const closePicker = () => {
    const menu = document.querySelector("#country-picker-menu");
    const input = document.querySelector("#country-picker-input");
    const toggle = document.querySelector("#country-picker-toggle");
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    input?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-expanded", "false");
    if (input) input.value = countrySearchLabel(countryByCode(state.selectedCode));
  };
  document.addEventListener("click", (event) => {
    const picker = document.querySelector("#country-picker");
    if (picker && !picker.contains(event.target)) closePicker();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closePicker();
    document.querySelector("#country-picker-input")?.blur();
  });
}

function setupInstall() {
  const button = document.querySelector("#install-button");
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.deferredInstallPrompt = event;
    button.hidden = false;
  });
  button.addEventListener("click", async () => {
    if (!state.deferredInstallPrompt) return;
    state.deferredInstallPrompt.prompt();
    await state.deferredInstallPrompt.userChoice;
    state.deferredInstallPrompt = null;
    button.hidden = true;
  });
  window.addEventListener("appinstalled", () => showToast(t("installed")));
}

window.addEventListener("hashchange", updateRoute);
setupTweaks();
setupLanguage();
setupCountryPickerDismissal();
setupInstall();
renderAll();

if ("serviceWorker" in navigator && ["http:", "https:"].includes(window.location.protocol)) {
  navigator.serviceWorker.register("./service-worker.js").catch(() => {
    showToast(t("offlineUnavailable"));
  });
}
