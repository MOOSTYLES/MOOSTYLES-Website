import { Link } from "react-router-dom";
import InZOIMods from "@/Components/InZOIMods";
import { getStandardMods } from "@/lib/mods";

export const ModListSection = () => {
  const mods = getStandardMods().slice(0, 5);
  if (!mods.length) return null;

  return (
    <section className="mod-list-section">
      <h1 className="mod-list-section__heading">My Mod List</h1>
      <div className="mod-list-section__grid">
        {mods.map((mod) => (
          <InZOIMods
            key={mod.slug}
            item={{ name: mod.name, image: mod.media.banner }}
            href={`/mods/${mod.slug}`}
          />
        ))}
      </div>
      <div className="mod-list-section__footer">
        <Link to="/mods" className="homepage-text-link">
          View More
        </Link>
      </div>
    </section>
  );
};
