import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuthStore } from '../store/authStore.js';
import { useChatStore } from '../store/chatStore.js';
import api from '../services/api.js';
import { 
  Plus, Edit2, Trash2, ShoppingBag, DollarSign, BarChart3, Star, Layers,
  CheckCircle2, RefreshCw, Send, ShieldCheck, FileText, ChevronRight, X, Image, Video
} from 'lucide-react';

const SellerDashboard = () => {
  const { user } = useAuthStore();
  const { 
    conversations, fetchConversations, messages, fetchMessages, 
    sendMessage, respondToOffer, initSocket, disconnectSocket, partnerIsTyping, sendTypingState
  } = useChatStore();

  const [activeTab, setActiveTab] = useState('listings');

  // Backend States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [businessProfile, setBusinessProfile] = useState(null);

  // Listing creation form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Chat window state
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);
  const [selectedPartnerName, setSelectedPartnerName] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isTypingLocal, setIsTypingLocal] = useState(false);
  const typingTimeoutRef = React.useRef(null);

  // Form setups
  const { register, handleSubmit, control, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '', description: '', brand: '', price: 0, discount: 0, stock: 1, warranty: '', deliveryInfo: '',
      condition: 'New', isNegotiable: false, localPickupOnly: false, isWholesale: false, minOrderQuantity: 1,
      images: [''], bulkPricing: []
    }
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: 'images'
  });

  const { fields: bulkPricingFields, append: appendBulkPricing, remove: removeBulkPricing } = useFieldArray({
    control,
    name: 'bulkPricing'
  });

  const isWholesaleWatch = watch('isWholesale');

  useEffect(() => {
    if (user) {
      initSocket(user.id);
      fetchConversations();
      fetchSellerData();
    }
    return () => {
      disconnectSocket();
    };
  }, [user]);

  const fetchSellerData = async () => {
    try {
      // Fetch seller's products
      const prodRes = await api.get(`/products?sellerType=${user.role}&limit=100`);
      if (prodRes.data.success) {
        // filter products belonging to this seller
        const filteredProds = prodRes.data.products.filter(p => p.seller === user.id);
        setProducts(filteredProds);
      }

      // Fetch categories for selector
      const catRes = await api.get('/categories');
      if (catRes.data.success) {
        setCategories(catRes.data.categories);
      }

      // Fetch received orders
      const ordersRes = await api.get('/orders');
      if (ordersRes.data.success) {
        setOrders(ordersRes.data.sellerOrders);
      }

      // Fetch reviews
      const reviewsRes = await api.get(`/reviews/seller/${user.id}`);
      if (reviewsRes.data.success) {
        setReviews(reviewsRes.data.reviews);
      }

      // Fetch Business Profile details if B2B
      if (user.role === 'Business Seller') {
        const busRes = await api.get('/businesses/profile/me');
        if (busRes.data.success) {
          setBusinessProfile(busRes.data.business);
        }
      }
    } catch (err) {
      console.error('Failed to load seller dashboard details:', err);
    }
  };

  const onSubmitProduct = async (data) => {
    try {
      const payload = {
        ...data,
        price: Number(data.price),
        discount: Number(data.discount),
        stock: Number(data.stock),
        minOrderQuantity: Number(data.minOrderQuantity),
        bulkPricing: data.isWholesale ? data.bulkPricing.map(tier => ({
          minQuantity: Number(tier.minQuantity),
          price: Number(tier.price)
        })) : []
      };

      if (editingProduct) {
        const res = await api.put(`/products/${editingProduct._id}`, payload);
        if (res.data.success) {
          setProducts(prev => prev.map(p => p._id === editingProduct._id ? res.data.product : p));
          alert('Listing successfully updated!');
        }
      } else {
        const res = await api.post('/products', payload);
        if (res.data.success) {
          setProducts(prev => [res.data.product, ...prev]);
          alert('Listing successfully created!');
        }
      }
      setShowProductForm(false);
      setEditingProduct(null);
      reset();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error processing listing submission.');
    }
  };

  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    reset({
      name: prod.name,
      description: prod.description,
      brand: prod.brand || '',
      price: prod.price,
      discount: prod.discount || 0,
      stock: prod.stock || 0,
      category: prod.category?._id || prod.category,
      warranty: prod.warranty || '',
      deliveryInfo: prod.deliveryInfo || '',
      condition: prod.condition || 'New',
      isNegotiable: prod.isNegotiable || false,
      localPickupOnly: prod.localPickupOnly || false,
      isWholesale: prod.isWholesale || false,
      minOrderQuantity: prod.minOrderQuantity || 1,
      images: prod.images && prod.images.length > 0 ? prod.images : [''],
      bulkPricing: prod.bulkPricing || []
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        setProducts(prev => prev.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkSold = async (prod) => {
    try {
      const res = await api.put(`/products/${prod._id}`, { isSold: !prod.isSold });
      if (res.data.success) {
        setProducts(prev => prev.map(p => p._id === prod._id ? res.data.product : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenewListing = async (prodId) => {
    try {
      const res = await api.put(`/products/${prodId}`, { renewedAt: new Date() });
      if (res.data.success) {
        alert('Listing has been successfully renewed!');
        fetchSellerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePromoteListing = (prodId) => {
    // Simulated promotion activation
    alert('Listing successfully promoted! Visual exposure will boost inside user catalog searches for 7 days.');
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status });
      if (res.data.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectPartner = (convo) => {
    setSelectedPartnerId(convo.otherUser._id);
    setSelectedPartnerName(convo.otherUser.name);
    fetchMessages(convo.otherUser._id);
  };

  const handleChatSend = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedPartnerId) return;
    const result = await sendMessage(selectedPartnerId, chatInput);
    if (result.success) {
      setChatInput('');
    }
  };

  const handleChatInputChange = (e) => {
    setChatInput(e.target.value);
    if (!isTypingLocal) {
      setIsTypingLocal(true);
      sendTypingState(true);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTypingLocal(false);
      sendTypingState(false);
    }, 1500);
  };

  const handleResolveOffer = async (msgId, status) => {
    const res = await respondToOffer(msgId, status);
    if (res.success) {
      alert(`Negotiation offer has been ${status.toLowerCase()}!`);
    }
  };

  const handleBusinessRegisterSubmit = async (e) => {
    e.preventDefault();
    const data = {
      companyName: e.target.companyName.value,
      businessRegistrationNumber: e.target.businessRegistrationNumber.value,
      taxId: e.target.taxId.value,
      address: {
        street: e.target.street.value,
        city: e.target.city.value,
        state: e.target.state.value,
        country: e.target.country.value,
        zip: e.target.zip.value
      }
    };

    try {
      const res = await api.post('/businesses/register', data);
      if (res.data.success) {
        setBusinessProfile(res.data.business);
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error submitting registration details.');
    }
  };

  const totalSales = orders.filter(o => o.orderStatus === 'Delivered').reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[75vh] text-left">
      {/* Navigation Sidebar */}
      <div class="lg:col-span-1 glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm flex flex-col justify-between h-fit">
        <div class="space-y-2">
          {[
            { id: 'listings', label: 'My Listings', icon: Layers },
            { id: 'orders', label: 'Manage Orders', icon: ShoppingBag },
            { id: 'messages', label: 'Offer Chats', icon: MessageSquare },
            { id: 'analytics', label: 'Sales & Revenue', icon: BarChart3 },
            { id: 'reviews', label: 'Buyer Feedbacks', icon: Star },
            ...(user.role === 'Business Seller' ? [{ id: 'business', label: 'Business Profile', icon: ShieldCheck }] : [])
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                class={`w-full flex items-center gap-3 p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-luxury-blue text-white shadow-md' 
                    : 'text-luxury-blue-dark/70 hover:bg-luxury-blue/5 hover:text-luxury-blue'
                }`}
              >
                <Icon class="w-4.5 h-4.5" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Panel Sheets */}
      <div class="lg:col-span-3 space-y-6">
        
        {/* TAB SHEET: LISTINGS */}
        {activeTab === 'listings' && (
          <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm space-y-6 bg-white">
            <div class="flex justify-between items-center pb-4 border-b border-luxury-gray-medium/50">
              <div>
                <h3 class="font-serif text-xl font-bold text-luxury-blue-dark">Your Marketplace Catalog</h3>
                <p class="text-xs text-luxury-gray-dark mt-1">Add, edit, promote, or delete listing sheets.</p>
              </div>
              {!showProductForm && (
                <button 
                  onClick={() => {
                    setEditingProduct(null);
                    reset({ name: '', description: '', brand: '', price: 0, discount: 0, stock: 1, warranty: '', deliveryInfo: '', condition: 'New', isNegotiable: false, localPickupOnly: false, isWholesale: false, minOrderQuantity: 1, images: [''], bulkPricing: [] });
                    setShowProductForm(true);
                  }}
                  class="btn-primary py-2.5 px-4 text-[10px] uppercase tracking-widest bg-luxury-blue flex items-center gap-1.5 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Listing
                </button>
              )}
            </div>

            {showProductForm ? (
              <form onSubmit={handleSubmit(onSubmitProduct)} class="p-5 border border-luxury-gray-medium/30 rounded-xl space-y-5 bg-white/40">
                <h4 class="font-serif text-sm font-bold text-luxury-blue-dark">{editingProduct ? 'Modify Listing' : 'Publish New Asset'}</h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-luxury-blue-dark">
                  <div class="space-y-1.5 md:col-span-2">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Product Name</label>
                    <input 
                      type="text" 
                      class="luxury-input py-2 text-xs" 
                      required
                      {...register('name', { required: true })}
                    />
                  </div>

                  <div class="space-y-1.5 md:col-span-2">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Description Details</label>
                    <textarea 
                      rows="3" 
                      class="luxury-input py-2 text-xs w-full"
                      required
                      {...register('description', { required: true })}
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Select Category</label>
                    <select class="luxury-input py-2 text-xs" {...register('category', { required: true })}>
                      <option value="">Choose category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Brand Name</label>
                    <input type="text" class="luxury-input py-2 text-xs" {...register('brand')} />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Base Price Valuation ($)</label>
                    <input type="number" class="luxury-input py-2 text-xs" required {...register('price', { required: true })} />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Discount Percentage (%)</label>
                    <input type="number" class="luxury-input py-2 text-xs" {...register('discount')} />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Initial Warehouse Stock</label>
                    <input type="number" class="luxury-input py-2 text-xs" required {...register('stock', { required: true })} />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Condition Grade</label>
                    <select class="luxury-input py-2 text-xs" {...register('condition')}>
                      <option value="New">New (B2B/Standard Retail)</option>
                      <option value="Like New">Like New (C2C Used)</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>

                  {/* Wholesales Toggles for business role */}
                  {user.role === 'Business Seller' && (
                    <div class="flex items-center gap-2 md:col-span-2 pt-2 border-t border-luxury-gray-medium/20">
                      <input type="checkbox" id="wholesale-check" {...register('isWholesale')} />
                      <label for="wholesale-check" class="text-[10px] font-bold uppercase text-luxury-gray select-none cursor-pointer">Register as B2B Wholesale bulk contract item</label>
                    </div>
                  )}

                  {isWholesaleWatch && (
                    <div class="md:col-span-2 space-y-4 p-4 bg-luxury-blue/5 rounded-xl border border-luxury-blue/15 text-[10px]">
                      <div class="space-y-1.5">
                        <label class="font-bold text-luxury-gray uppercase block">Minimum Order Quantity (MOQ)</label>
                        <input type="number" class="luxury-input py-2 text-xs bg-white" {...register('minOrderQuantity')} />
                      </div>

                      {/* Tiered prices array editor */}
                      <div class="space-y-2">
                        <div class="flex justify-between items-center">
                          <label class="font-bold text-luxury-gray uppercase">Bulk Tier Prices</label>
                          <button 
                            type="button" 
                            onClick={() => appendBulkPricing({ minQuantity: 5, price: 0 })}
                            class="text-[9px] font-bold text-luxury-blue uppercase hover:underline"
                          >
                            + Add Price Tier
                          </button>
                        </div>
                        {bulkPricingFields.map((field, idx) => (
                          <div key={field.id} class="flex gap-4 items-center">
                            <input 
                              type="number" 
                              placeholder="Min Qty (e.g. 10)" 
                              class="luxury-input py-1.5 text-xs bg-white"
                              {...register(`bulkPricing.${idx}.minQuantity`)}
                            />
                            <input 
                              type="number" 
                              placeholder="Price per unit ($)" 
                              class="luxury-input py-1.5 text-xs bg-white"
                              {...register(`bulkPricing.${idx}.price`)}
                            />
                            <button 
                              type="button" 
                              onClick={() => removeBulkPricing(idx)}
                              class="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* C2C negotiable conditions */}
                  {!isWholesaleWatch && (
                    <>
                      <div class="flex items-center gap-2 pt-2">
                        <input type="checkbox" id="negotiable-check" {...register('isNegotiable')} />
                        <label for="negotiable-check" class="text-[10px] font-bold uppercase text-luxury-gray select-none cursor-pointer">Allow price offers & negotiations</label>
                      </div>
                      <div class="flex items-center gap-2 pt-2">
                        <input type="checkbox" id="pickup-check" {...register('localPickupOnly')} />
                        <label for="pickup-check" class="text-[10px] font-bold uppercase text-luxury-gray select-none cursor-pointer">Local pickup only (C2C)</label>
                      </div>
                    </>
                  )}

                  {/* Multiple image lists */}
                  <div class="md:col-span-2 space-y-3 pt-4 border-t border-luxury-gray-medium/20">
                    <div class="flex justify-between items-center">
                      <label class="text-[10px] font-bold text-luxury-gray uppercase block">Product Image URLs (Up to 10)</label>
                      <button 
                        type="button" 
                        onClick={() => imageFields.length < 10 && appendImage('')}
                        class="text-[9px] font-bold text-luxury-blue uppercase hover:underline"
                      >
                        + Add Image URL
                      </button>
                    </div>
                    {imageFields.map((field, idx) => (
                      <div key={field.id} class="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="https://example.com/image.jpg"
                          class="luxury-input py-2 text-xs" 
                          {...register(`images.${idx}`)}
                        />
                        {imageFields.length > 1 && (
                          <button type="button" onClick={() => removeImage(idx)} class="text-red-500 hover:text-red-700">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Product Video URL (Optional)</label>
                    <input type="text" placeholder="https://example.com/video.mp4" class="luxury-input py-2 text-xs" {...register('video')} />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Warranty Policy</label>
                    <input type="text" placeholder="e.g. 1-year coverage" class="luxury-input py-2 text-xs" {...register('warranty')} />
                  </div>

                  <div class="space-y-1.5 md:col-span-2">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Shipping & Logistics details</label>
                    <input type="text" placeholder="e.g. Dispatches in 24 hours" class="luxury-input py-2 text-xs" {...register('deliveryInfo')} />
                  </div>
                </div>

                <div class="pt-4 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setShowProductForm(false)}
                    class="btn-secondary py-2.5 px-5 text-[10px] uppercase tracking-widest rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    class="btn-primary py-2.5 px-5 text-[10px] uppercase tracking-widest bg-luxury-blue rounded-xl"
                  >
                    Publish Listing
                  </button>
                </div>
              </form>
            ) : (
              <div class="space-y-4">
                {products.length === 0 ? (
                  <div class="text-center py-10 text-xs font-semibold text-luxury-gray">No items listed. Publish your first product!</div>
                ) : (
                  products.map(prod => (
                    <div key={prod._id} class="p-4 rounded-xl border border-luxury-gray-medium/40 hover:bg-luxury-gray-light/30 transition-all flex flex-col md:flex-row justify-between items-center gap-4 bg-white/20">
                      <div class="flex items-center gap-4 text-left">
                        <div class="w-14 h-14 rounded-lg overflow-hidden bg-luxury-gray-light flex-shrink-0 border border-luxury-gray-medium/30">
                          <img src={prod.images?.[0]} alt="product" class="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 class="font-bold text-sm text-luxury-blue-dark leading-tight line-clamp-1">{prod.name}</h4>
                          <div class="flex items-center gap-2 mt-1 text-[10px] font-bold">
                            <span class="text-luxury-gold-dark font-serif">${prod.price}</span>
                            <span class="text-luxury-gray">•</span>
                            <span class="text-luxury-gray-dark">Stock: {prod.stock} units</span>
                            {prod.isSold && (
                              <span class="bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded text-[8px] uppercase">Sold Out</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div class="flex flex-wrap gap-2">
                        <button 
                          onClick={() => handleMarkSold(prod)}
                          class="px-3 py-1.5 border border-luxury-gray-medium/50 rounded-lg text-[9px] font-bold uppercase tracking-wider text-luxury-blue-dark hover:bg-luxury-blue hover:text-white transition-all bg-white"
                        >
                          {prod.isSold ? 'Set Available' : 'Mark Sold'}
                        </button>
                        <button 
                          onClick={() => handleRenewListing(prod._id)}
                          class="px-3 py-1.5 border border-luxury-gray-medium/50 rounded-lg text-[9px] font-bold uppercase tracking-wider text-luxury-blue-dark hover:bg-luxury-blue hover:text-white transition-all bg-white"
                          title="Renew listing timeline"
                        >
                          Renew
                        </button>
                        <button 
                          onClick={() => handlePromoteListing(prod._id)}
                          class="px-3 py-1.5 border border-luxury-gold/50 bg-luxury-gold/10 text-[9px] font-bold uppercase tracking-wider text-luxury-gold-dark rounded-lg hover:bg-luxury-gold hover:text-luxury-blue-dark transition-all"
                          title="Simulate promo boost"
                        >
                          Promote
                        </button>
                        <button 
                          onClick={() => handleEditProduct(prod)}
                          class="p-2 border border-luxury-gray-medium/50 rounded-lg text-luxury-gray hover:text-luxury-gold-dark hover:border-luxury-gold transition-colors bg-white"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(prod._id)}
                          class="p-2 border border-luxury-gray-medium/50 rounded-lg text-luxury-gray hover:text-red-600 hover:border-red-500 transition-colors bg-white"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB SHEET: MANAGE ORDERS */}
        {activeTab === 'orders' && (
          <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm space-y-6 bg-white">
            <div>
              <h3 class="font-serif text-xl font-bold text-luxury-blue-dark">Received Orders</h3>
              <p class="text-xs text-luxury-gray-dark mt-1">Manage dispatch and update logistics timeline parameters.</p>
            </div>

            {orders.length === 0 ? (
              <div class="text-center py-10 text-xs font-semibold text-luxury-gray">No order purchases recorded for your listings.</div>
            ) : (
              <div class="space-y-4">
                {orders.map(order => (
                  <div key={order._id} class="border border-luxury-gray-medium/30 rounded-xl p-5 bg-white/30 text-xs">
                    <div class="flex justify-between items-center pb-3 border-b">
                      <div>
                        <span class="font-bold text-luxury-blue-dark">Order TXID: {order._id}</span>
                        <span class="block text-[9px] text-luxury-gray mt-0.5">Buyer: {order.buyer?.name} ({order.buyer?.email})</span>
                      </div>
                      <div class="flex gap-2">
                        {['Processing', 'Shipped', 'Delivered'].map(status => (
                          <button
                            key={status}
                            onClick={() => handleUpdateOrderStatus(order._id, status)}
                            class={`px-2.5 py-1 rounded text-[9px] font-bold uppercase transition-all ${
                              order.orderStatus === status 
                                ? 'bg-luxury-blue text-white' 
                                : 'bg-white text-luxury-blue-dark border border-luxury-gray-medium hover:bg-luxury-gray-light'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div class="py-3 space-y-2.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} class="flex justify-between items-center font-semibold text-[11px]">
                          <span class="text-luxury-blue-dark truncate max-w-[70%]">{item.name} (x{item.quantity})</span>
                          <span class="text-luxury-gold-dark font-serif">${item.quantity * item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB SHEET: OFFER CHATS */}
        {activeTab === 'messages' && (
          <div class="glass-card-light rounded-2xl border border-white/60 shadow-sm overflow-hidden grid grid-cols-3 h-[500px]">
            {/* Conversations list sidebar */}
            <div class="col-span-1 border-r border-luxury-gray-medium/50 flex flex-col bg-white/20 h-full overflow-y-auto">
              <div class="p-4 border-b border-luxury-gray-medium/50">
                <span class="text-xs font-bold uppercase tracking-wider text-luxury-blue-dark">Inbox channels</span>
              </div>
              {conversations.length === 0 ? (
                <div class="p-6 text-center text-[10px] text-luxury-gray font-medium">No chat threads registered.</div>
              ) : (
                conversations.map(convo => (
                  <button
                    key={convo.conversationId}
                    onClick={() => handleSelectPartner(convo)}
                    class={`p-4 flex gap-3 text-left border-b border-luxury-gray-medium/30 transition-colors ${
                      selectedPartnerId === convo.otherUser._id ? 'bg-luxury-blue/5' : 'hover:bg-white/40'
                    }`}
                  >
                    <div class="w-9 h-9 rounded-full bg-luxury-blue text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {convo.otherUser.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div class="min-w-0">
                      <h4 class="font-bold text-xs text-luxury-blue-dark truncate leading-tight">{convo.otherUser.name}</h4>
                      <span class="text-[9px] font-bold text-luxury-gold uppercase mt-0.5 block">{convo.otherUser.role}</span>
                      <p class="text-[10px] text-luxury-gray-dark truncate mt-1 leading-none">{convo.lastMessage?.text}</p>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Message streams panel */}
            <div class="col-span-2 flex flex-col justify-between h-full bg-white/40">
              {selectedPartnerId ? (
                <>
                  {/* Top Bar Header */}
                  <div class="p-4 bg-luxury-blue text-white flex items-center justify-between flex-shrink-0">
                    <div>
                      <h4 class="font-bold text-xs tracking-wide uppercase leading-tight">{selectedPartnerName}</h4>
                      {partnerIsTyping && <span class="text-[9px] text-luxury-gold font-bold italic animate-pulse">typing...</span>}
                    </div>
                  </div>

                  {/* Messages log */}
                  <div class="flex-grow overflow-y-auto p-4 space-y-4 flex flex-col custom-scrollbar">
                    {messages.map((msg, idx) => {
                      const isMe = msg.sender === user.id;
                      
                      // Check if offer negotiation block
                      if (msg.offerAmount) {
                        return (
                          <div key={idx} class={`flex flex-col p-4 rounded-xl border max-w-[80%] space-y-3 ${
                            isMe 
                              ? 'bg-luxury-blue-deep/10 border-luxury-blue/30 self-end text-right' 
                              : 'bg-luxury-gold/10 border-luxury-gold/30 self-start text-left'
                          }`}>
                            <span class="text-[9px] font-bold text-luxury-gray uppercase tracking-widest block">Negotiation Proposal</span>
                            <div class="text-xs font-bold text-luxury-blue-dark">
                              Proposed amount: <span class="text-sm text-luxury-gold-dark font-serif">${msg.offerAmount}</span>
                            </div>
                            <p class="text-[10px] text-luxury-gray-dark font-medium italic">"{msg.text}"</p>
                            
                            <div class="pt-2 flex justify-end gap-2 items-center">
                              {msg.offerStatus === 'Pending' ? (
                                !isMe ? (
                                  <>
                                    <button 
                                      onClick={() => handleResolveOffer(msg._id, 'Declined')}
                                      class="px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 text-[10px] font-bold uppercase tracking-wider"
                                    >
                                      Decline
                                    </button>
                                    <button 
                                      onClick={() => handleResolveOffer(msg._id, 'Accepted')}
                                      class="px-3 py-1 rounded bg-green-100 hover:bg-green-200 text-green-700 text-[10px] font-bold uppercase tracking-wider"
                                    >
                                      Accept
                                    </button>
                                  </>
                                ) : (
                                  <span class="text-[9px] font-bold text-luxury-gold uppercase px-2 py-0.5 bg-luxury-gold/10 rounded border border-luxury-gold/30">Pending Response</span>
                                )
                              ) : (
                                <span class={`text-[9px] font-bold uppercase px-2.5 py-1 rounded border ${
                                  msg.offerStatus === 'Accepted' 
                                    ? 'bg-green-50 text-green-600 border-green-200' 
                                    : 'bg-red-50 text-red-600 border-red-200'
                                }`}>
                                  Offer {msg.offerStatus}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div 
                          key={idx}
                          class={`p-3 rounded-xl max-w-[75%] text-xs font-semibold leading-relaxed border ${
                            isMe 
                              ? 'bg-luxury-blue text-white border-luxury-blue/30 self-end text-left' 
                              : 'bg-white text-luxury-blue-dark border-luxury-gray-medium/50 self-start text-left'
                          }`}
                        >
                          {msg.text}
                        </div>
                      );
                    })}
                  </div>

                  {/* Send forms */}
                  <form onSubmit={handleChatSend} class="p-3 border-t border-luxury-gray-medium/50 bg-white flex gap-2 flex-shrink-0">
                    <input
                      type="text"
                      placeholder="Type transaction messages..."
                      class="luxury-input py-2 text-xs flex-grow"
                      value={chatInput}
                      onChange={handleChatInputChange}
                    />
                    <button type="submit" class="p-3 bg-luxury-blue text-white rounded-xl hover:bg-luxury-blue-light transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div class="h-full flex items-center justify-center text-xs font-semibold text-luxury-gray">
                  Select an active convo thread channel from the inbox index.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB SHEET: SALES & REVENUE */}
        {activeTab === 'analytics' && (
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm flex items-center gap-4 bg-white">
              <div class="w-12 h-12 rounded-xl bg-luxury-blue/10 flex items-center justify-center text-luxury-blue">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span class="text-[10px] text-luxury-gray font-bold uppercase tracking-wider block">Total Revenue</span>
                <h4 class="font-serif text-2xl font-bold text-luxury-blue-dark">${totalSales}</h4>
              </div>
            </div>

            <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm flex items-center gap-4 bg-white">
              <div class="w-12 h-12 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold-dark">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span class="text-[10px] text-luxury-gray font-bold uppercase tracking-wider block">Units Dispatched</span>
                <h4 class="font-serif text-2xl font-bold text-luxury-blue-dark">
                  {orders.filter(o => o.orderStatus === 'Delivered').reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)} units
                </h4>
              </div>
            </div>

            <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm flex items-center gap-4 bg-white">
              <div class="w-12 h-12 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold-dark">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <span class="text-[10px] text-luxury-gray font-bold uppercase tracking-wider block">Seller Rating</span>
                <h4 class="font-serif text-2xl font-bold text-luxury-blue-dark">
                  {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + (r.sellerRating || 5), 0) / reviews.length).toFixed(1) : '5.0'} / 5
                </h4>
              </div>
            </div>
          </div>
        )}

        {/* TAB SHEET: BUYER FEEDBACKS */}
        {activeTab === 'reviews' && (
          <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm space-y-6 bg-white">
            <div>
              <h3 class="font-serif text-xl font-bold text-luxury-blue-dark">Buyer Feedbacks</h3>
              <p class="text-xs text-luxury-gray-dark mt-1">Review ratings left by clients on your catalog sheets.</p>
            </div>

            {reviews.length === 0 ? (
              <div class="text-center py-10 text-xs font-semibold text-luxury-gray">No reviews received.</div>
            ) : (
              <div class="space-y-4">
                {reviews.map(review => (
                  <div key={review._id} class="p-4 rounded-xl border border-luxury-gray-medium/40 text-xs bg-white/30">
                    <div class="flex justify-between items-center pb-2 border-b">
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-luxury-blue text-white flex items-center justify-center font-bold text-[10px]">
                          {review.user?.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span class="font-bold text-luxury-blue-dark">{review.user?.name}</span>
                          <span class="block text-[8px] text-luxury-gray font-semibold">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div class="flex gap-0.5 text-luxury-gold">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} class="w-3.5 h-3.5 fill-current stroke-current" />
                        ))}
                      </div>
                    </div>
                    <p class="pt-3 font-semibold text-luxury-blue-dark leading-relaxed">"{review.comment}"</p>
                    <span class="text-[9px] text-luxury-gray font-bold block mt-2">Product: {review.product?.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB SHEET: BUSINESS PROFILE */}
        {activeTab === 'business' && (
          <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm space-y-6 bg-white">
            <div>
              <h3 class="font-serif text-xl font-bold text-luxury-blue-dark">Enterprise Credentials</h3>
              <p class="text-xs text-luxury-gray-dark mt-1">Submit or update your wholesale supplier registry credentials.</p>
            </div>

            {businessProfile ? (
              <div class="space-y-6">
                <div class="h-32 bg-luxury-blue-deep rounded-xl overflow-hidden relative flex items-center justify-center text-white">
                  <img src={businessProfile.banner} alt="banner" class="w-full h-full object-cover opacity-40 absolute inset-0" />
                  <div class="z-10 text-center space-y-1">
                    <h3 class="font-serif text-2xl font-bold">{businessProfile.companyName}</h3>
                    <span class={`inline-block text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                      businessProfile.verificationStatus === 'Approved' 
                        ? 'bg-green-50/20 text-green-400 border-green-400/40' 
                        : 'bg-luxury-gold/20 text-luxury-gold border-luxury-gold/40'
                    }`}>
                      {businessProfile.verificationStatus} Verification Badge
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-luxury-blue-dark">
                  <div class="p-4 rounded-xl border border-luxury-gray-medium/35 bg-white/40">
                    <span class="text-[9px] text-luxury-gray font-bold uppercase">Registration License Number</span>
                    <p class="text-sm font-bold pt-1">{businessProfile.businessRegistrationNumber}</p>
                  </div>
                  <div class="p-4 rounded-xl border border-luxury-gray-medium/35 bg-white/40">
                    <span class="text-[9px] text-luxury-gray font-bold uppercase">Tax / VAT ID</span>
                    <p class="text-sm font-bold pt-1">{businessProfile.taxId || 'N/A'}</p>
                  </div>
                  <div class="p-4 rounded-xl border border-luxury-gray-medium/35 bg-white/40 md:col-span-2">
                    <span class="text-[9px] text-luxury-gray font-bold uppercase">Warehouse Headquarters Address</span>
                    <p class="text-sm font-bold pt-1">
                      {businessProfile.address?.street}, {businessProfile.address?.city}, {businessProfile.address?.state}, {businessProfile.address?.country}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBusinessRegisterSubmit} class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-luxury-blue-dark">
                  <div class="space-y-1.5 md:col-span-2">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Company Name</label>
                    <input type="text" name="companyName" class="luxury-input py-2 text-xs" required />
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Business registration/licence number</label>
                    <input type="text" name="businessRegistrationNumber" class="luxury-input py-2 text-xs" required />
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Tax / VAT ID</label>
                    <input type="text" name="taxId" class="luxury-input py-2 text-xs" required />
                  </div>
                  <div class="space-y-1.5 md:col-span-2">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Street Address</label>
                    <input type="text" name="street" class="luxury-input py-2 text-xs" required />
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">City</label>
                    <input type="text" name="city" class="luxury-input py-2 text-xs" required />
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">State</label>
                    <input type="text" name="state" class="luxury-input py-2 text-xs" required />
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Country</label>
                    <input type="text" name="country" class="luxury-input py-2 text-xs" required />
                  </div>
                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">ZIP Code</label>
                    <input type="text" name="zip" class="luxury-input py-2 text-xs" required />
                  </div>
                </div>

                <div class="pt-2 text-left">
                  <button type="submit" class="btn-primary py-2.5 px-6 text-xs uppercase tracking-widest bg-luxury-blue font-bold">
                    Submit Credentials for Approval
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
