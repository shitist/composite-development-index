# Composite Development Index

The Composite Development Index (CDI) measures national development through four dimensions: economic capacity, knowledge production and technological capability, population health, and infrastructure. Every indicator and dimension is normalized to a 0–100 scale.

**Live site:** [composite-development-index.kisaraginiigata.chatgpt.site](https://composite-development-index.kisaraginiigata.chatgpt.site)

The web application provides bilingual country profiles, country comparison, dimension rankings, source records, observation years, and data-status labels. It is a static Progressive Web App and can be installed on desktop and mobile devices.

## Current dataset

Snapshot: `cdi-2024-v1.1-20260921-global`

The country scope contains 195 states: 193 United Nations member states, the Holy See, and the State of Palestine.

| Ranking | Countries included |
| --- | ---: |
| CDI total score | 156 |
| Economy | 186 |
| Knowledge and innovation | 195 |
| Health | 194 |
| Infrastructure | 159 |

A country enters a dimension ranking when every indicator required by that dimension is available. A CDI total is calculated when all nine indicators and the non-renewable resource-rent input are available.

## CDI formula

Let:

- `E` = economy score
- `K` = knowledge production, science, and technology score
- `H` = health score
- `F` = infrastructure score
- `P` = resource-dependence adjustment

The final score is:

```text
CDI* = 0.30E + 0.30K + 0.20H + 0.20F - P
```

### Normalization functions

All functions return values clipped to the interval `[0, 100]`.

```text
L(x; a, b) = clip[100 × ln(x/a) / ln(b/a)]
C(x; b)    = clip[100 × ln(1+x) / ln(1+b)]
V(x; a, b) = clip[100 × (x-a) / (b-a)]
```

- `L` is the logarithmic goalpost function.
- `C` is the zero-inclusive logarithmic count function.
- `V` is the linear goalpost function.

### Dimensions

| Dimension | Weight | Calculation |
| --- | ---: | --- |
| Economy `E` | 30% | `L(GNI per capita, PPP; 1,000, 80,000)` |
| Knowledge `K` | 30% | `0.40C(PCT; 100,000) + 0.40C(Nature Share; 50,000) + 0.20C(HCR; 3,000)` |
| Health `H` | 20% | `V(life expectancy; 20, 85)` |
| Infrastructure `F` | 20% | Mean of electricity, internet use, LPI, and basic drinking-water scores |

Infrastructure indicators are normalized as follows:

```text
Electricity = L(kWh per person; 500, 10,000)
Internet    = Internet-use percentage
LPI         = V(Logistics Performance Index; 1, 5)
Water       = Population using at least basic drinking-water services (%)
```

## Resource-dependence adjustment

The adjustment applies to economies with a high non-renewable resource-rent share and a knowledge score below 60.

`N` is the mean non-renewable resource-rent share of GDP for 2017–2021:

```text
N = mean(total natural resource rents - forest rents)
```

With `N` expressed in percentage points:

```text
X = max(N - 10, 0) / 100
T = [max(60 - K, 0) / 60]²
P = 0.30E × X × T
```

`P` is zero when `N ≤ 10` or `K ≥ 60`. The current snapshot applies the adjustment to 24 countries.

## Data selection

- Target-year observations are used when available; otherwise the latest available observation is used and its actual year is retained.
- UNSD 2022 electricity data are used where the World Bank series has no country value.
- The PCT, Nature Index, and Highly Cited Researchers source tables contain all reported positive country values; countries absent from those tables are recorded as zero.
- Dimension scores are calculated independently. Missing data in one dimension do not remove a country from another dimension ranking.

## Sources

- [World Bank World Development Indicators](https://data.worldbank.org/): GNI per capita, life expectancy, electricity use, internet use, logistics performance, drinking-water services, and resource rents
- [WIPO Statistics Database](https://www.wipo.int/edocs/statistics-country-profile/en/_list/l5.pdf): 2024 PCT applications by country of origin
- [Nature Index 2025 Research Leaders](https://www.nature.com/nature-index/research-leaders/2025/country/all/global): 2024 country Share
- [Clarivate Highly Cited Researchers](https://clarivate.com/highly-cited-researchers/): 2025 country counts
- [UNSD Energy Statistics Pocketbook](https://desapublications.un.org/file/21030/download): 2022 electricity use per capita
- [World Bank Logistics Performance Index](https://lpi.worldbank.org/): 2023 and earlier LPI editions
- [United Nations member-state records](https://www.un.org/about-us/member-states): country scope

## Project structure

```text
index.html                       Application shell
css/styles.css                   Responsive interface
js/app.js                        Views and interaction
js/calculator.js                 CDI calculations
js/data.js                       Indicator metadata and sources
data/processed/                  Browser-ready country data
data/raw/                        Source files
data/audit/                      Coverage audit outputs
scripts/                         Data update and audit scripts
tests/calculator.test.js         Formula and dataset tests
```

## Run locally

```powershell
npx --yes serve .
```

Open the local URL printed by the command.

## Test

```powershell
npm test
```

## Update the dataset

```powershell
python scripts/audit_global_coverage.py
node scripts/update_resource_rents.mjs
```
