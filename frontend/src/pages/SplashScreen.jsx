import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800); // Small pause at 100% for smooth transition
          return 100;
        }
        // Dynamic deceleration logic: progress slows down as it approaches 100%
        const diff = 100 - prev;
        const increment = Math.max(0.4, diff * 0.05) + Math.random() * 0.15;
        const next = prev + increment;
        return next >= 100 ? 100 : next;
      });
    }, 35);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-premium-dark text-white overflow-hidden circuit-pattern">
      {/* Background cyan radial glow */}
      <div className="absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-cyber-cyan/10 blur-[120px] -z-10 animate-pulse" />
      {/* Background gold radial glow */}
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-cyber-gold/10 blur-[120px] -z-10 animate-pulse" />

      {/* Floating particles of logo color palette */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.4 + 0.1,
            }}
            animate={{
              y: -100,
              x: `calc(${Math.random() * 100 - 50}px + 50vw)`,
              rotate: 360,
            }}
            transition={{
              repeat: Infinity,
              duration: 8 + Math.random() * 8,
              ease: "linear",
              delay: Math.random() * 4,
            }}
            className={`absolute h-2.5 w-2.5 rounded-full ${
              i % 3 === 0
                ? "bg-cyber-cyan"
                : i % 3 === 1
                  ? "bg-cyber-gold"
                  : "bg-brand-500"
            }`}
          />
        ))}
      </div>

      <div className="flex flex-col items-center max-w-sm w-full px-6">
        {/* Pulsing logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="relative mb-8 flex justify-center items-center h-40 w-40"
        >
          {/* Logo Glow Ring */}
          <div className="absolute inset-0 rounded-full bg-cyber-cyan/15 blur-2xl animate-pulse" />

          <img
            src="/logo.png"
            alt="NexCart Logo"
            className="h-40 w-40 object-contain rounded-premium neon-glow-gold relative z-10"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = document.getElementById("splash-logo-fallback");
              if (fallback) fallback.style.display = "block";
            }}
          />

          <div id="splash-logo-fallback" className="hidden relative z-10">
            <svg
              className="h-32 w-32 text-white fill-current"
              viewBox="0 0 100 100"
            >
              <rect width="100" height="100" rx="25" fill="#FF6B00" />
              <path
                d="M30 35 L45 35 L55 65 L75 65"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="48" cy="78" r="6" fill="white" />
              <circle cx="71" cy="78" r="6" fill="white" />
            </svg>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-display font-extrabold tracking-wider mb-1"
        >
          <span className="text-white">Nex</span>
          <span className="text-cyber-gold text-glow-gold">Cart</span>
        </motion.h1>

        {/* Subtitle matching the logo slogan */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-1.5 text-xs text-slate-400 font-display tracking-[0.25em] font-extrabold mb-12 uppercase"
        >
          <Sparkles className="h-3.5 w-3.5 text-cyber-cyan" />
          <span>Shop Beyond Limits</span>
        </motion.div>

        {/* Custom Progress bar */}
        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mb-3 relative border border-slate-800/35">
          <motion.div
            style={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-cyber-cyan via-brand-500 to-cyber-gold rounded-full"
          />
        </div>

        {/* Loading percentage */}
        <span className="text-xs font-semibold text-slate-500 font-mono">
          LOADING CORE SYSTEMS... {Math.floor(progress)}%
        </span>
      </div>
    </div>
  );
};
