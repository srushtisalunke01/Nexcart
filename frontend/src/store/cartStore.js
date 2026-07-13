import { create } from 'zustand';
import api from '../services/api.js';

export const useCartStore = create((set, get) => ({
  cartItems: [],
  coupon: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/orders/cart');
      if (response.data.success) {
        set({ cartItems: response.data.cart.items, isLoading: false });
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      set({ isLoading: false });
    }
  },

  syncCartWithBackend: async (newItems) => {
    try {
      const itemsPayload = newItems.map(item => ({
        product: item.product._id || item.product,
        quantity: item.quantity,
        color: item.color,
        size: item.size
      }));
      await api.post('/orders/cart', { items: itemsPayload });
    } catch (err) {
      console.error('Failed to sync cart:', err);
    }
  },

  addToCart: async (product, quantity = 1, color = '', size = '') => {
    const currentItems = [...get().cartItems];
    
    // Check MOQ constraint for B2B wholesale
    if (product.isWholesale && quantity < product.minOrderQuantity) {
      return { success: false, message: `Minimum order quantity is ${product.minOrderQuantity} units.` };
    }

    const existingIndex = currentItems.findIndex(
      item => item.product._id === product._id && item.color === color && item.size === size
    );

    if (existingIndex > -1) {
      currentItems[existingIndex].quantity += quantity;
    } else {
      currentItems.push({
        product,
        quantity,
        color,
        size,
      });
    }

    set({ cartItems: currentItems });
    await get().syncCartWithBackend(currentItems);
    return { success: true };
  },

  updateQuantity: async (productId, quantity, color = '', size = '') => {
    const currentItems = [...get().cartItems];
    const index = currentItems.findIndex(
      item => item.product._id === productId && item.color === color && item.size === size
    );

    if (index > -1) {
      const product = currentItems[index].product;
      // Check MOQ constraints for B2B wholesale
      if (product.isWholesale && quantity < product.minOrderQuantity) {
        return { success: false, message: `MOQ is ${product.minOrderQuantity} units. Cannot reduce quantity below this.` };
      }

      currentItems[index].quantity = quantity;
      set({ cartItems: currentItems });
      await get().syncCartWithBackend(currentItems);
      return { success: true };
    }
    return { success: false, message: 'Item not found in cart.' };
  },

  removeFromCart: async (productId, color = '', size = '') => {
    const filtered = get().cartItems.filter(
      item => !(item.product._id === productId && item.color === color && item.size === size)
    );
    set({ cartItems: filtered });
    await get().syncCartWithBackend(filtered);
  },

  applyCouponCode: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const purchaseAmount = get().getCartSubtotal();
      const response = await api.post('/coupons/validate', { code, purchaseAmount });
      if (response.data.success) {
        set({
          coupon: {
            code: code.toUpperCase(),
            discountType: response.data.discountType,
            discountValue: response.data.discountValue,
          },
          isLoading: false,
        });
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Coupon verification failed';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  removeCoupon: () => set({ coupon: null }),

  getCartSubtotal: () => {
    return get().cartItems.reduce((total, item) => {
      const product = item.product;
      let price = product.price;

      // Handle wholesale bulk tiered rates calculation
      if (product.isWholesale && product.bulkPricing && product.bulkPricing.length > 0) {
        const sortedTiers = [...product.bulkPricing].sort((a, b) => b.minQuantity - a.minQuantity);
        const match = sortedTiers.find(tier => item.quantity >= tier.minQuantity);
        if (match) price = match.price;
      } else if (!product.isWholesale && product.discount > 0) {
        price = Math.round(price * (1 - product.discount / 100));
      }

      return total + price * item.quantity;
    }, 0);
  },

  getDiscountAmount: () => {
    const subtotal = get().getCartSubtotal();
    const coupon = get().coupon;
    if (!coupon) return 0;

    if (coupon.discountType === 'Percentage') {
      return Math.round(subtotal * (coupon.discountValue / 100));
    }
    return Math.min(coupon.discountValue, subtotal);
  },

  getCartTotal: () => {
    const subtotal = get().getCartSubtotal();
    const discount = get().getDiscountAmount();
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = Math.round((subtotal - discount) * 0.08);
    return subtotal - discount + shipping + tax;
  },

  clearCart: async () => {
    set({ cartItems: [], coupon: null });
    await get().syncCartWithBackend([]);
  },
}));
