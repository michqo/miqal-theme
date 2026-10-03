import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, realpathSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadTokens, root } from "./tokens.mjs";

loadTokens();
const source = fileURLToPath(root), work = mkdtempSync(join(tmpdir(), "miqal-theme-consumers-"));
const [archive] = JSON.parse(execFileSync("npm", ["pack", "--ignore-scripts", "--json", "--pack-destination", work], {cwd:source,encoding:"utf8"}));
execFileSync("tar", ["-xzf", join(work,archive.filename), "-C",work]);
for (const [name, consumer] of [["next",process.env.MIQAL_NEXT_CONSUMER ?? resolve(source,"../portfolio")],["sveltekit",process.env.MIQAL_SVELTE_CONSUMER ?? resolve(source,"../ms_web")]]) {
  const dir = join(work,name), modules = join(dir,"node_modules"), installed = join(consumer,"node_modules");
  cpSync(join(source,"examples",name),dir,{recursive:true});
  cpSync(join(source,"examples/gallery.fragment.html"),join(dir,"gallery.fragment.html"));
  mkdirSync(modules,{recursive:true});
  for (const entry of readdirSync(installed)) {
    if (entry.startsWith(".") || !existsSync(join(installed,entry))) continue;
    if (entry.startsWith("@")) {
      mkdirSync(join(modules,entry),{recursive:true});
      for (const child of readdirSync(join(installed,entry))) {
        if ((entry === "@miqal" && child === "theme") || !existsSync(join(installed,entry,child))) continue;
        symlinkSync(realpathSync(join(installed,entry,child)),join(modules,entry,child));
      }
    } else symlinkSync(realpathSync(join(installed,entry)),join(modules,entry));
  }
  mkdirSync(join(modules,"@miqal"),{recursive:true});
  symlinkSync(join(work,"package"),join(modules,"@miqal/theme"));
  if (name === "next") {
    execFileSync(process.execPath,[join(installed,"next/dist/bin/next"),"build","--webpack"],{cwd:dir,stdio:"inherit",env:{...process.env,NEXT_TELEMETRY_DISABLED:"1"}});
  } else {
    execFileSync(process.execPath,[join(installed,"vite/bin/vite.js"),"build"],{cwd:dir,stdio:"inherit"});
  }
  console.log(`Packed theme ${name} fixture built at ${dir}`);
}
console.log(`Consumer verification artifacts: ${work}`);
