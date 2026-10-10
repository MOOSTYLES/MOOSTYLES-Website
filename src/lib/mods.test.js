import { describe, expect, it } from "vitest";
import { normalizeMod } from "./mods";
import existingMod from "../content/mods/halo-executive-chair.json";

describe("optional CMS fields", () => {
  it("allows an upload with no tags or additional images to reach navigation, listings and detail pages", () => {
    const upload = {
      ...existingMod,
      collection: "ARDENNE",
      tags: undefined,
      media: { banner: "/projects/ARDENNE/automobile.webp" },
      legacy: undefined,
    };
    const mod = normalizeMod(upload);
    expect(mod.tags).toEqual([]);
    expect(mod.media.previews).toEqual([]);
    expect(mod.media.screenshots).toEqual([]);
    expect(mod.legacy.isArchiveItem).toBe(false);
    expect(mod.legacy.isNew).toBe(true);
    expect(upload.media.previews).toBeUndefined();
  });

  it("preserves uploaded images, tags, flags and existing mod metadata", () => {
    expect(normalizeMod(existingMod)).toEqual(existingMod);
  });
});
