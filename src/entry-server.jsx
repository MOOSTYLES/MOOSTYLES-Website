import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App.jsx';
import { getAllMods, getStandardMods, getArdenneMods, getGalleryEntries } from './lib/mods';
import { HERO_IMAGES } from './content/heroImages';
import { LIVE_ARDENNE_CATEGORIES } from './content/ardenne';
import { PUBLIC_PAGE_PATHS } from './content/siteMetadata';
import { getAllPosts } from './lib/blog';

export function render(url) {
  const appHtml = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );

  return { appHtml };
}

const STATIC_PATHS = [
  '/',
  '/home',
  '/blog',
  '/support',
  '/saved-products',
  '/privacy-policy',
  '/terms-of-service',
  '/offline',
  '/links',
  '/brands',
  '/mods',
  '/ardenne',
  '/ardenne/mods',
  '/about',
  '/gallery',
  '/guides',
  '/guides/installing-mods',
  '/guides/troubleshooting',
  '/guides/mod-safety',
];

export function getStaticRoutes() {
  const mods = getAllMods();
  const galleryEntries = getGalleryEntries();

  const modPaths = mods.flatMap((mod) => [
    `/mods/${mod.slug}`,
    `/product/${mod.legacyId}`,
  ]);

  const galleryPaths = galleryEntries.map((entry) => `/gallery/${entry.key}`);

  return [...STATIC_PATHS, ...modPaths, ...galleryPaths, ...getAllPosts().map((post) => `/blog/${post.slug}`)];
}

export function getCanonicalRoutes() {
  return [
    ...PUBLIC_PAGE_PATHS,
    ...getAllMods().map((mod) => `/mods/${mod.slug}`),
    ...getGalleryEntries().map((entry) => `/gallery/${entry.key}`),
    ...getAllPosts().map((post) => `/blog/${post.slug}`),
  ];
}

// Images each page shows, for the image sitemap. Mods are listed under their
// canonical /mods/ URL only; /product/ pages are duplicates of those.
export function getRouteImages() {
  const routeImages = { '/': [...HERO_IMAGES, ...getStandardMods().slice(0, 5).map((mod) => mod.media.banner)] };
  routeImages['/ardenne'] = LIVE_ARDENNE_CATEGORIES.flatMap((category) => [category.image, category.heroImage].filter(Boolean));
  routeImages['/mods'] = getStandardMods().map((mod) => mod.media.banner);
  routeImages['/ardenne/mods'] = getArdenneMods().map((mod) => mod.media.banner);
  routeImages['/gallery'] = getGalleryEntries().map((entry) => entry.src);
  routeImages['/blog'] = [...HERO_IMAGES, ...getAllPosts().map((post) => post.cover).filter(Boolean)];
  for (const post of getAllPosts()) {
    const bodyImages = [...post.body.matchAll(/!\[[^\]]*\]\(\s*(<[^>]+>|[^\s)]+)(?:\s+[^)]*)?\)/g)]
      .map((match) => match[1].replace(/^<|>$/g, ""));
    routeImages[`/blog/${post.slug}`] = [post.cover, ...bodyImages].filter(Boolean);
  }

  for (const mod of getAllMods()) {
    const { banner, previews = [], screenshots = [] } = mod.media;
    routeImages[`/mods/${mod.slug}`] = [banner, ...previews, ...screenshots].filter(Boolean);
  }

  for (const entry of getGalleryEntries()) {
    routeImages[`/gallery/${entry.key}`] = [entry.src];
  }

  return routeImages;
}
