import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Header } from "./components/Header";
import { CategoryNav } from "./components/CategoryNav";
import { ChatSupport } from "./components/ChatSupport";
import { SplashScreen } from "./pages/SplashScreen";
import { Home } from "./pages/Home";
import { ProductDetails } from "./pages/ProductDetails";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Profile } from "./pages/Profile";
import { Compare } from "./pages/Compare";

// Marketplace pages & components
import { Marketplace } from "./pages/Marketplace";
import { SellerDashboard } from "./pages/SellerDashboard";
import { BusinessDashboard } from "./pages/BusinessDashboard";
import { SellButton } from "./components/SellButton";
import { ChatSystem } from "./components/ChatSystem";

export const App = () => {
  const [currentPage, setCurrentPage] = useState("splash");
  const [pageParams, setPageParams] = useState({});
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  // Simple Hash Router sync
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#home";
      // Parse parameters e.g., #product-details?id=aud-01
      const [path, query] = hash.split("?");
      const params = {};
      if (query) {
        query.split("&").forEach((pair) => {
          const [key, val] = pair.split("=");
          if (key && val) params[key] = decodeURIComponent(val);
        });
      }

      // Route mapping
      if (path === "#home") {
        setCurrentPage("home");
        setPageParams(params);
      } else if (path === "#product-details") {
        setCurrentPage("product-details");
        setPageParams(params);
      } else if (path === "#cart") {
        setCurrentPage("cart");
        setPageParams(params);
      } else if (path === "#checkout") {
        setCurrentPage("checkout");
        setPageParams(params);
      } else if (path === "#profile") {
        setCurrentPage("profile");
        setPageParams(params);
      } else if (path === "#compare") {
        setCurrentPage("compare");
        setPageParams(params);
      } else if (path === "#marketplace") {
        setCurrentPage("marketplace");
        setPageParams(params);
      } else if (path === "#seller-dashboard") {
        setCurrentPage("seller-dashboard");
        setPageParams(params);
      } else if (path === "#business-dashboard") {
        setCurrentPage("business-dashboard");
        setPageParams(params);
      } else {
        // Fallback or Initial splash
        if (currentPage !== "splash") {
          setCurrentPage("home");
        }
      }

      // Scroll to top on navigation
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashChange);
    // Check initial hash on load
    if (window.location.hash) {
      // Delay hash routing if initial page is splash screen
      const delayRouter = setTimeout(() => {
        handleHashChange();
      }, 3000);
      return () => clearTimeout(delayRouter);
    }

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [currentPage]);

  const navigateTo = (page, params = {}) => {
    const query = Object.entries(params)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");
    const queryStr = query ? `?${query}` : "";
    window.location.hash = `#${page}${queryStr}`;
  };

  const handleSelectCategoryFromDrawer = (catId, subCatId) => {
    navigateTo("home", {
      category: catId,
      ...(subCatId ? { subcategory: subCatId } : {}),
    });
  };

  const handleSplashComplete = () => {
    setCurrentPage("home");
    window.location.hash = "#home";
  };

  if (currentPage === "splash") {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-premium-light dark:bg-premium-dark transition-colors duration-300 flex flex-col justify-between">
      {/* Sticky Top Header */}
      <Header
        currentPage={currentPage}
        onNavigate={navigateTo}
        onToggleCategoryMenu={() => setCategoryMenuOpen(!categoryMenuOpen)}
      />

      {/* Slide-out Categories Navigation menu */}
      <CategoryNav
        isOpen={categoryMenuOpen}
        onClose={() => setCategoryMenuOpen(false)}
        onSelectCategory={handleSelectCategoryFromDrawer}
        onNavigate={navigateTo}
      />

      {/* Main Page Swapper viewports container */}
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
        <AnimatePresence mode="wait">
          {currentPage === "home" && (
            <Home
              onNavigate={navigateTo}
              searchFilter={pageParams.search || ""}
              categoryFilter={pageParams.category || ""}
              subcategoryFilter={pageParams.subcategory || ""}
            />
          )}

          {currentPage === "product-details" && (
            <ProductDetails
              productId={pageParams.id || ""}
              onNavigate={navigateTo}
            />
          )}

          {currentPage === "cart" && <Cart onNavigate={navigateTo} />}

          {currentPage === "checkout" && <Checkout onNavigate={navigateTo} />}

          {currentPage === "profile" && (
            <Profile
              onNavigate={navigateTo}
              initialSection={pageParams.section || "dashboard"}
            />
          )}

          {currentPage === "compare" && <Compare onNavigate={navigateTo} />}

          {currentPage === "marketplace" && (
            <Marketplace
              onNavigate={navigateTo}
              searchFilter={pageParams.search || ""}
            />
          )}

          {currentPage === "seller-dashboard" && (
            <SellerDashboard onNavigate={navigateTo} />
          )}

          {currentPage === "business-dashboard" && (
            <BusinessDashboard onNavigate={navigateTo} />
          )}
        </AnimatePresence>
      </main>

      {/* Footer details */}
      <footer className="w-full bg-white dark:bg-premium-cardDark border-t border-slate-100 dark:border-slate-800 py-10 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-b border-slate-105 dark:border-slate-800 pb-8 mb-8">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="NexCart"
                className="h-8 w-8 object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = document.getElementById(
                    "footer-logo-fallback",
                  );
                  if (fallback) fallback.style.display = "block";
                }}
              />

              <div id="footer-logo-fallback" className="hidden">
                <svg
                  className="h-7 w-7 text-brand-500 fill-current"
                  viewBox="0 0 100 100"
                >
                  <rect width="100" height="100" rx="25" fill="#FF6B00" />
                  <path
                    d="M30 35 L45 35 L55 65 L75 65"
                    stroke="white"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <circle cx="48" cy="78" r="7" fill="white" />
                  <circle cx="71" cy="78" r="7" fill="white" />
                </svg>
              </div>
              <span className="text-xl font-display font-extrabold">
                <span className="text-slate-800 dark:text-white">Nex</span>
                <span className="text-cyber-gold text-glow-gold">Cart</span>
              </span>
            </div>
            <p className="text-xs text-slate-450 dark:text-slate-500">
              Premium futuristic retail shopping layout. Built with React and
              Tailwind.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-450 dark:text-slate-500">
            <p>
              © 2026 NexCart Inc. Designed for demo presentations and mentor
              showcases.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigateTo("home")}
                className="hover:text-brand-500"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => navigateTo("home")}
                className="hover:text-brand-500"
              >
                Terms of Use
              </button>
              <button
                onClick={() => navigateTo("profile", { section: "dashboard" })}
                className="hover:text-brand-500"
              >
                Customer Support
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat Assistant */}
      <ChatSupport />

      {/* Floating Sell Button */}
      {currentPage !== "checkout" && <SellButton />}

      {/* Chat System drawers */}
      <ChatSystem />
    </div>
  );
};

export default App;
