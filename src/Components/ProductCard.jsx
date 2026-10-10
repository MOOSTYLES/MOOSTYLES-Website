import { useState, useEffect } from "react";
import { Heart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { SkeletonImage } from "./ui/SkeletonImage";
import { getImageAlt } from "@/lib/imageMeta";
import { motion } from "framer-motion";
import { saveProduct, unsaveProduct, isProductSaved } from "@/lib/savedProducts";

const FALLBACK_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1vZDwvdGV4dD48L3N2Zz4=";

export const ProductCard = ({ product, onToggleFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsFavorite(isProductSaved(product.id));
  }, [product.id]);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSaving) return;

    setIsSaving(true);

    try {
      if (isFavorite) {
        const success = unsaveProduct(product.id);
        if (success) {
          setIsFavorite(false);
          showToast('Product removed from saved items', 'success');
        }
      } else {
        const success = saveProduct(product);
        if (success) {
          setIsFavorite(true);
          showToast('Product saved!', 'success');
        }
      }

      onToggleFavorite?.(product.id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showToast('Error saving product', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

    toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`;
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const detailHref = product.slug ? `/mods/${product.slug}` : `/product/${product.id}`;

  return (
    <Link to={detailHref} className="block">
      <motion.div
        className="product-card bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer relative border-2 border-transparent hover:border-teal-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          y: -4,
          transition: { type: "spring", stiffness: 400, damping: 17 }
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="relative aspect-square overflow-hidden">
          <SkeletonImage
            src={product.image}
            fallbackSrc={FALLBACK_IMAGE}
            alt={getImageAlt(product.image, product.name)}
            imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-medium">
                NEW
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-purple-500 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-medium">
                FEATURED
              </span>
            )}
          </div>

          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleFavoriteToggle}
              disabled={isSaving}
              className={`p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:shadow-lg hover:bg-[#f2f2f2] hover:-translate-y-px transition-all ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Heart
                size={12}
                className={`sm:w-4 sm:h-4 transition-colors ${
                  isFavorite ? "text-red-500 fill-current" : "text-gray-400 hover:text-red-500"
                } ${isSaving ? 'animate-pulse' : ''}`}
              />
            </button>
          </div>

          <div className="product-card__caption absolute bottom-0 left-0 right-0 p-2 sm:p-4">
            <div className="flex items-center gap-1 mb-1 sm:mb-2">
              <User size={10} className="text-gray-600 sm:w-3 sm:h-3" />
              <p className="text-xs text-gray-600 truncate">{product.author || product.brand}</p>
            </div>

            <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
