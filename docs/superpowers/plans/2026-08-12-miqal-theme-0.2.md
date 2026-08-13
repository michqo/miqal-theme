# Miqal Theme 0.2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish `@miqal/theme@0.2.0` as the generated, accessible, React-supported design-system foundation required by the portfolio, SleepCycle, and Subnify migrations.

**Architecture:** Keep `tokens.json` as the only hand-edited value source. Node ESM scripts validate tokens, resolve color contracts, and deterministically generate CSS and documentation artifacts. `core.css` is mandatory; `canvas.css` and `motion.css` are explicit opt-ins; `theme.css` preserves the `0.1.1` all-in-one entry point for one migration release.

**Tech Stack:** Node 24, npm 11, JSON Schema/Ajv 8, Culori 4, Tailwind CSS 4.2, Next.js 16/React 19 fixture, Playwright 1.62, Axe.

## Global Constraints

- `tokens.json` is the only hand-edited source of token values.
- Generated files carry a notice and are checked in so consumers do not need a build step.
- Semantic light and dark color pairs meet WCAG AA: 4.5:1 for normal text, 3:1 for large text and essential non-text boundaries.
- Muted text meets 4.5:1 on its intended surface.
- Controls use 6px radius, contained surfaces 8px, floating layers 12px, pills only for grouping or status.
- Interaction motion uses 120–200ms; overlays 160–240ms; layout transitions 200–300ms.
- Reduced motion removes nonessential motion and makes essential transitions near-instant.
- `theme.css` preserves `0.1.1` all-in-one behavior for the first migration release.
- No React runtime component library ships in this release.
- Svelte examples, SvelteKit fixtures, Svelte compatibility promises, and `ms_web` work are forbidden.
- Final consumer commits depend on published `@miqal/theme@0.2.0`, never `file:` or `npm link` state.

## File Structure

- `tokens.json`: canonical values, semantic aliases, contrast contracts, layout roles, motion roles.
- `schema/tokens.schema.json`: structural contract for `tokens.json`.
- `scripts/lib/tokens.mjs`: load, schema validation, alias resolution, semantic-pair validation.
- `scripts/lib/colors.mjs`: sRGB gamut, hex conversion, and contrast checks.
- `scripts/lib/render-css.mjs`: pure CSS renderers.
- `scripts/lib/render-docs.mjs`: generated token tables.
- `scripts/generate.mjs`: write/check orchestration.
- `scripts/validate-recipes.mjs`: recipe contract validation.
- `scripts/verify-package.mjs`: export and tarball verification.
- `core.css`, `canvas.css`, `motion.css`, `theme.css`: generated public CSS.
- `DESIGN.md`: public design constitution with generated token tables.
- `recipes/*.md`: framework-neutral behavior recipes with React guidance.
- `examples/react/`: non-exported Next.js verification fixture.
- `tests/*.test.mjs`: Node unit and package tests.
- `tests/visual/theme.spec.mjs`: browser accessibility and visual regression checks.

---

### Task 1: Establish token schema and validation harness

**Files:**
- Modify: `package.json:1`
- Create: `package-lock.json`
- Create: `schema/tokens.schema.json`
- Create: `scripts/lib/tokens.mjs`
- Create: `tests/tokens-schema.test.mjs`

**Interfaces:**
- Consumes: `tokens.json` JSON document.
- Produces: `loadTokens(path?: URL): Promise<TokenDocument>`, `validateTokens(value: unknown): TokenDocument`, `resolveTokenReference(reference: string, tokens: TokenDocument): string`, and `resolveTokenValue(tokens: TokenDocument, path: string): string`.

- [ ] **Step 1: Add the test/build toolchain and scripts**

Set package type, Node floor, and exact verification entry points:

```json
{
  "type": "module",
  "engines": { "node": ">=24" },
  "scripts": {
    "generate": "node scripts/generate.mjs",
    "generate:check": "node scripts/generate.mjs --check",
    "test:unit": "node --test tests/*.test.mjs",
    "test:recipes": "node scripts/validate-recipes.mjs",
    "test:consumer": "next build examples/react",
    "test:visual": "playwright test",
    "test:package": "node scripts/verify-package.mjs",
    "test": "npm run test:unit && npm run generate:check && npm run test:recipes && npm run test:consumer && npm run test:package"
  },
  "devDependencies": {
    "@axe-core/playwright": "^4.13.0",
    "@playwright/test": "^1.62.1",
    "@tailwindcss/postcss": "4.2.1",
    "ajv": "^8.20.0",
    "culori": "^4.0.2",
    "json-dup-key-validator": "^1.0.3",
    "next": "16.1.7",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "tailwindcss": "4.2.1",
    "typescript": "^5.9.3"
  }
}
```

Keep existing package identity, license, repository, peer dependency, and publish settings. Run `npm install` to produce `package-lock.json`.

- [ ] **Step 2: Write failing schema tests**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { validateTokens } from "../scripts/lib/tokens.mjs";

test("rejects a missing dark semantic token", () => {
  const invalid = structuredClone(validFixture);
  delete invalid.color.semantic.dark.primary;
  assert.throws(() => validateTokens(invalid), /dark\.primary/);
});

test("rejects unresolved token references", () => {
  const invalid = structuredClone(validFixture);
  invalid.color.semantic.light.primary.value = "{color.brand.999}";
  assert.throws(() => validateTokens(invalid), /color\.brand\.999/);
});

test("rejects duplicate JSON property names", async () => {
  await assert.rejects(() => loadTokens(duplicateFixtureUrl), /duplicate.*primary/i);
});
```

Define `validFixture` in the test with one light/dark pair for every required semantic name listed in Step 4. `duplicateFixtureUrl` points to a temporary JSON fixture containing two `primary` properties in the same object.

- [ ] **Step 3: Run the tests and verify failure**

Run: `npm run test:unit`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/lib/tokens.mjs`.

- [ ] **Step 4: Implement schema and validator**

The schema must require these top-level keys: `name`, `version`, `colorSpace`, `typography`, `radius`, `layout`, `motion`, `color`, `canvas`, and `accessibility`. Require matching light/dark semantic names:

```js
export const REQUIRED_SEMANTIC_COLORS = [
  "background", "foreground", "card", "card-foreground", "popover",
  "popover-foreground", "primary", "primary-foreground", "secondary",
  "secondary-foreground", "muted", "muted-foreground", "accent",
  "accent-foreground", "destructive", "destructive-foreground", "success",
  "success-foreground", "warning", "warning-foreground", "info",
  "info-foreground", "border", "input", "ring", "chart-1", "chart-2",
  "chart-3", "chart-4", "chart-5", "sidebar", "sidebar-foreground",
  "sidebar-primary", "sidebar-primary-foreground", "sidebar-accent",
  "sidebar-accent-foreground", "sidebar-border", "sidebar-ring"
];
```

Parse raw source with `json-dup-key-validator` before `JSON.parse`; reject the first duplicate with its property name. Use Ajv with `allErrors: true`. Format every failure as `Invalid tokens.json at <instancePath>: <message>`. After schema validation, compare semantic key sets and recursively resolve references matching `/^\{([a-z0-9.-]+)\}$/i`; cycles throw `Circular token reference: <path>`.

- [ ] **Step 5: Run schema tests**

Run: `npm run test:unit`

Expected: PASS for missing-pair, unresolved-reference, and circular-reference tests.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json schema scripts/lib/tokens.mjs tests/tokens-schema.test.mjs
git commit -m "build: add token validation harness"
```

### Task 2: Recalibrate canonical tokens and enforce color contracts

**Files:**
- Modify: `tokens.json:1`
- Create: `scripts/lib/colors.mjs`
- Create: `tests/colors.test.mjs`
- Modify: `tests/tokens-schema.test.mjs`

**Interfaces:**
- Consumes: resolved OKLCH strings from `resolveTokenReference`.
- Produces: `toHex(color): string`, `contrastRatio(foreground, background): number`, `assertSrgbGamut(path, color): void`, `assertAllPublishedColorsInGamut(tokens): void`, and `assertContrastContracts(tokens): void`.

- [ ] **Step 1: Write failing color-contract tests**

```js
test("primary pairs pass AA in both themes", async () => {
  const tokens = await loadTokens();
  for (const theme of ["light", "dark"]) {
    const primary = resolveTokenValue(tokens, `color.semantic.${theme}.primary`);
    const foreground = resolveTokenValue(tokens, `color.semantic.${theme}.primary-foreground`);
    assert.ok(contrastRatio(primary, foreground) >= 4.5);
  }
});

test("published OKLCH colors remain inside sRGB", async () => {
  const tokens = await loadTokens();
  assert.doesNotThrow(() => assertAllPublishedColorsInGamut(tokens));
});

test("light primary has stable browser approximation", () => {
  assert.equal(toHex("oklch(0.56 0.08 212)"), "#308190");
});
```

- [ ] **Step 2: Run tests against `0.1.1` tokens**

Run: `npm run test:unit`

Expected: FAIL because current primary values are out of sRGB gamut and the light primary pair misses 4.5:1.

- [ ] **Step 3: Implement Culori-backed color helpers**

```js
import { formatHex, inGamut, parse, wcagContrast } from "culori";

const inSrgb = inGamut("rgb");

export function toHex(value) {
  const color = parse(value);
  if (!color) throw new Error(`Unsupported color: ${value}`);
  return formatHex(color);
}

export function contrastRatio(foreground, background) {
  return wcagContrast(parse(foreground), parse(background));
}

export function assertSrgbGamut(path, value) {
  const color = parse(value);
  if (!color || !inSrgb(color)) throw new Error(`${path} is outside sRGB: ${value}`);
}
```

Reject alpha colors as text colors. Composite alpha border/canvas values over their declared surface before non-text contrast evaluation.

- [ ] **Step 4: Replace the token model with audited values**

Set `version` to `0.2.0`; remove all hand-maintained `approxHex` fields; move gradients and dot-grid values under `canvas`; add reference scales plus semantic references. Preserve existing neutral surface values. Use these exact role values:

```json
{
  "typography": {
    "sans": "'Inter', ui-sans-serif, system-ui, sans-serif",
    "mono": "'JetBrains Mono', ui-monospace, monospace"
  },
  "radius": {
    "control": "0.375rem",
    "surface": "0.5rem",
    "floating": "0.75rem",
    "pill": "9999px"
  },
  "layout": {
    "reading": "44rem",
    "utility": "48rem",
    "wide": "80rem"
  },
  "motion": {
    "feedback": { "duration": "160ms", "easing": "cubic-bezier(0.2, 0, 0, 1)" },
    "overlay": { "duration": "200ms", "easing": "cubic-bezier(0.2, 0, 0, 1)" },
    "layout": { "duration": "240ms", "easing": "cubic-bezier(0.2, 0, 0, 1)" },
    "exit": { "duration": "140ms", "easing": "cubic-bezier(0.4, 0, 1, 1)" },
    "reduced": "1ms"
  }
}
```

Use these semantic color values directly or through reference aliases:

| Role | Light | Dark |
| --- | --- | --- |
| primary | `oklch(0.56 0.08 212)` | `oklch(0.76 0.10 212)` |
| primary-foreground | `oklch(1 0 0)` | `oklch(0.18 0.02 212)` |
| destructive | `oklch(0.58 0.16 27)` | `oklch(0.75 0.12 27)` |
| destructive-foreground | `oklch(1 0 0)` | `oklch(0.18 0.02 27)` |
| success | `oklch(0.55 0.12 145)` | `oklch(0.75 0.12 145)` |
| success-foreground | `oklch(1 0 0)` | `oklch(0.18 0.02 145)` |
| warning | `oklch(0.55 0.10 85)` | `oklch(0.80 0.10 85)` |
| warning-foreground | `oklch(1 0 0)` | `oklch(0.18 0.02 85)` |
| info | `oklch(0.55 0.09 250)` | `oklch(0.75 0.10 250)` |
| info-foreground | `oklch(1 0 0)` | `oklch(0.18 0.02 250)` |

Define `chart-1` through `chart-5` as a cyan magnitude sequence. Light values are `oklch(0.42 0.07 212)`, `oklch(0.47 0.08 212)`, `oklch(0.52 0.08 212)`, `oklch(0.57 0.08 212)`, and `oklch(0.62 0.08 212)`. Dark values use lightness `0.62, 0.67, 0.72, 0.77, 0.82`, chroma `0.08`, and hue `212`.

Add six exact categorical references per theme:

| Series | Light | Dark |
| --- | --- | --- |
| data-1 | `oklch(0.55 0.16 27)` | `oklch(0.75 0.12 27)` |
| data-2 | `oklch(0.55 0.10 85)` | `oklch(0.75 0.10 85)` |
| data-3 | `oklch(0.55 0.12 145)` | `oklch(0.75 0.12 145)` |
| data-4 | `oklch(0.55 0.08 212)` | `oklch(0.75 0.10 212)` |
| data-5 | `oklch(0.55 0.09 250)` | `oklch(0.75 0.10 250)` |
| data-6 | `oklch(0.55 0.14 315)` | `oklch(0.75 0.12 315)` |

Encode all required text and non-text pairs under `accessibility.contrastPairs`; each entry contains `foreground`, `background`, and `minimum` (`4.5` or `3`).

- [ ] **Step 5: Run token and color tests**

Run: `npm run test:unit`

Expected: PASS; failure messages name exact token path and measured ratio.

- [ ] **Step 6: Commit**

```bash
git add tokens.json scripts/lib/colors.mjs tests/colors.test.mjs tests/tokens-schema.test.mjs
git commit -m "feat: audit accessible design tokens"
```

### Task 3: Generate layered CSS deterministically

**Files:**
- Create: `scripts/lib/render-css.mjs`
- Create: `scripts/generate.mjs`
- Create: `tests/generator.test.mjs`
- Create: `core.css`
- Create: `canvas.css`
- Create: `motion.css`
- Modify: `theme.css:1`

**Interfaces:**
- Consumes: validated `TokenDocument`.
- Produces: `renderCoreCss(tokens)`, `renderCanvasCss(tokens)`, `renderMotionCss(tokens)`, `renderCompatibilityCss(tokens)`, and CLI `generate.mjs [--check]`.

- [ ] **Step 1: Write failing renderer tests**

```js
test("core contains mandatory roles but no atmosphere", async () => {
  const css = renderCoreCss(await loadTokens());
  assert.match(css, /--color-primary: var\(--primary\)/);
  assert.match(css, /--radius-control: 0\.375rem/);
  assert.doesNotMatch(css, /radial-gradient/);
});

test("compatibility bundle preserves the 0.1.1 global canvas", async () => {
  const css = renderCompatibilityCss(await loadTokens());
  assert.match(css, /@import '\.\/core\.css'/);
  assert.match(css, /body[\s\S]*background-image/);
  assert.match(css, /\.animate-blink/);
});
```

- [ ] **Step 2: Run renderer tests**

Run: `npm run test:unit`

Expected: FAIL with missing renderer module.

- [ ] **Step 3: Implement pure renderers**

Every generated file starts with:

```css
/* Generated from tokens.json by scripts/generate.mjs. Do not edit. */
```

`core.css` must emit Tailwind v4 mappings, light/dark variables, font roles, role radii, layout-width variables, status/data colors, and minimal base styles. Base rules set border/outline defaults, `body` background/foreground/font, and a two-pixel `:focus-visible` outline using `--ring` with two-pixel offset. Map Tailwind radius aliases as follows:

```css
--radius-sm: var(--radius-control);
--radius-md: var(--radius-control);
--radius-lg: var(--radius-surface);
--radius-xl: var(--radius-floating);
--radius-2xl: var(--radius-floating);
```

`canvas.css` must expose `.miqal-canvas` and `.miqal-canvas-quiet`; it must not style `body` globally. `motion.css` emits `--motion-feedback`, `--motion-overlay`, `--motion-layout`, `--motion-exit`, and matching `--motion-ease-*` variables plus `.miqal-motion-feedback`, `.miqal-motion-overlay`, and `.miqal-motion-layout`, followed by a reduced-motion media query.

`theme.css` imports `tw-animate-css` plus all three generated layers, reapplies the full canvas to `body`, and retains deprecated `.animate-blink` with a reduced-motion override. Keep `tw-animate-css` as a runtime dependency for this compatibility entry point. Mark compatibility-only rules with `/* @deprecated: use explicit layer imports */`.

- [ ] **Step 4: Implement write/check orchestration**

```js
const outputs = new Map([
  ["core.css", renderCoreCss(tokens)],
  ["canvas.css", renderCanvasCss(tokens)],
  ["motion.css", renderMotionCss(tokens)],
  ["theme.css", renderCompatibilityCss(tokens)]
]);

if (check) {
  for (const [path, expected] of outputs) {
    const actual = await readFile(path, "utf8");
    if (actual !== expected) failures.push(path);
  }
  if (failures.length) throw new Error(`Generated files are stale: ${failures.join(", ")}`);
} else {
  for (const [path, contents] of outputs) await writeFile(path, contents);
}
```

Sort all token keys before rendering and terminate files with one newline.

- [ ] **Step 5: Generate and verify deterministic output**

Run: `npm run generate && npm run generate:check && npm run test:unit`

Expected: all commands PASS; a second `npm run generate` leaves `git diff --exit-code` clean.

- [ ] **Step 6: Commit**

```bash
git add core.css canvas.css motion.css theme.css scripts/generate.mjs scripts/lib/render-css.mjs tests/generator.test.mjs
git commit -m "feat: generate layered theme css"
```

### Task 4: Publish the design constitution and recipe contracts

**Files:**
- Create: `scripts/lib/render-docs.mjs`
- Create: `scripts/validate-recipes.mjs`
- Create: `tests/docs.test.mjs`
- Create: `DESIGN.md`
- Create: `recipes/product-identity.md`
- Create: `recipes/app-header.md`
- Create: `recipes/page-shells.md`
- Create: `recipes/section-header.md`
- Create: `recipes/button.md`
- Create: `recipes/input.md`
- Create: `recipes/tabs.md`
- Create: `recipes/card.md`
- Create: `recipes/dropdown.md`
- Create: `recipes/dialog.md`
- Create: `recipes/badge.md`
- Create: `recipes/tooltip.md`
- Create: `recipes/states.md`
- Create: `recipes/table.md`
- Create: `recipes/chart.md`
- Create: `recipes/authentication.md`
- Create: `recipes/settings.md`

**Interfaces:**
- Consumes: validated tokens and Markdown recipes.
- Produces: `renderTokenTables(tokens): string`, `validateRecipe(path, contents): string[]`, and `validateAllRecipes(): Promise<string[]>`.

- [ ] **Step 1: Write failing documentation contract tests**

```js
test("generated docs never repeat stale 0.1.1 approximations", async () => {
  const docs = await readFile(new URL("../DESIGN.md", import.meta.url), "utf8");
  assert.doesNotMatch(docs, /0\.55 0\.18 212/);
  assert.match(docs, /#308190/i);
});

test("every recipe declares accessibility behavior", async () => {
  const failures = await validateAllRecipes();
  assert.deepEqual(failures, []);
});
```

- [ ] **Step 2: Run documentation tests**

Run: `npm run test:unit`

Expected: FAIL because `DESIGN.md` and recipe validator do not exist.

- [ ] **Step 3: Implement generated token tables**

Generate bounded sections inside `DESIGN.md`:

```md
<!-- BEGIN GENERATED TOKEN TABLES -->
<!-- Generated from tokens.json. Do not edit this section. -->
...
<!-- END GENERATED TOKEN TABLES -->
```

Tables include semantic light/dark OKLCH, computed hex, measured contrast, radii, layout widths, and motion roles. `generate.mjs --check` must include `DESIGN.md` comparison while preserving prose outside markers.

- [ ] **Step 4: Write constitution prose**

Copy the approved principles, mandatory/adaptable boundaries, typography, shape, layout, icons, canvas, motion, content, accessibility, exception policy, versioning, and extraction gate from `docs/superpowers/specs/2026-08-11-miqal-design-system-design.md`. State React support explicitly; state Svelte unsupported explicitly; contain no Svelte guidance.

- [ ] **Step 5: Write and validate recipes**

Every recipe must contain these exact headings:

```md
## Purpose
## Do not use when
## Anatomy
## Variants and states
## Keyboard and screen reader
## Touch and responsive behavior
## Reduced motion
## Token dependencies
## React guidance
## Do / don't
```

Populate recipes with these concrete contracts:

| Recipe group | Required contract |
| --- | --- |
| product identity / app header | `/miqal` and `/miqal / product`, labeled app/theme/locale controls, sticky responsive header, 44px mobile targets |
| page shells / section header | 44rem reading, 48rem utility, 80rem wide; mono terse label plus semantic heading |
| button / input / tabs | control radius, default/secondary/outline/ghost/destructive states, Enter/Space or native keyboard behavior, invalid/disabled/focus behavior |
| card | surface radius, border before shadow, no interactivity unless semantics become link/button |
| dropdown / dialog / tooltip | floating radius, focus trap/return, Escape dismissal, labeled title/description, tooltip never sole accessible name |
| badge | status/grouping only, text or icon beyond color, pill allowed only when meaning supports it |
| states | loading, empty, error, success, validation; stable recovery action and retained successful data |
| table / chart | semantic headers/captions, keyboard selection, horizontal overflow boundary, non-color encoding, accessible series/values |
| authentication / settings | visible labels, password-manager compatibility, destructive confirmation, saved/error feedback |

`validate-recipes.mjs` rejects missing headings, raw hex values, placeholder markers, Svelte guidance, and missing accessible names for icon-only controls.

- [ ] **Step 6: Run documentation checks**

Run: `npm run generate && npm run test:unit && npm run test:recipes && npm run generate:check`

Expected: PASS with no generated drift.

- [ ] **Step 7: Commit**

```bash
git add DESIGN.md recipes scripts/lib/render-docs.mjs scripts/validate-recipes.mjs scripts/generate.mjs tests/docs.test.mjs
git commit -m "docs: publish design constitution and recipes"
```

### Task 5: Add React consumer, accessibility, and visual verification

**Files:**
- Create: `examples/react/package.json`
- Create: `examples/react/next.config.mjs`
- Create: `examples/react/postcss.config.mjs`
- Create: `examples/react/tsconfig.json`
- Create: `examples/react/app/globals.css`
- Create: `examples/react/app/layout.tsx`
- Create: `examples/react/app/page.tsx`
- Create: `examples/react/components/recipe-gallery.tsx`
- Create: `playwright.config.mjs`
- Create: `tests/visual/theme.spec.mjs`
- Create: `tests/visual/theme.spec.mjs-snapshots/`

**Interfaces:**
- Consumes: package exports exactly as a published Next.js consumer would.
- Produces: buildable recipe gallery plus light/dark desktop/mobile screenshot baselines.

- [ ] **Step 1: Scaffold a non-exported Next.js fixture**

Set `examples/react/package.json` to `{ "name": "@miqal/theme-react-fixture", "private": true }`. Configure Playwright with base URL `http://127.0.0.1:3300`, web-server command `next dev examples/react --hostname 127.0.0.1 --port 3300`, and Desktop Chrome plus 390×844 Chromium projects.

`examples/react/app/globals.css` imports:

```css
@import "tailwindcss";
@import "../../../core.css";
@import "../../../canvas.css";
@import "../../../motion.css";
```

Load Inter and JetBrains Mono through `next/font/google`, map them to `--font-inter` and `--font-jetbrains-mono`, and set `<body className="miqal-canvas">`. The gallery renders product identity, controls, form validation, status states, table, dialog trigger, categorical chart swatches, and a quiet-canvas region. Example components stay inside this fixture and never enter package exports.

- [ ] **Step 2: Write browser checks**

```js
test("recipe gallery is accessible in both themes", async ({ page }) => {
  for (const theme of ["light", "dark"]) {
    await page.goto(`/?theme=${theme}`);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  }
});

test("gallery matches reviewed light and dark baselines", async ({ page }) => {
  await page.goto("/?theme=light");
  await expect(page).toHaveScreenshot("gallery-light-desktop.png", { fullPage: true });
  await page.goto("/?theme=dark");
  await expect(page).toHaveScreenshot("gallery-dark-desktop.png", { fullPage: true });
});
```

Add a 390×844 mobile project and assert no horizontal overflow, visible focus after keyboard Tab, and reduced-motion duration at or below `1ms`.

- [ ] **Step 3: Run the fixture build**

Run: `npm run test:consumer`

Expected: Next production build PASS with no package-export resolution failures.

- [ ] **Step 4: Generate and review visual baselines**

Run: `npx playwright install chromium && npm run test:visual -- --update-snapshots`

Expected: four reviewed baselines: light/dark desktop and light/dark mobile. Review colors, clipping, focus rings, 44px mobile hit areas, and canvas density before accepting files.

- [ ] **Step 5: Run browser checks without updates**

Run: `npm run test:visual`

Expected: PASS with zero Axe violations and no screenshot drift.

- [ ] **Step 6: Commit**

```bash
git add examples playwright.config.mjs tests/visual
git commit -m "test: add React theme fixture"
```

### Task 6: Lock package exports, CI, and migration documentation

**Files:**
- Modify: `package.json:1`
- Modify: `README.md:1`
- Create: `CHANGELOG.md`
- Create: `scripts/verify-package.mjs`
- Create: `tests/package.test.mjs`
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: generated artifacts and `npm pack --dry-run --json` output.
- Produces: verified npm tarball contract for version `0.2.0` and `dryRunPack(): Promise<string[]>`.

- [ ] **Step 1: Write failing package-contract test**

```js
test("exports every supported public artifact and no fixture", async () => {
  const manifest = JSON.parse(await readFile("package.json", "utf8"));
  assert.deepEqual(Object.keys(manifest.exports).sort(), [
    "./canvas.css", "./core.css", "./motion.css", "./theme.css", "./tokens.json"
  ]);
  const packed = await dryRunPack();
  assert.ok(packed.includes("DESIGN.md"));
  assert.ok(packed.includes("recipes/button.md"));
  assert.ok(!packed.some((path) => path.startsWith("examples/")));
});
```

- [ ] **Step 2: Run package test**

Run: `npm run test:unit`

Expected: FAIL because package exports/files still describe `0.1.1`.

- [ ] **Step 3: Finalize manifest and tarball verifier**

Set version `0.2.0`, keep `tailwindcss: ^4.0.0` as peer dependency, and publish only:

```json
{
  "exports": {
    "./core.css": "./core.css",
    "./canvas.css": "./canvas.css",
    "./motion.css": "./motion.css",
    "./theme.css": "./theme.css",
    "./tokens.json": "./tokens.json"
  },
  "files": [
    "core.css", "canvas.css", "motion.css", "theme.css", "tokens.json",
    "DESIGN.md", "recipes", "README.md", "CHANGELOG.md"
  ]
}
```

`verify-package.mjs` runs `npm pack --dry-run --json`, checks exact required files, rejects `scripts/`, `tests/`, `examples/`, and `schema/`, then imports `package.json` to verify version and exports.

- [ ] **Step 4: Rewrite consumer and migration docs**

README documents mandatory `core.css`, optional canvas/motion layers, `theme.css` compatibility, Next font setup, dark class behavior, and links to `DESIGN.md`/recipes. Remove SvelteKit instructions. `CHANGELOG.md` documents corrected color approximations, accessible primary pair, role-based radii, new status/data tokens, layered imports, deprecated global canvas/blink compatibility, and the `0.1.1 → 0.2.0` migration.

- [ ] **Step 5: Add CI**

CI runs on pushes and pull requests using Node 24:

```yaml
- run: npm ci
- run: npm test
- run: npx playwright install --with-deps chromium
- run: npm run test:visual
```

Keep generation/package checks before browser installation so structural failures return quickly.

- [ ] **Step 6: Run full verification**

Run: `npm test && npm run test:visual && git diff --check`

Expected: all checks PASS; `npm run generate:check` reports no stale files; tarball excludes internal tooling and fixtures.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json README.md CHANGELOG.md scripts/verify-package.mjs tests/package.test.mjs .github/workflows/ci.yml
git commit -m "chore: prepare theme 0.2 release"
```

### Task 7: Create the package release gate

**Files:**
- No source changes expected.

**Interfaces:**
- Consumes: verified `main` commit from Task 6.
- Produces: published `@miqal/theme@0.2.0` required by all consumer plans.

- [ ] **Step 1: Verify clean release state**

Run: `git status --short && npm test && npm run test:visual && npm pack --dry-run`

Expected: clean working tree; every check PASS; tarball lists only approved public files.

- [ ] **Step 2: Request explicit publish approval**

Report package diff, test results, tarball contents, and exact version. Do not publish, tag, or push without user approval because npm publication is an external irreversible release action.

- [ ] **Step 3: Publish after approval**

Run: `npm publish --access public`

Expected: registry confirms `@miqal/theme@0.2.0`.

- [ ] **Step 4: Verify registry artifact**

Run: `npm view @miqal/theme@0.2.0 version dist.tarball --json`

Expected: version `0.2.0` and a registry tarball URL.

- [ ] **Step 5: Tag and push after publication**

```bash
git tag v0.2.0
git push origin main v0.2.0
```

Expected: remote `main` and `v0.2.0` point at the verified release commit.

### Task 8: Run the post-consumer component extraction audit

**Execution dependency:** Run only after the portfolio, SleepCycle, and Subnify plans are complete and deployed against `@miqal/theme@0.2.0`.

**Files:**
- Create: `docs/audits/component-extraction-audit.md`

**Interfaces:**
- Consumes: final React consumer source, tests, and reviewed visual behavior.
- Produces: evidence-based `extract`, `recipe-only`, or `app-specific` decision for each repeated pattern; no runtime source.

- [ ] **Step 1: Verify audit prerequisites**

Run package-version checks in all three consumers:

```bash
pnpm --dir ../portfolio list @miqal/theme
pnpm --dir ../sleep-cycle list @miqal/theme
pnpm --dir ../subnify list @miqal/theme
```

Expected: all resolve `0.2.x`; each repository's full verification command has a recorded passing result.

- [ ] **Step 2: Inventory exact repeated React patterns**

Compare these candidate groups:

```text
button: portfolio/components/ui/button.tsx, sleep-cycle/components/ui/button.tsx, subnify/components/ui/button.tsx
theme control: portfolio/components/ui/theme-toggle.tsx, sleep-cycle/components/theme-toggle.tsx, subnify/components/ui/theme-toggle.tsx
product identity/header: portfolio/components/nav-bar.tsx, sleep-cycle/app/page.tsx, subnify/components/core/miqal-header.tsx
dropdown: portfolio/components/ui/dropdown-menu.tsx, sleep-cycle/components/ui/dropdown-menu.tsx, subnify/components/ui/dropdown-menu.tsx
states/surfaces: portfolio/app/[locale]/page.tsx, sleep-cycle/components/sleep-calculator.tsx, subnify/components/app/live-intelligence.tsx
```

Record source differences, prop/API shape, keyboard behavior, accessible naming, responsive behavior, and test coverage. CSS class similarity alone is not extraction evidence.

- [ ] **Step 3: Write the evidence matrix**

For every candidate, include columns: `apps`, `equivalent purpose`, `stable API`, `accessibility contract`, `responsive contract`, `meaningful differences`, `decision`, and `reason`. A candidate qualifies as `extract` only when at least two apps share purpose, API, behavior, and accessibility contract without product-specific branching.

- [ ] **Step 4: Apply YAGNI decision rules**

- `extract`: propose a separate React package design; do not implement it in this audit.
- `recipe-only`: keep source local and strengthen the matching recipe.
- `app-specific`: document why shared source would hide real product differences.

Theme toggle, app switcher, and headers remain separate candidates; never bundle them into one navigation framework.

- [ ] **Step 5: Verify audit scope**

Run: `git status --short && git diff --name-only`

Expected: only `docs/audits/component-extraction-audit.md` is new or modified; no package export, runtime source, consumer source, or Svelte work appears.

- [ ] **Step 6: Commit**

```bash
git add docs/audits/component-extraction-audit.md
git commit -m "docs: audit React component extraction"
```
