import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PATREON_MEMBERSHIP_URL } from "@/lib/config";

const MotionLink = motion.create(Link);

const SUPPORT_TIERS = [
  {
    key: "maison",
    name: "Maison",
    description: "Support MOOSTYLE by contributing a small tip!",
    price: "1USD",
    theme: "light",
    logo: "/projects/Website Branding/MOOSTYLES LOGO - BLACK COLOR.webp",
  },
  {
    key: "chateau",
    name: "Château",
    description:
      "Support MOOSTYLE by contributing a small tip! Gain Access to behind the scene updates and access to Quicklink downloads and more!",
    price: "2USD",
    theme: "dark",
    logo: "/projects/Website Branding/MOOSTYLES LOGO - WHITE COLOR.webp",
  },
];

export const Overview = () => (
  <section className="support-my-work">
    <h1 className="support-my-work__heading">
      <img
        src="/projects/Website Branding/MOOSTYLES LOGO - BLACK COLOR.webp"
        alt=""
        className="support-my-work__heading-logo"
      />
      Overview
    </h1>
    <p className="support-my-work__intro">
      MOOSTYLES is a creative home for inZOI. We create furniture, decor and
      original brands that bring character to the spaces you build and the stories
      you tell. From everyday pieces to statement collections, our work starts
      with a simple idea: thoughtful design makes a world feel like your own.
    </p>
    <p className="support-my-work__intro">
      We care about form, atmosphere and the small details that make a space feel
      complete. Together with our partnered brands, we explore different styles
      and ways of living, giving you more freedom to shape your inZOI world.
      Discover our collections and choose the
      pieces that speak to the way you create.
    </p>
  </section>
);

export const SupportMyWork = () => (
  <section className="support-my-work">
    <h1 className="support-my-work__heading">
      <img
        src="/projects/Website Branding/patreon-icon-black.svg"
        alt=""
        className="support-my-work__heading-logo"
      />
      Support My Work
    </h1>
    <p className="support-my-work__body">
      All contents are made with sincerity and as much detail as possible. These contents usually
      take some time and your support would be greatly appreciated!{" "}
      <strong>Consider joining the Membership and Support my work.</strong>
    </p>

    <div className="support-my-work__cards">
      {SUPPORT_TIERS.map((tier) => (
        <MotionLink
          key={tier.key}
          to={`/redirector?to=${encodeURIComponent(PATREON_MEMBERSHIP_URL)}`}
          className={`support-card support-card--${tier.theme}`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <h3 className="support-card__name">{tier.name}</h3>
          <p className="support-card__description">{tier.description}</p>
          <div className="support-card__footer">
            <img src={tier.logo} alt="" className="support-card__logo" />
            <div className="support-card__footer-text">
              <p className="support-card__price">{tier.price}</p>
              <span className="support-card__cta">
                Join Now
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </div>
          </div>
        </MotionLink>
      ))}
    </div>
  </section>
);
