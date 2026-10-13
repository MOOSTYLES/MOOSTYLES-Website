import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { HERO_IMAGES } from "./heroImages";

describe("hero images", () => {
  it("cycles every current image in the hero folder without referencing removed files", () => {
    const expected = readdirSync("public/projects/HeroSection")
      .filter((name) => /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(name))
      .map((name) => `/projects/HeroSection/${name}`).sort();
    expect([...HERO_IMAGES].sort()).toEqual(expected);
  });
});
