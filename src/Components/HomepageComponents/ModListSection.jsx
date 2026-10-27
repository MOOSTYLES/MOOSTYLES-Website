import { Link } from "react-router-dom";
import InZOIMods from "@/Components/InZOIMods";
import { getLatestStandardMods, HOMEPAGE_MOD_COUNT } from "@/lib/mods";

export const ModListSection = () => {
  const mods = getLatestStandardMods(HOMEPAGE_MOD_COUNT);
  if (!mods.length) return null;

  return (
    <section className="mod-list-section">
      <div className="mod-list-section__header">
        <h2 className="mod-list-section__heading">Latest Mods</h2>
        <Link to="/mods" className="homepage-text-link">
          View all mods
        </Link>
      </div>
      <div className="mod-list-section__grid">
        {mods.map((mod) => (
          <InZOIMods
            key={mod.slug}
            item={{ name: mod.name, image: mod.media.banner }}
            href={`/mods/${mod.slug}`}
          />
        ))}
      </div>
    </section>
  );
};
