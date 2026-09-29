import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from '@/lib/config';
import { getImageAlt } from '@/lib/imageMeta';

const toAbsoluteUrl = (value, siteUrl, fallback = siteUrl) => {
  if (!value) {
    return fallback;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith('/')) {
    return `${siteUrl}${value}`;
  }

  return `${siteUrl}/${value}`;
};

const Metadata = ({
  pageTitle = "MOOSTYLES | Best Free InZOI Mods, Downloads & Modding Resources",
  pageDescription = "Download quality InZOI mods and modding resources at MOOSTYLES. Browse free mods for InZOI, mod downloads, archived builds, custom content, decor packs, and join the InZOI modding community.",
  keywords = "InZOI mods, InZOI mod downloads, modding InZOI, mods for InZOI, InZOI modding, InZOI mods website, free InZOI mods, InZOI custom content, InZOI downloads, MOOSTYLES, archive builds, InZOI mod resources, InZOI modding community, InZOI mod packs",

  ogTitle = "",
  ogDescription = "",
  ogImage = "/projects/HeroSection/moostyles-banner.png",
  ogUrl = "",
  ogType = "website",
  ogSiteName = "MOOSTYLES",

  twitterCard = "summary_large_image",
  twitterTitle = "",
  twitterDescription = "",
  twitterImage = "",
  twitterSite = "",
  twitterCreator = "",

  author = "MooCalf",
  canonical = "",
  noindex = false,

  product = null,

  article = null,

  category = null
}) => {
  const location = useLocation();
  const siteUrl = SITE_URL;
  const currentUrl = `${siteUrl}${location.pathname}${location.search}`;

  const finalTitle = ogTitle || pageTitle;
  const finalDescription = ogDescription || pageDescription;
  const finalImage = toAbsoluteUrl(ogImage, siteUrl);
  const finalUrl = toAbsoluteUrl(ogUrl, siteUrl, currentUrl);
  const finalCanonical = toAbsoluteUrl(canonical, siteUrl, finalUrl);

  const finalTwitterTitle = twitterTitle || finalTitle;
  const finalTwitterDescription = twitterDescription || finalDescription;
  const finalTwitterImage = twitterImage || finalImage;
  const finalImageAlt = getImageAlt(twitterImage || ogImage, finalTitle);

  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "MOOSTYLES",
      "url": siteUrl,
      "logo": `${siteUrl}/projects/Website Branding/MOOSTYLES LOGO - TEAL COLOR.png`,
      "description": "Free InZOI mods, archived builds, and downloadable custom content from MOOSTYLES - Your source for InZOI modding resources and community.",
      "sameAs": [
        "https://www.patreon.com/MOOSTYLES"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "hello@moostyles.com"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
      }
    };

    const websiteData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "MOOSTYLES",
      "url": siteUrl,
      "description": finalDescription,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${siteUrl}/brands?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };

    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": siteUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "InZOI Mods",
          "item": `${siteUrl}/brands`
        }
      ]
    };

    const structuredData = [baseData, websiteData, breadcrumbData];

    if (product) {
      const productData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.image.startsWith('http') ? product.image : `${siteUrl}${product.image}`,
        "url": `${siteUrl}/product/${product.id}`,
        "brand": {
          "@type": "Brand",
          "name": product.brand || "MOOSTYLES"
        },
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "USD",
          "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "seller": {
            "@type": "Organization",
            "name": "MOOSTYLES"
          }
        },
        "aggregateRating": product.rating ? {
          "@type": "AggregateRating",
          "ratingValue": product.rating,
          "reviewCount": product.reviewCount || 0
        } : undefined,
        "category": product.category || "InZOI Mods"
      };

      if (product.originalPrice && product.originalPrice > product.price) {
        productData.offers.priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      }

      structuredData.push(productData);
    }

    if (article) {
      const articleData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title || finalTitle,
        "description": article.description || finalDescription,
        "image": article.image ? (article.image.startsWith('http') ? article.image : `${siteUrl}${article.image}`) : finalImage,
        "url": finalUrl,
        "author": {
          "@type": "Person",
          "name": article.author || author
        },
        "publisher": {
          "@type": "Organization",
          "name": "MOOSTYLES",
          "logo": {
            "@type": "ImageObject",
            "url": `${siteUrl}/projects/Website Branding/MOOSTYLES LOGO - TEAL COLOR.png`
          }
        },
        "datePublished": article.publishedTime || new Date().toISOString(),
        "dateModified": article.modifiedTime || article.publishedTime || new Date().toISOString(),
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": finalUrl
        }
      };

      if (article.tags && article.tags.length > 0) {
        articleData.keywords = article.tags.join(", ");
      }

      structuredData.push(articleData);
    }

    if (category) {
      const collectionData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${category.name} - MOOSTYLES`,
        "description": category.description,
        "url": finalUrl,
        "mainEntity": {
          "@type": "ItemList",
          "name": `${category.name} Mods`,
          "description": category.description
        }
      };

      structuredData.push(collectionData);
    }

    return structuredData;
  };

  const structuredData = generateStructuredData();

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={finalCanonical} />

      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {!noindex && <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />}

      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="MOOSTYLES" />

      <meta name="revisit-after" content="7 days" />
      <meta name="language" content="English" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />

      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:alt" content={finalImageAlt} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:site_name" content={ogSiteName} />
      <meta property="og:locale" content="en_US" />

      {product && (
        <>
          <meta property="og:price:amount" content={product.price} />
          <meta property="og:price:currency" content="USD" />
          <meta property="product:brand" content={product.brand || "MOOSTYLES"} />
          <meta property="product:availability" content={product.inStock ? "in stock" : "out of stock"} />
          <meta property="product:condition" content="new" />
          <meta property="product:price:amount" content={product.price} />
          <meta property="product:price:currency" content="USD" />
        </>
      )}

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalTwitterTitle} />
      <meta name="twitter:description" content={finalTwitterDescription} />
      <meta name="twitter:image" content={finalTwitterImage} />
      <meta name="twitter:image:alt" content={finalImageAlt} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />

      <meta name="theme-color" content="#0d9488" />
      <meta name="msapplication-TileColor" content="#0d9488" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {structuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export { Metadata };