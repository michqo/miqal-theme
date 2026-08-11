# Miqal design system

## Goal

Turn `@miqal/theme` from a shared collection of shadcn-compatible CSS variables into the
authoritative, framework-neutral design system for Miqal apps. Preserve the portfolio's calm,
technical character while correcting inconsistencies, improving accessibility, and leaving each
product free to choose the layout that best serves its users.

The portfolio is the historical source of the visual language, not an immutable specification.
Existing choices are candidates to audit rather than rules to copy blindly.

## Scope

This project will:

- establish one canonical token source and generate CSS from it;
- publish the visual and interaction rules in `DESIGN.md`;
- split mandatory foundations from optional atmospheric treatments;
- define framework-neutral recipes with React and Svelte guidance;
- migrate the portfolio to consume the package directly;
- validate the system in SleepCycle, Subnify, and `ms-web` before extracting runtime components;
- add automated checks for token integrity, accessibility, package exports, and visual drift.

This project will not initially:

- ship a React or Svelte runtime component library;
- force identical page layouts across products;
- build a documentation website or Storybook;
- add Figma integration;
- redesign every Miqal app in one release.

## Chosen approach

Use an audited design constitution plus cross-framework recipes. Documentation alone would not
prevent drift, while maintaining parallel React and Svelte component libraries before the patterns
stabilize would add premature cost. Runtime components become eligible for extraction only after an
equivalent pattern has succeeded in at least two apps and its accessibility contract is understood.

## Design principles

1. **Utility before decoration.** The primary task is clear in the first useful viewport. Marketing,
   animation, and atmosphere never compete with it.
2. **Calm technical confidence.** Interfaces are compact, precise, and restrained without imitating
   a terminal or using novelty effects.
3. **Shared personality, product-shaped layouts.** Apps share foundations and interaction language;
   information architecture follows the product.
4. **Borders establish structure.** Thin borders and surface contrast provide most hierarchy.
   Shadows are reserved for floating layers and transient elevation.
5. **Compact but accessible.** Visual density may be high on desktop, but text, focus indicators,
   target sizes, and spacing remain usable across input methods.
6. **Meaningful motion only.** Motion explains state or spatial change, stays brief, and has a
   reduced-motion equivalent.
7. **Semantic tokens over raw values.** Product code expresses purpose (`primary`, `muted`,
   `destructive`) instead of embedding color or effect values.

## System boundaries

### Mandatory across Miqal apps

- semantic color roles and light/dark behavior;
- typography roles and font pairing;
- focus, validation, disabled, hover, active, and selected states;
- radius, border, shadow, and motion language;
- Lucide icon conventions;
- minimum accessibility requirements;
- `/miqal` and `/miqal / product` naming conventions.

### Adaptable per product

- information architecture and page composition;
- content width and information density;
- use of the atmospheric canvas;
- domain-specific illustrations and data visualizations;
- product components that do not yet have a proven shared equivalent.

Brand cyan is shared by default. Apps may introduce domain colors for status and visualization, but
must not casually replace the brand accent. A local semantic-token override requires a short app-level
design note explaining the need, affected tokens, and accessibility verification.

## Package architecture

`tokens.json` is the only hand-edited source of token values. A deterministic generator produces the
CSS artifacts. Generated files carry a notice and are checked in so consumers do not need a build step.

The package will expose:

- `tokens.json` — structured foundation, semantic, and component-adjacent tokens;
- `core.css` — generated semantic variables, Tailwind v4 mappings, light/dark themes, font roles,
  focus defaults, and minimal base styles;
- `canvas.css` — optional dot grid and ambient gradients;
- `motion.css` — motion tokens and reduced-motion-safe utilities;
- `theme.css` — convenience bundle and compatibility entry point;
- `DESIGN.md` — published human- and agent-readable design constitution;
- `recipes/` — component, layout, content, and state specifications;
- `examples/react/` and `examples/svelte/` — reference snippets used for verification, not runtime
  package exports.

`theme.css` will preserve the current all-in-one behavior for the first migration release by importing
the new layers. New consumers should import `core.css` and opt into `canvas.css` and `motion.css`.
Removing compatibility behavior requires a later major version with migration notes.

### Token flow

1. A maintainer edits and validates `tokens.json`.
2. The generator creates the CSS entry points and documentation tables.
3. CI compares generated output with the committed files and rejects drift.
4. Apps import package entry points and bind framework-loaded fonts to the documented font variables.
5. App-level exceptions remain local and documented; they never modify the shared source implicitly.

Invalid token structure, missing semantic pairs, duplicate names, out-of-gamut reference colors, or
failed contrast thresholds stop generation with a message naming the token and violated rule. The
generator must not silently repair or discard values.

## Visual foundations

### Color

The brand accent is Miqal cyan, centered around OKLCH hue 212. Documentation must show browser-derived
or correctly converted sRGB approximations; the current `#2563eb` and `#60a5fa` approximations are
incorrect for the published OKLCH values.

The palette will be recalibrated rather than copied verbatim. Acceptance requirements are:

- normal text and icons used as text meet WCAG AA contrast of at least 4.5:1;
- large text and essential non-text UI boundaries meet at least 3:1;
- muted text still meets 4.5:1 on its intended surface;
- filled primary and destructive controls have conforming foreground pairs in both themes;
- focus indicators are visible against adjacent surfaces;
- no interaction or chart meaning relies on color alone.

The current light primary pair is known to be insufficient at approximately 3.87:1 and must change.

The token model distinguishes:

- neutral foundations;
- brand cyan foundations;
- semantic UI colors;
- status colors for success, warning, danger, and information;
- a cyan sequential scale for magnitude;
- an accessible categorical palette for unrelated series.

### Typography

Inter is the canonical interface and body family. JetBrains Mono is the canonical identity and data
family. Font loading stays with the consuming framework; the package supplies role variables and stable
fallbacks.

Sans-serif is the default for body copy, navigation, controls, forms, and headings. Monospace is used
for `/miqal`, product identity, code, technical values, timestamps, compact metadata, and terse section
labels. A product may deliberately increase mono usage, as the portfolio does, but must not make long
body copy or form-heavy workflows unnecessarily difficult to scan.

Body text defaults to at least 16px with a line height near 1.5. Smaller 12–14px text is limited to
metadata, labels, and dense desktop contexts and must retain adequate contrast and line height.

### Shape, borders, and elevation

Use explicit role-based radii instead of multiplying every shape from one oversized base:

- controls: 6px;
- cards and contained surfaces: 8px;
- popovers, dialogs, and floating navigation: 12px;
- pills: fully rounded, only when the shape communicates grouping or status.

Borders are generally 1px. Cards use borders or subtle rings before shadows. Small shadows are allowed
for menus and elevated cards; medium shadows are reserved for overlays and floating navigation. Colored
glows, glass effects, and large decorative shadows are not default Miqal treatments.

### Spacing, density, and layout

Use Tailwind's 4px-based spacing scale and document role-based composition rather than duplicating every
spacing value as a package token. Recipes define three maximum layout widths:

- reading: 44rem;
- compact utility workspace: 48rem;
- wide application or dashboard: 80rem.

Desktop controls may be visually 32–40px high when context supports compact input. On touch-oriented
layouts, interactive targets provide at least a 44×44px hit area, with at least 8px between adjacent
targets. This can be achieved through responsive sizing or a larger invisible hit area without making
every desktop control visually large.

### Icons

Lucide is the default icon family in React and Svelte. Icons supplement visible labels unless the action
is universally recognized; icon-only controls require accessible names and tooltips where meaning is not
immediate. Icons normally use 16px geometry inside controls and inherit semantic foreground colors.
Emoji are content, not interface icons.

### Canvas

The dot grid and cyan ambient gradients are a recognizable optional canvas. They belong in `canvas.css`,
not mandatory base styling. Compact tools, portfolio pages, and empty states may use the full treatment.
Dense dashboards, charts, print views, and nested application surfaces may use a plain background or a
reduced treatment.

## Motion system

- interaction feedback: 120–200ms;
- overlays and small spatial transitions: 160–240ms;
- larger layout transitions: 200–300ms;
- entrances generally ease out; exits are slightly faster and ease in;
- transforms and opacity are preferred over animating layout dimensions;
- decorative stagger, typewriter effects, continuous pulsing, and scroll-jacking are excluded by
  default;
- `prefers-reduced-motion: reduce` removes nonessential motion and makes essential transitions near
  instantaneous without hiding state changes.

The floating navigation transition remains an optional signature recipe, not a global requirement. Its
current 500ms duration should be shortened into the layout-transition range and implemented without
causing horizontal overflow or unstable layout.

## Recipe model

Each recipe states:

- purpose and when not to use it;
- anatomy and required slots;
- variants and semantic states;
- keyboard, screen-reader, and touch behavior;
- responsive and reduced-motion behavior;
- token dependencies;
- React and Svelte implementation notes;
- a concise do/don't example.

Initial recipes cover:

- product identity and application header;
- app switcher, theme control, and locale control;
- reading, utility, and dashboard page shells;
- section headers;
- buttons, inputs, tabs, cards, dropdowns, dialogs, badges, and tooltips;
- loading, empty, error, success, and validation states;
- tables and charts;
- authentication and settings layouts.

Recipes specify behavior and styling contracts. They do not require consumers to share component source
code. A runtime component becomes a separate proposal after the same contract is stable in at least two
apps.

## Content language

Miqal copy is factual, concise, and direct. Headings describe the task or result. Buttons use explicit
verbs. Empty states explain what is absent and, when possible, the next useful action. Errors identify
what failed and how to recover without blame. Loading copy does not invent artificial work, AI framing,
or waiting language. Product naming uses `/miqal` for the portfolio identity and `/miqal / product` for
suite applications where the shared relationship is useful.

## Adoption sequence

1. **Strengthen the package.** Rework the token schema, generate CSS layers, correct color documentation,
   add `DESIGN.md`, and add validation.
2. **Migrate the portfolio.** Remove its duplicated theme definitions and make it the first direct
   consumer. Preserve intentional portfolio-specific composition as documented overrides.
3. **Validate a compact utility.** Apply the system to SleepCycle to test task-first layout, forms,
   results, touch behavior, and optional canvas use.
4. **Validate a richer React app.** Apply it to Subnify to test navigation, authentication, complex
   forms, tables, and denser workflows.
5. **Validate Svelte and data display.** Apply it to `ms-web` to test framework-neutral recipes,
   dashboard density, charts, and localization.
6. **Evaluate component extraction.** Inventory remaining equivalent duplication and propose only the
   components that now have stable contracts.

Each migration is independently releasable. An app must not be partially switched between duplicated
local tokens and package tokens without a documented temporary boundary.

### Delivery boundary

The first implementation plan covers step 1 only: the `miqal-theme` package, its design constitution,
recipes, generation, and package-level verification. The portfolio and each application migration receive
their own short design review and implementation plan when their turn begins. This keeps cross-repository
changes independently testable and prevents discoveries in one product from blocking package delivery.

## Verification

The package will include automated checks for:

- token schema, required light/dark pairs, unique names, and supported value formats;
- deterministic generation and a clean generated-file diff;
- color conversion and required contrast pairs;
- expected package exports and packaged files;
- a minimal Next.js consumer build;
- a minimal SvelteKit consumer build.

Migration verification includes:

- light and dark visual snapshots at mobile and desktop widths;
- keyboard navigation and visible focus review;
- automated accessibility checks for representative recipes;
- touch-target and responsive-overflow review;
- reduced-motion behavior;
- comparison against the approved recipe, not pixel identity between different products.

Token or recipe changes use semantic versioning and concise migration notes. Breaking removals or semantic
role changes require a major version. Additive tokens and backward-compatible recipes use a minor version;
corrective documentation and non-semantic implementation fixes use a patch version.

## Success criteria

- A new React or Svelte Miqal app can adopt the visual foundation without copying theme variables.
- Humans and coding agents can determine the intended Miqal treatment from `DESIGN.md` and recipes.
- The portfolio consumes `@miqal/theme` rather than maintaining a theme fork.
- Semantic light and dark color pairs meet the documented contrast thresholds.
- Dense desktop UI remains compact while touch layouts remain usable.
- SleepCycle, Subnify, and `ms-web` look recognizably related without sharing page composition.
- Optional atmosphere, app-level exceptions, and compatibility behavior have explicit boundaries.
- No runtime component library is introduced before cross-app evidence justifies it.
