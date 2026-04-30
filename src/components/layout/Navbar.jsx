import React from 'react';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CartDrawer from './CartDrawer';
import { useCart } from '../../hooks/useCart';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const { cart } = useCart();

  React.useEffect(() => {
    const handleAutoOpen = () => setIsCartOpen(true);
    window.addEventListener('cozyfits_open_cart', handleAutoOpen);
    return () => window.removeEventListener('cozyfits_open_cart', handleAutoOpen);
  }, []);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav className="fixed top-2 sm:top-7 left-0 right-0 z-50 px-3 sm:px-6 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto glass rounded-[1.5rem] sm:rounded-[2.5rem] px-4 sm:px-10 py-3 sm:py-4 flex items-center justify-between shadow-2xl border-white/20">
          <Link to="/" className="text-lg sm:text-xl font-bold tracking-[0.3em] sm:tracking-[0.4em] text-dark-slate flex flex-col">
            <span className="leading-none text-nowrap">COZY FITS</span>
            <span className="text-[7px] sm:text-[8px] tracking-[0.6em] sm:tracking-[0.8em] text-accent-gold ml-0.5 sm:ml-1">COUTURE</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-12 text-[10px] font-bold tracking-[0.3em] text-slate-400">
            <Link to="/" className="hover:text-dark-slate transition-colors uppercase">Home</Link>
            <Link to="/collection" className="hover:text-dark-slate transition-colors uppercase">Collections</Link>
            <Link to="/new-arrival" className="hover:text-dark-slate transition-colors uppercase">New Arrivals</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link to="/admin-login" className="hidden sm:block text-slate-400 hover:text-dark-slate transition-colors">
              <User size={18} />
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="text-dark-slate hover:text-accent-gold transition-colors relative"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-dark-slate text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="md:hidden text-dark-slate p-1" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden mt-4 glass rounded-[2rem] p-8 flex flex-col space-y-6 text-center font-bold text-xs tracking-[0.2em] text-slate-500"
            >
              <Link to="/collection" onClick={() => setIsOpen(false)} className="uppercase">Collection</Link>
              <Link to="/new-arrival" onClick={() => setIsOpen(false)} className="uppercase">New Arrivals</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="uppercase">Our Story</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
