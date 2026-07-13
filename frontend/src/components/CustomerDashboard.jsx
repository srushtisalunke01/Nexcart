import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { useWishlistStore } from '../store/wishlistStore.js';
import { useChatStore } from '../store/chatStore.js';
import api from '../services/api.js';
import { 
  ShoppingBag, Heart, MessageSquare, Bell, CreditCard, MapPin, Search, Star,
  Trash2, Plus, Edit2, CheckCircle2, ChevronRight, Download, Send, RefreshCw, Clock
} from 'lucide-react';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { wishlistItems, fetchWishlist, toggleWishlist } = useWishlistStore();
  
  // Chat store selectors
  const { 
    conversations, fetchConversations, messages, fetchMessages, 
    sendMessage, respondToOffer, initSocket, disconnectSocket, partnerIsTyping, sendTypingState
  } = useChatStore();

  const [activeTab, setActiveTab] = useState('orders');

  // Backend state
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [walletBalance, setWalletBalance] = useState(5000);
  const [walletTx, setWalletTx] = useState([]);
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');

  // Address edit state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressFields, setAddressFields] = useState({
    title: 'Home', name: '', street: '', city: '', state: '', country: '', zip: '', phone: '', isDefault: false
  });

  // Active chat state
  const [selectedPartnerId, setSelectedPartnerId] = useState(null);
  const [selectedPartnerName, setSelectedPartnerName] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isTypingLocal, setIsTypingLocal] = useState(false);
  const typingTimeoutRef = React.useRef(null);

  // Active order details modal state
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      initSocket(user.id);
      fetchWishlist();
      fetchConversations();
      fetchDashboardData();
    }
    return () => {
      disconnectSocket();
    };
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const ordersRes = await api.get('/orders');
      if (ordersRes.data.success) {
        setOrders(ordersRes.data.buyerOrders);
      }
      
      const addrRes = await api.get('/profile/addresses');
      if (addrRes.data.success) {
        setAddresses(addrRes.data.addresses);
      }

      const notifRes = await api.get('/profile/notifications');
      if (notifRes.data.success) {
        setNotifications(notifRes.data.notifications);
      }

      const walletRes = await api.get('/profile/wallet');
      if (walletRes.data.success) {
        setWalletBalance(walletRes.data.balance);
        setWalletTx(walletRes.data.transactions);
      }
    } catch (err) {
      console.error('Failed to load dashboard parameters:', err);
    }
  };

  const handleTopUp = async (e) => {
    e.preventDefault();
    const amt = Number(topUpAmount);
    if (!amt || amt <= 0) return;
    setIsTopUpLoading(true);
    try {
      const res = await api.post('/profile/wallet/topup', { amount: amt });
      if (res.data.success) {
        setWalletBalance(prev => prev + amt);
        setWalletTx(prev => [
          { id: Date.now().toString(), type: 'Credit', amount: amt, reason: 'Sim Wallet Top Up', date: new Date() },
          ...prev
        ]);
        setTopUpAmount('');
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTopUpLoading(false);
    }
  };

  const handleMarkNotificationsRead = async () => {
    try {
      await api.put('/profile/notifications/read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        const res = await api.put(`/profile/addresses/${editingAddress._id}`, addressFields);
        if (res.data.success) {
          setAddresses(prev => prev.map(a => a._id === editingAddress._id ? res.data.address : a));
        }
      } else {
        const res = await api.post('/profile/addresses', addressFields);
        if (res.data.success) {
          setAddresses(prev => [res.data.address, ...prev]);
        }
      }
      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressFields({
      title: addr.title,
      name: addr.name,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      country: addr.country,
      zip: addr.zip,
      phone: addr.phone,
      isDefault: addr.isDefault
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await api.delete(`/profile/addresses/${id}`);
      if (res.data.success) {
        setAddresses(prev => prev.filter(a => a._id !== id));
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

  const downloadInvoice = (order) => {
    // Simulated invoice file trigger
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>NEXUS INVOICE - ${order._id}</title>
          <style>
            body { font-family: Outfit, sans-serif; padding: 40px; color: #052237; }
            .header { border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px; }
            .meta { display: flex; justify-content: space-between; font-size: 13px; }
            .table { w-full; border-collapse: collapse; margin-top: 40px; text-align: left; }
            .table th, .table td { padding: 12px; border-bottom: 1px solid #E2E8F0; }
            .table th { background: #F5F7FA; }
            .total { text-align: right; margin-top: 30px; font-size: 16px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>NEXUS ONE MARKETPLACE</h2>
            <div class="meta">
              <div>Invoice Date: ${new Date(order.createdAt).toLocaleDateString()}<br/>Transaction ID: ${order._id}</div>
              <div>Buyer: ${user.name}<br/>Email: ${user.email}</div>
            </div>
          </div>
          <table class="table" style="width: 100%;">
            <thead>
              <tr><th>Asset Name</th><th>Quantity</th><th>Unit Price</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr><td>${item.name}</td><td>${item.quantity}</td><td>$${item.price}</td><td>$${item.quantity * item.price}</td></tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            Items Price: $${order.itemsPrice}<br/>
            VAT (8%): $${order.taxPrice}<br/>
            Escrow Settlement Total: $${order.totalPrice}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[75vh]">
      {/* Sidebar Navigation */}
      <div class="lg:col-span-1 glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm flex flex-col justify-between">
        <div class="space-y-2">
          {[
            { id: 'orders', label: 'Order History', icon: ShoppingBag },
            { id: 'wishlist', label: 'My Wishlist', icon: Heart },
            { id: 'messages', label: 'Trade Chat', icon: MessageSquare },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'wallet', label: 'Wallet Vault', icon: CreditCard },
            { id: 'addresses', label: 'Addresses Book', icon: MapPin }
          ].map(tab => {
            const Icon = tab.icon;
            const count = tab.id === 'notifications' ? notifications.filter(n => !n.isRead).length : 0;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'notifications') handleMarkNotificationsRead();
                }}
                class={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-luxury-blue text-white shadow-md' 
                    : 'text-luxury-blue-dark/70 hover:bg-luxury-blue/5 hover:text-luxury-blue'
                }`}
              >
                <span class="flex items-center gap-3">
                  <Icon class="w-4.5 h-4.5" /> {tab.label}
                </span>
                {count > 0 && (
                  <span class="bg-luxury-gold text-luxury-blue-dark text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Card */}
        <div class="border-t border-luxury-gray-medium/50 pt-6 mt-6 text-center space-y-2">
          <div class="w-14 h-14 bg-luxury-blue text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto border-2 border-luxury-gold/30">
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 class="font-serif text-sm font-bold text-luxury-blue-dark leading-tight">{user.name}</h4>
            <span class="text-[9px] font-bold tracking-widest text-luxury-gold uppercase block mt-0.5">{user.role}</span>
          </div>
        </div>
      </div>

      {/* Main Tab Sheets content area */}
      <div class="lg:col-span-3 space-y-6">
        
        {/* TAB SHEET: ORDERS */}
        {activeTab === 'orders' && (
          <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm space-y-6 text-left">
            <div>
              <h3 class="font-serif text-xl font-bold text-luxury-blue-dark">Acquisition Portfolio</h3>
              <p class="text-xs text-luxury-gray-dark mt-1">Review tracking, delivery dates, and invoice settlements.</p>
            </div>

            {orders.length === 0 ? (
              <div class="text-center py-12 space-y-3">
                <ShoppingBag className="w-10 h-10 text-luxury-gold mx-auto" />
                <p class="text-xs text-luxury-gray-dark font-medium">No order placements recorded.</p>
              </div>
            ) : (
              <div class="space-y-4">
                {orders.map(order => (
                  <div key={order._id} class="border border-luxury-gray-medium/40 rounded-xl p-5 hover:bg-white/40 transition-colors bg-white/20">
                    <div class="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-luxury-gray-medium/30">
                      <div>
                        <span class="text-[10px] font-bold text-luxury-blue-dark">TXID: {order._id}</span>
                        <span class="block text-[9px] text-luxury-gray font-semibold mt-0.5">Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div class="flex items-center gap-3">
                        <span class={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-full ${
                          order.orderStatus === 'Delivered' 
                            ? 'bg-green-50 text-green-600 border border-green-200' 
                            : 'bg-luxury-gold/10 text-luxury-gold-dark border border-luxury-gold/20'
                        }`}>
                          {order.orderStatus}
                        </span>
                        <button 
                          onClick={() => downloadInvoice(order)}
                          class="p-2 border border-luxury-gray-medium hover:border-luxury-gold rounded-full text-luxury-gray hover:text-luxury-gold-dark transition-all"
                          title="Print Invoice"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div class="py-4 space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} class="flex items-center gap-3">
                          <div class="w-12 h-12 rounded-lg overflow-hidden bg-luxury-gray-light flex-shrink-0">
                            <img src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314'} alt="thumb" class="w-full h-full object-cover" />
                          </div>
                          <div class="flex-grow min-w-0">
                            <h4 class="font-bold text-xs text-luxury-blue-dark truncate leading-tight">{item.name}</h4>
                            <span class="text-[10px] text-luxury-gray font-semibold block mt-0.5">{item.quantity} units @ ${item.price}</span>
                          </div>
                          <span class="text-xs font-bold text-luxury-blue-dark">${item.quantity * item.price}</span>
                        </div>
                      ))}
                    </div>

                    <div class="flex justify-between items-center border-t border-luxury-gray-medium/30 pt-3 text-xs font-bold">
                      <span class="text-luxury-gray">Total Cost</span>
                      <span class="text-luxury-blue-dark font-serif">${order.totalPrice}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB SHEET: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm space-y-6 text-left">
            <div>
              <h3 class="font-serif text-xl font-bold text-luxury-blue-dark">Monitored Assets</h3>
              <p class="text-xs text-luxury-gray-dark mt-1">Bookmarked items pending acquisitions.</p>
            </div>

            {wishlistItems.length === 0 ? (
              <div class="text-center py-12 space-y-3">
                <Heart className="w-10 h-10 text-luxury-gold mx-auto" />
                <p class="text-xs text-luxury-gray-dark font-medium">Wishlist vault is empty.</p>
              </div>
            ) : (
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                {wishlistItems.map(product => (
                  <div key={product._id} class="bg-white rounded-xl border border-luxury-gray-medium/30 overflow-hidden flex flex-col justify-between">
                    <div class="h-32 bg-luxury-gray-light overflow-hidden relative">
                      <img src={product.images?.[0]} alt="thumb" class="w-full h-full object-cover" />
                      <button 
                        onClick={() => toggleWishlist(product._id)}
                        class="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 hover:bg-white text-red-500 shadow-sm border border-luxury-gray-medium/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div class="p-4 space-y-3 text-left">
                      <h4 class="font-bold text-xs text-luxury-blue-dark line-clamp-1 leading-none">{product.name}</h4>
                      <div class="flex justify-between items-center">
                        <span class="text-xs font-bold text-luxury-gold-dark">${product.price}</span>
                        <Link to={`/product/${product._id}`} class="text-[9px] font-bold uppercase tracking-widest text-luxury-blue hover:text-luxury-gold transition-colors">Inspect</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB SHEET: TRADE CHAT MESSAGING */}
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

        {/* TAB SHEET: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm space-y-6 text-left">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-serif text-xl font-bold text-luxury-blue-dark">System Ledger</h3>
                <p class="text-xs text-luxury-gray-dark mt-1">Audit logs on secure escrow shipments and communications.</p>
              </div>
              <button 
                onClick={handleMarkNotificationsRead}
                class="text-[10px] font-bold text-luxury-gold-dark hover:text-luxury-gold uppercase tracking-widest"
              >
                Mark Read
              </button>
            </div>

            {notifications.length === 0 ? (
              <div class="text-center py-12 space-y-3">
                <Bell className="w-10 h-10 text-luxury-gold mx-auto" />
                <p class="text-xs text-luxury-gray-dark font-medium">No alerts received.</p>
              </div>
            ) : (
              <div class="space-y-3">
                {notifications.map(notif => (
                  <div key={notif._id} class={`p-4 rounded-xl border flex gap-3 text-left items-start ${
                    notif.isRead ? 'bg-white/20 border-luxury-gray-medium/30' : 'bg-luxury-gold/5 border-luxury-gold/20 shadow-sm'
                  }`}>
                    <div class="p-2 rounded bg-white border border-luxury-gray-medium/35 text-luxury-gold flex-shrink-0 mt-0.5">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 class="font-bold text-xs text-luxury-blue-dark leading-tight">{notif.title}</h4>
                      <p class="text-[11px] text-luxury-gray-dark font-semibold mt-1 leading-relaxed">{notif.message}</p>
                      <span class="text-[9px] text-luxury-gray mt-1 block font-medium">{new Date(notif.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB SHEET: WALLET VAULT */}
        {activeTab === 'wallet' && (
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div class="md:col-span-1 space-y-6">
              <div class="glass-card-dark p-6 rounded-2xl border border-white/5 shadow-2xl text-white space-y-4">
                <span class="text-[9px] font-bold text-luxury-gold uppercase tracking-widest block">Available Balance</span>
                <div class="font-serif text-3.5xl font-bold tracking-wide">${walletBalance}</div>
                <div class="text-[9px] text-luxury-gray font-bold">NEXUS Secured Vault Credit (Escrow-Linked)</div>
              </div>

              <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm space-y-4 bg-white">
                <h4 class="text-xs font-bold text-luxury-blue-dark tracking-wider uppercase">Load Sim Wallet</h4>
                <form onSubmit={handleTopUp} class="space-y-3">
                  <input 
                    type="number" 
                    placeholder="Enter USD ($)" 
                    class="luxury-input py-2.5 text-xs font-bold"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    disabled={isTopUpLoading}
                    class="btn-primary w-full py-2.5 text-[10px] uppercase tracking-widest bg-luxury-blue font-bold flex items-center justify-center"
                  >
                    Top-Up Balance
                  </button>
                </form>
              </div>
            </div>

            <div class="md:col-span-2 glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm space-y-6 bg-white">
              <h3 class="font-serif text-lg font-bold text-luxury-blue-dark pb-4 border-b border-luxury-gray-medium/50 flex items-center gap-1.5">
                <Clock className="w-5 h-5 text-luxury-gold" /> Vault Transactions Ledger
              </h3>

              <div class="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {walletTx.map((tx, idx) => (
                  <div key={tx.id || idx} class="flex justify-between items-center p-3.5 rounded-xl border border-luxury-gray-medium/30 hover:bg-luxury-gray-light/30 transition-colors bg-white/30 text-xs">
                    <div>
                      <span class="font-bold text-luxury-blue-dark">{tx.reason}</span>
                      <span class="block text-[9px] text-luxury-gray font-semibold mt-0.5">{new Date(tx.date).toLocaleDateString()}</span>
                    </div>
                    <span class="font-bold text-green-600 font-serif">+${tx.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB SHEET: ADDRESS BOOK */}
        {activeTab === 'addresses' && (
          <div class="glass-card-light p-6 rounded-2xl border border-white/60 shadow-sm space-y-6 text-left">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-serif text-xl font-bold text-luxury-blue-dark">Shipping Addresses</h3>
                <p class="text-xs text-luxury-gray-dark mt-1">Manage delivery endpoints for your checkout shipments.</p>
              </div>
              {!showAddressForm && (
                <button 
                  onClick={() => {
                    setEditingAddress(null);
                    setAddressFields({ title: 'Home', name: '', street: '', city: '', state: '', country: '', zip: '', phone: '', isDefault: false });
                    setShowAddressForm(true);
                  }}
                  class="btn-primary py-2 px-4 text-[10px] uppercase tracking-widest bg-luxury-blue flex items-center gap-1.5 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Address
                </button>
              )}
            </div>

            {showAddressForm ? (
              <form onSubmit={handleAddressSubmit} class="p-5 border border-luxury-gray-medium/30 rounded-xl space-y-5 bg-white/40">
                <h4 class="font-serif text-sm font-bold text-luxury-blue-dark">{editingAddress ? 'Modify Address' : 'Register New Address'}</h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-luxury-blue-dark">
                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Address Label</label>
                    <input 
                      type="text" 
                      class="luxury-input py-2 text-xs" 
                      value={addressFields.title}
                      onChange={(e) => setAddressFields({ ...addressFields, title: e.target.value })}
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Recipient Name</label>
                    <input 
                      type="text" 
                      class="luxury-input py-2 text-xs" 
                      required
                      value={addressFields.name}
                      onChange={(e) => setAddressFields({ ...addressFields, name: e.target.value })}
                    />
                  </div>

                  <div class="space-y-1.5 md:col-span-2">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Street Address</label>
                    <input 
                      type="text" 
                      class="luxury-input py-2 text-xs" 
                      required
                      value={addressFields.street}
                      onChange={(e) => setAddressFields({ ...addressFields, street: e.target.value })}
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">City</label>
                    <input 
                      type="text" 
                      class="luxury-input py-2 text-xs" 
                      required
                      value={addressFields.city}
                      onChange={(e) => setAddressFields({ ...addressFields, city: e.target.value })}
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">State</label>
                    <input 
                      type="text" 
                      class="luxury-input py-2 text-xs" 
                      required
                      value={addressFields.state}
                      onChange={(e) => setAddressFields({ ...addressFields, state: e.target.value })}
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Country</label>
                    <input 
                      type="text" 
                      class="luxury-input py-2 text-xs" 
                      required
                      value={addressFields.country}
                      onChange={(e) => setAddressFields({ ...addressFields, country: e.target.value })}
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">ZIP Code</label>
                    <input 
                      type="text" 
                      class="luxury-input py-2 text-xs" 
                      required
                      value={addressFields.zip}
                      onChange={(e) => setAddressFields({ ...addressFields, zip: e.target.value })}
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-[10px] font-bold text-luxury-gray uppercase block">Phone Number</label>
                    <input 
                      type="tel" 
                      class="luxury-input py-2 text-xs" 
                      required
                      value={addressFields.phone}
                      onChange={(e) => setAddressFields({ ...addressFields, phone: e.target.value })}
                    />
                  </div>

                  <div class="flex items-center gap-2 pt-2 md:col-span-2">
                    <input 
                      type="checkbox" 
                      id="default-check"
                      checked={addressFields.isDefault}
                      onChange={(e) => setAddressFields({ ...addressFields, isDefault: e.target.checked })}
                    />
                    <label for="default-check" class="text-[10px] font-bold uppercase text-luxury-gray select-none cursor-pointer">Set as default shipping target</label>
                  </div>
                </div>

                <div class="pt-2 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setShowAddressForm(false)}
                    class="btn-secondary py-2 px-5 text-[10px] uppercase tracking-widest rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    class="btn-primary py-2 px-5 text-[10px] uppercase tracking-widest bg-luxury-blue rounded-xl"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            ) : (
              <div class="space-y-4">
                {addresses.map(addr => (
                  <div key={addr._id} class="border border-luxury-gray-medium/40 rounded-xl p-5 flex justify-between items-start bg-white/20">
                    <div class="space-y-1 text-xs">
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-luxury-blue-dark uppercase tracking-wider">{addr.title}</span>
                        {addr.isDefault && (
                          <span class="bg-luxury-gold/10 text-luxury-gold-dark border border-luxury-gold/30 text-[9px] font-bold uppercase px-2 py-0.5 rounded">Default</span>
                        )}
                      </div>
                      <p class="text-luxury-blue-dark font-bold text-sm pt-1">{addr.name}</p>
                      <p class="text-luxury-gray-dark font-semibold">{addr.street}, {addr.city}, {addr.state}, {addr.zip}</p>
                      <span class="block text-[10px] text-luxury-gray mt-1 font-bold">📞 {addr.phone}</span>
                    </div>

                    <div class="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditAddress(addr)}
                        class="p-2 border border-luxury-gray-medium/50 rounded-full hover:border-luxury-gold text-luxury-gray hover:text-luxury-gold-dark transition-all"
                        title="Edit address"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteAddress(addr._id)}
                        class="p-2 border border-luxury-gray-medium/50 rounded-full hover:border-red-600 text-luxury-gray hover:text-red-600 transition-all"
                        title="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
