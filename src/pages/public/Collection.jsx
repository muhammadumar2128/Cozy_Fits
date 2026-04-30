import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ui/ProductCard';
import ProductQuickView from '../../components/ui/ProductQuickView';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

const Collection = () => {
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products, loading } = useProducts(selectedCategory);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('name');
      if (data) {
        setCategories(['All', ...data.map(c => c.name)]);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen pt-32 sm:pt-48 pb-20 sm:pb-32 px-6 bg-silk">
      <div className="max-w-7xl mx-auto">
        {/* Gallery Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6"
          >
            <div className="h-[1px] w-6 sm:w-8 bg-accent-gold" />
            <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.4em] sm:tracking-[0.6em] text-accent-gold uppercase">Filter By Style</span>
            <div className="h-[1px] w-6 sm:w-8 bg-accent-gold" />
          </motion.div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-8 sm:mb-10 text-dark-slate uppercase tracking-tighter">
            The <span className="italic font-normal">Curated</span> Selection
          </h1>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-[8px] sm:text-[9px] font-bold tracking-[0.2em] sm:tracking-[0.3em] transition-all border ${
                  selectedCategory === cat 
                  ? 'bg-dark-slate text-white border-dark-slate shadow-lg' 
                  : 'bg-white/40 text-slate-400 border-slate-100 hover:border-accent-gold hover:text-dark-slate'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Dense Professional Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="h-[40vh] flex items-center justify-center">
              <Loader2 className="animate-spin text-accent-gold" size={40} />
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
            >
              {products.length === 0 ? (
                <div className="col-span-full py-20 text-center text-slate-400 italic">
                  No treasures found in this category yet.
                </div>
              ) : (
                products.map((product) => (
                  <div key={product.id}>
                    <ProductCard 
                      product={product} 
                      onQuickView={(p) => setSelectedProduct(p)}
                    />
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Global Quick View Modal for Collection */}
      <ProductQuickView 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
};

export default Collection;
