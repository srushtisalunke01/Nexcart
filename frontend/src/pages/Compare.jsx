import React from "react";
import { motion } from "framer-motion";
import { Trash2, ShoppingBag, Scale, ChevronLeft, Star } from "lucide-react";
import { useCart } from "../context/CartContext";

export const Compare = ({ onNavigate }) => {
  const { compareList, removeFromCompare, clearCompare, addToCart } = useCart();

  // Accumulate all unique spec keys across compared items
  const uniqueSpecKeys = Array.from(
    new Set(compareList.flatMap((p) => Object.keys(p.specifications))),
  );

  if (compareList.length === 0) {
    return (
      <div className="text-center py-20 max-w-md mx-auto space-y-6">
        <div className="h-20 w-20 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500 mx-auto">
          <Scale className="h-9 w-9" />
        </div>
        <div>
          <h2 className="text-xl font-display font-extrabold text-slate-805 dark:text-white">
            Comparison Deck is Empty
          </h2>
          <p className="text-slate-400 text-xs mt-1 leading-normal">
            You can add up to 4 items side-by-side. Tap "Compare specs" on any
            product detail page to start analyzing models.
          </p>
        </div>
        <button
          onClick={() => onNavigate("home")}
          className="px-5 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-bold hover:bg-brand-600 shadow"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24 pt-4 text-slate-800 dark:text-slate-100 space-y-10"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("home")}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">
              Model Comparison
            </h1>
            <p className="text-[10px] text-slate-400">
              Comparing details for {compareList.length} items side-by-side.
            </p>
          </div>
        </div>

        <button
          onClick={clearCompare}
          className="px-4 py-2 border border-slate-205 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Clear Deck
        </button>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 shadow-soft">
        <table className="w-full border-collapse text-left text-xs min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              <th className="p-5 font-bold text-slate-400 uppercase tracking-wider w-1/5">
                Details
              </th>
              {compareList.map((prod) => (
                <th key={prod.id} className="p-5 w-1/5 relative">
                  <button
                    onClick={() => removeFromCompare(prod.id)}
                    className="absolute top-4 right-4 p-1 rounded-lg text-slate-450 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-colors"
                    title="Remove from comparison"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex flex-col items-center text-center space-y-2 mt-4">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="h-20 w-20 object-contain bg-white rounded-lg p-1.5"
                    />
                    <div>
                      <h3 className="font-extrabold text-slate-800 dark:text-white leading-tight truncate max-w-[140px]">
                        {prod.name}
                      </h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">
                        {prod.brand}
                      </p>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price */}
            <tr className="border-b border-slate-50 dark:border-slate-900/40">
              <td className="p-5 font-bold text-slate-400 uppercase tracking-wider">
                Discount Price
              </td>
              {compareList.map((prod) => (
                <td
                  key={prod.id}
                  className="p-5 text-center font-display font-extrabold text-sm text-slate-800 dark:text-white"
                >
                  ${prod.discountPrice}
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr className="border-b border-slate-50 dark:border-slate-900/40">
              <td className="p-5 font-bold text-slate-400 uppercase tracking-wider">
                Ratings
              </td>
              {compareList.map((prod) => (
                <td key={prod.id} className="p-5 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-current" />
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {prod.rating}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400">
                    {prod.reviewsCount} reviews
                  </span>
                </td>
              ))}
            </tr>

            {/* Specifications dynamically matched */}
            {uniqueSpecKeys.map((specKey) => (
              <tr
                key={specKey}
                className="border-b border-slate-50 dark:border-slate-900/40"
              >
                <td className="p-5 font-bold text-slate-400 uppercase tracking-wider">
                  {specKey}
                </td>
                {compareList.map((prod) => (
                  <td
                    key={prod.id}
                    className="p-5 text-center font-semibold text-slate-700 dark:text-slate-350"
                  >
                    {prod.specifications[specKey] || "—"}
                  </td>
                ))}
              </tr>
            ))}

            {/* Colors */}
            <tr className="border-b border-slate-50 dark:border-slate-900/40">
              <td className="p-5 font-bold text-slate-400 uppercase tracking-wider">
                Colors Available
              </td>
              {compareList.map((prod) => (
                <td key={prod.id} className="p-5">
                  <div className="flex justify-center gap-1">
                    {prod.colors.map((col) => (
                      <span
                        key={col.code}
                        style={{ backgroundColor: col.code }}
                        className="h-4 w-4 rounded-full border border-slate-200 dark:border-slate-700"
                        title={col.name}
                      />
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Add to cart CTA */}
            <tr>
              <td className="p-5 font-bold text-slate-400 uppercase tracking-wider">
                Actions
              </td>
              {compareList.map((prod) => (
                <td key={prod.id} className="p-5 text-center">
                  <button
                    onClick={() => {
                      addToCart(prod, 1);
                      alert(`${prod.name} added to cart!`);
                    }}
                    className="py-2.5 px-4 bg-brand-500 text-white rounded-xl text-[10px] font-bold shadow-md hover:bg-brand-600 hover:shadow-premium-orange transition-all inline-flex items-center gap-1"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" /> Add Cart
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
