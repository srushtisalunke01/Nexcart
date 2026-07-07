import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Heart,
  ShoppingBag,
  MapPin,
  Wallet,
  Sparkles,
  LogOut,
  Sun,
  Moon,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

export const Profile = ({
  onNavigate,
  initialSection = "dashboard",
  onLogout,
  userEmail,
}) => {
  const {
    wishlist,
    orders,
    walletBalance,
    loyaltyPoints,
    addresses,
    addToCart,
    toggleWishlist,
    selectedAddress,
  } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(initialSection);
  const [addedItem, setAddedItem] = useState(null);

  // Sync initialSection prop shifts
  useEffect(() => {
    setActiveTab(initialSection);
  }, [initialSection]);

  const handleAddToCartFromWishlist = (product) => {
    addToCart(product, 1);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      alert("Logout simulation completed. Returning to catalog home.");
      onNavigate("home");
    }
  };

  // Loyalty calculations
  const loyaltyLevel =
    loyaltyPoints >= 500
      ? "Platinum Elite"
      : loyaltyPoints >= 300
        ? "Gold Star"
        : "Bronze";
  const loyaltyProgress = Math.min(100, (loyaltyPoints / 500) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24 pt-4 text-slate-800 dark:text-slate-100 space-y-10"
    >
      {/* Profile Header Deck */}
      <div className="rounded-premium bg-gradient-to-r from-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background micro glow */}
        <div className="absolute h-52 w-52 rounded-full bg-brand-500/15 blur-3xl -top-12 -right-12" />

        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 text-center sm:text-left">
          {/* User Avatar */}
          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-brand-400 to-brand-500 flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-brand-500/25">
            {userEmail ? userEmail.substring(0, 2).toUpperCase() : "AS"}
          </div>
          <div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <h1 className="text-2xl font-display font-extrabold">
                {userEmail ? userEmail.split("@")[0] : "Alex Stark"}
              </h1>
              <span className="text-[10px] font-extrabold bg-brand-500/20 text-brand-300 border border-brand-500/30 px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
                <Sparkles className="h-3 w-3 animate-pulse" /> {loyaltyLevel}{" "}
                member
              </span>
            </div>
            <p className="text-slate-450 text-xs mt-1">
              {userEmail || "alex.stark@starkenterprises.com"} • Joined June
              2026
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Navigation Links */}
        <div className="lg:col-span-3 bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 rounded-premium p-4 shadow-soft space-y-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              activeTab === "dashboard"
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/10"
                : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350"
            }`}
          >
            <span className="flex items-center gap-2">
              <User className="h-4.5 w-4.5" /> Dashboard Overview
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              activeTab === "orders"
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/10"
                : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350"
            }`}
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-4.5 w-4.5" /> My Orders ({orders.length}
              )
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              activeTab === "wishlist"
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/10"
                : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-355"
            }`}
          >
            <span className="flex items-center gap-2">
              <Heart className="h-4.5 w-4.5" /> Wishlist Favorites (
              {wishlist.length})
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              activeTab === "addresses"
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/10"
                : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350"
            }`}
          >
            <span className="flex items-center gap-2">
              <MapPin className="h-4.5 w-4.5" /> Saved Locations
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => setActiveTab("wallet")}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
              activeTab === "wallet"
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/10"
                : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350"
            }`}
          >
            <span className="flex items-center gap-2">
              <Wallet className="h-4.5 w-4.5" /> NexWallet & Rewards
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={toggleTheme}
            className="w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 flex items-center gap-2"
          >
            {theme === "dark" ? (
              <Sun className="h-4.5 w-4.5 text-amber-400" />
            ) : (
              <Moon className="h-4.5 w-4.5" />
            )}
            Toggle {theme === "dark" ? "Light" : "Dark"} Mode
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left py-3 px-4 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex items-center gap-2"
          >
            <LogOut className="h-4.5 w-4.5" /> Logout Session
          </button>
        </div>

        {/* Right Side: Tab Displays */}
        <div className="lg:col-span-9 bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 rounded-premium p-6 sm:p-8 shadow-soft min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* OVERVIEW PANEL */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-8"
              >
                <h2 className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
                  Profile Overview
                </h2>

                {/* Finance cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* wallet */}
                  <div className="p-5 rounded-premium bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 flex items-center justify-between shadow-sm">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        NexWallet Balance
                      </span>
                      <p className="text-2xl font-display font-extrabold text-slate-850 dark:text-white mt-1">
                        ₹{walletBalance.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-3 bg-brand-500/10 rounded-2xl text-brand-500">
                      <Wallet className="h-6 w-6" />
                    </div>
                  </div>

                  {/* loyalty points */}
                  <div className="p-5 rounded-premium bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 flex items-center justify-between shadow-sm">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Reward Cashpoints
                      </span>
                      <p className="text-2xl font-display font-extrabold text-slate-850 dark:text-white mt-1">
                        {loyaltyPoints} pts
                      </p>
                    </div>
                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
                      <Sparkles className="h-6 w-6" />
                    </div>
                  </div>

                  {/* orders count */}
                  <div className="p-5 rounded-premium bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 flex items-center justify-between shadow-sm">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Completed Orders
                      </span>
                      <p className="text-2xl font-display font-extrabold text-slate-850 dark:text-white mt-1">
                        {orders.length} orders
                      </p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-2xl text-green-500">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                {/* Shipping locations summary */}
                <div className="bg-slate-50/50 dark:bg-slate-900/10 p-5 border border-slate-100 dark:border-slate-800 rounded-premium flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className="h-10 w-10 bg-brand-50 dark:bg-brand-500/5 rounded-xl flex items-center justify-center text-brand-500">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Active Delivery Location
                      </span>
                      <p className="font-bold text-sm text-slate-800 dark:text-white mt-0.5">
                        {selectedAddress
                          ? `${selectedAddress.street}, ${selectedAddress.city}`
                          : "No address selected"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("addresses")}
                    className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1.5"
                  >
                    Manage Locations <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ORDERS PANEL */}
            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-display font-extrabold text-slate-905 dark:text-white mb-4">
                  My Orders ({orders.length})
                </h2>

                {orders.length === 0 ? (
                  <div className="text-center py-12 border border-slate-100 dark:border-slate-800/40 rounded-premium">
                    <p className="text-slate-400 text-sm font-semibold mb-3">
                      No transactions found in this profile.
                    </p>
                    <button
                      onClick={() => onNavigate("home")}
                      className="px-4 py-2 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-600"
                    >
                      Shop Catalog
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="border border-slate-100 dark:border-slate-800/80 rounded-premium p-5 space-y-4 shadow-soft bg-slate-50/50 dark:bg-slate-900/10"
                      >
                        {/* Order Header info */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3.5 border-b border-slate-100 dark:border-slate-800/60">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                              Order ID
                            </span>
                            <p className="font-mono text-sm font-extrabold text-slate-850 dark:text-white leading-tight">
                              {ord.id}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                              Order Date
                            </span>
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                              <Calendar className="h-4 w-4" /> {ord.date}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                              Order Status
                            </span>
                            <span className="text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider block text-center bg-brand-500 text-white shadow shadow-brand-500/10">
                              {ord.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                          {ord.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="h-10 w-10 object-contain bg-white rounded-lg p-1"
                                />
                                <div>
                                  <p className="font-bold text-slate-800 dark:text-white max-w-[150px] sm:max-w-[280px] truncate">
                                    {item.product.name}
                                  </p>
                                  <p className="text-[10px] text-slate-400">
                                    Qty: {item.quantity} •{" "}
                                    {item.selectedColor?.name}
                                  </p>
                                </div>
                              </div>
                              <span className="font-extrabold text-slate-900 dark:text-white">
                                ₹{item.product.discountPrice * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Delivery Track details */}
                        <div className="flex flex-col sm:flex-row justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800/60 gap-3">
                          <p className="text-xs text-slate-400">
                            Paid by:{" "}
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {ord.paymentMethod}
                            </span>
                          </p>
                          <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                            Total Deducted: ₹{ord.total}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* WISHLIST PANEL */}
            {activeTab === "wishlist" && (
              <motion.div
                key="wishlist"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-display font-extrabold text-slate-905 dark:text-white mb-4">
                  Saved Favorites ({wishlist.length})
                </h2>

                {wishlist.length === 0 ? (
                  <div className="text-center py-12 border border-slate-100 dark:border-slate-800/40 rounded-premium">
                    <p className="text-slate-450 text-sm font-semibold mb-3">
                      Your wishlist is empty.
                    </p>
                    <button
                      onClick={() => onNavigate("home")}
                      className="px-4 py-2 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md"
                    >
                      Go Browse
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map((prod) => (
                      <div
                        key={prod.id}
                        className="border border-slate-100 dark:border-slate-800/80 rounded-premium p-4 flex flex-col justify-between gap-4 shadow-soft bg-slate-50/50 dark:bg-slate-900/10"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="h-16 w-16 object-contain bg-white rounded-xl p-1.5"
                          />
                          <div className="min-w-0">
                            <h3 className="font-bold text-xs truncate leading-tight">
                              {prod.name}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                              {prod.brand}
                            </p>
                            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                              ₹{prod.discountPrice}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddToCartFromWishlist(prod)}
                            className={`flex-1 py-2 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 border transition-all ${
                              addedItem === prod.id
                                ? "bg-green-500 border-green-500 text-white"
                                : "bg-white border-slate-200 hover:bg-brand-500 hover:text-white dark:bg-slate-900 dark:border-slate-800"
                            }`}
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            <span>
                              {addedItem === prod.id ? "Added!" : "Move Cart"}
                            </span>
                          </button>
                          <button
                            onClick={() => toggleWishlist(prod)}
                            className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold text-red-500 hover:bg-red-50 hover:border-red-100 dark:hover:bg-red-500/10 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ADDRESSES PANEL */}
            {activeTab === "addresses" && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-display font-extrabold text-slate-905 dark:text-white mb-4">
                  Saved Locations
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 rounded-premium border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 shadow-soft"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-extrabold text-sm text-slate-850 dark:text-white">
                          {addr.name}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[9px] font-extrabold bg-brand-500 text-white px-2 py-0.5 rounded-full">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                        {addr.street}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                        {addr.city}, {addr.state} - {addr.zipCode}
                      </p>
                      <p className="text-[10px] text-slate-450 font-bold mt-4">
                        {addr.phone}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* WALLET & REWARDS PANEL */}
            {activeTab === "wallet" && (
              <motion.div
                key="wallet"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-8"
              >
                <h2 className="text-xl font-display font-extrabold text-slate-905 dark:text-white">
                  NexWallet & Loyalty Programs
                </h2>

                {/* wallet balances */}
                <div className="rounded-premium gradient-orange p-6 text-white shadow-lg flex justify-between items-center relative overflow-hidden">
                  <div className="absolute h-32 w-32 rounded-full bg-white/10 blur-xl -top-6 -right-6" />
                  <div>
                    <span className="text-xs text-brand-100 font-semibold uppercase tracking-wider">
                      NexWallet Ledger
                    </span>
                    <p className="text-3xl font-display font-extrabold mt-1.5">
                      ₹{walletBalance.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-brand-100/80 mt-1">
                      Direct Deductable enabled for checkout.
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-white/15 flex items-center justify-center shadow">
                    <Wallet className="h-6 w-6" />
                  </div>
                </div>

                {/* loyalty rewards progress */}
                <div className="border border-slate-100 dark:border-slate-800 rounded-premium p-6 space-y-4 shadow-soft">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">
                        Loyalty Cashpoint Program
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Unlock luxury discount tokens at 500 points.
                      </p>
                    </div>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {loyaltyPoints} / 500 pts
                    </span>
                  </div>

                  {/* progress tracking bar */}
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${loyaltyProgress}%` }}
                      className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full"
                    />
                  </div>

                  <p className="text-xs text-slate-400 leading-normal flex items-start gap-1">
                    <Sparkles className="h-4 w-4 text-brand-500 mt-0.5" />
                    You are only {500 - loyaltyPoints} cashpoints away from
                    unlocking your next ₹50 NexCart luxury gift card voucher!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
