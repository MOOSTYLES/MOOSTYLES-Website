import { ARDENNE_CATEGORIES } from "../content/ardenne.js";

const normalize = (value) => String(value ?? "").trim().toLowerCase().replace(/[-_\s]+/g, " ");

export const isArdenneMod = (mod) => normalize(mod.collection) === "ardenne";

export const getModsForCatalog = (mods, catalog) =>
  mods.filter((mod) => isArdenneMod(mod) === (catalog === "ardenne"));

export const getArdenneCategories = (mod) => {
  if (!isArdenneMod(mod)) return [];
  const tags = new Set((mod.tags ?? []).map(normalize));
  return ARDENNE_CATEGORIES.filter((category) => category.tags.some((tag) => tags.has(tag)));
};

// Keep held-back category uploads out of every public catalog and detail route.
export const isModPublished = (mod) => getArdenneCategories(mod).every((category) => category.enabled);

export const getModListingPath = (mod) => isArdenneMod(mod) ? "/ardenne/mods" : "/mods";
