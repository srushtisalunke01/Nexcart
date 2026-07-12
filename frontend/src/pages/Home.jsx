import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Laptop,
  Watch,
  Sparkles,
  Shirt,
  Home as HomeIcon,
  RefreshCw,
  SlidersHorizontal,
  Grid3X3,
} from "lucide-react";
import { PRODUCTS, CATEGORIES, BRANDS } from "../data/mockData";
import { HeroCarousel } from "../components/HeroCarousel";
import { FlashSale } from "../components/FlashSale";
import { ProductCard } from "../components/ProductCard";
import { SkeletonCard } from "../components/SkeletonCard";

const iconMap = {
  Laptop,
  Watch,
  Sparkles,
  Shirt,
  Home: HomeIcon,
};

export const Home = ({
  onNavigate,
  searchFilter = "",
  categoryFilter = "",
  subcategoryFilter = "",
}) => {
  const [activeSearch, setActiveSearch] = useState(searchFilter);
  const [activeCategory, setActiveCategory] = useState(categoryFilter);
  const [activeSubcategory, setActiveSubcategory] = useState(subcategoryFilter);
  const [activeBrand, setActiveBrand] = useState("");
  // Infinite scroll simulation states
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loadedCount, setLoadedCount] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  // Sync props filters to states
  useEffect(() => {
    setActiveSearch(searchFilter);
    setActiveCategory(categoryFilter);
    setActiveSubcategory(subcategoryFilter);
    setLoadedCount(8);
    setHasMore(true);
  }, [searchFilter, categoryFilter, subcategoryFilter]);

  // Main filtered products list
  const filteredProducts = PRODUCTS.filter((prod) => {
    if (
      activeSearch &&
      !prod.name.toLowerCase().includes(activeSearch.toLowerCase()) &&
      !prod.category.toLowerCase().includes(activeSearch.toLowerCase()) &&
      !prod.brand.toLowerCase().includes(activeSearch.toLowerCase())
    ) {
      return false;
    }
    if (activeCategory && prod.parentCategory !== activeCategory) {
      return false;
    }
    if (activeSubcategory && prod.category !== activeSubcategory) {
      return false;
    }
    if (activeBrand && prod.brand.toLowerCase() !== activeBrand.toLowerCase()) {
      return false;
    }
    return true;
  });

  // Handle visible products for infinite scroll
  useEffect(() => {
    setVisibleProducts(filteredProducts.slice(0, loadedCount));
    setHasMore(loadedCount < filteredProducts.length);
  }, [filteredProducts, loadedCount]);

  // Setup dynamic loading simulation (infinite scroll)
  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoadingMore(true);
          // Simulating lazy load request response
          setTimeout(() => {
            setLoadedCount((prev) => prev + 4);
            setIsLoadingMore(false);
          }, 1200);
        }
      },
      { threshold: 0.1 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, isLoadingMore, visibleProducts]);

  const clearAllFilters = () => {
    setActiveSearch("");
    setActiveCategory("");
    setActiveSubcategory("");
    setActiveBrand("");
    setLoadedCount(8);
  };

  const trendingProducts = PRODUCTS.filter((p) => p.trending).slice(0, 4);
  const bestSellers = PRODUCTS.filter((p) => p.bestSeller).slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-12 pb-20"
    >
      {/* Search / Category Filter Header Indicator */}
      {(activeSearch || activeCategory || activeSubcategory || activeBrand) && (
        <div className="bg-brand-50/50 dark:bg-brand-500/5 border border-brand-100 dark:border-brand-500/10 rounded-premium p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <SlidersHorizontal className="h-4 w-4 text-brand-500" />
            <span className="font-bold">Active Filters:</span>
            {activeSearch && (
              <span className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-full text-xs font-semibold shadow-sm border border-slate-100 dark:border-slate-800">
                Search: "{activeSearch}"
              </span>
            )}
            {activeCategory && (
              <span className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-full text-xs font-semibold shadow-sm border border-slate-100 dark:border-slate-800">
                Department: {activeCategory}
              </span>
            )}
            {activeSubcategory && (
              <span className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-full text-xs font-semibold shadow-sm border border-slate-100 dark:border-slate-800">
                Category: {activeSubcategory}
              </span>
            )}
            {activeBrand && (
              <span className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-full text-xs font-semibold shadow-sm border border-slate-100 dark:border-slate-800">
                Brand: {activeBrand}
              </span>
            )}
            <span className="font-semibold ml-2">
              ({filteredProducts.length} items found)
            </span>
          </div>
          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1 bg-white dark:bg-slate-800 px-3.5 py-2 rounded-xl shadow-sm border border-brand-100"
          >
            <RefreshCw className="h-3 w-3" /> Clear All Filters
          </button>
        </div>
      )}

      {!activeSearch &&
        !activeCategory &&
        !activeSubcategory &&
        !activeBrand && (
          <div className="space-y-12">
            {/* Hero Banner Carousel */}
            <HeroCarousel onNavigate={onNavigate} />

            {/* Department Grid */}
            <section className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                <Grid3X3 className="h-5 w-5 text-brand-500" /> Shop by Category
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {CATEGORIES.map((cat) => {
                  const Icon = iconMap[cat.icon] || Sparkles;
                  return (
                    <motion.div
                      key={cat.id}
                      whileHover={{ scale: 1.03, y: -4 }}
                      onClick={() => setActiveCategory(cat.id)}
                      className="cursor-pointer overflow-hidden rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 p-5 shadow-soft text-center hover:shadow-md transition-all flex flex-col items-center justify-center min-h-[140px] relative group"
                    >
                      <div className="p-3 bg-brand-50 dark:bg-brand-500/5 rounded-2xl mb-3 text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="font-display font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                        {cat.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Countdown Flash Sale */}
            <FlashSale products={PRODUCTS} onNavigate={onNavigate} />

            {/* Brand Showcase */}
            <section className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-800 dark:text-white">
                Official Brand Showcases
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {BRANDS.map((br) => (
                  <motion.div
                    key={br.name}
                    whileHover={{ scale: 1.05, y: -2 }}
                    onClick={() => setActiveBrand(br.name)}
                    className="cursor-pointer h-20 rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 p-4 shadow-soft flex items-center justify-center hover:shadow-md transition-all overflow-hidden"
                  >
                    <img
                      src={br.logo}
                      alt={br.name}
                      className="max-h-full max-w-full object-contain filter grayscale dark:invert group-hover:grayscale-0 transition-all opacity-75 hover:opacity-100"
                    />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Curated Sections (Best Sellers & Trending) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Best Sellers */}
              <section className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-800 dark:text-white">
                    Best Sellers
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bestSellers.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              </section>

              {/* Trending */}
              <section className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-800 dark:text-white">
                    Trending Now
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {trendingProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

      {/* Infinite Product Catalog Grid */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-800 dark:text-white">
            {!activeSearch &&
            !activeCategory &&
            !activeSubcategory &&
            !activeBrand
              ? "Recommended for You"
              : "Matching Catalog Results"}
          </h2>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {filteredProducts.length} items
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 rounded-premium shadow-soft">
            <p className="text-slate-400 text-base font-semibold mb-2">
              No matching products found.
            </p>
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-brand-500 hover:text-brand-600 underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigate={onNavigate}
                />
              ))}
            </div>

            {/* Shimmer Skeltons loader / Bottom detection node */}
            {hasMore && (
              <div ref={loaderRef} className="pt-8">
                {isLoadingMore && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </motion.div>
  );
};
