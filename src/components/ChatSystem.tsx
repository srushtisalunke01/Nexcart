import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Image as ImageIcon, Smile, CheckCheck, Building, User, Tag } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const ChatSystem: React.FC = () => {
  const { activeChat, sendChatMessage, respondToOffer, setActiveChatSession } = useMarketplace();
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [negotiatePrice, setNegotiatePrice] = useState('');
  const [showNegotiate, setShowNegotiate] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, activeChat?.typing]);

  if (!activeChat) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(activeChat.id, inputText.trim(), { sender: 'buyer' });
    setInputText('');
  };

  const handleSendEmoji = (emoji: string) => {
    sendChatMessage(activeChat.id, emoji, { sender: 'buyer' });
    setShowEmojiPicker(false);
  };

  const handleSendImage = () => {
    // Simulate attaching a premium camera/keyboard image
    sendChatMessage(activeChat.id, "Sent an image", { 
      sender: 'buyer', 
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80" 
    });
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(negotiatePrice);
    if (!isNaN(priceNum) && priceNum > 0) {
      sendChatMessage(activeChat.id, `Sent negotiation offer: $${priceNum}`, {
        sender: 'buyer',
        offerPrice: priceNum,
        offerStatus: 'pending'
      });
      setNegotiatePrice('');
      setShowNegotiate(false);
    }
  };

  const emojis = ['😊', '👍', '🔥', '💎', '🤝', '🙌', '😎', '💬', '❓'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveChatSession(null)}
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="w-full max-w-md bg-white/95 dark:bg-premium-cardDark/95 backdrop-blur-xl border-l border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between gradient-orange text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={activeChat.productImage} 
                  alt={activeChat.productName} 
                  className="h-10 w-10 object-contain bg-white rounded-lg p-1" 
                />
                {activeChat.online && (
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-xs truncate max-w-[200px] leading-tight flex items-center gap-1">
                  {activeChat.sellerType === 'business' ? <Building className="h-3 w-3 text-brand-200" /> : <User className="h-3 w-3" />}
                  {activeChat.sellerName}
                </h3>
                <span className="text-[9px] font-semibold text-brand-100 uppercase tracking-widest mt-0.5 block truncate max-w-[200px]">
                  Regarding: {activeChat.productName}
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveChatSession(null)}
              className="p-1 rounded-full hover:bg-white/10 text-white/90"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeChat.messages.map((msg) => {
              const isBuyer = msg.sender === 'buyer';
              return (
                <div key={msg.id} className={`flex ${isBuyer ? 'justify-end' : 'justify-start'}`}>
                  <div className="space-y-1 max-w-[80%]">
                    {/* Message Bubble */}
                    <div 
                      className={`p-3 rounded-2xl text-xs font-medium leading-relaxed relative ${
                        isBuyer 
                          ? 'bg-slate-900 text-white rounded-tr-none dark:bg-slate-100 dark:text-slate-950' 
                          : 'bg-slate-100 text-slate-800 rounded-tl-none dark:bg-slate-900 dark:text-slate-200'
                      }`}
                    >
                      {msg.text}

                      {/* Image render */}
                      {msg.image && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                          <img src={msg.image} alt="attached" className="max-w-full h-auto object-cover" />
                        </div>
                      )}

                      {/* Offer negotiation widget */}
                      {msg.offerPrice && (
                        <div className="mt-3 p-3 rounded-xl border border-dashed border-brand-300 bg-brand-50/10 dark:border-brand-500/30 flex flex-col gap-2">
                          <div className="flex justify-between items-center text-[10px] font-bold text-brand-500 uppercase tracking-wider">
                            <span>Negotiation Offer</span>
                            <span>${msg.offerPrice}</span>
                          </div>
                          {msg.offerStatus === 'pending' ? (
                            !isBuyer ? (
                              <div className="flex gap-2 mt-1">
                                <button
                                  onClick={() => respondToOffer(activeChat.id, msg.id, 'accepted')}
                                  className="flex-1 py-1 bg-green-500 text-white text-[10px] font-bold rounded-lg hover:bg-green-600 transition-colors"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => respondToOffer(activeChat.id, msg.id, 'rejected')}
                                  className="flex-1 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg hover:bg-red-650 transition-colors"
                                >
                                  Decline
                                </button>
                              </div>
                            ) : (
                              <span className="text-[9px] text-amber-500 text-center font-bold">Awaiting Seller Review</span>
                            )
                          ) : (
                            <span className={`text-[10px] font-bold text-center uppercase tracking-widest ${msg.offerStatus === 'accepted' ? 'text-green-500' : 'text-red-550'}`}>
                              Offer {msg.offerStatus}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Timestamp & Read receipts */}
                    <div className={`flex items-center gap-1.5 text-[9px] text-slate-400 font-semibold ${isBuyer ? 'justify-end' : 'justify-start'}`}>
                      <span>{msg.timestamp}</span>
                      {isBuyer && <CheckCheck className="h-3 w-3 text-brand-500" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {activeChat.typing && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl rounded-tl-none p-3 max-w-[80%] flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-450 italic">Seller is typing</span>
                  <div className="flex gap-0.5">
                    <span className="h-1.5 w-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Action footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {/* Negotiation Offer Box toggle */}
            {activeChat.sellerType === 'individual' && (
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3.5 py-2.5 rounded-xl">
                <button
                  onClick={() => setShowNegotiate(!showNegotiate)}
                  className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1"
                >
                  <Tag className="h-3.5 w-3.5" /> {showNegotiate ? "Cancel Offer" : "Make an Offer"}
                </button>
                {showNegotiate && (
                  <form onSubmit={handleSendOffer} className="flex gap-2 items-center flex-1 ml-4 justify-end">
                    <input
                      type="number"
                      required
                      min="1"
                      value={negotiatePrice}
                      onChange={(e) => setNegotiatePrice(e.target.value)}
                      placeholder="$ Offer"
                      className="w-20 bg-white dark:bg-slate-800 border rounded-lg px-2 py-1 text-xs focus:outline-none dark:text-white"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-brand-500 text-white rounded-lg text-[10px] font-bold"
                    >
                      Send
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="relative flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full px-4 py-3 bg-transparent text-xs focus:outline-none dark:text-white pr-20"
              />

              <div className="absolute right-12 flex gap-1 items-center text-slate-400">
                <button
                  type="button"
                  onClick={handleSendImage}
                  className="p-1 hover:text-brand-500"
                  title="Attach Photo"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1 hover:text-brand-500"
                  title="Emojis"
                >
                  <Smile className="h-4 w-4" />
                </button>
              </div>

              <button
                type="submit"
                className="absolute right-0 h-full px-3.5 gradient-orange text-white flex items-center justify-center hover:opacity-95"
              >
                <Send className="h-4 w-4" />
              </button>

              {/* Emoji Picker Popover */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute bottom-14 right-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-2xl flex gap-1.5 shadow-xl z-55"
                  >
                    {emojis.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleSendEmoji(emoji)}
                        className="text-base hover:scale-115 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
