import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ShoppingBag } from "lucide-react";
import { SellModal } from "./SellModal";

export const SellButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-brand-400 to-brand-500 text-white font-display font-extrabold text-sm px-6 py-4.5 rounded-full shadow-lg shadow-brand-500/25 flex items-center gap-2 hover:from-brand-500 hover:to-brand-600 focus:outline-none"
      >
        <ShoppingBag className="h-5 w-5 animate-pulse" />
        <span>Sell</span>
        <Sparkles className="h-3.5 w-3.5" />
      </motion.button>

      {/* Pop up Sell Modal */}
      <SellModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
