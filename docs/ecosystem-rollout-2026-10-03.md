# Miqal ecosystem rollout

Completed locally on 2026-10-03. `@miqal/theme@0.2.0` is published on npm.
Portfolio, Sleep Cycle, Obedy, Weather Station, and Subnify pin that exact
registry version. Each app migration is an independent commit. No app has
been deployed or pushed as part of this rollout.

## Design reference

Portfolio commit `7df5d9ff71a629ab2b8ed3f1da774e5dc0e7ddcc` is the approved
reference. [portfolio-baseline.tokens.json](portfolio-baseline.tokens.json)
records its observed colors for comparison; `tokens.json` is the sole
production source. This rollout supersedes the palette, font, decorative
canvas, and React-only assumptions in the August design-system plans.

The ecosystem shares warm paper/charcoal surfaces, teal controls, Geist
interface text, Geist Mono for identity and technical data, semantic color
roles, visible focus, stable hover feedback, and quiet interactions.
`core.css` is the default entry point. Canvas and motion decoration are
optional exports; `theme.css` retains compatibility with the older imports.

Each app keeps its own working layout. The portfolio's sketch, single-column
app directory, personal content, and contact composition are not copied into
the utilities. Charts and measurements retain labels, units, and domain
meaning rather than borrowing decorative app-identity swatches.

## Completed migrations

| Repository | Changes |
| --- | --- |
| Portfolio | Replaced duplicate foundation definitions with core.css; preserved approved geometry, typography, colors, both locales, app/source alignment, and Contact whitespace. |
| Sleep Cycle | Updated font loaders and core import; simplified the calculator surface and theme control; connected tabs to their active panel and improved inactive-label contrast. Calculation logic and all three modes remain intact. |
| Obedy | Added core, corrected font bindings, removed floating navigation and entrance motion, and added semantic restaurant headings and page metadata. Menu fetching, long dish names, dates, prices, and unavailable states remain intact. |
| Weather Station | Updated Svelte core/font imports; stabilized the header; added selected theme/language radio states and accessible mobile navigation; simplified the homepage and corrected dashboard landmarks/headings. Station selection, EN/SK, charts, units, and authentication code remain intact. Station actions are sibling buttons rather than nested controls. |
| Subnify | Removed duplicate blue tokens and gradients; retained the planner workspace; simplified theme controls and mobile navigation; applied semantic success/input roles. Planner calculations, allocation map, hierarchy, validation, history, exports, and auth/AI gates remain intact. |

## Package and dependency handling

The verified package was published from foundation commit `22d78b2`. Its npm
integrity matches the locally tested tarball; see the [verification record](verification-0.2.0.md).
Runtime CSS and tokens have not changed since publication. Later changes only
finalize release documentation.

Consumer lockfiles contain the relevant theme entries without unrelated
dependency upgrades. Existing graft/ignore edits and Subnify's previous
installation changes remain outside migration commits. The exact verified
version has a scoped `minimumReleaseAgeExclude` entry for pnpm 11's first-day
installation policy. Subnify's existing dompurify/ws override values are also
recognized through workspace configuration with pnpm 11. Other dependencies
keep their normal age policy.

## Validation and remaining boundaries

Package generation, contrast contracts, exports, and Next.js/SvelteKit
fixtures pass. All five production builds pass with the app configuration
recorded in verification. Unit/component suites and Subnify's fourteen
Playwright checks pass. The checked pages reflow at 320px, share the intended
fonts and theme, and retain keyboard navigation and selected states.

Obedy's whole-repository lint still reports existing scraper errors; changed
UI files pass ESLint. Weather Station's dashboard/measurements pages retain
their existing missing SEO descriptions. Real Weather Station and Supabase
authentication, cloud writes, and live AI calls require backend credentials
and were not exercised; local demo data and signed-out gates were checked.

Deployment is the next separate action. Configure each app's real environment
before building/deploying it; local preview values are documented only for
verification and are not production settings. Future visual changes should
start in canonical tokens and their contrast tests, then be reviewed in the
apps that use them.
