import { describe, expect, it } from "vitest";
import { getAllMods, getGalleryEntries, normalizeMod } from "./mods";
import existingMod from "../content/mods/halo-executive-chair.json";

describe("gallery coverage", () => {
  it("includes every published mod's additional images and excludes covers and videos", () => {
    const entries = getGalleryEntries();
    for (const mod of getAllMods()) {
      const expected = [...new Set([...mod.media.previews, ...mod.media.screenshots])]
        .filter((src) => src !== mod.media.banner && !/\.mp4(\?|$)/i.test(src));
      expect(entries.filter((entry) => entry.modSlug === mod.slug).map((entry) => entry.src).sort())
        .toEqual(expected.sort());
    }
    expect(new Set(entries.map((entry) => entry.key)).size).toBe(entries.length);
  });

  it("shows newer mods first while preserving existing screenshot URLs", () => {
    const entries = getGalleryEntries();
    const mods = new Map(getAllMods().map((mod) => [mod.slug, mod]));
    const dates = entries.map((entry) => Date.parse(mods.get(entry.modSlug).dateAdded) || 0);
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
    for (const mod of getAllMods()) {
      mod.media.screenshots.forEach((src, index) => {
        if (src !== mod.media.banner && !/\.mp4(\?|$)/i.test(src)) {
          expect(entries).toContainEqual({ src, modName: mod.name, modSlug: mod.slug, key: `${mod.slug}-${index}` });
        }
      });
    }
  });
});

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
