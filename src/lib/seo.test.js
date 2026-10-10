import { describe, expect, it } from "vitest";
import { buildPageMetadata, getModMetadata, getGalleryMetadata, serializeJsonLd, splitHoistedHead } from "./seo";
import { PAGE_METADATA } from "../content/siteMetadata";
import mod from "../content/mods/halo-executive-chair.json";

const node = (metadata, type) => metadata.structuredData["@graph"].find((item) => item["@type"] === type);

describe("page-specific SEO", () => {
  it("covers every public section with distinct descriptions and accurate inZOI topics", () => {
    const pages = Object.keys(PAGE_METADATA).map((path) => buildPageMetadata(path));
    expect(new Set(pages.map((page) => page.description)).size).toBe(pages.length);
    expect(buildPageMetadata("/").description).toMatch(/inspiration|screenshots/);
    expect(buildPageMetadata("/gallery").description).toMatch(/interiors|build/);
    expect(buildPageMetadata("/ardenne").description).toMatch(/automobiles and yachts/);
    expect(JSON.stringify(buildPageMetadata("/ardenne"))).not.toMatch(/aviation|aircraft|\bsky\b/i);
  });

  it.each([["/home", "/"], ["/brands", "/mods"], ["/ardenne/mods/?category=yachts&utm_source=test", "/ardenne/mods"]])("normalizes %s to the canonical URL", (path, canonical) => {
    const metadata = buildPageMetadata(path);
    expect(metadata.canonical).toBe(`https://moostyles.com${canonical}`);
    expect(metadata.ogUrl).toBe(metadata.canonical);
  });

  it("gives a guide the correct breadcrumb hierarchy and no invented dates", () => {
    const metadata = buildPageMetadata("/guides/installing-mods");
    expect(node(metadata, "BreadcrumbList").itemListElement.map((item) => item.name)).toEqual(["Home", "Guides", "How to Install inZOI Mods"]);
    expect(node(metadata, "Article").datePublished).toBeUndefined();
    expect(node(metadata, "Article").dateModified).toBeUndefined();
    expect(metadata.ogType).toBe("article");
  });

  it.each(["/saved-products", "/offline", "/redirector", "/api/mods/test/download"])("keeps %s out of search", (path) => {
    expect(buildPageMetadata(path).robots).toContain("noindex");
  });

  it("links visible collection entries in order without claiming ratings or prices", () => {
    const metadata = buildPageMetadata("/mods", { listingItems: [{ name: "Halo", url: "/mods/halo" }] });
    expect(node(metadata, "ItemList").itemListElement[0]).toEqual({ "@type": "ListItem", position: 1, name: "Halo", url: "https://moostyles.com/mods/halo" });
    const organization = node(metadata, "Organization");
    expect(organization.address).toBeUndefined();
    expect(node(metadata, "WebSite").potentialAction).toBeUndefined();
  });
});

describe("CMS mod and screenshot metadata", () => {
  it("uses a canonical mod URL on legacy product pages and descriptive inZOI metadata", () => {
    const metadata = buildPageMetadata(`/product/${mod.legacyId}`, getModMetadata(mod));
    expect(metadata.canonical).toBe(`https://moostyles.com/mods/${mod.slug}`);
    expect(metadata.title).toContain("inZOI");
    expect(metadata.description.length).toBeLessThanOrEqual(175);
    const content = node(metadata, "CreativeWork");
    expect(content.name).toBe(mod.name);
    expect(content.datePublished).toBeUndefined();
    expect(content.offers).toBeUndefined();
    expect(content.aggregateRating).toBeUndefined();
    expect(content.brand).toBeUndefined();
  });

  it("keeps ARDENNE's brand and breadcrumbs distinct", () => {
    const metadata = buildPageMetadata("/mods/tourer", getModMetadata({ ...mod, slug: "tourer", collection: "ARDENNE", tags: ["Automobiles"] }));
    expect(metadata.siteName).toBe("ARDENNE by MOOSTYLES");
    expect(node(metadata, "BreadcrumbList").itemListElement.map((item) => item.name)).toEqual(["Home", "ARDENNE", "ARDENNE Collection", mod.name]);
    expect(node(metadata, "CreativeWork").isPartOf.name).toBe("ARDENNE");
  });

  it("gives different screenshots distinct titles and crawlable image URLs", () => {
    const entry = { modName: mod.name, modSlug: mod.slug, src: "/projects/Images/an image.jpg", key: `${mod.slug}-0` };
    const first = buildPageMetadata(`/gallery/${entry.key}`, getGalleryMetadata(entry, "An inZOI office"));
    const second = buildPageMetadata(`/gallery/${mod.slug}-1`, getGalleryMetadata({ ...entry, key: `${mod.slug}-1` }, "An inZOI office"));
    expect(first.title).not.toBe(second.title);
    expect(first.description).not.toBe(second.description);
    expect(node(first, "ImageObject").contentUrl).toBe("https://moostyles.com/projects/Images/an%20image.jpg");
    expect(node(first, "ImageObject").caption).toBe("An inZOI office");
  });
});

describe("HTML metadata rendering", () => {
  it("escapes CMS text so a JSON-LD value cannot close its script", () => {
    const json = serializeJsonLd({ name: "</script><script>alert(1)</script> & title" });
    expect(json).not.toContain("<");
    expect(JSON.parse(json).name).toBe("</script><script>alert(1)</script> & title");
  });

  it("moves only React's leading head tags, leaving body scripts available for hydration", () => {
    const html = '<link rel="preload" href="/a.jpg"/><title>A &amp; B</title><meta name="description" content="test"/><link rel="canonical" href="https://moostyles.com/"/><div><script type="application/ld+json">{}</script><main>Page</main></div>';
    const result = splitHoistedHead(html);
    expect(result.head).toContain("<title>");
    expect(result.head).not.toContain("application/ld+json");
    expect(result.body).toBe('<div><script type="application/ld+json">{}</script><main>Page</main></div>');
  });
});
