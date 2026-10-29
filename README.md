# @miqal/theme

A shared CSS design system for Miqal's Next.js and SvelteKit utilities: warm
paper and ink, a teal identity, Geist font roles, and a plain canvas. Version 0.3.0
adds an opt-in interface layer and per-app accents on top of the foundation
approved on 2026-10-03. Existing semantic colors remain unchanged.

## Install and import

```sh
pnpm add @miqal/theme@0.3.0
```

```css
/* app/globals.css (Next.js) or src/app.css (SvelteKit) */
@import "tailwindcss";
@import "@miqal/theme/core.css";
```

Core exports semantic Tailwind v4 colors, radius aliases, font roles, visible
focus, selection, and reduced-motion defaults. It adds no gradients, dot grid,
blinking caret, font download, or framework runtime component.

## Advanced interface layer

For new applications such as FileVault, opt in to the complete system:

```css
@import "tailwindcss";
@import "@miqal/theme/system.css";
```

`system.css` bundles core, motion, and `components.css`. The component layer is
namespaced and framework independent; importing core alone does not style
buttons, fields, menus, or dialogs.

```html
<section data-density="compact" class="miqal-surface" data-elevation="1">
  <h2 class="miqal-text-title">Your workspace</h2>
  <label for="folder">Folder name</label>
  <input id="folder" class="miqal-input" placeholder="Project notes" />
  <button class="miqal-button miqal-button-primary">Create folder</button>
  <span class="miqal-badge" data-status="success">Saved</span>
</section>
```

Shared foundations now include:

- Six type roles with sizes, line heights, weights, and tracking; use
  `text-miqal-body` in Tailwind or `--miqal-type-body` in custom CSS.
- A 4px spacing scale, runtime radius variables, light/dark elevation tokens,
  and ordered sticky/menu/overlay/dialog/toast/tooltip layers.
- Comfortable and compact density settings with 44px coarse-pointer targets.
- Hover/selected surfaces and primary hover colors with contrast contracts.
- Buttons, inputs, surfaces, badges, menus, dialogs, and overlays with focus,
  disabled, busy, invalid, forced-color, and reduced-motion support.

### App accents

Each app can use its own identity color instead of the shared teal for primary
actions, focus rings, and selection, while neutrals and status colors stay shared:

```html
<html lang="en" data-app="subnify">
```

Available apps are `weather`, `subnify`, `sleep`, `obedy`, and `filevault`. The
attribute also works on any container and combines with `.dark` or
`[data-theme="dark"]`. Without it, apps keep the default Miqal teal. Add a new app
by giving it an `app-<name>` swatch and an `appThemes.<name>` entry in
`tokens.json`; generation fails if any of its colors breaks a contrast contract.

Use real native or library-managed semantics. Radix remains responsible for
focus trapping, keyboard navigation, and dialog/menu behavior in FileVault.
CSS `aria-disabled` styling does not prevent activation; apps must implement
that behavior. Both `.dark` and `[data-theme="dark"]` select the dark palette.
See the generated [DESIGN.md](DESIGN.md) for the complete token/primitive API.

## Fonts

Apps load Geist and Geist Mono. Bind the package roles on the element where
those loader variables exist; defining aliases on an ancestor can resolve the
fallback before the descendant's font variables are available.

For Next.js, keep your existing next/font loaders. If their variables are
applied to body:

```css
body {
  --miqal-font-sans: var(--font-geist-sans);
  --miqal-font-mono: var(--font-geist-mono);
}
```

For SvelteKit, load fonts through your app's chosen strategy. The default roles
use named Geist / Geist Mono with system fallbacks. Override
`--miqal-font-sans` and `--miqal-font-mono` if using differently named local
font faces. Theme selection is still controlled by your app's .dark class on
html; core does not persist preferences or implement a toggle.

## Optional layers and compatibility

- `canvas.css`: explicit `.miqal-canvas` / `.miqal-canvas-quiet` treatments;
  importing this file alone does not decorate body.
- `motion.css`: duration/easing tokens and transition utilities.
- `components.css`: opt-in visual primitives; import core first. Motion is
  optional and has fallbacks. `system.css` is the convenient complete bundle.
- `theme.css`: compatibility bundle with legacy global canvas, animation
  utilities, and Inter / JetBrains Mono bindings. Use core.css when migrating
  to the new design. Existing 0.1.x consumers remain on their installed version.

Bind theme toggles, language menus, and task behavior in each app. Shared CSS
does not replace accessible control semantics or product-specific layouts.

## Tokens and ownership

`tokens.json` is the only hand-edited source of shared token values. CSS, sRGB tokens, and
[DESIGN.md](DESIGN.md) are generated and checked in; consumers need no generation
step. Package and token versions must match. Canonical colors use OKLCH, and hex
approximations are generated through sRGB conversion rather than maintained by
hand. Essential form boundaries use the stronger input role; decorative
dividers use border. App identity colors do not encode status meaning.

Products retain their composition, density choice, copy, navigation, and visualizations.
The portfolio sketch and contact treatment are local design, not global widgets.

### Colors for image renderers

For renderers that require sRGB, import the generated JSON export:

```ts
import tokens from "@miqal/theme/tokens.srgb.json";

const background = tokens.colors.light.background; // #fbf7f1
const border = tokens.colors.dark.border; // rgba(255, 255, 255, 0.1)
```

This export includes every semantic color in both themes, with aliases resolved.
Opaque colors use hex; translucent colors use RGBA to preserve their opacity.
Conversion and sRGB clipping happen in this package's generator. Consumers need
no color library, and website CSS continues to use the canonical OKLCH values.
Do not edit `tokens.srgb.json` directly; `generate:check` detects drift.

## Development and verification

```sh
npm ci --ignore-scripts
npm run generate
npm test
npm run verify:package
```

Tests cover semantic contrast, alpha compositing, alias errors, approved token
parity, deterministic artifacts, Tailwind compilation, and tarball exports.
Run `npm run verify:consumers` in the ecosystem checkout to build packed-package
Next.js and SvelteKit fixtures using the installed Portfolio / Weather Station
dependencies. Override `MIQAL_NEXT_CONSUMER` / `MIQAL_SVELTE_CONSUMER` to use
other installed consumer directories. These fixtures are development-only and
are excluded from the published package.

Before release, compare Portfolio in both languages/themes at desktop and
mobile widths. Review gallery controls, focused states, floating layers, and
chart/status roles. After publication, pin consumer commits to the registry
release and keep app migrations independently reversible.

See CHANGELOG.md for the migration. The repository's
`docs/ecosystem-rollout-2026-10-03.md` records the staged rollout and original
reference; it is development documentation and excluded from the package.
