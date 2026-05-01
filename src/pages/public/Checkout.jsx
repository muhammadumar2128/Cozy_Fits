import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronLeft, CreditCard, Truck, CheckCircle2, Loader2, Building2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { supabase } from '../../lib/supabase';

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    phone: '',
  });

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode.toUpperCase())
        .eq('active', true)
        .single();

      if (error || !data) {
        setPromoError('Invalid or inactive promo code.');
        setAppliedPromo(null);
      } else {
        // Check expiry
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          setPromoError('This promo code has expired.');
          setAppliedPromo(null);
        } else {
          setAppliedPromo(data);
          setPromoError('');
        }
      }
    } catch (err) {
      setPromoError('Error validating promo code.');
    } finally {
      setPromoLoading(false);
    }
  };

  const discountAmount = appliedPromo ? (total * appliedPromo.discount_percentage / 100) : 0;
  const subtotalAfterDiscount = total - discountAmount;
  const shippingFee = subtotalAfterDiscount > 3000 ? 0 : 250;
  const finalTotal = subtotalAfterDiscount + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: newOrder, error } = await supabase
        .from('orders')
        .insert([{
          customer_name: `${formData.firstName} ${formData.lastName}`,
          customer_email: formData.email,
          customer_phone: formData.phone,
          shipping_address: `${formData.address}, ${formData.city}`,
          total_amount_pkr: finalTotal,
          items: cart.map(item => ({
            id: item.id,
            title: item.title,
            selectedSize: item.selectedSize,
            quantity: item.quantity,
            price_pkr: item.price_pkr
          })),
          shipping_fee: shippingFee,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      // CALL THE EMAIL FUNCTION DIRECTLY
      try {
        await supabase.functions.invoke('order-confirmation', {
          body: { record: newOrder }
        });
      } catch (emailError) {
        console.error('Email failed to send, but order was placed:', emailError);
      }

      setIsOrdered(true);
      clearCart();
      setTimeout(() => {
        navigate('/');
      }, 5000);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen px-6 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500">
              <CheckCircle2 size={48} />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Order Placed!</h1>
            <p className="text-slate-500 leading-relaxed">
              Thank you for shopping with Cozy Fits. Your little one's treasures will be on their way soon. 
              We've sent a confirmation email to <span className="font-bold text-slate-900">{formData.email}</span>.
            </p>
            <p className="text-xs text-slate-400 font-medium italic mt-4">
              Please don't forget to send your payment screenshot to us on WhatsApp at{' '}
              <a 
                href="https://wa.me/923315033299" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-slate-900 underline hover:text-accent-gold transition-colors"
              >
                0331 5033299
              </a>.
            </p>
          </div>
          <div className="pt-8">
            <Link to="/" className="inline-block bg-slate-900 text-white px-8 py-4 rounded-full font-bold tracking-[0.2em] hover:bg-slate-800 transition-colors">
              BACK TO HOME
            </Link>
          </div>
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Redirecting to home in 5 seconds...</p>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center space-y-8">
        <div className="w-20 h-20 bg-neutral-soft rounded-full flex items-center justify-center text-slate-300">
          <ShoppingBag size={32} />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Your bag is empty</h2>
          <p className="text-slate-500">You need to add some items to your bag before checking out.</p>
        </div>
        <Link to="/collection" className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold tracking-[0.2em] hover:bg-slate-800 transition-colors">
          EXPLORE COLLECTION
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-20 px-4 sm:px-6 bg-primary">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 sm:space-x-4 mb-8 sm:mb-12">
          <Link to="/collection" className="p-1.5 sm:p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-900">
            <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight uppercase">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16">
          {/* Main Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-10 sm:space-y-12">
              {/* Contact Information */}
              <section className="space-y-5 sm:space-y-6">
                <div className="flex items-center space-x-3 text-slate-400">
                  <Truck size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <h2 className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">Shipping Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">First Name</label>
                    <input 
                      required
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Jane" 
                      className="w-full bg-white border border-slate-100 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Last Name</label>
                    <input 
                      required
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe" 
                      className="w-full bg-white border border-slate-100 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="jane@example.com" 
                    className="w-full bg-white border border-slate-100 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+92 XXX XXXXXXX" 
                    className="w-full bg-white border border-slate-100 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Shipping Address</label>
                  <textarea 
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House number and street name" 
                    rows="3"
                    className="w-full bg-white border border-slate-100 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">City</label>
                  <input 
                    required
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Lahore" 
                    className="w-full bg-white border border-slate-100 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/20 transition-all"
                  />
                </div>
              </section>

              {/* Payment Method */}
              <section className="space-y-5 sm:space-y-6">
                <div className="flex items-center space-x-3 text-slate-400">
                  <CreditCard size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <h2 className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">Payment Method</h2>
                </div>
                
                <div className="p-6 sm:p-8 bg-white border border-slate-900 rounded-[1.5rem] sm:rounded-[2rem] space-y-6 sm:space-y-8 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 rounded-full flex items-center justify-center text-white">
                        <Building2 size={18} className="sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-tight">Bank Transfer</p>
                        <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">Standard Chartered Bank</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-[3px] sm:border-4 border-slate-900 rounded-full flex items-center justify-center">
                      <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-slate-900 rounded-full"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:gap-5 pt-5 sm:pt-6 border-t border-slate-50">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase">Account Name</span>
                      <span className="text-[11px] sm:text-xs font-bold text-slate-900">Usama Mehmood</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase">Account Number</span>
                      <span className="text-[11px] sm:text-xs font-bold text-slate-900 font-mono">01727647501</span>
                    </div>
                    <div className="flex flex-col space-y-2 pt-1">
                      <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase">IBAN Number</span>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] sm:text-xs font-bold text-slate-900 font-mono tracking-wider break-all sm:break-normal">PK03 SCBL 0000 0017 2764 7501</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-accent-gold/5 p-5 sm:p-6 rounded-[1.2rem] sm:rounded-[1.5rem] border border-accent-gold/20 flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-accent-gold text-white p-1 rounded-full mt-0.5 shrink-0">
                    <CheckCircle2 size={10} className="sm:w-3 sm:h-3" />
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-600 leading-relaxed font-medium italic">
                    To complete your order, please transfer the total amount to the account above and send a screenshot of your payment receipt to us on WhatsApp at{' '}
                    <a 
                      href="https://wa.me/923315033299" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-bold text-slate-900 underline hover:text-accent-gold transition-colors"
                    >
                      0331 5033299
                    </a>.
                  </p>
                </div>
              </section>

              <div className="pt-4 sm:pt-6">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-5 sm:py-6 rounded-full font-bold tracking-[0.2em] sm:tracking-[0.3em] shadow-xl hover:shadow-2xl transition-all uppercase flex items-center justify-center space-x-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span className="text-xs sm:text-sm">Processing...</span>
                    </>
                  ) : (
                    <span className="text-xs sm:text-sm">Complete Purchase</span>
                  )}
                </motion.button>
              </div>
            </form>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-10 shadow-sm border border-slate-50 lg:sticky lg:top-32">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 sm:mb-8 uppercase tracking-tight">Order Summary</h2>
              
              <div className="space-y-5 sm:space-y-6 mb-8 sm:mb-10 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex space-x-3 sm:space-x-4">
                    <div className="w-16 h-20 sm:w-20 sm:h-24 bg-neutral-soft rounded-lg sm:rounded-xl overflow-hidden shrink-0">
                      <img 
                        src={(item.image_urls && item.image_urls.length > 0 && item.image_urls[0]) ? item.image_urls[0] : (item.image_url || 'https://via.placeholder.com/400x500?text=Cozy+Fits+Couture')} 
                        alt={item.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{item.title}</h4>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-900 mt-1 uppercase">Size: {item.selectedSize} × {item.quantity}</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1.5 sm:mt-2">PKR {Number(item.price_pkr * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="mb-8 sm:mb-10 p-5 sm:p-6 bg-slate-50 rounded-[1.2rem] sm:rounded-2xl space-y-3 sm:space-y-4">
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Promo Code</label>
                <div className="flex space-x-2 sm:space-x-3">
                  <input 
                    type="text" 
                    placeholder="ENTER CODE" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 min-w-0 bg-white border border-slate-100 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs font-bold focus:outline-none uppercase"
                  />
                  <button 
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoLoading || !promoCode.trim()}
                    className="bg-slate-900 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-bold tracking-widest uppercase disabled:opacity-50 shrink-0"
                  >
                    {promoLoading ? <Loader2 className="animate-spin" size={12} /> : 'APPLY'}
                  </button>
                </div>
                {promoError && <p className="text-[9px] sm:text-[10px] text-red-500 font-bold uppercase ml-1">{promoError}</p>}
                {appliedPromo && <p className="text-[9px] sm:text-[10px] text-green-500 font-bold uppercase ml-1">Success! {appliedPromo.discount_percentage}% discount applied.</p>}
              </div>

              <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8 border-t border-slate-50">
                <div className="flex justify-between text-[10px] sm:text-xs font-bold tracking-[0.1em] sm:tracking-[0.2em] text-slate-400 uppercase">
                  <span>Subtotal</span>
                  <span>PKR {Number(total).toLocaleString()}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-[10px] sm:text-xs font-bold tracking-[0.1em] sm:tracking-[0.2em] text-green-500 uppercase">
                    <span>Discount ({appliedPromo.discount_percentage}%)</span>
                    <span>- PKR {Number(discountAmount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-[10px] sm:text-xs font-bold tracking-[0.1em] sm:tracking-[0.2em] text-slate-400 uppercase">
                  <span>Shipping</span>
                  <span className={shippingFee === 0 ? "text-green-500" : "text-slate-900"}>
                    {shippingFee === 0 ? 'FREE' : `PKR ${shippingFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="pt-4 sm:pt-6 flex justify-between items-end">
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Total Amount</p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900">PKR {Number(finalTotal).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
