import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { ARDENNE_LOGOS } from "@/content/ardenne";

export const Footer = ({ brand = "MOOSTYLES" }) => {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const footerSections = [
    {
      title: "Socials",
      links: [
        { name: "Patreon", href: "https://www.patreon.com/c/MOOSTYLES" },
        { name: "Instagram", href: "https://www.instagram.com/moostyles_inzoi/" },
        { name: "CurseForge", href: "https://www.curseforge.com/members/moocalf" },
        { name: "Pinterest", href: "https://pin.it/Zz1UgHeLi" },
        { name: "Discord", href: "https://discord.gg/Dpr5cs7TQc" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Support Center", href: "/support" },
        { name: "Modding Guides", href: "/guides" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Service", href: "/terms-of-service" }
      ]
    },
    {
      title: "About",
      links: [
        { name: "About Me", href: "/about" },
        { name: "More Links", href: "/links" },
        { name: "Moocalf.com", href: "https://moocalf.com" }
      ]
    }
  ];

  return (
    <footer className="footer-main mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
          {footerSections.map((section, index) => (
            <div key={index} className="footer-section">
              <h3 className="footer-section-title text-sm">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="footer-link text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4 sm:mb-6">
            <img
              src={brand === "ARDENNE" ? ARDENNE_LOGOS.white : "/projects/Website Branding/MOOSTYLES LOGO - BLACK COLOR.png"}
              alt={`${brand} Logo`}
              className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 mx-auto object-contain"
            />
          </div>
          <h2 className={`text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black tracking-tight${brand === "ARDENNE" ? " ardenne-footer__wordmark" : ""}`}>
            {brand}
          </h2>
          {brand === "ARDENNE" && <p className="ardenne-footer__parent">A collection by MOOSTYLES</p>}
        </div>
      </div>

      <div className="py-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-500">
              Copyright © 2025 MOOSTYLES.COM. All rights reserved.
            </div>

            <div className="flex items-center">
              <motion.button
                onClick={scrollToTop}
                className="footer-icon p-2 bg-gray-100 rounded-full shadow-sm hover:shadow-md hover:bg-gray-200"
                aria-label="Scroll to top"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <ArrowUp size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
