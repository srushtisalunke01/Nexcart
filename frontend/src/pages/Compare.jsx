import React from 'react';
import { useCompareStore } from '../store/compareStore.js';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Scale, ArrowLeft, Plus } from 'lucide-react';

const Compare = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompareStore();
  const navigate = useNavigate();

  // Aggregate all unique specification names across all items to map them side-by-side
  const allSpecNames = Array.from(
    new Set(
      compareItems.flatMap(item => 
        (item.specifications || []).map(spec => spec.name)
      )
    )
  );

  return (
    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="flex items-center justify-between mb-10 pb-6 border-b border-luxury-gray-medium/50">
        <div>
          <span class="text-xs text-luxury-gold font-bold tracking-widest uppercase block mb-1">Feature Evaluator</span>
          <h1 class="font-serif text-3.5xl font-bold text-luxury-blue-dark">Compare Listings</h1>
        </div>
        
        {compareItems.length > 0 && (
          <button 
            onClick={clearCompare}
            class="text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-widest"
          >
            Clear List
          </button>
        )}
      </div>

      {compareItems.length === 0 ? (
        /* Empty Compare State */
        <div class="text-center py-20 bg-white/40 border border-white/20 rounded-2xl p-10 max-w-md mx-auto space-y-4">
          <Scale className="w-12 h-12 text-luxury-gold mx-auto animate-luxury-float" />
          <h3 class="font-serif text-xl font-bold text-luxury-blue-dark">Comparison Sheet Empty</h3>
          <p class="text-xs text-luxury-gray-dark">
            Browse our catalog listings and select products to inspect parameters side-by-side.
          </p>
          <div class="pt-4">
            <Link to="/shop" class="btn-primary text-xs uppercase tracking-widest inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Items from Shop
            </Link>
          </div>
        </div>
      ) : (
        /* Compare Matrix Table */
        <div class="overflow-x-auto rounded-3xl border border-luxury-gray-medium/40 shadow-luxury bg-white">
          <table class="w-full border-collapse text-left">
            <thead>
              <tr class="bg-luxury-blue-deep text-white">
                <th class="p-6 font-serif text-sm font-bold min-w-[200px] border-r border-white/5">Listing Parameter</th>
                {compareItems.map(item => (
                  <th key={item._id} class="p-6 min-w-[240px] relative border-r border-white/5 last:border-r-0">
                    {/* Delete button */}
                    <button 
                      onClick={() => removeFromCompare(item._id)}
                      class="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    {/* Thumbnail */}
                    <div class="h-40 w-full rounded-2xl overflow-hidden bg-luxury-gray-light mb-4">
                      <img src={item.images[0]} alt={item.name} class="w-full h-full object-cover" />
                    </div>
                    
                    <span class="text-[9px] font-bold text-luxury-gold uppercase tracking-widest block mb-1">{item.brand}</span>
                    <h3 class="font-serif text-sm font-bold line-clamp-2 text-white leading-tight mb-2">{item.name}</h3>
                    <span class="text-base font-bold text-luxury-gold">${item.price}</span>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody class="text-xs font-semibold text-luxury-blue-dark">
              {/* Row: Trade Channel */}
              <tr class="border-b border-luxury-gray-medium/30 hover:bg-luxury-gray-light/30">
                <td class="p-5 font-bold uppercase tracking-wider text-luxury-gray text-[10px] bg-luxury-gray-light/10 border-r border-luxury-gray-medium/20">Trade Channel</td>
                {compareItems.map(item => (
                  <td key={item._id} class="p-5 border-r border-luxury-gray-medium/20 last:border-r-0">
                    <span class={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${
                      item.isWholesale ? 'bg-luxury-blue text-white' : 'bg-luxury-gold text-luxury-blue-dark'
                    }`}>
                      {item.isWholesale ? 'B2B Wholesale' : 'Standard Retail'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row: Condition */}
              <tr class="border-b border-luxury-gray-medium/30 hover:bg-luxury-gray-light/30">
                <td class="p-5 font-bold uppercase tracking-wider text-luxury-gray text-[10px] bg-luxury-gray-light/10 border-r border-luxury-gray-medium/20">Condition Grade</td>
                {compareItems.map(item => (
                  <td key={item._id} class="p-5 border-r border-luxury-gray-medium/20 last:border-r-0">
                    {item.condition || 'New'}
                  </td>
                ))}
              </tr>

              {/* Row: MOQ */}
              <tr class="border-b border-luxury-gray-medium/30 hover:bg-luxury-gray-light/30">
                <td class="p-5 font-bold uppercase tracking-wider text-luxury-gray text-[10px] bg-luxury-gray-light/10 border-r border-luxury-gray-medium/20">Minimum Order (MOQ)</td>
                {compareItems.map(item => (
                  <td key={item._id} class="p-5 border-r border-luxury-gray-medium/20 last:border-r-0">
                    {item.isWholesale ? `${item.minOrderQuantity} units` : 'No Limit (1)'}
                  </td>
                ))}
              </tr>

              {/* Row: Seller Badges */}
              <tr class="border-b border-luxury-gray-medium/30 hover:bg-luxury-gray-light/30">
                <td class="p-5 font-bold uppercase tracking-wider text-luxury-gray text-[10px] bg-luxury-gray-light/10 border-r border-luxury-gray-medium/20">Seller Classification</td>
                {compareItems.map(item => (
                  <td key={item._id} class="p-5 border-r border-luxury-gray-medium/20 last:border-r-0">
                    {item.sellerType || 'Business Seller'}
                  </td>
                ))}
              </tr>

              {/* Dynamic Rows: Specs attributes */}
              {allSpecNames.map(specName => (
                <tr key={specName} class="border-b border-luxury-gray-medium/30 hover:bg-luxury-gray-light/30">
                  <td class="p-5 font-bold uppercase tracking-wider text-luxury-gray text-[10px] bg-luxury-gray-light/10 border-r border-luxury-gray-medium/20">{specName}</td>
                  {compareItems.map(item => {
                    const match = (item.specifications || []).find(s => s.name === specName);
                    return (
                      <td key={item._id} class="p-5 border-r border-luxury-gray-medium/20 last:border-r-0">
                        {match ? match.value : <span class="text-luxury-gray/40">—</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Row: Action Acquisitions */}
              <tr>
                <td class="p-5 font-bold uppercase tracking-wider text-luxury-gray text-[10px] bg-luxury-gray-light/10 border-r border-luxury-gray-medium/20">Checkout</td>
                {compareItems.map(item => (
                  <td key={item._id} class="p-5 border-r border-luxury-gray-medium/20 last:border-r-0">
                    <button 
                      onClick={() => navigate(`/product/${item._id}`)}
                      class="btn-primary w-full py-2.5 text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 bg-luxury-blue"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Acquire Asset
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Floating back option */}
      <div class="mt-8 text-left">
        <Link to="/shop" class="inline-flex items-center gap-1.5 text-xs font-bold text-luxury-blue hover:text-luxury-blue-light transition-colors">
          <ArrowLeft className="w-4 h-4" /> Return to Catalog List
        </Link>
      </div>
    </div>
  );
};

export default Compare;
