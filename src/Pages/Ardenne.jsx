import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { NavigationBar } from "@/Components/NavigationBar";
import { Footer } from "@/Components/Footer";
import { Metadata } from "@/Components/Metadata";
import { LIVE_ARDENNE_CATEGORIES as ARDENNE_CATEGORIES, ARDENNE_PUBLIC_COPY, ARDENNE_LOGOS } from "@/content/ardenne";
import { getArdenneListingItems } from "@/lib/seo";

export const Ardenne = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCategory = ARDENNE_CATEGORIES[activeIndex];
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setActiveIndex((index) => (index + 1) % ARDENNE_CATEGORIES.length);
      }
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen ardenne-page" style={{ "--ardenne-category-count": ARDENNE_CATEGORIES.length, "--ardenne-values-count": ARDENNE_CATEGORIES.length + 1 }}>
      <Metadata listingItems={getArdenneListingItems()} />
      <NavigationBar />

      <main id="main-content" className="ardenne-main">
        <header className="ardenne-masthead">
          <div className="ardenne-masthead__brand">
            <img src={ARDENNE_LOGOS.black} alt="" className="ardenne-masthead__logo" width="4000" height="4000" />
            <div>
              <p className="ardenne-eyebrow">A collection by MOOSTYLES</p>
              <h1 className="ardenne-wordmark">ARDENNE</h1>
            </div>
          </div>
          <nav className="ardenne-section-nav" aria-label="ARDENNE sections">
            <Link to="/ardenne/mods">Browse mods <ArrowRight size={16} aria-hidden="true" /></Link>
          </nav>
        </header>

        <section className="ardenne-hero" aria-label={ARDENNE_PUBLIC_COPY.worldDescription}>
          <AnimatePresence initial={false}>
            <motion.img
              key={activeCategory.id}
              src={activeCategory.image}
              alt={activeCategory.alt}
              fetchPriority={activeIndex === 0 ? "high" : "auto"}
              width="1536"
              height="1024"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.8 }}
            />
          </AnimatePresence>
          <div className="ardenne-hero__shade" />
          <div className="ardenne-hero__content">
            <p className="ardenne-eyebrow">A world without compromise</p>
            <h2>Exceptional.<br />By {activeCategory.world.toLowerCase()}.<br /><span>{activeCategory.ending}</span></h2>
            <p>For those who shape their world<br />on their own terms.</p>
            <a className="ardenne-button" href="#collection">Explore the collection <Plus size={18} aria-hidden="true" /></a>
          </div>
          <div className="ardenne-hero__bottom">
            <ol className="ardenne-worlds" aria-label="Featured categories">
              {ARDENNE_CATEGORIES.map((category) => (
                <li
                  key={category.id}
                  aria-current={activeCategory.id === category.id ? "true" : undefined}
                >
                  <span>{category.number}</span> {category.carouselLabel}
                </li>
              ))}
            </ol>
            <p className="ardenne-hero__caption">{activeCategory.caption}</p>
          </div>
        </section>

        <div className="ardenne-values" aria-label="Collection principles">
          {ARDENNE_CATEGORIES.map((category) => <div key={category.id}><span>{category.number} / {category.world}</span><p>{category.principle}</p></div>)}
          <div><span>One philosophy</span><p>Nothing ordinary.</p></div>
        </div>

        <section className="ardenne-section" id="collection" aria-labelledby="ardenne-collection-title">
          <div className="ardenne-section-heading">
            <div>
              <p className="ardenne-eyebrow">The collection</p>
              <h2 id="ardenne-collection-title">{ARDENNE_PUBLIC_COPY.collectionHeading}<br />One standard.</h2>
            </div>
            <div>
              <p>Objects of extraordinary ambition.<br />Chosen for the worlds you create.</p>
              <Link to="/ardenne/mods" className="ardenne-text-link">View all ARDENNE mods <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </div>

          <div className="ardenne-collection-grid">
            {ARDENNE_CATEGORIES.map((category) => (
              <Link key={category.id} to={`/ardenne/mods?category=${category.id}`} className="ardenne-collection-card" aria-label={`Browse ${category.label} mods`}>
                <img src={category.image} alt={category.alt} loading="lazy" width="1536" height="1024" />
                <span className="ardenne-collection-card__number">{category.number} / {category.label}</span>
                <div className="ardenne-collection-card__body">
                  <div><p>{category.eyebrow}</p><h3>{category.title}</h3></div>
                  <span className="ardenne-collection-card__arrow"><ArrowRight size={18} aria-hidden="true" /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="ardenne-philosophy ardenne-section" id="philosophy" aria-labelledby="ardenne-philosophy-title">
          <div>
            <p className="ardenne-eyebrow">The ARDENNE philosophy</p>
            <h2 id="ardenne-philosophy-title">True luxury<br />is the freedom<br />to <em>choose.</em></h2>
          </div>
          <div className="ardenne-philosophy__copy">
            <p>Not more. Simply extraordinary.</p>
            <p>{ARDENNE_PUBLIC_COPY.experiences} The most valuable things are the experiences they make possible.</p>
            <p>ARDENNE brings {ARDENNE_PUBLIC_COPY.worldDescription} into one considered collection of inZOI mods. For creators with a clear sense of what matters.</p>
            <a href="#experience" className="ardenne-text-link">Discover the ARDENNE experience <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
        </section>

        <section className="ardenne-sea-feature" aria-label="Explore yachts">
          <img src={ARDENNE_CATEGORIES[1].image} alt={ARDENNE_CATEGORIES[1].alt} loading="lazy" width="1536" height="1024" />
          <div className="ardenne-sea-feature__content">
            <p className="ardenne-eyebrow">A different perspective</p>
            <h2>Less ordinary.<br />More <em>horizon.</em></h2>
            <Link to="/ardenne/mods?category=yachts" className="ardenne-button ardenne-button--white">Discover yachting <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </section>

        <section className="ardenne-section" id="experience" aria-labelledby="ardenne-experience-title">
          <div className="ardenne-section-heading">
            <div>
              <p className="ardenne-eyebrow">The ARDENNE experience</p>
              <h2 id="ardenne-experience-title">Your world.<br />Your own terms.</h2>
            </div>
            <p>A considered collection.<br />A new way to make it yours.</p>
          </div>
          <div className="ardenne-steps">
            <article><span>01</span><h3>Find your world.</h3><p>Explore {ARDENNE_PUBLIC_COPY.categories}. Choose the details that speak to the way you create.</p></article>
            <article><span>02</span><h3>A closer look.</h3><p>Discover each mod through its previews, included files and installation notes.</p></article>
            <article><span>03</span><h3>Make it yours.</h3><p>Download your selection and bring a new perspective to your inZOI world.</p></article>
          </div>
          <Link to="/ardenne/mods" className="ardenne-button">Browse the collection <ArrowRight size={18} aria-hidden="true" /></Link>
        </section>
      </main>
      <Footer brand="ARDENNE" />
    </div>
  );
};
