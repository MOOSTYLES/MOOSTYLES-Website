import { ARDENNE_PUBLIC_COPY, LIVE_ARDENNE_CATEGORIES } from "./ardenne.js";

export const SITE_METADATA = {
  name: "MOOSTYLES",
  creator: "MooCalf",
  description: "inZOI furniture, decor, custom brands and build inspiration by MooCalf. Explore MOOSTYLES mods, in-game screenshots, practical guides and ARDENNE.",
  image: "/projects/HeroSection/moostyles-banner.png",
  logo: "/projects/Website Branding/MOOSTYLES LOGO - TEAL COLOR.png",
  profiles: [
    "https://www.patreon.com/c/MOOSTYLES",
    "https://www.instagram.com/moostyles_inzoi/",
    "https://www.curseforge.com/members/moocalf",
    "https://pin.it/Zz1UgHeLi",
  ],
};

// These describe existing pages, rather than topics the site does not cover.
export const PAGE_METADATA = {
  "/": {
    title: "MOOSTYLES | inZOI Mods, Build Inspiration & Custom Content",
    description: "Explore inZOI furniture, decor, custom brands and build inspiration from MOOSTYLES. Browse free mods, in-game screenshots, practical guides and ARDENNE.",
    label: "Home",
    keywords: ["inZOI", "inZOI mods", "inZOI custom content", "inZOI build inspiration", "inZOI furniture", "inZOI decor", "inZOI interiors", "inZOI Build Mode", "life simulation", "MOOSTYLES", "MooCalf", "ARDENNE", "Halo", "PITAPATA", "MOCA Cafe"],
  },
  "/mods": {
    title: "inZOI Furniture, Decor & Mod Collections | MOOSTYLES",
    description: "Find MOOSTYLES inZOI furniture, decor and brand collections. Browse previews, included files and public or Patreon download options for your next build.",
    label: "My Mod List",
    type: "CollectionPage",
    keywords: ["inZOI mods", "inZOI furniture", "inZOI decor", "custom brands", "Build Mode", "CurseForge", "MOOSTYLES collections"],
  },
  "/ardenne": {
    title: `ARDENNE | Luxury ${LIVE_ARDENNE_CATEGORIES.map((category) => category.label).join(" & ")} for inZOI`,
    description: `Explore ARDENNE by MOOSTYLES: ${ARDENNE_PUBLIC_COPY.categories} for inZOI, with a growing collection of custom content and carefully considered design.`,
    label: "ARDENNE",
    keywords: ["ARDENNE", "inZOI luxury design", "inZOI custom content", ...LIVE_ARDENNE_CATEGORIES.map((category) => category.label), "MOOSTYLES"],
    image: "/projects/ARDENNE/automobile.webp",
  },
  "/ardenne/mods": {
    title: "ARDENNE Collection | Luxury inZOI Mods by MOOSTYLES",
    description: `Browse ARDENNE's ${ARDENNE_PUBLIC_COPY.categories} mods for inZOI. Explore design previews, included files and download options as the collection grows.`,
    label: "ARDENNE Collection",
    parent: "/ardenne",
    type: "CollectionPage",
    keywords: ["ARDENNE mods", "inZOI mods", "inZOI luxury collection", ...LIVE_ARDENNE_CATEGORIES.map((category) => category.label)],
    image: "/projects/ARDENNE/yacht.webp",
  },
  "/gallery": {
    title: "inZOI Gallery | Interiors & Build Inspiration | MOOSTYLES",
    description: "Explore inZOI interiors, furniture and decor through MOOSTYLES in-game screenshots. Find visual inspiration for homes, offices, cafes and your next build.",
    label: "Gallery",
    type: "ImageGallery",
    keywords: ["inZOI screenshots", "inZOI gallery", "inZOI build inspiration", "inZOI interior design", "inZOI homes", "inZOI offices", "inZOI cafes"],
  },
  "/guides": {
    title: "inZOI Modding Guides | Installation & Help | MOOSTYLES",
    description: "Start using inZOI custom content with practical MOOSTYLES guides. Learn mod installation, Build Mode searches, troubleshooting and download safety.",
    label: "Guides",
    type: "CollectionPage",
    keywords: ["inZOI guides", "inZOI mod installation", "inZOI custom content help", "inZOI Build Mode", "inZOI troubleshooting"],
  },
  "/guides/installing-mods": {
    title: "How to Install inZOI Mods & Find Build Mode Items | MOOSTYLES",
    description: "Learn how to install inZOI mods through CurseForge or Patreon, prepare your game and find new furniture and decor in Build Mode with MOOSTYLES.",
    label: "How to Install inZOI Mods",
    parent: "/guides",
    article: true,
    keywords: ["how to install inZOI mods", "CurseForge inZOI", "Patreon mods", "inZOI Build Mode items", "inZOI custom content installation"],
  },
  "/guides/troubleshooting": {
    title: "Fix Missing or Broken inZOI Mods | MOOSTYLES Guide",
    description: "Troubleshoot missing inZOI Build Mode items, failed mod downloads, installation problems and conflicts. Learn what to check and how to report an issue.",
    label: "Troubleshooting inZOI Mods",
    parent: "/guides",
    article: true,
    keywords: ["inZOI mods not showing", "inZOI missing furniture", "inZOI mod troubleshooting", "inZOI mod conflicts", "inZOI download help"],
  },
  "/guides/mod-safety": {
    title: "inZOI Mod Download Safety & File Verification | MOOSTYLES",
    description: "Learn where to download MOOSTYLES inZOI mods, how to check unfamiliar files and what to consider before installing or redistributing custom content.",
    label: "inZOI Mod Download Safety",
    parent: "/guides",
    article: true,
    keywords: ["inZOI mod safety", "safe inZOI downloads", "mod file verification", "inZOI custom content permissions"],
  },
  "/about": {
    title: "MooCalf | inZOI Content Creator Behind MOOSTYLES",
    description: "Meet MooCalf, the creator of MOOSTYLES. Discover the ideas behind inZOI furniture, custom brands, decor collections and the ARDENNE design collection.",
    label: "About MooCalf",
    type: "AboutPage",
    keywords: ["MooCalf", "MOOSTYLES", "inZOI content creator", "inZOI mod creator", "ARDENNE", "inZOI design"],
  },
  "/support": {
    title: "inZOI Mod Support, Downloads & FAQ | MOOSTYLES",
    description: "Get help with MOOSTYLES inZOI mods, downloads and installation. Read common questions, find troubleshooting guides or contact the creator for support.",
    label: "Support & FAQ",
    type: "ContactPage",
    keywords: ["MOOSTYLES support", "inZOI mod help", "inZOI download FAQ", "inZOI installation help", "creator contact"],
  },
  "/links": {
    title: "MOOSTYLES Creator Links | inZOI Content & Community",
    description: "Find MOOSTYLES on Patreon, Instagram, CurseForge and Pinterest. Follow MooCalf's inZOI creations, download custom content and explore design inspiration.",
    label: "Creator Links",
    keywords: ["MOOSTYLES links", "MooCalf CurseForge", "MOOSTYLES Patreon", "inZOI creators", "inZOI design inspiration"],
  },
  "/privacy-policy": {
    title: "Privacy Policy | MOOSTYLES",
    description: "Read the MOOSTYLES privacy policy covering information collected on this inZOI content website, cookies, analytics, third-party services and your choices.",
    label: "Privacy Policy",
    keywords: ["MOOSTYLES privacy policy", "website privacy", "cookies and analytics"],
  },
  "/terms-of-service": {
    title: "Terms of Service & Content Use | MOOSTYLES",
    description: "Read the terms for using MOOSTYLES, downloading inZOI custom content and interacting with the website, including permissions and third-party services.",
    label: "Terms of Service",
    keywords: ["MOOSTYLES terms", "inZOI custom content terms", "content permissions"],
  },
  "/saved-products": {
    title: "Your Saved inZOI Mods | MOOSTYLES",
    description: "Revisit the MOOSTYLES and ARDENNE mods you have saved, compare designs and return to their previews and download options.",
    label: "Saved Mods",
    noindex: true,
  },
  "/offline": {
    title: "Page Temporarily Offline | MOOSTYLES",
    description: "This MOOSTYLES page is temporarily unavailable. Return to the homepage to explore inZOI collections, screenshots and guides.",
    label: "Offline",
    noindex: true,
  },
};

export const PUBLIC_PAGE_PATHS = Object.keys(PAGE_METADATA).filter((path) => !PAGE_METADATA[path].noindex);
