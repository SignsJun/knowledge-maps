import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the public learning notes homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Generative Model Notes — DDPM, Score Matching &amp; Flow Matching/i);
  assert.match(html, /GENERATIVE MODEL NOTES/);
  assert.match(html, /DDPM/);
  assert.match(html, /Score matching/);
  assert.match(html, /Flow matching/);
  assert.match(html, /03 notes/);
  assert.match(html, /THE LEARNING MAP \/ GENERATIVE MODELS/);
  assert.match(html, /从噪声/);
  assert.match(html, /From noise to structure/i);
  assert.match(html, /og\.png/);
  assert.doesNotMatch(html, /Yifan|Positional Encoding|Swin-Transformer|ResShift|Rectified Flow|MeanFlow/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|SkeletonPreview/i);
});

test("keeps the finished homepage free of starter preview scaffolding", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Generative/);
  assert.match(page, /noteSnapshots/);
  assert.match(layout, /Generative Model Notes/);
  assert.match(layout, /openGraph/);
  assert.doesNotMatch(page, /Yifan|Positional Encoding|Swin-Transformer|ResShift|Rectified Flow|MeanFlow/i);
  assert.doesNotMatch(page, /SkeletonPreview|_sites-preview|codex-preview/);
  assert.doesNotMatch(layout, /Starter Project|_sites-preview|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});

test("pre-renders the three note pages as readable web pages", async () => {
  const pages = await Promise.all([
    readFile(new URL("../dist/client/notes/ddpm/index.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/notes/score-matching/index.html", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/notes/flow-matching/index.html", import.meta.url), "utf8"),
  ]);

  for (const html of pages) {
    assert.match(html, /class="note-page"/);
    assert.match(html, /class="math-block"/);
    assert.match(html, /class="math-inline"/);
    assert.match(html, /mathjax@3/);
    assert.match(html, /class="note-content notion-rendered"/);
    assert.doesNotMatch(html, /class="math-inline"[^>]*>[^<]*<em>/);
    assert.match(html, /GENERATIVE MODEL NOTES/);
    assert.doesNotMatch(html, /原始笔记|Notion 页面/);
    assert.doesNotMatch(html, /<body>\s*#|```markdown|react-loading-skeleton/i);
  }
  assert.match(pages[0], /Jensen|先验匹配|去噪匹配/);
});
