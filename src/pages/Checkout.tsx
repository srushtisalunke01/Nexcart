import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, Wallet, Truck, Landmark, ShieldCheck, MapPin, 
  ChevronRight, CheckCircle2, Copy, Compass, Calendar
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import confetti from 'canvas-confetti';

interface CheckoutProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onNavigate }) => {
  const { 
    cart, addresses, selectedAddress, selectAddress, addAddress,
    walletBalance, appliedCoupon, placeOrder 
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'Card' | 'UPI' | 'Wallet' | 'COD'>('Card');
  const [checkoutStep, setCheckoutStep] = useState<'billing' | 'payment' | 'success'>('billing');
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any>(null);

  // Card form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // UPI Form state
  const [upiId, setUpiId] = useState('');

  // Add Address Form states
  const [showAddAddrForm, setShowAddAddrForm] = useState(false);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');
  const [newAddrZip, setNewAddrZip] = useState('');

  // Live order tracker map simulation states
  const [shippingStep, setShippingStep] = useState(0); // 0: Warehouse, 1: Transit, 2: Near you, 3: Delivered

  const subtotal = cart.reduce((acc, item) => acc + (item.product.discountPrice * item.quantity), 0);
  const discountAmount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.discountPercent / 100)) : 0;
  const shippingCharge = subtotal > 150 ? 0 : (cart.length > 0 ? 15 : 0);
  const total = subtotal - discountAmount + shippingCharge;

  useEffect(() => {
    if (checkoutStep === 'success') {
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF6B00', '#FF8A3D', '#4F46E5', '#10B981']
        });
      } catch (err) {
        console.log("Confetti trigger bypassed", err);
      }

      // Simulate live order tracking progress
      const trackingInterval = setInterval(() => {
        setShippingStep(prev => {
          if (prev >= 3) {
            clearInterval(trackingInterval);
            return 3;
          }
          return prev + 1;
        });
      }, 5000);

      return () => clearInterval(trackingInterval);
    }
  }, [checkoutStep]);

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrName || !newAddrStreet || !newAddrCity || !newAddrZip) return;

    addAddress({
      name: newAddrName,
      phone: newAddrPhone,
      street: newAddrStreet,
      city: newAddrCity,
      state: newAddrState,
      zipCode: newAddrZip,
      isDefault: false
    });

    // Reset forms
    setShowAddAddrForm(false);
    setNewAddrName('');
    setNewAddrPhone('');
    setNewAddrStreet('');
    setNewAddrCity('');
    setNewAddrState('');
    setNewAddrZip('');
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'Wallet' && walletBalance < total) return;
    
    const order = placeOrder(paymentMethod);
    if (order) {
      setPlacedOrderDetails(order);
      setCheckoutStep('success');
    }
  };

  if (cart.length === 0 && checkoutStep !== 'success') {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 text-sm font-semibold mb-4">No active checkout checkout parameters detected.</p>
        <button onClick={() => onNavigate('home')} className="px-5 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24 pt-4 text-slate-800 dark:text-slate-100 space-y-10"
    >
      {/* Checkout Progress Stepper bar (hide on success) */}
      {checkoutStep !== 'success' && (
        <div className="max-w-2xl mx-auto flex items-center justify-between relative px-6">
          <div className="absolute left-1/2 top-1/2 -translate-y-1/2 h-1 bg-slate-100 dark:bg-slate-800 w-[70%] -translate-x-1/2 -z-10" />
          <div 
            style={{ width: checkoutStep === 'payment' ? '50%' : '0%' }}
            className="absolute left-[15%] top-1/2 -translate-y-1/2 h-1 bg-brand-500 w-[70%] -translate-x-1/2 -z-10 transition-all duration-500" 
          />

          <button 
            onClick={() => setCheckoutStep('billing')}
            className={`flex flex-col items-center gap-1.5 focus:outline-none`}
          >
            <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shadow-md border ${
              checkoutStep === 'billing' || checkoutStep === 'payment'
                ? 'bg-brand-500 border-brand-500 text-white shadow-brand-500/20'
                : 'bg-white border-slate-200 text-slate-400 dark:bg-slate-800'
            }`}>
              1
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Address</span>
          </button>

          <button 
            onClick={() => {
              if (selectedAddress) setCheckoutStep('payment');
            }}
            disabled={!selectedAddress}
            className={`flex flex-col items-center gap-1.5 focus:outline-none`}
          >
            <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shadow-md border transition-colors ${
              checkoutStep === 'payment'
                ? 'bg-brand-500 border-brand-500 text-white shadow-brand-500/20'
                : 'bg-white border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-800'
            }`}>
              2
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Payment</span>
          </button>
        </div>
      )}

      {/* Main step switcher */}
      {checkoutStep === 'billing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Address Selection */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 p-6 sm:p-8 shadow-soft">
              <h2 className="text-xl font-display font-extrabold text-slate-905 dark:text-white mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand-500" /> Select Shipping Location
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map(addr => (
                  <button
                    key={addr.id}
                    onClick={() => selectAddress(addr.id)}
                    className={`text-left p-5 rounded-premium border-2 transition-all flex flex-col justify-between min-h-[140px] ${
                      selectedAddress?.id === addr.id
                        ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-500/5 shadow-md shadow-brand-500/5'
                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/10'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="font-extrabold text-sm text-slate-800 dark:text-white">{addr.name}</span>
                        {addr.isDefault && (
                          <span className="text-[9px] font-extrabold bg-brand-500 text-white px-2 py-0.5 rounded-full">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{addr.street}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{addr.city}, {addr.state} - {addr.zipCode}</p>
                    </div>
                    
                    <p className="text-[10px] text-slate-400 font-bold mt-4">{addr.phone}</p>
                  </button>
                ))}
              </div>

              {/* Add New Address trigger */}
              {!showAddAddrForm ? (
                <button
                  onClick={() => setShowAddAddrForm(true)}
                  className="mt-6 w-full py-3.5 border border-dashed border-slate-350 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-550 dark:text-slate-400 hover:text-brand-500 hover:border-brand-500 dark:hover:text-brand-400 dark:hover:border-brand-400 transition-colors"
                >
                  + Add New Shipping Location
                </button>
              ) : (
                <form onSubmit={handleAddNewAddress} className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <h3 className="font-bold text-sm text-slate-850 dark:text-white mb-2">New Delivery Coordinates</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Receiver Full Name"
                      required
                      value={newAddrName}
                      onChange={(e) => setNewAddrName(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-500 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Contact Phone Number"
                      required
                      value={newAddrPhone}
                      onChange={(e) => setNewAddrPhone(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-500 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Street Address"
                      required
                      value={newAddrStreet}
                      onChange={(e) => setNewAddrStreet(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-500 dark:text-white sm:col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      required
                      value={newAddrCity}
                      onChange={(e) => setNewAddrCity(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-500 dark:text-white"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="State"
                        required
                        value={newAddrState}
                        onChange={(e) => setNewAddrState(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-500 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Zip Code"
                        required
                        value={newAddrZip}
                        onChange={(e) => setNewAddrZip(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-500 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddAddrForm(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 gradient-orange text-white rounded-xl text-xs font-bold hover:shadow-premium-orange shadow"
                    >
                      Save Coordinates
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-4 bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 rounded-premium p-6 sm:p-8 shadow-soft space-y-6">
            <h3 className="font-display font-extrabold text-base text-slate-850 dark:text-white">Delivery Checkout</h3>
            
            <div className="space-y-3.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span className="text-slate-800 dark:text-white font-bold">{cart.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Net:</span>
                <span className="text-slate-800 dark:text-white font-bold">₹{total}</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (selectedAddress) setCheckoutStep('payment');
              }}
              disabled={!selectedAddress}
              className="w-full py-4 gradient-orange text-white rounded-xl font-bold shadow-lg disabled:opacity-50 hover:shadow-premium-orange transition-all flex items-center justify-center gap-2"
            >
              <span>Continue to Payment</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {checkoutStep === 'payment' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Payment options */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 p-6 sm:p-8 shadow-soft">
              <h2 className="text-xl font-display font-extrabold text-slate-905 dark:text-white mb-6">
                Verify Payment Gateway
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {/* Cards */}
                <button
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                    paymentMethod === 'Card'
                      ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-500/5'
                      : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <CreditCard className="h-6 w-6" />
                  <span className="text-xs font-bold">Credit/Debit</span>
                </button>

                {/* UPI */}
                <button
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                    paymentMethod === 'UPI'
                      ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-500/5'
                      : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <Landmark className="h-6 w-6" />
                  <span className="text-xs font-bold">UPI Portal</span>
                </button>

                {/* Wallet */}
                <button
                  onClick={() => setPaymentMethod('Wallet')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 relative ${
                    paymentMethod === 'Wallet'
                      ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-500/5'
                      : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <Wallet className="h-6 w-6" />
                  <span className="text-xs font-bold">NexWallet</span>
                  <span className="text-[9px] font-bold text-slate-400">₹{walletBalance.toFixed(2)}</span>
                </button>

                {/* COD */}
                <button
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                    paymentMethod === 'COD'
                      ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-500/5'
                      : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <Truck className="h-6 w-6" />
                  <span className="text-xs font-bold">COD</span>
                </button>
              </div>

              {/* Payment Details Area */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/30">
                {paymentMethod === 'Card' && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Credit Card Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Card Holder Name"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-500 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="16-digit Card Number"
                        required
                        maxLength={16}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-500 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Expiry (MM/YY)"
                        required
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-500 dark:text-white"
                      />
                      <input
                        type="password"
                        placeholder="CVV (3 digits)"
                        required
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-500 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'UPI' && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Instant UPI Interface</h3>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="bg-white dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
                        {/* Fake static QR */}
                        <div className="h-32 w-32 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                          <Compass className="h-16 w-16 text-slate-300 animate-spin" style={{ animationDuration: '6s' }} />
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 mt-2">SCAN DYNAMIC MERCH QR</span>
                      </div>
                      <div className="flex-1 w-full space-y-3">
                        <p className="text-xs text-slate-400">Scan the merchant QR code with any BHIM, GooglePay, PayTM, or PhonePe application, or enter your UPI Address below.</p>
                        <input
                          type="text"
                          placeholder="yourname@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-500 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'Wallet' && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">NexWallet Account Verification</h3>
                    <div className="flex justify-between items-center bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="text-xs text-slate-400">Available Wallet Balance</span>
                        <p className="text-xl font-display font-extrabold text-slate-800 dark:text-white">₹{walletBalance.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">Order Deductable</span>
                        <p className="text-xl font-display font-extrabold text-brand-500">₹{total}</p>
                      </div>
                    </div>
                    {walletBalance < total && (
                      <p className="text-xs font-bold text-red-500 animate-pulse">
                        Insufficient balance in your digital wallet. Please choose another payment gateway.
                      </p>
                    )}
                  </div>
                )}

                {paymentMethod === 'COD' && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Cash on Delivery (COD) Summary</h3>
                    <p className="text-xs text-slate-400">Paying by Cash/Card at delivery. Please prepare exact change for shipping couriers. Delivery requires signing biometric verification protocols on terminal devices.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Calculations & Place Order */}
          <div className="lg:col-span-4 bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 rounded-premium p-6 sm:p-8 shadow-soft space-y-6">
            <h3 className="font-display font-extrabold text-base text-slate-850 dark:text-white">Payable Invoice</h3>
            
            <div className="space-y-3.5 text-xs text-slate-500 dark:text-slate-400 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex justify-between font-semibold">
                <span>Items Subtotal:</span>
                <span className="text-slate-800 dark:text-white">₹{subtotal}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between font-bold text-brand-500">
                  <span>Discount savings:</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold">
                <span>Delivery Charge:</span>
                <span>{shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-905 dark:text-white pt-2 border-t border-dashed border-slate-100 dark:border-slate-800">
                <span>Invoice Total:</span>
                <span>₹{total}</span>
              </div>
            </div>

            <div className="text-xs">
              <p className="font-bold text-slate-400 uppercase mb-1">Deliver Coordinates:</p>
              <p className="font-semibold text-slate-700 dark:text-slate-200">{selectedAddress?.name}</p>
              <p className="text-slate-400">{selectedAddress?.street}, {selectedAddress?.city}</p>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={paymentMethod === 'Wallet' && walletBalance < total}
              className="w-full py-4 bg-brand-500 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 hover:bg-brand-600 hover:shadow-premium-orange transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="h-5 w-5" />
              <span>Verify & Place Order (₹{total})</span>
            </button>
          </div>
        </div>
      )}

      {/* Success Order Details & Live Map Tracker */}
      {checkoutStep === 'success' && placedOrderDetails && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-3xl mx-auto rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 p-6 sm:p-8 shadow-2xl space-y-8 text-center"
        >
          <div className="flex flex-col items-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-3.5 animate-bounce" />
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">Order Confirmed!</h2>
            <p className="text-slate-400 text-sm mt-1">Thank you! Your transaction cleared successfully.</p>
          </div>

          {/* Quick Details invoice card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl text-left border border-slate-100 dark:border-slate-800/30 text-xs">
            <div>
              <p className="text-slate-450 font-bold uppercase tracking-wider mb-1">Transaction Invoice:</p>
              <p className="font-mono font-extrabold text-sm text-slate-800 dark:text-white select-all cursor-pointer flex items-center gap-1">
                {placedOrderDetails.id} <Copy className="h-3 w-3 text-slate-400 hover:text-brand-500" />
              </p>
            </div>
            <div>
              <p className="text-slate-450 font-bold uppercase tracking-wider mb-1">Estimated Dispatch:</p>
              <p className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1">
                <Calendar className="h-4.5 w-4.5 text-brand-500" /> {placedOrderDetails.date}
              </p>
            </div>
            <div className="sm:col-span-2 pt-3.5 border-t border-slate-200 dark:border-slate-800/60">
              <p className="text-slate-455 font-bold uppercase tracking-wider mb-1 text-[10px]">Deliver Address:</p>
              <p className="font-bold text-slate-700 dark:text-slate-350">{placedOrderDetails.address.name}</p>
              <p className="text-slate-400">{placedOrderDetails.address.street}, {placedOrderDetails.address.city}, {placedOrderDetails.address.state} - {placedOrderDetails.address.zipCode}</p>
            </div>
          </div>

          {/* Live Order tracking Simulator */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-left">
              <div>
                <h3 className="font-display font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                  <Compass className="h-4.5 w-4.5 text-brand-500 animate-spin" style={{ animationDuration: '8s' }} /> Live Order Tracking
                </h3>
                <p className="text-[10px] text-slate-400">Dynamic logistics telemetry updating in real-time.</p>
              </div>
              <span className="text-xs font-bold text-brand-500 bg-brand-50 dark:bg-brand-500/10 px-3 py-1 rounded-full border border-brand-100 dark:border-brand-500/15">
                {shippingStep === 0 && "Dispatched from Hub"}
                {shippingStep === 1 && "Out for Transit"}
                {shippingStep === 2 && "Out for Delivery (Near You)"}
                {shippingStep === 3 && "Arrived & Signed"}
              </span>
            </div>

            {/* Tracking progress bar visualizer */}
            <div className="relative pt-2">
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 -z-10" />
              <div 
                style={{ width: `${(shippingStep / 3) * 100}%` }}
                className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-brand-500 -z-10 transition-all duration-1000" 
              />
              
              <div className="flex justify-between">
                {[0, 1, 2, 3].map((step) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shadow border transition-all ${
                      shippingStep >= step
                        ? 'bg-brand-500 border-brand-500 text-white shadow-brand-500/20 scale-110'
                        : 'bg-white border-slate-200 text-slate-350 dark:bg-slate-800 dark:border-slate-800'
                    }`}>
                      {step === 0 && "🏢"}
                      {step === 1 && "🚚"}
                      {step === 2 && "🚴"}
                      {step === 3 && "🏠"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulating Delivery Map container */}
            <div className="h-52 w-full bg-slate-900 rounded-2xl relative overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
              {/* Grid map lines background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
              
              {/* Route lines */}
              <svg className="absolute inset-0 w-full h-full text-brand-500/35" xmlns="http://www.w3.org/2000/svg">
                <path d="M 50 160 Q 150 60 280 120 T 600 80" stroke="#FF6B00" strokeWidth="4" fill="none" strokeDasharray="6,6" className="animate-[shimmer_15s_infinite_linear]" />
              </svg>

              {/* Warehouse Pin */}
              <div className="absolute left-[50px] bottom-[30px] flex flex-col items-center">
                <span className="text-xl">🏢</span>
                <span className="text-[9px] font-bold text-white bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">Dispatch Hub</span>
              </div>

              {/* Delivery Address Pin */}
              <div className="absolute right-[120px] top-[40px] flex flex-col items-center">
                <span className="text-xl">🏠</span>
                <span className="text-[9px] font-bold text-white bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">Your Location</span>
              </div>

              {/* Drone/Driver dot simulator */}
              <motion.div
                animate={{
                  x: shippingStep === 0 ? [-300] : shippingStep === 1 ? [-100] : shippingStep === 2 ? [100] : [210],
                  y: shippingStep === 0 ? [50] : shippingStep === 1 ? [0] : shippingStep === 2 ? [-30] : [-55]
                }}
                transition={{ type: "spring", stiffness: 100 }}
                className="absolute flex items-center justify-center"
              >
                <div className="h-6 w-6 rounded-full bg-brand-500 flex items-center justify-center text-white border-2 border-white animate-bounce shadow-lg shadow-brand-500/30 font-bold text-[10px]">
                  🚁
                </div>
                <div className="absolute h-10 w-10 bg-brand-500/25 rounded-full animate-ping" />
              </motion.div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 py-3.5 bg-slate-900 dark:bg-white dark:text-slate-950 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow"
            >
              Return to Catalog Home
            </button>
            <button
              onClick={() => onNavigate('profile', { section: 'orders' })}
              className="flex-1 py-3.5 gradient-orange text-white rounded-xl text-xs font-bold hover:shadow-premium-orange transition-colors shadow-lg"
            >
              Manage order records
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
