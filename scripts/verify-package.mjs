import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { loadTokens, root } from "./tokens.mjs";

const tokens = loadTokens(), dir = mkdtempSync(join(tmpdir(), "miqal-theme-package-"));
try {
  const [archive] = JSON.parse(execFileSync("npm", ["pack", "--ignore-scripts", "--json", "--pack-destination", dir], {cwd:fileURLToPath(root),encoding:"utf8"}));
  execFileSync("tar", ["-xzf", join(dir, archive.filename), "-C", dir]);
  const pkg = JSON.parse(readFileSync(join(dir,"package/package.json"),"utf8"));
  assert.equal(pkg.version, tokens.version);
  assert.equal(pkg.name,"@miqal/theme");
  assert.deepEqual(Object.keys(pkg.exports).sort(), ["./canvas.css","./core.css","./motion.css","./theme.css","./tokens.json"]);
  for (const target of Object.values(pkg.exports)) assert.ok(existsSync(join(dir,"package",target)), `Missing export: ${target}`);
  assert.ok(archive.files.every(({path}) => !/^(node_modules|tests|examples|scripts|docs)\//.test(path)), "Development files leaked into the package");
  assert.equal(readFileSync(join(dir,"package/core.css"),"utf8"), readFileSync(new URL("core.css",root),"utf8"));
  console.log(`Verified ${archive.filename}: public exports exist, generated output matches, development files excluded.`);
} finally { rmSync(dir,{recursive:true,force:true}); }
