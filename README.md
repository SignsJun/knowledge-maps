# Generative Model Notes

这是一个公开分享生成模型学习笔记的网站，目前只保留三条主线：

- DDPM：从逐步加噪到逐步去噪
- Score-based models：学习 `∇ₓ log p(x)`，沿着数据密度上升的方向采样
- Flow matching：学习把噪声搬运到数据的时间依赖向量场

网站首页位于 `app/page.tsx`，三篇可阅读的网页笔记位于：

```text
app/notes/[slug]/page.tsx
├── /notes/ddpm/
├── /notes/score-matching/
└── /notes/flow-matching/
```

`notes/` 目录保留了从 Notion 整理出的 Markdown 备份，但访客从首页卡片进入的是排版后的网页版本，不需要直接阅读 Markdown。

## 本地预览

```bash
npm install
npm run dev
```

## 发布

推送到 `main` 后，GitHub Actions 会构建并发布到 GitHub Pages：

https://signsjun.github.io/knowledge-maps/

Notion 原始页面中的临时图片链接没有直接复制到仓库；如果要补图，建议先下载图片，再放进 `public/` 或 `notes/assets/`，避免发布后链接失效。
