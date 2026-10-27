import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Heart } from "lucide-react";
import { SkeletonImage } from "@/Components/ui/SkeletonImage";
import { getImageAlt } from "@/lib/imageMeta";
import { getArdenneCategories } from "@/lib/modCatalog";
import { isProductSaved, saveProduct, unsaveProduct } from "@/lib/savedProducts";

const toArdenneLabels = (mod) =>
  getArdenneCategories(mod).map((category) => ({ id: category.id, label: category.label, to: `/ardenne/mods?category=${category.id}` }));

// Shared by both catalogs; MOOSTYLES passes its own category labels.
export const ArdenneModCard = ({ mod, labels = toArdenneLabels(mod) }) => {
  const href = `/mods/${mod.slug}`;
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const update = () => setSaved(isProductSaved(mod.legacyId));
    update();
    window.addEventListener("savedProductsChanged", update);
    return () => window.removeEventListener("savedProductsChanged", update);
  }, [mod.legacyId]);

  const toggleSaved = () => {
    const wasSaved = isProductSaved(mod.legacyId);
    const success = wasSaved ? unsaveProduct(mod.legacyId) : saveProduct({ id: mod.legacyId });
    if (success) {
      setSaved(!wasSaved);
      setNotice(wasSaved ? "Removed from your saved items." : "Added to your saved items.");
    }
  };

  return (
    <article className="ardenne-mod-card">
      <div className="ardenne-mod-card__visual">
        <Link to={href} aria-label={`View ${mod.name}`}>
          <SkeletonImage
            src={mod.media.banner || "/projects/ARDENNE/preview-placeholder.svg"}
            fallbackSrc="/projects/ARDENNE/preview-placeholder.svg"
            alt={getImageAlt(mod.media.banner, mod.name)}
            loading="lazy"
          />
        </Link>
        {mod.legacy?.isNew && <span className="ardenne-mod-card__new">New addition</span>}
        <button
          type="button"
          className="ardenne-mod-card__save"
          aria-label={`${saved ? "Remove" : "Save"} ${mod.name}${saved ? " from saved items" : ""}`}
          aria-pressed={saved}
          onClick={toggleSaved}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
        </button>
      </div>
      <div className="ardenne-mod-card__body">
        <div className="ardenne-mod-card__labels" aria-label={`${mod.name} categories`}>
          {labels.length ? labels.map((label) => (
            <Link key={label.id} to={label.to}>{label.label}</Link>
          )) : <span>Uncategorised</span>}
        </div>
        <h3><Link to={href}>{mod.name}</Link></h3>
        {mod.description && <p className="ardenne-mod-card__description">{mod.description}</p>}
        <div className="ardenne-mod-card__bottom"><span>{(mod.fileTypes ?? []).join(" · ") || "inZOI mod"}</span><Link to={href} className="ardenne-mod-card__discover">View mod <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
        <span className="sr-only" role="status">{notice}</span>
      </div>
    </article>
  );
};
