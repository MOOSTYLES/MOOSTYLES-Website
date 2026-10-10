import { describe, expect, it } from "vitest";
import { getArdenneCategories, getModListingPath, getModsForCatalog, isArdenneMod, isModPublished } from "./modCatalog";
import { ARDENNE_CATEGORIES, LIVE_ARDENNE_CATEGORIES, ARDENNE_PUBLIC_COPY } from "../content/ardenne";

const mods = [
  { slug: "tourer", collection: "ARDENNE", tags: ["Automobiles", "luxury"] },
  { slug: "sailing", collection: " ardenne ", tags: ["Yachts"] },
  { slug: "jet", collection: "Ardenne", tags: ["private-aviation"] },
  { slug: "desk", collection: "Halo", tags: ["Automobiles"] },
  { slug: "shelf", tags: [] },
  { slug: "untagged", collection: "ARDENNE" },
];

describe("CMS collection routing", () => {
  it("sends ARDENNE uploads exclusively to its catalog, regardless of tags", () => {
    expect(getModsForCatalog(mods, "ardenne").map((mod) => mod.slug)).toEqual([
      "tourer", "sailing", "jet", "untagged",
    ]);
    expect(getModsForCatalog(mods, "standard").map((mod) => mod.slug)).toEqual(["desk", "shelf"]);
  });

  it("matches the whole collection name and tolerates CMS whitespace and case", () => {
    expect(isArdenneMod({ collection: "  aRdEnNe  " })).toBe(true);
    expect(isArdenneMod({ collection: "ARDENNE inspired" })).toBe(false);
    expect(isArdenneMod({ collection: "" })).toBe(false);
    expect(isArdenneMod({})).toBe(false);
  });

  it("returns each mod to its own listing from the shared detail page", () => {
    expect(getModListingPath(mods[0])).toBe("/ardenne/mods");
    expect(getModListingPath(mods[3])).toBe("/mods");
  });
});

describe("temporarily unpublished ARDENNE aviation", () => {
  it("keeps aviation content in storage while exposing only land and sea", () => {
    expect(ARDENNE_CATEGORIES.map((category) => category.id)).toContain("private-aviation");
    expect(LIVE_ARDENNE_CATEGORIES.map((category) => category.id)).toEqual(["automobiles", "yachts"]);
    expect(ARDENNE_PUBLIC_COPY.categories).toBe("automobiles and yachts");
    expect(ARDENNE_PUBLIC_COPY.worlds).toBe("Land. Sea.");
  });

  it.each(["Private Aviation", "private-aviation", "AIRCRAFT", "private jet", "planes"])("holds back an ARDENNE upload tagged %s", (tag) => {
    expect(isModPublished({ collection: " ARDENNE ", tags: [tag] })).toBe(false);
  });

  it("keeps ordinary ARDENNE categories, uncategorised uploads and other collections live", () => {
    expect(isModPublished(mods[0])).toBe(true);
    expect(isModPublished(mods[1])).toBe(true);
    expect(isModPublished(mods[5])).toBe(true);
    expect(isModPublished({ collection: "Halo", tags: ["aviation"] })).toBe(true);
  });

  it("does not publish a held-back aircraft through a second category tag", () => {
    expect(isModPublished({ collection: "ARDENNE", tags: ["aircraft", "Automobiles"] })).toBe(false);
  });
});

describe("ARDENNE tag labels", () => {
  it.each([
    ["Automobiles", "automobiles", "Automobiles"],
    ["car", "automobiles", "Automobiles"],
    ["Yachts", "yachts", "Yachts"],
    ["yacht", "yachts", "Yachts"],
    ["Private Aviation", "private-aviation", "Private Aviation"],
    [" PRIVATE_AVIATION ", "private-aviation", "Private Aviation"],
    ["aircraft", "private-aviation", "Private Aviation"],
  ])("labels the %s tag correctly", (tag, id, label) => {
    const categories = getArdenneCategories({ collection: "ARDENNE", tags: [tag] });
    expect(categories.map((category) => ({ id: category.id, label: category.label }))).toEqual([{ id, label }]);
  });

  it("ignores unrelated tags and keeps all matching category labels without duplicates", () => {
    const mod = { collection: "ARDENNE", tags: ["luxury", "Yachts", "car", "Automobiles"] };
    expect(getArdenneCategories(mod).map((category) => category.label)).toEqual(["Automobiles", "Yachts"]);
  });

  it("does not assign ARDENNE categories to other collections or invent a type for untagged mods", () => {
    expect(getArdenneCategories(mods[3])).toEqual([]);
    expect(getArdenneCategories(mods[5])).toEqual([]);
    expect(getArdenneCategories({ collection: "ARDENNE", tags: ["luxury"] })).toEqual([]);
  });
});
