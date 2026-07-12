import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  ArrowRight,
  Tag,
  Ticket,
  ShoppingCart,
  Info,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { PRODUCTS } from "../data/mockData";

export const Cart = ({ onNavigate }) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState(null);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.discountPrice * item.quantity,
    0,
  );
  const discountAmount = appliedCoupon
    ? Math.round(subtotal * (appliedCoupon.discountPercent / 100))
    : 0;
  const shippingCharge = subtotal > 150 ? 0 : cart.length > 0 ? 15 : 0;
  const total = subtotal - discountAmount + shippingCharge;
  const totalOriginalPrice = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );
  const totalSavings = totalOriginalPrice - subtotal + discountAmount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput("");
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponFeedback(null);
  };

  const cartRecommendations = PRODUCTS.filter(
    (p) => p.trending && !cart.some((item) => item.product.id === p.id),
  ).slice(0, 3);

  if (cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center space-y-6"
      >
        <div className="h-24 w-24 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500 relative">
          <ShoppingCart className="h-10 w-10" />
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-4 right-4 h-3.5 w-3.5 rounded-full bg-brand-400"
          />
        </div>
        <div>
          <h2 className="text-2xl font-display font-extrabold text-slate-800 dark:text-white">
            Your Shopping Cart is Empty
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-sm">
            Looks like you haven't added anything to your cart yet. Explore our
            luxury futuristic catalogs!
          </p>
        </div>
        <button
          onClick={() => onNavigate("home")}
          className="px-6 py-3 bg-brand-500 text-white rounded-xl text-xs font-bold hover:bg-brand-600 hover:shadow-premium-orange transition-all duration-300 flex items-center gap-2 shadow-lg"
        >
          <span>Start Shopping</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24 pt-4 text-slate-800 dark:text-slate-100 space-y-10"
    >
      <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
        Shopping Cart ({cart.length} unique items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart items list */}
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-4">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={`${item.product.id}-${item.selectedColor?.code}-${item.selectedSize}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 p-4 sm:p-5 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4 group"
                >
                  {/* Product Details thumbnail */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-20 w-20 object-contain bg-slate-50 dark:bg-slate-900 rounded-xl p-2"
                    />

                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-850 dark:text-white text-sm sm:text-base leading-tight truncate max-w-[200px] sm:max-w-[300px]">
                        {item.product.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                        {item.product.brand}
                      </p>

                      {/* Swatch summary labels */}
                      <div className="flex flex-wrap gap-2">
                        {item.selectedColor && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border border-slate-200/40">
                            <span
                              style={{
                                backgroundColor: item.selectedColor.code,
                              }}
                              className="h-2.5 w-2.5 rounded-full border border-white"
                            />
                            {item.selectedColor.name}
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border border-slate-200/40">
                            Size: {item.selectedSize}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Prices */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Quantity selectors */}
                    <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 px-1 py-0.5">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1,
                            item.selectedColor?.code,
                            item.selectedSize,
                          )
                        }
                        className="px-2 py-0.5 text-slate-600 dark:text-slate-400 hover:text-brand-500 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-800 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1,
                            item.selectedColor?.code,
                            item.selectedSize,
                          )
                        }
                        className="px-2 py-0.5 text-slate-600 dark:text-slate-400 hover:text-brand-500 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    {/* Price calculation block */}
                    <div className="text-right">
                      <p className="font-display font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                        ${item.product.discountPrice * item.quantity}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-slate-400">
                          ${item.product.discountPrice} each
                        </p>
                      )}
                    </div>

                    {/* Delete item button */}
                    <button
                      onClick={() =>
                        removeFromCart(
                          item.product.id,
                          item.selectedColor?.code,
                          item.selectedSize,
                        )
                      }
                      className="p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Secure details card */}
          <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800/30 rounded-2xl text-[10px] text-slate-400">
            <Info className="h-4 w-4 text-brand-500" />
            <span>
              Orders over $150 unlock free delivery automatically. We support
              instant, fully-secured biometric payment verification protocols.
            </span>
          </div>
        </div>

        {/* Right Column: Calculations & Coupon application forms */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Entry widget */}
          <div className="rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 p-6 shadow-soft space-y-4">
            <h3 className="font-display font-extrabold text-sm flex items-center gap-1.5 text-slate-800 dark:text-white">
              <Tag className="h-4 w-4 text-brand-500" /> Promo Coupons
            </h3>

            {appliedCoupon ? (
              <div className="bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-brand-500 animate-pulse" />
                  <div>
                    <p className="font-extrabold text-xs text-brand-500">
                      {appliedCoupon.code}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {appliedCoupon.discountPercent}% Discount Applied
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. NEXCART10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-brand-500 dark:text-white"
                />

                <button
                  type="submit"
                  disabled={!couponInput.trim()}
                  className="px-4 py-2 gradient-orange text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50 hover:shadow-premium-orange transition-all"
                >
                  Apply
                </button>
              </form>
            )}

            {couponFeedback && (
              <p
                className={`text-[10px] font-bold ${couponFeedback.success ? "text-green-500" : "text-red-500"}`}
              >
                {couponFeedback.message}
              </p>
            )}
          </div>

          {/* Pricing breakdowns checklist */}
          <div className="rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 p-6 sm:p-8 shadow-soft space-y-6">
            <h3 className="font-display font-extrabold text-base text-slate-850 dark:text-white">
              Order Checklist Summary
            </h3>

            <div className="space-y-3.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex justify-between font-semibold">
                <span>Items Subtotal:</span>
                <span className="text-slate-800 dark:text-white">
                  ${subtotal}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between font-bold text-brand-500">
                  <span>
                    Coupon Discount ({appliedCoupon.discountPercent}%):
                  </span>
                  <span>-${discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between font-semibold">
                <span>Shipping & Delivery:</span>
                <span
                  className={`font-bold ${shippingCharge === 0 ? "text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded" : "text-slate-800 dark:text-white"}`}
                >
                  {shippingCharge === 0 ? "FREE" : `$${shippingCharge}`}
                </span>
              </div>

              {totalSavings > 0 && (
                <div className="flex justify-between font-bold text-green-500">
                  <span>Total Savings:</span>
                  <span>${totalSavings} Saved</span>
                </div>
              )}

              <div className="h-px bg-slate-100 dark:bg-slate-800/80 pt-1" />

              <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white font-display">
                <span>Net Payable:</span>
                <span>${total}</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate("checkout")}
              className="w-full py-4 gradient-orange text-white rounded-xl font-bold shadow-lg shadow-brand-500/20 hover:shadow-premium-orange transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <button
              onClick={() => onNavigate("home")}
              className="w-full py-3.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {/* Recommended additional cart products */}
      {cartRecommendations.length > 0 && (
        <section className="space-y-6 pt-4">
          <h3 className="text-xl font-display font-extrabold text-slate-850 dark:text-white">
            Recommended Add-ons
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {cartRecommendations.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onNavigate("product-details", { id: prod.id })}
                className="cursor-pointer overflow-hidden rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 p-4 shadow-soft hover:shadow-md transition-all flex flex-col justify-between"
              >
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="h-32 w-full object-contain mb-3"
                />
                <h4 className="font-bold text-xs text-slate-850 dark:text-white mb-2 truncate">
                  {prod.name}
                </h4>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                    ${prod.discountPrice}
                  </span>
                  <span className="text-[10px] text-brand-500 font-extrabold">
                    Add to list
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
};
