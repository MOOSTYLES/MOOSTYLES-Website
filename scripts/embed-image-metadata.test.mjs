import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildXmp, embedXmpInJpeg, embedXmpInPng, readPngChunks } from "./embed-image-metadata.mjs";
import imageMeta from "../src/content/imageMeta.json";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicFile = (src) => path.join(root, "public", ...src.split("/").filter(Boolean));

const SAMPLE_JPEG = "/projects/Mods/seeglass-mirror/seeglass-standing-mirror-doorway.jpg";
const SAMPLE_PNG = "/projects/Website Branding/MOOSTYLES LOGO - BLACK COLOR.png";

const xmp = buildXmp({
  title: "Test <Title> & Co",
  description: "A \"quoted\" description",
  alt: "Alt text",
  keywords: ["Shelf", "Wood"],
});

const countOccurrences = (buffer, needle) => buffer.toString("latin1").split(needle).length - 1;

describe("imageMeta.json", () => {
  it("only lists images that exist in public/", () => {
    const missing = Object.keys(imageMeta).filter((src) => !fs.existsSync(publicFile(src)));
    expect(missing).toEqual([]);
  });

  it("gives every image non-empty alt text", () => {
    const empty = Object.entries(imageMeta).filter(([, entry]) => !entry.alt?.trim());
    expect(empty).toEqual([]);
  });
});

describe("buildXmp", () => {
  it("escapes XML special characters", () => {
    expect(xmp).toContain("Test &lt;Title&gt; &amp; Co");
    expect(xmp).toContain("A &quot;quoted&quot; description");
  });
});

describe("embedXmpInJpeg", () => {
  const original = fs.readFileSync(publicFile(SAMPLE_JPEG));
  const once = embedXmpInJpeg(original, xmp);
  const twice = embedXmpInJpeg(once, xmp);

  it("adds exactly one XMP packet, even when run twice", () => {
    expect(countOccurrences(once, "http://ns.adobe.com/xap/1.0/\0")).toBe(1);
    expect(countOccurrences(twice, "http://ns.adobe.com/xap/1.0/\0")).toBe(1);
    expect(twice.equals(once)).toBe(true);
  });

  it("leaves the compressed image data untouched", () => {
    const sos = (buffer) => buffer.subarray(buffer.indexOf(Buffer.from([0xff, 0xda])));
    expect(sos(once).equals(sos(original))).toBe(true);
  });
});

describe("embedXmpInPng", () => {
  const original = fs.readFileSync(publicFile(SAMPLE_PNG));
  const once = embedXmpInPng(original, xmp);
  const twice = embedXmpInPng(once, xmp);

  it("adds exactly one XMP chunk right after IHDR, even when run twice", () => {
    const types = readPngChunks(twice).map((chunk) => chunk.type);
    expect(types[0]).toBe("IHDR");
    expect(types[1]).toBe("iTXt");
    expect(types.at(-1)).toBe("IEND");
    expect(countOccurrences(twice, "XML:com.adobe.xmp")).toBe(1);
    expect(twice.equals(once)).toBe(true);
  });

  it("writes valid chunk checksums and keeps the image data", () => {
    for (const chunk of readPngChunks(once)) {
      const typeAndData = chunk.raw.subarray(4, chunk.raw.length - 4);
      expect(chunk.raw.readUInt32BE(chunk.raw.length - 4)).toBe(zlib.crc32(typeAndData));
    }
    const idat = (buffer) => readPngChunks(buffer).filter((c) => c.type === "IDAT").map((c) => c.raw);
    expect(Buffer.concat(idat(once)).equals(Buffer.concat(idat(original)))).toBe(true);
  });
});
