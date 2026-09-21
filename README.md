# CDI · 综合发展指数

一个可直接部署到 GitHub Pages 的静态 PWA，用于查询、比较和复算综合发展指数（CDI）。

## 当前 v1

- 195 国查询范围（193 个联合国会员国 + 圣座 + 巴勒斯坦国）
- 156 国可计算 CDI，39 国明确显示数据不足
- 国家详情与九项原始数据
- 中文、English 完整界面，可通过页头切换
- 国家下拉选择，中英文版均默认显示美国
- 2–5 国同尺比较
- 总分及一级维度排名
- 非可再生资源租金超过 GDP 10% 且科研得分低于 60 时，按连续公式修正 CDI
- 完整公式、上下限、实际年份、来源与数据状态
- 区分直接值、旧年份、替代来源、推定零和缺失
- 响应式手机布局与 PWA 清单
- 离线应用壳缓存

## 本地查看

浏览器的 ES Modules 与 Service Worker 需要通过 HTTP 运行：

```powershell
npx --yes serve .
```

然后打开终端显示的本地网址。

## 运行测试

```powershell
npm test
```

测试会检查标准化边界、缺失值规则、195 国口径、双语元数据，以及所有可计算国家的浏览器端结果是否与数据审计结果一致。

## 更新数据

数据审计与快照生成脚本：

```powershell
python scripts/audit_global_coverage.py
node scripts/update_resource_rents.mjs
```

脚本会更新 `data/raw/`、`data/processed/` 和 `data/audit/`。运行脚本需要 Python、pandas、lxml、openpyxl、pypdf 和 pdfplumber。

## 发布到 GitHub Pages

1. 把整个目录提交到 GitHub 仓库的默认分支。
2. 打开仓库的 `Settings → Pages`。
3. 在 `Build and deployment` 中选择 `Deploy from a branch`。
4. 选择默认分支和 `/(root)`，保存。

GitHub Pages 会把同一套页面发布到桌面和手机。手机浏览器访问后，可通过浏览器菜单“添加到主屏幕”。

## 数据与方法

当前快照编号：`cdi-2024-v1.1-20260921-global`。资源依赖修正采用世界银行 2017—2021 年数据，以总自然资源租金减去森林租金得到非可再生资源租金；五年平均值不超过 GDP 10% 时不修正，超过后只计算高于 10% 的部分。
