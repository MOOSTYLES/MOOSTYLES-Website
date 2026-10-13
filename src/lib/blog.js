export const POST_TYPES = ["Announcement", "Blog", "Tutorial", "Update", "Behind the Scenes", "Community"];

export const normalizePost = (post) => ({
  ...post,
  type: post.type || "Blog",
  tags: Array.isArray(post.tags) ? [...new Set(post.tags.filter(Boolean))] : [],
  author: post.author || "MOOSTYLES",
  excerpt: post.excerpt || "",
  body: post.body || "",
  cover: post.cover || "",
  coverAlt: post.coverAlt || "",
  featured: post.featured ?? false,
});

export const getPublishedPosts = (posts) => posts.map(normalizePost)
  .filter((post) => post.status === "published")
  .sort((a, b) => (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0) || a.title.localeCompare(b.title));

const modules = import.meta.glob("/src/content/posts/*.json", { eager: true });
const posts = getPublishedPosts(Object.values(modules).map((module) => module.default ?? module));
export const getAllPosts = () => posts;
export const getPostBySlug = (slug) => posts.find((post) => post.slug === slug) ?? null;

export const filterPosts = (entries, { type = "", tag = "", query = "" } = {}) => {
  const search = query.trim().toLowerCase();
  return entries.filter((post) => (!type || post.type === type)
    && (!tag || post.tags.includes(tag))
    && (!search || [post.title, post.excerpt, post.body, post.type, ...post.tags].join(" ").toLowerCase().includes(search)));
};

export const formatPostDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date);
};

export const getPostMetadata = (post) => ({
  pageTitle: `${post.title} | MOOSTYLES Blog`,
  pageDescription: post.excerpt || post.title,
  canonical: `/blog/${post.slug}`,
  ogImage: post.cover || undefined,
  imageAlt: post.coverAlt || post.title,
  keywords: [post.type, ...post.tags, "MOOSTYLES", "inZOI"],
  article: { title: post.title, authorName: post.author, publishedTime: post.publishedAt, modifiedTime: post.updatedAt || post.publishedAt },
  breadcrumbs: [{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }, { name: post.title, url: `/blog/${post.slug}` }],
});
