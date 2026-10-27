import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App.jsx';
import { getAllMods, getStandardMods, getArdenneMods, getLatestStandardMods, HOMEPAGE_MOD_COUNT } from './lib/mods';
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
  '/guides',
  '/guides/installing-mods',
  '/guides/troubleshooting',
  '/guides/mod-safety',
];

export function getStaticRoutes() {
  const mods = getAllMods();
  const modPaths = mods.flatMap((mod) => [
    `/mods/${mod.slug}`,
    `/product/${mod.legacyId}`,
  ]);

  return [...STATIC_PATHS, ...modPaths, ...getAllPosts().map((post) => `/blog/${post.slug}`)];
}

export function getCanonicalRoutes() {
  return [
    ...PUBLIC_PAGE_PATHS,
    ...getAllMods().map((mod) => `/mods/${mod.slug}`),
    ...getAllPosts().map((post) => `/blog/${post.slug}`),
  ];
}

// Images each page shows, for the image sitemap. Mods are listed under their
// canonical /mods/ URL only; /product/ pages are duplicates of those.
export function getRouteImages() {
  const routeImages = { '/': [...HERO_IMAGES, ...getLatestStandardMods(HOMEPAGE_MOD_COUNT).map((mod) => mod.media.banner)] };
  routeImages['/ardenne'] = LIVE_ARDENNE_CATEGORIES.flatMap((category) => [category.image, category.heroImage].filter(Boolean));
  routeImages['/mods'] = getStandardMods().map((mod) => mod.media.banner);
  routeImages['/ardenne/mods'] = getArdenneMods().map((mod) => mod.media.banner);
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

  return routeImages;
}
