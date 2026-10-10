import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { NavigationBar } from "@/Components/NavigationBar";
import { Footer } from "@/Components/Footer";
import { WebsiteBackground } from "@/Components/WebsiteBackground";
import { Metadata } from "@/Components/Metadata.jsx";
import { getModByAnyId } from "@/lib/mods";
import { logRedirect } from "@/lib/redirect";
import { isPublicLocked } from "@/lib/downloadOptions";

export const ModDownload = () => {
  const { id } = useParams();
  const mod = getModByAnyId(id);
  const url = mod?.downloadOptions.public?.url ?? null;
  const locked = mod ? isPublicLocked(mod.downloadOptions.public?.date) : false;
  const canDownload = Boolean(mod && url && !locked);

  useEffect(() => {
    if (canDownload) {
      logRedirect(url);
      window.location.replace(url);
    }
  }, [canDownload, url]);

  if (!mod) {
    return (
      <div className="min-h-screen">
        <Metadata
          pageTitle="Mod Not Found | MOOSTYLES"
          pageDescription="This inZOI mod could not be found. Browse MOOSTYLES collections, previews and download options."
          noindex
        />
        <WebsiteBackground />
        <NavigationBar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="mod-detail__title newdesign-heading">Mod Not Found</h1>
          <Link to="/mods" className="mod-breadcrumb">
            Browse all mods
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (!canDownload) {
    return (
      <div className="min-h-screen">
        <Metadata
          pageTitle={`${mod.name} Download Unavailable | MOOSTYLES`}
          pageDescription={`${mod.name} does not currently have an available public download. Visit its inZOI mod page for release details and download options.`}
          noindex
        />
        <WebsiteBackground />
        <NavigationBar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="mod-detail__title newdesign-heading">Download Unavailable</h1>
          <p className="mod-detail__empty-state">
            {locked
              ? `${mod.name} is still in early access.`
              : `${mod.name} does not have a public download yet.`}
          </p>
          <Link to={`/mods/${mod.slug}`} className="mod-breadcrumb">
            Back to {mod.name}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Metadata
        pageTitle={`Downloading ${mod.name} | MOOSTYLES`}
        pageDescription={`Opening the public download page for ${mod.name}, an inZOI mod from MOOSTYLES.`}
        noindex
      />
      <WebsiteBackground />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="mod-detail__description">Redirecting to the {mod.name} download...</p>
      </main>
    </div>
  );
};
