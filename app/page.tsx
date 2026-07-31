"use client";

import { useEffect, useMemo, useState } from "react";

type Note = {
  title: string;
  subtitle: string;
  category: "Core";
  date: string;
  read: string;
  tone: "mint" | "sun" | "coral";
  symbol: string;
  description: string;
};

const notes: Note[] = [
  {
    title: "DDPM",
    subtitle: "Denoising diffusion probabilistic models",
    category: "Core",
    date: "24 JUN 2025",
    read: "12 min read",
    tone: "mint",
    symbol: "01",
    description: "从加噪到去噪，把一张数据分布的生成过程拆成一串可学习、可解释的步骤。",
  },
  {
    title: "Score matching",
    subtitle: "Score-based models & score matching",
    category: "Core",
    date: "02 JUL 2025",
    read: "15 min read",
    tone: "sun",
    symbol: "02",
    description: "不直接拟合密度，而是学习 log-density 的梯度：一支从能量函数通往采样的路线。",
  },
  {
    title: "Flow matching",
    subtitle: "Flow models & flow matching",
    category: "Core",
    date: "20 JUL 2025",
    read: "11 min read",
    tone: "coral",
    symbol: "03",
    description: "用一个时间依赖的向量场把噪声搬运到数据，让生成过程更像一条可以追踪的路径。",
  },
];

const tabs = ["All notes", "Core three"];

const noteSnapshots = [
  {
    key: "DDPM",
    eyebrow: "A probabilistic view",
    title: "Add noise. Learn to undo it.",
    body: "DDPM 先把真实数据逐步推向高斯噪声，再训练网络预测每一步应该去掉的噪声。训练时可以从 x₀ 直接跳到任意 xₜ，采样时则从纯噪声逐步反向生成。",
    formula: "xₜ = √ᾱₜ x₀ + √(1 − ᾱₜ) ε",
    accent: "mint",
  },
  {
    key: "Score matching",
    eyebrow: "A geometric view",
    title: "Follow the direction of higher density.",
    body: "Score 是 log p(x) 的梯度，指向数据密度上升最快的方向。Score matching 绕开未知密度本身，学习这个向量场，再用 Langevin dynamics 或 SDE 走回数据分布。",
    formula: "sθ(x) ≈ ∇ₓ log p(x)",
    accent: "sun",
  },
  {
    key: "Flow matching",
    eyebrow: "A transport view",
    title: "Turn generation into a moving field.",
    body: "Flow matching 直接学习一个随时间变化的速度场，让样本从噪声分布沿着 ODE 轨迹抵达数据分布；关键是把难以计算的边际路径，改写成可监督的条件路径。",
    formula: "dψₜ(x) / dt = uₜ(ψₜ(x))",
    accent: "coral",
  },
];

const summaryFormulas: Record<string, string> = {
  DDPM: String.raw`x_t = \sqrt{\bar{\alpha}_t}\,x_0 + \sqrt{1-\bar{\alpha}_t}\,\epsilon`,
  "Score matching": String.raw`s_\theta(\mathbf{x}) \approx \nabla_{\mathbf{x}}\log p(\mathbf{x})`,
  "Flow matching": String.raw`\frac{\mathrm{d}}{\mathrm{d}t}\psi_t(\mathbf{x}) = u_t\!\left(\psi_t(\mathbf{x})\right)`,
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("All notes");
  const [activeSnapshot, setActiveSnapshot] = useState("DDPM");

  const filteredNotes = useMemo(
    () => (activeTab === "All notes" ? notes : notes.filter((note) => note.category === "Core")),
    [activeTab],
  );
  const snapshot = noteSnapshots.find((item) => item.key === activeSnapshot) ?? noteSnapshots[0];

  useEffect(() => {
    const formula = document.querySelector(".formula-display");
    const mathJax = (window as typeof window & {
      MathJax?: { typesetPromise?: (elements?: Element[]) => Promise<void> };
    }).MathJax;
    if (!formula || !mathJax?.typesetPromise) return;

    const frame = window.requestAnimationFrame(() => {
      mathJax.typesetPromise?.([formula]).catch(() => undefined);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeSnapshot]);

  return (
    <main>
      <nav className="site-nav shell" aria-label="主导航">
        <a className="brand" href="#top" aria-label="Generative Model Notes 首页">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span>GENERATIVE MODEL NOTES</span>
        </a>
        <div className="nav-links">
          <a href="#notes">Notes</a>
          <a href="#map">The map</a>
          <a href="#about">About</a>
        </div>
        <a className="nav-cta" href="https://github.com/SignsJun/knowledge-maps" target="_blank" rel="noreferrer">Open repository <span aria-hidden="true">→</span></a>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> LEARNING IN PUBLIC / 01</p>
          <h1>Generative<br /><em>models</em><span className="period">.</span></h1>
          <p className="hero-intro">把复杂的生成模型，拆成可以复习、可以复现，也可以分享的路径。</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#notes">Explore notes <span aria-hidden="true">→</span></a>
            <a className="text-link" href="#about">What is this? <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <div className="hero-visual" aria-label="生成模型从噪声走向结构的抽象图" role="img">
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
          {notes.map((note) => (
            <a className={`core-card ${note.tone}`} key={note.title} href={`./notes/${note.title === "DDPM" ? "ddpm" : note.title === "Score matching" ? "score-matching" : "flow-matching"}/`}>
              <span className="card-top"><span>{note.symbol}</span><span>OPEN NOTE →</span></span>
              <span className="card-icon" aria-hidden="true">{note.title === "DDPM" ? "◌" : note.title === "Score matching" ? "∇" : "→"}</span>
              <span className="card-title">{note.title}</span>
              <span className="card-subtitle">{note.subtitle}</span>
              <span className="card-description">{note.description}</span>
              <span className="card-footer"><span>{note.date}</span><span>{note.read}</span></span>
            </a>
          ))}
        </div>
      </section>

      <section className="snapshot shell" aria-live="polite">
        <div className="snapshot-tabs" role="tablist" aria-label="笔记摘要">
          {noteSnapshots.map((item) => (
            <button className={activeSnapshot === item.key ? "active" : ""} key={item.key} onClick={() => setActiveSnapshot(item.key)} role="tab" aria-selected={activeSnapshot === item.key}>
              <span>{item.key}</span><span aria-hidden="true">→</span>
            </button>
          ))}
        </div>
        <div className={`snapshot-body ${snapshot.accent}`}>
          <div>
            <p className="section-label">{snapshot.eyebrow}</p>
            <h2>{snapshot.title}</h2>
            <p>{snapshot.body}</p>
          </div>
          <div className="formula-card" aria-live="polite">
            <span className="formula-label">THE SHORT VERSION</span>
            <div key={snapshot.key} className="formula-display" aria-label={`${snapshot.key} summary formula`}>
              {`\\[${summaryFormulas[snapshot.key]}\\]`}
            </div>
            <small className="formula-note">intuition → objective → sampler</small>
          </div>
        </div>
      </section>

      <section className="map-section shell" id="map">
        <div className="section-heading map-heading">
          <div>
            <p className="section-label">THE LEARNING MAP / GENERATIVE MODELS</p>
            <h2>从噪声<br /><em>走向数据。</em></h2>
          </div>
          <p className="heading-note">从逐步去噪，到学习 score field，<br />再用 ODE 连续搬运分布。</p>
        </div>
        <div className="map-list">
          <div className="map-line" aria-hidden="true" />
          <article className="map-item">
            <span className="map-dot mint" />
            <div className="map-index">01</div>
            <div><p className="map-kicker">DIFFUSION</p><h3>先把数据分解成噪声</h3><p>Forward process · reverse denoising · ELBO</p></div>
            <span className="map-status">01 / 03</span>
          </article>
          <article className="map-item highlighted">
            <span className="map-dot coral" />
            <div className="map-index">02</div>
            <div><p className="map-kicker">SCORE FIELD</p><h3>再学习局部的方向</h3><p>Score function · DSM · NCSN · Langevin</p></div>
            <span className="map-status">02 / 03</span>
          </article>
          <article className="map-item">
            <span className="map-dot blue" />
            <div className="map-index">03</div>
            <div><p className="map-kicker">CONTINUOUS TRANSPORT</p><h3>最后用 ODE 搬运分布</h3><p>Conditional path · CFM · velocity field · ODE</p></div>
            <span className="map-status">03 / 03</span>
          </article>
        </div>
      </section>

      <section className="index-section shell">
        <div className="section-heading index-heading">
          <div><p className="section-label">ALL NOTES / INDEX</p><h2>Keep exploring</h2></div>
          <span className="section-count">03 notes</span>
        </div>
        <div className="filter-row" role="tablist" aria-label="笔记筛选">
          {tabs.map((tab) => <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{tab}</button>)}
        </div>
        <div className="notes-table">
          {filteredNotes.map((note, index) => (
            <article className="note-row" key={note.title}>
              <span className={`note-number ${note.tone}`}>{String(index + 1).padStart(2, "0")}</span>
              <div className="note-main"><h3>{note.title}</h3><p>{note.subtitle}</p></div>
              <span className="note-category core">{note.category}</span>
              <span className="note-date">{note.date}</span>
              <span className="note-read">{note.read}</span>
              <a className="row-arrow" href={`./notes/${note.title === "DDPM" ? "ddpm" : note.title === "Score matching" ? "score-matching" : "flow-matching"}/`} aria-label={`打开 ${note.title}`}>→</a>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer shell"><span>GENERATIVE MODEL NOTES / 2025—∞</span><span>made to be read, remixed, and shared.</span><a href="#top">back to top ↑</a></footer>
    </main>
  );
}
