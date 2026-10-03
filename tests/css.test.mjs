import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import test from "node:test";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";
import { root } from "../scripts/tokens.mjs";

for (const entry of ["core.css", "theme.css"]) {
  test(`${entry} compiles through the Tailwind v4 consumer pipeline`, async () => {
    const input = `@import "tailwindcss"; @import "../${entry}"; @source inline("bg-background bg-primary text-primary-foreground font-mono border-input rounded-md dark:bg-card");`;
    const result = await postcss([tailwind({base:fileURLToPath(root)})]).process(input, {
      from:fileURLToPath(new URL(`tests/${entry}.css`, root)),
    });
    assert.ok(result.css.includes("--miqal-font-sans"));
    assert.ok(result.css.includes("--input: oklch(0.58 0.015 85)"));
    assert.ok(result.css.includes(".bg-primary"));
    assert.ok(result.css.includes(".font-mono"));
    assert.equal(result.warnings().length, 0);
    if (entry === "core.css") assert.ok(!result.css.includes("@keyframes blink"));
  });
}
