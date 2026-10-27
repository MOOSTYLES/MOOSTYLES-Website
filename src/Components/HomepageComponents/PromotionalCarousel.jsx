import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import imageMeta from "@/content/imageMeta.json";
import { getImageAlt } from "@/lib/imageMeta";
import { HERO_IMAGES } from "@/content/heroImages";

const FALLBACK_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjNjY2NjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TW9vU3R5bGUgQmFubmVyPC90ZXh0Pjwvc3ZnPg==";

// CMS uploads may not have metadata yet, so fall back to the file name.
const getSlideLabel = (path) =>
  imageMeta[path]?.title ?? decodeURIComponent(path.split("/").pop()).replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");

// Mirrors the ARDENNE hero: crossfading full-bleed image, numbered slide list and caption.
export const PromotionalCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeImage = HERO_IMAGES[activeIndex];

  useEffect(() => {
    if (HERO_IMAGES.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setActiveIndex((index) => (index + 1) % HERO_IMAGES.length);
      }
    }, 6000);
    return () => window.clearInterval(timer);
  }, [activeIndex]);

  if (!activeImage) return null;

  return (
    <section className="home-hero" aria-roledescription="carousel" aria-label="Featured">
      <AnimatePresence initial={false}>
        <motion.img
          key={activeImage}
          src={activeImage}
          alt={getImageAlt(activeImage, "MOOSTYLES banner")}
          fetchPriority={activeIndex === 0 ? "high" : "auto"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.8 }}
          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
        />
      </AnimatePresence>
      <div className="home-hero__shade" />
      {HERO_IMAGES.length > 1 && (
        <div className="home-hero__bottom">
          <ol className="home-hero__slides" aria-label="Slides">
            {HERO_IMAGES.map((path, index) => (
              <li key={path}>
                <button
                  type="button"
                  aria-current={index === activeIndex ? "true" : undefined}
                  aria-label={`Show slide ${index + 1}: ${getSlideLabel(path)}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </button>
              </li>
            ))}
          </ol>
          <p className="home-hero__caption">{getSlideLabel(activeImage)}</p>
        </div>
      )}
    </section>
  );
};
