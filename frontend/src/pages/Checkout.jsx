import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useCartStore } from '../store/cartStore.js';
import api from '../services/api.js';
import { 
  CreditCard, Truck, ShieldCheck, ShoppingBag, ArrowLeft, CheckCircle2, Loader2, Sparkles
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartSubtotal, getDiscountAmount, getCartTotal, coupon, clearCart } = useCartStore();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddrId, setSelectedAddrId] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zip: '',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Address form fields error
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (cartItems.length === 0 && !orderComplete) {
      navigate('/shop');
      return;
    }
    fetchSavedAddresses();
  }, []);

  const fetchSavedAddresses = async () => {
    try {
      const res = await api.get('/profile/addresses');
      if (res.data.success) {
        setAddresses(res.data.addresses);
        const defAddr = res.data.addresses.find(a => a.isDefault);
        if (defAddr) {
          setSelectedAddrId(defAddr._id);
          populateAddressForm(defAddr);
        }
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  const populateAddressForm = (addr) => {
    setShippingAddress({
      name: addr.name,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      country: addr.country,
      zip: addr.zip,
      phone: addr.phone,
    });
  };

  const handleAddressSelect = (e) => {
    const id = e.target.value;
    setSelectedAddrId(id);
    if (id === 'new') {
      setShippingAddress({
        name: '',
        street: '',
        city: '',
        state: '',
        country: '',
        zip: '',
        phone: '',
      });
    } else {
      const match = addresses.find(a => a._id === id);
      if (match) populateAddressForm(match);
    }
  };

  const validateAddressForm = () => {
    const { name, street, city, state, country, zip, phone } = shippingAddress;
    return name && street && city && state && country && zip && phone;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateAddressForm()) {
      setFormError('Please fill in all shipping details before placing order.');
      return;
    }

    setIsLoading(true);
    try {
      const itemsPayload = cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      }));

      const res = await api.post('/orders', {
        items: itemsPayload,
        shippingAddress,
        paymentMethod,
        couponCode: coupon?.code || null,
      });

      if (res.data.success) {
        setCreatedOrder(res.data.order);
        setOrderComplete(true);
        clearCart();
        
        // Trigger celebration confetti
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Transaction could not be completed.');
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = getCartSubtotal();
  const discount = getDiscountAmount();
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.round((subtotal - discount) * 0.08);
  const total = getCartTotal();

  if (orderComplete) {
    return (
      <div class="max-w-xl mx-auto py-20 px-6 text-center space-y-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          class="w-20 h-20 bg-luxury-gold/15 rounded-full flex items-center justify-center text-luxury-gold mx-auto border-2 border-luxury-gold/30 shadow-md"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        
        <h2 class="font-serif text-3.5xl font-bold text-luxury-blue-dark">Acquisition Completed</h2>
        <p class="text-xs text-luxury-gray-dark max-w-sm mx-auto leading-relaxed">
          Your order has been signed, encrypted, and locked in escrow. Tracking transaction: <span class="font-bold text-luxury-blue">{createdOrder?._id}</span>
        </p>

        <div class="p-6 rounded-2xl bg-white border border-luxury-gray-medium/50 shadow-sm text-left text-xs font-semibold text-luxury-blue-dark space-y-3">
          <div class="flex justify-between border-b pb-2">
            <span>Payment Method</span>
            <span>{paymentMethod}</span>
          </div>
          <div class="flex justify-between border-b pb-2">
            <span>Escrow Holding Price</span>
            <span>${total}</span>
          </div>
          <div class="flex justify-between">
            <span>Recipient Address</span>
            <span>{shippingAddress.street}, {shippingAddress.city}</span>
          </div>
        </div>

        <div class="pt-6 flex justify-center gap-4">
          <Link to="/profile" class="btn-primary text-xs uppercase tracking-widest bg-luxury-blue flex items-center gap-2">
            Go to Profile Dashboard <Sparkles className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="flex items-center justify-between mb-10 pb-6 border-b border-luxury-gray-medium/50">
        <div>
          <span class="text-xs text-luxury-gold font-bold tracking-widest uppercase block mb-1">Vault Settlement</span>
          <h1 class="font-serif text-3.5xl font-bold text-luxury-blue-dark">Escrow Settlement</h1>
        </div>
        <Link to="/cart" class="inline-flex items-center gap-1.5 text-xs font-bold text-luxury-blue hover:text-luxury-blue-light transition-colors">
          <ArrowLeft className="w-4 h-4" /> Return to Cart
        </Link>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout input column */}
        <form onSubmit={handlePlaceOrder} class="lg:col-span-2 space-y-8">
          {/* Shipping Address Deck */}
          <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm space-y-6 text-left">
            <h3 class="font-serif text-lg font-bold text-luxury-blue-dark flex items-center gap-2">
              <Truck className="w-5 h-5 text-luxury-gold" /> 1. Shipping Registry
            </h3>

            {/* Address select menu if saved addresses exist */}
            {addresses.length > 0 && (
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-luxury-blue-dark/80 tracking-wider uppercase block">Select Saved Address</label>
                <select 
                  class="luxury-input text-xs py-2.5 font-bold"
                  value={selectedAddrId}
                  onChange={handleAddressSelect}
                >
                  {addresses.map(addr => (
                    <option key={addr._id} value={addr._id}>{addr.title} - {addr.name} ({addr.city})</option>
                  ))}
                  <option value="new">+ Enter New Address</option>
                </select>
              </div>
            )}

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-luxury-blue-dark/80 tracking-wider uppercase block">Recipient Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Smith" 
                  class="luxury-input py-2.5 text-xs font-bold"
                  value={shippingAddress.name}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                />
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-luxury-blue-dark/80 tracking-wider uppercase block">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+1 555-0100" 
                  class="luxury-input py-2.5 text-xs font-bold"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                />
              </div>

              <div class="space-y-1.5 md:col-span-2">
                <label class="text-xs font-bold text-luxury-blue-dark/80 tracking-wider uppercase block">Street Address</label>
                <input 
                  type="text" 
                  placeholder="123 Luxury Penthouse Drive" 
                  class="luxury-input py-2.5 text-xs font-bold"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                />
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-luxury-blue-dark/80 tracking-wider uppercase block">City</label>
                <input 
                  type="text" 
                  placeholder="Beverly Hills" 
                  class="luxury-input py-2.5 text-xs font-bold"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                />
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-luxury-blue-dark/80 tracking-wider uppercase block">State / Region</label>
                <input 
                  type="text" 
                  placeholder="California" 
                  class="luxury-input py-2.5 text-xs font-bold"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                />
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-luxury-blue-dark/80 tracking-wider uppercase block">Country</label>
                <input 
                  type="text" 
                  placeholder="United States" 
                  class="luxury-input py-2.5 text-xs font-bold"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                />
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-luxury-blue-dark/80 tracking-wider uppercase block">Postal/ZIP Code</label>
                <input 
                  type="text" 
                  placeholder="90210" 
                  class="luxury-input py-2.5 text-xs font-bold"
                  value={shippingAddress.zip}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Payment Gateways Deck */}
          <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm space-y-6 text-left">
            <h3 class="font-serif text-lg font-bold text-luxury-blue-dark flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-luxury-gold" /> 2. Safe-Deposit Protocols
            </h3>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 'Card', title: 'Credit Card', desc: 'Secure Stripe Checkout' },
                { id: 'PayPal', title: 'PayPal Vault', desc: 'Encrypted transfer' },
                { id: 'Wallet', title: 'Sim Wallet', desc: 'NEXUS tokens credit' },
                { id: 'COD', title: 'Escrow COD', desc: 'Pay at drop location' }
              ].map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  class={`p-4 rounded-xl border flex flex-col text-left justify-between h-24 transition-all duration-300 ${
                    paymentMethod === method.id 
                      ? 'border-luxury-gold bg-luxury-blue/5 shadow-inner' 
                      : 'border-luxury-gray-medium/50 hover:bg-luxury-gray-light bg-white/50'
                  }`}
                >
                  <span class="text-xs font-bold text-luxury-blue-dark">{method.title}</span>
                  <span class="text-[9px] text-luxury-gray-dark font-medium leading-none">{method.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {formError && (
            <div class="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold text-left">
              ⚠️ {formError}
            </div>
          )}

          {/* Checkout triggers */}
          <div class="text-left flex items-center gap-4">
            <button
              type="submit"
              disabled={isLoading}
              class="btn-primary py-3.5 px-8 flex items-center justify-center gap-2 text-xs uppercase tracking-widest bg-luxury-blue disabled:opacity-50 disabled:cursor-not-allowed font-bold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" /> Verifying Escrow Ledger...
                </>
              ) : (
                <>
                  Verify & Execute Transaction
                </>
              )}
            </button>
            <Link to="/cart" class="text-xs font-bold text-luxury-blue hover:text-luxury-blue-light transition-colors uppercase tracking-widest">
              Modify Order
            </Link>
          </div>
        </form>

        {/* Pricing Summary display */}
        <div class="space-y-6">
          <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-md space-y-6 text-left">
            <h3 class="font-serif text-lg font-bold text-luxury-blue-dark pb-4 border-b border-luxury-gray-medium/50 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-luxury-gold" /> Order Sheet
            </h3>

            {/* Cart item catalog snippets */}
            <div class="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item, idx) => (
                <div key={idx} class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-lg overflow-hidden bg-luxury-gray-light flex-shrink-0">
                    <img src={item.product.images?.[0]} alt="thumb" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-grow min-w-0">
                    <h4 class="font-semibold text-xs text-luxury-blue-dark truncate leading-tight">{item.product.name}</h4>
                    <span class="text-[10px] text-luxury-gray font-bold block mt-0.5">{item.quantity} units @ ${item.product.price}</span>
                  </div>
                  <span class="text-xs font-bold text-luxury-blue-dark">${item.quantity * item.product.price}</span>
                </div>
              ))}
            </div>

            <div class="pt-4 border-t border-luxury-gray-medium/50 space-y-3 text-xs font-semibold text-luxury-blue-dark">
              <div class="flex justify-between">
                <span class="text-luxury-gray-dark">Subtotal</span>
                <span>${subtotal}</span>
              </div>
              {discount > 0 && (
                <div class="flex justify-between text-luxury-gold-dark">
                  <span>Coupon Deduction</span>
                  <span>-${discount}</span>
                </div>
              )}
              <div class="flex justify-between">
                <span class="text-luxury-gray-dark">Transport Duties</span>
                <span>{shipping === 0 ? 'Free Shipping' : `$${shipping}`}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-luxury-gray-dark">Escrow Duties / VAT (8%)</span>
                <span>${tax}</span>
              </div>
              <div class="pt-4 border-t border-luxury-gray-medium/50 flex justify-between text-base font-bold text-luxury-blue-dark">
                <span>Settlement Price</span>
                <span class="text-luxury-gold-dark font-serif">${total}</span>
              </div>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-luxury-blue-deep text-white border border-luxury-gold/20 flex gap-3 shadow-md text-left">
            <ShieldCheck className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-0.5" />
            <div>
              <h4 class="font-serif text-sm font-bold text-luxury-gold leading-tight">Secured Escrow Trade</h4>
              <p class="text-[10px] text-luxury-gray mt-1 leading-relaxed">
                Funds are temporarily locked in the secure NEXUS ONE Escrow account. Disbursements will only release to vendor accounts once shipping has been verified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
