import { Link, useLocation } from "react-router-dom";
import { Instagram, Gamepad2, MessageCircle, Hash, ArrowRight } from "lucide-react";
import { SafeModeToggle } from "./SafeModeToggle";
import { NavIconButton } from "./NavIconButton";
import { PATREON_MEMBERSHIP_URL } from "@/lib/config";
import { getSiteIdentity } from "@/lib/siteIdentity";
import { ARDENNE_LOGOS } from "@/content/ardenne";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "My Mod List", to: "/mods" },
  { label: "ARDENNE", to: "/ardenne" },
  { label: "Guides", to: "/guides" },
  { label: "Saved Items", to: "/saved-products" },
  { label: "Support", to: "/support" },
  { label: "More Links", to: "/links" },
];

const PATREON_MEMBERSHIP_LINK = {
  label: "Patreon Membership",
  to: `/redirector?to=${encodeURIComponent(PATREON_MEMBERSHIP_URL)}`,
};

const SOCIAL_LINKS = [
  { label: "Instagram", icon: Instagram, url: "https://www.instagram.com/moostyles_inzoi/" },
  { label: "CurseForge", icon: Gamepad2, url: "https://www.curseforge.com/members/moocalf" },
  { label: "Pinterest", icon: MessageCircle, url: "https://pin.it/Zz1UgHeLi" },
  { label: "Discord", icon: Hash, url: "https://discord.gg/Dpr5cs7TQc" },
];

const isLinkActive = (to, pathname) => {
  if (to === "/") return pathname === "/" || pathname === "/home";
  return pathname === to || pathname.startsWith(`${to}/`);
};

export const NavMenuPanel = ({ onNavigate }) => {
  const { pathname } = useLocation();
  const inArdenne = getSiteIdentity(pathname) === "ardenne";

  return (
    <div className="nav-menu">
      <Link to={inArdenne ? "/ardenne" : "/"} className="nav-menu__brand" onClick={onNavigate}>
        <img
          src={inArdenne ? ARDENNE_LOGOS.black : "/projects/Website Branding/MOOSTYLES LOGO - TEAL COLOR.png"}
          alt=""
          className="nav-menu__brand-logo"
        />
        <span className="nav-menu__brand-label">{inArdenne ? "ARDENNE" : "MOOSTYLES"}</span>
      </Link>

      <nav className="nav-menu__links" aria-label="Primary">
        <Link
          to={NAV_LINKS[0].to}
          className={`nav-menu__link${isLinkActive(NAV_LINKS[0].to, pathname) ? " nav-menu__link--active" : ""}`}
          onClick={onNavigate}
        >
          {NAV_LINKS[0].label}
        </Link>
        <Link
          to={PATREON_MEMBERSHIP_LINK.to}
          className="nav-menu__link nav-menu__link--cta"
          onClick={onNavigate}
        >
          {PATREON_MEMBERSHIP_LINK.label}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
        {NAV_LINKS.slice(1).map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className={`nav-menu__link${isLinkActive(link.to, pathname) ? " nav-menu__link--active" : ""}`}
            onClick={onNavigate}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <SafeModeToggle />

      <div className="nav-menu__socials">
        {SOCIAL_LINKS.map((social) => (
          <NavIconButton
            key={social.label}
            icon={social.icon}
            label={social.label}
            to={`/redirector?to=${encodeURIComponent(social.url)}`}
          />
        ))}
      </div>
    </div>
  );
};
