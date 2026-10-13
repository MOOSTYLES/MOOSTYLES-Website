# Website image conversion

Run `npm run images:webp` to create WebP versions of PNG/JPEG images in `public/projects` and update website content references. The command retains original binaries, checks dimensions and transparency, and rejects conflicting output filenames.

Photos and screenshots use quality 90 with lossless alpha. Logos and branding use lossless WebP. Existing WebP and SVG files are kept unchanged. Small generated app icons, favicons and Apple touch icons live separately in `public/icons` for compatibility.

The hero carousel prefers a WebP sibling over its original, avoiding duplicate slides. New images without a WebP sibling still work. Rerun the command after uploading new PNG/JPEG content through the dashboard; upload WebP directly to skip conversion.

The build embeds title, alt text, copyright and creator metadata in JPEG, PNG and WebP files without re-encoding their image data. The 89 PNG/JPEG originals have been moved into `old/projects` outside the deployed site, preserving their folder structure. `old/sha256.json` records verified checksums; `old/imageMeta-originals.json` preserves their metadata. `old-images.zip` contains the complete archive for downloading and keeping offline. The archive and ZIP are ignored by Git. Old original URLs redirect to their WebP replacements. Tests generate their own fixtures and do not require the archive, so it can be removed after downloading.

Initial conversion: 89 images (including the OceanClass copy for ARDENNE), from 50,645,071 bytes to 9,546,954 bytes, an 81.1% reduction. The archive and ZIP are outside `public` and are not deployed.
