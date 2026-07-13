import { create } from 'zustand';

export const useCompareStore = create((set, get) => ({
  compareItems: [],

  addToCompare: (product) => {
    const current = get().compareItems;
    
    // Check if already in comparison basket
    if (current.find(item => item._id === product._id)) {
      return { success: false, message: 'Product is already in the comparison list.' };
    }

    // Limit comparison to 4 items
    if (current.length >= 4) {
      return { success: false, message: 'You can compare a maximum of 4 products at a time.' };
    }

    set({ compareItems: [...current, product] });
    return { success: true };
  },

  removeFromCompare: (productId) => {
    set({
      compareItems: get().compareItems.filter(item => item._id !== productId)
    });
  },

  clearCompare: () => {
    set({ compareItems: [] });
  }
}));
