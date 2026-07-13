import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Folder, Compass } from 'lucide-react';
import axios from 'axios';

const CategoryNav = ({ isOpen, onClose, onSelectCategory }) => {
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [activeParent, setActiveParent] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories/tree');
        if (response.data.success && response.data.tree.length > 0) {
          setCategoriesTree(response.data.tree);
        } else {
          // Fallback static structure for initial launch if database is clean
          setCategoriesTree([
            {
              _id: 'c1',
              name: 'Haute Horology',
              slug: 'watches',
              icon: 'Watch',
              children: [
                { _id: 'c11', name: 'Chronographs', slug: 'chronographs' },
                { _id: 'c12', name: 'Mechanicals', slug: 'mechanical-watches' }
              ]
            },
            {
              _id: 'c2',
              name: 'Boutique Apparel',
              slug: 'apparel',
              icon: 'Shirt',
              children: [
                { _id: 'c21', name: 'Evening Wear', slug: 'evening-gowns' },
                { _id: 'c22', name: 'Tailored Suits', slug: 'suits' }
              ]
            },
            {
              _id: 'c3',
              name: 'Executive Tech',
              slug: 'executive-tech',
              icon: 'Laptop',
              children: [
                { _id: 'c31', name: 'Ultra Displays', slug: 'displays' },
                { _id: 'c32', name: 'Smart Audio', slug: 'audio-devices' }
              ]
            }
          ]);
        }
      } catch (err) {
        console.error('Failed to load categories tree:', err);
      }
    };

    fetchCategories();
  }, [isOpen]);

  const selectCat = (slug) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            class="fixed inset-0 bg-luxury-blue-dark/40 backdrop-blur-xs z-50"
          />

          {/* Slide out drawer panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            class="glass-card-light fixed left-0 top-0 bottom-0 w-80 max-w-[90vw] h-full shadow-2xl z-50 flex flex-col border-r border-white/40"
          >
            {/* Drawer Header */}
            <div class="p-6 flex items-center justify-between border-b border-luxury-gray-medium/50">
              <div class="flex items-center gap-2">
                <Compass className="w-5 h-5 text-luxury-gold animate-spin-slow" />
                <span class="font-serif text-lg font-bold text-luxury-blue">Departments</span>
              </div>
              <button 
                onClick={onClose}
                class="p-1.5 rounded-full hover:bg-luxury-gray-medium/40 text-luxury-blue-dark/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Listing Content */}
            <div class="flex-grow overflow-y-auto p-4 space-y-2 select-none">
              {activeParent ? (
                /* Subcategories level */
                <div class="space-y-2">
                  <button 
                    onClick={() => setActiveParent(null)}
                    class="text-xs font-bold text-luxury-gold-dark hover:text-luxury-gold flex items-center gap-1 mb-4"
                  >
                    &larr; Back to Main Categories
                  </button>
                  <h3 class="font-serif text-lg font-bold text-luxury-blue-dark px-2 mb-2">{activeParent.name}</h3>
                  <div class="space-y-1">
                    {/* View all option */}
                    <button 
                      onClick={() => selectCat(activeParent.slug)}
                      class="w-full text-left px-4 py-2.5 rounded-xl hover:bg-luxury-blue hover:text-white transition-all duration-200 text-sm font-semibold flex items-center justify-between"
                    >
                      <span>All {activeParent.name}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    {activeParent.children.map(child => (
                      <button
                        key={child._id}
                        onClick={() => selectCat(child.slug)}
                        class="w-full text-left px-4 py-2.5 rounded-xl hover:bg-luxury-blue/5 text-luxury-blue-dark hover:text-luxury-blue transition-all duration-200 text-sm font-medium flex items-center justify-between"
                      >
                        {child.name}
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Parent categories level */
                categoriesTree.map(cat => (
                  <div key={cat._id} class="w-full">
                    {cat.children && cat.children.length > 0 ? (
                      <button
                        onClick={() => setActiveParent(cat)}
                        class="w-full text-left px-4 py-3 rounded-xl hover:bg-luxury-blue/5 text-luxury-blue-dark hover:text-luxury-blue font-semibold text-sm flex items-center justify-between transition-all duration-200"
                      >
                        <span class="flex items-center gap-2">
                          <Folder className="w-4 h-4 text-luxury-gold" /> {cat.name}
                        </span>
                        <ChevronRight className="w-4 h-4 text-luxury-gray" />
                      </button>
                    ) : (
                      <button
                        onClick={() => selectCat(cat.slug)}
                        class="w-full text-left px-4 py-3 rounded-xl hover:bg-luxury-blue/5 text-luxury-blue-dark hover:text-luxury-blue font-semibold text-sm flex items-center transition-all duration-200"
                      >
                        <span class="flex items-center gap-2">
                          <Folder className="w-4 h-4 text-luxury-gold" /> {cat.name}
                        </span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div class="p-6 border-t border-luxury-gray-medium/50 bg-luxury-gray-light/50 text-center">
              <span class="text-[10px] font-bold uppercase tracking-wider text-luxury-gray-dark">NEXUS ONE TRADE PORTAL</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CategoryNav;
