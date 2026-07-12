import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";

const INITIAL_MESSAGES = [
  {
    id: "init-1",
    text: "Hi there! Welcome to NexCart Customer Support. I am your AI shopping assistant. How can I help you today?",
    sender: "agent",
    time: "1:00 PM",
  },
];

export const ChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const userQuery = input.toLowerCase();
    setInput("");
    setIsTyping(true);

    // Simulate Agent response
    setTimeout(() => {
      let reply =
        "I'm sorry, I didn't quite catch that. Could you please specify your query? (Type 'shipping', 'rewards', or 'coupon' for quick answers!)";
      if (
        userQuery.includes("shipping") ||
        userQuery.includes("delivery") ||
        userQuery.includes("arrive")
      ) {
        reply =
          "Standard delivery on NexCart takes 2-4 business days. Orders over $150 qualify for free express delivery, which usually arrives the next day! You can track your active orders under the 'Live Order Tracking' page in your profile.";
      } else if (
        userQuery.includes("reward") ||
        userQuery.includes("point") ||
        userQuery.includes("loyalty")
      ) {
        reply =
          "For every dollar you spend on NexCart, you earn 10% cashpoints. For example, spending $100 earns you 10 loyalty points (equivalent to $1.00 store credit). You can redeem points directly during checkout to pay for purchases!";
      } else if (
        userQuery.includes("coupon") ||
        userQuery.includes("discount") ||
        userQuery.includes("code")
      ) {
        reply =
          "You can use code 'NEXCART10' at checkout to receive 10% off your purchase. We also have a special 'SUPERSAVE25' coupon code for 25% off qualifying premium items!";
      } else if (userQuery.includes("return") || userQuery.includes("refund")) {
        reply =
          "NexCart offers a premium 30-day return policy. If you are unsatisfied, click 'Return Item' on the Order page to request a free return parcel. We arrange home pick-ups and refund instantly.";
      } else if (userQuery.includes("hello") || userQuery.includes("hi")) {
        reply =
          "Hello! How is your shopping experience going? Feel free to ask about our luxury watches, sneakers, or ordering flow.";
      }

      const agentMsg = {
        id: `msg-${Date.now() + 1}`,
        text: reply,
        sender: "agent",
        time: new Date().toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, agentMsg]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-brand-500 via-brand-600 to-cyber-gold text-white shadow-lg shadow-brand-500/25 focus:outline-none neon-glow-gold border border-cyber-gold/15 transition-all duration-300"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </motion.button>

      {/* Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: -20, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50, x: 20 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 h-[500px] rounded-premium bg-white dark:bg-premium-cardDark border border-slate-100 dark:border-slate-800/50 shadow-2xl overflow-hidden flex flex-col neon-glow-cyan"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-cyber-cyan via-brand-500 to-cyber-gold text-white flex items-center justify-between border-b border-cyber-cyan/15">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm">
                    NexCart Support
                  </h4>
                  <span className="text-[10px] text-brand-100 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-ping" />
                    Online • AI Representative
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white rounded-full p-1 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900/30 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                      msg.sender === "user"
                        ? "bg-brand-500 text-white rounded-br-none"
                        : "bg-white dark:bg-premium-cardLight/5 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-800"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <span
                      className={`block text-[9px] text-right mt-1 ${
                        msg.sender === "user"
                          ? "text-brand-100"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-premium-cardLight/5 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-bl-none px-4 py-3 text-sm flex gap-1 items-center">
                    <span
                      className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce"
                      style={{ animationDelay: "0s" }}
                    />
                    <span
                      className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <span
                      className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-slate-100 dark:border-slate-800 flex gap-2 bg-white dark:bg-premium-cardDark"
            >
              <input
                type="text"
                placeholder="Ask about shipping, returns, coupons..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-500 dark:text-white"
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 gradient-orange text-white rounded-xl shadow-md disabled:opacity-50 hover:shadow-premium-orange transition-all duration-300"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
