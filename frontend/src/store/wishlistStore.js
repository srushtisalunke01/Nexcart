import { create } from 'zustand';
import api from '../services/api.js';

export const useWishlistStore = create((set, get) => ({
  wishlistItems: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/orders/wishlist');
      if (response.data.success) {
        set({ wishlistItems: response.data.wishlist.products, isLoading: false });
      }
    } catch (err) {
      console.error('Failed to load wishlist:', err);
      set({ isLoading: false });
    }
  },

  toggleWishlist: async (productId) => {
    try {
      const response = await api.post('/orders/wishlist', { productId });
      if (response.data.success) {
        // Optimistic toggle locally
        const current = get().wishlistItems;
        const exists = current.find(item => item._id === productId);
        
        if (exists) {
          set({ wishlistItems: current.filter(item => item._id !== productId) });
        } else {
          // If adding, re-fetch list to get populated product details
          await get().fetchWishlist();
        }
        return { success: true, isAdded: response.data.isAdded };
      }
    } catch (err) {
      console.error('Wishlist toggle error:', err);
      return { success: false };
    }
  },

  isInWishlist: (productId) => {
    return get().wishlistItems.some(item => item._id === productId);
  },
}));
