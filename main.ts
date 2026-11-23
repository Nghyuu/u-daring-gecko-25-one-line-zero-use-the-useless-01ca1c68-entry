import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const entryPath = join(dirname(fileURLToPath(import.meta.url)), "entry.txt");
const text = readFileSync(entryPath, "utf8");
const trimmed = text.trim();
if (trimmed.length === 0) {
  throw new Error("entry.txt is empty");
}
if (trimmed.includes("\n")) {
  throw new Error("entry.txt must be a single line");
}
const codePoints = [...trimmed].length;
if (codePoints > 200) {
  throw new Error(`entry.txt is ${codePoints} code points, over the 200 limit`);
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
copyFileSync(entryPath, outPath);
const written = readFileSync(outPath);
const original = readFileSync(entryPath);
if (!written.equals(original)) {
  throw new Error("output entry.txt does not match entry.txt byte-for-byte");
}
console.log(`wrote ${outPath}: ${written.length} bytes, ${codePoints} code points`);
