import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { marked } from "marked";

const noteMeta = {
  ddpm: {
    title: "DDPM",
    subtitle: "Denoising diffusion probabilistic models",
    date: "24 JUN 2025",
    tone: "mint",
    eyebrow: "01 / PROBABILISTIC VIEW",
    lead: "从加噪到去噪，把一个难以直接建模的生成问题拆成一串可学习、可解释的步骤。",
    file: "ddpm.md",
  },
  "score-matching": {
    title: "Score matching",
    subtitle: "Score-based models & score matching",
    date: "02 JUL 2025",
    tone: "sun",
    eyebrow: "02 / GEOMETRIC VIEW",
    lead: "不直接拟合未知密度，而是学习 log-density 的梯度：一张指向数据高密度区域的方向地图。",
    file: "score-matching.md",
  },
  "flow-matching": {
    title: "Flow matching",
    subtitle: "Flow models & flow matching",
    date: "20 JUL 2025",
    tone: "coral",
    eyebrow: "03 / TRANSPORT VIEW",
    lead: "学习一个随时间变化的速度场，让样本沿着 ODE 轨迹从噪声分布抵达数据分布。",
    file: "flow-matching.md",
  },
} as const;

type NoteSlug = keyof typeof noteMeta;

export function generateStaticParams() {
  return Object.keys(noteMeta).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!(slug in noteMeta)) return {};
  const note = noteMeta[slug as NoteSlug];
  return {
    title: `${note.title} — Generative Model Notes`,
    description: note.lead,
  };
}

function prepareMath(markdown: string) {
  const inlineMath: string[] = [];
  const registerInlineMath = (formula: string) => {
    const token = `MATHINLINE${inlineMath.length}END`;
    inlineMath.push(`<span class="math-inline">\\(${formula}\\)</span>`);
    return token;
  };

  const prepared = markdown
    .replace(/^### /gm, "#### ")
    .replace(/^## /gm, "### ")
    .replace(/^# /gm, "## ")
    .replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, (_, formula: string) => `\n<div class="math-block">\\[\n${formula.trim()}\n\\]</div>\n`)
    .replace(/\\\(([^\n]*?)\\\)/g, (_, formula: string) => registerInlineMath(formula))
    .replace(/\$([^$\n]+)\$/g, (_, formula: string) => registerInlineMath(formula));

  return { markdown: prepared, inlineMath };
}

async function renderNote(markdownFile: string) {
  const markdown = await readFile(path.join(process.cwd(), "notes", markdownFile), "utf8");
  const { markdown: preparedMarkdown, inlineMath } = prepareMath(markdown);
  const rendered = marked.parse(preparedMarkdown, { gfm: true, breaks: true });
  return inlineMath.reduce((html, formula, index) => html.replaceAll(`MATHINLINE${index}END`, formula), rendered);
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in noteMeta)) notFound();
  const note = noteMeta[slug as NoteSlug];
  const html = await renderNote(note.file);

  return (
    <main className="note-page">
      <nav className="site-nav shell" aria-label="主导航">
        <a className="brand" href="../../" aria-label="回到 Generative Model Notes 首页"><span className="brand-mark" aria-hidden="true">✦</span><span>GENERATIVE MODEL NOTES</span></a>
        <div className="nav-links"><a href="../../#notes">Notes</a><a href="../../#map">The map</a><a href="../../#about">About</a></div>
        <a className="nav-cta" href="../../">Back home <span aria-hidden="true">↗</span></a>
      </nav>

      <header className={`note-hero shell ${note.tone}`}>
        <div>
          <p className="eyebrow"><span className="eyebrow-dot" /> {note.eyebrow}</p>
          <h1>{note.title}</h1>
          <p className="note-subtitle">{note.subtitle}</p>
          <p className="note-lead">{note.lead}</p>
        </div>
        <div className="note-stamp"><span>FIELD NOTE</span><strong>{note.date}</strong><small>from noise<br />to structure</small></div>
      </header>

      <div className="note-body shell">
        <aside className="note-aside"><span>IN THIS NOTE</span><a href="#read">Read through</a><a href="../../#notes">All three notes</a><a href="../../#publish">About this site</a></aside>
        <article className="note-content notion-rendered" id="read" dangerouslySetInnerHTML={{ __html: html }} />
      </div>

      <footer className="site-footer shell"><span>GENERATIVE MODEL NOTES / {note.date}</span><a href="../../#notes">back to notes ↑</a></footer>
    </main>
  );
}
