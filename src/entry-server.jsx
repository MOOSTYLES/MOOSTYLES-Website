import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import { getAllMods, getGalleryEntries } from './lib/mods';
import { HERO_IMAGES } from './content/heroImages';

export function render(url) {
  const helmetContext = {};

  const appHtml = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>
  );

  return { appHtml, helmet: helmetContext.helmet };
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

// Images each page shows, for the image sitemap. Mods are listed under their
// canonical /mods/ URL only; /product/ pages are duplicates of those.
export function getRouteImages() {
  const routeImages = { '/': HERO_IMAGES };

  for (const mod of getAllMods()) {
    const { banner, previews = [], screenshots = [] } = mod.media;
    routeImages[`/mods/${mod.slug}`] = [banner, ...previews, ...screenshots].filter(Boolean);
  }

  for (const entry of getGalleryEntries()) {
    routeImages[`/gallery/${entry.key}`] = [entry.src];
  }

  return routeImages;
}
