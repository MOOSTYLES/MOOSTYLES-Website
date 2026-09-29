import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SITE_URL } from '../src/lib/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const ssrEntry = path.join(root, 'dist-ssr', 'entry-server.js');

const { render, getStaticRoutes, getRouteImages } = await import(pathToFileURL(ssrEntry).href);

const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

const helmetToHead = (helmet) =>
  [helmet.title, helmet.meta, helmet.link, helmet.script]
    .map((tag) => tag.toString())
    .join('\n');

const splitLeadingPreloadLinks = (html) => {
  const match = html.match(/^(?:<link[^>]*\/>)+/);
  if (!match) return { links: '', rest: html };
  return { links: match[0], rest: html.slice(match[0].length) };
};

const writeRoute = (routePath, html) => {
  const outDir =
    routePath === '/' ? distDir : path.join(distDir, routePath.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
};

const renderPage = (routePath) => {
  const { appHtml, helmet } = render(routePath);
  const { links, rest } = splitLeadingPreloadLinks(appHtml);
  const head = helmetToHead(helmet) + (links ? '\n' + links : '');
  return template.replace('<!--app-head-->', head).replace('<!--app-html-->', rest);
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

const today = new Date().toISOString().slice(0, 10);
const routeImages = getRouteImages();
const escapeXml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const imageEntries = (r) =>
  (routeImages[r] ?? [])
    .map(
      (src) => `
    <image:image>
      <image:loc>${escapeXml(SITE_URL + encodeURI(src))}</image:loc>
    </image:image>`
    )
    .join('');
const sitemapEntries = routes
  .filter((r) => r !== '/saved-products')
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r === '/' ? '/' : r}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${r === '/' ? '1.0' : '0.8'}</priority>${imageEntries(r)}
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
