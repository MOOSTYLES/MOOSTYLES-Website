import { Link } from "react-router-dom";
import { NavigationBar } from "@/Components/NavigationBar";
import { Footer } from "@/Components/Footer";
import { Metadata } from "@/Components/Metadata.jsx";
import { WebsiteBackground } from "@/Components/WebsiteBackground";
import { Breadcrumb } from "@/Components/mods/Breadcrumb";
import { DownloadCloud, Wrench, ShieldCheck } from "lucide-react";

const GUIDES = [
  {
    slug: "installing-mods",
    icon: DownloadCloud,
    title: "How to Install inZOI Mods Safely",
    summary:
      "The two ways to get a MOOSTYLES mod onto your machine, what to check before you download, and how to find a new piece once it's installed.",
  },
  {
    slug: "troubleshooting",
    icon: Wrench,
    title: "Troubleshooting Broken or Missing Mods",
    summary:
      "A mod that won't show up in Build Mode, a download that won't finish, or a crash right after installing, start here before you file a bug report.",
  },
  {
    slug: "mod-safety",
    icon: ShieldCheck,
    title: "Modding Safety & File Verification",
    summary:
      "Where it's actually safe to download mods from, and the redistribution risks worth knowing about.",
  },
];

export const GuidesIndex = () => {
  return (
    <div className="min-h-screen">
      <Metadata listingItems={GUIDES.map((guide) => ({ name: guide.title, url: `/guides/${guide.slug}` }))} />

      <WebsiteBackground />
      <NavigationBar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb to="/" label="Home" />

        <h1 className="mod-detail__title mods-index__title newdesign-heading newdesign-brand-label">
          Modding Guides
        </h1>
        <p className="support-page__intro">
          Everything on this site is free to download, but a mod is only as useful as your ability to install
          it, keep it working, and know it's safe. These guides cover the parts that don't fit on a single
          mod page, written from the questions we actually get asked.
        </p>

        <div className="guides-index__grid">
          {GUIDES.map((guide) => {
            const Icon = guide.icon;
            return (
              <Link key={guide.slug} to={`/guides/${guide.slug}`} className="guides-index__card">
                <Icon size={28} className="guides-index__card-icon" aria-hidden="true" />
                <h2 className="guides-index__card-title">{guide.title}</h2>
                <p className="guides-index__card-summary">{guide.summary}</p>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};
