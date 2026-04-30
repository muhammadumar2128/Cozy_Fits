import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group"
    >
      <div 
        className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-neutral-soft shadow-sm group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-700 cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        <img
          src={(product.image_urls && product.image_urls.length > 0 && product.image_urls[0]) ? product.image_urls[0] : (product.image_url || 'https://via.placeholder.com/400x500?text=Cozy+Fits+Couture')}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />

        {product.is_new_arrival && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-accent-gold text-white text-[7px] font-bold px-3 py-1 rounded-full tracking-[0.2em] uppercase shadow-lg">
              New Arrival
            </span>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-dark-slate/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-4 right-4">
          <button 
            onClick={(e) => { e.stopPropagation(); }}
            className="w-8 h-8 glass rounded-full flex items-center justify-center text-dark-slate hover:bg-dark-slate hover:text-white transition-all scale-0 group-hover:scale-100 duration-300"
          >
            <Heart size={14} />
          </button>
        </div>

        <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full bg-dark-slate text-white py-3 rounded-xl flex items-center justify-center space-x-2 text-[9px] font-bold tracking-[0.2em] shadow-xl hover:bg-accent-gold transition-colors"
          >
            <ShoppingBag size={12} />
            <span>SELECT SIZE</span>
          </button>
        </div>
      </div>

      <div className="mt-5 text-center px-2">
        <div className="flex flex-col items-center space-y-1">
          <span className="text-[7px] font-bold tracking-[0.4em] text-accent-gold uppercase">{product.category}</span>
          <h3 className="text-[11px] font-bold tracking-tight text-dark-slate uppercase">{product.title}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-sm font-bold text-dark-slate">PKR {Number(product.price_pkr).toLocaleString()}</p>
          </div>
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex justify-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {product.sizes.slice(0, 3).map(size => (
                <span key={size} className="text-[6px] font-bold text-slate-400 border border-slate-100 px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">
                  {size}
                </span>
              ))}
              {product.sizes.length > 3 && <span className="text-[6px] font-bold text-slate-400 px-1">+</span>}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
