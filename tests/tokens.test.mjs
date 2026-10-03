import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { contrast, loadTokens, resolveColor, root, validateTokens } from "../scripts/tokens.mjs";
import { renderArtifacts } from "../scripts/render.mjs";

const tokens = loadTokens();
const reference = JSON.parse(readFileSync(new URL("docs/portfolio-baseline.tokens.json", root), "utf8"));

test("approved appearance survives alias resolution in both themes", () => {
  for (const mode of ["light", "dark"]) for (const [name, value] of Object.entries(reference.colors[mode])) {
    if (name === "input") continue; // strengthened for essential form boundaries
    assert.equal(resolveColor(tokens, mode, name), value, `${mode}.${name}`);
  }
});

test("missing dark roles, dangling aliases, and cycles are rejected", () => {
  const missing = structuredClone(tokens); delete missing.colors.dark.input;
  assert.throws(() => validateTokens(missing), /complete semantic color set in dark/);
  const dangling = structuredClone(tokens); dangling.colors.dark.card = "{unknown}";
  assert.throws(() => validateTokens(dangling), /Missing color: dark.unknown/);
  const cyclic = structuredClone(tokens); cyclic.colors.dark.card = "{popover}";
  assert.throws(() => validateTokens(cyclic), /Circular color alias/);
});

test("low contrast and weakened contracts are rejected", () => {
  const faint = structuredClone(tokens); faint.colors.light["muted-foreground"] = "{background}";
  assert.throws(() => validateTokens(faint), /Contrast contracts failed/);
  const weak = structuredClone(tokens); weak.accessibility.contracts[0].min = 3;
  assert.throws(() => validateTokens(weak), /Invalid contrast contract/);
  const missing = structuredClone(tokens); delete missing.accessibility.contracts[0].min;
  assert.throws(() => validateTokens(missing), /Invalid contrast contract/);
  const removed = structuredClone(tokens); removed.accessibility.contracts.shift();
  assert.throws(() => validateTokens(removed), /Missing contrast contract/);
});

test("alpha strokes are composited instead of treated as opaque", () => {
  assert.equal(contrast("oklch(0 0 0 / 0%)", "white"), 1);
  assert.ok(contrast("oklch(0 0 0 / 10%)", "white") < 1.5);
  assert.ok(contrast("black", "white") > 20);
});

test("generated artifacts are deterministic and match the committed files", () => {
  const first = renderArtifacts(tokens), second = renderArtifacts(structuredClone(tokens));
  assert.deepEqual(first, second);
  for (const [name, css] of first) assert.equal(css, readFileSync(new URL(name, root), "utf8"), name);
});

test("core is undecorated; optional layers and legacy fonts are explicit", () => {
  const files = renderArtifacts(tokens), core = files.get("core.css");
  assert.doesNotMatch(core, /background-image|@keyframes|animate-blink|@import/);
  assert.match(core, /outline: 2px solid var\(--ring\)/);
  assert.match(core, /prefers-reduced-motion/);
  assert.match(files.get("canvas.css"), /\.miqal-canvas/);
  assert.doesNotMatch(files.get("canvas.css"), /\bbody\b/);
  assert.match(files.get("theme.css"), /var\(--font-inter,/);
  assert.match(files.get("theme.css"), /var\(--font-jetbrains-mono,/);
});
