import { useState } from "react";
import { SkeletonImage } from "@/Components/ui/SkeletonImage";
import { getImageAlt } from "@/lib/imageMeta";

const isVideo = (src) => typeof src === "string" && /\.mp4(\?|$)/i.test(src);

const Thumb = ({ src, name, isActive, onSelect }) => (
  <button
    type="button"
    role="listitem"
    className={`media-gallery__thumb${isActive ? " media-gallery__thumb--active" : ""}`}
    aria-current={isActive}
    onClick={() => onSelect(src)}
  >
    {isVideo(src) ? (
      <video className="media-gallery__thumb-media" src={src} muted loading="lazy" />
    ) : (
      <SkeletonImage src={src} alt={getImageAlt(src, name)} imgClassName="media-gallery__thumb-media" loading="lazy" />
    )}
  </button>
);

export const MediaGallery = ({ name = "", banner, previews = [], screenshots = [] }) => {
  const [selected, setSelected] = useState(banner);
  const extras = [...previews, ...screenshots];

  return (
    <div className="media-gallery">
      {extras.length > 0 && (
        <div className="media-gallery__thumbs" role="list" aria-label="Additional images">
          {extras.map((src, index) => (
            <Thumb key={`extra-${index}`} src={src} name={name} isActive={src === selected} onSelect={setSelected} />
          ))}
        </div>
      )}

      <div className="media-gallery__main">
        {isVideo(selected) ? (
          <video
            key={selected}
            className="media-gallery__main-media"
            src={selected}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <SkeletonImage
            key={selected}
            imgClassName="media-gallery__main-media"
            src={selected}
            alt={getImageAlt(selected, name)}
            loading="eager"
          />
        )}
      </div>
    </div>
  );
};
