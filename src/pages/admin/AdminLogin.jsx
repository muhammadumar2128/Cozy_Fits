import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // DESIGN BYPASS: Allows you to see the dashboard without Supabase being set up yet
      if (email === 'admin@cozyfits.pk' && password === 'cozyfits2026') {
        console.log('Using Design Bypass - Note: Database operations will fail RLS');
        localStorage.setItem('cozyfits_admin_bypass', 'true');
        navigate('/admin-dashboard');
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-soft px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md p-12 rounded-[3rem] shadow-2xl relative"
      >
        <Link 
          to="/" 
          className="absolute top-8 left-8 text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>

        <div className="text-center mb-10 mt-4">
          <h2 className="text-sm font-bold tracking-[0.4em] text-accent-pink uppercase mb-2">Vault Access</h2>
          <h1 className="text-3xl font-bold text-slate-900">Admin Portal</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/50 border border-slate-100 rounded-full py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-accent-pink/20 transition-all"
                placeholder="admin@cozyfits.pk"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase ml-4">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/50 border border-slate-100 rounded-full py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-accent-pink/20 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-xs text-red-500 text-center font-bold"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-full font-bold tracking-[0.2em] flex items-center justify-center space-x-2 hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <span>SIGN IN</span>}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-[10px] text-slate-400 font-medium tracking-wider">
          SECURE ENCRYPTED ACCESS • AUTHORIZED PERSONNEL ONLY
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
