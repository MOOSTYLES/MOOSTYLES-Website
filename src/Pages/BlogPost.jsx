import { Link, useParams } from "react-router-dom";
import { NavigationBar } from "@/Components/NavigationBar";
import { Footer } from "@/Components/Footer";
import { WebsiteBackground } from "@/Components/WebsiteBackground";
import { Metadata } from "@/Components/Metadata";
import { PostBody } from "@/Components/blog/PostBody";
import { PostCard } from "@/Components/blog/PostCard";
import { formatPostDate, getAllPosts, getPostBySlug, getPostMetadata } from "@/lib/blog";

export const BlogPost = () => {
  const { slug } = useParams();
  const post = getPostBySlug(slug);
  const related = post ? getAllPosts().filter((item) => item.slug !== slug && (item.type === post.type || item.tags.some((tag) => post.tags.includes(tag)))).slice(0, 3) : [];
  return (
    <div className="min-h-screen text-gray-900 relative">
      <Metadata {...(post ? getPostMetadata(post) : { pageTitle: "Post Not Found | MOOSTYLES", noindex: true })} />
      <WebsiteBackground />
      <NavigationBar />
      <main id="main-content">
        <article className="blog-section blog-post">
          <Link to="/blog" className="homepage-text-link">← Back to Blog</Link>
          {post ? <>
            <header className="blog-post__header">
              <div className="blog-post__meta"><Link className="blog-type" to={`/blog?type=${encodeURIComponent(post.type)}`}>{post.type}</Link>{post.publishedAt && <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>}</div>
              <h1 className="newdesign-heading">{post.title}</h1>
              <p className="blog-post__excerpt">{post.excerpt}</p>
              <p>By {post.author}</p>
              <div className="blog-tags">{post.tags.map((tag) => <Link key={tag} to={`/blog?tag=${encodeURIComponent(tag)}`}>{tag}</Link>)}</div>
            </header>
            {post.cover && <img src={post.cover} alt={post.coverAlt || post.title} className="blog-post__cover" />}
            <PostBody body={post.body} />
          </> : <div className="blog-empty"><h1>Post not found</h1><p>This post may have moved or is no longer available.</p></div>}
        </article>
        {related.length > 0 && <section className="blog-section"><h2 className="newdesign-heading">Keep exploring</h2><div className="blog-grid">{related.map((item) => <PostCard key={item.slug} post={item} />)}</div></section>}
      </main>
      <Footer />
    </div>
  );
};
