import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { HERO_IMAGES } from "./heroImages";

describe("hero images", () => {
  it("cycles every current image in the hero folder without referencing removed files", () => {
    const files = readdirSync("public/projects/HeroSection");
    const expected = files
      .filter((name) => /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(name))
      .filter((name) => !/\.(png|jpe?g)$/i.test(name) || !files.includes(name.replace(/\.(png|jpe?g)$/i, ".webp")))
      .map((name) => `/projects/HeroSection/${name}`).sort();
    expect([...HERO_IMAGES].sort()).toEqual(expected);
  });
});
