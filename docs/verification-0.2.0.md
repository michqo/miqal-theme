# 0.2.0 release and ecosystem verification

Verified and published on 2026-10-03. All five consumers pin the registry
release `@miqal/theme@0.2.0`.

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
The shared package replaces local foundation definitions with core.css and binds
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

The registry package matches the tarball verified before publication, from
foundation commit `22d78b2`. npm reports version `0.2.0` and integrity:

```text
sha512-RiUPXjZMNtGiSCS4NU7ru2Hvlhfz/c8nZkbGxkpDvy8jlJkEFkfLHXCi/xQe2hyT8gX14lNBWFsC4bJFzX8L3w==
```

Only post-release documentation has changed in the package repository. Runtime
CSS/tokens are unchanged. All consumer lockfiles record this registry integrity.
Frozen installs pass, including the scoped exact-version exception to pnpm 11's
minimum release age. Subnify's existing package override values are preserved
in workspace configuration so pnpm 11 reads them. Its preceding installation
changes are not included in the migration commit.

## Application checks

| App | Automated verification |
| --- | --- |
| Portfolio | ESLint, TypeScript, production Turbopack build; eight reference geometry/style combinations described above. |
| Sleep Cycle | ESLint, TypeScript, five sleep tests, production Turbopack build. |
| Obedy | Changed UI files pass ESLint; TypeScript and production Turbopack build pass. Full ESLint retains three existing explicit-any errors and one unused-catch warning in unchanged lib/scraper.ts. |
| Weather Station | Svelte check: zero errors/warnings; 28 tests; production Vite build; changed-file Prettier check. |
| Subnify | ESLint, TypeScript, 158 unit/component tests, production Turbopack build, fourteen Playwright tests. The updated theme tests compare actual colors to published tokens and check radio state/persistence. |

### Browser review

Review used production previews (Portfolio also has its development preview).
Light desktop: 1440×1000. Dark mobile: 320×812. The root theme class, loaded
Geist font, computed background, and absence of horizontal page overflow were
checked directly; theme is not inferred only from browser color-scheme settings.

- Portfolio: EN light desktop and SK dark mobile accessibility snapshots score
  100; full reference parity covers both locales/themes at both widths.
- Sleep Cycle: all three modes produce results; switching modes clears previous
  results; arrow keys activate the matching tab/panel. Theme radio state
  reflects persisted selection. Light desktop and populated dark mobile
  accessibility snapshots score 100.
- Obedy: real fetched restaurant menus include long dish names, dates, and prices
  alongside the unavailable-menu state. Both reviewed sizes/themes reflow and
  score 100 in accessibility snapshots.
- Weather Station: anonymous homepage and existing mock-mode dashboard and
  measurements were reviewed, with charts and measurement units visible. EN/SK
  switching, mobile navigation, station selection, theme menu, and Escape/focus
  return work. Home light desktop and populated dark mobile dashboard/
  measurements accessibility snapshots score 100. Internal pages still score
  80 in SEO because existing meta descriptions are missing; the homepage scores
  100. Demo values are mock data, not proof of live station readings.
- Subnify: homepage light desktop and populated planner dark mobile accessibility
  snapshots score 100. Its Playwright suite exercises desktop/mobile validation,
  rename, subnet output/map/hierarchy consistency, navigation, history boundary,
  AI auth gate, and both themes. A snapshot taken mid-scroll initially flagged
  an input clipped by the viewport/header; the top-of-page audit passes.

These are snapshot audits and targeted interaction checks, not a performance
audit or a claim of complete WCAG conformance.

### Environment boundaries

Weather Station checks/tests/build use its required
`PUBLIC_API_URL=http://localhost:8000` for local verification. The browser uses
the app's existing `ms-mock-mode` for populated data because no live API
credentials were provided. Existing Vite warnings about browser externalization
of node:dns/promises and bundle size remain.

Subnify's local verification build uses
`NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY=local-preview-anon-key`. These harmless preview
values are not production configuration. Public Next.js values are embedded
at build time: rebuild with real deployment settings. Signed-out boundaries
and local planning are tested; live authentication, Supabase cloud writes, and
OpenAI calls were not exercised.

No environment file, credentials, app deployment, or remote push is included.


## Consumer commits

| Repository | Migration commit |
| --- | --- |
| portfolio | `c20419d` |
| sleep-cycle | `cc6fc9f` |
| obedy | `6b705fa` |
| ms_web | `9a49f66` |
| subnify | `a94d0ea` |
