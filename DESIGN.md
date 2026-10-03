<!-- Generated from tokens.json. Do not edit. -->
# Miqal foundation 0.2.0

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

App identity swatches are decorative branding. Chart colors are categorical,
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

## Ownership

The package owns semantic colors, font roles, radii, focus, selection, and
reduced-motion defaults. Apps own composition, density, responsive layout,
copy, sketches, navigation behavior, and domain visualization semantics.
Optional canvas/motion layers add explicit opt-in effects. The legacy
theme.css entry point remains decorative; migrated apps use core.css.

Change tokens.json, generate the artifacts, and run package verification.
Review consumer screenshots in both themes before accepting visual changes.
