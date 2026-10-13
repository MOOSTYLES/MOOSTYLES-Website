import { expect, it } from "vitest";
import { blogPublicationPlugin } from "./blog-publication.mjs";

it("removes unpublished post data before Vite includes JSON in public bundles", () => {
  const transform = blogPublicationPlugin().transform;
  for (const status of ["draft", undefined]) {
    const result = transform(JSON.stringify({ status, title: "Private title", body: "Private body" }), "H:/site/src/content/posts/private.json");
    expect(JSON.parse(result.code)).toEqual({});
  }
  const published = JSON.stringify({ status: "published", title: "Public title" });
  expect(transform(published, "H:/site/src/content/posts/public.json")).toBeNull();
  expect(transform('{"title":"Other JSON"}', "H:/site/src/content/mods/mod.json")).toBeNull();
});
