import { useLocation } from "react-router-dom";
import { buildPageMetadata, serializeJsonLd } from "@/lib/seo";
import { SITE_METADATA } from "@/content/siteMetadata";

// React 19 manages title, meta and link elements in document.head, including
// navigation and Strict Mode. JSON-LD remains in the rendered page for SSR.
export const Metadata = (props) => {
  const { pathname } = useLocation();
  const metadata = buildPageMetadata(pathname, props);

  return (
    <>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="keywords" content={metadata.keywords} />
      <meta name="author" content={SITE_METADATA.creator} />
      <meta name="robots" content={metadata.robots} />
      <link rel="canonical" href={metadata.canonical} />

      <meta name="application-name" content="MOOSTYLES" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="MOOSTYLES" />
      <meta name="theme-color" content={metadata.themeColor} />

      <meta property="og:type" content={metadata.ogType} />
      <meta property="og:title" content={metadata.ogTitle} />
      <meta property="og:description" content={metadata.ogDescription} />
      <meta property="og:url" content={metadata.ogUrl} />
      <meta property="og:site_name" content={metadata.siteName} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={metadata.image} />
      <meta property="og:image:alt" content={metadata.imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metadata.ogTitle} />
      <meta name="twitter:description" content={metadata.ogDescription} />
      <meta name="twitter:image" content={metadata.image} />
      <meta name="twitter:image:alt" content={metadata.imageAlt} />
      {metadata.ogType === "article" && <meta property="article:author" content="https://moostyles.com/about" />}
      {props.article?.publishedTime && <meta property="article:published_time" content={props.article.publishedTime} />}
      {props.article?.modifiedTime && <meta property="article:modified_time" content={props.article.modifiedTime} />}

      <script type="application/ld+json" data-moostyles-seo="true" dangerouslySetInnerHTML={{ __html: serializeJsonLd(metadata.structuredData) }} />
    </>
  );
};
