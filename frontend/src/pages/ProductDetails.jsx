import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingBag,
  Eye,
  Heart,
  Share2,
  ShieldCheck,
  MapPin,
  RotateCcw,
  Check,
  ChevronRight,
  Scale,
} from "lucide-react";
import { PRODUCTS } from "../data/mockData";
import { useCart } from "../context/CartContext";

export const ProductDetails = ({ productId, onNavigate }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToRecentlyViewed,
    addToCompare,
    compareList,
  } = useCart();
  // Find product
  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];

  const [activeImg, setActiveImg] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specs");
  const [addedMessage, setAddedMessage] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // 360 Preview Mode States
  const [is360Mode, setIs360Mode] = useState(false);
  const [spinIndex, setSpinIndex] = useState(0);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  // Zoom magnifier states
  const [zoomCoords, setZoomCoords] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  // Frequently Bought Together Bundle state
  const [bundleChecked, setBundleChecked] = useState([true, true, true]); // Primary, bundle 1, bundle 2
  const [bundleProducts, setBundleProducts] = useState([]);

  // Reset page state on product swap
  useEffect(() => {
    setActiveImg(product.images[0]);
    setSelectedColor(product.colors[0]);
    setSelectedSize(product.sizes?.[0] || null);
    setQuantity(1);
    setIs360Mode(false);
    setSpinIndex(0);
    setAddedMessage(false);
    addToRecentlyViewed(product);

    // Seed bundle recommendations
    const siblings = PRODUCTS.filter(
      (p) => p.id !== product.id && p.parentCategory === product.parentCategory,
    ).slice(0, 2);
    setBundleProducts(siblings);
  }, [product]);

  // Zoom positioning calculation
  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };

  // 360 Spin Drag handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    dragStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseMove360 = (e) => {
    if (!isDragging.current || dragStartX.current === null) return;
    const diff = e.clientX - dragStartX.current;
    // Rotate 1 index per 15px drag distance
    const sensitivity = 15;
    const indexShift = Math.floor(diff / sensitivity);
    if (indexShift !== 0) {
      const len = product.threeSixtyImages.length;
      setSpinIndex((prev) => (prev - indexShift + len) % len);
      dragStartX.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize || undefined);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize || undefined);
    onNavigate("cart");
  };

  const handleCompare = () => {
    const success = addToCompare(product);
    if (success) {
      onNavigate("compare");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Bundle calculations
  const bundleSubtotal =
    (bundleChecked[0] ? product.discountPrice : 0) +
    (bundleChecked[1] && bundleProducts[0]
      ? bundleProducts[0].discountPrice
      : 0) +
    (bundleChecked[2] && bundleProducts[1]
      ? bundleProducts[1].discountPrice
      : 0);

  const bundleSavings =
    (bundleChecked[0] ? product.price - product.discountPrice : 0) +
    (bundleChecked[1] && bundleProducts[0]
      ? bundleProducts[0].price - bundleProducts[0].discountPrice
      : 0) +
    (bundleChecked[2] && bundleProducts[1]
      ? bundleProducts[1].price - bundleProducts[1].discountPrice
      : 0);

  const handleAddBundleToCart = () => {
    if (bundleChecked[0]) addToCart(product, 1);
    if (bundleChecked[1] && bundleProducts[0]) addToCart(bundleProducts[0], 1);
    if (bundleChecked[2] && bundleProducts[1]) addToCart(bundleProducts[1], 1);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  const isFavorited = isInWishlist(product.id);
  const similarProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category,
  ).slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="pb-24 pt-4 text-slate-800 dark:text-slate-100 space-y-12"
    >
      {/* breadcrumb path */}
      <div className="flex items-center gap-1 text-xs text-slate-400 font-bold uppercase tracking-wider">
        <button
          onClick={() => onNavigate("home")}
          className="hover:text-brand-500"
        >
          Home
        </button>
        <ChevronRight className="h-3 w-3" />
        <button
          onClick={() =>
            onNavigate("home", { category: product.parentCategory })
          }
          className="hover:text-brand-500"
        >
          {product.parentCategory}
        </button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-600 dark:text-slate-300 font-extrabold max-w-[150px] truncate">
          {product.name}
        </span>
      </div>

      {/* Main product structure layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Gallery & interactive panels */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 p-6 shadow-soft flex items-center justify-center min-h-[380px] sm:min-h-[480px]">
            {/* Badges overlay */}
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
              {product.discount > 0 && (
                <span className="gradient-orange text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md shadow-brand-500/20 animate-pulse">
                  {product.discount}% OFF DAILY DEAL
                </span>
              )}
              {product.stock < 5 && (
                <span className="bg-red-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-md">
                  CRITICAL LOW STOCK
                </span>
              )}
            </div>

            {/* Media Interactive Mode selection */}
            <div className="absolute bottom-6 left-6 z-10 flex gap-2">
              <button
                onClick={() => setIs360Mode(false)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 ${
                  !is360Mode
                    ? "bg-brand-500 text-white shadow-brand-500/10"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                }`}
              >
                <Eye className="h-3.5 w-3.5" /> 2D Gallery
              </button>
              <button
                onClick={() => setIs360Mode(true)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 ${
                  is360Mode
                    ? "bg-brand-500 text-white shadow-brand-500/10"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                }`}
              >
                <RotateCcw className="h-3.5 w-3.5" /> 360° View
              </button>
            </div>

            {/* Display Visual Area */}
            {!is360Mode ? (
              /* Magnifier zoom viewer frame */
              <div
                className="relative overflow-hidden cursor-crosshair max-w-full max-h-[380px] sm:max-h-[440px] flex items-center justify-center"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
              >
                <img
                  src={activeImg}
                  alt={product.name}
                  className="max-h-[360px] sm:max-h-[420px] object-contain drop-shadow-lg"
                />

                {/* Zoom Box overlay */}
                {showZoom && (
                  <div
                    style={{
                      backgroundImage: `url(${activeImg})`,
                      backgroundPosition: `${zoomCoords.x}% ${zoomCoords.y}%`,
                      backgroundSize: "220%",
                    }}
                    className="absolute inset-0 bg-no-repeat pointer-events-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                )}
              </div>
            ) : (
              /* 360° Drag spin preview screen */
              <div
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove360}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="cursor-grab active:cursor-grabbing w-full h-[360px] flex flex-col justify-center items-center select-none"
              >
                <img
                  src={product.threeSixtyImages[spinIndex]}
                  alt={`${product.name} spin ${spinIndex}`}
                  className="max-h-[360px] object-contain drop-shadow-lg"
                />

                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-4">
                  ← DRAG HORIZONTALLY TO SPIN MODEL →
                </span>
              </div>
            )}
          </div>

          {/* Image Thumbnails Panel */}
          {!is360Mode && (
            <div className="flex gap-4 justify-center">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setActiveImg(img)}
                  onClick={() => setActiveImg(img)}
                  className={`h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-white dark:bg-premium-cardDark border-2 p-1.5 shadow-sm transition-all hover:scale-105 ${
                    activeImg === img
                      ? "border-brand-500 scale-105"
                      : "border-slate-100 dark:border-slate-800"
                  }`}
                >
                  <img
                    src={img}
                    alt="thumbnail"
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Checkout choices and info summaries */}
        <div className="lg:col-span-5 bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 rounded-premium p-8 shadow-soft flex flex-col justify-between self-stretch">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">
                {product.brand}
              </span>

              {/* Compare scale utility trigger */}
              <button
                onClick={handleCompare}
                className={`text-xs font-semibold flex items-center gap-1 hover:text-brand-500 ${
                  compareList.some((p) => p.id === product.id)
                    ? "text-brand-500"
                    : "text-slate-400"
                }`}
              >
                <Scale className="h-4 w-4" /> Compare specs
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white mt-1 mb-2">
              {product.name}
            </h1>
            <p className="italic text-brand-500/80 dark:text-brand-400 text-sm font-semibold mb-4">
              {product.tagline}
            </p>

            {/* Ratings Summary */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 fill-current ${
                      i < Math.floor(product.rating)
                        ? "text-amber-400"
                        : "text-slate-300 dark:text-slate-700"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                {product.rating} ({product.reviewsCount} verified reviews)
              </span>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/30">
              <span className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                ₹{product.discountPrice}
              </span>
              {product.price > product.discountPrice && (
                <span className="text-lg text-slate-400 line-through">
                  ₹{product.price}
                </span>
              )}
              {product.price > product.discountPrice && (
                <span className="text-xs font-extrabold text-brand-500 ml-auto bg-brand-50 dark:bg-brand-500/10 px-3 py-1 rounded-full border border-brand-100 dark:border-brand-500/15">
                  SAVE ₹{product.price - product.discountPrice}
                </span>
              )}
            </div>

            {/* Color Swatch Selection */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">
                Color Options:{" "}
                <span className="text-slate-700 dark:text-slate-200">
                  {selectedColor.name}
                </span>
              </h4>
              <div className="flex gap-3">
                {product.colors.map((col) => (
                  <button
                    key={col.code}
                    onClick={() => setSelectedColor(col)}
                    style={{ backgroundColor: col.code }}
                    className={`h-9 w-9 rounded-full border-2 transition-all ${
                      selectedColor.code === col.code
                        ? "border-brand-500 scale-110 shadow-md shadow-brand-500/10"
                        : "border-white dark:border-slate-800 hover:scale-105"
                    }`}
                    title={col.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Swatch Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">
                  Select Size:{" "}
                  <span className="text-slate-700 dark:text-slate-200">
                    {selectedSize}
                  </span>
                </h4>
                <div className="flex gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-[48px] h-11 px-4 rounded-xl border font-bold text-xs transition-all ${
                        selectedSize === sz
                          ? "bg-brand-500 border-brand-500 text-white shadow-md"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping & Delivery estimations */}
            <div className="space-y-3 mb-8 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 text-xs">
                <MapPin className="h-4.5 w-4.5 text-brand-500" />
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Delivery Location:
                  </span>
                  <p className="text-slate-400">
                    Arriving by{" "}
                    <span className="text-slate-700 dark:text-slate-200 font-bold">
                      {product.estimatedDelivery}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <ShieldCheck className="h-4.5 w-4.5 text-green-500" />
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Warranty & Guarantee:
                  </span>
                  <p className="text-slate-400">
                    {product.returnPolicy} • 1 Year Official coverage
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Quantity:
              </span>
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 px-1 py-1">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-3.5 py-1 text-slate-600 dark:text-slate-400 hover:text-brand-500 font-extrabold text-sm"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-bold text-slate-800 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="px-3.5 py-1 text-slate-600 dark:text-slate-400 hover:text-brand-500 font-extrabold text-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3.5">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                  addedMessage
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-brand-500 text-white hover:bg-brand-600 hover:shadow-premium-orange shadow-lg shadow-brand-500/10"
                }`}
              >
                {addedMessage ? (
                  <>
                    <ShieldCheck className="h-5 w-5 animate-pulse" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyLink}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-brand-500"
                title="Copy Share Link"
              >
                {copiedLink ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Share2 className="h-5 w-5" />
                )}
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-950 text-white rounded-xl font-bold hover:bg-slate-855 dark:hover:bg-slate-50 transition-all duration-300"
            >
              Order Instantly (Buy Now)
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`w-full py-3.5 rounded-xl border font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                isFavorited
                  ? "border-red-100 bg-red-50 text-red-500 dark:bg-red-500/10 dark:border-red-500/20"
                  : "border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400"
              }`}
            >
              <Heart
                className={`h-4.5 w-4.5 ${isFavorited ? "fill-current" : ""}`}
              />
              <span>
                {isFavorited
                  ? "Saved in Wishlist"
                  : "Add to Wishlist Favorites"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs detailed specification segment */}
      <div className="rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 shadow-soft overflow-hidden">
        <div className="flex border-b border-slate-100 dark:border-slate-800">
          {["specs", "features", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 font-display font-extrabold text-sm tracking-wide transition-all border-b-2 uppercase ${
                activeTab === tab
                  ? "border-brand-500 text-brand-500"
                  : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              {tab === "specs" && "Technical Specifications"}
              {tab === "features" && "Product Features"}
              {tab === "reviews" &&
                `Verified Reviews (${product.reviews?.length || 0})`}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === "specs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div
                  key={key}
                  className="flex justify-between py-3 border-b border-slate-50 dark:border-slate-900 text-sm"
                >
                  <span className="font-bold text-slate-400 dark:text-slate-500">
                    {key}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "features" && (
            <ul className="space-y-4">
              {product.features.map((feat, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm font-semibold"
                >
                  <span className="h-5 w-5 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500 mt-0.5">
                    ✓
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {feat}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {(product.reviews || []).map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-50 dark:border-slate-800/40 rounded-2xl"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                        {rev.userName}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {rev.date} •{" "}
                        {rev.verified ? "Verified Purchase" : "Product Review"}
                      </span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 fill-current ${i < rev.rating ? "text-amber-400" : "text-slate-200 dark:text-slate-800"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Frequently Bought Together Bundle */}
      {bundleProducts.length > 0 && (
        <section className="space-y-6">
          <h3 className="text-xl font-display font-extrabold text-slate-850 dark:text-white">
            Frequently Bought Together
          </h3>
          <div className="rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 p-6 sm:p-8 shadow-soft flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {/* Product 1 */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={bundleChecked[0]}
                  onChange={() =>
                    setBundleChecked((prev) => [!prev[0], prev[1], prev[2]])
                  }
                  className="accent-brand-500 h-4 w-4 rounded"
                />

                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-16 w-16 object-contain bg-slate-50 rounded-xl p-2"
                />
                <div>
                  <h4 className="font-bold text-xs truncate max-w-[120px]">
                    {product.name}
                  </h4>
                  <p className="text-[11px] font-extrabold text-slate-500">
                    ₹{product.discountPrice}
                  </p>
                </div>
              </div>

              {/* Plus icon */}
              <span className="text-slate-400 font-extrabold text-lg hidden sm:inline">
                +
              </span>

              {/* Product 2 */}
              {bundleProducts[0] && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={bundleChecked[1]}
                    onChange={() =>
                      setBundleChecked((prev) => [prev[0], !prev[1], prev[2]])
                    }
                    className="accent-brand-500 h-4 w-4 rounded"
                  />

                  <img
                    src={bundleProducts[0].images[0]}
                    alt={bundleProducts[0].name}
                    className="h-16 w-16 object-contain bg-slate-50 rounded-xl p-2"
                  />
                  <div>
                    <h4 className="font-bold text-xs truncate max-w-[120px]">
                      {bundleProducts[0].name}
                    </h4>
                    <p className="text-[11px] font-extrabold text-slate-500">
                      ₹{bundleProducts[0].discountPrice}
                    </p>
                  </div>
                </div>
              )}

              {/* Plus icon */}
              {bundleProducts[1] && (
                <span className="text-slate-400 font-extrabold text-lg hidden sm:inline">
                  +
                </span>
              )}

              {/* Product 3 */}
              {bundleProducts[1] && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={bundleChecked[2]}
                    onChange={() =>
                      setBundleChecked((prev) => [prev[0], prev[1], !prev[2]])
                    }
                    className="accent-brand-500 h-4 w-4 rounded"
                  />

                  <img
                    src={bundleProducts[1].images[0]}
                    alt={bundleProducts[1].name}
                    className="h-16 w-16 object-contain bg-slate-50 rounded-xl p-2"
                  />
                  <div>
                    <h4 className="font-bold text-xs truncate max-w-[120px]">
                      {bundleProducts[1].name}
                    </h4>
                    <p className="text-[11px] font-extrabold text-slate-500">
                      ₹{bundleProducts[1].discountPrice}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bundle Checkout details */}
            <div className="w-full md:w-auto p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/30 flex flex-col sm:flex-row md:flex-col justify-between items-center sm:items-end md:items-start gap-4">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                  Bundle Price
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-display font-extrabold text-slate-800 dark:text-white">
                    ₹{bundleSubtotal}
                  </span>
                  {bundleSavings > 0 && (
                    <span className="text-xs font-bold text-brand-500 bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded">
                      Saved ₹{bundleSavings}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleAddBundleToCart}
                disabled={!bundleChecked.some(Boolean)}
                className="px-5 py-3 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-600 disabled:opacity-50 transition-colors"
              >
                Add 3 Items to Cart
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Similar products catalog showcase */}
      {similarProducts.length > 0 && (
        <section className="space-y-6">
          <h3 className="text-xl font-display font-extrabold text-slate-850 dark:text-white">
            Similar Products You May Like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => onNavigate("product-details", { id: p.id })}
                className="cursor-pointer overflow-hidden rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 p-4 shadow-soft hover:shadow-md transition-all flex flex-col justify-between"
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="h-40 w-full object-contain mb-3"
                />
                <h4 className="font-bold text-xs text-slate-800 dark:text-white mb-2 leading-tight line-clamp-2">
                  {p.name}
                </h4>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                    ₹{p.discountPrice}
                  </span>
                  {p.discount > 0 && (
                    <span className="text-[10px] text-brand-500 font-extrabold">
                      {p.discount}% OFF
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky bottom buy-bar */}
      <div className="fixed bottom-0 left-0 right-0 z-35 bg-white/90 dark:bg-premium-cardDark/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800/80 p-3 flex gap-3 sm:hidden shadow-lg">
        <button
          onClick={handleAddToCart}
          className="flex-1 py-3 bg-slate-900 dark:bg-white dark:text-slate-950 text-white text-xs font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>{addedMessage ? "Added!" : "Add Cart"}</span>
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 py-3 bg-brand-500 text-white text-xs font-bold rounded-xl active:scale-95 transition-all"
        >
          Buy Now
        </button>
      </div>
    </motion.div>
  );
};
