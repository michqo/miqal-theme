import { appThemeRoles, colorHex, colorSrgb, resolveColor, withAppTheme } from "./tokens.mjs";
import { renderComponents, shadowVariables, systemMappings, systemReference, systemVariables } from "./system.mjs";

const notice = "/* Generated from tokens.json by scripts/generate.mjs. Do not edit. */\n";
const family = fonts => fonts.map(font => /^(ui-|system-ui|sans-serif|monospace)/.test(font) ? font : JSON.stringify(font)).join(", ");
const reduced = `@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`;

function declare(entries) {
  return entries.map(([name, value]) => {
    const alias = value.match(/^\{([a-z0-9-]+)\}$/);
    return `  --${name}: ${alias ? `var(--${alias[1]})` : value};`;
  }).join("\n");
}

const declarations = (tokens, mode) => declare(Object.entries(tokens.colors[mode]));

// Aliases resolve where they are declared, so roles that point at an accent are redeclared in the app scope.
function accentDependents(tokens, mode) {
  const reaches = name => {
    const alias = tokens.colors[mode][name].match(/^\{([a-z0-9-]+)\}$/);
    return !!alias && (appThemeRoles.includes(alias[1]) || reaches(alias[1]));
  };
  return Object.entries(tokens.colors[mode]).filter(([name]) => !appThemeRoles.includes(name) && reaches(name));
}

export function renderAppThemes(tokens) {
  return Object.entries(tokens.appThemes).map(([app, modes]) => {
    const scope = `[data-app="${app}"]`;
    const dark = [`.dark${scope}`, `.dark ${scope}`, `[data-theme="dark"]${scope}`, `[data-theme="dark"] ${scope}`].join(", ");
    return ["light", "dark"].map(mode => `${mode === "light" ? scope : dark} {
${declare([...Object.entries(modes[mode]), ...accentDependents(tokens, mode)])}
}`).join("\n\n");
  }).join("\n\n");
}

export function renderCore(tokens) {
  const mapping = Object.keys(tokens.colors.light).map(name => `  --color-${name}: var(--${name});`).join("\n");
  const radii = Object.entries(tokens.radius.scale).map(([name, factor]) => `  --radius-${name}: ${factor === 1 ? "var(--radius)" : `calc(var(--radius) * ${factor})`};`).join("\n");
  return `${notice}
@custom-variant dark (&:is(.dark *, [data-theme="dark"] *));

@theme inline {
  --font-sans: var(--miqal-font-sans);
  --font-mono: var(--miqal-font-mono);
${mapping}
${radii}
${systemMappings(tokens)}
}

:root {
  --miqal-font-sans: ${family(tokens.typography.sans)};
  --miqal-font-mono: ${family(tokens.typography.mono)};
  --radius: ${tokens.radius.base};
  color-scheme: light;
${declarations(tokens, "light")}
${systemVariables(tokens)}
}

.dark, [data-theme="dark"] {
  color-scheme: dark;
${declarations(tokens, "dark")}
${shadowVariables(tokens, "dark")}
}

${renderAppThemes(tokens)}

@layer base {
  * { @apply border-border; }
  body {
    @apply bg-background text-foreground;
    font-family: var(--miqal-font-sans);
  }
  :where(a, button, summary, input, select, textarea):focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 4px;
  }
  ::selection { background: var(--accent); color: var(--accent-foreground); }
}

${reduced}
`;
}

export function renderCanvas(tokens) {
  return `${notice}
:root { --miqal-canvas-dot: ${tokens.legacyCanvas.light.dot}; --miqal-canvas-glow: ${tokens.legacyCanvas.light.glow}; }
.dark, [data-theme="dark"] { --miqal-canvas-dot: ${tokens.legacyCanvas.dark.dot}; --miqal-canvas-glow: ${tokens.legacyCanvas.dark.glow}; }
.miqal-canvas, .miqal-canvas-quiet {
  background-image: radial-gradient(ellipse 80% 60% at 80% 0%, var(--miqal-canvas-glow), transparent 65%), radial-gradient(var(--miqal-canvas-dot) 1px, transparent 1px);
  background-size: 100% 100%, ${tokens.legacyCanvas.grid} ${tokens.legacyCanvas.grid};
}
.miqal-canvas-quiet { background-image: radial-gradient(var(--miqal-canvas-dot) 1px, transparent 1px); background-size: ${tokens.legacyCanvas.grid} ${tokens.legacyCanvas.grid}; }
`;
}

export function renderMotion(tokens) {
  return `${notice}
:root {
${["feedback", "overlay", "layout", "exit"].map(role => `  --motion-${role}: ${tokens.motion[role]};`).join("\n")}
  --motion-ease: ${tokens.motion.ease};
}
.miqal-motion-feedback { transition-property: color, background-color, border-color, opacity; transition-duration: var(--motion-feedback); transition-timing-function: var(--motion-ease); }
.miqal-motion-overlay { transition-property: opacity, transform; transition-duration: var(--motion-overlay); transition-timing-function: var(--motion-ease); }
.miqal-motion-layout { transition-property: transform; transition-duration: var(--motion-layout); transition-timing-function: var(--motion-ease); }
${reduced}
`;
}

export function renderCompatibility(tokens) {
  return `${notice}
/* Compatibility bundle: legacy fonts and global decoration. Use core.css for the new plain foundation. */
@import "tw-animate-css";
@import "./core.css";
@import "./canvas.css";
@import "./motion.css";

@layer base {
  body {
    --miqal-font-sans: var(--font-inter, "Inter", ui-sans-serif, system-ui, sans-serif);
    --miqal-font-mono: var(--font-jetbrains-mono, "JetBrains Mono", ui-monospace, monospace);
    background-image: radial-gradient(ellipse 80% 60% at 80% 0%, var(--miqal-canvas-glow), transparent 65%), radial-gradient(var(--miqal-canvas-dot) 1px, transparent 1px);
    background-size: 100% 100%, ${tokens.legacyCanvas.grid} ${tokens.legacyCanvas.grid};
  }
}
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
.animate-blink { animation: blink 1.2s step-end infinite; }
@media (prefers-reduced-motion: reduce) { .animate-blink { animation: none; } }
`;
}

export function renderDesign(tokens) {
  const rows = Object.keys(tokens.colors.light).map(name => `| \`${name}\` | \`${resolveColor(tokens,"light",name)}\` | \`${colorHex(resolveColor(tokens,"light",name))}\` | \`${resolveColor(tokens,"dark",name)}\` | \`${colorHex(resolveColor(tokens,"dark",name))}\` |`).join("\n");
  return `<!-- Generated from tokens.json. Do not edit. -->
# Miqal foundation ${tokens.version}

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
accent theme with \`data-app\`, which re-tints the interactive roles. Chart colors are categorical,
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
${rows}

## App accent themes

Set \`data-app="<name>"\` on \`html\`, \`body\`, or a product container to swap the
teal identity for the app's own accent. Only ${appThemeRoles.map(role => `\`${role}\``).join(", ")}
change, together with the sidebar and selected-surface roles that alias them. Neutrals,
status, and chart roles stay shared. Every app theme passes the same contrast contracts
as the default palette in both modes. Works with \`.dark\` and \`[data-theme="dark"]\`.

${appTable(tokens)}

${systemReference(tokens)}

## Ownership

The package owns semantic colors, type/spacing scales, radii, interaction states,
density presets, elevation, layers, focus, selection, and reduced-motion defaults.
Opt-in primitives style shared controls. Apps own composition, density choice, responsive layout,
copy, sketches, navigation behavior, and domain visualization semantics.
Optional canvas/motion layers add explicit opt-in effects. The legacy
theme.css entry point remains decorative; migrated apps use core.css.

Change tokens.json, generate the artifacts, and run package verification.
Review consumer screenshots in both themes before accepting visual changes.
`;
}

function appTable(tokens) {
  const header = `| App | Mode | ${appThemeRoles.map(role => `\`${role}\``).join(" | ")} |\n| --- | --- |${" --- |".repeat(appThemeRoles.length)}`;
  const rows = Object.keys(tokens.appThemes).flatMap(app => ["light", "dark"].map(mode => {
    const theme = withAppTheme(tokens, app);
    return `| \`${app}\` | ${mode} | ${appThemeRoles.map(role => `\`${colorHex(resolveColor(theme, mode, role))}\``).join(" | ")} |`;
  }));
  return [header, ...rows].join("\n");
}

export function renderArtifacts(tokens) {
  return new Map([["core.css",renderCore(tokens)],["canvas.css",renderCanvas(tokens)],["motion.css",renderMotion(tokens)],["components.css",renderComponents(tokens)],["system.css",`${notice}@import "./core.css";\n@import "./motion.css";\n@import "./components.css";\n`],["theme.css",renderCompatibility(tokens)],["DESIGN.md",renderDesign(tokens)],["tokens.srgb.json",renderSrgbTokens(tokens)]]);
}

export function renderSrgbTokens(tokens) {
  const colors = Object.fromEntries(["light", "dark"].map(mode => [mode,
    Object.fromEntries(Object.keys(tokens.colors[mode]).map(name => [name,
      colorSrgb(resolveColor(tokens, mode, name)),
    ])),
  ]));
  const appThemes = Object.fromEntries(Object.keys(tokens.appThemes).map(app => [app,
    Object.fromEntries(["light", "dark"].map(mode => [mode,
      Object.fromEntries(appThemeRoles.map(role => [role, colorSrgb(resolveColor(withAppTheme(tokens, app), mode, role))])),
    ])),
  ]));
  return `${JSON.stringify({name: tokens.name, version: tokens.version, colorSpace: "srgb", colors, appThemes}, null, 2)}\n`;
}
