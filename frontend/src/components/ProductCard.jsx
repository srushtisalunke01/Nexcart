import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  ShoppingCart,
  Eye,
  Flame,
  ShieldAlert,
  MessageSquare,
  Scale,
  Share2,
  MapPin,
  Check,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useMarketplace } from "../context/MarketplaceContext";
import { QuickViewModal } from "./QuickViewModal";

export const ProductCard = ({ product, onNavigate }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    compareList,
    addNotification,
  } = useCart();
  const { startChatSession } = useMarketplace();
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [shared, setShared] = useState(false);

  const favorited = isInWishlist(product.id);
  const isCompared = compareList.some((p) => p.id === product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1, selectedColor, product.sizes?.[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(product, 1, selectedColor, product.sizes?.[0]);
    onNavigate("cart");
  };

  const handleContactSeller = (e) => {
    e.stopPropagation();
    startChatSession(product);
    addNotification(
      "Chat Initialized",
      `Chat session started with ${product.sellerName}`,
    );
    // Will be managed by App layout
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    addToCompare(product);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(
      `${window.location.origin}/#product-details?id=${product.id}`,
    );
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <>
      <motion.div
        onHoverStart={() => {
          if (product.images[1]) setActiveImage(product.images[1]);
        }}
        onHoverEnd={() => {
          setActiveImage(product.images[0]);
        }}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={() => onNavigate("product-details", { id: product.id })}
        className="group relative cursor-pointer overflow-hidden rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 p-4 shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
      >
        <div>
          {/* Card Badges */}
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5 items-start">
            {product.discount > 0 && (
              <span className="gradient-orange text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-md shadow-brand-500/20">
                {product.discount}% OFF
              </span>
            )}
            {product.bestSeller && (
              <span className="bg-indigo-600 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                BEST SELLER
              </span>
            )}
            {product.trending && (
              <span className="bg-red-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Flame className="h-3 w-3 fill-current" />
                TRENDING
              </span>
            )}
            {product.sellerType && product.sellerType !== "official" && (
              <span
                className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-md text-white ${
                  product.sellerType === "business"
                    ? "bg-amber-500"
                    : "bg-indigo-500"
                }`}
              >
                {product.sellerType === "business" ? "WHOLESALE" : "COMMUNITY"}
              </span>
            )}
          </div>

          {/* Quick Actions (Wishlist, Compare, Share) */}
          <div className="absolute top-6 right-6 z-10 flex flex-col gap-1.5 items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className="h-9 w-9 rounded-full bg-white/95 dark:bg-slate-800/90 shadow-md flex items-center justify-center text-slate-450 hover:text-red-505 hover:scale-110 active:scale-95 transition-all"
            >
              <Heart
                className={`h-4.5 w-4.5 transition-colors ${
                  favorited
                    ? "fill-red-500 text-red-500"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              />
            </button>
            <button
              onClick={handleCompareClick}
              className={`h-9 w-9 rounded-full bg-white/95 dark:bg-slate-800/90 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all ${
                isCompared
                  ? "text-brand-500"
                  : "text-slate-400 dark:text-slate-500"
              }`}
              title="Compare Specifications"
            >
              <Scale className="h-4 w-4" />
            </button>
            <button
              onClick={handleShareClick}
              className="h-9 w-9 rounded-full bg-white/95 dark:bg-slate-800/90 shadow-md flex items-center justify-center text-slate-400 hover:text-brand-500 hover:scale-110 active:scale-95 transition-all"
              title="Copy link"
            >
              {shared ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Product Image Frame */}
          <div className="relative mb-4 h-52 w-full overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center p-4">
            <img
              src={activeImage}
              alt={product.name}
              className="max-h-full object-contain rounded-lg transition-transform duration-500 group-hover:scale-105"
            />

            {/* Quick View Button overlay */}
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 rounded-xl">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsQuickViewOpen(true);
                }}
                className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 hover:bg-brand-500 hover:text-white hover:scale-105 transition-all"
              >
                <Eye className="h-4 w-4" />
                Quick View
              </button>
            </div>
          </div>

          {/* Category & Brand */}
          <div className="flex justify-between items-center mb-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <span>{product.brand}</span>
            <span>{product.category}</span>
          </div>

          {/* Seller details */}
          {product.sellerName && (
            <div className="flex items-center justify-between mb-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              <span className="truncate">
                Seller:{" "}
                <span className="text-slate-700 dark:text-slate-300">
                  {product.sellerName}
                </span>
              </span>
              {product.sellerRating && (
                <span className="text-amber-500 flex items-center gap-0.5 font-semibold">
                  ★ {product.sellerRating}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="font-display font-extrabold text-sm text-slate-800 dark:text-white leading-tight mb-2 group-hover:text-brand-500 line-clamp-2 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 fill-current ${
                    i < Math.floor(product.rating)
                      ? "text-amber-400"
                      : "text-slate-200 dark:text-slate-800"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
              {product.rating} ({product.reviewsCount})
            </span>
          </div>

          {/* Pricing & Stock indicators */}
          <div className="flex items-baseline justify-between gap-1 mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-slate-900 dark:text-white font-display">
                ${product.discountPrice}
              </span>
              {product.price > product.discountPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.price}
                </span>
              )}
            </div>
            {product.freeDelivery && (
              <span className="text-[9px] font-extrabold bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 px-2 py-0.5 rounded-full border border-green-100 dark:border-green-500/15">
                FREE DELIVERY
              </span>
            )}
          </div>

          {/* Swatches (Color dots) */}
          <div className="flex gap-1.5 mb-2">
            {product.colors.map((col) => (
              <button
                key={col.code}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(col);
                }}
                style={{ backgroundColor: col.code }}
                className={`h-4.5 w-4.5 rounded-full border transition-all ${
                  selectedColor.code === col.code
                    ? "border-brand-500 scale-110 shadow-sm"
                    : "border-white dark:border-slate-800 hover:scale-105"
                }`}
                title={col.name}
              />
            ))}
          </div>

          {/* Used Item Condition / Bulk Quantity Tier Details */}
          {product.condition && product.sellerType !== "official" ? (
            <div className="text-[10px] font-bold text-slate-405 dark:text-slate-500 mb-4 flex items-center justify-between h-4">
              <span>
                Cond:{" "}
                <span className="text-brand-500">{product.condition}</span>
              </span>
              {product.location && (
                <span className="flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" /> {product.location}
                </span>
              )}
            </div>
          ) : (
            <div className="mb-4 h-4" />
          )}

          {/* Low Stock Warning */}
          {product.stock < 5 && (
            <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold mb-4 animate-pulse">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Only {product.stock} items left in stock!</span>
            </div>
          )}
        </div>{" "}
        {/* Action CTAs */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 border ${
              added
                ? "bg-green-500 border-green-500 text-white shadow-md"
                : "bg-white border-slate-200 text-slate-700 hover:bg-brand-500 hover:border-brand-500 hover:text-white dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-brand-500 dark:hover:border-brand-500 dark:hover:text-white"
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>{added ? "Added!" : "Add Cart"}</span>
          </button>

          {product.sellerType && product.sellerType !== "official" ? (
            /* Chat icon button for Marketplace items */
            <button
              onClick={handleContactSeller}
              className="px-3 py-2.5 border border-slate-200 text-slate-650 dark:border-slate-800 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-brand-500"
              title="Chat with Seller"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
          ) : (
            /* Buy Now button for Official Store items */
            <button
              onClick={handleBuyNow}
              className="px-3 py-2 bg-slate-900 dark:bg-white dark:text-slate-950 text-white rounded-xl text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-300"
            >
              Buy
            </button>
          )}
        </div>
      </motion.div>

      {/* Quick View Popup Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};
