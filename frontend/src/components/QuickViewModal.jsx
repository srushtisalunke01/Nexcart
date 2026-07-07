import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ShoppingBag, Eye, ShieldCheck, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";

export const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  // Reset local States when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0] || null);
      setSelectedSize(product.sizes?.[0] || null);
      setQuantity(1);
      setAddedMessage(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      product,
      quantity,
      selectedColor || undefined,
      selectedSize || undefined,
    );
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(
      product,
      1,
      selectedColor || undefined,
      selectedSize || undefined,
    );
    onClose();
    // Simulate navigating to cart
    window.location.hash = "#cart";
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-4xl overflow-hidden rounded-premium bg-white shadow-2xl dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/50 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Product Images */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/20 flex flex-col justify-center items-center relative min-h-[300px]">
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-brand-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-md">
                  {product.discount}% OFF
                </div>
              )}

              <img
                src={product.images[0]}
                alt={product.name}
                className="max-h-[320px] object-contain rounded-2xl drop-shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Right: Info */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">
                  {product.brand}
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mt-1 mb-2">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 fill-current ${
                          i < Math.floor(product.rating)
                            ? "text-amber-400"
                            : "text-slate-300 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {product.rating} ({product.reviewsCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                    ₹{product.discountPrice}
                  </span>
                  {product.price > product.discountPrice && (
                    <span className="text-lg text-slate-400 line-through">
                      ₹{product.price}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Swatches (Colors) */}
                <div className="mb-5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">
                    Selected Color: {selectedColor?.name}
                  </h4>
                  <div className="flex gap-2.5">
                    {product.colors.map((col) => (
                      <button
                        key={col.code}
                        onClick={() => setSelectedColor(col)}
                        style={{ backgroundColor: col.code }}
                        className={`h-8 w-8 rounded-full border-2 transition-all relative ${
                          selectedColor?.code === col.code
                            ? "border-brand-500 scale-110 shadow-md"
                            : "border-white dark:border-slate-800 hover:scale-105"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Swatches (Sizes) */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">
                      Selected Size: {selectedSize}
                    </h4>
                    <div className="flex gap-2">
                      {product.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`min-w-[40px] px-3 py-1.5 rounded-lg border font-semibold text-xs transition-all ${
                            selectedSize === sz
                              ? "bg-brand-500 border-brand-500 text-white shadow-sm"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 px-1 py-0.5">
                    <button
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                      className="px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-brand-500 font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-slate-800 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-brand-500 font-bold"
                    >
                      +
                    </button>
                  </div>

                  {product.stock < 5 && (
                    <span className="text-xs font-semibold text-red-500 animate-pulse">
                      Only {product.stock} items left!
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 hover:shadow-premium-orange transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {addedMessage ? (
                    <>
                      <ShieldCheck className="h-5 w-5 animate-pulse" />
                      <span>Added Successfully</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 bg-slate-900 dark:bg-white dark:text-slate-950 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Eye className="h-5 w-5" />
                  <span>Buy Now</span>
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border flex items-center justify-center transition-colors ${
                    isInWishlist(product.id)
                      ? "border-red-100 bg-red-50 text-red-500"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
