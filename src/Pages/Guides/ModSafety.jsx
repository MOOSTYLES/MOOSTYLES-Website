import { Link } from "react-router-dom";
import { NavigationBar } from "@/Components/NavigationBar";
import { Footer } from "@/Components/Footer";
import { Metadata } from "@/Components/Metadata.jsx";
import { WebsiteBackground } from "@/Components/WebsiteBackground";
import { Breadcrumb } from "@/Components/mods/Breadcrumb";

export const ModSafety = () => {
  return (
    <div className="min-h-screen">
      <Metadata />

      <WebsiteBackground />
      <NavigationBar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb to="/guides" label="Guides" />

        <h1 className="mod-detail__title newdesign-heading newdesign-brand-label">
          Modding Safety &amp; File Verification
        </h1>
        <p className="legal-page__meta">Good habits for downloading mods from any creator, not just this one.</p>

        <div className="legal-content">
          <p>
            Modding communities run on trust, you're taking a file from someone you've likely never met and
            running it alongside your game. That trust is generally well placed, but it's worth knowing what
            "safe" actually means in practice and how to keep it that way, whether you're downloading from
            here or anywhere else.
          </p>

          <h2>Only download from official channels</h2>
          <p>
            Every MOOSTYLES mod is distributed from exactly two places: its CurseForge listing and its
            Patreon post, both linked directly from that mod's page on this site. If you find a copy of a
            MOOSTYLES mod hosted anywhere else, a random file-sharing site, a repackaged "all mods" zip, a
            third-party Discord upload, treat it as untrustworthy by default. Reuploaders don't get to
            vouch for what they've bundled in with the original file, and a stranger's zip isn't a substitute
            for the source.
          </p>

          <h2>General red flags, for any creator's mods</h2>
          <p>
            These apply well beyond this site: be wary of mods that require disabling your antivirus to
            install, executables bundled in with what should be a simple content file, download links that
            redirect through several unrelated sites before serving the file, and creators who discourage
            questions about what a mod actually does. None of that is how legitimate Build Mode content
            behaves.
          </p>

          <h2>Redistribution and reuploads</h2>
          <p>
            Reuploading or repackaging someone else's mod without permission is generally wrong. MOOSTYLES
            mods are free to use, but not free to redistribute or claim as your own work. Full terms live on
            the <Link to="/terms-of-service">Terms of Service</Link> page. If you want to translate, feature,
            or build on a mod, reaching out first (see <Link to="/support">Support</Link>) is quick and keeps
            things straightforward for everyone. Thank You!
          </p>
        </div>

        <div className="guide-page__related">
          <h2 className="guide-page__related-title">Related guides</h2>
          <ul className="guide-page__related-links">
            <li><Link to="/guides/installing-mods">How to Install inZOI Mods Safely</Link></li>
            <li><Link to="/guides/troubleshooting">Troubleshooting Broken or Missing Mods</Link></li>
            <li><Link to="/terms-of-service">Terms of Service</Link></li>
            <li><Link to="/support">Support &amp; FAQ</Link></li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};
