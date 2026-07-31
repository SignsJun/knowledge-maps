"use client";

import { useMemo, useState } from "react";

type Note = {
  title: string;
  subtitle: string;
  category: "Core" | "Foundations" | "Frontiers";
  date: string;
  read: string;
  tone: string;
  symbol: string;
  description: string;
};

const coreNotes: Note[] = [
  {
    title: "DDPM",
    subtitle: "Denoising diffusion probabilistic models",
    category: "Core",
    date: "24 JUN 2025",
    read: "12 min read",
    tone: "mint",
    symbol: "01",
    description:
      "从加噪到去噪，把一张数据分布的生成过程拆成一串可学习、可解释的步骤。",
  },
  {
    title: "Score matching",
    subtitle: "Score-based models & score matching",
    category: "Core",
    date: "02 JUL 2025",
    read: "15 min read",
    tone: "sun",
    symbol: "02",
    description:
      "不直接拟合密度，而是学习 log-density 的梯度：一支从能量函数通往采样的路线。",
  },
  {
    title: "Flow matching",
    subtitle: "Flow models & flow matching",
    category: "Core",
    date: "20 JUL 2025",
    read: "11 min read",
    tone: "coral",
    symbol: "03",
    description:
      "用一个时间依赖的向量场把噪声搬运到数据，让生成过程更像一条可以追踪的路径。",
  },
];

const notes: Note[] = [
  ...coreNotes,
  {
    title: "Positional Encoding",
    subtitle: "How sequence models remember order",
    category: "Foundations",
    date: "22 JUN 2025",
    read: "8 min read",
    tone: "lavender",
    symbol: "04",
    description: "从正弦位置编码到可学习表示，为后续的 Transformer 笔记补上直觉。",
  },
  {
    title: "Swin-Transformer",
    subtitle: "Hierarchical vision transformers",
    category: "Foundations",
    date: "—",
    read: "9 min read",
    tone: "lavender",
    symbol: "05",
    description: "窗口注意力、层级结构，以及视觉 Transformer 如何把局部建模做得高效。",
  },
  {
    title: "ResShift",
    subtitle: "Residual shifting for image restoration",
    category: "Frontiers",
    date: "—",
    read: "10 min read",
    tone: "blue",
    symbol: "06",
    description: "围绕图像复原任务，记录残差空间与扩散建模之间的连接。",
  },
  {
    title: "Physics-informed diffusion",
    subtitle: "Priors, dynamics, and inverse problems",
    category: "Frontiers",
    date: "—",
    read: "13 min read",
    tone: "blue",
    symbol: "07",
    description: "把物理约束放进生成过程，思考模型如何尊重已知的世界规律。",
  },
  {
    title: "Rectified Flow",
    subtitle: "Straightening the transport path",
    category: "Frontiers",
    date: "—",
    read: "10 min read",
    tone: "blue",
    symbol: "08",
    description: "从 flow matching 继续向前：更直的轨迹、更少的函数评估与更快的采样。",
  },
  {
    title: "MeanFlow",
    subtitle: "Learning average velocity fields",
    category: "Frontiers",
    date: "—",
    read: "10 min read",
    tone: "blue",
    symbol: "09",
    description: "记录一条关于平均速度场的探索，和前面几种 flow 观点互相对照。",
  },
];

const tabs = ["All notes", "Core three", "Foundations", "Frontiers"];

const noteSnapshots = [
  {
    key: "DDPM",
    eyebrow: "A probabilistic view",
    title: "Add noise. Learn to undo it.",
    body: "DDPM 把正向过程定义成逐步加高斯噪声，再训练一个网络预测每一步该如何还原。最重要的直觉是：模型不需要一次性猜出整张图，只需要学会每一个局部去噪动作。",
    formula: "xₜ = √ᾱₜ x₀ + √(1 − ᾱₜ) ε",
    accent: "mint",
  },
  {
    key: "Score matching",
    eyebrow: "A geometric view",
    title: "Follow the direction of higher density.",
    body: "Score 是 log p(x) 的梯度，指向数据密度上升最快的方向。学习 score function 后，可以借助 Langevin dynamics 或 SDE 在空间中逐步走回数据流形。",
    formula: "sθ(x) ≈ ∇ₓ log p(x)",
    accent: "sun",
  },
  {
    key: "Flow matching",
    eyebrow: "A transport view",
    title: "Turn generation into a moving field.",
    body: "Flow matching 不再显式模拟扩散，而是直接监督一个时间相关的速度场。采样时从噪声出发，沿着常微分方程的轨迹抵达数据分布。",
    formula: "dx / dt = vθ(xₜ, t)",
    accent: "coral",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("All notes");
  const [activeSnapshot, setActiveSnapshot] = useState("DDPM");

  const filteredNotes = useMemo(() => {
    if (activeTab === "All notes") return notes;
    const category = activeTab === "Core three" ? "Core" : activeTab;
    return notes.filter((note) => note.category === category);
  }, [activeTab]);

  const snapshot = noteSnapshots.find((item) => item.key === activeSnapshot) ?? noteSnapshots[0];

  return (
    <main>
      <nav className="site-nav shell" aria-label="主导航">
        <a className="brand" href="#top" aria-label="Generative Model Notes 首页">
          <span className="brand-mark" aria-hidden="true">✣</span>
          <span>YIFAN’S NOTES</span>
        </a>
        <div className="nav-links">
          <a href="#notes">Notes</a>
          <a href="#map">The map</a>
          <a href="#about">About</a>
        </div>
        <a className="nav-cta" href="#publish">Read on GitHub <span aria-hidden="true">↗</span></a>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> LEARNING IN PUBLIC / 01</p>
          <h1>Generative<br /><em>models</em><span className="period">.</span></h1>
          <p className="hero-intro">把复杂的生成模型，拆成可以复习、可以复现，也可以分享的路径。</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#notes">Explore notes <span aria-hidden="true">↓</span></a>
            <a className="text-link" href="#about">What is this? <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <div className="hero-visual" aria-label="生成模型学习路径抽象图" role="img">
          <div className="visual-grid" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="visual-node node-a">x₀</div>
          <div className="visual-node node-b">xₜ</div>
          <div className="visual-node node-c">ε</div>
          <div className="visual-arrow arrow-one">→</div>
          <div className="visual-arrow arrow-two">→</div>
          <span className="visual-caption caption-top">noise</span>
          <span className="visual-caption caption-bottom">structure</span>
          <div className="visual-note"><span>FIELD NOTE</span><strong>from noise<br />to structure</strong></div>
        </div>
      </section>

      <section className="intro-strip shell" id="about">
        <p className="section-label">WHY THESE NOTES</p>
        <div className="intro-content">
          <h2>One family.<br /><span>Three ways in.</span></h2>
          <div className="intro-text">
            <p>扩散模型、score-based model、flow matching 看起来像三套语言，其实都在回答同一个问题：</p>
            <p className="question">“如何把一个简单的分布，变成我们想要的数据？”</p>
          </div>
        </div>
      </section>

      <section className="core-section shell" id="notes">
        <div className="section-heading">
          <div>
            <p className="section-label">START HERE / 3 NOTES</p>
            <h2>The core three</h2>
          </div>
          <span className="section-count">01 — 03</span>
        </div>
        <div className="core-grid">
          {coreNotes.map((note) => (
            <button className={`core-card ${note.tone}`} key={note.title} onClick={() => setActiveSnapshot(note.title === "Score matching" ? "Score matching" : note.title === "Flow matching" ? "Flow matching" : "DDPM")}>
              <span className="card-top"><span>{note.symbol}</span><span>OPEN NOTE ↗</span></span>
              <span className="card-icon" aria-hidden="true">{note.title === "DDPM" ? "◌" : note.title === "Score matching" ? "∇" : "→"}</span>
              <span className="card-title">{note.title}</span>
              <span className="card-subtitle">{note.subtitle}</span>
              <span className="card-description">{note.description}</span>
              <span className="card-footer"><span>{note.date}</span><span>{note.read}</span></span>
            </button>
          ))}
        </div>
      </section>

      <section className="snapshot shell" aria-live="polite">
        <div className="snapshot-tabs" role="tablist" aria-label="笔记摘要">
          {noteSnapshots.map((item) => (
            <button className={activeSnapshot === item.key ? "active" : ""} key={item.key} onClick={() => setActiveSnapshot(item.key)} role="tab" aria-selected={activeSnapshot === item.key}>
              <span>{item.key}</span><span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div className={`snapshot-body ${snapshot.accent}`}>
          <div>
            <p className="section-label">{snapshot.eyebrow}</p>
            <h2>{snapshot.title}</h2>
            <p>{snapshot.body}</p>
          </div>
          <div className="formula-card"><span>THE SHORT VERSION</span><strong>{snapshot.formula}</strong><small>intuition → objective → sampler</small></div>
        </div>
      </section>

      <section className="map-section shell" id="map">
        <div className="section-heading map-heading">
          <div>
            <p className="section-label">THE LEARNING MAP</p>
            <h2>Follow the thread</h2>
          </div>
          <p className="heading-note">A path from foundations<br />to active questions.</p>
        </div>
        <div className="map-list">
          <div className="map-line" aria-hidden="true" />
          <article className="map-item">
            <span className="map-dot mint" />
            <div className="map-index">01</div>
            <div><p className="map-kicker">FOUNDATION</p><h3>Represent the world</h3><p>Positional Encoding · Swin-Transformer</p></div>
            <span className="map-status">2 notes</span>
          </article>
          <article className="map-item highlighted">
            <span className="map-dot coral" />
            <div className="map-index">02</div>
            <div><p className="map-kicker">CORE IDEA</p><h3>Learn to generate</h3><p>DDPM · Score Matching · Flow Matching</p></div>
            <span className="map-status">3 notes</span>
          </article>
          <article className="map-item">
            <span className="map-dot blue" />
            <div className="map-index">03</div>
            <div><p className="map-kicker">OPEN ENDS</p><h3>Push the boundary</h3><p>Rectified Flow · MeanFlow · Physics-informed models</p></div>
            <span className="map-status">4 notes</span>
          </article>
        </div>
      </section>

      <section className="index-section shell">
        <div className="section-heading index-heading">
          <div><p className="section-label">ALL NOTES / INDEX</p><h2>Keep exploring</h2></div>
          <span className="section-count">09 notes</span>
        </div>
        <div className="filter-row" role="tablist" aria-label="笔记筛选">
          {tabs.map((tab) => <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{tab}</button>)}
        </div>
        <div className="notes-table">
          {filteredNotes.map((note, index) => (
            <article className="note-row" key={note.title}>
              <span className={`note-number ${note.tone}`}>{String(index + 1).padStart(2, "0")}</span>
              <div className="note-main"><h3>{note.title}</h3><p>{note.subtitle}</p></div>
              <span className={`note-category ${note.category.toLowerCase()}`}>{note.category}</span>
              <span className="note-date">{note.date}</span>
              <span className="note-read">{note.read}</span>
              <button className="row-arrow" onClick={() => setActiveSnapshot(note.title === "Score matching" ? "Score matching" : note.title === "Flow matching" ? "Flow matching" : "DDPM")} aria-label={`打开 ${note.title}`}>↗</button>
            </article>
          ))}
        </div>
      </section>

      <section className="publish-section shell" id="publish">
        <div className="publish-card">
          <div className="publish-copy"><p className="section-label">NEXT STEP / PUBLISH</p><h2>From Notion<br /><em>to the open web.</em></h2><p>把一篇笔记导出成 Markdown，放进 GitHub 仓库；之后每次更新，主页都能留下你的学习轨迹。</p><a className="button button-light" href="https://github.com" target="_blank" rel="noreferrer">Create a repository <span aria-hidden="true">↗</span></a></div>
          <div className="publish-flow" aria-label="Notion 到 GitHub Pages 的发布流程">
            <div><span className="flow-icon notion">N</span><small>write</small><strong>Notion</strong></div>
            <span className="flow-arrow">→</span>
            <div><span className="flow-icon markdown">MD</span><small>export</small><strong>Markdown</strong></div>
            <span className="flow-arrow">→</span>
            <div><span className="flow-icon github">⌘</span><small>share</small><strong>GitHub Pages</strong></div>
          </div>
        </div>
      </section>

      <footer className="site-footer shell"><span>YIFAN’S NOTES / 2025—∞</span><span>made to be read, remixed, and shared.</span><a href="#top">back to top ↑</a></footer>
    </main>
  );
}
