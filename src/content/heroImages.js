// Discover the current banners at build time, so folder additions and removals
// automatically update both the carousel and prerendered image metadata.
export const HERO_IMAGES = Object.keys(
  import.meta.glob("/public/projects/HeroSection/*", { eager: true, query: "?url", import: "default" })
)
  .filter((path) => /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(path))
  .map((path) => path.replace(/^\/public/, ""))
  .sort();
