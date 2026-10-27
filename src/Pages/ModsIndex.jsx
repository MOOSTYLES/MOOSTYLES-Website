import { useState, useSyncExternalStore } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { NavigationBar } from "@/Components/NavigationBar";
import { Footer } from "@/Components/Footer";
import { WebsiteBackground } from "@/Components/WebsiteBackground";
import { Metadata } from "@/Components/Metadata.jsx";
import { ArdenneModCard } from "@/Components/ardenne/ArdenneModCard";
import { Breadcrumb } from "@/Components/mods/Breadcrumb";
import { getStandardMods } from "@/lib/mods";
import { getMoostylesCategories } from "@/lib/modCatalog";
import { MOOSTYLES_CATEGORIES } from "@/content/moostylesCategories";

const MOOSTYLES_LOGO = "/projects/Website Branding/MOOSTYLES LOGO - BLACK COLOR.webp";

const subscribe = () => () => undefined;

const toLabels = (mod) =>
  getMoostylesCategories(mod).map((category) => ({ id: category.id, label: category.label, to: `/mods?category=${category.id}` }));

// Mirrors the ARDENNE listing (/ardenne/mods) in MOOSTYLES colours.
export const ModsIndex = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("name");
  const [type, setType] = useState("");
  // Query URLs share the prerendered base listing. Match its HTML on the first
  // hydration render, then read the requested category from the URL.
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const activeCategory = hydrated
    ? MOOSTYLES_CATEGORIES.find((category) => category.id === searchParams.get("category"))
    : undefined;
  const mods = getStandardMods();
  const search = query.trim().toLowerCase();
  const refined = Boolean(query || type);
  const filtered = mods.filter((mod) => {
    const matchesCategory = !activeCategory || getMoostylesCategories(mod).some((category) => category.id === activeCategory.id);
    const matchesQuery = !search || [mod.name, ...(mod.tags ?? [])].some((value) => value.toLowerCase().includes(search));
    const matchesType = !type || (type === "collections" ? Boolean(mod.collection) : !mod.collection);
    return matchesCategory && matchesQuery && matchesType;
  }).sort((a, b) => {
    if (sort === "latest" || sort === "oldest") {
      const difference = (Date.parse(a.dateAdded) || 0) - (Date.parse(b.dateAdded) || 0);
      return (sort === "latest" ? -difference : difference) || a.name.localeCompare(b.name);
    }
    return a.name.localeCompare(b.name);
  });

  const selectCategory = (id) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (id) next.set("category", id);
      else next.delete("category");
      return next;
    });
  };

  const resetFilters = () => {
    setQuery("");
    setType("");
    setSort("name");
    selectCategory("");
  };

  return (
    <div className="min-h-screen moostyles-listing">
      <Metadata
        pageTitle={activeCategory ? `${activeCategory.label} inZOI Mods | MOOSTYLES` : undefined}
        pageDescription={activeCategory ? `Browse ${activeCategory.label.toLowerCase()} inZOI mods by MOOSTYLES, with previews, included files and download options.` : undefined}
        listingItems={filtered.map((mod) => ({ name: mod.name, url: `/mods/${mod.slug}` }))}
      />
      <WebsiteBackground />
      <NavigationBar />
      <main id="main-content" className="ardenne-main ardenne-listing">
        <Breadcrumb to="/" label="Home" />
        {/* Kept for screen readers and search engines; the nav already shows the brand. */}
        <h1 className="sr-only">MOOSTYLES mod list</h1>

        <div className="ardenne-category-filters" role="group" aria-label="Filter mods by category">
          <button type="button" aria-pressed={!activeCategory} onClick={() => selectCategory("")}>All mods <span className="ardenne-category-filters__count">{mods.length}</span></button>
          {MOOSTYLES_CATEGORIES.map((category) => (
            <button key={category.id} type="button" aria-pressed={activeCategory?.id === category.id} onClick={() => selectCategory(category.id)}>
              {category.label} <span className="ardenne-category-filters__count">{mods.filter((mod) => getMoostylesCategories(mod).some((item) => item.id === category.id)).length}</span>
            </button>
          ))}
        </div>

        <div className="ardenne-listing__layout">
          <aside className="ardenne-listing__filters" aria-label="Refine mods">
            <div className="ardenne-listing__filter-title"><h2>Refine mods</h2><button type="button" onClick={resetFilters}>Reset</button></div>
            <label>Search mods<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name or tag" aria-label="Search mods" /></label>
            <label>Type<select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter by type"><option value="">All types</option><option value="individual">Individual pieces</option><option value="collections">Collections</option></select></label>
          </aside>
          <section className="ardenne-listing__results" aria-labelledby="mods-results-title">
            <div className="ardenne-listing__result-heading">
              <div><h2 id="mods-results-title">{activeCategory ? activeCategory.label : "All mods"}</h2><p role="status">{filtered.length} {filtered.length === 1 ? "mod" : "mods"}</p></div>
              <label className="ardenne-listing__sort"><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort mods"><option value="name">Name: A to Z</option><option value="latest">Latest uploads</option><option value="oldest">Oldest uploads</option></select></label>
            </div>
            {filtered.length > 0 ? (
              <div className="ardenne-mod-grid">
                {filtered.map((mod) => <ArdenneModCard key={mod.slug} mod={mod} labels={toLabels(mod)} />)}
              </div>
            ) : (
              <div className="ardenne-empty">
                <img src={MOOSTYLES_LOGO} alt="" className="ardenne-empty__mark" />
                <p className="ardenne-eyebrow">{refined ? "Refine your selection" : "The MOOSTYLES mod list"}</p>
                <h3>{refined ? "No mods match your filters." : activeCategory ? `No ${activeCategory.label.toLowerCase()} mods yet.` : "New mods are on the way."}</h3>
                <p>{refined ? "Try a different search or broaden your selection." : "Check back for new additions."}</p>
                {(refined || activeCategory) && <button type="button" className="ardenne-button" onClick={resetFilters}>View all mods <ArrowRight size={18} aria-hidden="true" /></button>}
              </div>
            )}
          </section>
        </div>
        <section className="ardenne-listing__more"><p className="ardenne-eyebrow">Also by MOOSTYLES</p><h2>ARDENNE.<br />Nothing ordinary.</h2><Link to="/ardenne/mods" className="ardenne-button">Explore ARDENNE <ArrowRight size={18} aria-hidden="true" /></Link></section>
      </main>
      <Footer />
    </div>
  );
};
