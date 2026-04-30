import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollToTop from './components/layout/ScrollToTop';
import AnnouncementBanner from './components/layout/AnnouncementBanner';
import Navbar from './components/layout/Navbar';
import Home from './pages/public/Home';
import Collection from './pages/public/Collection';
import Checkout from './pages/public/Checkout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsOfService from './pages/public/TermsOfService';

// Simple placeholders for missing pages
const NewArrivals = () => <Collection />; 

// Component to handle conditional layout
const LayoutManager = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <AnnouncementBanner />}
      {!isAdmin && <Navbar />}
      <main>
        {children}
      </main>
      {!isAdmin && (
        <footer className="py-12 sm:py-20 px-6 border-t border-slate-100 mt-12 sm:mt-20 bg-neutral-soft/30">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12">
            <div className="col-span-1 sm:col-span-2">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 tracking-widest text-slate-900 uppercase">COZY FITS<span className="text-accent-gold">.</span>PK</h2>
              <p className="text-slate-500 max-w-sm leading-relaxed text-sm">
                Elevating children's fashion with a focus on luxury, comfort, and sustainability. Every piece is crafted with love and care for your little ones.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 sm:mb-6 text-[10px] sm:text-xs tracking-[0.2em] uppercase text-slate-400">Shop</h4>
              <ul className="space-y-3 sm:space-y-4 text-slate-600 text-xs sm:text-sm font-medium">
                <li><Link to="/collection" className="hover:text-accent-gold transition-colors">All Products</Link></li>
                <li><Link to="/new-arrival" className="hover:text-accent-gold transition-colors">New Arrivals</Link></li>
                <li><a href="#" className="hover:text-accent-gold transition-colors">Winter '26</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 sm:mb-6 text-[10px] sm:text-xs tracking-[0.2em] uppercase text-slate-400">Support</h4>
              <ul className="space-y-3 sm:space-y-4 text-slate-600 text-xs sm:text-sm font-medium">
                <li><Link to="/terms-of-service" className="hover:text-accent-gold transition-colors">Shipping & Returns</Link></li>
                <li><a href="#" className="hover:text-accent-gold transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-accent-gold transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 sm:mt-20 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-[9px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 font-bold uppercase space-y-4 md:space-y-0 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
              <p>© 2026 COZY FITS.PK ALL RIGHTS RESERVED.</p>
              <a 
                href="https://lunarai.agency/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-2 group"
              >
                <span className="text-slate-300 transition-colors group-hover:text-slate-500">POWERED BY</span>
                <span className="shiny-text font-black tracking-[0.3em] group-hover:scale-105 transition-transform">LUNARAI</span>
              </a>
            </div>
            <div className="flex space-x-6 sm:space-x-8">
              <Link to="/privacy-policy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate initial loading for a smooth entrance
    const timer = setTimeout(() => setIsReady(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-primary">
        <AnimatePresence mode="wait">
          {!isReady && (
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="fixed inset-0 z-[1000] bg-primary flex items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="text-xl font-bold tracking-[0.6em] text-dark-slate flex flex-col items-center"
              >
                <span>COZY FITS</span>
                <span className="text-[8px] tracking-[0.8em] text-accent-gold mt-3">COUTURE</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.5, ease: "easeOut", delay: 0.5 }}
        >
          <LayoutManager>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/new-arrival" element={<NewArrivals />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
            </Routes>
          </LayoutManager>
        </motion.div>
      </div>
    </Router>
  );
}

export default App;
