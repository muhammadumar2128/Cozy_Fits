import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Heart, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ui/ProductCard';
import ProductQuickView from '../../components/ui/ProductQuickView';
import { useProducts } from '../../hooks/useProducts';

const Home = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products, loading } = useProducts(null, true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.8,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-silk">
      {/* Editorial Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 sm:pt-20 overflow-hidden">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto w-full px-6 grid grid-cols-12 gap-8 lg:gap-4 items-center"
        >
          
          {/* Text Content */}
          <div className="col-span-12 lg:col-span-6 z-20 order-2 lg:order-1">
            <div className="space-y-6 sm:space-y-10">
              <motion.div variants={itemVariants} className="flex items-center space-x-2">
                <div className="h-[1px] w-8 sm:w-12 bg-accent-gold" />
                <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.3em] sm:tracking-[0.4em] text-accent-gold uppercase">Est. 2026 • Premium Quality</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.9] sm:leading-[0.85]">
                LITTLE <br />
                <span className="text-accent-gold italic font-normal">Royalty.</span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-base sm:text-lg text-slate-500 max-w-sm leading-relaxed font-light">
                Crafting timeless elegance for the next generation. Our couture pieces blend traditional craftsmanship with modern comfort.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 pt-4">
                <Link to="/collection" className="silk-button group flex items-center space-x-3 w-full sm:w-auto justify-center">
                  <span className="tracking-[0.2em] text-xs font-bold">DISCOVER NOW</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <div className="flex items-center">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white overflow-hidden bg-slate-200 shadow-sm">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Customer" onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=C'; }} />
                      </div>
                    ))}                  </div>
                  <div className="pl-4 sm:pl-6 flex flex-col justify-center">
                    <span className="text-[8px] sm:text-[10px] font-bold text-slate-900 uppercase tracking-tighter">2k+ Happy Moms</span>
                    <div className="flex text-accent-gold"><Star size={6} sm:size={8} fill="currentColor" /><Star size={6} sm:size={8} fill="currentColor" /><Star size={6} sm:size={8} fill="currentColor" /><Star size={6} sm:size={8} fill="currentColor" /><Star size={6} sm:size={8} fill="currentColor" /></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Hero Images */}
          <div className="col-span-12 lg:col-span-6 relative h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center order-1 lg:order-2 mb-12 lg:mb-0">
            <motion.div 
              variants={itemVariants}
              className="absolute left-4 sm:left-0 top-0 sm:top-10 w-40 sm:w-48 md:w-64 aspect-[3/4] z-10"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full"
              >
                <img 
                  src="/images/Cute dungaree from NeXT Uk Available to order.jpg" 
                  className="w-full h-full object-cover floating-img shadow-2xl" 
                  alt="Brand Couture" 
                />
              </motion.div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="absolute right-4 sm:right-0 bottom-0 sm:bottom-10 w-48 sm:w-56 md:w-80 aspect-[4/5] z-0"
            >
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="w-full h-full"
              >
                <img 
                  src="/images/Cute dungaree from NeXT Uk Available to order (1).jpg" 
                  className="w-full h-full object-cover floating-img border-[6px] sm:border-[10px] border-white shadow-2xl" 
                  alt="Brand Couture" 
                />
              </motion.div>
            </motion.div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-accent-rose/10 rounded-full blur-[60px] sm:blur-[100px] -z-10" />
          </div>
        </motion.div>
      </section>

      {/* Infinite Luxury Banner */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="bg-dark-slate py-6 overflow-hidden transform -rotate-1 origin-center scale-105 shadow-xl"
      >
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center mx-10">
              <span className="text-xs font-bold tracking-[0.5em] text-white/40 uppercase">100% Imported Items from the UK • Luxury Babywear • Shipping All Over Pakistan</span>
              <div className="w-2 h-2 rounded-full bg-accent-gold mx-10 shadow-[0_0_10px_#D4AF37]" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Featured Collection */}
      <section className="py-24 sm:py-48 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16 sm:mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className="text-[8px] sm:text-[10px] font-bold tracking-[0.4em] sm:tracking-[0.5em] text-accent-gold uppercase"
          >
            The New Collection
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold mt-4"
          >
            Heritage & <span className="italic font-normal text-accent-gold">Elegance</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <Loader2 className="animate-spin text-accent-gold" size={48} />
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center text-slate-400 italic py-20">
              New arrivals coming soon...
            </div>
          ) : (
            products.slice(0, 3).map((product, idx) => (
              <div key={product.id} className={`${idx === 1 ? 'md:-translate-y-12' : ''} max-w-[320px] mx-auto w-full`}>
                <ProductCard 
                  product={product} 
                  onQuickView={(p) => setSelectedProduct(p)} 
                />
              </div>
            ))
          )}
        </div>
        
        <div className="mt-20 sm:mt-32 text-center">
          <Link to="/collection" className="group inline-flex flex-col items-center">
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.3em] mb-4 uppercase">Explore Full Collection</span>
            <div className="h-[2px] w-16 sm:w-20 bg-dark-slate group-hover:w-32 sm:group-hover:w-40 transition-all duration-700" />
          </Link>
        </div>
      </section>

      {/* Minimal Heritage Section */}
      <section className="py-24 sm:py-48 px-6 bg-white/30 backdrop-blur-sm border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 sm:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden shadow-2xl">
              <img 
                src="/images/our story image.png" 
                className="w-full h-full object-cover" 
                alt="Cozy Fits Heritage" 
              />
            </div>
            <div className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-10 glass p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] max-w-[180px] sm:max-w-[240px] hidden sm:block">
              <p className="text-[8px] sm:text-[10px] font-bold tracking-widest leading-relaxed uppercase">
                "We drape the next generation in elegance and tradition."
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5 }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <div>
                <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.4em] sm:tracking-[0.5em] text-accent-gold uppercase">The Heritage</span>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-4 leading-tight text-dark-slate uppercase tracking-tighter">
                  Born from <br /><span className="italic font-normal">British Tradition.</span>
                </h2>
              </div>
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed font-light">
                CozyFits.pk is rooted in a legacy of timeless craftsmanship and refined elegance. Every piece reflects an enduring commitment to quality, where soft fabrics and delicate details are thoughtfully designed to honor life’s earliest moments. From the heart of the UK to the homes of Pakistan, our heritage is woven into every stitch.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.4em] sm:tracking-[0.5em] text-accent-gold uppercase">Our Vision</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 leading-tight text-dark-slate uppercase tracking-tighter">
                  To become Pakistan’s most <span className="italic font-normal">Trusted Destination.</span>
                </h2>
              </div>
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed font-light">
                Bringing timeless British elegance, uncompromising quality, and gentle comfort to every child’s beginning.
              </p>
            </div>

            <div className="pt-4">
              <Link to="/collection" className="group inline-flex items-center space-x-4">
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase">Start Your Journey</span>
                <div className="w-8 sm:w-12 h-[1px] bg-dark-slate group-hover:w-16 sm:group-hover:w-24 transition-all duration-700" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Global Quick View Modal */}
      <ProductQuickView 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
};

export default Home;
