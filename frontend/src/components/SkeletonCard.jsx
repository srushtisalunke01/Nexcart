import React from "react";

export const SkeletonCard = () => {
  return (
    <div className="rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/50 p-4 shadow-soft overflow-hidden">
      {/* Product Image Shimmer */}
      <div className="shimmer-effect w-full h-52 rounded-xl mb-4" />

      {/* Discount Badge and Category */}
      <div className="flex justify-between items-center mb-3">
        <div className="shimmer-effect w-16 h-5 rounded-full" />
        <div className="shimmer-effect w-12 h-4 rounded" />
      </div>

      {/* Title */}
      <div className="shimmer-effect w-3/4 h-5 rounded mb-2" />
      <div className="shimmer-effect w-1/2 h-4 rounded mb-4" />

      {/* Ratings & Price */}
      <div className="flex justify-between items-center mb-4">
        <div className="shimmer-effect w-20 h-4 rounded" />
        <div className="shimmer-effect w-16 h-6 rounded" />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <div className="shimmer-effect flex-1 h-10 rounded-xl" />
        <div className="shimmer-effect w-10 h-10 rounded-xl" />
      </div>
    </div>
  );
};
