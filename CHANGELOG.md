# Changelog

## 0.3.0 — 2026-10-29

- Add opt-in `system.css` and `components.css` exports with framework-independent
  buttons, fields, surfaces, badges, menus, dialogs, and overlay treatments.
- Generate a type/spacing scale, runtime radii, comfortable/compact density,
  light/dark shadows, focus/target rules, ordered layers, and interaction colors.
- Preserve the approved palette and core-only behavior. Add data-theme dark
  support, FileVault's identity swatch, hover/selected contrast contracts,
  coarse-pointer targets, and forced-color states.
- Add opt-in per-app accent themes: `data-app="weather|subnify|sleep|obedy|filevault"`
  swaps primary, hover, ring, and accent roles to the app's identity hue in both
  modes. Each app theme must pass every contrast contract. Canvas layers now also
  follow `[data-theme="dark"]`.
- Extend token validation, CSS compilation tests, tarball export verification,
  and the Next.js/SvelteKit gallery.

## 0.2.1 — 2026-10-05

- Export generated `tokens.srgb.json` for image renderers and other consumers
  that require sRGB. Resolve aliases for both themes and preserve alpha as RGBA.
- Keep conversion in the package generator, with no color-library dependency
  required in consumers. Canonical OKLCH tokens and generated CSS are unchanged.
- Check sRGB output for drift and include it in packed-package verification.

## 0.2.0 — 2026-10-03

- Add generated `core.css` with the approved warm portfolio palette, Geist font
  roles, app identity swatches, status/chart roles, visible focus, and reduced
  motion. Core has a plain background and no font download or runtime component.
- Split optional canvas and motion layers into separate CSS exports. Keep
  `theme.css` for legacy global decoration and Inter/JetBrains Mono bindings.
- Generate CSS and `DESIGN.md` from canonical `tokens.json`; synchronize token
  and package versions. Derive color approximations rather than maintaining
  inaccurate blue hex values by hand.
- Strengthen essential input boundaries, validate semantic contrast contracts,
  and verify the packed package plus Next.js/SvelteKit consumption.

Migration: replace `theme.css` with `core.css`, bind `--miqal-font-sans` and
`--miqal-font-mono` in the app, and remove duplicate foundation tokens. Existing
0.1.x consumers remain on their installed version until explicitly migrated.
