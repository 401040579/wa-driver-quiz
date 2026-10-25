# 华盛顿州驾照笔试中文题库 · WA Driver Knowledge Test Practice (Chinese)

**线上地址：<https://401040579.github.io/wa-driver-quiz/>**（GitHub Pages，`main` 分支根目录自动部署，push 即发布）

面向华盛顿州中文考生的免费在线练习题库：313 道选择题，依据华盛顿州牌照厅 (WA DOL) 官方《华盛顿驾驶指南》简体中文版整理，覆盖 16 个章节，标志类题目配有官方指南插图。纯静态单页，无后端、无注册、不上传任何数据。

- 练习模式：答完即时显示讲解
- 模拟考试：按真实规则随机抽 40 题，80% (32 题) 及格
- 错题本：答错自动收录；收藏夹：手动收藏重点题；二者都可单独反复练（保存在本机浏览器 localStorage）
- 快捷键：`1-4` 选答案，`←` `→` 切题
- 选项顺序每次随机打乱，避免背位置

> 免责声明：个人学习项目，非 WA DOL 官方网站，题目并非考试真题；法规与考点以最新版 [《华盛顿驾驶指南》(Washington Driver Guide)](https://dol.wa.gov/driver-licenses-and-permits/driver-training-and-testing/driver-guides) 及 DOL 官方说明为准。

## 文件结构

| 文件 | 说明 |
| --- | --- |
| `index.html` | 主页面：样式、题库数据 (`QUESTIONS`)、内置 SVG 标志、全部交互逻辑 |
| `wa-driver-quiz.html` | `index.html` 的完全相同副本，保留给旧链接；**改动 index.html 后请 `cp index.html wa-driver-quiz.html`** |
| `assets/pdfimg.js` | 67 张官方指南 PNG 插图的 base64 数据 (约 630 KB)，由页面在主脚本之前 `<script src>` 加载 |
| `og.png` / `favicon.svg` / `apple-touch-icon.png` | 分享卡片图 (1200×630)、站点图标 |
| `tools/og-template.html` + `tools/make-images.cjs` | 重新生成 `og.png` 与 `apple-touch-icon.png` 的模板和脚本 |
| `robots.txt` / `sitemap.xml` / `404.html` | 爬虫与站点地图、自定义 404 页 |

## 本地运行

```bash
python3 -m http.server 8747        # 然后打开 http://localhost:8747/
```

直接双击 `index.html` (file://) 也能用——这正是配图数据用 `.js` 而不是 JSON + `fetch()` 的原因（`fetch` 在 file:// 下会被浏览器拦截）。

重新生成分享图（需要任意一份已安装 Chromium 的 playwright）：

```bash
PLAYWRIGHT_MODULE=/path/to/node_modules/playwright node tools/make-images.cjs
```

## SEO 与流量基建（2026-10）

已经做了什么：

- `<head>`：中英双语 `<title>`、`meta description` / `keywords`、`canonical`（两个页面都指向站点根 URL，避免重复内容分散权重）、`theme-color`、SVG favicon、apple-touch-icon
- Open Graph + Twitter `summary_large_image` 卡片，分享图 `og.png`
- JSON-LD：`WebSite` + `Quiz`（`Quiz` 是 schema.org `LearningResource` 的子类型，只用了其现行定义里存在的属性：`learningResourceType`、`educationalUse`、`educationalLevel`、`assesses`、`isAccessibleForFree`、`about`、`isBasedOn`、`audience` 等）
- 首屏下方 `#about` 介绍段落：题库来源、覆盖范围、适用对象、免责声明（给爬虫和用户都看的正文文字）
- `robots.txt`、`sitemap.xml`（首页 + `wa-driver-quiz.html`）、`404.html`
- GA4 占位（见下）
- 把 630 KB 的配图 base64 拆到 `assets/pdfimg.js`，HTML 文档从 791 KB 降到约 150 KB

### 替换 GA4 Measurement ID

仓库里没有现成的 GA 配置，所以页面里放的是占位符 **`G-XXXXXXXXXX`**，占位状态下不会加载 gtag.js、也不会发出任何请求。启用步骤：

1. 在 [Google Analytics](https://analytics.google.com/) 新建 GA4 媒体资源 → 数据流 → 「网站」，填 `https://401040579.github.io/wa-driver-quiz/`，拿到形如 `G-ABC1DEF234` 的 Measurement ID
2. 把 `index.html` 和 `wa-driver-quiz.html` 的 `<head>` 里这一行的占位符换掉（两个文件各一处）：
   ```js
   var id="G-XXXXXXXXXX";
   ```
3. push 后打开线上页面，在 GA「报告 → 实时」里应能看到自己这次访问

### 提交到 Google Search Console / Bing Webmaster（需站长本人操作）

GitHub Pages 项目站点没有自己的域名，不能用 DNS 验证，用「HTML 标记」或「HTML 文件」验证：

**Google Search Console**

1. 打开 <https://search.google.com/search-console> → 添加资源 → 选「**网址前缀**」→ 输入 `https://401040579.github.io/wa-driver-quiz/`
2. 验证：选「HTML 标记」，把它给的 `<meta name="google-site-verification" content="…">` 加进 `index.html` 和 `wa-driver-quiz.html` 的 `<head>`（放在 `<meta charset>` 之后即可）并 push；或选「HTML 文件」，把下载的 `googleXXXX.html` 放到仓库根目录 push。等 Pages 部署完（1–3 分钟）再点「验证」
3. 验证通过后：左侧「站点地图」→ 输入 `sitemap.xml` → 提交
4. 「网址检查」→ 输入首页地址 → 「请求编入索引」（可加速首次收录）

**Bing Webmaster Tools**

1. 打开 <https://www.bing.com/webmasters> → 最省事的是「从 Google Search Console 导入」，一键把已验证的站点和 sitemap 导过去
2. 若手动添加：输入站点 URL → 选 meta 标记验证（同样加到两个 HTML 的 `<head>`）或把 `BingSiteAuth.xml` 放到仓库根目录 → push → 验证 → 「站点地图」里提交 `https://401040579.github.io/wa-driver-quiz/sitemap.xml`

**关于 robots.txt 的说明**：爬虫只读取域名根目录的 `https://401040579.github.io/robots.txt`，本仓库的 `robots.txt` 位于 `/wa-driver-quiz/` 子路径，Google / Bing 不会自动读取它（目前 `401040579.github.io` 根站点不存在，返回 404，这不影响收录——没有 robots.txt 等同于全部允许）。sitemap 以在 Search Console / Bing 里手动提交为准；将来若创建 `401040579.github.io` 用户站点仓库，可把 `Sitemap: https://401040579.github.io/wa-driver-quiz/sitemap.xml` 加进那边的 `robots.txt`。

### Lighthouse SEO 分数

_待填：push 后对线上地址运行 `lighthouse --only-categories=seo`。_

### 题库拆分评估

拆之前 `index.html` 为 791 KB，其中：67 张 PNG 配图的 base64 约 646 KB (82%)，题库文本 `QUESTIONS` 约 113 KB (14%)，内置 SVG 约 15 KB，逻辑约 8 KB。

- **已做**：把配图数据拆到 `assets/pdfimg.js`（页面仍同步加载它，交互和内容完全不变；加了 `typeof` 守卫，数据文件加载失败时标志题退回内置 SVG）。HTML 文档降到约 150 KB，爬虫解析和缓存都更轻。
- **没做、也不建议做**：把题库 `QUESTIONS` 再拆成独立 JSON。只省 14% 体积，却要改成 `fetch()` 异步初始化（file:// 打开会失效、首题出现时机变晚、错题本的题目 ID 依赖题干内容也要跟着处理），收益不抵风险。题目本身在脚本里、一次只渲染一题，拆不拆对 SEO 索引没有区别。
- 总下载量不变（约 790 KB），GitHub Pages 对所有文件只给 `max-age=600`，所以也不要指望长缓存；真正想再减体积，下一步应是把 PNG 配图压缩/转 WebP（目前每张 100–250 px 的小图占 5–18 KB base64，有一倍左右的压缩空间）。

## 维护约定

- `index.html` 是唯一源文件，改完务必同步：`cp index.html wa-driver-quiz.html`
- 新增配图：键名写进题目的 `img` 字段，base64 加进 `assets/pdfimg.js` 的 `PDFIMG` 对象（没有 PNG 的键会落到 `SIGNS` 里的手绘 SVG）
- 改了标题/描述或题目数量，记得同步 `og.png`（改 `tools/og-template.html` 后重新生成）、`sitemap.xml` 的 `lastmod` 和 JSON-LD 的 `dateModified`
