import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["apps", "packages/ui/src/components"];
const SKIP = new Set(["node_modules", ".next", "dist", ".turbo", "generated"]);

const RULES = [
  {
    name: "primitive color utility (use a semantic token)",
    re: /\b(?:bg|text|border|ring|outline|fill|stroke|from|via|to|divide|placeholder|decoration|caret|accent|shadow)-(?:neutral|accent|success|error|warning|info)-\d{1,3}\b/g,
  },
  { name: "hardcoded hex color", re: /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g },
  { name: "arbitrary pixel value", re: /\[\d+(?:\.\d+)?px\]/g },
];

function* files(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* files(path);
    else if (/\.(tsx|ts)$/.test(name) && !/\.d\.ts$|\.test\./.test(name))
      yield path;
  }
}

let problems = 0;
for (const root of ROOTS) {
  try {
    statSync(root);
  } catch {
    continue;
  }
  for (const file of files(root)) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, index) => {
        for (const rule of RULES) {
          for (const match of line.matchAll(rule.re)) {
            problems++;
            console.log(`${file}:${index + 1}  ${match[0]}  <- ${rule.name}`);
          }
        }
      });
  }
}

if (problems > 0) {
  console.log(
    `\n${problems} token violation(s). Use a semantic token, or propose a new one first.`,
  );
  process.exit(1);
}
console.log("Token check passed.");
