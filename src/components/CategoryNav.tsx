import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Laptop, Watch, Sparkles, Shirt, Home, ChevronRight, Tags, Store } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

interface CategoryNavProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (catId: string, subCatId?: string) => void;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

const iconMap: Record<string, React.FC<any>> = {
  Laptop,
  Watch,
  Sparkles,
  Shirt,
  Home
};

export const CategoryNav: React.FC<CategoryNavProps> = ({ isOpen, onClose, onSelectCategory, onNavigate }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <div className="absolute inset-y-0 left-0 max-w-full flex">
            {/* Drawer panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-screen max-w-sm bg-white dark:bg-premium-cardDark border-r border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gradient-orange text-white">
                <div className="flex items-center gap-2">
                  <Tags className="h-5 w-5" />
                  <h3 className="font-display font-extrabold text-lg">Shop Departments</h3>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 hover:bg-white/10 text-white/95"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Categories list */}
              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
                {CATEGORIES.map((cat) => {
                  const Icon = iconMap[cat.icon] || Sparkles;
                  return (
                    <div key={cat.id} className="p-1 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/50 dark:border-slate-800/40">
                      {/* Top category heading */}
                      <button
                        onClick={() => {
                          onSelectCategory(cat.id);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl text-left hover:bg-brand-500 hover:text-white transition-all group font-display font-bold text-slate-800 dark:text-white"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-white dark:bg-slate-800 rounded-lg group-hover:bg-white/20 transition-colors">
                            <Icon className="h-5 w-5 text-brand-500 group-hover:text-white transition-colors" />
                          </div>
                          <span>{cat.name}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white" />
                      </button>

                      {/* Subcategories list */}
                      <div className="mt-2 ml-2 pl-4 border-l-2 border-slate-105 dark:border-slate-800/80 space-y-1 pb-2">
                        {cat.subcategories.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              onSelectCategory(cat.id, sub.id);
                              onClose();
                            }}
                            className="w-full text-left py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-500 hover:text-brand-500 hover:bg-brand-50/50 dark:text-slate-400 dark:hover:text-brand-400 dark:hover:bg-brand-500/5 transition-colors"
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Department Catalogues Switcher Options */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-900/10 space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Switch Catalogues</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onNavigate('home');
                      onClose();
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800 transition-all font-display font-bold text-[10px]"
                  >
                    <Laptop className="h-3.5 w-3.5 text-brand-500" />
                    <span>Official Shop</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('marketplace');
                      onClose();
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800 transition-all font-display font-bold text-[10px]"
                  >
                    <Store className="h-3.5 w-3.5 text-brand-500" />
                    <span>Marketplace</span>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-center">
                <p className="text-[11px] text-slate-400 font-medium">NexCart Premium E-Commerce Experience</p>
                <p className="text-[10px] text-slate-400">© 2026 NexCart Inc. All rights reserved.</p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
