import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SkeletonImage } from "./ui/SkeletonImage";
import { getImageAlt } from "@/lib/imageMeta";

const InZOIMods = ({ item, href, onClick }) => {
  const imageSrc = item?.image || item?.images?.[0] || item?.src || '/projects/Brand Medias/Recommend Category/placeholder.png';

  const CardInner = (
    <motion.div
      className="media-card group cursor-pointer select-none"
      aria-label={item?.title || 'InZOI mod'}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="media-card__image">
        <SkeletonImage
          src={imageSrc}
          alt={getImageAlt(imageSrc, item?.name || item?.title || 'inZOI mod')}
          imgClassName="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <span className="media-card__title">{item?.name || item?.title}</span>
    </motion.div>
  );

  if (href) {
    return (
      <Link to={href} className="block" aria-label={item?.title}>
        {CardInner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className="block w-full text-left" aria-label={item?.title}>
      {CardInner}
    </button>
  );
};

export default InZOIMods;
