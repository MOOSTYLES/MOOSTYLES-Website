import { SITE_URL } from "./config.js";
import { PAGE_METADATA, SITE_METADATA } from "../content/siteMetadata.js";
import { LIVE_ARDENNE_CATEGORIES, ARDENNE_LOGOS } from "../content/ardenne.js";
import { isArdenneMod } from "./modCatalog.js";

const absolute = (path) => new URL(path || "/", `${SITE_URL}/`).href;
const cleanPath = (path) => new URL(path, `${SITE_URL}/`).pathname.replace(/\/+$/, "") || "/";
const plainText = (text) => String(text ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const summary = (text, limit = 175) => {
  const value = plainText(text);
  if (value.length <= limit) return value;
  return `${value.slice(0, limit - 1).replace(/\s+\S*$/, "")}…`;
};
const keywordsText = (values = []) => [...new Set((Array.isArray(values) ? values : values.split(",")).map(plainText).filter(Boolean))].join(", ");
const routeAlias = (path) => ({ "/home": "/", "/brands": "/mods" })[path] ?? path;

const pageBreadcrumbs = (path) => {
  const page = PAGE_METADATA[path];
  if (!page || path === "/") return [{ name: "Home", url: "/" }];
  return [
    { name: "Home", url: "/" },
    ...(page.parent ? [{ name: PAGE_METADATA[page.parent].label, url: page.parent }] : []),
    { name: page.label, url: path },
  ];
};

export const getModMetadata = (mod) => {
  const ardenne = isArdenneMod(mod);
  return {
    pageTitle: `${mod.name} - inZOI Mod | ${ardenne ? "ARDENNE" : "MOOSTYLES"}`,
    pageDescription: summary(`${mod.name} for inZOI. ${mod.description}`),
    canonical: `/mods/${mod.slug}`,
    ogImage: mod.media.banner,
    imageAlt: `${mod.name} inZOI custom content preview`,
    keywords: [mod.name, "inZOI mods", "inZOI custom content", mod.collection, ...(mod.tags ?? []), ...(mod.fileTypes ?? [])],
    breadcrumbs: [
      { name: "Home", url: "/" },
      ...(ardenne ? [{ name: "ARDENNE", url: "/ardenne" }, { name: "ARDENNE Collection", url: "/ardenne/mods" }] : [{ name: "My Mod List", url: "/mods" }]),
      { name: mod.name, url: `/mods/${mod.slug}` },
    ],
    mod,
  };
};

export const getGalleryMetadata = (entry, caption) => {
  const number = Number(entry.key.slice(entry.key.lastIndexOf("-") + 1)) + 1;
  return {
    pageTitle: `${entry.modName} - inZOI Screenshot ${number} | MOOSTYLES`,
    pageDescription: summary(`${entry.modName} inZOI screenshot ${number}. ${caption}. Explore build and design inspiration, then view the featured custom content.`),
    canonical: `/gallery/${entry.key}`,
    ogImage: entry.src,
    imageAlt: caption,
    pageType: "ItemPage",
    keywords: [entry.modName, "inZOI screenshots", "inZOI design inspiration", "inZOI custom content"],
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Gallery", url: "/gallery" }, { name: `${entry.modName} Screenshot ${number}`, url: `/gallery/${entry.key}` }],
    galleryEntry: entry,
  };
};

export const buildPageMetadata = (pathname, options = {}) => {
  const path = routeAlias(cleanPath(pathname));
  const page = PAGE_METADATA[path] ?? {};
  const canonicalPath = routeAlias(cleanPath(options.canonical || path));
  const canonical = absolute(canonicalPath);
  const ardenne = canonicalPath.startsWith("/ardenne") || (options.mod && isArdenneMod(options.mod));
  const title = options.pageTitle || page.title || "MOOSTYLES | inZOI Custom Content & Inspiration";
  const description = summary(options.pageDescription || page.description || SITE_METADATA.description);
  const image = absolute(options.ogImage || page.image || SITE_METADATA.image);
  const imageAlt = options.imageAlt || `${page.label || title} — MOOSTYLES inZOI content`;
  const keywords = keywordsText(options.keywords || page.keywords || ["inZOI", "MOOSTYLES"]);
  const noindex = options.noindex ?? page.noindex ?? (path.startsWith("/api/") || path === "/redirector");
  const article = options.article || (page.article ? {} : null);
  const crumbs = options.breadcrumbs || pageBreadcrumbs(path);
  const organizationId = `${SITE_URL}/#organization`;
  const creatorId = `${SITE_URL}/about#moocalf`;
  const websiteId = `${SITE_URL}/#website`;
  const brandId = `${SITE_URL}/ardenne#brand`;
  const gameId = `${SITE_URL}/#inzoi`;
  const pageId = `${canonical}#webpage`;
  const imageId = `${canonical}#image`;
  const graph = [
    { "@type": "Organization", "@id": organizationId, name: SITE_METADATA.name, url: `${SITE_URL}/`, logo: { "@type": "ImageObject", url: absolute(SITE_METADATA.logo) }, description: SITE_METADATA.description, sameAs: SITE_METADATA.profiles, founder: { "@id": creatorId } },
    { "@type": "Person", "@id": creatorId, name: SITE_METADATA.creator, url: `${SITE_URL}/about` },
    { "@type": "VideoGame", "@id": gameId, name: "inZOI" },
    { "@type": "WebSite", "@id": websiteId, name: SITE_METADATA.name, url: `${SITE_URL}/`, description: SITE_METADATA.description, inLanguage: "en", publisher: { "@id": organizationId }, about: { "@id": gameId } },
    { "@type": "ImageObject", "@id": imageId, contentUrl: image, url: image, caption: imageAlt, representativeOfPage: true },
    { "@type": options.pageType || page.type || "WebPage", "@id": pageId, url: canonical, name: title, description, inLanguage: "en", isPartOf: { "@id": websiteId }, publisher: { "@id": organizationId }, about: { "@id": gameId }, primaryImageOfPage: { "@id": imageId }, keywords },
  ];
  const pageNode = graph.at(-1);
  if (path === "/about") pageNode.mainEntity = { "@id": creatorId };
  if (ardenne) {
    graph.push({ "@type": "Brand", "@id": brandId, name: "ARDENNE", url: `${SITE_URL}/ardenne`, logo: absolute(ARDENNE_LOGOS.black), description: PAGE_METADATA["/ardenne"].description });
    pageNode.about = [{ "@id": gameId }, { "@id": brandId }];
  }
  if (crumbs.length > 1) {
    const breadcrumbId = `${canonical}#breadcrumbs`;
    pageNode.breadcrumb = { "@id": breadcrumbId };
    graph.push({ "@type": "BreadcrumbList", "@id": breadcrumbId, itemListElement: crumbs.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: absolute(item.url) })) });
  }
  if (options.listingItems) {
    const listId = `${canonical}#items`;
    pageNode.mainEntity = { "@id": listId };
    graph.push({ "@type": "ItemList", "@id": listId, name: page.label || title, numberOfItems: options.listingItems.length, itemListElement: options.listingItems.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, url: absolute(item.url) })) });
  }
  if (options.mod) {
    const mod = options.mod;
    const contentId = `${canonical}#mod`;
    pageNode.mainEntity = { "@id": contentId };
    graph.push({
      "@type": "CreativeWork", "@id": contentId, name: mod.name, description: plainText(mod.description), url: canonical, image, genre: "inZOI custom content", inLanguage: "en", author: { "@id": creatorId }, publisher: { "@id": organizationId }, isBasedOn: { "@id": gameId }, mainEntityOfPage: { "@id": pageId }, keywords,
      ...(mod.collection ? { isPartOf: { "@type": "Collection", name: mod.collection, url: absolute(ardenne ? "/ardenne/mods" : "/mods") } } : {}),
      hasPart: (mod.fileManifest ?? []).map((file) => ({ "@type": "CreativeWork", name: file.filename, description: plainText(file.description) })),
    });
  }
  if (options.galleryEntry) {
    pageNode.mainEntity = { "@id": imageId };
    graph.find((item) => item["@id"] === imageId).about = { "@id": `${absolute(`/mods/${options.galleryEntry.modSlug}`)}#mod` };
  }
  if (article) {
    const articleId = `${canonical}#article`;
    pageNode.mainEntity = { "@id": articleId };
    graph.push({ "@type": "Article", "@id": articleId, headline: article.title || page.label || title, description, image, url: canonical, inLanguage: "en", author: { "@id": creatorId }, publisher: { "@id": organizationId }, mainEntityOfPage: { "@id": pageId }, about: { "@id": gameId }, keywords,
      ...(article.publishedTime ? { datePublished: article.publishedTime } : {}),
      ...(article.modifiedTime ? { dateModified: article.modifiedTime } : {}),
    });
  }
  if (options.faqItems) {
    graph.push({ "@type": "FAQPage", "@id": `${canonical}#faq`, isPartOf: { "@id": pageId }, mainEntity: options.faqItems.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) });
  }
  return {
    title, description, canonical, image, imageAlt, keywords,
    ogTitle: options.ogTitle || title,
    ogDescription: options.ogDescription || description,
    ogUrl: canonical,
    ogType: options.ogType || (article ? "article" : "website"),
    siteName: ardenne ? "ARDENNE by MOOSTYLES" : SITE_METADATA.name,
    themeColor: ardenne ? "#f6f8f7" : "#0d9488",
    robots: noindex ? "noindex, follow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    structuredData: { "@context": "https://schema.org", "@graph": graph },
  };
};

export const getArdenneListingItems = () => LIVE_ARDENNE_CATEGORIES.map((category) => ({ name: category.label, url: `/ardenne/mods?category=${category.id}` }));

export const serializeJsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

// React 19 hoists title/meta/link elements to the start of renderToString's
// result. Keep inline JSON-LD in the React tree so hydration can reuse it.
export const splitHoistedHead = (html) => {
  const head = html.match(/^(?:(?:<title\b[^>]*>[\s\S]*?<\/title>)|(?:<(?:meta|link)\b[^>]*\/>))+/)?.[0] || "";
  return { head, body: html.slice(head.length) };
};
