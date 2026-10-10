import { useState, useSyncExternalStore } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { NavigationBar } from "@/Components/NavigationBar";
import { Footer } from "@/Components/Footer";
import { Metadata } from "@/Components/Metadata";
import { ArdenneModCard } from "@/Components/ardenne/ArdenneModCard";
import { Breadcrumb } from "@/Components/mods/Breadcrumb";
import { getArdenneMods } from "@/lib/mods";
import { getArdenneCategories } from "@/lib/modCatalog";
import { LIVE_ARDENNE_CATEGORIES as ARDENNE_CATEGORIES, ARDENNE_LOGOS } from "@/content/ardenne";

const subscribe = () => () => undefined;

export const ArdenneMods = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("name");
  const [downloadSource, setDownloadSource] = useState("");
  // Query URLs share the prerendered base listing. Match its HTML on the first
  // hydration render, then read the requested category from the URL.
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const activeCategory = hydrated
    ? ARDENNE_CATEGORIES.find((category) => category.id === searchParams.get("category"))
    : undefined;
  const mods = getArdenneMods();
  const search = query.trim().toLowerCase();
  const filtered = mods.filter((mod) => {
    const matchesCategory = !activeCategory || getArdenneCategories(mod).some((category) => category.id === activeCategory.id);
    const matchesQuery = !search || [mod.name, ...(mod.tags ?? [])].some((value) => value.toLowerCase().includes(search));
    const matchesSource = !downloadSource || (downloadSource === "public" ? Boolean(mod.downloadOptions.public?.url) : Boolean(mod.downloadOptions.patreonUrl));
    return matchesCategory && matchesQuery && matchesSource;
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
    setDownloadSource("");
    setSort("name");
    selectCategory("");
  };

  return (
    <div className="min-h-screen ardenne-page">
      <Metadata
        pageTitle={activeCategory ? `${activeCategory.label} inZOI Mods | ARDENNE by MOOSTYLES` : undefined}
        pageDescription={activeCategory ? `Explore ${activeCategory.label.toLowerCase()} in the ARDENNE inZOI collection by MOOSTYLES. Browse custom designs, previews, included files and download options.` : undefined}
        ogImage={(activeCategory ?? ARDENNE_CATEGORIES[0]).image}
        listingItems={filtered.map((mod) => ({ name: mod.name, url: `/mods/${mod.slug}` }))}
      />
      <NavigationBar />
      <main id="main-content" className="ardenne-main ardenne-listing">
        <Breadcrumb to="/ardenne" label="ARDENNE" />
        <header className="ardenne-listing__header">
          <img src={ARDENNE_LOGOS.black} alt="" className="ardenne-listing__logo" width="4000" height="4000" />
          <h1>ARDENNE collection</h1>
        </header>

        <div className="ardenne-category-filters" role="group" aria-label="Filter ARDENNE mods by category">
          <button type="button" aria-pressed={!activeCategory} onClick={() => selectCategory("")}>All mods <span className="ardenne-category-filters__count">{mods.length}</span></button>
          {ARDENNE_CATEGORIES.map((category) => (
            <button key={category.id} type="button" aria-pressed={activeCategory?.id === category.id} onClick={() => selectCategory(category.id)}>
              {category.label} <span className="ardenne-category-filters__count">{mods.filter((mod) => getArdenneCategories(mod).some((item) => item.id === category.id)).length}</span>
            </button>
          ))}
        </div>

        <div className="ardenne-listing__layout">
        <aside className="ardenne-listing__filters" aria-label="Refine collection">
          <div className="ardenne-listing__filter-title"><h2>Refine collection</h2><button type="button" onClick={resetFilters}>Reset</button></div>
          <label>Search collection<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name or tag" aria-label="Search ARDENNE mods" /></label>
          <label>Download source<select value={downloadSource} onChange={(event) => setDownloadSource(event.target.value)} aria-label="Filter by download source"><option value="">All sources</option><option value="public">Public download</option><option value="patreon">Patreon</option></select></label>
        </aside>
        <section className="ardenne-listing__results" aria-labelledby="ardenne-results-title">
          <div className="ardenne-listing__result-heading">
            <div><h2 id="ardenne-results-title">{activeCategory ? `${activeCategory.number} / ${activeCategory.label}` : "All ARDENNE mods"}</h2><p role="status">{filtered.length} {filtered.length === 1 ? "mod" : "mods"}</p></div>
            <label className="ardenne-listing__sort"><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort ARDENNE mods"><option value="name">Name: A to Z</option><option value="latest">Latest uploads</option><option value="oldest">Oldest uploads</option></select></label>
          </div>
          {filtered.length > 0 ? (
            <div className="ardenne-mod-grid">
              {filtered.map((mod) => <ArdenneModCard key={mod.slug} mod={mod} />)}
            </div>
          ) : (
            <div className="ardenne-empty">
              <img src={ARDENNE_LOGOS.black} alt="" className="ardenne-empty__mark" width="4000" height="4000" />
              <p className="ardenne-eyebrow">{query || downloadSource ? "Refine your selection" : "The ARDENNE collection"}</p>
              <h3>{query || downloadSource ? "No mods match your filters." : activeCategory ? `No ${activeCategory.label.toLowerCase()} mods yet.` : "The collection is taking shape."}</h3>
              <p>{query || downloadSource ? "Try a different search or broaden your selection." : "Check back for new additions to ARDENNE."}</p>
              {(query || downloadSource || activeCategory) && <button type="button" className="ardenne-button" onClick={resetFilters}>View all ARDENNE mods <ArrowRight size={18} aria-hidden="true" /></button>}
            </div>
          )}
        </section>
        </div>
        <section className="ardenne-listing__more"><p className="ardenne-eyebrow">Part of MOOSTYLES</p><h2>More worlds<br />to create.</h2><Link to="/mods" className="ardenne-button">My Mod List <ArrowRight size={18} aria-hidden="true" /></Link></section>
      </main>
      <Footer brand="ARDENNE" />
    </div>
  );
};
