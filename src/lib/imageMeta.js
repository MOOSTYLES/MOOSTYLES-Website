import imageMeta from "@/content/imageMeta.json";

// Images uploaded later through the CMS won't have an entry yet, so callers
// pass a fallback (usually the mod name) to keep the alt text meaningful.
export const getImageAlt = (src, fallback = "") => imageMeta[src]?.alt ?? fallback;
