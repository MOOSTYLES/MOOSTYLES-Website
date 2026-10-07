import { getActiveMods, getModByAnyId } from "@/lib/mods";

const toLegacyProduct = (mod) => {
  const images = [mod.media.banner, ...mod.media.previews].filter(Boolean);
  const downloadLink = mod.downloadOptions.public?.url ?? null;
  const patreonLink = mod.downloadOptions.patreonUrl ?? null;
  return {
    id: mod.legacyId,
    slug: mod.slug,
    name: mod.name,
    brand: mod.collection ? "Collections" : "Individual",
    category: mod.legacy.isArchiveItem ? "archive" : "inZOI",
    image: images[0] || "",
    images,
    description: mod.description,
    detailedDescription: mod.description,
    features: mod.highlights || [],
    tags: mod.tags.length ? mod.tags : mod.legacy.isArchiveItem ? ["archive"] : [],
    isNew: mod.legacy.isNew,
    downloadlink: downloadLink,
    downloadLink,
    patreonlink: patreonLink,
    patreonLink,
    howToUse: (mod.installation || []).join("\n\n"),
    createdAt: mod.dateAdded || null,
  };
};

export const getAllProducts = () => getActiveMods().map(toLegacyProduct);

export const getProductById = (id) => {
  const mod = getModByAnyId(id);
  return mod ? toLegacyProduct(mod) : null;
};
