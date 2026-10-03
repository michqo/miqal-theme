import { readFileSync, writeFileSync } from "node:fs";
import { loadTokens, root } from "./tokens.mjs";
import { renderArtifacts } from "./render.mjs";

const check = process.argv.includes("--check");
for (const [name, content] of renderArtifacts(loadTokens())) {
  const target = new URL(name, root);
  if (check) {
    let current;
    try { current = readFileSync(target, "utf8"); } catch { /* reported as drift below */ }
    if (current !== content) throw new Error(`${name} is stale. Run npm run generate.`);
  } else writeFileSync(target, content);
}
console.log(check ? "Generated artifacts match canonical tokens." : "Generated core, optional layers, compatibility bundle, and design reference.");
