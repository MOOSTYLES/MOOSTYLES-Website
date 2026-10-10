import { Link } from "react-router-dom";
import { NavigationBar } from "@/Components/NavigationBar";
import { Footer } from "@/Components/Footer";
import { Metadata } from "@/Components/Metadata.jsx";
import { WebsiteBackground } from "@/Components/WebsiteBackground";
import { Breadcrumb } from "@/Components/mods/Breadcrumb";

export const Troubleshooting = () => {
  return (
    <div className="min-h-screen">
      <Metadata />

      <WebsiteBackground />
      <NavigationBar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb to="/guides" label="Guides" />

        <h1 className="mod-detail__title newdesign-heading newdesign-brand-label">
          Troubleshooting Broken or Missing Mods
        </h1>
        <p className="legal-page__meta">Work through these before filing a bug report, most issues resolve here.</p>

        <div className="legal-content">
          <p>
            Almost every issue people report falls into one of four buckets: the mod isn't showing up, the
            download itself is failing, something crashes after installing, or two mods are stepping on each
            other. Here's how to work through each one.
          </p>

          <h2>The mod isn't showing up in Build Mode</h2>
          <ul>
            <li><p>Confirm you're searching the exact keyword listed on that mod's page, not a guess based on the product name.</p></li>
            <li><p>Check that the mod shows as enabled in your mod manager or CurseForge app, installs can occasionally land in a disabled state.</p></li>
            <li><p>Restart the game fully rather than just reloading a save, some catalog changes only refresh on a clean launch.</p></li>
          </ul>

          <h2>The download won't finish or fails</h2>
          <ul>
            <li><p>For CurseForge: make sure the app itself is up to date, not just the game. An outdated CurseForge client is a common cause of stalled installs.</p></li>
            <li><p>If a file downloads but won't open or extract, it's likely incomplete, delete it and download again rather than trying to repair a partial file.</p></li>
          </ul>

          <h2>The game crashes or behaves oddly after installing</h2>
          <p>
            First, isolate whether the mod is actually the cause. Disable it and confirm the game runs
            normally without it, if the problem persists either way, it's very likely unrelated to the mod
            itself. If disabling the mod does fix it, a recent game update is the most common explanation,
            check whether the mod has a newer version available before assuming it's a bug. If it's on the
            latest version and still causing problems, that's worth reporting with specifics (see below).
          </p>

          <h2>Two mods are conflicting</h2>
          <p>
            The reliable way to find a conflict is the process of elimination: disable every custom mod,
            confirm the game is stable, then re-enable them one at a time until the problem comes back. The
            last one you enabled before the issue reappears is your culprit, or, if the problem only shows
            up with two specific mods enabled together, you've found a genuine conflict between that pair
            rather than a fault in either one individually.
          </p>

          <h2>Reporting a bug that actually gets fixed</h2>
          <p>
            Vague reports like "it doesn't work" are hard to act on. A report that includes what you tried,
            your current game version, whether other mods were involved, and a screenshot or short clip of
            the actual problem is usually enough to reproduce and fix an issue quickly. Send that through the{" "}
            <Link to="/support">Support page</Link>, the contact form there is built exactly for this.
          </p>
        </div>

        <div className="guide-page__related">
          <h2 className="guide-page__related-title">Related guides</h2>
          <ul className="guide-page__related-links">
            <li><Link to="/guides/installing-mods">How to Install inZOI Mods Safely</Link></li>
            <li><Link to="/guides/mod-safety">Modding Safety &amp; File Verification</Link></li>
            <li><Link to="/support">Support &amp; FAQ</Link></li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};
