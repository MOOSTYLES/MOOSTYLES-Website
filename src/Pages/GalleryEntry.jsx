import { Link, useParams } from "react-router-dom";
import { NavigationBar } from "@/Components/NavigationBar";
import { Footer } from "@/Components/Footer";
import { WebsiteBackground } from "@/Components/WebsiteBackground";
import { Metadata } from "@/Components/Metadata.jsx";
import { Breadcrumb } from "@/Components/mods/Breadcrumb";
import { getGalleryEntries } from "@/lib/mods";
import { getImageAlt } from "@/lib/imageMeta";

export const GalleryEntry = () => {
  const { slug } = useParams();
  const entry = getGalleryEntries().find((item) => item.key === slug);

  if (!entry) {
    return (
      <div className="min-h-screen">
        <Metadata pageTitle="Gallery Entry Not Found | MOOSTYLES" noindex />
        <WebsiteBackground />
        <NavigationBar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="mod-detail__title newdesign-heading">Gallery Entry Not Found</h1>
          <Link to="/gallery" className="mod-breadcrumb">
            Back to Gallery
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Metadata
        pageTitle={`${entry.modName} Screenshot | MOOSTYLES`}
        pageDescription={`An in-game screenshot from ${entry.modName}.`}
        ogImage={entry.src}
        canonical={`/gallery/${entry.key}`}
      />
      <WebsiteBackground />
      <NavigationBar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Breadcrumb to="/gallery" label="Gallery" />
        <h1 className="mod-detail__title newdesign-heading">{entry.modName}</h1>
        <img src={entry.src} alt={getImageAlt(entry.src, entry.modName)} className="gallery-entry__image" />
        <Link to={`/mods/${entry.modSlug}`} className="mod-breadcrumb">
          View {entry.modName}
        </Link>
      </main>
      <Footer />
    </div>
  );
};
