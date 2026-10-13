// Discover the current banners at build time, so folder additions and removals
// automatically update both the carousel and prerendered image metadata.
const images = Object.keys(
  import.meta.glob("/public/projects/HeroSection/*", { eager: true, query: "?url", import: "default" })
);

export const HERO_IMAGES = images
  .filter((path) => /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(path))
  // Prefer a WebP sibling, while still accepting newly uploaded originals.
  .filter((path) => !/\.(png|jpe?g)$/i.test(path) || !images.includes(path.replace(/\.(png|jpe?g)$/i, ".webp")))
  .map((path) => path.replace(/^\/public/, ""))
  .sort();
