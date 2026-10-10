import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavigationBar } from "@/Components/NavigationBar";
import { Footer } from "@/Components/Footer";
import { WebsiteBackground } from "@/Components/WebsiteBackground";
import { Metadata } from "@/Components/Metadata.jsx";
import { ProductCard } from "@/Components/ProductCard";
import { getSavedProducts, clearAllSavedProducts } from "@/lib/savedProducts";

const TAP_TRANSITION = { type: "spring", stiffness: 400, damping: 17 };

export const SavedProducts = () => {
  const [savedProducts, setSavedProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setSavedProducts(getSavedProducts());
  }, []);

  const handleUnsave = (productId) => {
    setSavedProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  const handleClearAll = () => {
    clearAllSavedProducts();
    setSavedProducts([]);
    setShowClearConfirm(false);
  };

  const filtered = useMemo(() => {
    let list = savedProducts.filter((product) => {
      const matchesQuery = !query || product.name.toLowerCase().includes(query.toLowerCase());
      if (!matchesQuery) return false;
      if (filterValue === "type:individual") return product.brand === "Individual";
      if (filterValue === "type:collections") return product.brand === "Collections";
      return true;
    });

    if (filterValue === "sort:latest") {
      list = [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));
    } else if (filterValue === "sort:oldest") {
      list = [...list].sort((a, b) => Number(a.isNew) - Number(b.isNew));
    }

    return list;
  }, [savedProducts, query, filterValue]);

  return (
    <div className="min-h-screen">
      <Metadata />

      <WebsiteBackground />
      <NavigationBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mods-index__header">
          <h1 className="mod-detail__title mods-index__title newdesign-heading newdesign-brand-label">
            Saved Items
          </h1>
          {savedProducts.length > 0 && (
            <motion.button
              type="button"
              className="saved-products__clear"
              onClick={() => setShowClearConfirm(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={TAP_TRANSITION}
            >
              <Trash2 size={16} aria-hidden="true" />
              Clear All
            </motion.button>
          )}
        </div>

        <div className="mods-index__filters">
          <input
            type="search"
            className="mods-index__search"
            placeholder="Search saved items"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search saved items"
          />
          <select
            className="mods-index__filter-select"
            value={filterValue}
            onChange={(event) => setFilterValue(event.target.value)}
            aria-label="Filter saved items"
          >
            <option value="">All Saved</option>
            <optgroup label="Type">
              <option value="type:individual">Individual</option>
              <option value="type:collections">Collections</option>
            </optgroup>
            <optgroup label="Sort">
              <option value="sort:latest">Latest</option>
              <option value="sort:oldest">Oldest</option>
            </optgroup>
          </select>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onToggleFavorite={handleUnsave} />
            ))}
          </div>
        ) : (
          <p className="mod-detail__empty-state mt-8">
            {savedProducts.length === 0
              ? "You haven't saved any mods yet, tap the heart on a mod card to save it here."
              : "No saved items match your search."}
          </p>
        )}
      </main>

      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            className="saved-products__modal-overlay"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <motion.div
              className="saved-products__modal"
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <h2 className="mod-detail__section-heading">Clear all saved items?</h2>
              <p className="mod-detail__empty-state">
                This removes every saved mod from this device. This can't be undone.
              </p>
              <div className="saved-products__modal-actions">
                <motion.button
                  type="button"
                  className="saved-products__modal-cancel"
                  onClick={() => setShowClearConfirm(false)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={TAP_TRANSITION}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="button"
                  className="saved-products__modal-confirm"
                  onClick={handleClearAll}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={TAP_TRANSITION}
                >
                  Clear All
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};
