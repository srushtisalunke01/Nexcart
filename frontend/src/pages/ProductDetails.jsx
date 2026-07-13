import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useCompareStore } from '../store/compareStore.js';
import { useAuthStore } from '../store/authStore.js';
import { useCartStore } from '../store/cartStore.js';
import { useWishlistStore } from '../store/wishlistStore.js';
import { useChatStore } from '../store/chatStore.js';
import { 
  Heart, ShoppingBag, Scale, Share2, ShieldCheck, Truck, ShieldAlert,
  Zap, MessageSquare, Compass, Send, Check, Star, RefreshCw
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCompare, compareItems, removeFromCompare } = useCompareStore();

  const { user } = useAuthStore();
  const { addToCart } = useCartStore();
  const { wishlistItems, toggleWishlist, fetchWishlist } = useWishlistStore();
  const { sendMessage } = useChatStore();

  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const isWishlisted = wishlistItems.some(item => item._id === id);

  const handleToggleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    await toggleWishlist(id);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    const qty = product.isWholesale ? product.minOrderQuantity : 1;
    const res = await addToCart(product, qty);
    if (res.success) {
      alert(`Product successfully added to your cart!`);
    } else {
      alert(res.message);
    }
  };

  // Gallery & 360 viewer state
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [is360Mode, setIs360Mode] = useState(false);
  const [imageIndex360, setImageIndex360] = useState(0);
  const isDragging = useRef(false);
  const startDragX = useRef(0);

  // Modals state
  const [showRfqModal, setShowRfqModal] = useState(false);
  const [rfqQuantity, setRfqQuantity] = useState(1);
  const [rfqTargetPrice, setRfqTargetPrice] = useState(0);
  const [rfqSubmitted, setRfqSubmitted] = useState(false);

  // Chat window template state
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  // Fetch product data
  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/products/${id}`);
        if (response.data.success) {
          setProduct(response.data.product);
          setInventory(response.data.inventory);
          setRfqQuantity(response.data.product.minOrderQuantity || 1);
          setRfqTargetPrice(response.data.product.price);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
        // Fallback sample data if connection fails
        const mockProduct = {
          _id: id,
          name: 'Aurelia Royal Gold Chronograph',
          brand: 'Aurelia Geneva',
          price: 1850,
          discount: 10,
          description: 'The Aurelia Chronograph stands as a triumph in haute horology. Featuring custom Calibre-X automatic mechanics, case lines crafted from 18-karat brushed gold plate, and Sapphire structural crystals.',
          images: [
            'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600'
          ],
          rating: 4.9,
          reviewsCount: 38,
          sellerType: 'Business Seller',
          isWholesale: true,
          minOrderQuantity: 5,
          bulkPricing: [
            { minQuantity: 5, price: 1500 },
            { minQuantity: 10, price: 1350 }
          ],
          stock: 45,
          warranty: '5-year international manufacturer warranty',
          deliveryInfo: 'Escrow secured shipping. Vetted transport in 2-4 business days.',
          specifications: [
            { name: 'Case Material', value: '18K Yellow Gold' },
            { name: 'Movement', value: 'Automatic Self-Winding' },
            { name: 'Water Resistance', value: '100m (10 ATM)' }
          ],
          condition: 'New'
        };
        setProduct(mockProduct);
        setRfqQuantity(mockProduct.minOrderQuantity);
        setRfqTargetPrice(mockProduct.price);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div class="min-screen flex items-center justify-center bg-luxury-gray-light">
        <Compass className="w-12 h-12 text-luxury-gold animate-spin-slow" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div class="max-w-md mx-auto py-20 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
        <h3 class="font-serif text-xl font-bold text-luxury-blue-dark">Listing Error</h3>
        <p class="text-xs text-luxury-gray-dark">Could not retrieve information for this listing.</p>
        <Link to="/shop" class="btn-primary text-xs inline-block">Return to shop</Link>
      </div>
    );
  }

  // 360 drag simulation logic
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startDragX.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startDragX.current;
    
    // Change images index on 15px drag steps
    if (Math.abs(deltaX) > 15) {
      const step = deltaX > 0 ? -1 : 1;
      setImageIndex360((prev) => {
        let nextIdx = prev + step;
        if (nextIdx < 0) nextIdx = product.images.length - 1;
        if (nextIdx >= product.images.length) nextIdx = 0;
        return nextIdx;
      });
      startDragX.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const isCompared = compareItems.some(item => item._id === product._id);

  const toggleCompare = () => {
    if (isCompared) {
      removeFromCompare(product._id);
    } else {
      const result = addToCompare(product);
      if (!result.success) alert(result.message);
    }
  };

  // RFQ Submission logic
  const submitRfq = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    const messageText = `💼 B2B RFQ Trade Proposal:\nQuantity: ${rfqQuantity} units\nProposed Unit Price: $${rfqTargetPrice}`;
    const result = await sendMessage(product.seller._id, messageText, '', rfqTargetPrice, product._id);
    if (result.success) {
      setRfqSubmitted(true);
      setTimeout(() => {
        setShowRfqModal(false);
        setRfqSubmitted(false);
      }, 2000);
    } else {
      alert('Failed to submit RFQ proposal.');
    }
  };

  // Chat message template logic
  const sendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    if (!user) {
      navigate('/login');
      return;
    }
    const result = await sendMessage(product.seller._id, chatMessage, '', null, product._id);
    if (result.success) {
      setChatMessage('');
      setShowChatPopup(false);
      alert('Message successfully dispatched! Open dashboard conversations to continue chat.');
    } else {
      alert('Failed to send message.');
    }
  };

  return (
    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT COLUMN: VISUAL GALLERY & 360 VIEWER */}
        <div class="space-y-6">
          <div 
            class="glass-card-light h-[450px] rounded-3xl overflow-hidden border border-white/60 relative flex items-center justify-center cursor-ew-resize select-none"
            onMouseDown={is360Mode ? handleMouseDown : undefined}
            onMouseMove={is360Mode ? handleMouseMove : undefined}
            onMouseUp={is360Mode ? handleMouseUp : undefined}
            onMouseLeave={is360Mode ? handleMouseUp : undefined}
          >
            {is360Mode ? (
              /* 360 Spin View */
              <div class="w-full h-full relative flex items-center justify-center bg-luxury-gray-light">
                <img 
                  src={product.images[imageIndex360]} 
                  alt="360 rotation"
                  class="max-h-full max-w-full object-contain pointer-events-none"
                />
                <div class="absolute bottom-4 left-4 bg-luxury-blue-dark/80 text-[10px] font-bold text-white uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> Drag Mouse to Rotate 360°
                </div>
              </div>
            ) : (
              /* Focal image view with Zoom Magnifier effect mockup */
              <div class="w-full h-full relative flex items-center justify-center bg-luxury-gray-light">
                <img 
                  src={product.images[activeImageIdx]} 
                  alt={product.name}
                  class="max-h-full max-w-full object-contain pointer-events-none hover:scale-110 transition-transform duration-500"
                />
              </div>
            )}

            {/* Toggle 360 Mode */}
            {product.images.length > 1 && (
              <button
                onClick={() => setIs360Mode(!is360Mode)}
                class={`absolute top-4 right-4 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-md z-10 transition-colors ${
                  is360Mode 
                    ? 'bg-luxury-gold text-luxury-blue-dark' 
                    : 'bg-white text-luxury-blue hover:bg-luxury-blue hover:text-white'
                }`}
              >
                360° View
              </button>
            )}
          </div>

          {/* Thumbnails row */}
          {!is360Mode && (
            <div class="flex gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  class={`w-20 h-20 rounded-2xl overflow-hidden border bg-white ${
                    activeImageIdx === idx ? 'border-luxury-gold shadow-md' : 'border-luxury-gray-medium/50'
                  }`}
                >
                  <img src={img} alt="thumbnail" class="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: LISTING CRITERIA AND PURCHASE CONFIGURATIONS */}
        <div class="space-y-6">
          <div>
            <div class="inline-flex gap-2 mb-2">
              <span class={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                product.isWholesale ? 'bg-luxury-blue text-white' : 'bg-luxury-gold text-luxury-blue-dark'
              }`}>
                {product.isWholesale ? 'B2B Wholesale' : 'Retail'}
              </span>
              {product.condition !== 'New' && (
                <span class="bg-luxury-gray-dark text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                  Used: {product.condition}
                </span>
              )}
            </div>
            
            <span class="block text-xs font-bold tracking-wider text-luxury-gray uppercase mb-1">{product.brand || 'Luxury Designer'}</span>
            <h1 class="font-serif text-3.5xl font-bold text-luxury-blue-dark leading-tight">{product.name}</h1>
          </div>

          {/* Ratings & Compare button */}
          <div class="flex items-center justify-between pb-6 border-b border-luxury-gray-medium/50 text-xs">
            <div class="flex items-center gap-2">
              <Star className="w-5 h-5 fill-luxury-gold stroke-luxury-gold" />
              <span class="font-bold text-sm text-luxury-blue-dark">{product.rating}</span>
              <span class="text-xs text-luxury-gray-dark font-medium">({product.reviewsCount} verified reviews)</span>
            </div>
            
            <div class="flex gap-4">
              <button 
                onClick={handleToggleWishlist}
                class={`flex items-center gap-1.5 font-bold uppercase tracking-widest transition-colors ${
                  isWishlisted ? 'text-red-500' : 'text-luxury-blue hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} /> {isWishlisted ? 'Saved ✓' : 'Save Item'}
              </button>

              <button 
                onClick={toggleCompare}
                class={`flex items-center gap-1.5 font-bold uppercase tracking-widest transition-colors ${
                  isCompared ? 'text-luxury-gold-dark' : 'text-luxury-blue hover:text-luxury-gold-dark'
                }`}
              >
                <Scale className="w-4 h-4" /> {isCompared ? 'Compared ✓' : 'Add to Compare'}
              </button>
            </div>
          </div>

          {/* Pricing Deck */}
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-luxury-gray block mb-1">Base Valuation</span>
            <div class="flex items-baseline gap-3">
              <span class="text-3xl font-serif font-bold text-luxury-blue-dark">${product.price}</span>
              {product.discount > 0 && (
                <span class="text-base line-through text-luxury-gray font-medium">${Math.round(product.price * (1 + product.discount/100))}</span>
              )}
            </div>
          </div>

          {/* B2B wholesale tiered rates panel */}
          {product.isWholesale && product.bulkPricing && product.bulkPricing.length > 0 && (
            <div class="p-5 rounded-2xl bg-luxury-blue/5 border border-luxury-blue/10 space-y-3">
              <h4 class="text-xs font-bold uppercase tracking-wider text-luxury-blue flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Tiered Wholesale Contract Prices
              </h4>
              <div class="grid grid-cols-2 gap-4">
                {product.bulkPricing.map((tier, idx) => (
                  <div key={idx} class="bg-white p-3 rounded-xl border border-luxury-gray-medium/30 flex justify-between items-center shadow-sm">
                    <span class="text-xs font-bold text-luxury-blue-dark">{tier.minQuantity}+ units</span>
                    <span class="text-sm font-bold text-luxury-gold-dark">${tier.price} <span class="text-[9px] text-luxury-gray">/ea</span></span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* C2C negotiable / condition deck */}
          {!product.isWholesale && product.condition !== 'New' && (
            <div class="p-5 rounded-2xl bg-luxury-gold/5 border border-luxury-gold/20 space-y-2">
              <h4 class="text-xs font-bold uppercase tracking-wider text-luxury-gold-dark flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> Private Item Details
              </h4>
              <p class="text-xs text-luxury-blue-dark/80 font-medium">
                This item is classified as <strong>{product.condition}</strong> condition. 
                {product.isNegotiable ? ' The seller is open to price negotiations.' : ' The price is non-negotiable.'}
              </p>
            </div>
          )}

          {/* Description */}
          <div class="space-y-2">
            <h4 class="text-xs font-bold text-luxury-blue-dark/70 tracking-wider uppercase">VALUATION NOTE</h4>
            <p class="text-sm text-luxury-gray-dark leading-relaxed">{product.description}</p>
          </div>

          {/* Specs List */}
          {product.specifications && product.specifications.length > 0 && (
            <div class="space-y-3 pt-4 border-t border-luxury-gray-medium/50">
              <h4 class="text-xs font-bold text-luxury-blue-dark/70 tracking-wider uppercase">Specifications</h4>
              <div class="grid grid-cols-2 gap-x-6 gap-y-2.5">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} class="flex justify-between items-center py-1.5 border-b border-luxury-gray-medium/30 text-xs font-semibold">
                    <span class="text-luxury-gray">{spec.name}</span>
                    <span class="text-luxury-blue-dark">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Logistics Terms */}
          <div class="pt-6 border-t border-luxury-gray-medium/50 grid grid-cols-2 gap-4 text-xs font-semibold text-luxury-gray-dark">
            <div class="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-luxury-gold mt-0.5" />
              <div>
                <span class="block text-luxury-blue-dark font-bold">Safe Exchange Escrow</span>
                <span class="text-[10px] text-luxury-gray">5-Year Warranty Cover</span>
              </div>
            </div>
            <div class="flex items-start gap-2.5">
              <Truck className="w-5 h-5 text-luxury-gold mt-0.5" />
              <div>
                <span class="block text-luxury-blue-dark font-bold">Secure Delivery</span>
                <span class="text-[10px] text-luxury-gray">{product.deliveryInfo}</span>
              </div>
            </div>
          </div>

          {/* Checkout & RFQ Actions */}
          <div class="flex flex-col gap-3 pt-6">
            <div class="flex gap-4">
              <button 
                onClick={handleAddToCart}
                class="btn-primary flex-grow py-4 text-sm uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4.5 h-4.5" /> Acquire Asset (Add to Cart)
              </button>
              
              <button 
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                  } else {
                    setShowChatPopup(true);
                  }
                }}
                class="p-4 border-2 border-luxury-blue text-luxury-blue rounded-full hover:bg-luxury-blue hover:text-white transition-all duration-300 bg-white"
                title="Message Seller"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>

            {/* B2B Submit RFQ request */}
            {product.isWholesale && (
              <button 
                onClick={() => setShowRfqModal(true)}
                class="w-full border-2 border-luxury-gold text-luxury-gold-dark py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-luxury-gold hover:text-luxury-blue-dark transition-colors duration-300"
              >
                Submit Custom RFQ Offer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RFQ MODAL MARKUP */}
      <AnimatePresence>
        {showRfqModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRfqModal(false)}
              class="fixed inset-0 bg-black/50 z-50 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              class="glass-card-light fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-8 rounded-3xl shadow-2xl border border-white/60 z-50"
            >
              <div class="text-center mb-6">
                <h3 class="font-serif text-2xl font-bold text-luxury-blue-dark">B2B Trade Proposal (RFQ)</h3>
                <p class="text-xs text-luxury-gray-dark mt-1">Negotiate bulk volumes directly with the supplier.</p>
              </div>

              {rfqSubmitted ? (
                <div class="text-center py-10 space-y-4">
                  <Check className="w-12 h-12 text-luxury-gold mx-auto bg-luxury-gold/10 p-2 rounded-full" />
                  <h4 class="font-bold text-luxury-blue-dark">RFQ Submitted Successfully</h4>
                  <p class="text-xs text-luxury-gray-dark">The seller has been notified. Offer records loaded in dashboard.</p>
                </div>
              ) : (
                <form onSubmit={submitRfq} class="space-y-4">
                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-luxury-gray">Unit Quantity</label>
                    <input
                      type="number"
                      min={product.minOrderQuantity}
                      class="luxury-input py-2.5 text-sm"
                      value={rfqQuantity}
                      onChange={(e) => setRfqQuantity(Number(e.target.value))}
                    />
                    <span class="text-[9px] font-semibold text-luxury-gray-dark block">Minimum Order Limit (MOQ): {product.minOrderQuantity}</span>
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold uppercase tracking-wider text-luxury-gray">Proposed Unit Price ($)</label>
                    <input
                      type="number"
                      class="luxury-input py-2.5 text-sm"
                      value={rfqTargetPrice}
                      onChange={(e) => setRfqTargetPrice(Number(e.target.value))}
                    />
                  </div>

                  <div class="pt-4 flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setShowRfqModal(false)}
                      class="btn-secondary flex-grow py-2.5 text-xs text-center border-luxury-gray uppercase tracking-widest rounded-xl"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      class="btn-primary flex-grow py-2.5 text-xs text-center bg-luxury-blue uppercase tracking-widest rounded-xl"
                    >
                      Submit Offer
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CHAT POPUP WIDGET TEMPLATE */}
      <AnimatePresence>
        {showChatPopup && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            class="glass-card-light fixed bottom-6 right-6 w-80 shadow-2xl border border-white/60 rounded-2xl overflow-hidden z-50"
          >
            <div class="p-4 bg-luxury-blue text-white flex items-center justify-between">
              <span class="text-xs font-bold tracking-wider uppercase">Nexus Chat Gateway</span>
              <button 
                onClick={() => setShowChatPopup(false)}
                class="text-white/80 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
            
            <div class="h-48 p-4 overflow-y-auto bg-luxury-gray-light/35 flex flex-col justify-end">
              <div class="bg-white/80 p-2.5 rounded-xl text-[10px] font-medium text-luxury-blue-dark max-w-[85%] self-start border border-luxury-gray-medium/30">
                Hello. Let me know if you have questions regarding specs, logistics, or custom bulk rates!
              </div>
            </div>

            <form onSubmit={sendChatMessage} class="p-3 border-t border-luxury-gray-medium/50 flex gap-2">
              <input
                type="text"
                placeholder="Compose message..."
                class="luxury-input py-1.5 text-xs flex-grow"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <button 
                type="submit" 
                class="p-2 bg-luxury-blue text-white rounded-xl hover:bg-luxury-blue-light transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails;
