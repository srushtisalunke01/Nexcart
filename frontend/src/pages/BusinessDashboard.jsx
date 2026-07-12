import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building,
  ClipboardList,
  DollarSign,
  Check,
  X,
  Star,
  TrendingUp,
  Sparkles,
  Box,
} from "lucide-react";
import { useMarketplace } from "../context/MarketplaceContext";
import { useCart } from "../context/CartContext";

export const BusinessDashboard = ({ onNavigate }) => {
  const {
    marketplaceProducts,
    quotes,
    businessProfile,
    respondToQuote,
    updateBusinessSettings,
  } = useMarketplace();
  const { addNotification } = useCart();
  const [activeTab, setActiveTab] = useState("profile");

  // Business profile states for inline editing
  const [companyName, setCompanyName] = useState(businessProfile.companyName);
  const [description, setDescription] = useState(businessProfile.description);
  const [logo, setLogo] = useState(businessProfile.logo);
  const [moq, setMoq] = useState(businessProfile.moq.toString());
  const [taxId, setTaxId] = useState(businessProfile.taxId);

  // Filter products where the seller is this business
  const businessProducts = marketplaceProducts.filter(
    (p) =>
      p.sellerType === "business" &&
      p.sellerName === businessProfile.companyName,
  );

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateBusinessSettings({
      companyName,
      description,
      logo,
      moq: parseInt(moq) || 1,
      taxId,
    });
    addNotification(
      "Business Profile Saved",
      "Your company verification settings have been updated.",
    );
    setActiveTab("profile");
  };

  const handleQuoteAction = (quoteId, name, status) => {
    respondToQuote(quoteId, status);
    addNotification(
      status === "approved" ? "Quotation Approved" : "Quotation Declined",
      `The wholesale price quote inquiry for "${name}" has been ${status}.`,
    );
  };

  // Wholesale metrics
  const totalWholesaleRevenue = quotes
    .filter((q) => q.status === "approved")
    .reduce((acc, q) => acc + q.totalAmount, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24 pt-4 text-slate-800 dark:text-slate-100 space-y-8"
    >
      {/* Business Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Wholesale Catalog
            </span>
            <p className="text-2xl font-display font-extrabold text-slate-850 dark:text-white mt-1">
              {businessProducts.length} Items
            </p>
          </div>
          <div className="p-3 bg-brand-500/10 rounded-2xl text-brand-500">
            <Box className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Wholesale Inquiries
            </span>
            <p className="text-2xl font-display font-extrabold text-slate-850 dark:text-white mt-1">
              {quotes.filter((q) => q.status === "pending").length} Pending
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
            <ClipboardList className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Wholesale Income
            </span>
            <p className="text-2xl font-display font-extrabold text-slate-850 dark:text-white mt-1">
              ${totalWholesaleRevenue}
            </p>
          </div>
          <div className="p-3 bg-green-500/10 rounded-2xl text-green-500">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Seller Reputation
            </span>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-5 w-5 fill-brand-500 text-brand-500 animate-pulse" />
              <span className="text-lg font-display font-extrabold text-slate-850 dark:text-white">
                {businessProfile.rating} / 5
              </span>
            </div>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
            <Building className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Tabs navigation panel */}
      <div className="bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 rounded-premium p-4 shadow-soft">
        <div className="flex flex-wrap border-b border-slate-100 dark:border-slate-850">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 font-display font-bold text-xs sm:text-sm uppercase tracking-wide border-b-2 transition-colors ${
              activeTab === "profile"
                ? "border-brand-500 text-brand-500"
                : "border-transparent text-slate-400 hover:text-slate-650"
            }`}
          >
            Company Profile
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 py-3 font-display font-bold text-xs sm:text-sm uppercase tracking-wide border-b-2 transition-colors ${
              activeTab === "products"
                ? "border-brand-500 text-brand-500"
                : "border-transparent text-slate-400 hover:text-slate-650"
            }`}
          >
            Inventory Products ({businessProducts.length})
          </button>
          <button
            onClick={() => setActiveTab("quotes")}
            className={`flex-1 py-3 font-display font-bold text-xs sm:text-sm uppercase tracking-wide border-b-2 transition-colors ${
              activeTab === "quotes"
                ? "border-brand-500 text-brand-500"
                : "border-transparent text-slate-400 hover:text-slate-650"
            }`}
          >
            Quotations ({quotes.length})
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 py-3 font-display font-bold text-xs sm:text-sm uppercase tracking-wide border-b-2 transition-colors ${
              activeTab === "analytics"
                ? "border-brand-500 text-brand-500"
                : "border-transparent text-slate-400 hover:text-slate-650"
            }`}
          >
            Sales Analytics
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 py-3 font-display font-bold text-xs sm:text-sm uppercase tracking-wide border-b-2 transition-colors ${
              activeTab === "settings"
                ? "border-brand-500 text-brand-500"
                : "border-transparent text-slate-400 hover:text-slate-650"
            }`}
          >
            Business Settings
          </button>
        </div>

        <div className="pt-6">
          <AnimatePresence mode="wait">
            {/* Tab: Company Profile View */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row gap-6 items-center p-6 border rounded-2xl bg-slate-50/50 dark:bg-slate-900/10">
                  <img
                    src={businessProfile.logo}
                    alt="company logo"
                    className="h-20 w-20 rounded-2xl border bg-white object-contain p-2 shadow-sm"
                  />
                  <div className="text-center sm:text-left space-y-1.5 flex-1">
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <h3 className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
                        {businessProfile.companyName}
                      </h3>
                      {businessProfile.verified && (
                        <span className="text-[9px] font-extrabold bg-brand-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Check className="h-3 w-3" /> VERIFIED WHOLESALER
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-405 font-medium leading-relaxed max-w-xl">
                      {businessProfile.description}
                    </p>
                    <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                      Registered Tax ID: {businessProfile.taxId} • MOQ:{" "}
                      {businessProfile.moq} items
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 border rounded-2xl bg-slate-50/20 dark:bg-slate-900/5 space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      Business Tier Status
                    </span>
                    <p className="text-base font-bold flex items-center gap-1.5 text-brand-500">
                      <Sparkles className="h-4.5 w-4.5" /> Platinum Supplier
                      Grade
                    </p>
                  </div>
                  <div className="p-5 border rounded-2xl bg-slate-50/20 dark:bg-slate-900/5 space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      Supply Hub Fulfillment
                    </span>
                    <p className="text-xs font-semibold">
                      Standard freight dispatched in 48 hours to worldwide
                      logistics locations.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab: Products */}
            {activeTab === "products" && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                {businessProducts.length === 0 ? (
                  <div className="text-center py-12 border border-dashed rounded-2xl border-slate-200 dark:border-slate-800">
                    <p className="text-slate-450 text-xs font-semibold">
                      No wholesale products active. Please use the floating
                      "Sell" button to list items.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {businessProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-4 rounded-2xl border flex gap-4 shadow-sm bg-slate-50/50 dark:bg-slate-900/10"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="h-20 w-20 object-contain bg-white rounded-xl p-1.5 border"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-xs sm:text-sm truncate">
                              {prod.name}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                              MOQ: {prod.moq} • Stock: {prod.stock}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {prod.priceTiers?.map((t, idx) => (
                                <span
                                  key={idx}
                                  className="bg-brand-500/5 border border-brand-500/10 text-brand-600 text-[9px] font-semibold px-2 py-0.5 rounded-full dark:text-brand-400"
                                >
                                  {t.qty}+ Qty: ${t.price}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Tab: Quotations List */}
            {activeTab === "quotes" && (
              <motion.div
                key="quotes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                {quotes.length === 0 ? (
                  <div className="text-center py-12 border border-dashed rounded-2xl border-slate-200 dark:border-slate-800">
                    <p className="text-slate-455 text-xs font-semibold">
                      No wholesale quotation requests received.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quotes.map((q) => (
                      <div
                        key={q.id}
                        className="p-5 border rounded-2xl bg-slate-50/50 dark:bg-slate-900/10 space-y-4 shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                              Quote ID: {q.id}
                            </span>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-850 dark:text-white leading-tight">
                              {q.productName}
                            </h4>
                          </div>
                          <div>
                            <span
                              className={`text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                                q.status === "approved"
                                  ? "bg-green-500 text-white"
                                  : q.status === "declined"
                                    ? "bg-red-500 text-white"
                                    : "bg-amber-500 text-white"
                              }`}
                            >
                              {q.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 font-semibold">
                              Requesting Company
                            </span>
                            <p className="font-bold text-slate-800 dark:text-white mt-0.5">
                              {q.companyName}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold">
                              Quantity Requested
                            </span>
                            <p className="font-bold text-slate-800 dark:text-white mt-0.5">
                              {q.quantity} bundles
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold">
                              Price per Unit
                            </span>
                            <p className="font-bold text-slate-800 dark:text-white mt-0.5">
                              ${q.pricePerUnit}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold">
                              Total Deal Value
                            </span>
                            <p className="font-bold text-slate-900 dark:text-brand-400 mt-0.5">
                              ${q.totalAmount}
                            </p>
                          </div>
                        </div>

                        {q.notes && (
                          <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl text-[11px] font-semibold text-slate-500 dark:text-slate-400 italic">
                            Customer Notes: "{q.notes}"
                          </div>
                        )}

                        {q.status === "pending" && (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() =>
                                handleQuoteAction(
                                  q.id,
                                  q.productName,
                                  "approved",
                                )
                              }
                              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <Check className="h-3.5 w-3.5" /> Approve Quote
                            </button>
                            <button
                              onClick={() =>
                                handleQuoteAction(
                                  q.id,
                                  q.productName,
                                  "declined",
                                )
                              }
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <X className="h-3.5 w-3.5" /> Decline
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Tab: Analytics */}
            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 border rounded-2xl bg-slate-50/50 dark:bg-slate-900/10 space-y-4">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Wholesale Funnel (Quotations Volume)
                    </span>
                    <div className="h-32 flex items-end gap-2 pt-4">
                      {[1200, 3400, 0, 5940, 2490, 8900, 1100].map(
                        (val, idx) => (
                          <div
                            key={idx}
                            className="flex-1 flex flex-col items-center gap-1.5"
                          >
                            <div
                              style={{
                                height: `${val > 0 ? (val / 8900) * 100 : 5}%`,
                              }}
                              className="w-full bg-brand-500 rounded-t-md hover:bg-brand-600 transition-all cursor-pointer relative group"
                            >
                              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                                ${val}
                              </span>
                            </div>
                            <span className="text-[8px] text-slate-400 font-semibold">
                              July {idx + 1}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="p-5 border rounded-2xl bg-slate-50/50 dark:bg-slate-900/10 space-y-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Business Conversion Insights
                      </span>
                      <p className="text-xs font-semibold text-slate-650 mt-3 leading-relaxed">
                        Wholesale margins are holding at{" "}
                        <span className="text-brand-500 font-bold">24.5%</span>.
                        Most corporations request quotes on accessories. Bumping
                        products twice a week is recommended.
                      </p>
                    </div>
                    <div className="p-3 bg-brand-50/50 dark:bg-brand-500/5 rounded-xl border border-brand-100/10 text-xs font-semibold text-brand-600 flex items-center gap-1.5">
                      <TrendingUp className="h-4.5 w-4.5 animate-pulse" />{" "}
                      Wholesale volume increased 18.5% this week.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab: Settings Form */}
            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <form
                  onSubmit={handleSaveSettings}
                  className="space-y-4 max-w-xl"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                      Company Description
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                      Logo Image URL
                    </label>
                    <input
                      type="text"
                      required
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                        Standard Wholesale MOQ
                      </label>
                      <input
                        type="number"
                        required
                        value={moq}
                        onChange={(e) => setMoq(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                        Tax ID Number
                      </label>
                      <input
                        type="text"
                        required
                        value={taxId}
                        onChange={(e) => setTaxId(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-slate-900 dark:bg-white dark:text-slate-950 text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-md mt-4"
                  >
                    Save Changes
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
