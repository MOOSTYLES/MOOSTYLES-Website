import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { PostBody } from "@/Components/blog/PostBody";

vi.mock("@/lib/blog", async (importOriginal) => {
  const actual = await importOriginal();
  const posts = actual.getPublishedPosts([
    { slug: "test-tutorial", title: "Build your space", excerpt: "A practical guide", type: "Tutorial", tags: ["Build Tips"], status: "published", featured: true, publishedAt: "2026-10-12T12:00:00Z", body: "## Getting started\n\n1. Choose your room\n2. Add your furniture" },
    { slug: "private-draft", title: "Private draft", status: "draft" },
    { slug: "news", title: "Collection news", type: "Announcement", status: "published", publishedAt: "2026-10-11T12:00:00Z" },
  ]);
  return { ...actual, getAllPosts: () => posts, getPostBySlug: (slug) => posts.find((post) => post.slug === slug) ?? null };
});

import App from "@/App";
import { getCanonicalRoutes, getStaticRoutes } from "@/entry-server";

const renderPage = (url) => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [url] }, createElement(App)));

describe("Blog routes and content", () => {
  it("renders featured posts, filters by URL, and keeps drafts out", () => {
    const listing = renderPage("/blog");
    expect(listing).toContain("In the spotlight");
    expect(listing).toContain("Build your space");
    expect(listing).toContain("Collection news");
    expect(listing).not.toContain("Private draft");
    const filtered = renderPage("/blog?type=Tutorial&tag=Build%20Tips&q=practical");
    expect(filtered).toContain("Build your space");
    // Only published filtered cards appear; SEO still describes the whole listing.
    expect(filtered).not.toContain('class="blog-card__image-link" aria-label="Read Collection news"');
    expect(filtered).toContain("1 post");
  });
  it("renders full tutorial content and article metadata on direct links", () => {
    const html = renderPage("/blog/test-tutorial");
    expect(html).toContain("<h2>Getting started</h2>");
    expect(html).toContain("<ol>");
    expect(html).toContain('property="og:type" content="article"');
    expect(html).toContain("https://moostyles.com/blog/test-tutorial");
    expect(renderPage("/blog/private-draft")).toContain("Post not found");
  });
  it("prerenders and indexes published posts but never drafts", () => {
    for (const routes of [getStaticRoutes(), getCanonicalRoutes()]) {
      expect(routes).toContain("/blog");
      expect(routes).toContain("/blog/test-tutorial");
      expect(routes).not.toContain("/blog/private-draft");
    }
  });
  it("renders lists, tables, code and images without executing HTML or unsafe links", () => {
    const html = renderToStaticMarkup(createElement(PostBody, { body: '## Steps\n\n- Item\n\n```js\nconst x = 1;\n```\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n![Room](/projects/room.png)\n\n<script>alert(1)</script>\n\n[Unsafe](javascript:alert%281%29)' }));
    expect(html).toContain("<ul>");
    expect(html).toContain("<table>");
    expect(html).toContain('class="language-js"');
    expect(html).toContain('src="/projects/room.png"');
    expect(html).not.toContain("<script>");
    expect(html).not.toContain('href="javascript:');
  });
});
