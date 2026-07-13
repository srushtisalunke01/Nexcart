import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useCompareStore } from '../store/compareStore.js';
import { 
  Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight,
  Star, Tag, Zap, RefreshCw, Eye, Scale, Compass, Check
} from 'lucide-react';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCompare, compareItems, removeFromCompare } = useCompareStore();

  // API State
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Search autocomplete suggestions state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Sidebar Filters State
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [selectedCondition, setSelectedCondition] = useState(searchParams.get('condition') || '');
  const [selectedSeller, setSelectedSeller] = useState(searchParams.get('sellerType') || '');
  const [isWholesale, setIsWholesale] = useState(searchParams.get('isWholesale') || '');
  const [selectedRating, setSelectedRating] = useState(searchParams.get('rating') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  // Sync state from query parameters on load
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedBrand(searchParams.get('brand') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSelectedCondition(searchParams.get('condition') || '');
    setSelectedSeller(searchParams.get('sellerType') || '');
    setIsWholesale(searchParams.get('isWholesale') || '');
    setSelectedRating(searchParams.get('rating') || '');
    setSortBy(searchParams.get('sort') || 'newest');
    setCurrentPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  // Fetch Static filters (Brands, Categories) on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const brandRes = await axios.get('/api/brands');
        if (brandRes.data.success) setBrands(brandRes.data.brands);
        const catRes = await axios.get('/api/categories');
        if (catRes.data.success) setCategories(catRes.data.categories);
      } catch (err) {
        console.error('Failed to load filter metadata:', err);
      }
    };
    fetchFilters();
  }, []);

  // Fetch Autocomplete Suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await axios.get(`/api/products/search/suggestions?query=${searchQuery}`);
        if (res.data.success) {
          setSuggestions(res.data.suggestions);
        }
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Fetch products with active queries
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedBrand) params.brand = selectedBrand;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (selectedCondition) params.condition = selectedCondition;
      if (selectedSeller) params.sellerType = selectedSeller;
      if (isWholesale) params.isWholesale = isWholesale;
      if (selectedRating) params.rating = selectedRating;
      if (sortBy) params.sort = sortBy;
      params.page = currentPage;
      params.limit = 8;

      const response = await axios.get('/api/products', { params });
      if (response.data.success) {
        setProducts(response.data.products);
        setTotalPages(response.data.pages);
        setTotalCount(response.data.total);
      }
    } catch (err) {
      console.error('Products fetch error:', err);
      // Fallback sample data if backend connection fails
      setProducts([
        {
          _id: 'p1',
          name: 'Aurelia Royal Gold Chronograph',
          brand: 'Aurelia Geneva',
          price: 1850,
          discount: 10,
          images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600'],
          rating: 4.9,
          reviewsCount: 38,
          sellerType: 'Business Seller',
          isWholesale: true,
          minOrderQuantity: 5,
          condition: 'New'
        },
        {
          _id: 'p2',
          name: 'Vintage Mahogany Leather Travel Trunk',
          brand: 'Louis Heritage',
          price: 680,
          discount: 0,
          images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600'],
          rating: 4.7,
          reviewsCount: 14,
          sellerType: 'Individual Seller',
          isWholesale: false,
          condition: 'Like New',
          isNegotiable: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand, minPrice, maxPrice, selectedCondition, selectedSeller, isWholesale, selectedRating, sortBy, currentPage]);

  const applyQueryString = (key, value, resetPage = true) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === '') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    if (resetPage) {
      nextParams.set('page', '1');
      setCurrentPage(1);
    }
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    applyQueryString('search', searchQuery);
  };

  const resetAllFilters = () => {
    setSearchParams({});
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedCondition('');
    setSelectedSeller('');
    setIsWholesale('');
    setSelectedRating('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const toggleCompare = (product) => {
    const isCompared = compareItems.find(item => item._id === product._id);
    if (isCompared) {
      removeFromCompare(product._id);
    } else {
      const result = addToCompare(product);
      if (!result.success) {
        alert(result.message);
      }
    }
  };

  return (
    <div class="max-w-7xl mx-auto px-6 py-12">
      {/* Search Header Container */}
      <div class="mb-10 text-center relative z-20">
        <h1 class="font-serif text-4.5xl font-bold text-luxury-blue-dark mb-4">The Exchange Catalog</h1>
        <p class="text-luxury-gray-dark text-sm max-w-lg mx-auto mb-6">
          Query secure catalogs for bulk enterprise wholesale or search local pickup deals from individual members.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} class="relative max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search products, luxury brands, or categories..."
            class="luxury-input pl-14 pr-24 py-4 rounded-2xl shadow-luxury border-white/60"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          <Search className="absolute left-5 top-4.5 text-luxury-gray w-5 h-5" />
          <button type="submit" class="btn-primary absolute right-2 top-2 py-2 px-5 text-xs uppercase tracking-widest bg-luxury-blue">
            Search
          </button>

          {/* Autocomplete Suggestions Box */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                class="glass-card-light absolute left-0 right-0 top-full mt-2 rounded-2xl shadow-2xl border border-white/60 text-left overflow-hidden z-30"
              >
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSearchQuery(sug);
                      applyQueryString('search', sug);
                    }}
                    class="w-full px-5 py-3 text-sm text-luxury-blue-dark hover:bg-luxury-blue/5 text-left font-medium transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 1. FILTER SIDEBAR */}
        <div class="lg:col-span-1 space-y-6">
          <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-md">
            <div class="flex items-center justify-between pb-4 border-b border-luxury-gray-medium/50 mb-6">
              <span class="font-serif text-lg font-bold text-luxury-blue flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-luxury-gold" /> Filter Criteria
              </span>
              <button 
                onClick={resetAllFilters} 
                class="text-[10px] font-bold tracking-widest text-luxury-gold-dark hover:text-luxury-gold uppercase"
              >
                Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div class="space-y-3 mb-6">
              <h4 class="text-xs font-bold text-luxury-blue-dark/70 tracking-wider uppercase">Category</h4>
              <select
                class="luxury-input py-2 text-sm"
                value={selectedCategory}
                onChange={(e) => applyQueryString('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div class="space-y-3 mb-6">
              <h4 class="text-xs font-bold text-luxury-blue-dark/70 tracking-wider uppercase">Price Range</h4>
              <div class="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min ($)"
                  class="luxury-input py-2 text-xs"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    applyQueryString('minPrice', e.target.value);
                  }}
                />
                <input
                  type="number"
                  placeholder="Max ($)"
                  class="luxury-input py-2 text-xs"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    applyQueryString('maxPrice', e.target.value);
                  }}
                />
              </div>
            </div>

            {/* Brand Filter */}
            <div class="space-y-3 mb-6">
              <h4 class="text-xs font-bold text-luxury-blue-dark/70 tracking-wider uppercase">Brand</h4>
              <select
                class="luxury-input py-2 text-sm"
                value={selectedBrand}
                onChange={(e) => applyQueryString('brand', e.target.value)}
              >
                <option value="">All Brands</option>
                {brands.map(b => (
                  <option key={b._id} value={b.slug}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Trade Channel Filters */}
            <div class="space-y-3 mb-6">
              <h4 class="text-xs font-bold text-luxury-blue-dark/70 tracking-wider uppercase">Trade Channel</h4>
              <div class="flex flex-col gap-2">
                <label class="flex items-center gap-2 text-sm text-luxury-blue-dark/80 font-medium">
                  <input
                    type="checkbox"
                    checked={isWholesale === 'true'}
                    onChange={(e) => applyQueryString('isWholesale', e.target.checked ? 'true' : '')}
                    class="accent-luxury-blue"
                  />
                  B2B Wholesale Only
                </label>
              </div>
            </div>

            {/* Condition Filters */}
            <div class="space-y-3 mb-6">
              <h4 class="text-xs font-bold text-luxury-blue-dark/70 tracking-wider uppercase">Product Condition</h4>
              <select
                class="luxury-input py-2 text-sm"
                value={selectedCondition}
                onChange={(e) => applyQueryString('condition', e.target.value)}
              >
                <option value="">Any Condition</option>
                <option value="New">Brand New</option>
                <option value="Like New">Used: Like New</option>
                <option value="Very Good">Used: Very Good</option>
                <option value="Good">Used: Good</option>
                <option value="Fair">Used: Fair</option>
                <option value="Poor">Used: Poor</option>
              </select>
            </div>

            {/* Seller Type Filter */}
            <div class="space-y-3 mb-6">
              <h4 class="text-xs font-bold text-luxury-blue-dark/70 tracking-wider uppercase">Seller Badge</h4>
              <div class="flex flex-col gap-2">
                {['Business Seller', 'Individual Seller', 'Admin'].map(role => (
                  <label key={role} class="flex items-center gap-2 text-sm text-luxury-blue-dark/80 font-medium">
                    <input
                      type="radio"
                      name="sellerType"
                      checked={selectedSeller === role}
                      onChange={() => applyQueryString('sellerType', role)}
                      class="accent-luxury-blue"
                    />
                    {role}
                  </label>
                ))}
                {selectedSeller && (
                  <button 
                    onClick={() => applyQueryString('sellerType', '')}
                    class="text-[10px] font-bold text-luxury-gold-dark hover:text-luxury-gold text-left uppercase tracking-wider"
                  >
                    Clear Seller Filter
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. PRODUCT GRID & RESULTS */}
        <div class="lg:col-span-3 space-y-8">
          {/* Grid control bar */}
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 glass-card-light rounded-2xl border border-white/60">
            <span class="text-sm font-semibold text-luxury-blue-dark/70">
              Showing <strong class="text-luxury-blue">{products.length}</strong> of <strong class="text-luxury-blue">{totalCount}</strong> listings
            </span>

            <div class="flex items-center gap-3">
              <ArrowUpDown className="w-4 h-4 text-luxury-gold" />
              <select
                class="luxury-input py-2 text-xs max-w-[180px] bg-transparent border-0 ring-0 focus:ring-0 outline-none font-bold"
                value={sortBy}
                onChange={(e) => applyQueryString('sort', e.target.value)}
              >
                <option value="newest">Newest Added</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Grid Items */}
          {isLoading ? (
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 6].map(skeleton => (
                <div key={skeleton} class="bg-white/40 h-96 rounded-2xl animate-pulse border border-white/20"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div class="text-center py-20 bg-white/40 border border-white/20 rounded-2xl p-10">
              <Compass className="w-16 h-16 text-luxury-gold mx-auto mb-4 animate-spin-slow" />
              <h3 class="font-serif text-xl font-bold text-luxury-blue-dark">No Listings Matched Your Query</h3>
              <p class="text-xs text-luxury-gray-dark max-w-sm mx-auto mt-2">
                Try expanding your price range, toggling B2B limits, or clearing search keywords.
              </p>
              <button onClick={resetAllFilters} class="btn-primary mt-6 text-xs uppercase tracking-widest">
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map(product => {
                const isCompared = compareItems.some(item => item._id === product._id);
                return (
                  <div 
                    key={product._id} 
                    class="group bg-white rounded-2xl overflow-hidden border border-luxury-gray-medium/30 hover:shadow-luxury transition-all duration-500 flex flex-col relative"
                  >
                    {/* Upper Badges */}
                    <div class="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                      <span class={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-full shadow-sm ${
                        product.isWholesale 
                          ? 'bg-luxury-blue text-white' 
                          : 'bg-luxury-gold text-luxury-blue-dark'
                      }`}>
                        {product.isWholesale ? 'B2B Wholesale' : 'Retail'}
                      </span>
                      
                      {product.condition !== 'New' && (
                        <span class="bg-luxury-gray-dark text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                          Used: {product.condition}
                        </span>
                      )}
                    </div>

                    {/* Action buttons (Quick View, Compare) */}
                    <div class="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => navigate(`/product/${product._id}`)}
                        class="p-2 bg-white hover:bg-luxury-blue hover:text-white text-luxury-blue rounded-full shadow-md transition-all duration-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toggleCompare(product)}
                        class={`p-2 rounded-full shadow-md transition-all duration-200 ${
                          isCompared 
                            ? 'bg-luxury-gold text-luxury-blue-dark' 
                            : 'bg-white hover:bg-luxury-blue hover:text-white text-luxury-blue'
                        }`}
                        title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
                      >
                        {isCompared ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Listing Image */}
                    <div class="h-56 overflow-hidden bg-luxury-gray-light cursor-pointer" onClick={() => navigate(`/product/${product._id}`)}>
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    {/* Listing Info */}
                    <div class="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div>
                        <span class="text-[10px] text-luxury-gray font-bold tracking-wider block uppercase mb-1">{product.brand || 'Luxury Catalog'}</span>
                        <h3 
                          onClick={() => navigate(`/product/${product._id}`)}
                          class="font-serif text-base font-bold text-luxury-blue-dark group-hover:text-luxury-gold transition-colors line-clamp-2 cursor-pointer"
                        >
                          {product.name}
                        </h3>
                      </div>

                      <div>
                        <div class="flex items-baseline gap-2 mb-2">
                          <span class="text-lg font-bold text-luxury-blue-dark">${product.price}</span>
                          {product.discount > 0 && (
                            <span class="text-xs line-through text-luxury-gray">${Math.round(product.price * (1 + product.discount/100))}</span>
                          )}
                        </div>

                        {/* Trade criteria tags */}
                        <div class="flex items-center gap-3 text-[10px] font-bold text-luxury-gray-dark pt-3 border-t border-luxury-gray-medium/40">
                          {product.isWholesale ? (
                            <span class="flex items-center gap-1 text-luxury-blue-light">
                              <Zap className="w-3.5 h-3.5" /> MOQ: {product.minOrderQuantity}
                            </span>
                          ) : (
                            <span class="flex items-center gap-1 text-luxury-gold-dark">
                              <RefreshCw className="w-3.5 h-3.5" /> {product.isNegotiable ? 'Negotiable' : 'Fixed Price'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. PAGINATION ROW */}
          {totalPages > 1 && (
            <div class="flex items-center justify-center gap-4 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => applyQueryString('page', currentPage - 1, false)}
                class="p-2 border border-luxury-gray-medium text-luxury-blue-dark rounded-full hover:bg-luxury-blue hover:text-white transition-all disabled:opacity-40"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span class="text-sm font-semibold text-luxury-blue-dark">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => applyQueryString('page', currentPage + 1, false)}
                class="p-2 border border-luxury-gray-medium text-luxury-blue-dark rounded-full hover:bg-luxury-blue hover:text-white transition-all disabled:opacity-40"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
