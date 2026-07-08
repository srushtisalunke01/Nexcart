import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Plus, Trash2, CheckCircle2, Building, User, DollarSign, MapPin, Layers } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CATEGORIES } from '../data/mockData';

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SellModal: React.FC<SellModalProps> = ({ isOpen, onClose }) => {
  const { createListing, businessProfile, registerBusiness } = useMarketplace();
  const [sellerType, setSellerType] = useState<'individual' | 'business'>('individual');
  const [isRegistered, setIsRegistered] = useState(businessProfile.verified);

  // Form states - Individual
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('accessories');
  const [condition, setCondition] = useState<'New' | 'Like New' | 'Good' | 'Fair' | 'Used'>('New');
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(true);
  const [location, setLocation] = useState('');
  const [deliveryOption, setDeliveryOption] = useState<'delivery' | 'pickup' | 'both'>('both');
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80"
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Form states - Business/Wholesale
  const [companyName, setCompanyName] = useState(businessProfile.companyName || '');
  const [taxId, setTaxId] = useState(businessProfile.taxId || '');
  const [moq, setMoq] = useState('5');
  const [tiers, setTiers] = useState<{ qty: number; price: number }[]>([
    { qty: 5, price: 100 },
    { qty: 10, price: 90 }
  ]);
  const [newTierQty, setNewTierQty] = useState('');
  const [newTierPrice, setNewTierPrice] = useState('');

  // Business registration details
  const [bizDescription, setBizDescription] = useState(businessProfile.description || '');
  const [bizLogo, setBizLogo] = useState(businessProfile.logo || '');

  const [successMsg, setSuccessMsg] = useState(false);

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTier = () => {
    const qty = parseInt(newTierQty);
    const prc = parseFloat(newTierPrice);
    if (!isNaN(qty) && !isNaN(prc)) {
      setTiers(prev => [...prev, { qty, price: prc }].sort((a, b) => a.qty - b.qty));
      setNewTierQty('');
      setNewTierPrice('');
    }
  };

  const handleRemoveTier = (idx: number) => {
    setTiers(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRegisterAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRegistered) {
      registerBusiness({
        companyName,
        description: bizDescription,
        logo: bizLogo || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=60",
        taxId,
        moq: parseInt(moq) || 5
      });
      setIsRegistered(true);
    }

    // Submit business listing
    createListing({
      name: title,
      tagline: `Premium wholesale supply by ${companyName}`,
      description,
      price: parseFloat(price) || 0,
      discountPrice: tiers[0]?.price || parseFloat(price) || 0,
      category,
      parentCategory: CATEGORIES.find(c => c.subcategories.some(s => s.id === category))?.id || "electronics",
      images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"],
      stock: 500,
      sellerType: 'business',
      sellerName: companyName,
      sellerVerified: true,
      moq: parseInt(moq) || 5,
      priceTiers: tiers,
      condition: 'New',
      negotiable: false,
      location: location || "Dallas Logistics Hub, TX",
      deliveryOption: 'delivery',
      freeDelivery: true
    });

    triggerSuccess();
  };

  const handleIndividualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createListing({
      name: title,
      tagline: `Item condition: ${condition} • Located in ${location}`,
      description,
      price: parseFloat(price) || 0,
      discountPrice: parseFloat(price) || 0,
      category,
      parentCategory: CATEGORIES.find(c => c.subcategories.some(s => s.id === category))?.id || "electronics",
      images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"],
      stock: 1,
      sellerType: 'individual',
      sellerName: 'Alex Stark',
      condition,
      negotiable,
      location,
      deliveryOption,
      freeDelivery: false
    });

    triggerSuccess();
  };

  const triggerSuccess = () => {
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
      // Clear forms
      setTitle('');
      setDescription('');
      setPrice('');
      setLocation('');
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            className="relative w-full max-w-2xl bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800 rounded-premium shadow-2xl p-6 sm:p-8 overflow-hidden z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-850 dark:text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-brand-500" /> List a Product
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500"
              >
                <X className="h-5.5 w-5.5" />
              </button>
            </div>

            {successMsg ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 text-center space-y-4"
              >
                <div className="h-16 w-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Listing Created Successfully!</h3>
                <p className="text-xs text-slate-400">Your item is now active on the NEXUS Marketplace catalog.</p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {/* Selector Tab */}
                <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setSellerType('individual')}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      sellerType === 'individual'
                        ? 'bg-brand-500 text-white shadow-md shadow-brand-500/10'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <User className="h-4 w-4" /> Sell as Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => setSellerType('business')}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      sellerType === 'business'
                        ? 'bg-brand-500 text-white shadow-md shadow-brand-500/10'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Building className="h-4 w-4" /> Sell as Business
                  </button>
                </div>

                {/* Form Panels */}
                {sellerType === 'individual' ? (
                  /* COMMUNITY INDIVIDUAL FORM */
                  <form onSubmit={handleIndividualSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Listing Title</label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Mechanical Keyboard, Sony Headphones"
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none dark:text-white"
                        >
                          {CATEGORIES.flatMap(cat => cat.subcategories).map(sub => (
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Condition</label>
                        <select
                          value={condition}
                          onChange={(e) => setCondition(e.target.value as any)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none dark:text-white"
                        >
                          <option value="New">New</option>
                          <option value="Like New">Like New</option>
                          <option value="Good">Good</option>
                          <option value="Fair">Fair</option>
                          <option value="Used">Used</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Price ($)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <input
                            type="number"
                            required
                            min="0"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none dark:text-white"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="block text-xs font-bold text-slate-400 uppercase mb-2">Negotiable</span>
                        <label className="inline-flex items-center cursor-pointer mt-1">
                          <input
                            type="checkbox"
                            checked={negotiable}
                            onChange={() => setNegotiable(!negotiable)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-brand-500 relative"></div>
                          <span className="ml-2 text-xs font-semibold text-slate-600 dark:text-slate-400">{negotiable ? "Accept Offers" : "Firm Price"}</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-brand-500" />
                          <input
                            type="text"
                            required
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g. San Francisco, CA"
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none dark:text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Delivery Option</label>
                        <select
                          value={deliveryOption}
                          onChange={(e) => setDeliveryOption(e.target.value as any)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none dark:text-white"
                        >
                          <option value="both">Delivery & Pickup Available</option>
                          <option value="delivery">Shipping Only</option>
                          <option value="pickup">Local Pickup Only</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Listing Description</label>
                      <textarea
                        required
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide details about the item's condition, defects, or why you are selling it..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none dark:text-white"
                      />
                    </div>

                    {/* Image Links list */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Product Photo URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="Paste image link..."
                          className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddImage}
                          className="px-4 bg-slate-900 dark:bg-slate-100 dark:text-slate-950 text-white rounded-xl font-bold text-xs"
                        >
                          Add Link
                        </button>
                      </div>

                      {/* Image previews */}
                      <div className="flex flex-wrap gap-3 mt-3">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative h-16 w-16 border rounded-xl overflow-hidden group">
                            <img src={img} alt="listing" className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute inset-0 bg-red-600/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 gradient-orange text-white font-bold rounded-xl shadow-lg hover:shadow-premium-orange transition-all"
                    >
                      Publish Listing
                    </button>
                  </form>
                ) : (
                  /* BUSINESS WHOLESALE FORM */
                  <form onSubmit={handleRegisterAndSubmit} className="space-y-6">
                    {/* If not verified or has mock profile default business profile */}
                    {!isRegistered && (
                      <div className="border border-brand-100 dark:border-brand-500/10 p-5 rounded-2xl bg-brand-50/20 dark:bg-brand-500/5 space-y-4">
                        <span className="text-xs font-bold text-brand-500 flex items-center gap-1.5 uppercase">
                          <Building className="h-4 w-4" /> Business Registration Required
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Company Name</label>
                            <input
                              type="text"
                              required
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              placeholder="e.g. Wayne Wholesalers"
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tax ID / Business Registration ID</label>
                            <input
                              type="text"
                              required
                              value={taxId}
                              onChange={(e) => setTaxId(e.target.value)}
                              placeholder="e.g. EU-990821-B"
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none dark:text-white"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Company Description</label>
                            <input
                              type="text"
                              value={bizDescription}
                              onChange={(e) => setBizDescription(e.target.value)}
                              placeholder="Describe your wholesale products..."
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Company Logo URL</label>
                            <input
                              type="text"
                              value={bizLogo}
                              onChange={(e) => setBizLogo(e.target.value)}
                              placeholder="Paste logo image link..."
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Wholesale Product Name</label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Charging Cables 100 Pack"
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Wholesale Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none dark:text-white"
                        >
                          {CATEGORIES.flatMap(cat => cat.subcategories).map(sub => (
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Base Price ($)</label>
                        <input
                          type="number"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="Base wholesale unit price"
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Min Order Qty (MOQ)</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={moq}
                          onChange={(e) => setMoq(e.target.value)}
                          placeholder="e.g. 5 packages"
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Dispatch Origin Hub</label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Houston Hub, TX"
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Quantity Tiers */}
                    <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-4">
                      <span className="block text-xs font-bold text-slate-400 uppercase">Quantity Price Tiers</span>
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <label className="block text-[10px] text-slate-400 mb-1">Quantity Threshold</label>
                          <input
                            type="number"
                            value={newTierQty}
                            onChange={(e) => setNewTierQty(e.target.value)}
                            placeholder="e.g. 10"
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none dark:text-white"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] text-slate-400 mb-1">Tier Price ($ per unit)</label>
                          <input
                            type="number"
                            value={newTierPrice}
                            onChange={(e) => setNewTierPrice(e.target.value)}
                            placeholder="e.g. 85.00"
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none dark:text-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddTier}
                          className="px-4 py-2 bg-slate-900 dark:bg-slate-100 dark:text-slate-950 text-white rounded-xl font-bold text-xs"
                        >
                          Add Tier
                        </button>
                      </div>

                      {/* Tiers list */}
                      <div className="flex flex-wrap gap-2">
                        {tiers.map((t, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border text-xs font-semibold">
                            <span>Qty {t.qty}+: ${t.price}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTier(idx)}
                              className="text-red-500 hover:text-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Wholesale Specifications / Notes</label>
                      <textarea
                        required
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="List bulk certifications, packing dimensions, pallets setups..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none dark:text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-slate-950 dark:bg-white dark:text-slate-950 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
                    >
                      Publish Wholesale Listing
                    </button>
                  </form>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
