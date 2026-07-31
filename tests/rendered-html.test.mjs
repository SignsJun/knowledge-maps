import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the public learning notes homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Yifan’s Notes — Generative Models<\/title>/i);
  assert.match(html, /YIFAN’S NOTES/);
  assert.match(html, /DDPM/);
  assert.match(html, /Score matching/);
  assert.match(html, /Flow matching/);
  assert.match(html, /From noise to structure/i);
  assert.match(html, /og\.png/);
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
  assert.match(layout, /Yifan’s Notes/);
  assert.match(layout, /openGraph/);
  assert.doesNotMatch(page, /SkeletonPreview|_sites-preview|codex-preview/);
  assert.doesNotMatch(layout, /Starter Project|_sites-preview|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
