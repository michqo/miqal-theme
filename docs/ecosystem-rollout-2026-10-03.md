# Miqal ecosystem rollout

Updated: 2026-10-03. Status: the `0.2.0` foundation is implemented and verified.
Portfolio consumes a packed candidate locally with visual parity. Registry
publication and production consumer commits are pending; other app migrations
have not started. See [verification](verification-0.2.0.md).

## Reference and decisions

The user approved the portfolio's new appearance and requested that all the
ecosystem apps follow it. The reference is portfolio commit
`7df5d9ff71a629ab2b8ed3f1da774e5dc0e7ddcc`; its `docs/design.md` records the
content, layout, and interaction decisions.

[portfolio-baseline.tokens.json](portfolio-baseline.tokens.json) captures the
observed core colors from that commit, with CSS aliases resolved. It is a
reference artifact, not a second production token source. When implementing
the package, transfer the accepted values into the canonical `tokens.json` and
generate CSS from there. Keep this snapshot unchanged for comparison.

This rollout supersedes the palette, font, canvas, and React-only scope in the
[August specification](superpowers/specs/2026-08-11-miqal-design-system-design.md)
and [August 0.2 plan](superpowers/plans/2026-08-12-miqal-theme-0.2.md).
Their useful foundations remain: generated CSS, one token source, semantic
color contracts, package verification, accessible interactions, and independent
consumer migrations. The older Subnify migration plan also needs its visual
assumptions reconciled before implementation.

The registry release remains `@miqal/theme@0.1.1`. This repository prepares
`0.2.0`; existing consumers remain on their installed version until migrated.

## Shared appearance

- Warm cream in light mode and warm charcoal in dark mode, with readable ink
  colors and a teal primary accent. Hue 212 renders as cyan/teal; remove the
  old package documentation's misleading blue hex approximations.
- Geist for interface text and headings, Geist Mono for identity, domains, and
  technical data. Apps load the fonts; the package provides font roles and
  system fallbacks. Keep legacy font bindings working during the transition.
- Clear heading hierarchy, compact content, and generous spacing between
  sections. Use dividers where they establish structure; avoid stacked rules
  between adjacent sections, as seen during the portfolio contact iteration.
- Plain canvas by default. Remove the old global gradients, dot grid, and
  blinking caret from the new core entry point. Decorative layers are optional
  legacy behavior, not the new visual foundation.
- Restrained, consistent Lucide icons. The four app identity colors in the
  reference support branding and small illustrations. They are not semantic
  success/warning/error colors or a ready-made categorical chart palette.
- Stable hover feedback, visible keyboard focus, 44px main control targets,
  accessible selected states, and reduced-motion support.

Each app retains the layout appropriate to its task. Do not copy the portfolio's
single-column directory, personal sketch, or contact section into dashboards.
Do not add promotional cards, fake activity, or a launcher that competes with
the active utility. `/miqal / product` identity and a quiet return link are enough
to connect the ecosystem.

## Repository inventory

| Repository | Current foundation | Migration details |
| --- | --- | --- |
| `portfolio` | Next.js 16.1.6, Tailwind 4, local tokens, Geist pair | First reference consumer. Replace foundation definitions while preserving the approved appearance. Keep the sketch, directory layout, descriptions, locale messages, and personal content local. |
| `sleep-cycle` | Next.js 16.1.7, Tailwind 4.2, `@miqal/theme ^0.1.1`, Inter/JetBrains Mono | Smallest functional pilot after Portfolio. Update font bindings and package import; retain calculator logic, time modes, results, and method explanation. |
| `obedy` | Next.js 16.1.7, Tailwind 4.2, local shadcn neutral tokens, Geist pair | Add the package, remove duplicate foundation tokens, and correct the self-referencing font mapping. Retain restaurant/menu grouping and fetching states; revisit full-page entrance motion. |
| `ms_web` | SvelteKit 2 / Svelte 5, Tailwind 4.1, `@miqal/theme ^0.1.1`, Inter/JetBrains Mono | Prove the CSS foundation in Svelte. Preserve LayerChart rendering, station selection, authentication, EN/SK, dates, and units. Dashboard density remains appropriate to measurements. |
| `subnify` | Next.js 16.3, Tailwind 4.2, `@miqal/theme ^0.1.1`, Geist pair with legacy bindings | Largest migration. Remove local blue brand/chart/sidebar overrides and body gradients only after package parity is proven. Retain planner controls, allocation map, history, exports, authentication, and AI designer workflows. |

Versions and scripts above were read from the local repositories, not inferred
from the older plans. Existing install/lockfile and graft-related changes belong
to their current owners and should not be swept into migration commits.

## Phase 1: Implement the shared foundation

1. Implement the next `0.2.x` package foundation using canonical `tokens.json`,
   deterministic CSS generation, and checked-in generated output. The observed
   portfolio snapshot supplies visual reference values, not a blind copy of
   all old sidebar/chart tokens.
2. Introduce `core.css` with Tailwind v4 semantic mappings, light/dark tokens,
   font roles, minimal base styles, focus, and selection rules. Keep `theme.css`
   as a documented compatibility entry point for existing consumers; migrated
   apps explicitly import `core.css` to avoid legacy global decoration.
3. Keep the package CSS-based. Do not introduce a React runtime component
   dependency into Svelte or extract application components before a repeated,
   verified need exists.
4. Preserve the approved background, foreground, primary, and typography.
   Validate filled primary buttons, muted text on every intended surface,
   destructive/status pairs, essential input boundaries, focus rings, chart
   colors, and sidebar roles. The portfolio did not exercise all these roles;
   its subtle divider is not automatically a valid form-control boundary.
5. Make token and package versions agree. Derive any hex documentation from
   actual color conversion rather than hand-maintained approximate values.
6. Test generated-token parity, alias resolution, deterministic output, export
   contents, and CSS consumption in both a Next.js and SvelteKit fixture. Check
   both themes, keyboard navigation, 320px mobile, and a dense desktop view.

Completion: a packed release candidate is installable in both frameworks, its
core renders the approved palette without global decoration, and contrast and
package checks pass. Existing `0.1.1` consumers keep working until migrated.

Status: complete locally. Generated CSS, contrast contracts, packed exports,
and both framework fixtures pass. Light desktop and dark 320px galleries pass
the accessibility audits and keyboard checks recorded in verification.

## Phase 2: Migrate Portfolio without visual drift

1. Capture light/dark reference screenshots from the committed portfolio in
   EN and SK at desktop and mobile widths. Existing browser checks passed, but
   reviewed screenshot files must be captured before the package replacement.
2. Validate the packed package locally, then replace duplicated foundation
   definitions with `core.css` and explicit Geist font bindings. Keep the
   app-icon tint, sketch, heading composition, anchor clearance, and layout
   rules local unless they are already documented package roles.
3. Verify app and source links share one right-hand alignment, controls remain
   usable at 320px, locale switching preserves fragments, and the Contact
   section has no redundant divider after the education disclosure.
4. Run lint, TypeScript, build, and visual/accessibility comparisons. Changes
   to the reference appearance need an explicit design reason in the commit.

Completion: the package owns reusable foundations and the portfolio remains
visually equivalent to the approved reference.

Status: verified locally using the packed `0.2.0` candidate. EN/SK, light/dark,
desktop/mobile geometry, fonts, and colors match the reference. Lint, TypeScript,
and the production build pass. The temporary tarball dependency must be replaced
with the registry release before committing this consumer migration.

## Phase 3: Migrate Sleep Cycle, then Obedy

Sleep Cycle is the simplest functional check of the shared system. Preserve
calculator behavior and verify both calculation modes, populated results,
mobile inputs, theme persistence, and the existing `lib/sleep.test.ts` suite.
Update the font loaders and remove package-era background decoration.

Obedy then proves the same foundations in a content-heavy utility. Preserve
restaurant grouping, prices, menu dates, unavailable-menu states, and loading
behavior. Give each restaurant a practical, compact surface rather than
turning every menu into a portfolio project card. Remove redundant local theme
definitions and check the header, theme menu, long dish names, and mobile grid.

Completion for each: one reviewed, independently releasable migration commit,
with the existing workflows intact and its verification commands passing.

## Phase 4: Migrate Weather Station

Use the Svelte-verified package core and shared font roles. Keep its dashboard
and measurements layouts, chart semantics, units, and station controls. Review
chart contrast and color distinctions independently; the portfolio identity
swatches are decorative branding, not a chart accessibility guarantee.

Exercise anonymous and authenticated views, EN/SK, empty/error/loaded states,
station selection, and dense measurements at mobile and desktop widths.
Run the actual current Vitest suite: the repository has API, cookie, OAuth,
and auth-component tests despite the older AGENTS note saying no tests exist.
Follow its Svelte import paths and Prettier conventions when implementing.

## Phase 5: Migrate Subnify

Reconcile its August migration plan with this warm, plain-canvas baseline.
Retain existing component props, variants, and state behavior while replacing
local palette forks with package roles. Give the workspace the room and density
needed by subnet planning. Review the allocation map, tables, menus, dialogs,
history, and PDF output instead of applying the portfolio width globally.

Run existing unit/component tests and the Playwright planner, history, AI
designer, and theme suites. Use deterministic representative data for light/
dark screenshots, including a populated planner and a mobile dialog.

## Verification and release

| Repository | Existing checks to retain |
| --- | --- |
| Portfolio | `lint`, TypeScript `--noEmit`, `build`, EN/SK browser checks |
| Sleep Cycle | `lint`, `typecheck`, `test`, `build`, calculator/browser checks |
| Obedy | `lint`, `typecheck`, `build`, menu/browser checks |
| Weather Station | `check`, `test`, `build`, changed-file Prettier checks and project lint as appropriate |
| Subnify | `lint`, `typecheck`, `test`, `build`, `test:e2e` |

For every migration, verify light/dark text contrast, essential boundaries,
keyboard focus, touch targets, long-content reflow, no horizontal overflow,
and reduced motion. Preserve application behavior and document any existing
failures separately from migration regressions.

Use a packed package for local integration verification. Production consumer
commits must reference the verified registry release rather than `file:` or
link state. Package publication and app deployment are separate delivery steps;
no publication or deployment has been performed.

Roll out one consumer at a time so each can be reverted independently. Finish
with a search for duplicated semantic tokens, conflicting font bindings, and
old global canvas rules. Keep intentional domain visualization and status
tokens documented locally or as explicit package roles.
