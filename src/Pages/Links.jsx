import React, { useEffect, useState } from 'react';
import { NavigationBar } from '@/Components/NavigationBar';
import { Metadata } from '@/Components/Metadata.jsx';
import {
  ExternalLink,
  Instagram,
  MessageCircle,
  Gamepad2,
  Heart
} from 'lucide-react';
import { WebsiteBackground } from '@/Components/WebsiteBackground';
import { motion } from 'framer-motion';

export const Links = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const links = [
    {
      icon: <Heart size={24} />,
      title: "Patreon",
      description: "Support us on Patreon for exclusive perks",
      url: "https://www.patreon.com/c/MOOSTYLES",
      hoverColor: "#fd74d4"
    },
    {
      icon: <Instagram size={24} />,
      title: "Instagram",
      description: "Follow us on Instagram",
      url: "https://www.instagram.com/moostyles_inzoi/",
      hoverColor: "#ec4899"
    },
    {
      icon: <Gamepad2 size={24} />,
      title: "CurseForge",
      description: "Download mods on CurseForge",
      url: "https://www.curseforge.com/members/moocalf",
      hoverColor: "#ff8800"
    },
    {
      icon: <MessageCircle size={24} />,
      title: "Pinterest",
      description: "Follow us on Pinterest",
      url: "https://pin.it/Zz1UgHeLi",
      hoverColor: "#ef4444"
    }
  ];

  return (
    <>
      <Metadata />

      <div className="min-h-screen">
        <WebsiteBackground />
        <NavigationBar />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="/projects/Website Branding/MOOSTYLES LOGO - TEAL COLOR.png"
                alt="MOOSTYLES Logo"
                className="w-24 h-24 mx-auto mb-6 rounded-2xl"
              />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Links</h1>
              <p className="text-xl text-gray-600">
                Connect with us on social media and support platforms
              </p>
            </motion.div>
          </div>

          <div className="space-y-4">
            {links.map((link, index) => (
              <motion.a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 8 }}
                whileTap={{ scale: 0.98 }}
                className="links-button"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="links-button-icon">
                  {React.cloneElement(link.icon, {
                    color: hoveredIndex === index ? link.hoverColor : '#6b7280',
                    size: 24
                  })}
                </div>
                <div className="links-button-content">
                  <span className="links-button-title">{link.title}</span>
                  <span className="links-button-description">{link.description}</span>
                </div>
                <ExternalLink
                  size={20}
                  className="links-button-arrow"
                  color={hoveredIndex === index ? link.hoverColor : '#9ca3af'}
                />
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12 pt-8 border-t border-gray-200"
          >
            <p className="text-gray-500 text-sm">
              © 2024-2026 MOOSTYLES. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Links;
