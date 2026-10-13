import { describe, expect, it } from "vitest";
import { filterPosts, getPublishedPosts, normalizePost } from "./blog";

const post = { slug: "hello", title: "New furniture", type: "Announcement", status: "published", publishedAt: "2026-10-12T12:00:00Z", body: "A new collection", tags: ["Furniture"] };

describe("blog publishing", () => {
  it("only exposes explicitly published posts, newest first", () => {
    const older = { ...post, slug: "older", publishedAt: "2026-09-01T12:00:00Z" };
    expect(getPublishedPosts([older, { ...post, status: "draft" }, { ...post, status: undefined }, post]).map((item) => item.slug))
      .toEqual(["hello", "older"]);
  });
  it("normalizes omitted optional fields without changing the upload", () => {
    const upload = { ...post, tags: undefined, author: undefined };
    expect(normalizePost(upload)).toMatchObject({ tags: [], author: "MOOSTYLES", cover: "", coverAlt: "", featured: false });
    expect(upload.tags).toBeUndefined();
  });
  it("combines type, tag and case-insensitive full-text search", () => {
    const posts = getPublishedPosts([post, { ...post, slug: "guide", type: "Tutorial" }]);
    expect(filterPosts(posts, { type: "Announcement", tag: "Furniture", query: "COLLECTION" }).map((item) => item.slug)).toEqual(["hello"]);
    expect(filterPosts(posts, { query: "missing" })).toEqual([]);
    expect(filterPosts(posts)).toHaveLength(2);
  });
});
