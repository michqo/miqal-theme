# Changelog

## 0.2.0 — release candidate

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
