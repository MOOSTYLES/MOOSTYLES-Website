import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { NavigationBar } from "@/Components/NavigationBar";
import { Footer } from "@/Components/Footer";
import { WebsiteBackground } from "@/Components/WebsiteBackground";
import { Metadata } from "@/Components/Metadata.jsx";
import { MediaGallery } from "@/Components/mods/MediaGallery";
import { SectionTabs } from "@/Components/mods/SectionTabs";
import { DownloadOptions } from "@/Components/mods/DownloadOptions";
import { FileManifest } from "@/Components/mods/FileManifest";
import { KnownIssues } from "@/Components/mods/KnownIssues";
import { Breadcrumb } from "@/Components/mods/Breadcrumb";
import { getModByAnyId, getRelatedMods } from "@/lib/mods";
import { DEFAULT_MOD_TABS } from "@/lib/modDetailTabs";
import { ProductCard } from "@/Components/ProductCard";
import { ArdenneModCard } from "@/Components/ardenne/ArdenneModCard";
import { getArdenneCategories, getModListingPath, isArdenneMod } from "@/lib/modCatalog";
import { getModMetadata } from "@/lib/seo";

const toLegacyCard = (mod) => ({
  id: mod.legacyId,
  slug: mod.slug,
  name: mod.name,
  brand: mod.collection ? "Collections" : "Individual",
  image: mod.media.banner,
  images: [mod.media.banner, ...mod.media.previews],
  isNew: mod.legacy.isNew,
});

export const ModDetail = () => {
  const params = useParams();
  const modId = params.slug ?? params.id;
  const mod = getModByAnyId(modId);
  const [activeTab, setActiveTab] = useState("All");

  if (!mod) {
    return (
      <div className="min-h-screen">
        <WebsiteBackground />
        <NavigationBar />
        <Metadata
          pageTitle="Mod Not Found | MOOSTYLES"
          pageDescription="This inZOI mod could not be found. Browse MOOSTYLES collections, previews and download options."
          noindex
        />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Mod Not Found</h1>
          <p className="text-gray-600 mb-6">
            The mod "{modId}" doesn't exist or may have been moved.
          </p>
          <Link to="/mods" className="text-teal-600 font-semibold">
            Browse all mods
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const activeTabDef = DEFAULT_MOD_TABS.find((tab) => tab.label === activeTab) || DEFAULT_MOD_TABS[0];
  const isSectionVisible = (sectionId) => activeTabDef.sectionIds.includes(sectionId);

  const relatedMods = getRelatedMods(mod.slug, 4);
  const ardenneCategories = getArdenneCategories(mod);
  const ardenne = isArdenneMod(mod);
  const pageBrand = ardenne ? "ARDENNE" : "MOOSTYLES";

  return (
    <div className={`min-h-screen${ardenne ? " ardenne-page ardenne-detail" : ""}`}>
      <Metadata {...getModMetadata(mod)} />

      {!ardenne && <WebsiteBackground />}
      <NavigationBar />

      <main id="main-content" className={ardenne ? "ardenne-main ardenne-detail__main" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"}>
        <Breadcrumb to={getModListingPath(mod)} label={isArdenneMod(mod) ? "ARDENNE Collection" : "My Mod List"} />

        {isArdenneMod(mod) && (
          <p className="ardenne-mod-label">
            ARDENNE{ardenneCategories.length > 0 ? ` / ${ardenneCategories.map((category) => category.label).join(" / ")}` : ""}
          </p>
        )}

        <h1 className="mod-detail__title newdesign-heading newdesign-brand-label">{mod.name}</h1>

        <div className="mod-detail__layout">
          <div className="mod-detail__media-col">
            <MediaGallery
              name={mod.name}
              banner={mod.media.banner}
              previews={mod.media.previews}
              screenshots={mod.media.screenshots}
            />
          </div>

          <div className="mod-detail__content mod-detail__content-col">
            <h2 className="mod-detail__title newdesign-heading">{mod.name}</h2>

            <SectionTabs tabs={DEFAULT_MOD_TABS} activeLabel={activeTab} onSelect={setActiveTab} />

            {isSectionVisible("details") && (
              <section
                id="section-tabpanel-details"
                role="tabpanel"
                aria-labelledby={`section-tab-${activeTab}`}
                className="mod-detail__section"
              >
                <h3 className="mod-detail__section-heading">Details & Download</h3>

                <DownloadOptions
                  patreonUrl={mod.downloadOptions.patreonUrl}
                  curseforgeUrl={mod.downloadOptions.public?.url}
                  fileTypes={mod.fileTypes}
                />

                <p className="mod-detail__description">{mod.description}</p>

                {mod.highlights && mod.highlights.length > 0 && (
                  <>
                    <h4 className="mod-detail__subheading">Highlights</h4>
                    <ul className="mod-detail__highlights">
                      {mod.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </>
                )}

                {mod.installation && mod.installation.length > 0 && (
                  <>
                    <h4 className="mod-detail__subheading">Installation</h4>
                    {mod.installation.map((step, index) => (
                      <p className="mod-detail__description" key={index}>
                        {step}
                      </p>
                    ))}
                  </>
                )}

                <h4 className="mod-detail__subheading">Known Issues</h4>
                <KnownIssues issues={mod.knownIssues} />

                <FileManifest files={mod.fileManifest} />

                <p className="mod-detail__description">
                  New to installing custom Build Mode content? See the{" "}
                  <Link to="/guides/installing-mods">installation guide</Link>, or the{" "}
                  <Link to="/guides/troubleshooting">troubleshooting guide</Link> if a piece isn't showing up.
                </p>

                <p className="mod-detail__license-summary">
                  Personal use is always free. Reselling, redistributing, or claiming this mod as
                  your own work is not permitted under any license tier. Full terms are available
                  on the <Link to="/terms-of-service">Terms of Service</Link> page.
                </p>
              </section>
            )}

            {isSectionVisible("changelog") && (
              <section className="mod-detail__section">
                <h3 className="mod-detail__section-heading">Changelog</h3>
                <p className="mod-detail__empty-state">No changelog entries yet.</p>
              </section>
            )}
          </div>
        </div>

        {relatedMods.length > 0 && (
          <div className="mod-detail__related">
            <h2 className="mod-detail__section-heading">You Might Also Like</h2>
            <div className={ardenne ? "ardenne-mod-grid" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"}>
              {relatedMods.map((related) => (
                ardenne ? <ArdenneModCard key={related.slug} mod={related} /> : <ProductCard key={related.slug} product={toLegacyCard(related)} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer brand={pageBrand} />
    </div>
  );
};
