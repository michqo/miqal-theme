# @miqal/theme

Tailwind v4 design tokens + base styles for Miqal apps. Next.js (shadcn/ui) and SvelteKit (shadcn-svelte).

## Upcoming ecosystem foundation

The portfolio design approved on 2026-10-03 is the reference for the next shared
foundation. See the [ecosystem rollout plan](docs/ecosystem-rollout-2026-10-03.md)
and its [observed token snapshot](docs/portfolio-baseline.tokens.json). This plan
updates the older 0.2 visual assumptions and includes both Next.js and SvelteKit.
The implementation documented below remains the current `0.1.1` behavior.

## Install

```bash
npm install @miqal/theme
```

## Use

```css
/* app/globals.css (Next.js) or src/app.css (SvelteKit) */
@import 'tailwindcss';
@import '@miqal/theme/theme.css';
```

That's it. All tokens (`bg-primary`, `text-foreground`, `rounded-lg`, etc.) work immediately. Body gets dot-grid background + blue ambient gradients. `.dark` class triggers dark mode.

### Fonts

**Next.js** — `app/layout.tsx`:
```tsx
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**SvelteKit** — `src/app.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=JetBrains+Mono:wght@400..700&display=swap" rel="stylesheet">
```

Override fonts by redefining `--font-inter` / `--font-jetbrains-mono` anywhere after the import.

### Dark mode

Theme watches `.dark` on `<html>`. Add a toggle:

- Next.js: [`next-themes`](https://github.com/pacocoursey/next-themes) — `<ThemeProvider attribute="class">`
- SvelteKit: [`mode-watcher`](https://github.com/svecosystem/mode-watcher) — `<ModeWatcher />`

## Tokens

Primary hue: **212** (blue). Canonical values in `tokens.json`.

| Token | Light | Dark |
|---|---|---|
| `--primary` | `oklch(0.55 0.18 212)` ≈ #2563eb | `oklch(0.72 0.17 212)` ≈ #60a5fa |
| `--background` | `oklch(1 0 0)` ≈ #fff | `oklch(0.145 0 0)` ≈ #1c1c1d |
| `--foreground` | `oklch(0.145 0 0)` ≈ #1c1c1d | `oklch(0.985 0 0)` ≈ #fafafa |
| `--card` | `oklch(1 0 0)` ≈ #fff | `oklch(0.205 0 0)` ≈ #28282a |
| `--muted` | `oklch(0.97 0 0)` ≈ #f5f5f5 | `oklch(0.269 0 0)` ≈ #343437 |
| `--border` | `oklch(0.922 0 0)` ≈ #e4e4e7 | `oklch(1 0 0 / 10%)` |
| `--ring` | `oklch(0.65 0.14 212)` ≈ #60a5fa | `oklch(0.55 0.15 212)` ≈ #3b82f6 |
| `--radius` | `0.75rem` | `0.75rem` |
| `--destructive` | `oklch(0.58 0.22 27)` ≈ #dc2626 | `oklch(0.704 0.191 22)` ≈ #ef4444 |

Radius scale: `sm` 0.45rem → `md` 0.6rem → `lg` 0.75rem → `xl` 1.05rem → `2xl` 1.35rem → `3xl` 1.65rem → `4xl` 1.95rem.

## Local dev

```bash
npm link                    # in this repo
npm link @miqal/theme       # in consuming project
```

Or:

```json
"dependencies": { "@miqal/theme": "file:../miqal-theme" }
```

## Publish

```bash
npm publish --access public
```
