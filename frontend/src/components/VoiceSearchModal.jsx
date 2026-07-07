import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, Sparkles, Volume2 } from "lucide-react";

export const VoiceSearchModal = ({ isOpen, onClose, onSearch }) => {
  const [status, setStatus] = useState("idle");
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setStatus("idle");
      setTranscript("");
      return;
    }

    setStatus("listening");
    // Step 1: Simulating listening (speech patterns)
    const transcriptTimer = setTimeout(() => {
      setTranscript('"aeropulse anc pro noise cancelling headphones"');
      setStatus("processing");
    }, 2500);

    // Step 2: Simulating parsing search term
    const searchTimer = setTimeout(() => {
      setStatus("done");
    }, 4200);

    // Step 3: Trigger search & close
    const finalTimer = setTimeout(() => {
      onSearch("AeroPulse ANC Pro");
      onClose();
    }, 5000);

    return () => {
      clearTimeout(transcriptTimer);
      clearTimeout(searchTimer);
      clearTimeout(finalTimer);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-premium bg-white p-8 text-center shadow-2xl dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/50"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Heading */}
          <div className="flex items-center justify-center gap-2 text-brand-500 font-display font-medium text-lg mb-6">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span>AI Voice Assistant</span>
          </div>

          {/* Glowing Mic Circle */}
          <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center">
            {/* Pulsing ring 1 */}
            {status === "listening" && (
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full bg-brand-500/20"
              />
            )}
            {/* Pulsing ring 2 */}
            {status === "listening" && (
              <motion.div
                animate={{ scale: [1, 2, 1], opacity: [0.25, 0, 0.25] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute inset-0 rounded-full bg-brand-400/10"
              />
            )}

            <div
              className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br transition-all duration-500 shadow-lg ${
                status === "processing"
                  ? "from-indigo-500 to-purple-600 shadow-indigo-500/20"
                  : status === "done"
                    ? "from-green-500 to-emerald-600 shadow-green-500/20"
                    : "from-brand-500 to-brand-600 shadow-brand-500/25"
              }`}
            >
              {status === "processing" ? (
                <Volume2 className="h-10 w-10 text-white animate-bounce" />
              ) : (
                <Mic className="h-10 w-10 text-white" />
              )}
            </div>
          </div>

          {/* Status Label */}
          <h3 className="text-xl font-display font-bold text-slate-800 dark:text-white mb-2">
            {status === "listening" && "Listening carefully..."}
            {status === "processing" && "Analyzing audio..."}
            {status === "done" && "Search term identified!"}
          </h3>

          {/* Real-time speech transcription */}
          <div className="min-h-12 flex items-center justify-center">
            <p className="italic text-slate-500 dark:text-slate-400 text-base max-w-xs transition-all duration-300">
              {transcript || "Try saying 'AeroPulse ANC Pro Headphones'"}
            </p>
          </div>

          {/* Audio Visualizer Waves */}
          {status === "listening" && (
            <div className="mt-6 flex justify-center gap-1.5 h-6">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [8, Math.random() * 24 + 8, 8] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6 + i * 0.1,
                    ease: "easeInOut",
                  }}
                  className="w-1 rounded-full bg-brand-500"
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
};
