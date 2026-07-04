import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Mic, QrCode, Image as ImageIcon, ChevronDown, 
  User, Heart, ShoppingCart, Bell, Sparkles, Sun, Moon, Languages, Menu
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { PRODUCTS } from '../data/mockData';
import { VoiceSearchModal } from './VoiceSearchModal';
import { ScannerModal } from './ScannerModal';
import { ImageSearchModal } from './ImageSearchModal';

interface HeaderProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
  currentPage: string;
  onToggleCategoryMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage, onToggleCategoryMenu }) => {
  const { 
    cart, wishlist, selectedAddress, addresses, selectAddress, 
    notifications, markNotificationsAsRead 
  } = useCart();
  
  const { theme, toggleTheme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  // Modals state
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Filter products for search suggestions
  const searchSuggestions = searchQuery.trim() 
    ? PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchSuggestions(false);
      }
      if (addressRef.current && !addressRef.current.contains(e.target as Node)) {
        setShowAddressDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onNavigate('home', { search: searchQuery });
    setShowSearchSuggestions(false);
  };

  const handleSuggestionClick = (prodId: string) => {
    onNavigate('product-details', { id: prodId });
    setSearchQuery('');
    setShowSearchSuggestions(false);
  };

  const triggerModalSearch = (query: string) => {
    setSearchQuery(query);
    onNavigate('home', { search: query });
  };

  const handleSelectProductFromScanner = (prodId: string) => {
    onNavigate('product-details', { id: prodId });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-premium-cardDark/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/50 shadow-soft transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Logo & Category trigger */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onToggleCategoryMenu}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Custom Premium Logo with Fallback */}
            <div 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              {!logoError ? (
                <img 
                  src="/logo.png" 
                  alt="NexCart Logo" 
                  className="h-10 w-10 object-contain rounded-xl"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <svg className="h-9 w-9 text-brand-500 fill-current" viewBox="0 0 100 100">
                  <rect width="100" height="100" rx="25" fill="#FF6B00" />
                  <path 
                    d="M30 35 L45 35 L55 65 L75 65" 
                    stroke="white" 
                    strokeWidth="7" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    fill="none" 
                  />
                  <circle cx="48" cy="78" r="7" fill="white" />
                  <circle cx="71" cy="78" r="7" fill="white" />
                </svg>
              )}
              <span className="hidden sm:block text-2xl font-display font-extrabold">
                <span className="text-slate-800 dark:text-white">Nex</span>
                <span className="text-cyber-gold text-glow-gold">Cart</span>
              </span>
            </div>
          </div>

          {/* Delivery Location dropdown */}
          <div className="hidden lg:block relative" ref={addressRef}>
            <button 
              onClick={() => setShowAddressDropdown(!showAddressDropdown)}
              className="flex items-center gap-2 text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none"
            >
              <MapPin className="h-5 w-5 text-brand-500" />
              <div className="text-xs">
                <p className="text-slate-400 font-medium">Deliver to</p>
                <p className="font-bold text-slate-800 dark:text-white max-w-[120px] truncate">
                  {selectedAddress ? `${selectedAddress.name} (${selectedAddress.zipCode})` : "Choose Address"}
                </p>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            <AnimatePresence>
              {showAddressDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 mt-2 w-64 rounded-xl bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800 shadow-xl p-3"
                >
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Select Delivery Address</h4>
                  <div className="space-y-1">
                    {addresses.map(addr => (
                      <button
                        key={addr.id}
                        onClick={() => {
                          selectAddress(addr.id);
                          setShowAddressDropdown(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          selectedAddress?.id === addr.id
                            ? 'bg-brand-50 text-brand-600 font-semibold dark:bg-brand-500/10'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{addr.name}</p>
                          <p className="text-[10px] text-slate-400">{addr.street}, {addr.city}</p>
                        </div>
                        {selectedAddress?.id === addr.id && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                      onNavigate('profile', { section: 'addresses' });
                      setShowAddressDropdown(false);
                    }}
                    className="w-full text-center mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-brand-500 font-bold hover:text-brand-600"
                  >
                    Manage Addresses
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Search Bar */}
          <div className="flex-1 max-w-xl relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-brand-300 dark:hover:border-brand-800 transition-colors focus-within:border-brand-500 dark:focus-within:border-brand-500">
              <input
                type="text"
                placeholder="Search premium gadgets, fashion, watches..."
                value={searchQuery}
                onFocus={() => setShowSearchSuggestions(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-transparent text-sm focus:outline-none dark:text-white pr-24"
              />
              
              {/* Media tools */}
              <div className="absolute right-12 flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                <button 
                  type="button" 
                  onClick={() => setIsVoiceOpen(true)}
                  className="p-1 hover:text-brand-500 rounded transition-colors"
                  title="Voice Search"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsImageSearchOpen(true)}
                  className="p-1 hover:text-brand-500 rounded transition-colors"
                  title="Image Search"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsScannerOpen(true)}
                  className="p-1 hover:text-brand-500 rounded transition-colors"
                  title="Barcode Scanner"
                >
                  <QrCode className="h-4 w-4" />
                </button>
              </div>

              <button 
                type="submit"
                className="absolute right-0 h-full px-4 gradient-orange text-white flex items-center justify-center hover:opacity-90"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            {/* AI Search suggestions */}
            <AnimatePresence>
              {showSearchSuggestions && searchSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute w-full mt-2 rounded-2xl bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden p-2"
                >
                  <div className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-brand-500 bg-brand-50/50 dark:bg-brand-500/10 rounded-xl mb-1">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    <span>AI Search Recommendations</span>
                  </div>
                  {searchSuggestions.map(prod => (
                    <button
                      key={prod.id}
                      onClick={() => handleSuggestionClick(prod.id)}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
                    >
                      <img src={prod.images[0]} alt={prod.name} className="h-10 w-10 object-contain bg-slate-50 rounded-lg p-1 dark:bg-slate-900" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{prod.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{prod.brand} • ${prod.discountPrice}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Header Navigation controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Dark Mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="hidden md:flex items-center gap-1 p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <Languages className="h-5 w-5" />
                <span className="text-xs font-bold">{selectedLanguage}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              <AnimatePresence>
                {showLangDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-32 rounded-xl bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden p-1 z-55"
                  >
                    {['EN', 'ES', 'DE', 'FR'].map(lang => (
                      <button
                        key={lang}
                        onClick={() => {
                          setSelectedLanguage(lang);
                          setShowLangDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                          selectedLanguage === lang
                            ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {lang === 'EN' && "English (EN)"}
                        {lang === 'ES' && "Español (ES)"}
                        {lang === 'DE' && "Deutsch (DE)"}
                        {lang === 'FR' && "Français (FR)"}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications Trigger */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  markNotificationsAsRead();
                }}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800 shadow-xl p-3 z-50 max-h-96 overflow-y-auto"
                  >
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Alerts & Notifications</h4>
                    <div className="space-y-2">
                      {notifications.map(n => (
                        <div 
                          key={n.id} 
                          className={`p-2.5 rounded-lg border text-xs transition-colors ${
                            !n.read 
                              ? 'bg-brand-50/30 border-brand-100 dark:bg-brand-500/5 dark:border-brand-500/20' 
                              : 'bg-white border-slate-100 dark:bg-slate-900/10 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <span className="font-bold text-slate-800 dark:text-white leading-tight">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.date}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 leading-normal">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist button */}
            <button
              onClick={() => onNavigate('profile', { section: 'wishlist' })}
              className={`p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative ${
                currentPage === 'profile' ? 'text-brand-500' : 'text-slate-600 dark:text-slate-300'
              }`}
              title="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => onNavigate('cart')}
              className={`p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative ${
                currentPage === 'cart' ? 'text-brand-500' : 'text-slate-600 dark:text-slate-300'
              }`}
              title="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalCartItems > 0 && (
                <motion.span 
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  key={totalCartItems}
                  className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white shadow-sm shadow-brand-500/20"
                >
                  {totalCartItems}
                </motion.span>
              )}
            </button>

            {/* Profile Menu */}
            <button
              onClick={() => onNavigate('profile')}
              className={`p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-1.5 ${
                currentPage === 'profile' ? 'text-brand-500' : 'text-slate-600 dark:text-slate-300'
              }`}
              title="My Account"
            >
              <User className="h-5 w-5" />
              <span className="hidden lg:inline text-xs font-bold">Account</span>
            </button>

          </div>
        </div>
      </div>

      {/* Simulator Modals */}
      <VoiceSearchModal 
        isOpen={isVoiceOpen} 
        onClose={() => setIsVoiceOpen(false)} 
        onSearch={triggerModalSearch} 
      />
      <ScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onSelectProduct={handleSelectProductFromScanner} 
      />
      <ImageSearchModal 
        isOpen={isImageSearchOpen} 
        onClose={() => setIsImageSearchOpen(false)} 
        onSearch={triggerModalSearch} 
      />
    </header>
  );
};
