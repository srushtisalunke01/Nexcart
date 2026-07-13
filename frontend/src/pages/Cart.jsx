import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore.js';
import { 
  Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, AlertTriangle, Info, ArrowLeft
} from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    isLoading, 
    fetchCart, 
    updateQuantity, 
    removeFromCart, 
    coupon, 
    applyCouponCode, 
    removeCoupon,
    getCartSubtotal,
    getDiscountAmount,
    getCartTotal,
    error: couponError
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const result = await applyCouponCode(couponCode);
    if (result.success) {
      setSuccessMsg('Coupon successfully activated!');
      setCouponCode('');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleQtyChange = async (productId, quantity, color, size) => {
    if (quantity < 1) return;
    const result = await updateQuantity(productId, quantity, color, size);
    if (!result.success) {
      alert(result.message);
    }
  };

  const getActiveItemPrice = (item) => {
    const product = item.product;
    let price = product.price;

    if (product.isWholesale && product.bulkPricing && product.bulkPricing.length > 0) {
      const sortedTiers = [...product.bulkPricing].sort((a, b) => b.minQuantity - a.minQuantity);
      const match = sortedTiers.find(tier => item.quantity >= tier.minQuantity);
      if (match) price = match.price;
    } else if (!product.isWholesale && product.discount > 0) {
      price = Math.round(price * (1 - product.discount / 100));
    }
    return price;
  };

  // Check if any wholesale items violate MOQ
  const isMoqViolated = cartItems.some(
    item => item.product.isWholesale && item.quantity < item.product.minOrderQuantity
  );

  const subtotal = getCartSubtotal();
  const discount = getDiscountAmount();
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.round((subtotal - discount) * 0.08);
  const total = getCartTotal();

  if (isLoading && cartItems.length === 0) {
    return (
      <div class="min-h-[70vh] flex items-center justify-center">
        <div class="animate-pulse text-luxury-gold font-bold uppercase tracking-widest text-xs">Accessing vault...</div>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="flex items-center justify-between mb-10 pb-6 border-b border-luxury-gray-medium/50">
        <div>
          <span class="text-xs text-luxury-gold font-bold tracking-widest uppercase block mb-1">Acquisitions Basket</span>
          <h1 class="font-serif text-3.5xl font-bold text-luxury-blue-dark">Your Cart</h1>
        </div>
        <Link to="/shop" class="inline-flex items-center gap-1.5 text-xs font-bold text-luxury-blue hover:text-luxury-blue-light transition-colors">
          <ArrowLeft className="w-4 h-4" /> Continue Exploration
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div class="text-center py-20 bg-white/40 border border-white/20 rounded-2xl p-10 max-w-md mx-auto space-y-4 shadow-sm">
          <ShoppingBag className="w-12 h-12 text-luxury-gold mx-auto animate-luxury-float" />
          <h3 class="font-serif text-xl font-bold text-luxury-blue-dark">Vault is Empty</h3>
          <p class="text-xs text-luxury-gray-dark">
            Browse our curated collections to add luxury assets to your order sheet.
          </p>
          <div class="pt-4">
            <Link to="/shop" class="btn-primary text-xs uppercase tracking-widest inline-block">
              Browse Catalog
            </Link>
          </div>
        </div>
      ) : (
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items list column */}
          <div class="lg:col-span-2 space-y-6">
            {cartItems.map((item, idx) => {
              const product = item.product;
              const unitPrice = getActiveItemPrice(item);
              const violatesMoq = product.isWholesale && item.quantity < product.minOrderQuantity;

              return (
                <div 
                  key={`${product._id}-${item.color}-${item.size}-${idx}`}
                  class={`glass-card-light p-6 rounded-2xl border ${violatesMoq ? 'border-red-300 bg-red-50/20' : 'border-white/60'} shadow-sm flex flex-col md:flex-row gap-6 relative`}
                >
                  {/* Thumbnail */}
                  <div class="h-28 w-28 rounded-xl overflow-hidden bg-luxury-gray-light flex-shrink-0">
                    <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=200'} alt={product.name} class="w-full h-full object-cover" />
                  </div>

                  {/* Item Description */}
                  <div class="flex-grow flex flex-col justify-between space-y-2">
                    <div>
                      <div class="flex justify-between items-start gap-4">
                        <div>
                          <span class="text-[9px] font-bold text-luxury-gold uppercase tracking-widest block mb-0.5">{product.brand}</span>
                          <Link to={`/product/${product._id}`} class="font-serif text-base font-bold text-luxury-blue-dark hover:text-luxury-gold transition-colors line-clamp-1">{product.name}</Link>
                        </div>
                        <button 
                          onClick={() => removeFromCart(product._id, item.color, item.size)}
                          class="text-luxury-gray hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Colors/Sizes details */}
                      <div class="flex flex-wrap gap-4 text-[10px] font-bold text-luxury-gray-dark mt-1">
                        {item.color && (
                          <span class="bg-luxury-gray-light px-2.5 py-0.5 rounded-full border border-luxury-gray-medium">Color: {item.color}</span>
                        )}
                        {item.size && (
                          <span class="bg-luxury-gray-light px-2.5 py-0.5 rounded-full border border-luxury-gray-medium">Size: {item.size}</span>
                        )}
                        <span class="bg-luxury-gold/10 text-luxury-gold-dark px-2.5 py-0.5 rounded-full border border-luxury-gold/20">
                          {product.isWholesale ? 'B2B Wholesale' : `Used Condition: ${product.condition || 'New'}`}
                        </span>
                      </div>
                    </div>

                    {/* Quantity selectors and price details */}
                    <div class="flex items-center justify-between pt-2">
                      <div class="flex items-center border border-luxury-gray-medium/80 rounded-lg overflow-hidden bg-white/60">
                        <button 
                          onClick={() => handleQtyChange(product._id, item.quantity - 1, item.color, item.size)}
                          class="px-3 py-1.5 hover:bg-luxury-gray-medium text-xs font-bold text-luxury-blue-dark transition-colors"
                        >
                          -
                        </button>
                        <span class="px-4 text-xs font-bold text-luxury-blue-dark">{item.quantity}</span>
                        <button 
                          onClick={() => handleQtyChange(product._id, item.quantity + 1, item.color, item.size)}
                          class="px-3 py-1.5 hover:bg-luxury-gray-medium text-xs font-bold text-luxury-blue-dark transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <div class="text-right">
                        <div class="text-xs text-luxury-gray font-medium">Unit: ${unitPrice}</div>
                        <div class="text-base font-bold text-luxury-blue-dark">${unitPrice * item.quantity}</div>
                      </div>
                    </div>

                    {/* MOQ constraint alert banner */}
                    {violatesMoq && (
                      <div class="flex items-center gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 p-2 rounded-lg border border-red-200 mt-2">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                        Wholesale Item requires a Minimum Order Quantity (MOQ) of {product.minOrderQuantity} units. Please adjust quantity.
                      </div>
                    )}

                    {/* Wholesales bulk pricing notification details */}
                    {product.isWholesale && product.bulkPricing && product.bulkPricing.length > 0 && (
                      <div class="flex items-center gap-1.5 text-[9px] font-bold text-luxury-blue bg-luxury-blue/5 p-2 rounded-lg border border-luxury-blue/10 mt-2">
                        <Info className="w-3.5 h-3.5 flex-shrink-0" />
                        Volume Rates Active: {product.bulkPricing.map(tier => `${tier.minQuantity}+ units: $${tier.price}`).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing Summary column */}
          <div class="space-y-6">
            <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-md space-y-6">
              <h3 class="font-serif text-lg font-bold text-luxury-blue-dark pb-4 border-b border-luxury-gray-medium/50">Summary Valuation</h3>
              
              <div class="space-y-3 text-xs font-semibold text-luxury-blue-dark">
                <div class="flex justify-between">
                  <span class="text-luxury-gray-dark">Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                {discount > 0 && (
                  <div class="flex justify-between text-luxury-gold-dark">
                    <span>Discount Code Applied</span>
                    <span>-${discount}</span>
                  </div>
                )}
                <div class="flex justify-between">
                  <span class="text-luxury-gray-dark">Secure Transport Fee</span>
                  <span>{shipping === 0 ? 'Free Shipping' : `$${shipping}`}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-luxury-gray-dark">Escrow Duties / VAT (8%)</span>
                  <span>${tax}</span>
                </div>
                <div class="pt-4 border-t border-luxury-gray-medium/50 flex justify-between text-base font-bold text-luxury-blue-dark">
                  <span>Total Cost</span>
                  <span class="text-luxury-gold-dark font-serif">${total}</span>
                </div>
              </div>

              {/* Coupon inputs */}
              <div class="pt-4 border-t border-luxury-gray-medium/50 space-y-3">
                {coupon ? (
                  <div class="flex items-center justify-between p-3 bg-luxury-gold/10 rounded-xl border border-luxury-gold/30 text-xs">
                    <div class="font-bold text-luxury-gold-dark flex items-center gap-1.5">
                      <Tag className="w-4 h-4" /> CODE: {coupon.code} ({coupon.discountType === 'Percentage' ? `${coupon.discountValue}% Off` : `$${coupon.discountValue} Off`})
                    </div>
                    <button onClick={removeCoupon} class="text-[10px] font-bold text-red-600 hover:text-red-700 uppercase tracking-wider">Remove</button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} class="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="ENTER COUPON CODE" 
                      class="luxury-input py-2.5 text-xs font-bold uppercase tracking-wider"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button type="submit" class="btn-primary text-[10px] py-2.5 px-4 bg-luxury-blue uppercase tracking-widest flex-shrink-0">Apply</button>
                  </form>
                )}

                {successMsg && <span class="block text-[10px] font-bold text-green-600 mt-1">✓ {successMsg}</span>}
                {couponError && <span class="block text-[10px] font-bold text-red-600 mt-1">⚠️ {couponError}</span>}
              </div>

              {/* Action checkout button */}
              <div class="pt-2">
                <button 
                  onClick={() => navigate('/checkout')}
                  disabled={isMoqViolated}
                  class="btn-primary w-full py-3.5 mt-2 flex items-center justify-center gap-2 text-xs uppercase tracking-widest bg-luxury-blue disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                >
                  Secure Checkout <ArrowRight className="w-4.5 h-4.5" />
                </button>
                {isMoqViolated && (
                  <span class="block text-[10px] font-bold text-center text-red-600 mt-2">
                    ⚠️ Review minimum order quantities (MOQ) before proceeding.
                  </span>
                )}
              </div>
            </div>

            {/* Escrow note banner */}
            <div class="p-5 rounded-2xl bg-luxury-blue-deep text-white border border-luxury-gold/20 flex gap-3 shadow-md">
              <ShieldCheck className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-0.5" />
              <div>
                <h4 class="font-serif text-sm font-bold text-luxury-gold leading-tight">NEXUS Escrow SafeGuard</h4>
                <p class="text-[10px] text-luxury-gray mt-1 leading-relaxed">
                  Every order is securely routed through our multi-vendor vault contracts. Funds remain held securely until items are validated and accepted by the client.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
