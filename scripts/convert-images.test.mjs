import sharp from "sharp";
import { expect, it } from "vitest";
import { encodeWebp, webpPath } from "./convert-images.mjs";

it("preserves dimensions and transparent pixels for a logo", async () => {
  const input = Buffer.from([255, 0, 0, 255, 0, 255, 0, 128, 0, 0, 255, 0, 50, 60, 70, 255]);
  const png = await sharp(input, { raw: { width: 2, height: 2, channels: 4 } }).png().toBuffer();
  const output = await encodeWebp(png, { lossless: true });
  const metadata = await sharp(output).metadata();
  expect(metadata).toMatchObject({ format: "webp", width: 2, height: 2, hasAlpha: true });
  const decoded = await sharp(output).raw().toBuffer();
  // WebP may discard RGB under fully transparent pixels; visible pixels and alpha remain exact.
  for (let i = 0; i < input.length; i += 4) {
    expect(decoded[i + 3]).toBe(input[i + 3]);
    if (input[i + 3]) expect(decoded.subarray(i, i + 3)).toEqual(input.subarray(i, i + 3));
  }
});

it("encodes photographic images without changing dimensions and handles spaced paths", async () => {
  const input = await sharp({ create: { width: 40, height: 30, channels: 3, background: '#387caa' } }).png().toBuffer();
  expect(await sharp(await encodeWebp(input)).metadata()).toMatchObject({ format: "webp", width: 40, height: 30 });
  expect(webpPath("/projects/Website Branding/Logo.PNG")).toBe("/projects/Website Branding/Logo.webp");
});
