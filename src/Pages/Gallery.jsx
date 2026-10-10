import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { NavigationBar } from "@/Components/NavigationBar";
import { Footer } from "@/Components/Footer";
import { WebsiteBackground } from "@/Components/WebsiteBackground";
import { Metadata } from "@/Components/Metadata.jsx";
import { getGalleryEntries } from "@/lib/mods";
import { SkeletonImage } from "@/Components/ui/SkeletonImage";
import { getImageAlt } from "@/lib/imageMeta";

const MotionLink = motion.create(Link);

export const Gallery = () => {
  const entries = getGalleryEntries();

  return (
    <div className="min-h-screen">
      <Metadata listingItems={entries.map((entry) => ({ name: `${entry.modName} Screenshot`, url: `/gallery/${entry.key}` }))} ogImage={entries[0]?.src} />
      <WebsiteBackground />
      <NavigationBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="mod-detail__title newdesign-heading">Gallery</h1>
        {entries.length > 0 ? (
          <div className="gallery-teaser__grid gallery-page__grid">
            {entries.map((entry) => (
              <MotionLink
                to={`/gallery/${entry.key}`}
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
          <p className="mod-detail__empty-state">No gallery entries yet.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};
