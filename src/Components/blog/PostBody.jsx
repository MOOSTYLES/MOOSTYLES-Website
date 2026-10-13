import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const PostBody = ({ body }) => (
  <div className="blog-prose">
    <Markdown remarkPlugins={[remarkGfm]} skipHtml components={{
      img: ({ src, alt }) => <img src={src} alt={alt || ""} loading="lazy" />,
      h1: ({ children }) => <h2>{children}</h2>,
    }}>{body}</Markdown>
  </div>
);
