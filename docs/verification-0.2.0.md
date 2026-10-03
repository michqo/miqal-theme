# 0.2.0 release candidate verification

Verified locally on 2026-10-03. Registry publication is pending.

## Package

- `npm test`: eight tests pass, including complete light/dark semantic sets,
  required contrast contracts, alias errors, alpha compositing, reference token
  parity, deterministic generation, and Tailwind compilation of both imports.
- `npm run generate:check`: checked-in CSS and DESIGN.md match tokens.json.
- `npm run verify:package`: every public export exists in the tarball; generated
  core matches source; development fixtures, scripts, tests, and dependencies
  are excluded from published files.
- `npm run verify:consumers`: the packed files build in Next.js 16.1.6 / React
  19.2.3 / Tailwind 4.2.1 and SvelteKit 2.22.3 / Svelte 5 / Vite 7 / Tailwind 4.1.
  Next's fixture uses webpack because its dependencies are symlinked from the
  existing ecosystem checkout; the real Portfolio build also passes Turbopack.

## Browser fixtures

Both production-build galleries were reviewed at 1440×1000 in light mode and
320×812 in dark mode. The actual root theme class and computed background were
confirmed after audits, rather than assuming color-scheme emulation changed the
application theme.

- Both frameworks score 100 in Lighthouse snapshot accessibility, best
  practices, SEO, and agentic browsing; these are fixture scores, not scores
  for the other ecosystem apps. Performance was not audited.
- No horizontal page overflow at either tested size. The dense data table
  remains usable within its own scroll container.
- Keyboard navigation shows the shared 2px ring with 4px clearance.
- The native modal receives focus; Escape closes it and returns focus to its
  trigger. Light/dark text, controls, status surfaces, and chart legends were
  reviewed in the browser. Reduced-motion rules are covered in CSS tests.

## Portfolio integration

Reference: `7df5d9ff71a629ab2b8ed3f1da774e5dc0e7ddcc` in the Portfolio repository.
The candidate replaces local foundation definitions with core.css and binds
the existing next/font variables on body. App tints, sketch, layout, contact,
locale messages, and personal content remain local.

The comparison covers EN and SK, light and dark, 1440×1000 and 320×812: eight
combinations. Body and section/heading/app-link/contact-link geometry, font
families, font sizes, foregrounds, backgrounds, and border colors match the
approved reference. No horizontal overflow was observed. This is computed
style/layout parity, not a claim of a pixel-identical screenshot comparison.

ESLint, TypeScript `--noEmit`, and the production build pass. Input boundaries
are deliberately stronger in the package; Portfolio does not render form
inputs, so this accessibility adjustment does not alter the approved page.

The local Portfolio dependency points to a verification tarball. After npm
publication, replace it with the exact registry version `0.2.0`, regenerate
only the relevant lockfile entries, and commit the migration independently.
No other application has been migrated or deployed.
