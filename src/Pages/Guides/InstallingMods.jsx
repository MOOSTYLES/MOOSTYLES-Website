import { Link } from "react-router-dom";
import { NavigationBar } from "@/Components/NavigationBar";
import { Footer } from "@/Components/Footer";
import { Metadata } from "@/Components/Metadata.jsx";
import { WebsiteBackground } from "@/Components/WebsiteBackground";
import { Breadcrumb } from "@/Components/mods/Breadcrumb";

export const InstallingMods = () => {
  return (
    <div className="min-h-screen">
      <Metadata />

      <WebsiteBackground />
      <NavigationBar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb to="/guides" label="Guides" />

        <h1 className="mod-detail__title newdesign-heading newdesign-brand-label">
          How to Install inZOI Mods Safely
        </h1>
        <p className="legal-page__meta">A practical walkthrough for first-time and returning modders alike.</p>

        <div className="legal-content">
          <p>
            Most install problems people run into come from skipping a step in one of those two stages, not
            from anything wrong with the mod itself. This guide walks through both, plus what to check
            before you even hit download.
          </p>

          <h2>Before you install anything</h2>
          <p>
            A few minutes of prep saves most of the headaches later:
          </p>
          <ul>
            <li>
              <p>
                <strong>Update inZOI first.</strong> Custom Build Mode content is generally tied to how the
                game's build catalog is structured, and that can shift between patches. Installing on an
                outdated game version is the single most common reason a mod "doesn't work."
              </p>
            </li>
            <li>
              <p>
                <strong>Note what you're replacing.</strong> If you're updating a mod you already have
                installed, know which version you're removing so you're not left with duplicate or
                conflicting files afterward.
              </p>
            </li>
          </ul>

          <h2>Option 1: Installing through CurseForge</h2>
          <p>
            Every mod's public download link points to its CurseForge listing. This is the recommended path
            for most players because CurseForge handles placing the file where the game expects it, which
            removes an entire category of manual-install mistakes. Open the mod's CurseForge page from its
            listing here, install it the way you would any other CurseForge project for inZOI, and let the
            app manage updates going forward.
          </p>

          <h2>Option 2: Installing manually.</h2>
          <p>
            Some of my Mods are also available directly on Patreon for anyone who prefers a manual install or
            if the mod is considered explicitly 18+. Manual installs mean you're responsible for putting the
            file in the correct folder yourself, so before you do anything else, read the installation notes
            on that specific Patreon/Mod post. Exact folder locations can change between game updates, and
            the instructions on the download page will always be more current than a general guide like this
            one.
          </p>
          <p>
            A couple of habits make manual installs go smoother: extract the download fully before moving
            anything (don't run files straight out of a zip), and keep the original download around
            somewhere until you've confirmed the mod works, in case you need to reinstall it.
          </p>

          <h2>Finding the mod in-game</h2>
          <p>
            Once a mod is installed, it doesn't appear as a separate menu or plugin, it shows up as an
            item inside inZOI's own Build Mode catalog, mixed in with the base game's furniture and decor.
            Open Build Mode, then search using a keyword from the mod's name rather than "MOOSTYLES." Each
            mod's own page lists the exact search term that works for it. Brand collections like MOCA Cafe
            or PITAPATA are the exception, because they're themed sets rather than single furniture pieces,
            searching the collection name is usually the fastest way to pull up every piece at once.
          </p>

          <h2>If it still doesn't show up</h2>
          <p>
            Double-check that the mod is actually enabled (CurseForge installs can sometimes leave a mod
            toggled off), and that you're searching the term listed on the mod's page rather than guessing.
            If both check out and it's still missing, that's worth a report, see the{" "}
            <Link to="/guides/troubleshooting">troubleshooting guide</Link> for how to file one with enough
            detail to actually get fixed.
          </p>
        </div>

        <div className="guide-page__related">
          <h2 className="guide-page__related-title">Related guides</h2>
          <ul className="guide-page__related-links">
            <li><Link to="/guides/troubleshooting">Troubleshooting Broken or Missing Mods</Link></li>
            <li><Link to="/guides/mod-safety">Modding Safety &amp; File Verification</Link></li>
            <li><Link to="/support">Support &amp; FAQ</Link></li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};
