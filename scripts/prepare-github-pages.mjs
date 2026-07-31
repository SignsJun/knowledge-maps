import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(projectRoot, "..", "dist", "client");

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
    } else if (/\.(html|rsc|js)$/i.test(entry.name)) {
      files.push(entryPath);
    }
  }

  return files;
}

const files = await collectFiles(clientRoot);

for (const file of files) {
  const original = await readFile(file, "utf8");
  const prepared = original
    .replaceAll("/assets/", "./assets/")
    .replaceAll("/og.png", "./og.png")
    .replaceAll("/favicon.svg", "./favicon.svg");

  if (prepared !== original) {
    await writeFile(file, prepared, "utf8");
  }
}

console.log(`Prepared ${files.length} static files for a GitHub Pages project site.`);
