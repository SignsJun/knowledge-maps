# Yifan’s Notes

这是一个用于公开分享生成模型学习笔记的个人主页，当前围绕三条主线展开：

- DDPM：从逐步加噪到逐步去噪
- Score-based models：学习 `∇x log p(x)`，沿着密度上升的方向采样
- Flow matching：学习一个把噪声搬运到数据的时间依赖向量场

主页代码位于 `app/page.tsx`，样式位于 `app/globals.css`，分享预览图位于 `public/og.png`。详细笔记建议放在 `notes/` 中；可以把从 Notion 导出的 Markdown 内容替换进去。

## 从 Notion 到 GitHub

1. 在 Notion 打开一篇笔记，选择右上角 `···` → `Export` → `Markdown & CSV`。
2. 解压导出的文件，把正文 Markdown 和图片资源放到对应的 `notes/` 目录。
3. 用下面的命名方式保持主页索引清晰：

   ```text
   notes/
   ├── ddpm.md
   ├── score-matching.md
   └── flow-matching.md
   ```

4. 将公式、图片、参考文献检查一遍，再提交到 GitHub。不要把 Notion 私密链接、API token 或个人信息一起导出。

## 推送到自己的 GitHub 仓库

先在 GitHub 创建一个公开仓库，例如 `generative-model-notes`，然后在本地项目目录运行：

```bash
git add .
git commit -m "build public generative model notes homepage"
git remote add origin https://github.com/<你的用户名>/generative-model-notes.git
git push -u origin main
```

如果你想做 GitHub 个人主页，再额外创建一个名字与用户名完全相同的仓库，例如 `<你的用户名>/<你的用户名>`，把主页介绍和 `generative-model-notes` 的链接放进该仓库的 `README.md`。

这里要区分两种“GitHub 主页”：

- **仓库主页**：把这个项目推送到 GitHub 后，`README.md`、`notes/` 和源码就可以直接公开分享。
- **网页主页**：如果你想要 `https://<你的用户名>.github.io` 这样的独立网站，需要额外配置 GitHub Pages 的静态导出与 Actions。本项目当前使用 Vinext/Cloudflare 运行时，适合先作为仓库主页和网站源码；确定仓库名后再补 Pages 发布工作流即可。

## 本地预览

```bash
npm install
npm run dev
```

浏览器打开终端显示的本地地址即可。提交前可以运行：

```bash
npm run build
npm run lint
```

## 建议的每篇笔记结构

```markdown
# DDPM

> 一句话：它解决了什么问题？

## 1. Intuition
## 2. Forward process
## 3. Reverse process
## 4. Training objective
## 5. Sampling
## 6. My takeaways
## References
```

先把“直觉 → 数学目标 → 算法流程 → 自己的理解”讲清楚，再补代码和论文链接，会比直接贴 Notion 页面更适合公开阅读。
