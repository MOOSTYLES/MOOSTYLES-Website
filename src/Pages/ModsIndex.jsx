import { useMemo, useState } from "react";
import { NavigationBar } from "@/Components/NavigationBar";
import { Footer } from "@/Components/Footer";
import { WebsiteBackground } from "@/Components/WebsiteBackground";
import { Metadata } from "@/Components/Metadata.jsx";
import { ProductCard } from "@/Components/ProductCard";
import { getStandardMods } from "@/lib/mods";

const toLegacyCard = (mod) => ({
  id: mod.legacyId,
  slug: mod.slug,
  name: mod.name,
  brand: mod.collection ? "Collections" : "Individual",
  image: mod.media.banner,
  images: [mod.media.banner, ...mod.media.previews],
});

export const ModsIndex = () => {
  const [query, setQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const allMods = useMemo(() => getStandardMods(), []);

  const filtered = useMemo(() => {
    let list = allMods.filter((mod) => {
      const matchesQuery = !query || mod.name.toLowerCase().includes(query.toLowerCase());
      if (!matchesQuery) return false;
      if (filterValue === "type:individual") return !mod.collection;
      if (filterValue === "type:collections") return Boolean(mod.collection);
      return true;
    });

    if (filterValue === "sort:latest") {
      list = [...list].sort((a, b) => Number(b.legacy.isNew) - Number(a.legacy.isNew));
    } else if (filterValue === "sort:oldest") {
      list = [...list].sort((a, b) => Number(a.legacy.isNew) - Number(b.legacy.isNew));
    }

    return list;
  }, [allMods, query, filterValue]);

  return (
    <div className="min-h-screen">
      <Metadata listingItems={filtered.map((mod) => ({ name: mod.name, url: `/mods/${mod.slug}` }))} />

      <WebsiteBackground />
      <NavigationBar />

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="mod-detail__title mods-index__title newdesign-heading newdesign-brand-label">
          My Mod List
        </h1>

        <div className="mods-index__filters">
          <input
            type="search"
            className="mods-index__search"
            placeholder="Search mods"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search mods"
          />
          <select
            className="mods-index__filter-select"
            value={filterValue}
            onChange={(event) => setFilterValue(event.target.value)}
            aria-label="Filter mods"
          >
            <option value="">All Mods</option>
            <optgroup label="Type">
              <option value="type:individual">Individual</option>
              <option value="type:collections">Collections</option>
            </optgroup>
            <optgroup label="Sort">
              <option value="sort:latest">Latest</option>
              <option value="sort:oldest">Oldest</option>
            </optgroup>
          </select>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
            {filtered.map((mod) => (
              <ProductCard key={mod.slug} product={toLegacyCard(mod)} />
            ))}
          </div>
        ) : (
          <p className="mod-detail__empty-state mt-8">No mods match your search.</p>
        )}
      </main>

      <Footer />
    </div>
  );
};
