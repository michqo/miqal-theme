// Optional system styles are generated alongside core from canonical tokens.
export function systemMappings(tokens) {
  return [
    ...Object.keys(tokens.typography.scale).flatMap(name => [
      `  --text-miqal-${name}: var(--miqal-type-${name});`,
      `  --text-miqal-${name}--line-height: var(--miqal-leading-${name});`,
      `  --text-miqal-${name}--font-weight: var(--miqal-weight-${name});`,
      `  --text-miqal-${name}--letter-spacing: var(--miqal-tracking-${name});`,
    ]),
    ...Object.keys(tokens.shadows.light).map(name => `  --shadow-miqal-${name}: var(--miqal-shadow-${name});`),
  ].join("\n");
}

export function systemVariables(tokens) {
  return [
    ...Object.entries(tokens.space).map(([name, value]) => `  --miqal-space-${name}: ${value};`),
    ...Object.entries(tokens.typography.scale).flatMap(([name, type]) => [
      `  --miqal-type-${name}: ${type.size};`, `  --miqal-leading-${name}: ${type.lineHeight};`,
      `  --miqal-weight-${name}: ${type.weight};`, `  --miqal-tracking-${name}: ${type.tracking};`,
    ]),
    ...Object.entries(tokens.radius.scale).map(([name, factor]) => `  --miqal-radius-${name}: calc(var(--radius) * ${factor});`),
    ...Object.entries(tokens.density).flatMap(([name, density]) => [
      `  --miqal-control-height-${name}: ${density.controlHeight};`,
      `  --miqal-row-height-${name}: ${density.rowHeight};`,
      `  --miqal-control-padding-${name}: ${density.controlPadding};`,
    ]),
    "  --miqal-control-height: var(--miqal-control-height-comfortable);",
    "  --miqal-row-height: var(--miqal-row-height-comfortable);",
    "  --miqal-control-padding: var(--miqal-control-padding-comfortable);",
    `  --miqal-touch-target: ${tokens.interaction.touchTarget};`,
    `  --miqal-focus-width: ${tokens.interaction.focusWidth};`,
    `  --miqal-focus-offset: ${tokens.interaction.focusOffset};`,
    `  --miqal-disabled-opacity: ${tokens.interaction.disabledOpacity};`,
    ...Object.entries(tokens.layers).map(([name, value]) => `  --miqal-layer-${name}: ${value};`),
    shadowVariables(tokens, "light"),
  ].join("\n");
}

export function shadowVariables(tokens, mode) {
  return Object.entries(tokens.shadows[mode]).map(([name, value]) => `  --miqal-shadow-${name}: ${value};`).join("\n");
}

export function renderComponents(tokens) {
  const typeClasses = Object.keys(tokens.typography.scale).map(name => `  .miqal-text-${name} { font-size: var(--miqal-type-${name}); line-height: var(--miqal-leading-${name}); font-weight: var(--miqal-weight-${name}); letter-spacing: var(--miqal-tracking-${name}); }`).join("\n");
  return `/* Generated from tokens.json by scripts/generate.mjs. Do not edit. */
/* Opt-in, framework-independent visual primitives. Behavior and semantics belong to the app. */
@layer components {
  [data-density="comfortable"] {
    --miqal-control-height: var(--miqal-control-height-comfortable);
    --miqal-row-height: var(--miqal-row-height-comfortable);
    --miqal-control-padding: var(--miqal-control-padding-comfortable);
  }
  [data-density="compact"] {
    --miqal-control-height: var(--miqal-control-height-compact);
    --miqal-row-height: var(--miqal-row-height-compact);
    --miqal-control-padding: var(--miqal-control-padding-compact);
  }
${typeClasses}
  .miqal-button {
    display: inline-flex; align-items: center; justify-content: center; gap: var(--miqal-space-2);
    min-block-size: var(--miqal-control-height); padding: var(--miqal-space-2) var(--miqal-control-padding);
    border: 1px solid var(--input); border-radius: var(--miqal-radius-md);
    background: var(--card); color: var(--card-foreground); font-family: var(--miqal-font-sans);
    font-size: var(--miqal-type-label); font-weight: 500; line-height: var(--miqal-leading-label);
    white-space: nowrap; cursor: pointer; touch-action: manipulation;
    transition: color var(--motion-feedback, ${tokens.motion.feedback}) var(--motion-ease, ${tokens.motion.ease}), background-color var(--motion-feedback, ${tokens.motion.feedback}) var(--motion-ease, ${tokens.motion.ease}), border-color var(--motion-feedback, ${tokens.motion.feedback}) var(--motion-ease, ${tokens.motion.ease});
  }
  .miqal-button > svg { flex-shrink: 0; }
  .miqal-button-primary { background: var(--primary); color: var(--primary-foreground); border-color: var(--primary); }
  .miqal-button-secondary { background: var(--card); color: var(--card-foreground); }
  .miqal-button-ghost { background: transparent; color: var(--muted-foreground); border-color: transparent; }
  .miqal-button-danger { background: var(--destructive); color: var(--destructive-foreground); border-color: var(--destructive); }
  .miqal-button-small { min-block-size: var(--miqal-control-height-compact); padding-inline: var(--miqal-space-3); }
  .miqal-button-icon { inline-size: var(--miqal-control-height); min-inline-size: var(--miqal-control-height); padding: 0; }
  .miqal-button:disabled, .miqal-button[aria-disabled="true"] { opacity: var(--miqal-disabled-opacity); cursor: not-allowed; }
  .miqal-button[aria-busy="true"] { cursor: progress; }
  .miqal-input {
    inline-size: 100%; min-inline-size: 0; min-block-size: var(--miqal-control-height);
    padding: var(--miqal-space-2) var(--miqal-control-padding); border: 1px solid var(--input);
    border-radius: var(--miqal-radius-md); background: var(--background); color: var(--foreground);
    font-family: var(--miqal-font-sans); font-size: var(--miqal-type-body); line-height: var(--miqal-leading-body);
  }
  .miqal-input::placeholder { color: var(--muted-foreground); opacity: 1; }
  .miqal-input:disabled { opacity: var(--miqal-disabled-opacity); cursor: not-allowed; }
  .miqal-input[aria-invalid="true"] { border-color: var(--destructive); }
  .miqal-input:focus-visible, .miqal-button:focus-visible, .miqal-menu [role="menuitem"]:focus-visible {
    outline: var(--miqal-focus-width) solid var(--ring); outline-offset: var(--miqal-focus-offset);
  }
  .miqal-surface { background: var(--card); color: var(--card-foreground); border: 1px solid var(--border); border-radius: var(--miqal-radius-lg); }
  .miqal-surface[data-elevation="1"] { box-shadow: var(--miqal-shadow-sm); }
  .miqal-surface[data-elevation="2"] { box-shadow: var(--miqal-shadow-md); }
  .miqal-surface[data-selected="true"] { background: var(--surface-selected); }
  .miqal-badge { display: inline-flex; align-items: center; gap: var(--miqal-space-1); padding: var(--miqal-space-1) var(--miqal-space-2); border-radius: var(--miqal-radius-sm); background: var(--secondary); color: var(--secondary-foreground); font-size: var(--miqal-type-caption); font-weight: 500; line-height: var(--miqal-leading-caption); }
  .miqal-badge[data-status="success"] { background: var(--success); color: var(--success-foreground); }
  .miqal-badge[data-status="warning"] { background: var(--warning); color: var(--warning-foreground); }
  .miqal-badge[data-status="info"] { background: var(--info); color: var(--info-foreground); }
  .miqal-badge[data-status="danger"] { background: var(--destructive); color: var(--destructive-foreground); }
  .miqal-menu { min-inline-size: 12rem; padding: var(--miqal-space-1); border: 1px solid var(--border); border-radius: var(--miqal-radius-lg); background: var(--popover); color: var(--popover-foreground); box-shadow: var(--miqal-shadow-md); z-index: var(--miqal-layer-dropdown); }
  .miqal-menu [role="menuitem"] { display: flex; align-items: center; gap: var(--miqal-space-2); min-block-size: var(--miqal-control-height); padding-inline: var(--miqal-space-3); border-radius: var(--miqal-radius-sm); font-size: var(--miqal-type-label); cursor: pointer; }
  .miqal-menu [role="menuitem"][data-highlighted] { background: var(--surface-hover); }
  .miqal-menu [role="menuitem"][aria-disabled="true"], .miqal-menu [role="menuitem"][data-disabled] { opacity: var(--miqal-disabled-opacity); cursor: not-allowed; }
  .miqal-menu [role="separator"] { block-size: 1px; background: var(--border); margin: var(--miqal-space-1); }
  .miqal-menu [data-variant="danger"] { color: var(--destructive); }
  .miqal-dialog { padding: var(--miqal-space-6); border: 1px solid var(--border); border-radius: var(--miqal-radius-xl); background: var(--popover); color: var(--popover-foreground); box-shadow: var(--miqal-shadow-lg); }
  .miqal-dialog::backdrop, .miqal-overlay { background: var(--overlay); }
  .miqal-overlay { position: fixed; inset: 0; z-index: var(--miqal-layer-overlay); }
  @media (hover: hover) {
    .miqal-button:not(:disabled):not([aria-disabled="true"]):hover { background: var(--surface-hover); }
    .miqal-button-primary:not(:disabled):not([aria-disabled="true"]):hover { background: var(--primary-hover); border-color: var(--primary-hover); }
    .miqal-button-danger:not(:disabled):not([aria-disabled="true"]):hover { background: var(--destructive); filter: brightness(0.92); }
  }
  @media (pointer: coarse) {
    .miqal-button, .miqal-input, .miqal-menu [role="menuitem"] { min-block-size: var(--miqal-touch-target); }
    .miqal-button-icon { min-inline-size: var(--miqal-touch-target); }
  }
  @media (forced-colors: active) {
    .miqal-button, .miqal-input, .miqal-surface, .miqal-badge, .miqal-menu, .miqal-dialog { border-color: ButtonText; }
    .miqal-button:focus-visible, .miqal-input:focus-visible { outline-color: Highlight; }
    .miqal-surface[data-selected="true"] { outline: 2px solid Highlight; }
  }
}
`;
}

export function systemReference(tokens) {
  const rows = Object.entries(tokens.typography.scale).map(([name, type]) => `| \`${name}\` | ${type.size} | ${type.lineHeight} | ${type.weight} | ${type.tracking} |`).join("\n");
  return `## Interface system (opt-in)

Import \`system.css\` after Tailwind for core + motion + namespaced visual primitives.
Importing core alone retains the existing foundation without styling controls.
Shared CSS supplies appearance; apps retain accessible semantics and behavior.

### Type scale

| Role | Size | Line height | Weight | Tracking |
| --- | --- | --- | --- | --- |
${rows}

Use \`--miqal-type-body\` / \`--miqal-leading-body\` in CSS,
\`text-miqal-body\` in Tailwind, or \`miqal-text-body\` with components.css.
The spacing scale is a 0.25rem step, exposed as \`--miqal-space-{1,2,3,4,5,6,8,10,12,16}\`.
Radii also have real runtime variables, \`--miqal-radius-sm\` through \`--miqal-radius-4xl\`.

### Density, elevation and layering

Comfortable controls: ${tokens.density.comfortable.controlHeight}; rows: ${tokens.density.comfortable.rowHeight}.
Compact controls: ${tokens.density.compact.controlHeight}; rows: ${tokens.density.compact.rowHeight}.
Set \`data-density="compact"\` on a product container. Nested comfortable regions can reset it.
Coarse-pointer controls keep at least ${tokens.interaction.touchTarget} targets in both densities.

Theme-aware shadows use \`--miqal-shadow-sm/md/lg\` and \`shadow-miqal-sm/md/lg\`.
Layers use \`--miqal-layer-base/sticky/dropdown/overlay/dialog/toast/tooltip\`.
Floating product content uses these roles rather than arbitrary escalating z-index values.

### Primitives and states

- \`miqal-button\` + \`miqal-button-primary/secondary/ghost/danger\`; optional \`-small\` or \`-icon\` size.
- \`miqal-input\` supports native disabled and \`aria-invalid\` states.
- \`miqal-surface\` supports \`data-elevation="1|2"\` and \`data-selected="true"\`.
- \`miqal-badge\` supports \`data-status="success|warning|info|danger"\`.
- \`miqal-menu\` styles real menuitem/separator roles, Radix highlight/disabled attributes, and \`data-variant="danger"\`.
- \`miqal-dialog\` and \`miqal-overlay\` style native or library-managed dialogs; apps own positioning and focus management.

Controls expose focus, hover, disabled, busy, invalid, coarse-pointer, forced-color, and reduced-motion states.
Use real disabled attributes or implement aria-disabled behavior in the app; CSS does not block activation.
Native semantics, labels, keyboard navigation, focus traps, and screen reader announcements remain app responsibilities.

`;
}
