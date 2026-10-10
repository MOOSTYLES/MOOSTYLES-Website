import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SITE_URL } from '../src/lib/config.js';
import { splitHoistedHead } from '../src/lib/seo.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const ssrEntry = path.join(root, 'dist-ssr', 'entry-server.js');

const { render, getStaticRoutes, getCanonicalRoutes, getRouteImages } = await import(pathToFileURL(ssrEntry).href);

const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

const writeRoute = (routePath, html) => {
  const outDir =
    routePath === '/' ? distDir : path.join(distDir, routePath.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
};

const renderPage = (routePath) => {
  const { appHtml } = render(routePath);
  const { head, body } = splitHoistedHead(appHtml);
  return template.replace('<!--app-head-->', () => head).replace('<!--app-html-->', () => body);
};

const routes = getStaticRoutes();
let count = 0;

for (const routePath of routes) {
  writeRoute(routePath, renderPage(routePath));
  count += 1;
}

fs.writeFileSync(
  path.join(distDir, '404.html'),
  renderPage('/this-page-does-not-exist'),
  'utf-8'
);

const routeImages = getRouteImages();
const escapeXml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const imageEntries = (r) =>
  [...new Set(routeImages[r] ?? [])]
    .map(
      (src) => `
    <image:image>
      <image:loc>${escapeXml(SITE_URL + encodeURI(src))}</image:loc>
    </image:image>`
    )
    .join('');
// Only canonical, indexable public pages belong in the sitemap. Omit lastmod
// until we have real content revision dates rather than a new date per build.
const sitemapEntries = getCanonicalRoutes()
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r === '/' ? '/' : r}</loc>
    ${imageEntries(r)}
  </url>`
  )
  .join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${sitemapEntries}\n</urlset>\n`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf-8');

fs.writeFileSync(
  path.join(distDir, '.prerender-manifest.json'),
  JSON.stringify({ routeCount: count }),
  'utf-8'
);

fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });

console.log(`Prerendered ${count} routes + 404.html + sitemap.xml`);
