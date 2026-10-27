import { useSearchParams } from "react-router-dom";
import { NavigationBar } from "@/Components/NavigationBar";
import { Metadata } from "@/Components/Metadata";
import { Footer } from "@/Components/Footer";
import { WebsiteBackground } from "@/Components/WebsiteBackground";
import { FeaturedCollections } from "@/Components/HomepageComponents/FeaturedCollections";
import { PostCard } from "@/Components/blog/PostCard";
import { filterPosts, getAllPosts, POST_TYPES } from "@/lib/blog";

export const Blog = () => {
  const [params, setParams] = useSearchParams();
  const posts = getAllPosts();
  const type = params.get("type") || "";
  const tag = params.get("tag") || "";
  const query = params.get("q") || "";
  const entries = filterPosts(posts, { type, tag, query });
  const featured = !type && !tag && !query ? posts.find((post) => post.featured) : null;
  const tags = [...new Set(posts.flatMap((post) => post.tags))].sort();
  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  return (
    <div className="min-h-screen text-gray-900 relative">
      <Metadata listingItems={posts.map((post) => ({ name: post.title, url: `/blog/${post.slug}` }))} />
      <WebsiteBackground />
      <NavigationBar />
      <main id="main-content">
        <FeaturedCollections />
        <section className="blog-section blog-intro">
          <p className="blog-eyebrow">The MOOSTYLES journal</p>
          <h1 className="support-my-work__heading"><img src="/projects/Website Branding/MOOSTYLES LOGO - BLACK COLOR.webp" alt="" className="support-my-work__heading-logo" />Blog</h1>
          <p>Stories behind the designs. Ideas for your next build. Explore announcements, tutorials and a closer look at the world of MOOSTYLES.</p>
        </section>
        {featured && <section className="blog-section" aria-labelledby="blog-featured"><h2 id="blog-featured" className="newdesign-heading">In the spotlight</h2><PostCard post={featured} featured /></section>}
        <section className="blog-section" aria-labelledby="blog-latest">
          <h2 id="blog-latest" className="newdesign-heading">Latest posts</h2>
          <div className="blog-filters">
            <div className="blog-types" role="group" aria-label="Filter by post type">
              {["", ...POST_TYPES].map((value) => <button key={value} type="button" aria-pressed={type === value} onClick={() => update("type", value)}>{value || "All posts"}</button>)}
            </div>
            <div className="blog-filter-fields">
              <label>Search posts<input type="search" value={query} onChange={(event) => update("q", event.target.value)} placeholder="Search stories, news and tutorials" /></label>
              <label>Tags<select value={tag} onChange={(event) => update("tag", event.target.value)}><option value="">All tags</option>{[...new Set([...tags, ...(tag ? [tag] : [])])].map((value) => <option key={value}>{value}</option>)}</select></label>
              {(type || tag || query) && <button type="button" className="homepage-text-link" onClick={() => setParams({}, { replace: true })}>Clear filters</button>}
            </div>
          </div>
          <p className="blog-result-count" role="status">{entries.length} {entries.length === 1 ? "post" : "posts"}</p>
          {entries.length ? <div className="blog-grid">{entries.map((post) => <PostCard key={post.slug} post={post} />)}</div>
            : <div className="blog-empty"><h3>{posts.length ? "No posts match your filters." : "New stories are on their way."}</h3><p>{posts.length ? "Try another topic or clear your filters." : "Check back for announcements, design stories and tutorials from MOOSTYLES."}</p></div>}
        </section>
      </main>
      <Footer />
    </div>
  );
};
