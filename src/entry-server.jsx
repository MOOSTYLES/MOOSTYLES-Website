import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App.jsx';
import { getAllMods, getStandardMods, getArdenneMods, getGalleryEntries } from './lib/mods';
import { HERO_IMAGES } from './content/heroImages';
import { LIVE_ARDENNE_CATEGORIES } from './content/ardenne';
import { PUBLIC_PAGE_PATHS } from './content/siteMetadata';

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

  return [...STATIC_PATHS, ...modPaths, ...galleryPaths];
}

export function getCanonicalRoutes() {
  return [
    ...PUBLIC_PAGE_PATHS,
    ...getAllMods().map((mod) => `/mods/${mod.slug}`),
    ...getGalleryEntries().map((entry) => `/gallery/${entry.key}`),
  ];
}

// Images each page shows, for the image sitemap. Mods are listed under their
// canonical /mods/ URL only; /product/ pages are duplicates of those.
export function getRouteImages() {
  const routeImages = { '/': [...HERO_IMAGES, ...getStandardMods().slice(0, 5).map((mod) => mod.media.banner)] };
  routeImages['/ardenne'] = LIVE_ARDENNE_CATEGORIES.map((category) => category.image);
  routeImages['/mods'] = getStandardMods().map((mod) => mod.media.banner);
  routeImages['/ardenne/mods'] = getArdenneMods().map((mod) => mod.media.banner);
  routeImages['/gallery'] = getGalleryEntries().map((entry) => entry.src);

  for (const mod of getAllMods()) {
    const { banner, previews = [], screenshots = [] } = mod.media;
    routeImages[`/mods/${mod.slug}`] = [banner, ...previews, ...screenshots].filter(Boolean);
  }

  for (const entry of getGalleryEntries()) {
    routeImages[`/gallery/${entry.key}`] = [entry.src];
  }

  return routeImages;
}
