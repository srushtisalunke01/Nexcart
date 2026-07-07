import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Upload, ShieldCheck } from "lucide-react";

const SAMPLE_IMAGES = [
  {
    id: "img-1",
    label: "Orange Running Shoes",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=60",
  },
  {
    id: "img-2",
    label: "Studio Headphones",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=60",
  },
  {
    id: "img-3",
    label: "Chronograph Watch",
    url: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=150&auto=format&fit=crop&q=60",
  },
];

export const ImageSearchModal = ({ isOpen, onClose, onSearch }) => {
  const [stage, setStage] = useState("idle");
  const [selectedImg, setSelectedImg] = useState(null);
  const [analysisText, setAnalysisText] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setStage("idle");
      setSelectedImg(null);
      setAnalysisText("");
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSelectSample = (url, label) => {
    setSelectedImg(url);
    setStage("uploading");

    // Simulate upload progress
    setTimeout(() => {
      setStage("analyzing");
      setAnalysisText("Detecting primary bounding boxes...");
    }, 1200);

    // Simulate object detection
    setTimeout(() => {
      setAnalysisText(`Object identified: "${label}". Confidence: 99.4%`);
    }, 2600);

    // Final Search Execution
    setTimeout(() => {
      setStage("complete");
      onSearch(label);
      onClose();
    }, 3800);
  };

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
            <Sparkles className="h-5 w-5" />
            <span>AI Image Search</span>
          </div>

          {stage === "idle" && (
            <div>
              {/* Drag n Drop Simulation Box */}
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 mb-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 transition-colors">
                <Upload className="h-10 w-10 text-slate-400 mb-3 animate-bounce" />
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Upload an image file
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  PNG, JPG, or WEBP up to 5MB
                </p>
                <button className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-xl text-xs hover:bg-brand-500 hover:shadow-premium-orange transition-all font-semibold">
                  Browse Files
                </button>
              </div>

              {/* Demo Selection */}
              <div className="text-left">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Try these demo templates:
                </h5>
                <div className="grid grid-cols-3 gap-3">
                  {SAMPLE_IMAGES.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => handleSelectSample(img.url, img.label)}
                      className="group relative h-20 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 focus:outline-none"
                    >
                      <img
                        src={img.url}
                        alt={img.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/45 flex items-end p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-white leading-tight font-medium">
                          {img.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(stage === "uploading" ||
            stage === "analyzing" ||
            stage === "complete") && (
            <div className="flex flex-col items-center">
              {/* Preview image with overlay */}
              <div className="relative h-48 w-48 rounded-xl overflow-hidden mb-6 border border-slate-100 dark:border-slate-800 shadow-md">
                <img
                  src={selectedImg || ""}
                  alt="Analysis Preview"
                  className="h-full w-full object-cover"
                />

                {/* Simulated computer vision grid lines */}
                {stage === "analyzing" && (
                  <>
                    <div className="absolute inset-0 border border-brand-500/50 m-6 rounded-lg animate-pulse" />
                    {/* Bounding box corners */}
                    <div className="absolute top-6 left-6 w-3 h-3 border-t-2 border-l-2 border-brand-500" />
                    <div className="absolute top-6 right-6 w-3 h-3 border-t-2 border-r-2 border-brand-500" />
                    <div className="absolute bottom-6 left-6 w-3 h-3 border-b-2 border-l-2 border-brand-500" />
                    <div className="absolute bottom-6 right-6 w-3 h-3 border-b-2 border-r-2 border-brand-500" />

                    {/* Scan line */}
                    <motion.div
                      animate={{ y: [0, 192, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear",
                      }}
                      className="absolute left-0 right-0 h-[2px] bg-brand-500"
                    />
                  </>
                )}

                {stage === "complete" && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <ShieldCheck className="h-12 w-12 text-green-500 animate-bounce" />
                  </div>
                )}
              </div>

              <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">
                {stage === "uploading" && "Uploading file..."}
                {stage === "analyzing" && "Computer Vision Scanning..."}
                {stage === "complete" && "Match Confirmed!"}
              </h4>

              {/* Progress bar */}
              <div className="w-full max-w-xs h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{
                    width:
                      stage === "uploading"
                        ? "35%"
                        : stage === "analyzing"
                          ? "85%"
                          : "100%",
                  }}
                  transition={{ duration: 1.2 }}
                  className="h-full bg-gradient-to-r from-brand-400 to-brand-500"
                />
              </div>

              <p className="text-xs text-slate-400 font-mono italic">
                {analysisText || "Preparing image stream..."}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
};
