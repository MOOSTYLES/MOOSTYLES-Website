// Embeds XMP metadata (title, description, alt text, creator, copyright) into
// every JPEG/PNG under dist/projects after the build. It only edits the built
// copies, so the originals in public/ stay untouched and each build starts clean.
//
// Pixel data is never re-encoded: the XMP packet is inserted as its own
// JPEG APP1 segment or PNG iTXt chunk, and any older XMP packet is replaced.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SITE_URL } from '../src/lib/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const CREATOR = 'MooCalf';
const CREDIT = 'MOOSTYLES';
const DEFAULT_RIGHTS = 'Copyright © MOOSTYLES. All rights reserved.';
const WEB_STATEMENT = `${SITE_URL}/terms-of-service`;
const BASE_KEYWORDS = ['MOOSTYLES', 'inZOI', 'inZOI mods'];

const XMP_JPEG_NAMESPACE = Buffer.from('http://ns.adobe.com/xap/1.0/\0', 'latin1');
const XMP_PNG_KEYWORD = 'XML:com.adobe.xmp';
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const langAlt = (value) =>
  `<rdf:Alt><rdf:li xml:lang="x-default">${escapeXml(value)}</rdf:li></rdf:Alt>`;

export const buildXmp = ({ title, description, alt, rights = DEFAULT_RIGHTS, keywords = [] }) => {
  const subjects = [...new Set([...keywords, ...BASE_KEYWORDS])]
    .map((keyword) => `<rdf:li>${escapeXml(keyword)}</rdf:li>`)
    .join('');

  return `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/"
    xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
    xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/"
    photoshop:Credit="${escapeXml(CREDIT)}"
    xmpRights:Marked="True"
    xmpRights:WebStatement="${escapeXml(WEB_STATEMENT)}">
   <dc:title>${langAlt(title)}</dc:title>
   <dc:description>${langAlt(description)}</dc:description>
   <Iptc4xmpCore:AltTextAccessibility>${langAlt(alt)}</Iptc4xmpCore:AltTextAccessibility>
   <dc:creator><rdf:Seq><rdf:li>${escapeXml(CREATOR)}</rdf:li></rdf:Seq></dc:creator>
   <dc:rights>${langAlt(rights)}</dc:rights>
   <dc:subject><rdf:Bag>${subjects}</rdf:Bag></dc:subject>
   <Iptc4xmpCore:CreatorContactInfo rdf:parseType="Resource">
    <Iptc4xmpCore:CiUrlWork>${escapeXml(SITE_URL)}</Iptc4xmpCore:CiUrlWork>
   </Iptc4xmpCore:CreatorContactInfo>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
};

const isXmpSegment = (segment) =>
  segment[1] === 0xe1 && segment.subarray(4, 4 + XMP_JPEG_NAMESPACE.length).equals(XMP_JPEG_NAMESPACE);

export const embedXmpInJpeg = (buffer, xmp) => {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) throw new Error('Not a JPEG file');

  const payload = Buffer.concat([XMP_JPEG_NAMESPACE, Buffer.from(xmp, 'utf8')]);
  if (payload.length + 2 > 0xffff) throw new Error('XMP packet too large for one JPEG segment');

  const segments = [];
  let offset = 2;
  // Walk the header segments up to the start of the image data (SOS).
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) throw new Error(`Malformed JPEG marker at byte ${offset}`);
    const marker = buffer[offset + 1];
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    if (marker === 0xda || marker === 0xd9) break;
    const length = buffer.readUInt16BE(offset + 2);
    segments.push(buffer.subarray(offset, offset + 2 + length));
    offset += 2 + length;
  }

  const kept = segments.filter((segment) => !isXmpSegment(segment));
  // JFIF (APP0) and Exif (APP1) must stay first, so XMP goes right after them.
  let insertAt = 0;
  while (insertAt < kept.length && (kept[insertAt][1] === 0xe0 || kept[insertAt][1] === 0xe1)) {
    insertAt += 1;
  }

  const header = Buffer.alloc(4);
  header.writeUInt16BE(0xffe1, 0);
  header.writeUInt16BE(payload.length + 2, 2);

  return Buffer.concat([
    buffer.subarray(0, 2),
    ...kept.slice(0, insertAt),
    header,
    payload,
    ...kept.slice(insertAt),
    buffer.subarray(offset),
  ]);
};

const pngChunk = (type, data) => {
  const typeAndData = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(zlib.crc32(typeAndData), 0);
  return Buffer.concat([length, typeAndData, crc]);
};

export const readPngChunks = (buffer) => {
  if (!buffer.subarray(0, 8).equals(PNG_SIGNATURE)) throw new Error('Not a PNG file');
  const chunks = [];
  let offset = 8;
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('latin1', offset + 4, offset + 8);
    const end = offset + 12 + length;
    chunks.push({ type, data: buffer.subarray(offset + 8, offset + 8 + length), raw: buffer.subarray(offset, end) });
    offset = end;
  }
  return chunks;
};

const isXmpChunk = (chunk) =>
  chunk.type === 'iTXt' && chunk.data.toString('latin1', 0, XMP_PNG_KEYWORD.length + 1) === `${XMP_PNG_KEYWORD}\0`;

export const embedXmpInPng = (buffer, xmp) => {
  const chunks = readPngChunks(buffer).filter((chunk) => !isXmpChunk(chunk));
  if (chunks[0]?.type !== 'IHDR') throw new Error('PNG does not start with IHDR');

  // keyword\0, compression flag, compression method, language\0, translated keyword\0, text
  const data = Buffer.concat([
    Buffer.from(`${XMP_PNG_KEYWORD}\0`, 'latin1'),
    Buffer.from([0, 0, 0, 0]),
    Buffer.from(xmp, 'utf8'),
  ]);

  return Buffer.concat([
    PNG_SIGNATURE,
    chunks[0].raw,
    pngChunk('iTXt', data),
    ...chunks.slice(1).map((chunk) => chunk.raw),
  ]);
};

const loadModImageIndex = () => {
  const modsDir = path.join(root, 'src', 'content', 'mods');
  const index = new Map();
  for (const file of fs.readdirSync(modsDir).filter((name) => name.endsWith('.json'))) {
    const mod = JSON.parse(fs.readFileSync(path.join(modsDir, file), 'utf-8'));
    const { banner, previews = [], screenshots = [] } = mod.media ?? {};
    for (const src of [banner, ...previews, ...screenshots].filter(Boolean)) {
      index.set(src, mod);
    }
  }
  return index;
};

const walkImages = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkImages(full);
    return /\.(jpe?g|png)$/i.test(entry.name) ? [full] : [];
  });

export const metadataFor = (src, imageMeta, modIndex) => {
  const entry = imageMeta[src] ?? {};
  const mod = modIndex.get(src);
  const title = entry.title ?? (mod ? `${mod.name} - inZOI Mod by MOOSTYLES` : 'MOOSTYLES');
  const alt = entry.alt ?? mod?.name ?? title;
  return {
    title,
    alt,
    description: alt,
    rights: entry.rights ?? DEFAULT_RIGHTS,
    keywords: mod ? [mod.name, ...(mod.tags ?? [])] : [],
  };
};

const main = () => {
  const distDir = path.join(root, 'dist');
  const imagesDir = path.join(distDir, 'projects');
  if (!fs.existsSync(imagesDir)) {
    console.log('embed-image-metadata: no dist/projects folder, skipping.');
    return;
  }

  const imageMeta = JSON.parse(fs.readFileSync(path.join(root, 'src', 'content', 'imageMeta.json'), 'utf-8'));
  const modIndex = loadModImageIndex();
  let tagged = 0;
  const missingAlt = [];

  for (const file of walkImages(imagesDir)) {
    const src = '/' + path.relative(distDir, file).split(path.sep).join('/');
    if (!imageMeta[src]?.alt) missingAlt.push(src);
    const xmp = buildXmp(metadataFor(src, imageMeta, modIndex));
    const input = fs.readFileSync(file);
    const output = /\.png$/i.test(file) ? embedXmpInPng(input, xmp) : embedXmpInJpeg(input, xmp);
    fs.writeFileSync(file, output);
    tagged += 1;
  }

  console.log(`embed-image-metadata: embedded XMP metadata in ${tagged} images.`);
  if (missingAlt.length > 0) {
    console.log(`  ${missingAlt.length} image(s) have no entry in src/content/imageMeta.json (using the mod name):`);
    for (const src of missingAlt) console.log(`   - ${src}`);
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
