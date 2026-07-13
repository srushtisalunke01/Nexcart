import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWishlistStore } from '../store/wishlistStore.js';
import { useCartStore } from '../store/cartStore.js';
import { 
  Heart, ShoppingBag, Trash2, ArrowLeft, Star, Tag, Zap
} from 'lucide-react';

const Wishlist = () => {
  const { wishlistItems, isLoading, fetchWishlist, toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleAddToCart = async (product) => {
    const qty = product.isWholesale ? product.minOrderQuantity : 1;
    const res = await addToCart(product, qty);
    if (res.success) {
      alert(`Product "${product.name}" successfully added to your cart!`);
    } else {
      alert(res.message);
    }
  };

  if (isLoading && wishlistItems.length === 0) {
    return (
      <div class="min-h-[70vh] flex items-center justify-center">
        <div class="animate-pulse text-luxury-gold font-bold uppercase tracking-widest text-xs">Unlocking Vault favorities...</div>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-6 py-12 text-left">
      <div class="flex items-center justify-between mb-10 pb-6 border-b border-luxury-gray-medium/50">
        <div>
          <span class="text-xs text-luxury-gold font-bold tracking-widest uppercase block mb-1">Saved Showcases</span>
          <h1 class="font-serif text-3.5xl font-bold text-luxury-blue-dark">Your Wishlist</h1>
        </div>
        <Link to="/shop" class="inline-flex items-center gap-1.5 text-xs font-bold text-luxury-blue hover:text-luxury-blue-light transition-colors">
          <ArrowLeft className="w-4 h-4" /> Continue Exploring
        </Link>
      </div>

      {wishlistItems.length === 0 ? (
        <div class="text-center py-20 bg-white/40 border border-white/20 rounded-2xl p-10 max-w-md mx-auto space-y-4 shadow-sm">
          <Heart className="w-12 h-12 text-luxury-gold mx-auto animate-luxury-float" />
          <h3 class="font-serif text-xl font-bold text-luxury-blue-dark">No Saved Assets</h3>
          <p class="text-xs text-luxury-gray-dark">
            Explore catalogs to bookmark products and inspect them later.
          </p>
          <div class="pt-4">
            <Link to="/shop" class="btn-primary text-xs uppercase tracking-widest inline-block">
              Browse shop
            </Link>
          </div>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlistItems.map((product) => (
            <div 
              key={product._id}
              class="group bg-white rounded-2xl overflow-hidden border border-luxury-gray-medium/30 hover:shadow-luxury transition-all duration-500 flex flex-col relative"
            >
              {/* Delete / Remove toggle */}
              <button 
                onClick={() => toggleWishlist(product._id)}
                class="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-red-500 border border-luxury-gray-medium/20 shadow-sm transition-all"
                title="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Tag / Condition */}
              <div class="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                <span class={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  product.isWholesale 
                    ? 'bg-luxury-blue text-white' 
                    : 'bg-luxury-gold text-luxury-blue-dark'
                }`}>
                  {product.isWholesale ? 'B2B' : 'Retail'}
                </span>
              </div>

              {/* Product Thumbnail */}
              <div class="h-56 overflow-hidden relative bg-luxury-gray-light">
                <img 
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600'} 
                  alt={product.name}
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Product Description details */}
              <div class="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <span class="text-[9px] text-luxury-gray font-bold tracking-wider block uppercase mb-1">{product.brand || 'Luxury Designer'}</span>
                  <Link to={`/product/${product._id}`} class="font-serif text-sm font-bold text-luxury-blue-dark hover:text-luxury-gold transition-colors line-clamp-2 leading-tight">
                    {product.name}
                  </Link>
                  
                  <div class="flex items-center gap-1.5 mt-2">
                    <Star className="w-3.5 h-3.5 fill-luxury-gold stroke-luxury-gold" />
                    <span class="font-bold text-[11px] text-luxury-blue-dark">{product.rating}</span>
                  </div>
                </div>

                <div class="space-y-3">
                  <div class="flex items-baseline justify-between border-t border-luxury-gray-medium/40 pt-3">
                    <span class="text-base font-bold text-luxury-blue-dark">${product.price}</span>
                    {product.isWholesale && (
                      <span class="text-[9px] font-bold text-luxury-blue bg-luxury-blue/5 px-2 py-0.5 rounded-full border border-luxury-blue/10 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> MOQ: {product.minOrderQuantity}
                      </span>
                    )}
                  </div>

                  <button 
                    onClick={() => handleAddToCart(product)}
                    class="btn-primary w-full py-2.5 text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 bg-luxury-blue font-bold"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
