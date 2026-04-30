import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, ShieldCheck, Truck, Ruler } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

const ProductQuickView = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.image_urls && product.image_urls.length > 0) {
        setMainImage(product.image_urls[0]);
      } else {
        setMainImage(product.image_url || 'https://via.placeholder.com/800x1000?text=Cozy+Fits+Couture');
      }
      setSelectedSize(''); // Reset selection when product changes
      setShowSizeGuide(false);
    }
  }, [product]);

  if (!product) return null;

  const images = (product.image_urls && product.image_urls.length > 0) 
    ? product.image_urls 
    : [product.image_url || 'https://via.placeholder.com/800x1000?text=Cozy+Fits+Couture'];

  const productSizes = product.sizes || ['6M', '1Y', '2Y', '3Y', '4Y'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark-slate/20 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-white w-full max-w-6xl rounded-[2rem] sm:rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row h-full max-h-[95vh] sm:max-h-[90vh]"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-8 sm:right-8 z-30 p-2 glass rounded-full text-dark-slate hover:bg-dark-slate hover:text-white transition-all shadow-lg"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>

            {/* Image Section */}
            <div className="md:w-1/2 flex flex-col bg-neutral-soft p-4 sm:p-6 md:p-8 shrink-0">
              <div className="w-full h-64 sm:h-80 md:flex-1 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden bg-white mb-4">
                <img 
                  src={mainImage || 'https://via.placeholder.com/800x1000?text=Cozy+Fits+Couture'} 
                  alt={product.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 custom-scrollbar">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImage(img)}
                      className={`relative flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-dark-slate' : 'border-transparent hover:border-slate-300'}`}
                    >
                      <img 
                        src={img || 'https://via.placeholder.com/800x1000?text=Cozy+Fits+Couture'} 
                        alt={`${product.title} - view ${index + 1}`} 
                        className="w-full h-full object-cover" 
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="md:w-1/2 p-6 sm:p-10 md:p-16 flex flex-col overflow-y-auto">
              <div className="mb-6 sm:mb-10">
                <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.3em] sm:tracking-[0.5em] text-accent-gold uppercase mb-2 sm:mb-4 block">{product.category}</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark-slate mb-3 sm:mb-4 leading-tight">{product.title}</h2>
                <p className="text-xl sm:text-2xl font-bold text-dark-slate">PKR {Number(product.price_pkr).toLocaleString()}</p>
              </div>

              <p className="text-slate-500 leading-relaxed font-light text-base sm:text-lg mb-8 sm:mb-10">
                {product.description || 'A masterpiece of comfort and style. Handcrafted with precision using 100% organic materials to ensure your child feels as royal as they look.'}
              </p>

              {/* Size Selector - Minimalist */}
              <div className="space-y-4 mb-8 sm:mb-10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">Select Size</span>
                    <button 
                      onClick={() => setShowSizeGuide(!showSizeGuide)}
                      className="flex items-center space-x-1 text-[8px] font-bold text-accent-gold hover:text-dark-slate transition-colors uppercase tracking-widest"
                    >
                      <Ruler size={10} />
                      <span>Size Guide</span>
                    </button>
                  </div>
                  {selectedSize && (
                    <span className="text-[8px] sm:text-[10px] font-bold text-accent-gold uppercase tracking-widest">Selected: {selectedSize}</span>
                  )}
                </div>

                <AnimatePresence>
                  {showSizeGuide && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 mb-4 border border-slate-100">
                        <table className="w-full text-[9px] sm:text-[10px] font-bold uppercase tracking-tight">
                          <thead>
                            <tr className="text-slate-400 border-b border-slate-200">
                              <th className="pb-2 text-left">Size</th>
                              <th className="pb-2 text-center">Age</th>
                              <th className="pb-2 text-center">Height</th>
                              <th className="pb-2 text-right">Weight</th>
                            </tr>
                          </thead>
                          <tbody className="text-slate-600">
                            <tr className="border-b border-slate-100"><td className="py-2">NB</td><td className="py-2 text-center">New Born</td><td className="py-2 text-center">50-56cm</td><td className="py-2 text-right">3-4kg</td></tr>
                            <tr className="border-b border-slate-100"><td className="py-2">3M</td><td className="py-2 text-center">0-3 Months</td><td className="py-2 text-center">56-62cm</td><td className="py-2 text-right">4-6kg</td></tr>
                            <tr className="border-b border-slate-100"><td className="py-2">6M</td><td className="py-2 text-center">3-6 Months</td><td className="py-2 text-center">62-68cm</td><td className="py-2 text-right">6-8kg</td></tr>
                            <tr className="border-b border-slate-100"><td className="py-2">1Y</td><td className="py-2 text-center">12 Months</td><td className="py-2 text-center">74-80cm</td><td className="py-2 text-right">9-11kg</td></tr>
                            <tr className="border-b border-slate-100"><td className="py-2">2Y</td><td className="py-2 text-center">2 Years</td><td className="py-2 text-center">86-92cm</td><td className="py-2 text-right">12-14kg</td></tr>
                            <tr className="border-b border-slate-100"><td className="py-2">3Y</td><td className="py-2 text-center">3 Years</td><td className="py-2 text-center">94-98cm</td><td className="py-2 text-right">14-16kg</td></tr>
                            <tr className="border-b border-slate-100"><td className="py-2">4Y</td><td className="py-2 text-center">4 Years</td><td className="py-2 text-center">100-104cm</td><td className="py-2 text-right">16-18kg</td></tr>
                            <tr className="border-b border-slate-100"><td className="py-2">6Y</td><td className="py-2 text-center">6 Years</td><td className="py-2 text-center">112-116cm</td><td className="py-2 text-right">20-22kg</td></tr>
                          </tbody>
                        </table>
                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                          <p className="text-[8px] text-dark-slate font-bold uppercase tracking-widest">How to Measure:</p>
                          <p className="text-[8px] text-slate-400 leading-relaxed italic">
                            Measure height from top of head to floor. If between sizes, we recommend sizing up for comfort. Handcrafted silk has a gentle natural give.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {productSizes.map((size) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl border font-bold text-[10px] sm:text-xs transition-all ${
                        selectedSize === size 
                          ? 'bg-dark-slate text-white border-dark-slate shadow-lg scale-105' 
                          : 'bg-white text-dark-slate border-slate-100 hover:border-dark-slate'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-auto">
                <button
                  disabled={!selectedSize}
                  onClick={() => {
                    if (!selectedSize) {
                      alert('Please select a size first');
                      return;
                    }
                    addToCart(product, selectedSize);
                    onClose();
                  }}
                  className={`flex-1 py-4 sm:py-5 rounded-2xl flex items-center justify-center space-x-3 sm:space-x-4 text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em] transition-all ${
                    selectedSize 
                      ? 'bg-dark-slate text-white hover:shadow-2xl' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span>{selectedSize ? 'ADD TO BAG' : 'SELECT SIZE'}</span>
                </button>
                <button className="p-4 sm:p-5 border border-slate-100 rounded-2xl text-slate-400 hover:text-red-400 hover:border-red-100 transition-all">
                  <Heart size={18} className="sm:w-[20px] sm:h-[20px]" />
                </button>
              </div>

              {/* Trust Signals */}
              <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-4 sm:gap-8 border-t border-slate-50 pt-8 sm:pt-10">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent-sage/10 flex items-center justify-center text-accent-sage">
                    <ShieldCheck size={16} className="sm:w-[20px] sm:h-[20px]" />
                  </div>
                  <span className="text-[8px] sm:text-[10px] font-bold tracking-widest text-slate-500 uppercase">Ethically Crafted</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent-gold/10 flex items-center justify-center text-accent-gold">
                    <Truck size={16} className="sm:w-[20px] sm:h-[20px]" />
                  </div>
                  <span className="text-[8px] sm:text-[10px] font-bold tracking-widest text-slate-500 uppercase">Shipping All Over Pakistan</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductQuickView;
