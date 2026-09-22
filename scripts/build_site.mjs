import { cpSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "dist");
const files = [
  "index.html",
  "manifest.webmanifest",
  "manifest.en.webmanifest",
  "service-worker.js",
  "css",
  "js",
  "assets",
  "data/processed/global-cdi-coverage.json",
  "data/processed/nonrenewable-resource-rents-2017-2021.json",
];

mkdirSync(output, { recursive: true });
for (const file of files) {
  const destination = path.join(output, file);
  mkdirSync(path.dirname(destination), { recursive: true });
  cpSync(path.join(root, file), destination, { recursive: true });
}
console.log("Static site built in dist/");
