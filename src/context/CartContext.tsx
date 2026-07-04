import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ColorVariant } from '../data/mockData';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: ColorVariant;
  selectedSize?: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  address: Address;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  recentlyViewed: Product[];
  compareList: Product[];
  addresses: Address[];
  selectedAddress: Address | null;
  orders: Order[];
  walletBalance: number;
  loyaltyPoints: number;
  appliedCoupon: { code: string; discountPercent: number } | null;
  notifications: Notification[];
  addToCart: (product: Product, quantity?: number, color?: ColorVariant, size?: string) => void;
  removeFromCart: (productId: string, colorCode?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, colorCode?: string, size?: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  addToRecentlyViewed: (product: Product) => void;
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  selectAddress: (id: string) => void;
  placeOrder: (paymentMethod: string) => Order | null;
  markNotificationsAsRead: () => void;
  addNotification: (title: string, message: string) => void;
  cancelOrder: (orderId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    name: "Alex Stark",
    phone: "+1 (555) 890-4820",
    street: "10880 Malibu Point Road",
    city: "Malibu",
    state: "CA",
    zipCode: "90265",
    isDefault: true
  },
  {
    id: "addr-2",
    name: "Tony Vance",
    phone: "+1 (555) 348-9021",
    street: "5th Avenue, Penthouse B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    isDefault: false
  }
];

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    title: "Welcome to NexCart!",
    message: "Enjoy a 10% discount on your first order. Use code NEXCART10 at checkout.",
    date: "Just now",
    read: false
  },
  {
    id: "notif-2",
    title: "Flash Sale Alert",
    message: "Get up to 25% off on high-end headphones. Limited inventory remains.",
    date: "2 hours ago",
    read: false
  }
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('nexcart-cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nexcart-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('nexcart-addresses');
    return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES;
  });

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(() => {
    const saved = localStorage.getItem('nexcart-selected-address');
    if (saved) return JSON.parse(saved);
    const def = DEFAULT_ADDRESSES.find(a => a.isDefault);
    return def || DEFAULT_ADDRESSES[0] || null;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('nexcart-orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [walletBalance, setWalletBalance] = useState<number>(180.00);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(350);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(DEFAULT_NOTIFICATIONS);

  // Sync state helpers
  useEffect(() => {
    localStorage.setItem('nexcart-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('nexcart-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('nexcart-addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    if (selectedAddress) {
      localStorage.setItem('nexcart-selected-address', JSON.stringify(selectedAddress));
    }
  }, [selectedAddress]);

  useEffect(() => {
    localStorage.setItem('nexcart-orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product: Product, quantity = 1, color?: ColorVariant, size?: string) => {
    setCart(prev => {
      const match = prev.find(item => 
        item.product.id === product.id && 
        item.selectedColor?.code === color?.code && 
        item.selectedSize === size
      );
      if (match) {
        return prev.map(item => 
          item.product.id === product.id && 
          item.selectedColor?.code === color?.code && 
          item.selectedSize === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor: color || product.colors[0], selectedSize: size || product.sizes?.[0] }];
    });

    addNotification("Added to Cart", `${product.name} has been added to your shopping cart.`);
  };

  const removeFromCart = (productId: string, colorCode?: string, size?: string) => {
    setCart(prev => prev.filter(item => 
      !(item.product.id === productId && 
        item.selectedColor?.code === colorCode && 
        item.selectedSize === size)
    ));
  };

  const updateQuantity = (productId: string, quantity: number, colorCode?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, colorCode, size);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId && 
      item.selectedColor?.code === colorCode && 
      item.selectedSize === size
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const isExist = prev.some(item => item.id === product.id);
      if (isExist) {
        addNotification("Removed from Wishlist", `${product.name} removed from your favorites.`);
        return prev.filter(item => item.id !== product.id);
      } else {
        addNotification("Added to Wishlist", `${product.name} saved to your favorites.`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(item => item.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
  };

  const addToCompare = (product: Product): boolean => {
    let status = false;
    setCompareList(prev => {
      if (prev.some(item => item.id === product.id)) return prev;
      if (prev.length >= 4) {
        status = false;
        return prev;
      }
      status = true;
      return [...prev, product];
    });
    if (status) {
      addNotification("Added to Compare", `${product.name} added to comparison dashboard.`);
    }
    return status;
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(item => item.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const applyCoupon = (code: string) => {
    const formattedCode = code.trim().toUpperCase();
    if (formattedCode === "NEXCART10") {
      setAppliedCoupon({ code: "NEXCART10", discountPercent: 10 });
      return { success: true, message: "10% Coupon Applied Successfully!" };
    } else if (formattedCode === "SUPERSAVE25") {
      setAppliedCoupon({ code: "SUPERSAVE25", discountPercent: 25 });
      return { success: true, message: "Special 25% Discount Applied!" };
    }
    return { success: false, message: "Invalid coupon code." };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const addAddress = (newAddr: Omit<Address, 'id'>) => {
    const id = `addr-${Date.now()}`;
    const nextAddresses = addresses.map(a => newAddr.isDefault ? { ...a, isDefault: false } : a);
    const added: Address = { id, ...newAddr };
    setAddresses([...nextAddresses, added]);
    if (newAddr.isDefault || addresses.length === 0) {
      setSelectedAddress(added);
    }
  };

  const selectAddress = (id: string) => {
    const matched = addresses.find(a => a.id === id);
    if (matched) {
      setSelectedAddress(matched);
    }
  };

  const placeOrder = (paymentMethod: string): Order | null => {
    if (cart.length === 0 || !selectedAddress) return null;

    const subtotal = cart.reduce((acc, item) => acc + (item.product.discountPrice * item.quantity), 0);
    const discountAmount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.discountPercent / 100)) : 0;
    const delivery = subtotal > 150 ? 0 : 15;
    const total = subtotal - discountAmount + delivery;

    // Adjust wallet balance if paid by Wallet
    if (paymentMethod === "Wallet") {
      if (walletBalance < total) return null;
      setWalletBalance(prev => prev - total);
    }

    const newOrder: Order = {
      id: `NEX-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
      items: [...cart],
      subtotal,
      discount: discountAmount,
      deliveryCharge: delivery,
      total,
      status: 'processing',
      paymentMethod,
      address: selectedAddress
    };

    setOrders(prev => [newOrder, ...prev]);
    setLoyaltyPoints(prev => prev + Math.floor(total * 0.1)); // 10% cashpoints back
    clearCart();
    setAppliedCoupon(null);
    addNotification("Order Placed Successfully", `Thank you! Your order ${newOrder.id} is being processed.`);
    return newOrder;
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (title: string, message: string) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      date: "Just now",
      read: false
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 10));
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        if (o.status !== 'cancelled') {
          if (o.paymentMethod === 'Wallet') {
            setWalletBalance(curr => curr + o.total);
          }
          addNotification("Order Cancelled", `Your order ${orderId} has been successfully cancelled.`);
          return { ...o, status: 'cancelled' };
        }
      }
      return o;
    }));
  };

  return (
    <CartContext.Provider value={{
      cart, wishlist, recentlyViewed, compareList, addresses, selectedAddress, orders,
      walletBalance, loyaltyPoints, appliedCoupon, notifications,
      addToCart, removeFromCart, updateQuantity, clearCart,
      toggleWishlist, isInWishlist, addToRecentlyViewed, addToCompare, removeFromCompare, clearCompare,
      applyCoupon, removeCoupon, addAddress, selectAddress, placeOrder,
      markNotificationsAsRead, addNotification, cancelOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
