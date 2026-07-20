# @miqal/theme

Shared Tailwind v4 design system for Miqal-branded applications. Provides CSS variables, theme tokens, base styles, and a curated color palette — framework-agnostic, tested across Next.js (React + shadcn/ui) and SvelteKit (Svelte + shadcn-svelte).

## Install

```bash
npm install @miqal/theme tw-animate-css
```

`tw-animate-css` is required (provides Tailwind animation utilities used by the theme and shadcn components).

## Quick Start

### Next.js (React + shadcn/ui)

**1. Import the theme** in `app/globals.css`:

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import '@miqal/theme/theme.css';
```

**2. Load fonts** in your root layout (`app/layout.tsx`):

```tsx
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**3. Dark mode toggle** — the theme uses a `.dark` class on `<html>`. Use `next-themes`:

```bash
npm install next-themes
```

```tsx
import { ThemeProvider } from 'next-themes';

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

### SvelteKit (Svelte + shadcn-svelte)

**1. Import the theme** in `src/app.css`:

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import '@miqal/theme/theme.css';
```

**2. Load fonts** in `src/app.html`:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=JetBrains+Mono:wght@400..700&display=swap"
  rel="stylesheet"
/>
```

**3. Dark mode toggle** — use `mode-watcher`:

```bash
npm install mode-watcher
```

```svelte
<!-- +layout.svelte -->
<script>
  import { ModeWatcher } from 'mode-watcher';
</script>
<ModeWatcher />
```

## Custom Fonts

Override the font stack by redefining the CSS variables anywhere after the import:

```css
@import '@miqal/theme/theme.css';

:root {
  --font-inter: 'Your Custom Sans', ui-sans-serif, system-ui, sans-serif;
  --font-jetbrains-mono: 'Your Custom Mono', ui-monospace, monospace;
}
```

## Design Tokens

| Token | Light | Dark | Role |
|---|---|---|---|
| `--primary` | `oklch(0.55 0.18 212)` #2563eb | `oklch(0.72 0.17 212)` #60a5fa | Brand accent |
| `--background` | `oklch(1 0 0)` #ffffff | `oklch(0.145 0 0)` #1c1c1d | Page surface |
| `--foreground` | `oklch(0.145 0 0)` #1c1c1d | `oklch(0.985 0 0)` #fafafa | Primary text |
| `--card` | `oklch(1 0 0)` #ffffff | `oklch(0.205 0 0)` #28282a | Card surface |
| `--muted` | `oklch(0.97 0 0)` #f5f5f5 | `oklch(0.269 0 0)` #343437 | Muted surface |
| `--border` | `oklch(0.922 0 0)` #e4e4e7 | `oklch(1 0 0 / 10%)` | Borders |
| `--ring` | `oklch(0.65 0.14 212)` #60a5fa | `oklch(0.55 0.15 212)` #3b82f6 | Focus ring |
| `--radius` | `0.75rem` | `0.75rem` | Base radius |
| `--destructive` | `oklch(0.58 0.22 27)` #dc2626 | `oklch(0.704 0.191 22)` #ef4444 | Error/danger |

Full token reference: `@miqal/theme/tokens.json`

### Radius scale

| Class | Value |
|---|---|
| `rounded-sm` | 0.45rem |
| `rounded-md` | 0.6rem |
| `rounded-lg` | 0.75rem |
| `rounded-xl` | 1.05rem |
| `rounded-2xl` | 1.35rem |
| `rounded-3xl` | 1.65rem |
| `rounded-4xl` | 1.95rem |

### Background pattern

Every page gets a dot grid (28px spacing) with blue-tinted radial gradients for ambient lighting. The pattern adapts to `.dark` mode automatically.

## Local Development

Link the package locally without publishing:

```bash
# In miqal-theme/
npm link

# In your project/
npm link @miqal/theme
```

Or use a file reference in your project's `package.json`:

```json
{
  "dependencies": {
    "@miqal/theme": "file:../miqal-theme"
  }
}
```

## Publishing

```bash
npm publish --access public
```

The package is scoped (`@miqal/theme`). Set up your npm org first:

```bash
npm org create miqal
```

## Files

| File | Purpose |
|---|---|
| `theme.css` | CSS variables, `@theme inline`, base styles, animation |
| `tokens.json` | Machine-readable design token reference |
| `package.json` | npm metadata and exports |

## Requirements

- **Tailwind CSS v4** (CSS-first configuration via `@import 'tailwindcss'`)
- **tw-animate-css** (`^1.4.0`) for animation utilities
