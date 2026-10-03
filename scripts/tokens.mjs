import { readFileSync } from "node:fs";
import { clampRgb, converter, formatHex, parse, wcagContrast } from "culori";

export const root = new URL("../", import.meta.url);
export const requiredColors = [
  "background", "foreground", "card", "card-foreground", "popover", "popover-foreground",
  "primary", "primary-foreground", "secondary", "secondary-foreground", "muted", "muted-foreground",
  "accent", "accent-foreground", "destructive", "destructive-foreground", "success", "success-foreground",
  "warning", "warning-foreground", "info", "info-foreground", "border", "input", "ring",
  "chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "sidebar", "sidebar-foreground",
  "sidebar-primary", "sidebar-primary-foreground", "sidebar-accent", "sidebar-accent-foreground",
  "sidebar-border", "sidebar-ring", "app-weather", "app-subnify", "app-sleep", "app-obedy",
];

export function resolveColor(tokens, mode, name, stack = []) {
  if (stack.includes(name)) throw new Error(`Circular color alias: ${[...stack, name].join(" -> ")}`);
  const value = tokens.colors?.[mode]?.[name];
  if (typeof value !== "string") throw new Error(`Missing color: ${mode}.${name}`);
  const alias = value.match(/^\{([a-z0-9-]+)\}$/);
  return alias ? resolveColor(tokens, mode, alias[1], [...stack, name]) : value;
}

const rgb = converter("rgb");
export function displayColor(value) {
  if (!parse(value)) throw new Error(`Invalid CSS color: ${value}`);
  return rgb(clampRgb(value));
}

export function contrast(foreground, background) {
  const fg = displayColor(foreground), bg = displayColor(background);
  if ((bg.alpha ?? 1) !== 1) throw new Error("Contrast surface must be opaque");
  const alpha = fg.alpha ?? 1;
  const composite = { mode: "rgb", r: fg.r * alpha + bg.r * (1 - alpha),
    g: fg.g * alpha + bg.g * (1 - alpha), b: fg.b * alpha + bg.b * (1 - alpha) };
  return wcagContrast(composite, bg);
}

export function colorHex(value) {
  const color = displayColor(value);
  return `${formatHex(color)}${(color.alpha ?? 1) < 1 ? ` / ${Math.round(color.alpha * 100)}%` : ""}`;
}

export function validateTokens(tokens) {
  if (tokens.name !== "miqal" || !/^\d+\.\d+\.\d+$/.test(tokens.version) || tokens.colorSpace !== "oklch") {
    throw new Error("Invalid token identity/version/color space");
  }
  for (const mode of ["light", "dark"]) {
    const keys = Object.keys(tokens.colors?.[mode] ?? {});
    if (keys.length !== requiredColors.length || requiredColors.some(name => !keys.includes(name))) {
      throw new Error(`Expected complete semantic color set in ${mode}`);
    }
    for (const name of keys) displayColor(resolveColor(tokens, mode, name));
  }
  for (const role of ["sans", "mono"]) {
    const fonts = tokens.typography?.[role];
    if (!Array.isArray(fonts) || !fonts.length || fonts.some(font => typeof font !== "string" || /[;{}]/.test(font))) {
      throw new Error(`Invalid typography role: ${role}`);
    }
  }
  if (!/^\d+(\.\d+)?rem$/.test(tokens.radius?.base)) throw new Error("Radius must use rem units");
  for (const name of ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"]) {
    if (!(tokens.radius.scale?.[name] > 0)) throw new Error(`Invalid radius: ${name}`);
  }
  for (const role of ["feedback", "overlay", "layout", "exit"]) {
    if (!/^\d+ms$/.test(tokens.motion?.[role]) || parseInt(tokens.motion[role]) > 500) throw new Error(`Invalid motion: ${role}`);
  }
  if (!/^cubic-bezier\([\d.,\s]+\)$/.test(tokens.motion?.ease)) throw new Error("Invalid motion easing");
  if (!/^\d+px$/.test(tokens.legacyCanvas?.grid)) throw new Error("Invalid legacy grid size");
  for (const mode of ["light", "dark"]) for (const name of ["dot", "glow"]) displayColor(tokens.legacyCanvas?.[mode]?.[name]);

  const contracts = tokens.accessibility?.contracts;
  if (!Array.isArray(contracts) || !contracts.length) throw new Error("Missing contrast contracts");
  const requiredContracts = [];
  for (const surface of ["background", "card", "popover", "secondary", "muted"]) {
    for (const foreground of ["foreground", "muted-foreground", "primary"]) requiredContracts.push([foreground, surface, "text"]);
  }
  for (const surface of ["card", "popover", "primary", "secondary", "accent", "destructive", "success", "warning", "info", "sidebar", "sidebar-primary", "sidebar-accent"]) {
    requiredContracts.push([`${surface}-foreground`, surface, "text"]);
  }
  for (const surface of ["background", "card", "popover"]) {
    for (const foreground of ["input", "ring", "chart-1", "chart-2", "chart-3", "chart-4", "chart-5"]) requiredContracts.push([foreground, surface, "non-text"]);
  }
  for (const [foreground, background, role] of requiredContracts) {
    if (!contracts.some(contract => contract.foreground === foreground && contract.background === background && contract.role === role)) {
      throw new Error(`Missing contrast contract: ${foreground} on ${background} (${role})`);
    }
  }
  const failures = [];
  for (const mode of ["light", "dark"]) for (const contract of contracts) {
    if (!["text", "non-text"].includes(contract.role) || !Number.isFinite(contract.min) || contract.min < (contract.role === "text" ? 4.5 : 3)) {
      throw new Error("Invalid contrast contract threshold/role");
    }
    const fg = resolveColor(tokens, mode, contract.foreground), bg = resolveColor(tokens, mode, contract.background);
    if (contract.role === "text" && (displayColor(fg).alpha ?? 1) !== 1) throw new Error("Text colors must be opaque");
    const ratio = contrast(fg, bg);
    if (ratio < contract.min) failures.push(`${mode}.${contract.foreground} on ${contract.background}: ${ratio.toFixed(2)} < ${contract.min}`);
  }
  if (failures.length) throw new Error(`Contrast contracts failed:\n${failures.join("\n")}`);
  return tokens;
}

export function loadTokens() {
  const tokens = validateTokens(JSON.parse(readFileSync(new URL("tokens.json", root), "utf8")));
  const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
  if (tokens.version !== pkg.version) throw new Error("Package and token versions differ");
  return tokens;
}
