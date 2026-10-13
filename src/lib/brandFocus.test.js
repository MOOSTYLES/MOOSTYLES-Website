import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

it("keeps focus on the destination main without outlining the entire page", () => {
  const css = readFileSync("src/index.css", "utf8");
  expect(css).toMatch(/:focus-visible\s*\{\s*outline: 2px solid #0d9488/);
  expect(css).toMatch(/\.brand-page main\[tabindex="-1"\]:focus\s*\{\s*outline: none/);
});
