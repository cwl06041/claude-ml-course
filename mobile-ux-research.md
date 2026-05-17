# 手机端长文学习页面 UX 调研记录

调研日期：2026-05-17。背景：本项目三份课程是单文件 HTML 长文（含 KaTeX 公式 + SVG + 互动滑块），需要优化手机阅读体验。

## 核心原则

| 原则 | 来源 / 数据 | 对本项目的启示 |
|---|---|---|
| 拇指可达区 | 49% 用户单手单拇指操作，可达区是屏幕**底部三分之一** | 关键操作（目录入口）放右下而不是顶部 |
| 进度条 | 长文必备，告诉读者"还剩多少" | 顶部 3px 细线 sticky |
| 抽屉（Drawer） | Material Design / iOS 标准模式 | 目录从右侧滑出，不占阅读空间 |
| 顺序导航 | 底部 "Previous / Next" 比"回目录再点"体验好 | 可选升级 |
| 段落短 + 留白多 | 长文必备 | 已做到 |

## 业界标杆

| 产品 | 手机端做法 | 借鉴价值 |
|---|---|---|
| **MkDocs Material** | 左上汉堡 → 抽屉侧栏；底部 Previous/Next | 抽屉 + 底部翻页是黄金组合 |
| **VitePress** | 左上汉堡 → 抽屉；右侧"On this page"双层 TOC | 大章 + 小节双层导航 |
| **Distill.pub** | 学术长文 + 浮动 TOC，移动端折叠为抽屉 | 内容形态最接近本项目（数学+SVG），但项目已停止维护（2021-） |
| **Khan Academy** | 拆短页 —— 每个小节独立页 | 反方向选择 |
| **Medium** | 顶部 3px 进度条 + 滚动隐藏顶栏 | 进度条做法最实用 |

## 候选方案对比

| 方案 | 工作量 | 收益 | 维护成本 |
|---|---|---|---|
| **A 单 HTML + FAB 抽屉 + 进度条** | 30 分钟 | 解决"目录在手机不好用" | 0 |
| **B 迁移到 MkDocs Material** | 3-6 小时 | 完整文档站（搜索、暗色、双层目录） | 引入 Python 构建链 |
| **C 借 Distill template 的 CSS** | 1 小时 | 视觉接近 Distill | 上游项目已死 |

**本项目决定**：方案 A。理由：

1. 课程只有 3 份，单 HTML 的"双击即开 / 零构建 / 零依赖部署"优势大于多页站
2. 待内容长到 10+ 章节或需要搜索/版本管理时再考虑迁移 B
3. C 方案有上游死活风险

## 方案 A 的具体实现

1. **顶部进度条**：`position: fixed; top:0; height:3px`，宽度按 `scrollY / (scrollHeight - innerHeight)` 实时更新
2. **右下 FAB**：圆形按钮，`position: fixed; bottom:20px; right:20px`，点击呼出抽屉
3. **抽屉**：从右滑入，宽 280px，含半透明遮罩
4. **桌面 ≥1280px**：FAB 隐藏（因为已有右侧固定竖栏）；进度条保留
5. **顶部 sticky 卡片网格**保留 —— 首屏让用户先看到章节概览，滚动后 FAB 接管

## 参考资料

- [Mobile Navigation UX Best Practices](https://www.designstudiouiux.com/blog/mobile-navigation-ux/)
- [Mobile UX Design Guide 2025](https://www.webstacks.com/blog/mobile-ux-design)
- [Navigation for documentation sites](https://idratherbewriting.com/files/doc-navigation-wtd/design-principles-for-doc-navigation/)
- [5 UX Design Tips for Long-Form Content](https://www.thecreativemomentum.com/blog/5-ux-design-tips-to-maximize-long-form-content)
- [Reading Position Indicator (CSS-Tricks)](https://css-tricks.com/reading-position-indicator/)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- [Distill: How to Create a Distill Article](https://distill.pub/guide/)
- [Documentation Generator Comparison 2025](https://okidoki.dev/documentation-generator-comparison)
