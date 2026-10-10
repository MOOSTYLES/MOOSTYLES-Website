import { assignModIds } from "@/lib/modIds";
import modIdAliases from "@/content/modIdAliases.json";
import { getModsForCatalog, isArdenneMod, isModPublished } from "@/lib/modCatalog";

const modules = import.meta.glob("/src/content/mods/*.json", { eager: true });

// Sveltia can omit optional lists. Give every consumer the same shape without
// changing the uploaded JSON or the mod's stored ID.
export const normalizeMod = (mod) => ({
  ...mod,
  tags: mod.tags ?? [],
  media: {
    ...mod.media,
    previews: mod.media?.previews ?? [],
    screenshots: mod.media?.screenshots ?? [],
  },
  legacy: { isArchiveItem: false, isNew: true, ...mod.legacy },
});

const storedMods = assignModIds(Object.values(modules).map((mod) => normalizeMod(mod.default ?? mod))).sort(
  (a, b) => a.name.localeCompare(b.name)
);

for (const mod of storedMods) {
  if (!Array.isArray(mod.fileManifest) || mod.fileManifest.length === 0) {
    throw new Error(`Mod "${mod.slug}" has an empty fileManifest.`);
  }
}

// Assign IDs before filtering so enabling a category later doesn't renumber mods.
const allMods = storedMods.filter(isModPublished);

const bySlug = new Map(allMods.map((mod) => [mod.slug, mod]));
const byLegacyId = new Map(allMods.map((mod) => [mod.legacyId, mod]));

// IDs from before the 2026-10 renumbering (e.g. archive-017, MOD-01), so old
// links and saved-mod cookies still resolve.
for (const [oldId, newId] of Object.entries(modIdAliases)) {
  if (byLegacyId.has(newId)) byLegacyId.set(oldId, byLegacyId.get(newId));
}

export const getAllMods = () => allMods;

export const getStandardMods = () => getModsForCatalog(allMods, "standard");

export const getArdenneMods = () => getModsForCatalog(allMods, "ardenne");

export const getActiveMods = () => allMods.filter((mod) => !mod.legacy.isArchiveItem);

export const getModBySlug = (slug) => bySlug.get(slug) ?? null;

export const getModByAnyId = (idOrSlug) =>
  bySlug.get(idOrSlug) ?? byLegacyId.get(idOrSlug) ?? null;

export const getPubliclyAvailableMods = () => {
  const now = Date.now();
  return allMods.filter((mod) => {
    const publicDate = mod.downloadOptions.public?.date;
    if (!mod.downloadOptions.public?.url) return false;
    if (!publicDate) return true;
    return new Date(publicDate).getTime() <= now;
  });
};

export const getRelatedMods = (slug, limit = 4) => {
  const mod = getModByAnyId(slug);
  if (!mod) return [];
  return allMods
    .filter(
      (other) =>
        other.slug !== mod.slug &&
        isArdenneMod(other) === isArdenneMod(mod) &&
        ((other.tags ?? []).some((tag) => (mod.tags ?? []).includes(tag)) ||
          (mod.collection && other.collection === mod.collection))
    )
    .slice(0, limit);
};

export const getGalleryEntries = () =>
  allMods.flatMap((mod) =>
    mod.media.screenshots.map((src, index) => ({
      src,
      modName: mod.name,
      modSlug: mod.slug,
      key: `${mod.slug}-${index}`,
    }))
  );
