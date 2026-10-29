<!-- Generated from tokens.json. Do not edit. -->
# Miqal foundation 0.3.0

The approved portfolio is the visual reference: warm paper and ink, a teal
identity, clear headings, compact utility interfaces, and a plain canvas.
Products share foundations while keeping layouts suited to their tasks.

Use Geist for interface text and Geist Mono for identity and technical data.
Load fonts in the app, then bind the package roles on the same element where
the loader variables exist. No font download is initiated by this package.

Keep icons restrained and interactions stable. Main controls have at least
44px targets, visible focus, readable labels, and reduced-motion equivalents.
Use whitespace for section hierarchy; avoid duplicate dividers. Borders can
separate content, but essential input boundaries use the stronger input role.

App identity swatches are decorative branding unless an app opts in to its
accent theme with `data-app`, which re-tints the interactive roles. Chart colors are categorical,
not a guarantee that neighboring series can be distinguished by color alone.
Use legends, labels, and line styles. Status meaning also needs text or icons.

## Colors

Values are canonical OKLCH. Hex values below are generated, sRGB-clamped
approximations for documentation; they are not substitute source values.
Text contracts require 4.5:1; essential input/focus/chart boundaries require
3:1 against declared opaque surfaces. Translucent strokes are composited first.
Thin decorative dividers intentionally use a quieter border role.

| Token | Light OKLCH | Light hex | Dark OKLCH | Dark hex |
| --- | --- | --- | --- | --- |
| `background` | `oklch(0.978 0.009 85)` | `#fbf7f1` | `oklch(0.19 0.008 65)` | `#161310` |
| `foreground` | `oklch(0.24 0.018 65)` | `#251e16` | `oklch(0.94 0.01 85)` | `#eeebe4` |
| `card` | `oklch(0.991 0.005 85)` | `#fefcf8` | `oklch(0.235 0.008 65)` | `#211d1a` |
| `card-foreground` | `oklch(0.24 0.018 65)` | `#251e16` | `oklch(0.94 0.01 85)` | `#eeebe4` |
| `popover` | `oklch(0.991 0.005 85)` | `#fefcf8` | `oklch(0.235 0.008 65)` | `#211d1a` |
| `popover-foreground` | `oklch(0.24 0.018 65)` | `#251e16` | `oklch(0.94 0.01 85)` | `#eeebe4` |
| `primary` | `oklch(0.43 0.12 212)` | `#005f76` | `oklch(0.72 0.17 212)` | `#00bee2` |
| `primary-foreground` | `oklch(0.98 0.02 212)` | `#eafcff` | `oklch(0.15 0.05 212)` | `#001017` |
| `secondary` | `oklch(0.94 0.013 85)` | `#efebe2` | `oklch(0.274 0.006 286.033)` | `#27272a` |
| `secondary-foreground` | `oklch(0.24 0.018 65)` | `#251e16` | `oklch(0.985 0 0)` | `#fafafa` |
| `muted` | `oklch(0.94 0.013 85)` | `#efebe2` | `oklch(0.269 0 0)` | `#262626` |
| `muted-foreground` | `oklch(0.48 0.014 65)` | `#635c56` | `oklch(0.74 0.012 85)` | `#aeaaa2` |
| `accent` | `oklch(0.95 0.03 212)` | `#d9f4fa` | `oklch(0.28 0.05 212)` | `#002f37` |
| `accent-foreground` | `oklch(0.18 0.04 212)` | `#00161c` | `oklch(0.92 0.06 212)` | `#b7f0fc` |
| `border` | `oklch(0.885 0.014 85)` | `#ddd9cf` | `oklch(1 0 0 / 10%)` | `#ffffff / 10%` |
| `input` | `oklch(0.58 0.015 85)` | `#7e7a70` | `oklch(0.54 0.012 85)` | `#726e67` |
| `ring` | `oklch(0.43 0.12 212)` | `#005f76` | `oklch(0.55 0.15 212)` | `#0086a4` |
| `app-weather` | `oklch(0.44 0.09 200)` | `#006166` | `oklch(0.75 0.10 200)` | `#53c1c7` |
| `app-subnify` | `oklch(0.48 0.10 255)` | `#345f95` | `oklch(0.77 0.10 255)` | `#89b7f3` |
| `app-sleep` | `oklch(0.48 0.10 310)` | `#6f4c87` | `oklch(0.77 0.10 310)` | `#c8a2e4` |
| `app-obedy` | `oklch(0.49 0.12 50)` | `#944812` | `oklch(0.78 0.12 50)` | `#f5a06f` |
| `destructive` | `oklch(0.50 0.17 27)` | `#b02b27` | `oklch(0.704 0.191 22.216)` | `#ff6467` |
| `destructive-foreground` | `oklch(0.99 0.005 85)` | `#fdfcf8` | `oklch(0.19 0.008 65)` | `#161310` |
| `success` | `oklch(0.44 0.09 150)` | `#286037` | `oklch(0.75 0.10 150)` | `#7fc08c` |
| `warning` | `oklch(0.46 0.10 70)` | `#7b4c00` | `oklch(0.78 0.12 70)` | `#e8a95c` |
| `info` | `oklch(0.45 0.10 255)` | `#2b568b` | `oklch(0.77 0.10 255)` | `#89b7f3` |
| `chart-1` | `oklch(0.44 0.09 200)` | `#006166` | `oklch(0.75 0.10 200)` | `#53c1c7` |
| `chart-2` | `oklch(0.48 0.10 255)` | `#345f95` | `oklch(0.77 0.10 255)` | `#89b7f3` |
| `chart-3` | `oklch(0.48 0.10 310)` | `#6f4c87` | `oklch(0.77 0.10 310)` | `#c8a2e4` |
| `chart-4` | `oklch(0.49 0.12 50)` | `#944812` | `oklch(0.78 0.12 50)` | `#f5a06f` |
| `chart-5` | `oklch(0.44 0.09 150)` | `#286037` | `oklch(0.75 0.10 150)` | `#7fc08c` |
| `sidebar` | `oklch(0.991 0.005 85)` | `#fefcf8` | `oklch(0.235 0.008 65)` | `#211d1a` |
| `sidebar-foreground` | `oklch(0.24 0.018 65)` | `#251e16` | `oklch(0.94 0.01 85)` | `#eeebe4` |
| `sidebar-primary` | `oklch(0.43 0.12 212)` | `#005f76` | `oklch(0.72 0.17 212)` | `#00bee2` |
| `sidebar-primary-foreground` | `oklch(0.98 0.02 212)` | `#eafcff` | `oklch(0.15 0.05 212)` | `#001017` |
| `sidebar-accent` | `oklch(0.95 0.03 212)` | `#d9f4fa` | `oklch(0.28 0.05 212)` | `#002f37` |
| `sidebar-accent-foreground` | `oklch(0.18 0.04 212)` | `#00161c` | `oklch(0.92 0.06 212)` | `#b7f0fc` |
| `sidebar-border` | `oklch(0.885 0.014 85)` | `#ddd9cf` | `oklch(1 0 0 / 10%)` | `#ffffff / 10%` |
| `sidebar-ring` | `oklch(0.43 0.12 212)` | `#005f76` | `oklch(0.55 0.15 212)` | `#0086a4` |
| `success-foreground` | `oklch(0.99 0.005 85)` | `#fdfcf8` | `oklch(0.19 0.008 65)` | `#161310` |
| `warning-foreground` | `oklch(0.99 0.005 85)` | `#fdfcf8` | `oklch(0.19 0.008 65)` | `#161310` |
| `info-foreground` | `oklch(0.99 0.005 85)` | `#fdfcf8` | `oklch(0.19 0.008 65)` | `#161310` |
| `primary-hover` | `oklch(0.37 0.10 212)` | `#004c5e` | `oklch(0.78 0.12 212)` | `#40cbe4` |
| `surface-subtle` | `oklch(0.94 0.013 85)` | `#efebe2` | `oklch(0.269 0 0)` | `#262626` |
| `surface-hover` | `oklch(0.94 0.013 85)` | `#efebe2` | `oklch(0.274 0.006 286.033)` | `#27272a` |
| `surface-selected` | `oklch(0.95 0.03 212)` | `#d9f4fa` | `oklch(0.28 0.05 212)` | `#002f37` |
| `overlay` | `oklch(0.16 0.01 65 / 48%)` | `#100c09 / 48%` | `oklch(0.08 0.005 65 / 72%)` | `#020201 / 72%` |
| `app-filevault` | `oklch(0.43 0.07 155)` | `#2d5b3f` | `oklch(0.75 0.10 150)` | `#7fc08c` |

## App accent themes

Set `data-app="<name>"` on `html`, `body`, or a product container to swap the
teal identity for the app's own accent. Only `primary`, `primary-foreground`, `primary-hover`, `ring`, `accent`, `accent-foreground`
change, together with the sidebar and selected-surface roles that alias them. Neutrals,
status, and chart roles stay shared. Every app theme passes the same contrast contracts
as the default palette in both modes. Works with `.dark` and `[data-theme="dark"]`.

| App | Mode | `primary` | `primary-foreground` | `primary-hover` | `ring` | `accent` | `accent-foreground` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `weather` | light | `#006166` | `#eafdfe` | `#004c50` | `#006166` | `#d8f5f6` | `#001718` |
| `weather` | dark | `#53c1c7` | `#001113` | `#7cced2` | `#00858d` | `#003033` | `#b6f1f4` |
| `subnify` | light | `#345f95` | `#f0f9ff` | `#264b7a` | `#345f95` | `#e1f0ff` | `#051223` |
| `subnify` | dark | `#89b7f3` | `#000b1f` | `#a1c7f8` | `#3d73b6` | `#172a41` | `#cae7ff` |
| `sleep` | light | `#6f4c87` | `#fdf5ff` | `#593b6f` | `#6f4c87` | `#f5e9fe` | `#170c1f` |
| `sleep` | dark | `#c8a2e4` | `#12051a` | `#d4b6eb` | `#875ca5` | `#30223b` | `#f1daff` |
| `obedy` | light | `#944812` | `#fff5ed` | `#7b3702` | `#944812` | `#ffe9dd` | `#1f0b02` |
| `obedy` | dark | `#f5a06f` | `#1b0400` | `#fdb48c` | `#a85a28` | `#3c2111` | `#ffdac2` |
| `filevault` | light | `#2d5b3f` | `#effdf3` | `#20462f` | `#2d5b3f` | `#e0f5e6` | `#021709` |
| `filevault` | dark | `#7fc08c` | `#001002` | `#99cda3` | `#33854a` | `#15301b` | `#c9f1d0` |

## Interface system (opt-in)

Import `system.css` after Tailwind for core + motion + namespaced visual primitives.
Importing core alone retains the existing foundation without styling controls.
Shared CSS supplies appearance; apps retain accessible semantics and behavior.

### Type scale

| Role | Size | Line height | Weight | Tracking |
| --- | --- | --- | --- | --- |
| `caption` | 0.75rem | 1.5 | 400 | 0em |
| `label` | 0.8125rem | 1.4 | 500 | 0em |
| `body` | 0.875rem | 1.6 | 400 | 0em |
| `body-lg` | 1rem | 1.6 | 400 | 0em |
| `title` | 1.5rem | 1.3 | 600 | -0.025em |
| `display` | 2.25rem | 1.15 | 600 | -0.035em |

Use `--miqal-type-body` / `--miqal-leading-body` in CSS,
`text-miqal-body` in Tailwind, or `miqal-text-body` with components.css.
The spacing scale is a 0.25rem step, exposed as `--miqal-space-{1,2,3,4,5,6,8,10,12,16}`.
Radii also have real runtime variables, `--miqal-radius-sm` through `--miqal-radius-4xl`.

### Density, elevation and layering

Comfortable controls: 2.75rem; rows: 3.5rem.
Compact controls: 2.25rem; rows: 2.75rem.
Set `data-density="compact"` on a product container. Nested comfortable regions can reset it.
Coarse-pointer controls keep at least 2.75rem targets in both densities.

Theme-aware shadows use `--miqal-shadow-sm/md/lg` and `shadow-miqal-sm/md/lg`.
Layers use `--miqal-layer-base/sticky/dropdown/overlay/dialog/toast/tooltip`.
Floating product content uses these roles rather than arbitrary escalating z-index values.

### Primitives and states

- `miqal-button` + `miqal-button-primary/secondary/ghost/danger`; optional `-small` or `-icon` size.
- `miqal-input` supports native disabled and `aria-invalid` states.
- `miqal-surface` supports `data-elevation="1|2"` and `data-selected="true"`.
- `miqal-badge` supports `data-status="success|warning|info|danger"`.
- `miqal-menu` styles real menuitem/separator roles, Radix highlight/disabled attributes, and `data-variant="danger"`.
- `miqal-dialog` and `miqal-overlay` style native or library-managed dialogs; apps own positioning and focus management.

Controls expose focus, hover, disabled, busy, invalid, coarse-pointer, forced-color, and reduced-motion states.
Use real disabled attributes or implement aria-disabled behavior in the app; CSS does not block activation.
Native semantics, labels, keyboard navigation, focus traps, and screen reader announcements remain app responsibilities.



## Ownership

The package owns semantic colors, type/spacing scales, radii, interaction states,
density presets, elevation, layers, focus, selection, and reduced-motion defaults.
Opt-in primitives style shared controls. Apps own composition, density choice, responsive layout,
copy, sketches, navigation behavior, and domain visualization semantics.
Optional canvas/motion layers add explicit opt-in effects. The legacy
theme.css entry point remains decorative; migrated apps use core.css.

Change tokens.json, generate the artifacts, and run package verification.
Review consumer screenshots in both themes before accepting visual changes.
