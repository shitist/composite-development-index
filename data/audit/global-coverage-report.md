# CDI 全球数据覆盖审计

- 审计日期：2026-09-21
- 主口径：195 个国家（193 个联合国会员国 + 圣座 + 巴勒斯坦国）。
- 扩展口径：219 个国家、经济体或属地（世界银行 217 个条目，另加入台湾和梵蒂冈）。
- 基础分公式版本：CDI 1.0；应用层公式版本：CDI 1.1。
- 本报告审计九项基础指标；资源依赖修正数据由 `scripts/update_resource_rents.mjs` 单独生成。

## 195 国主口径的计算资格

- 全部为直接观测：49
- 含旧年份替代值或推定零、仍可计算：107
- 至少一项必要数据缺失、不计算总分：39

## 195 国主口径的各指标覆盖

| 指标 | 可用 | 缺失 | 状态构成 |
|---|---:|---:|---|
| gni | 186 | 9 | missing=9, observed=184, substituted_older_year=2 |
| pct | 195 | 0 | inferred_zero=74, observed=121 |
| nature | 195 | 0 | inferred_zero=13, observed=182 |
| hcr | 195 | 0 | inferred_zero=140, observed=55 |
| life | 194 | 1 | missing=1, observed=194 |
| electricity | 192 | 3 | missing=3, observed=145, substituted_alternative_source=46, substituted_older_year=1 |
| internet | 187 | 8 | missing=8, observed=180, substituted_older_year=7 |
| lpi | 167 | 28 | missing=28, observed=137, substituted_older_year=30 |
| water | 187 | 8 | missing=8, observed=183, substituted_older_year=4 |

## 导致无法计算的缺失项

- lpi: 28 个国家/经济体
- gni: 9 个国家/经济体
- water: 8 个国家/经济体
- internet: 8 个国家/经济体
- electricity: 3 个国家/经济体
- life: 1 个国家/经济体

## 使用规则

1. 世界银行连续指标优先采用目标年份。GNI 与寿命最多回退两年；互联网与基础饮水最多回退五年；全部标记 `substituted_older_year`。
2. LPI 以 2023 版为目标。WDI API 将该版记录在 2022 调查年；缺失时允许采用该国最后一个 2014-2018 年 LPI 1.0 官方值，并明确显示年份。更早数据不采用。
3. 世界银行人均用电缺失时，使用联合国统计司 2022 年人均电力消费作为替代来源，标记 `substituted_alternative_source`。两来源 2022 年重叠样本的中位绝对差见下方质量检查。
4. Nature Index 区域表列到极低的非零 Share。未出现在任何区域表中的经济体记为 `inferred_zero`，不是直接观测。
5. Clarivate 当前名单的国家/地区筛选项覆盖所有有名单记录的地区。筛选项中不存在的经济体记为 `inferred_zero`。
6. PCT 采用 WIPO Statistics Database 的当前 2024 Fact Sheet（来源更新 7/2026），不用旧 Yearly Review 工作簿中的初步估计。正值国家完整排名表之外的国家记为 `inferred_zero`。
7. 不允许用不同含义的指标替代 PCT、Nature、HCR 或 LPI。仍有缺失项时不计算 CDI。

## 替代来源质量检查

- 世界银行与 UNSD 2022 年人均用电重叠样本：149 个经济体。
- 中位绝对百分比差：8.1%；90 分位绝对差：19.1%。
- 因定义和编制方法并非完全相同，UNSD 值只用于 WDI 缺失项，且不会被标成世界银行观测值。

## 名称映射检查

- 联合国会员国未匹配名称：无
- WIPO 未匹配且有数值的名称：无
- UNSD 人均用电未匹配名称：Falkland Islands (Malvinas), Other Asia, Saint Martin (French Part)
- Nature Index 未匹配名称：French Guiana
- Clarivate 未匹配名称：无
- 超出合理范围并转为缺失的值：无

## 输出

- `data/processed/global-cdi-coverage.csv`：覆盖审计宽表。
- `data/processed/global-cdi-coverage.json`：后续网页使用的带状态数据。
- `data/raw/`：下载或解析后的源数据快照。
