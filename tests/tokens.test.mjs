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

test("sRGB export resolves all aliases and preserves translucent colors", () => {
  const srgb = JSON.parse(renderArtifacts(tokens).get("tokens.srgb.json"));
  assert.equal(srgb.name, tokens.name);
  assert.equal(srgb.version, tokens.version);
  assert.equal(srgb.colorSpace, "srgb");
  for (const mode of ["light", "dark"]) {
    assert.deepEqual(Object.keys(srgb.colors[mode]), Object.keys(tokens.colors[mode]));
    for (const value of Object.values(srgb.colors[mode])) {
      assert.match(value, /^(#[\da-f]{6}|rgba\([\d., ]+\))$/);
    }
    assert.equal(srgb.colors[mode]["card-foreground"], srgb.colors[mode].foreground);
    assert.equal(srgb.colors[mode]["sidebar-ring"], srgb.colors[mode].ring);
  }
  assert.equal(srgb.colors.light.background, "#fbf7f1");
  assert.equal(srgb.colors.light.primary, "#005f76");
  assert.equal(srgb.colors.dark.border, "rgba(255, 255, 255, 0.1)");
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

test("type, density, focus, spacing and layer contracts reject invalid systems", () => {
  for (const [mutate, expected] of [
    [copy => { delete copy.typography.scale.body; }, /Invalid type scale/],
    [copy => { copy.typography.scale.caption.size = "0.5rem"; }, /Invalid type scale/],
    [copy => { copy.space[4] = "2rem"; }, /Invalid spacing step/],
    [copy => { copy.density.compact.controlHeight = "1rem"; }, /Invalid density target/],
    [copy => { copy.interaction.touchTarget = "2rem"; }, /Invalid interaction tokens/],
    [copy => { copy.interaction.focusWidth = "0px"; }, /Invalid interaction tokens/],
    [copy => { copy.layers.dialog = copy.layers.overlay; }, /Invalid layer order/],
    [copy => { copy.shadows.light.md = "none; color: red"; }, /Invalid shadow/],
  ]) {
    const copy = structuredClone(tokens); mutate(copy);
    assert.throws(() => validateTokens(copy), expected);
  }
});

test("selected and hovered states keep text contrast in both themes", () => {
  const lowHover = structuredClone(tokens); lowHover.colors.light["primary-hover"] = "{primary-foreground}";
  assert.throws(() => validateTokens(lowHover), /Contrast contracts failed/);
  const missing = structuredClone(tokens);
  missing.accessibility.contracts = missing.accessibility.contracts.filter(contract => contract.background !== "surface-selected");
  assert.throws(() => validateTokens(missing), /Missing contrast contract/);
});

test("system primitives are opt-in and use runtime tokens across states", () => {
  const files = renderArtifacts(tokens);
  assert.doesNotMatch(files.get("core.css"), /\.miqal-button|\.miqal-input|\.miqal-menu/);
  assert.match(files.get("system.css"), /@import "\.\/components.css"/);
  const components = files.get("components.css");
  for (const state of ["aria-invalid", "aria-busy", "aria-disabled", "data-highlighted", "data-disabled", "pointer: coarse", "forced-colors: active"]) assert.ok(components.includes(state), state);
  assert.match(components, /min-block-size: var\(--miqal-touch-target\)/);
  assert.match(files.get("core.css"), /\[data-theme="dark"\]/);
  assert.match(files.get("core.css"), /--miqal-shadow-md:/);
});

test("app accent themes cover every accent role and keep contrast in both themes", () => {
  for (const [mutate, expected] of [
    [copy => { delete copy.appThemes.subnify.dark.ring; }, /Expected accent roles in app theme subnify.dark/],
    [copy => { copy.appThemes.subnify.light.border = "oklch(0.5 0 0)"; }, /Expected accent roles/],
    [copy => { copy.appThemes.unknown = structuredClone(copy.appThemes.subnify); }, /Unknown app theme: unknown/],
    [copy => { copy.appThemes.obedy.light.primary = "oklch(0.7 0.12 50)"; }, /obedy.light.primary on background/],
    [copy => { copy.appThemes.sleep.dark["accent-foreground"] = "{accent}"; }, /Contrast contracts failed/],
  ]) {
    const copy = structuredClone(tokens); mutate(copy);
    assert.throws(() => validateTokens(copy), expected);
  }
});

test("app accent scopes redeclare aliases and win over the dark palette", () => {
  const core = renderArtifacts(tokens).get("core.css");
  for (const app of Object.keys(tokens.appThemes)) {
    const light = core.match(new RegExp(`^\\[data-app="${app}"\\] \\{([^}]*)\\}`, "m"))?.[1];
    assert.ok(light, app);
    for (const role of ["--primary:", "--ring:", "--sidebar-primary: var(--primary)", "--sidebar-ring: var(--ring)", "--surface-selected: var(--accent)"]) assert.ok(light.includes(role), `${app} ${role}`);
    assert.doesNotMatch(light, /--(background|secondary|chart-1|success):/);
    for (const selector of [`.dark [data-app="${app}"]`, `.dark[data-app="${app}"]`, `[data-theme="dark"] [data-app="${app}"]`]) assert.ok(core.includes(selector), selector);
  }
  assert.ok(core.indexOf("[data-app=") > core.indexOf('.dark, [data-theme="dark"] {'));
  const srgb = JSON.parse(renderArtifacts(tokens).get("tokens.srgb.json"));
  assert.equal(srgb.appThemes.subnify.light.ring, srgb.appThemes.subnify.light.primary);
});
