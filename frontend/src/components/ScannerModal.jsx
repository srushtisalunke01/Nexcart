import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, X, Camera, ScanLine } from "lucide-react";
import { PRODUCTS } from "../data/mockData";

export const ScannerModal = ({ isOpen, onClose, onSelectProduct }) => {
  const [scanState, setScanState] = useState("camera-init");
  const [counter, setCounter] = useState(3);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setScanState("camera-init");
      setCounter(3);
    }

    const initTimer = isOpen
      ? setTimeout(() => {
          setScanState("scanning");
        }, 1000)
      : undefined;

    return () => {
      if (initTimer) clearTimeout(initTimer);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (scanState !== "scanning") return;

    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }

    // Scan complete -> match to a random mock product
    setScanState("found");
    const randomProduct = PRODUCTS[Math.floor(Math.random() * 5)]; // Pick from initial rich products
    const navTimer = setTimeout(() => {
      onSelectProduct(randomProduct.id);
      onClose();
    }, 1800);

    return () => clearTimeout(navTimer);
  }, [scanState, counter]);

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
            <QrCode className="h-5 w-5" />
            <span>NFC & Barcode Scanner</span>
          </div>

          {/* Viewfinder Screen */}
          <div className="relative mx-auto mb-6 h-60 w-60 overflow-hidden rounded-2xl bg-slate-950 shadow-inner flex items-center justify-center border-2 border-slate-200 dark:border-slate-800">
            {scanState === "camera-init" && (
              <div className="text-slate-400 flex flex-col items-center gap-2">
                <Camera className="h-10 w-10 animate-pulse text-brand-500" />
                <span className="text-sm">Calibrating scanner lenses...</span>
              </div>
            )}

            {scanState === "scanning" && (
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Simulated Camera Video Stream (Abstract design representation) */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,41,59,0.4)_0%,rgba(2,6,23,0.95)_100%)]" />

                {/* QR Guide box */}
                <div className="relative w-44 h-44 border-2 border-dashed border-brand-400 rounded-lg flex items-center justify-center">
                  {/* Corner styling */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-brand-500 rounded-tl-sm -mt-1 -ml-1" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-brand-500 rounded-tr-sm -mt-1 -mr-1" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-brand-500 rounded-bl-sm -mb-1 -ml-1" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-brand-500 rounded-br-sm -mb-1 -mr-1" />

                  {/* Glowing Scanning QR code icon */}
                  <QrCode className="h-20 w-20 text-slate-700 dark:text-slate-500/50" />

                  {/* Scanner Red line laser */}
                  <motion.div
                    animate={{ y: [-70, 70, -70] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    }}
                    className="absolute w-full h-[3px] bg-red-500 shadow-md shadow-red-500/80"
                  />
                </div>

                <div className="absolute bottom-4 left-0 right-0 text-white font-mono text-xs">
                  ALIGN BARCODE / QR • SECONDS LEFT: {counter}s
                </div>
              </div>
            )}

            {scanState === "found" && (
              <div className="text-green-400 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="rounded-full bg-green-500/20 p-4"
                >
                  <ScanLine className="h-10 w-10 text-green-500" />
                </motion.div>
                <span className="text-sm font-semibold">
                  SKU Code Recognized!
                </span>
                <span className="text-xs text-slate-400">
                  Loading Product details...
                </span>
              </div>
            )}
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 px-4">
            Position any product QR code or item barcode within the alignment
            frame. Scanning triggers automatic catalog retrieval.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
};
