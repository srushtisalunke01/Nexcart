import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    tagline: "SPATIAL AUDIO REVOLUTION",
    title: "AeroPulse ANC Pro",
    subtitle:
      "Immerse yourself in pure acoustic precision. The pinnacle of Active Noise Cancellation technology.",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&auto=format&fit=crop&q=80",
    ctaText: "Explore sound",
    targetId: "aud-01",
  },
  {
    id: 2,
    tagline: "HOROLOGICAL EXCELLENCE",
    title: "The Luxury Vault",
    subtitle:
      "Timeless Swiss automatics, hand-forged 18K rose gold casing, and legendary sapphire craftsmanship.",
    image:
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&auto=format&fit=crop&q=80",
    ctaText: "View luxury",
    targetId: "lux-01",
  },
  {
    id: 3,
    tagline: "NEON ACCELERATION LABS",
    title: "HyperGlide V2",
    subtitle:
      "Unlocking energy returning carbon plate soles and ultra-durable FlyKnit comfort grids.",
    image:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&auto=format&fit=crop&q=80",
    ctaText: "Shop sneakers",
    targetId: "fash-s01",
  },
];

export const HeroCarousel = ({ onNavigate }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <div className="relative w-full h-[320px] sm:h-[450px] overflow-hidden rounded-premium bg-slate-900 shadow-xl group">
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Overlay dark shade */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.85)_0%,rgba(15,23,42,0.45)_50%,transparent_100%)] z-10" />

          <img
            src={SLIDES[current].image}
            alt={SLIDES[current].title}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* Floating Glass Content Card */}
      <div className="absolute inset-y-0 left-0 z-20 flex items-center px-6 sm:px-12 md:px-16 w-full sm:w-2/3 md:w-1/2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          key={current}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="glass-panel rounded-premium p-6 sm:p-8 border border-white/10 shadow-2xl w-full"
        >
          <span className="text-[10px] font-extrabold tracking-widest text-brand-400 bg-brand-500/10 px-3 py-1.5 rounded-full inline-block mb-3.5 border border-brand-500/20">
            {SLIDES[current].tagline}
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white leading-tight mb-2.5">
            {SLIDES[current].title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6">
            {SLIDES[current].subtitle}
          </p>
          <button
            onClick={() =>
              onNavigate("product-details", { id: SLIDES[current].targetId })
            }
            className="px-5 py-2.5 gradient-orange text-white rounded-xl text-xs font-bold hover:shadow-premium-orange transition-all duration-300 flex items-center gap-2 shadow-lg"
          >
            <span>{SLIDES[current].ctaText}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>

      {/* Carousel Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-25 h-10 w-10 rounded-full bg-slate-900/40 text-white backdrop-blur-sm flex items-center justify-center border border-white/5 opacity-0 group-hover:opacity-100 hover:bg-slate-900/75 hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-25 h-10 w-10 rounded-full bg-slate-900/40 text-white backdrop-blur-sm flex items-center justify-center border border-white/5 opacity-0 group-hover:opacity-100 hover:bg-slate-900/75 hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 right-6 sm:right-12 z-25 flex gap-2">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrent(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              current === index ? "w-8 bg-brand-500" : "w-2.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
