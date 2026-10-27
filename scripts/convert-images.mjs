import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});
export const webpPath = (src) => src.replace(/\.(png|jpe?g)$/i, ".webp");
export const encodeWebp = (input, { lossless = false } = {}) => sharp(input)
  .keepIccProfile()
  .webp({ quality: 90, alphaQuality: 100, lossless, effort: 6 })
  .toBuffer();

const main = async () => {
  const publicDir = path.join(root, "public");
  const images = walk(path.join(publicDir, "projects")).filter((file) => /\.(png|jpe?g)$/i.test(file));
  const destinations = new Set();
  for (const file of images) {
    const destination = webpPath(file).toLowerCase();
    if (destinations.has(destination)) throw new Error(`Multiple originals would overwrite ${destination}`);
    destinations.add(destination);
  }
  const replacements = new Map();
  let before = 0;
  let after = 0;
  for (const file of images) {
    const outputPath = webpPath(file);
    const input = fs.readFileSync(file);
    const lossless = /(?:logo|website branding)/i.test(file);
    const output = await encodeWebp(input, { lossless });
    const original = await sharp(input).metadata();
    const converted = await sharp(output).metadata();
    const transparent = original.hasAlpha && (await sharp(input).stats()).channels.at(-1).min < 255;
    if (original.width !== converted.width || original.height !== converted.height || (transparent && !converted.hasAlpha)) {
      throw new Error(`Image dimensions or transparency changed: ${file}`);
    }
    fs.writeFileSync(outputPath, output);
    before += input.length;
    after += output.length;
    const src = "/" + path.relative(publicDir, file).split(path.sep).join("/");
    replacements.set(src, webpPath(src));
  }

  // Migrate website content and static assets, preserving original binaries and
  // PNG compatibility icons. Binary-format test fixtures still use the originals.
  const metadataPath = path.join(root, "src/content/imageMeta.json");
  for (const file of walk(path.join(root, "src")).filter((file) => /\.(jsx?|json)$/.test(file) && !/\.test\./.test(file) && file !== metadataPath)) {
    const input = fs.readFileSync(file, "utf8");
    let output = input;
    for (const [src, destination] of replacements) output = output.replaceAll(src, destination);
    if (output !== input) fs.writeFileSync(file, output);
  }
  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
  for (const [src, destination] of replacements) if (metadata[src]) metadata[destination] = metadata[src];
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2) + "\n");

  const manifestPath = path.join(publicDir, "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  for (const image of manifest.screenshots ?? []) {
    if (replacements.has(image.src)) { image.src = replacements.get(image.src); image.type = "image/webp"; }
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(JSON.stringify({ converted: images.length, originalBytes: before, webpBytes: after, reductionPercent: Number((100 * (1 - after / before)).toFixed(1)) }, null, 2));
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
