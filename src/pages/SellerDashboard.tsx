import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Trash2, CheckCircle, RefreshCw, MessageSquare, 
  TrendingUp, Eye, DollarSign, Settings, Bell, Star, AlertCircle 
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useCart } from '../context/CartContext';

interface SellerDashboardProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ onNavigate }) => {
  const { marketplaceProducts, chats, earnings, deleteListing, markAsSold, renewListing, setActiveChatSession } = useMarketplace();
  const { addNotification } = useCart();
  const [activeTab, setActiveTab] = useState<'listings' | 'messages' | 'analytics'>('listings');

  // Filter listings where the owner is the signed-in user: "Alex Stark"
  const myListings = marketplaceProducts.filter(p => p.sellerName === 'Alex Stark');

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteListing(id);
      addNotification("Listing Deleted", `"${name}" has been permanently removed from your dashboard.`);
    }
  };

  const handleMarkSold = (id: string, name: string) => {
    markAsSold(id);
    addNotification("Listing Sold", `"${name}" was marked as sold. Congratulations on your sale!`);
  };

  const handleRenew = (id: string, name: string) => {
    renewListing(id);
    addNotification("Listing Renewed", `"${name}" has been successfully renewed and bumped up in results.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24 pt-4 text-slate-800 dark:text-slate-100 space-y-8"
    >
      {/* Overview stats header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">My Active Listings</span>
            <p className="text-2xl font-display font-extrabold text-slate-850 dark:text-white mt-1">{earnings.activeListings}</p>
          </div>
          <div className="p-3 bg-brand-500/10 rounded-2xl text-brand-500">
            <ShoppingBag className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Items Sold</span>
            <p className="text-2xl font-display font-extrabold text-slate-850 dark:text-white mt-1">{earnings.soldCount}</p>
          </div>
          <div className="p-3 bg-green-500/10 rounded-2xl text-green-500">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Earnings</span>
            <p className="text-2xl font-display font-extrabold text-slate-850 dark:text-white mt-1">${earnings.total}</p>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Negotiations</span>
            <p className="text-2xl font-display font-extrabold text-slate-850 dark:text-white mt-1">
              {chats.filter(c => c.sellerName === 'Alex Stark' || c.sellerType === 'individual').length}
            </p>
          </div>
          <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
            <MessageSquare className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/40 rounded-premium p-4 shadow-soft">
        <div className="flex border-b border-slate-100 dark:border-slate-850">
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex-1 py-3 font-display font-bold text-xs sm:text-sm uppercase tracking-wide border-b-2 transition-colors ${
              activeTab === 'listings' ? 'border-brand-500 text-brand-500' : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            My Products & Listings ({myListings.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 py-3 font-display font-bold text-xs sm:text-sm uppercase tracking-wide border-b-2 transition-colors ${
              activeTab === 'messages' ? 'border-brand-500 text-brand-500' : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            Customer Messages ({chats.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-3 font-display font-bold text-xs sm:text-sm uppercase tracking-wide border-b-2 transition-colors ${
              activeTab === 'analytics' ? 'border-brand-500 text-brand-500' : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            Performance Analytics
          </button>
        </div>

        <div className="pt-6">
          <AnimatePresence mode="wait">
            
            {/* Tab: Listings */}
            {activeTab === 'listings' && (
              <motion.div
                key="listings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                {myListings.length === 0 ? (
                  <div className="text-center py-12 border border-dashed rounded-2xl border-slate-200 dark:border-slate-850">
                    <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-450 text-xs font-semibold">You have not listed any items yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myListings.map(prod => (
                      <div 
                        key={prod.id} 
                        className={`p-4 rounded-2xl border flex gap-4 shadow-sm bg-slate-50/50 dark:bg-slate-900/10 ${
                          prod.isSold ? 'border-slate-200 opacity-60 dark:border-slate-800' : 'border-slate-100 dark:border-slate-800/80'
                        }`}
                      >
                        <img src={prod.images[0]} alt={prod.name} className="h-20 w-20 object-contain bg-white rounded-xl p-1.5 border" />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-bold text-xs sm:text-sm truncate pr-2">{prod.name}</h3>
                              <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                prod.isSold ? 'bg-slate-300 text-slate-700' : 'bg-brand-500 text-white'
                              }`}>
                                {prod.isSold ? 'SOLD' : 'ACTIVE'}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{prod.category} • Condition: {prod.condition}</p>
                            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">${prod.discountPrice}</p>
                          </div>

                          {/* Action triggers */}
                          <div className="flex gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-850">
                            {!prod.isSold ? (
                              <button
                                onClick={() => handleMarkSold(prod.id, prod.name)}
                                className="flex-1 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
                              >
                                <CheckCircle className="h-3 w-3" /> Mark Sold
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRenew(prod.id, prod.name)}
                                className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 text-white rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
                              >
                                <RefreshCw className="h-3 w-3" /> Renew
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(prod.id, prod.name)}
                              className="px-2.5 py-1.5 border border-red-200 dark:border-red-900 text-red-500 rounded-lg text-[10px] hover:bg-red-50 dark:hover:bg-red-950/20 font-bold transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Tab: Messages */}
            {activeTab === 'messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-3"
              >
                {chats.length === 0 ? (
                  <div className="text-center py-12 border border-dashed rounded-2xl border-slate-200 dark:border-slate-850">
                    <MessageSquare className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-455 text-xs font-semibold">No buyer conversations active.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-850">
                    {chats.map(chat => (
                      <div 
                        key={chat.id} 
                        onClick={() => setActiveChatSession(chat.id)}
                        className={`p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                          chat.unread ? 'bg-brand-500/5 font-bold border-l-4 border-brand-500' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={chat.productImage} alt={chat.productName} className="h-10 w-10 object-contain bg-white rounded-lg p-1 border" />
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-850 dark:text-white leading-tight">{chat.sellerName}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[200px]">Item: {chat.productName}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-405 truncate max-w-[200px] mt-1 italic">
                              "{chat.messages[chat.messages.length - 1]?.text}"
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[9px] text-slate-400">{chat.messages[chat.messages.length - 1]?.timestamp}</span>
                          {chat.unread && <span className="block h-2 w-2 rounded-full bg-brand-500 ml-auto mt-1" />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Tab: Analytics */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-6"
              >
                {/* Simulated graphs using styled cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 space-y-4">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Listing Traffic (Views)</span>
                    <div className="h-32 flex items-end gap-2 pt-4">
                      {[30, 45, 25, 60, 90, 70, 110].map((val, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                          <div 
                            style={{ height: `${(val / 110) * 100}%` }}
                            className="w-full bg-brand-500 rounded-t-md hover:bg-brand-600 transition-all cursor-pointer relative group"
                          >
                            {/* tooltip */}
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                              {val}
                            </span>
                          </div>
                          <span className="text-[8px] text-slate-400 font-semibold">Day {idx + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 space-y-4">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Earnings Timeline ($)</span>
                    <div className="h-32 flex items-end gap-2 pt-4">
                      {[150, 0, 280, 0, 150, 320, 0].map((val, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                          <div 
                            style={{ height: `${val > 0 ? (val / 320) * 100 : 5}%` }}
                            className="w-full bg-indigo-500 rounded-t-md hover:bg-indigo-600 transition-all cursor-pointer relative group"
                          >
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                              ${val}
                            </span>
                          </div>
                          <span className="text-[8px] text-slate-400 font-semibold">Day {idx + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-brand-500" />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm">Conversion Rate +12.4%</h4>
                      <p className="text-[10px] text-slate-405 mt-0.5">Your listings are currently receiving higher engagement than 82% of neighborhood sellers.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
