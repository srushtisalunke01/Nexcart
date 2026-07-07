import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Flame, Zap } from "lucide-react";
import { ProductCard } from "./ProductCard";

export const FlashSale = ({ products, onNavigate }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 34,
    seconds: 12,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (val) => String(val).padStart(2, "0");

  // Filter products that have high discount and are on sale
  const saleProducts = products.filter((p) => p.dealOfTheDay).slice(0, 4);

  return (
    <div className="rounded-premium bg-gradient-to-br from-cyber-cyan/5 via-white to-cyber-gold/5 dark:from-cyber-cyan/5 dark:via-premium-cardDark dark:to-cyber-gold/5 border border-slate-100 dark:border-slate-800/40 p-6 sm:p-8 shadow-soft">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-gradient-to-r from-brand-500 to-cyber-gold text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-md shadow-brand-500/20 border border-cyber-gold/15">
            <Zap className="h-4 w-4 fill-current text-white animate-pulse" />
            <span>FLASH SALE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
            Deals of the Day
          </h2>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <Clock className="h-4 w-4" /> Ends in:
          </span>
          <div className="flex items-center gap-1 font-mono text-sm font-extrabold text-white">
            <div className="bg-slate-900 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg shadow">
              {formatTime(timeLeft.hours)}
            </div>
            <span className="text-slate-800 dark:text-slate-200 font-bold">
              :
            </span>
            <div className="bg-slate-900 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg shadow">
              {formatTime(timeLeft.minutes)}
            </div>
            <span className="text-slate-800 dark:text-slate-200 font-bold">
              :
            </span>
            <div className="bg-cyber-cyan text-slate-950 px-2.5 py-1.5 rounded-lg shadow shadow-cyber-cyan/20 animate-pulse">
              {formatTime(timeLeft.seconds)}
            </div>
          </div>
        </div>
      </div>

      {/* Sale Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {saleProducts.map((product) => {
          // Programmatically simulate a stock availability metric
          const claimedPercent = Math.min(
            95,
            Math.floor(
              45 +
                (((parseFloat(product.id.replace(/\D/g, "")) || 5) * 4.3) % 50),
            ),
          );
          return (
            <div key={product.id} className="relative flex flex-col gap-3">
              <ProductCard product={product} onNavigate={onNavigate} />

              {/* Claimed progress details */}
              <div className="px-1 text-xs">
                <div className="flex justify-between items-center text-slate-400 font-semibold mb-1">
                  <span>Claimed: {claimedPercent}%</span>
                  <span className="text-red-500 font-bold flex items-center gap-0.5">
                    <Flame className="h-3 w-3 fill-current" /> Selling Fast
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${claimedPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-brand-500 to-cyber-gold rounded-full"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
