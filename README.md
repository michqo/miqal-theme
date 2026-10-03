# @miqal/theme

A CSS foundation for Miqal's Next.js and SvelteKit utilities: warm paper and ink,
a teal identity, Geist font roles, accessible controls, and a plain canvas.
The published 0.2.0 release follows the portfolio approved on 2026-10-03.

## Install and import

Install the verified registry release: `pnpm add @miqal/theme@0.2.0 --save-exact`.
For future local changes, validate a packed candidate before publishing it.

```css
/* app/globals.css (Next.js) or src/app.css (SvelteKit) */
@import "tailwindcss";
@import "@miqal/theme/core.css";
```

Core exports semantic Tailwind v4 colors, radius aliases, font roles, visible
focus, selection, and reduced-motion defaults. It adds no gradients, dot grid,
blinking caret, font download, or framework runtime component.

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
- `theme.css`: compatibility bundle with legacy global canvas, animation
  utilities, and Inter / JetBrains Mono bindings. Use core.css when migrating
  to the new design. Existing 0.1.x consumers remain on their installed version.

Bind theme toggles, language menus, and task behavior in each app. Shared CSS
does not replace accessible control semantics or product-specific layouts.

## Tokens and ownership

`tokens.json` is the only hand-edited source of shared token values. CSS and
[DESIGN.md](DESIGN.md) are generated and checked in; consumers need no generation
step. Package and token versions must match. Canonical colors use OKLCH, and hex
approximations are generated through sRGB conversion rather than maintained by
hand. Essential form boundaries use the stronger input role; decorative
dividers use border. App identity colors do not encode status meaning.

Products retain their composition, density, copy, navigation, and visualizations.
The portfolio sketch and contact treatment are local design, not global widgets.

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
