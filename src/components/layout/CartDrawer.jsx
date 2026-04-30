import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, total, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Shopping Bag</h2>
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">
                  {cart.length} Treasures Selected
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 sm:p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-900"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 sm:space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-soft rounded-full flex items-center justify-center text-slate-300">
                    <ShoppingBag size={28} className="sm:w-8 sm:h-8" />
                  </div>
                  <p className="text-sm sm:text-base text-slate-500 font-medium italic">Your bag is as light as a feather.</p>
                  <button 
                    onClick={onClose}
                    className="text-[10px] sm:text-xs font-bold tracking-[0.2em] border-b-2 border-slate-900 pb-1 uppercase"
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex space-x-4 sm:space-x-6">
                    <div className="w-20 sm:w-24 aspect-luxury bg-neutral-soft rounded-xl sm:rounded-2xl overflow-hidden shrink-0">
                      <img 
                        src={(item.image_urls && item.image_urls.length > 0 && item.image_urls[0]) ? item.image_urls[0] : (item.image_url || 'https://via.placeholder.com/400x500?text=Cozy+Fits+Couture')} 
                        alt={item.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide leading-tight">{item.title}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                            className="text-slate-300 hover:text-red-400 transition-colors ml-2"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <p className="text-[9px] sm:text-[10px] font-bold text-accent-gold tracking-widest mt-1 uppercase">SIZE: {item.selectedSize}</p>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div className="flex items-center space-x-3 sm:space-x-4 glass border-slate-100 rounded-full px-2 sm:px-3 py-0.5 sm:py-1">
                          <button onClick={() => updateQuantity(item.id, item.selectedSize, -1)} className="text-slate-400 hover:text-slate-900"><Minus size={10} className="sm:w-3 sm:h-3" /></button>
                          <span className="text-[10px] sm:text-xs font-bold text-slate-700 w-3 sm:w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.selectedSize, 1)} className="text-slate-400 hover:text-slate-900"><Plus size={10} className="sm:w-3 sm:h-3" /></button>
                        </div>
                        <p className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight">PKR {Number(item.price_pkr * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="p-6 sm:p-8 glass border-t border-white/50 space-y-5 sm:space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] sm:text-xs font-bold tracking-widest text-slate-400 uppercase">
                    <span>Subtotal</span>
                    <span>PKR {Number(total).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] sm:text-xs font-bold tracking-widest text-slate-400 uppercase">
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>
                  <div className="pt-3 sm:pt-4 flex justify-between text-lg sm:text-xl font-bold text-slate-900">
                    <span>Total</span>
                    <span>PKR {Number(total).toLocaleString()}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full bg-slate-900 text-white py-4 sm:py-5 rounded-full font-bold tracking-[0.15em] sm:tracking-[0.2em] flex items-center justify-center space-x-2 sm:space-x-3 shadow-xl hover:shadow-2xl transition-all text-xs sm:text-sm"
                >
                  <span>CHECKOUT NOW</span>
                  <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
