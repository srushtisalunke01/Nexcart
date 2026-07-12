import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  SlidersHorizontal,
  AlertCircle,
  RefreshCw,
  Search,
  MapPin,
} from "lucide-react";
import { useMarketplace } from "../context/MarketplaceContext";
import { ProductCard } from "../components/ProductCard";

export const Marketplace = ({ onNavigate, searchFilter = "" }) => {
  const { marketplaceProducts } = useMarketplace();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(searchFilter);

  React.useEffect(() => {
    setSearchQuery(searchFilter);
  }, [searchFilter]);

  const [sellerTypeFilter, setSellerTypeFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [negotiableFilter, setNegotiableFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState(false);

  const filteredMarketplaceListings = marketplaceProducts.filter((prod) => {
    // Only display actual marketplace sellers (business or individual)
    if (prod.sellerType === "official") return false;

    if (
      searchQuery &&
      !prod.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !prod.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (sellerTypeFilter !== "all" && prod.sellerType !== sellerTypeFilter) {
      return false;
    }
    if (conditionFilter !== "all" && prod.condition !== conditionFilter) {
      return false;
    }
    if (negotiableFilter !== "all" && prod.negotiable !== negotiableFilter) {
      return false;
    }
    if (
      locationFilter &&
      prod.location &&
      !prod.location.toLowerCase().includes(locationFilter.toLowerCase())
    ) {
      return false;
    }
    if (verifiedFilter && !prod.sellerVerified) {
      return false;
    }
    return true;
  });

  const resetAllFilters = () => {
    setSearchQuery("");
    setSellerTypeFilter("all");
    setConditionFilter("all");
    setNegotiableFilter("all");
    setLocationFilter("");
    setVerifiedFilter(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24 pt-4 text-slate-800 dark:text-slate-100 space-y-8"
    >
      {/* Header Banner */}
      <div className="rounded-premium bg-gradient-to-r from-yellow-500/10 via-brand-500/10 to-orange-500/10 border border-brand-100 dark:border-brand-500/10 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-soft">
        <div className="text-center sm:text-left space-y-2">
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-850 dark:text-white">
            NEXUS Marketplace
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-lg">
            Discover bulk wholesale items from certified businesses, or explore
            used products offered directly by our luxury community.
          </p>
        </div>

        {/* Quick count highlights */}
        <div className="flex gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 px-5 py-3 rounded-2xl text-center shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Wholesalers
            </span>
            <p className="text-xl font-display font-extrabold text-brand-500 mt-0.5">
              Verified
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 px-5 py-3 rounded-2xl text-center shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Community
            </span>
            <p className="text-xl font-display font-extrabold text-indigo-500 mt-0.5">
              Secure
            </p>
          </div>
        </div>
      </div>

      {/* Filter Options Panel */}
      <div className="bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 rounded-premium p-6 shadow-soft space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <SlidersHorizontal className="h-4.5 w-4.5 text-brand-500" /> Filter
            & Search listings
          </span>
          <button
            onClick={resetAllFilters}
            className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-brand-100/10"
          >
            <RefreshCw className="h-3 w-3" /> Reset Filters
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Text Search input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keyword..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none dark:text-white"
            />
          </div>

          {/* Seller Type Select */}
          <div>
            <select
              value={sellerTypeFilter}
              onChange={(e) => setSellerTypeFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs focus:outline-none dark:text-white"
            >
              <option value="all">Seller Profile: All Sellers</option>
              <option value="business">Businesses / Wholesalers Only</option>
              <option value="individual">Community Individuals Only</option>
            </select>
          </div>

          {/* Used Item Condition selection */}
          <div>
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-xs focus:outline-none dark:text-white"
            >
              <option value="all">Condition: All</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Used">Used</option>
            </select>
          </div>

          {/* Location input */}
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-500" />
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Location e.g. Brooklyn"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none dark:text-white"
            />
          </div>
        </div>

        {/* Extra Toggles */}
        <div className="flex flex-wrap items-center gap-6 pt-2">
          {/* Negotiable Price */}
          <label className="inline-flex items-center cursor-pointer">
            <select
              value={
                negotiableFilter === "all"
                  ? "all"
                  : negotiableFilter
                    ? "true"
                    : "false"
              }
              onChange={(e) => {
                const val = e.target.value;
                setNegotiableFilter(val === "all" ? "all" : val === "true");
              }}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs focus:outline-none dark:text-white font-semibold"
            >
              <option value="all">Price Type: All</option>
              <option value="true">Negotiable Price Only</option>
              <option value="false">Firm Price Only</option>
            </select>
          </label>

          {/* Verified seller */}
          <label className="inline-flex items-center cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={verifiedFilter}
              onChange={() => setVerifiedFilter(!verifiedFilter)}
              className="accent-brand-500 h-4.5 w-4.5 rounded border-slate-200 mr-2"
            />
            Verified Sellers & Wholesalers Only
          </label>
        </div>
      </div>

      {/* Grid listing catalog */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
            Marketplace Catalog ({filteredMarketplaceListings.length} listings)
          </h2>
        </div>

        {filteredMarketplaceListings.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 rounded-premium shadow-soft space-y-3">
            <AlertCircle className="h-10 w-10 text-slate-400 mx-auto" />
            <p className="text-slate-400 text-sm font-semibold">
              No listings found matching these filters.
            </p>
            <button
              onClick={resetAllFilters}
              className="text-xs font-bold text-brand-500 hover:text-brand-600 underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMarketplaceListings.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
};
