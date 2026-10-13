// Keep unpublished text out of client and SSR assets, while leaving the source
// JSON available to the dashboard. Runs before Vite's built-in JSON transform.
export const blogPublicationPlugin = () => ({
  name: "moostyles-blog-publication",
  enforce: "pre",
  transform(code, id) {
    if (!/\/src\/content\/posts\/[^/]+\.json(?:\?.*)?$/.test(id.replaceAll("\\", "/"))) return null;
    if (JSON.parse(code).status === "published") return null;
    return { code: "{}", map: null };
  },
});
