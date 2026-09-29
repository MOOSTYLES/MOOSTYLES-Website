import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getGalleryEntries } from "@/lib/mods";
import { SkeletonImage } from "@/Components/ui/SkeletonImage";
import { getImageAlt } from "@/lib/imageMeta";

const MotionLink = motion.create(Link);

export const GalleryTeaser = () => {
  const entries = getGalleryEntries().slice(0, 3);

  return (
    <section className="gallery-teaser">
      <h1 className="gallery-teaser__heading newdesign-heading">Gallery</h1>
      <p className="gallery-teaser__note">
        More resource types, including character downloads and community showcases, are coming
        soon.
      </p>
      {entries.length > 0 ? (
        <div className="gallery-teaser__grid">
          {entries.map((entry) => (
            <MotionLink
              to={`/mods/${entry.modSlug}`}
              key={entry.key}
              className="media-card"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="media-card__image">
                <SkeletonImage src={entry.src} alt={getImageAlt(entry.src, entry.modName)} loading="lazy" />
              </div>
              <span className="media-card__title">{entry.modName}</span>
            </MotionLink>
          ))}
        </div>
      ) : (
        <p className="gallery-teaser__empty">No gallery entries yet.</p>
      )}
      <Link to="/gallery" className="homepage-text-link">
        View Gallery
      </Link>
    </section>
  );
};
