import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigationType } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import { motion } from "framer-motion";
import SearchQuery from "@/Components/SearchQuery";
import { getGlobalSearchData } from "@/lib/globalSearchData";
import { NavIconButton } from "@/Components/Navbar/NavIconButton";
import { SafeModeToggle } from "@/Components/Navbar/SafeModeToggle";
import { getSiteIdentity } from "@/lib/siteIdentity";
import { PATREON_MEMBERSHIP_URL } from "@/lib/config";
import { ARDENNE_LOGOS } from "@/content/ardenne";

const MotionLink = motion.create(Link);
const TAP_TRANSITION = { type: "spring", stiffness: 400, damping: 17 };

const outbound = (url) => `/redirector?to=${encodeURIComponent(url)}`;

const SECTIONS = [
  { title: "Home", to: "/" },
  {
    title: "Mods",
    items: [
      { label: "InZOI", to: "/mods" },
      { label: "ARDENNE", to: "/ardenne" },
    ],
  },
  {
    title: "Socials",
    items: [
      { label: "Patreon", to: outbound(PATREON_MEMBERSHIP_URL) },
      { label: "Instagram", to: outbound("https://www.instagram.com/moostyles_inzoi/") },
      { label: "CurseForge", to: outbound("https://www.curseforge.com/members/moocalf") },
      { label: "Pinterest", to: outbound("https://pin.it/Zz1UgHeLi") },
      { label: "Discord", to: outbound("https://discord.gg/Dpr5cs7TQc") },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Support Center", to: "/support" },
      { label: "Modding Guides", to: "/guides" },
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Terms of Service", to: "/terms-of-service" },
    ],
  },
  {
    title: "About",
    items: [
      { label: "About Me", to: "/about" },
      { label: "Blog", to: "/blog" },
      { label: "More Links", to: "/links" },
      { label: "Moocalf.com", href: "https://moocalf.com" },
    ],
  },
];

const isLinkActive = (to, pathname) => {
  if (!to || to.startsWith("/redirector")) return false;
  if (to === "/") return pathname === "/" || pathname === "/home";
  return pathname === to || pathname.startsWith(`${to}/`);
};

// Label with a sliding underline; shown in full while its section is open.
const NavLabel = ({ text, active }) => (
  <span className="site-nav__label">
    {text}
    <span aria-hidden="true" className={`site-nav__underline${active ? " site-nav__underline--active" : ""}`} />
  </span>
);

export const NavigationBar = () => {
  const [open, setOpen] = useState(null); // which section's links are expanded
  const [shown, setShown] = useState(null); // keeps the links mounted while the span collapses
  const barRef = useRef(null);
  const { pathname, state, key } = useLocation();
  const navigationType = useNavigationType();
  const inArdenne = getSiteIdentity(pathname) === "ardenne";
  const brandLabel = inArdenne ? "ARDENNE" : "MOOSTYLES";
  const previousBrandLabel = inArdenne ? "MOOSTYLES" : "ARDENNE";
  // Link state carries the old word across page mounts; POP skips reloads and history visits.
  const morphFrom = navigationType === "PUSH" && state?.catalogWordmarkFrom === brandLabel
    ? previousBrandLabel
    : null;

  useEffect(() => {
    if (open) setShown(open);
  }, [open]);

  useEffect(() => {
    setOpen(null);
  }, [pathname]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = (event) => {
      if (barRef.current && !barRef.current.contains(event.target)) setOpen(null);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(null);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSearchSelect = (result) => {
    window.location.href = result?.url || "/";
  };

  const activeSection = SECTIONS.find((section) => section.title === shown && section.items);

  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <div className="site-nav__top">
          <MotionLink
            to={inArdenne ? "/ardenne" : "/"}
            className="site-nav__brand"
            aria-label={`${brandLabel} home`}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={TAP_TRANSITION}
          >
            <img
              src={inArdenne ? ARDENNE_LOGOS.black : "/projects/Website Branding/MOOSTYLES LOGO - BLACK COLOR.webp"}
              alt=""
              className="site-nav__brand-logo"
            />
            {morphFrom ? (
              <span key={key} className="site-nav__brand-label site-nav__wordmark" aria-hidden="true">
                <span className="site-nav__wordmark-from">{morphFrom}</span>
                <span className="site-nav__wordmark-to">{brandLabel}</span>
              </span>
            ) : (
              <span className="site-nav__brand-label" aria-hidden="true">{brandLabel}</span>
            )}
          </MotionLink>

          <div className="site-nav__actions">
            <SafeModeToggle />
            <NavIconButton icon={Heart} label="Saved items" to="/saved-products" size={22} />
            <SearchQuery
              iconOnly
              className="site-nav__search"
              placeholder="Search mods, collections, pages..."
              searchData={getGlobalSearchData()}
              onSearchSelect={handleSearchSelect}
              resultLimit={20}
            />
          </div>
        </div>

        {/* The bar: two hairlines, with a span below that expands to reveal a section's links */}
        <div ref={barRef} className="site-nav__bar">
          <nav aria-label="Primary" className="site-nav__sections">
            {SECTIONS.map((section) => {
              const current = section.items
                ? section.items.some((item) => isLinkActive(item.to, pathname))
                : isLinkActive(section.to, pathname);
              const className = `site-nav__section${open === section.title || current ? " site-nav__section--active" : ""}`;
              return section.items ? (
                <button
                  key={section.title}
                  type="button"
                  className={className}
                  aria-expanded={open === section.title}
                  aria-controls="site-nav-links"
                  onClick={() => setOpen(open === section.title ? null : section.title)}
                >
                  <NavLabel text={section.title} active={open === section.title} />
                </button>
              ) : (
                <Link
                  key={section.title}
                  to={section.to}
                  className={className}
                  aria-current={current ? "page" : undefined}
                >
                  <NavLabel text={section.title} active={false} />
                </Link>
              );
            })}
          </nav>

          <div
            id="site-nav-links"
            className={`site-nav__drawer${open ? " site-nav__drawer--open" : ""}`}
            inert={!open}
          >
            <div className="site-nav__drawer-inner">
              {activeSection && (
                <ul className="site-nav__links">
                  {activeSection.items.map((item) => {
                    const current = isLinkActive(item.to, pathname);
                    const content = (
                      <>
                        {item.label}
                        <ArrowRight size={14} aria-hidden="true" className="site-nav__link-arrow" />
                      </>
                    );
                    return (
                      <li key={item.label}>
                        {item.href ? (
                          <a href={item.href} className="site-nav__link" target="_blank" rel="noopener noreferrer">
                            {content}
                          </a>
                        ) : (
                          <Link
                            to={item.to}
                            className={`site-nav__link${current ? " site-nav__link--active" : ""}`}
                            aria-current={current ? "page" : undefined}
                            onClick={() => setOpen(null)}
                          >
                            {content}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
