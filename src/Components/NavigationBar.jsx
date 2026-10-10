import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigationType } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchQuery from "@/Components/SearchQuery";
import { getGlobalSearchData } from "@/lib/globalSearchData";
import { NavMenuPanel } from "@/Components/Navbar/NavMenuPanel";
import { getSiteIdentity } from "@/lib/siteIdentity";
import { ARDENNE_LOGOS } from "@/content/ardenne";

const MotionLink = motion.create(Link);
const TAP_TRANSITION = { type: "spring", stiffness: 400, damping: 17 };

export const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname, state, key } = useLocation();
  const navigationType = useNavigationType();
  const inArdenne = getSiteIdentity(pathname) === "ardenne";
  const catalogLabel = inArdenne ? "MOOSTYLES" : "ARDENNE";
  const previousCatalogLabel = inArdenne ? "ARDENNE" : "MOOSTYLES";
  // Link state carries the old word across page mounts; POP skips reloads and history visits.
  const morphFrom = navigationType === "PUSH" && state?.catalogWordmarkFrom === previousCatalogLabel
    ? previousCatalogLabel
    : null;

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSearchSelect = (result) => {
    window.location.href = result?.url || "/";
  };

  return (
    <nav className="site-nav">
      <div className="site-nav__bar">
        <MotionLink
          to={inArdenne ? "/ardenne" : "/"}
          className="nav-icon-button site-nav__home"
          aria-label={inArdenne ? "ARDENNE home" : "MOOSTYLES home"}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.95 }}
          transition={TAP_TRANSITION}
        >
          <img
            src={inArdenne ? ARDENNE_LOGOS.black : "/projects/Website Branding/MOOSTYLES LOGO - BLACK COLOR.png"}
            alt=""
            className="site-nav__home-logo"
          />
        </MotionLink>

        <div className="site-nav__actions">
          <div className="site-nav__catalogs" aria-label="Mod catalogs">
            <NavLink to="/mods" className={({ isActive }) => `site-nav__catalog-link${isActive && !inArdenne ? " site-nav__catalog-link--active" : ""}`}>
              My Mod List
            </NavLink>
            <Link
              to={inArdenne ? "/" : "/ardenne"}
              state={{ catalogWordmarkFrom: catalogLabel }}
              className="site-nav__catalog-link"
            >
              {morphFrom ? (
                <>
                  <span className="sr-only">{catalogLabel}</span>
                  <span key={key} className="site-nav__wordmark" aria-hidden="true">
                    <span className="site-nav__wordmark-from">{morphFrom}</span>
                    <span className="site-nav__wordmark-to">{catalogLabel}</span>
                  </span>
                </>
              ) : catalogLabel}
            </Link>
          </div>
          <SearchQuery
            iconOnly
            className="site-nav__search"
            placeholder="Search mods, collections, pages..."
            searchData={getGlobalSearchData()}
            onSearchSelect={handleSearchSelect}
            resultLimit={20}
          />

          <motion.button
            type="button"
            className="nav-icon-button site-nav__menu-toggle"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={TAP_TRANSITION}
          >
            {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && [
          <motion.button
            key="backdrop"
            type="button"
            className="site-nav__backdrop"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />,
          <motion.div
            key="panel"
            className="site-nav__panel"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <NavMenuPanel onNavigate={() => setIsOpen(false)} />
          </motion.div>,
        ]}
      </AnimatePresence>
    </nav>
  );
};
