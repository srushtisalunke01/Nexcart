import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuthStore } from './store/authStore.js';
import { LogOut, Menu, Scale } from 'lucide-react';
import Catalog from './pages/Catalog.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Compare from './pages/Compare.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Profile from './pages/Profile.jsx';
import CategoryNav from './components/CategoryNav.jsx';
import { useCompareStore } from './store/compareStore.js';
import { useCartStore } from './store/cartStore.js';
import { useWishlistStore } from './store/wishlistStore.js';
import { 
  ShoppingBag, 
  Search, 
  User, 
  Heart, 
  Layers, 
  MessageSquare, 
  Sparkles,
  TrendingUp,
  Tag,
  ArrowRight,
  ShieldCheck,
  Zap,
  RefreshCw,
  Compass
} from 'lucide-react';

// Sample Mock Data showcasing B2B wholesale and C2C used items alongside standard items
const sampleProducts = [
  {
    id: 'p1',
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
    bulkPricing: [{ minQuantity: 5, price: 1500 }],
    condition: 'New'
  },
  {
    id: 'p2',
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
    isNegotiable: true,
    localPickupOnly: true
  },
  {
    id: 'p3',
    name: 'Luminary Silk Evening Gown',
    brand: 'Atelier Luminary',
    price: 3200,
    discount: 15,
    images: ['https://images.unsplash.com/photo-1539008885128-40344b0567f3?auto=format&fit=crop&q=80&w=600'],
    rating: 5.0,
    reviewsCount: 22,
    sellerType: 'Business Seller',
    isWholesale: false,
    condition: 'New'
  },
  {
    id: 'p4',
    name: 'Retina OLED Pro Display (2025)',
    brand: 'VisionTech',
    price: 890,
    discount: 20,
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600'],
    rating: 4.5,
    reviewsCount: 9,
    sellerType: 'Individual Seller',
    isWholesale: false,
    condition: 'Very Good',
    isNegotiable: true
  }
];

const AuthWidget = () => {
  const { user, logout } = useAuthStore();

  if (user) {
    return (
      <div class="flex items-center gap-3">
        <Link to="/profile" class="flex items-center gap-2 hover:opacity-85 transition-opacity">
          <div class="w-8 h-8 rounded-full bg-luxury-blue-light flex items-center justify-center text-white text-xs font-bold shadow-inner border border-luxury-gold/30">
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div class="hidden lg:block text-left">
            <span class="block text-xs font-bold text-luxury-blue-dark leading-tight">{user.name}</span>
            <span class="block text-[9px] font-semibold text-luxury-gold-dark uppercase leading-none">{user.role}</span>
          </div>
        </Link>
        <button 
          onClick={logout} 
          class="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-all duration-200"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <Link 
      to="/login" 
      class="text-xs font-bold uppercase tracking-widest text-luxury-blue border border-luxury-blue/40 px-4 py-1.5 rounded-full hover:bg-luxury-blue hover:text-white transition-all duration-300"
    >
      Sign In
    </Link>
  );
};

// Header / Navigation Component
const Navbar = ({ onOpenCategories }) => {
  const { compareItems } = useCompareStore();
  const { cartItems } = useCartStore();
  const { wishlistItems } = useWishlistStore();

  return (
    <nav class="glass-navbar sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-luxury-blue to-luxury-gold flex items-center justify-center shadow-md">
          <Compass className="text-white w-6 h-6 animate-spin-slow" />
        </div>
        <div>
          <span class="font-serif text-2xl font-bold tracking-wider text-luxury-blue">NEXUS</span>
          <span class="font-sans text-xs block font-semibold tracking-widest text-luxury-gold uppercase -mt-1.5">ONE</span>
        </div>
      </div>

      <div class="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-luxury-blue/80">
        <Link to="/" class="hover:text-luxury-gold transition-colors duration-200">Home</Link>
        <button 
          onClick={onOpenCategories}
          class="hover:text-luxury-gold transition-colors duration-200 flex items-center gap-1 font-semibold outline-none"
        >
          <Menu className="w-4 h-4" /> Departments
        </button>
        <Link to="/shop" class="hover:text-luxury-gold transition-colors duration-200">Explore Catalog</Link>
        <Link to="/shop?isWholesale=true" class="hover:text-luxury-gold transition-colors duration-200 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" /> B2B Wholesale
        </Link>
        <Link to="/shop?condition=Like%20New" class="hover:text-luxury-gold transition-colors duration-200 flex items-center gap-1">
          <Tag className="w-3.5 h-3.5" /> Used Items (C2C)
        </Link>
      </div>

      <div class="flex items-center gap-4 text-luxury-blue">
        <button class="p-2 hover:bg-luxury-gray-medium/30 rounded-full transition-all duration-200">
          <Search className="w-5 h-5" />
        </button>
        <Link 
          to="/compare" 
          class="p-2 hover:bg-luxury-gray-medium/30 rounded-full transition-all duration-200 relative"
          title="Compare Products"
        >
          <Scale className="w-5 h-5" />
          {compareItems.length > 0 && (
            <span class="absolute -top-1 -right-1 bg-luxury-gold text-luxury-blue-dark text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {compareItems.length}
            </span>
          )}
        </Link>
        <Link 
          to="/wishlist" 
          class="p-2 hover:bg-luxury-gray-medium/30 rounded-full transition-all duration-200 relative"
          title="My Wishlist"
        >
          <Heart className="w-5 h-5" />
          {wishlistItems.length > 0 && (
            <span class="absolute -top-1 -right-1 bg-luxury-blue text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {wishlistItems.length}
            </span>
          )}
        </Link>
        <Link 
          to="/cart" 
          class="p-2 hover:bg-luxury-gray-medium/30 rounded-full transition-all duration-200 relative"
          title="Shopping Cart"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartItems.length > 0 && (
            <span class="absolute -top-1 -right-1 bg-luxury-blue text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          )}
        </Link>
        <div class="h-6 w-[1px] bg-luxury-gray-medium"></div>
        <AuthWidget />
      </div>
    </nav>
  );
};

// Luxury Splash Screen Component
const LandingHero = () => {
  return (
    <div class="relative min-h-[85vh] flex items-center justify-center px-6 overflow-hidden bg-gradient-to-b from-white to-luxury-gray-light">
      {/* Decorative Floating Shapes */}
      <div class="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-luxury-blue/5 blur-3xl animate-luxury-float"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-luxury-gold/5 blur-3xl animate-luxury-float" style={{ animationDelay: '2s' }}></div>

      <div class="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          class="space-y-6"
        >
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold-dark text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Full-Stack Marketplace
          </div>
          
          <h1 class="font-serif text-5xl md:text-6xl font-bold leading-tight text-luxury-blue-dark">
            The Luxury Gateway for <span class="font-serif italic text-luxury-gold gold-glow-text">Global Trade</span>
          </h1>
          
          <p class="text-luxury-gray-dark text-lg leading-relaxed max-w-xl">
            NEXUS ONE bridges elite enterprises and boutique individual sellers. Discover luxury retail, secure B2B bulk purchases, and high-fidelity C2C secondhand items all in one unified, secure ecosystem.
          </p>

          <div class="flex flex-wrap items-center gap-4 pt-4">
            <Link to="/shop" class="btn-primary flex items-center gap-2 group">
              Start Shopping <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/register-vendor" class="btn-secondary">
              Become a Seller
            </Link>
          </div>

          <div class="grid grid-cols-3 gap-6 pt-8 border-t border-luxury-gray-medium">
            <div>
              <span class="block text-2xl font-bold text-luxury-blue">100%</span>
              <span class="text-xs text-luxury-gray-dark font-medium uppercase tracking-wider">Verified Sellers</span>
            </div>
            <div>
              <span class="block text-2xl font-bold text-luxury-blue">B2B</span>
              <span class="text-xs text-luxury-gray-dark font-medium uppercase tracking-wider">MOQ & Bulk Rates</span>
            </div>
            <div>
              <span class="block text-2xl font-bold text-luxury-blue">C2C</span>
              <span class="text-xs text-luxury-gray-dark font-medium uppercase tracking-wider">Negotiable Trade</span>
            </div>
          </div>
        </motion.div>

        {/* Elegant Banner Carousel Image Stack */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          class="relative flex justify-center lg:justify-end"
        >
          <div class="relative w-80 h-96 md:w-96 md:h-[450px] rounded-3xl overflow-hidden shadow-luxury border-4 border-white transform rotate-3 bg-luxury-blue-deep flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800" 
              alt="Premium Storefront" 
              class="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity hover:opacity-85 transition-opacity duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-luxury-blue-dark via-transparent to-transparent"></div>
            <div class="absolute bottom-8 left-8 right-8 text-white space-y-2">
              <span class="text-luxury-gold font-bold text-xs uppercase tracking-widest">NEXUS EXCLUSIVE</span>
              <h3 class="font-serif text-2xl font-bold">Curated Luxury Collections</h3>
              <p class="text-xs text-luxury-gray">Tailored experiences for collectors and businesses alike.</p>
            </div>
          </div>

          {/* Overlapping mini stats card */}
          <div class="glass-card-light absolute -bottom-6 -left-6 p-5 rounded-2xl shadow-luxury max-w-[200px] border border-white/60">
            <div class="flex items-center gap-3 text-luxury-gold mb-2">
              <ShieldCheck className="w-6 h-6" />
              <span class="text-[10px] font-bold tracking-widest uppercase">Escrow Secured</span>
            </div>
            <p class="text-xs font-semibold text-luxury-blue-dark">Every transaction fully protected with instant payouts.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Explore Catalog Component with Category Cards & Sample Products
const CatalogSection = () => {
  const [filterType, setFilterType] = useState('All');

  const filteredProducts = filterType === 'All' 
    ? sampleProducts 
    : sampleProducts.filter(p => {
        if (filterType === 'B2B') return p.isWholesale;
        if (filterType === 'C2C') return p.sellerType === 'Individual Seller';
        return true;
      });

  return (
    <section class="py-20 px-6 max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span class="text-xs text-luxury-gold font-bold tracking-widest uppercase block mb-2">Exclusive Showcases</span>
          <h2 class="font-serif text-3.5xl font-bold text-luxury-blue-dark">Curated Marketplace Listings</h2>
        </div>
        <div class="flex gap-2 mt-6 md:mt-0 bg-white/60 p-1.5 rounded-full border border-luxury-gray-medium/50 max-w-max">
          {['All', 'B2B', 'C2C'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              class={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 ${
                filterType === tab 
                  ? 'bg-luxury-blue text-white shadow-sm' 
                  : 'text-luxury-blue-dark/70 hover:text-luxury-blue'
              }`}
            >
              {tab === 'All' ? 'All Listings' : tab === 'B2B' ? 'Business Wholesale' : 'Individual Sellers'}
            </button>
          ))}
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            class="group bg-white rounded-2xl overflow-hidden border border-luxury-gray-medium/30 hover:shadow-luxury transition-all duration-500 flex flex-col relative"
          >
            {/* Tag / Condition */}
            <div class="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
              <span class={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
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

            {/* Product Image */}
            <div class="h-64 overflow-hidden relative bg-luxury-gray-light">
              <img 
                src={product.images[0]} 
                alt={product.name}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Product details */}
            <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
              <div>
                <span class="text-xs text-luxury-gray font-bold tracking-wider block uppercase mb-1">{product.brand}</span>
                <h3 class="font-serif text-lg font-bold text-luxury-blue-dark group-hover:text-luxury-gold transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </div>

              <div>
                <div class="flex items-baseline gap-2 mb-2">
                  <span class="text-xl font-bold text-luxury-blue-dark">${product.price}</span>
                  {product.discount > 0 && (
                    <span class="text-xs line-through text-luxury-gray">${Math.round(product.price * (1 + product.discount/100))}</span>
                  )}
                </div>

                {/* B2B / C2C Metadata icons */}
                <div class="flex items-center gap-4 text-xs font-semibold text-luxury-gray-dark pt-3 border-t border-luxury-gray-medium/40">
                  {product.isWholesale ? (
                    <span class="flex items-center gap-1.5 text-luxury-blue-light">
                      <Zap className="w-3.5 h-3.5" /> MOQ: {product.minOrderQuantity}
                    </span>
                  ) : (
                    <span class="flex items-center gap-1.5 text-luxury-gold-dark">
                      <RefreshCw className="w-3.5 h-3.5" /> {product.isNegotiable ? 'Negotiable' : 'Fixed Price'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Trust Features Section
const FeaturesSection = () => {
  return (
    <section class="bg-luxury-blue-deep text-white py-20 px-6">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div class="space-y-3">
          <div class="w-12 h-12 rounded-xl bg-luxury-gold/15 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 class="font-serif text-xl font-bold">Vetted Entities</h3>
          <p class="text-luxury-gray text-sm leading-relaxed">
            All commercial vendors go through license checking and verification before posting wholesale catalogs to avoid fraud.
          </p>
        </div>
        
        <div class="space-y-3">
          <div class="w-12 h-12 rounded-xl bg-luxury-gold/15 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold mb-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 class="font-serif text-xl font-bold">B2B RFQ Negotiation</h3>
          <p class="text-luxury-gray text-sm leading-relaxed">
            Send custom requests for quotations (RFQ), negotiate volume pricing tiers, and close escrow contracts directly through the chat.
          </p>
        </div>

        <div class="space-y-3">
          <div class="w-12 h-12 rounded-xl bg-luxury-gold/15 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 class="font-serif text-xl font-bold">Real-time Stock Monitor</h3>
          <p class="text-luxury-gray text-sm leading-relaxed">
            Integrated warehouse levels show current inventory allocations and trigger restock suggestions dynamically.
          </p>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer class="bg-white border-t border-luxury-gray-medium/50 py-12 px-6">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-luxury-gray-dark">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-luxury-blue flex items-center justify-center text-white text-sm font-bold">N</div>
          <span class="font-serif font-bold text-luxury-blue text-base">NEXUS ONE</span>
        </div>
        <div class="flex gap-6">
          <a href="#" class="hover:text-luxury-gold transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-luxury-gold transition-colors">Terms of Trade</a>
          <a href="#" class="hover:text-luxury-gold transition-colors">API Docs</a>
        </div>
        <div>
          &copy; {new Date().getFullYear()} NEXUS ONE Inc. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

// Main Routing and Component Assembly
const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LandingHero />
      <CatalogSection />
      <FeaturesSection />
    </motion.div>
  );
};

function App() {
  const [isCatNavOpen, setIsCatNavOpen] = useState(false);

  return (
    <Router>
      <div class="min-h-screen flex flex-col">
        <Navbar onOpenCategories={() => setIsCatNavOpen(true)} />
        <CategoryNav isOpen={isCatNavOpen} onClose={() => setIsCatNavOpen(false)} />
        <main class="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

            {/* Protected Routes (Authenticated members only) */}
            <Route element={<ProtectedRoute allowedRoles={['Customer', 'Individual Seller', 'Business Seller', 'Admin']} />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
