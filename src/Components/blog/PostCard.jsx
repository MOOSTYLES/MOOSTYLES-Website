import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { SkeletonImage } from "@/Components/ui/SkeletonImage";
import { formatPostDate } from "@/lib/blog";

export const PostCard = ({ post, featured = false }) => (
  <article className={`blog-card${featured ? " blog-card--featured" : ""}`}>
    <Link to={`/blog/${post.slug}`} className="blog-card__image-link" aria-label={`Read ${post.title}`}>
      {post.cover ? <SkeletonImage src={post.cover} alt={post.coverAlt || post.title} loading="lazy" />
        : <div className="blog-card__placeholder" aria-hidden="true"><BookOpen size={48} /><span>MOOSTYLES JOURNAL</span></div>}
    </Link>
    <div className="blog-card__copy">
      <div className="blog-post__meta"><span className="blog-type">{post.type}</span>{post.publishedAt && <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>}</div>
      <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
      <p>{post.excerpt}</p>
      <div className="blog-tags">{post.tags.map((tag) => <Link key={tag} to={`/blog?tag=${encodeURIComponent(tag)}`}>{tag}</Link>)}</div>
      <Link to={`/blog/${post.slug}`} className="homepage-text-link">Read more <ArrowRight size={16} aria-hidden="true" /></Link>
    </div>
  </article>
);
