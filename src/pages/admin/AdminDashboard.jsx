import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Package, ShoppingCart, Tag, LogOut, 
  Trash2, Edit, X, Image as ImageIcon,
  LayoutGrid, Loader2, Settings, Wifi, WifiOff,
  Menu
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [user, setUser] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [dbStatus, setDbStatus] = useState('checking'); // 'online', 'offline', 'checking'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkConn = async () => {
      try {
        const { error } = await supabase.from('products').select('id').limit(1);
        if (error) throw error;
        setDbStatus('online');
      } catch (err) {
        setDbStatus('offline');
      }
    };

    checkConn();
    const interval = setInterval(checkConn, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const bypass = localStorage.getItem('cozyfits_admin_bypass');
      if (bypass === 'true') {
        setUser({ email: 'admin@cozyfits.pk' });
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/admin-login');
      else setUser(session.user);
    };
    checkUser();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchPendingCount = async () => {
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'processing']);
      
      if (!error) setPendingCount(count || 0);
    };

    fetchPendingCount();

    // Realtime subscription for orders
    const channel = supabase
      .channel('admin-order-notifications')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders' 
      }, () => {
        fetchPendingCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleLogout = async () => {
    localStorage.removeItem('cozyfits_admin_bypass');
    await supabase.auth.signOut();
    navigate('/admin-login');
  };

  if (!user) return null;

  const SidebarContent = () => (
    <>
      <div className="mb-12 relative">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold tracking-[0.2em] text-dark-slate">COZY ADMIN</h2>
            <p className="text-[8px] font-bold text-accent-gold tracking-[0.4em] mt-1 uppercase text-nowrap">Command Center</p>
          </div>
          <div className="flex flex-col items-center">
            {dbStatus === 'online' ? (
              <Wifi size={14} className="text-emerald-500 animate-pulse" />
            ) : dbStatus === 'offline' ? (
              <WifiOff size={14} className="text-red-500" />
            ) : (
              <Loader2 size={14} className="text-slate-300 animate-spin" />
            )}
            <span className={`text-[6px] font-bold mt-1 uppercase tracking-widest ${dbStatus === 'online' ? 'text-emerald-500' : dbStatus === 'offline' ? 'text-red-500' : 'text-slate-300'}`}>
              {dbStatus}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-4">
        <TabButton 
          active={activeTab === 'products'} 
          onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }} 
          icon={<Package size={18} />} 
          label="INVENTORY" 
        />
        <TabButton 
          active={activeTab === 'categories'} 
          onClick={() => { setActiveTab('categories'); setIsSidebarOpen(false); }} 
          icon={<LayoutGrid size={18} />} 
          label="CATEGORIES" 
        />
        <TabButton 
          active={activeTab === 'orders'} 
          onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }} 
          icon={<ShoppingCart size={18} />} 
          label="ORDERS" 
          badge={pendingCount}
        />
        <TabButton 
          active={activeTab === 'promos'} 
          onClick={() => { setActiveTab('promos'); setIsSidebarOpen(false); }} 
          icon={<Tag size={18} />} 
          label="PROMOS" 
        />
        <TabButton 
          active={activeTab === 'settings'} 
          onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} 
          icon={<Settings size={18} />} 
          label="SETTINGS" 
        />
      </nav>

      <button onClick={handleLogout} className="mt-8 lg:mt-auto flex items-center space-x-3 text-slate-400 hover:text-red-500 font-bold text-[10px] tracking-[0.2em] transition-colors">
        <LogOut size={16} />
        <span>SIGN OUT</span>
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/80 backdrop-blur-md sticky top-0 z-[100] px-6 py-4 flex items-center justify-between border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold tracking-[0.2em] text-dark-slate">COZY ADMIN</h2>
          <p className="text-[6px] font-bold text-accent-gold tracking-[0.4em] uppercase">Command Center</p>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-dark-slate hover:bg-slate-50 rounded-xl transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex w-80 glass m-6 rounded-[3rem] p-10 flex-col shadow-xl fixed h-[calc(100vh-3rem)]">
        <SidebarContent />
      </div>

      {/* Sidebar - Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-dark-slate/20 backdrop-blur-sm z-[1000] lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[1001] lg:hidden p-10 flex flex-col shadow-2xl"
            >
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-8 right-8 text-slate-300 hover:text-dark-slate"
              >
                <X size={24} />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-80 p-6 lg:p-12 overflow-y-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {activeTab === 'products' && <ProductManager />}
            {activeTab === 'categories' && <CategoryManager />}
            {activeTab === 'orders' && <OrderManager />}
            {activeTab === 'promos' && <PromoManager />}
            {activeTab === 'settings' && <SettingsManager />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label, badge }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold text-[10px] tracking-[0.2em] ${active ? 'bg-dark-slate text-white shadow-lg' : 'text-slate-400 hover:bg-white/50'}`}>
    <div className="flex items-center space-x-4">
      {icon} <span>{label}</span>
    </div>
    {badge > 0 && (
      <span className="bg-accent-gold text-white text-[8px] w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-bounce">
        {badge}
      </span>
    )}
  </button>
);

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    price_pkr: '', 
    category: '', 
    description: '', 
    stock: 0,
    sizes: 'New Born, 3 Months, 6 Months, 1 Year, 2 Years',
    is_new_arrival: false,
    image_files: [] 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: p } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    const { data: c } = await supabase.from('categories').select('*');
    setProducts(p || []);
    setCategories(c || []);
    if (c?.length > 0 && !formData.category) setFormData(prev => ({ ...prev, category: c[0].name }));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price_pkr: product.price_pkr,
      category: product.category,
      description: product.description || '',
      stock: product.stock,
      sizes: product.sizes?.join(', ') || 'New Born, 3 Months, 6 Months, 1 Year, 2 Years',
      is_new_arrival: product.is_new_arrival || false,
      image_files: []
    });
    setShowAdd(true);
  };

  const uploadImages = async (files) => {
    const urls = [];
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
      
      // Ensure we use the public URL correctly
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let image_urls = editingProduct ? (editingProduct.image_urls || []) : [];
      
      if (formData.image_files.length > 0) {
        const uploadedUrls = await uploadImages(formData.image_files);
        image_urls = editingProduct ? [...image_urls, ...uploadedUrls] : uploadedUrls;
      }

      if (image_urls.length === 0) {
        image_urls = ['https://via.placeholder.com/400x500?text=Cozy+Fits'];
      }

      const productData = {
        title: formData.title,
        price_pkr: parseFloat(formData.price_pkr),
        category: formData.category,
        description: formData.description,
        stock: parseInt(formData.stock),
        sizes: formData.sizes.split(',').map(s => s.trim()),
        is_new_arrival: formData.is_new_arrival,
        image_urls
      };

      let error;
      if (editingProduct) {
        const { error: err } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
        error = err;
      } else {
        const { error: err } = await supabase.from('products').insert([productData]);
        error = err;
      }

      if (error) throw error;
      
      setShowAdd(false);
      setEditingProduct(null);
      setFormData({ 
        title: '', 
        price_pkr: '', 
        category: categories[0]?.name || '', 
        description: '', 
        stock: 0, 
        sizes: 'New Born, 3 Months, 6 Months, 1 Year, 2 Years', 
        is_new_arrival: false, 
        image_files: [] 
      });
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this piece?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchData();
  };

  const toggleNewArrival = async (id, currentStatus) => {
    const { error } = await supabase.from('products').update({ is_new_arrival: !currentStatus }).eq('id', id);
    if (!error) fetchData();
  };

  return (
    <div className="space-y-6 lg:space-y-10">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center border-b border-slate-100 pb-6 lg:pb-8 space-y-4 lg:space-y-0">
        <h1 className="text-3xl lg:text-4xl font-bold text-dark-slate uppercase tracking-tighter">Inventory</h1>
        <button onClick={() => { setEditingProduct(null); setShowAdd(true); }} className="w-full lg:w-auto bg-dark-slate text-white px-8 py-3.5 lg:py-3 rounded-full font-bold text-[10px] tracking-[0.3em] flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl transition-all">
          <Plus size={16} /> <span>ADD TREASURE</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 italic">No items in the collection yet.</div>
        ) : (
          products.map(p => (
            <div key={p.id} className="glass p-5 lg:p-6 rounded-[2rem] lg:rounded-[2.5rem] flex items-center space-x-4 lg:space-x-6 relative group">
              <div className="w-16 h-20 lg:w-20 lg:h-24 bg-neutral-soft rounded-xl lg:rounded-2xl overflow-hidden shrink-0 shadow-inner relative">
                <img 
                  src={(p.image_urls && p.image_urls.length > 0 && p.image_urls[0]) ? p.image_urls[0] : 'https://placehold.co/400x500?text=Cozy+Fits'} 
                  className="w-full h-full object-cover" 
                  alt="" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/400x500/f8fafc/94a3b8?text=No+Image';
                  }}
                />
                {p.is_new_arrival && (
                  <div className="absolute top-1 right-1 bg-accent-gold text-white text-[5px] lg:text-[6px] font-bold px-1.5 py-0.5 rounded-full tracking-widest uppercase">New</div>
                )}
                {p.image_urls?.length > 1 && (
                  <div className="absolute bottom-1 right-1 bg-dark-slate/50 text-white text-[5px] lg:text-[6px] font-bold px-1.5 py-0.5 rounded-full tracking-widest uppercase">+{p.image_urls.length - 1}</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-dark-slate truncate uppercase text-[9px] lg:text-[10px] tracking-widest">{p.title}</h3>
                <p className="text-[8px] lg:text-[9px] font-bold text-accent-gold mt-1 uppercase">{p.category}</p>
                <div className="flex justify-between items-end mt-2">
                  <p className="text-xs lg:text-sm font-bold text-dark-slate">PKR {Number(p.price_pkr).toLocaleString()}</p>
                  <p className="text-[7px] lg:text-[8px] font-bold text-slate-400 uppercase">STK: {p.stock}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5 lg:space-y-2">
                <button 
                  onClick={() => toggleNewArrival(p.id, p.is_new_arrival)}
                  className={`p-1.5 lg:p-2 rounded-full transition-colors ${p.is_new_arrival ? 'text-accent-gold bg-accent-gold/10' : 'text-slate-200 hover:bg-slate-50'}`}
                  title="Toggle New Arrival"
                >
                  <Tag size={12} className="lg:w-3.5 lg:h-3.5" />
                </button>
                <button 
                  onClick={() => handleEdit(p)}
                  className="p-1.5 lg:p-2 text-slate-200 hover:text-dark-slate hover:bg-slate-50 rounded-full transition-colors"
                >
                  <Edit size={12} className="lg:w-3.5 lg:h-3.5" />
                </button>
                <button 
                  onClick={() => handleDelete(p.id)}
                  className="p-1.5 lg:p-2 text-red-200 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={12} className="lg:w-3.5 lg:h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 lg:p-6 bg-dark-slate/40 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-4xl rounded-[2.5rem] lg:rounded-[3rem] p-8 lg:p-12 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowAdd(false)} className="absolute top-6 right-6 lg:top-8 lg:right-8 text-slate-300 hover:text-dark-slate"><X /></button>
              <h2 className="text-xl lg:text-2xl font-bold mb-6 lg:mb-8 italic uppercase tracking-widest">
                {editingProduct ? 'Update Piece' : 'New Piece'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-4">Product Details</label>
                      <input required placeholder="Title" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                      <textarea placeholder="Description" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold h-32" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-4">Price (PKR)</label>
                        <input required type="number" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold" value={formData.price_pkr} onChange={e => setFormData({...formData, price_pkr: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-4">Stock</label>
                        <input required type="number" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-4">Category</label>
                      <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-4">Sizes (Comma separated)</label>
                      <input placeholder="New Born, 3 Months, 6 Months, 1 Year, 2 Years" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} />
                      <div className="flex flex-wrap gap-1.5 lg:gap-2 px-2 mt-2">
                        {['NB', '3M', '6M', '1Y', '2Y', '3Y', '4Y', '5Y', '6Y'].map(size => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              const currentSizes = formData.sizes ? formData.sizes.split(',').map(s => s.trim()) : [];
                              if (currentSizes.includes(size)) {
                                setFormData({...formData, sizes: currentSizes.filter(s => s !== size).join(', ')});
                              } else {
                                setFormData({...formData, sizes: [...currentSizes, size].filter(s => s).join(', ')});
                              }
                            }}
                            className={`text-[7px] lg:text-[8px] font-bold px-2.5 lg:px-3 py-1 rounded-full border transition-all ${
                              formData.sizes.includes(size)
                                ? 'bg-dark-slate text-white border-dark-slate'
                                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 px-4 py-2 bg-slate-50 rounded-2xl">
                      <input type="checkbox" id="is_new" checked={formData.is_new_arrival} onChange={e => setFormData({...formData, is_new_arrival: e.target.checked})} className="w-4 h-4 rounded border-slate-200 text-accent-gold focus:ring-accent-gold" />
                      <label htmlFor="is_new" className="text-[9px] lg:text-[10px] font-bold text-slate-500 tracking-widest uppercase cursor-pointer">Mark as New Arrival</label>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-4">Product Images</label>
                      <div className="border-2 border-dashed border-slate-100 rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-8 text-center bg-slate-50/30">
                        <input type="file" id="image-upload" className="hidden" multiple onChange={e => setFormData({...formData, image_files: Array.from(e.target.files)})} />
                        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center space-y-2">
                          <ImageIcon className="text-slate-300" size={28} />
                          <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                            {formData.image_files.length > 0 
                              ? `${formData.image_files.length} files selected` 
                              : 'Upload Images'}
                          </span>
                        </label>
                      </div>
                      {editingProduct && editingProduct.image_urls?.length > 0 && (
                        <p className="text-[7px] lg:text-[8px] font-bold text-slate-400 uppercase tracking-widest px-4">Existing images will be kept unless you upload new ones.</p>
                      )}
                    </div>
                  </div>
                </div>

                <button disabled={loading} className="w-full bg-dark-slate text-white py-4 lg:py-5 rounded-2xl font-bold text-[9px] lg:text-[10px] tracking-[0.4em] flex justify-center items-center mt-6 lg:mt-8">
                  {loading ? <Loader2 className="animate-spin" /> : (editingProduct ? 'UPDATE TREASURE' : 'CONFIRM ADDITION')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CategoryManager = () => {
  const [cats, setCats] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editImage, setEditImage] = useState(null);

  useEffect(() => { fetchCats(); }, []);
  
  const fetchCats = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    setCats(data || []);
  };

  const uploadCategoryImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `cat-${Math.random()}.${fileExt}`;
    const filePath = `category-images/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  };

  const handleAdd = async () => {
    const categoryToSave = newCat.trim();
    if (!categoryToSave) return;

    setLoading(true);
    try {
      let image_url = null;
      if (newImage) {
        image_url = await uploadCategoryImage(newImage);
      }

      const { error } = await supabase.from('categories').insert([{ 
        name: categoryToSave,
        image_url: image_url 
      }]);
      
      if (error) throw error;
      setNewCat('');
      setNewImage(null);
      fetchCats();
    } catch (err) {
      alert(`Could not save: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? Products in this category will remain but their category label will be empty.')) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      fetchCats();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditValue(cat.name);
  };

  const handleUpdate = async (id) => {
    if (!editValue.trim()) return;
    setLoading(true);
    try {
      let image_url = cats.find(c => c.id === id).image_url;
      
      if (editImage) {
        image_url = await uploadCategoryImage(editImage);
      }

      const { error } = await supabase.from('categories').update({ 
        name: editValue.trim(),
        image_url: image_url
      }).eq('id', id);

      if (error) throw error;
      setEditingId(null);
      setEditImage(null);
      fetchCats();
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-10">
      <h1 className="text-3xl lg:text-4xl font-bold text-dark-slate uppercase tracking-tighter">Categories</h1>
      
      {/* Add Category */}
      <div className="glass p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] flex flex-col md:flex-row items-stretch md:items-end gap-4 lg:gap-6">
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-4">Name</label>
          <input 
            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold" 
            placeholder="E.G. SILK SETS" 
            value={newCat} 
            onChange={(e) => setNewCat(e.target.value)} 
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-4">Cover</label>
          <div className="relative group cursor-pointer h-[52px] bg-slate-50 rounded-2xl px-6 flex items-center space-x-3 border-2 border-dashed border-slate-200 hover:border-accent-gold transition-all">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setNewImage(e.target.files[0])} />
            <ImageIcon size={18} className="text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[100px]">
              {newImage ? newImage.name : 'UPLOAD'}
            </span>
          </div>
        </div>

        <button 
          onClick={handleAdd}
          disabled={loading}
          className="bg-dark-slate text-white px-8 h-[52px] rounded-2xl font-bold text-[10px] tracking-[0.3em] flex items-center justify-center"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : 'CREATE'}
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {cats.map(c => (
          <div key={c.id} className="glass p-4 rounded-[2rem] flex items-center space-x-4 lg:space-x-6 relative group">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-neutral-soft rounded-xl lg:rounded-2xl overflow-hidden shrink-0 shadow-inner">
              <img 
                src={c.image_url || 'https://via.placeholder.com/200?text=NO+IMAGE'} 
                className="w-full h-full object-cover" 
                alt="" 
              />
            </div>

            {editingId === c.id ? (
              <div className="flex-1 space-y-2">
                <input 
                  autoFocus
                  className="w-full bg-slate-50 border-none rounded-lg px-2 py-1 text-[9px] lg:text-[10px] font-bold uppercase" 
                  value={editValue} 
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1 bg-slate-50 rounded-lg h-7 flex items-center px-2 border border-dashed border-slate-200">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setEditImage(e.target.files[0])} />
                    <span className="text-[7px] font-bold text-slate-400 uppercase truncate">
                      {editImage ? editImage.name : 'Pic'}
                    </span>
                  </div>
                  <button onClick={() => handleUpdate(c.id)} className="text-emerald-500 p-1 hover:bg-emerald-50 rounded-full"><Plus size={14} className="rotate-45" /></button>
                  <button onClick={() => setEditingId(null)} className="text-slate-400 p-1 hover:bg-slate-50 rounded-full"><X size={14} /></button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <h3 className="font-bold text-dark-slate uppercase text-[9px] lg:text-[10px] tracking-widest">{c.name}</h3>
                </div>
                <div className="flex flex-col space-y-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => startEdit(c)}
                    className="p-1.5 text-slate-300 hover:text-dark-slate hover:bg-white rounded-full transition-all"
                  >
                    <Edit size={12} />
                  </button>
                  <button 
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (orderId, newStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);
    
    if (!error) fetchOrders();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-300" size={40} /></div>;

  return (
    <div className="space-y-6 lg:space-y-10">
      <h1 className="text-3xl lg:text-4xl font-bold text-dark-slate uppercase tracking-tighter">Orders</h1>
      
      <div className="space-y-4 lg:space-y-6">
        {orders.length === 0 ? (
          <div className="h-[40vh] flex flex-col items-center justify-center text-slate-300 space-y-4">
            <ShoppingCart size={40} strokeWidth={1} />
            <p className="font-bold text-[9px] lg:text-[10px] tracking-[0.4em] uppercase">No orders yet.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="glass p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] space-y-5 lg:space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="w-full md:w-auto">
                  <div className="flex items-center space-x-3">
                    <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">#{order.id.slice(0, 8)}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-dark-slate mt-2">{order.customer_name}</h3>
                  <div className="flex flex-col space-y-0.5 mt-1">
                    <p className="text-[11px] lg:text-xs text-slate-500 font-medium">{order.customer_phone}</p>
                    <p className="text-[9px] lg:text-[10px] text-slate-400 font-medium lowercase truncate max-w-[200px]">{order.customer_email}</p>
                  </div>
                </div>
                <div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                  <p className="text-xl lg:text-2xl font-bold text-dark-slate">PKR {Number(order.total_amount_pkr).toLocaleString()}</p>
                  <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                    {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 rounded-2xl p-4 lg:p-6">
                <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-3">Items Summary</p>
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] lg:text-xs font-bold text-dark-slate">
                      <span className="flex-1 mr-4">{item.title} ({item.selectedSize}) x {item.quantity}</span>
                      <span className="shrink-0">PKR {Number(item.price_pkr * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center pt-4 border-t border-slate-100 gap-6">
                <div className="flex-1">
                  <p className="text-[8px] font-bold text-slate-400 tracking-widest uppercase mb-1">Shipping Address</p>
                  <p className="text-[11px] lg:text-xs font-medium text-slate-600 max-w-md">{order.shipping_address}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                    <button 
                      key={status}
                      onClick={() => updateStatus(order.id, status)}
                      className={`flex-1 lg:flex-none px-3 lg:px-4 py-2 rounded-full text-[7px] lg:text-[8px] font-bold tracking-widest uppercase transition-all ${
                        order.status === status 
                          ? 'bg-dark-slate text-white shadow-md' 
                          : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const colors = {
    pending: 'bg-amber-100 text-amber-600',
    processing: 'bg-blue-100 text-blue-600',
    shipped: 'bg-purple-100 text-purple-600',
    delivered: 'bg-emerald-100 text-emerald-600',
    cancelled: 'bg-red-100 text-red-600',
  };
  return (
    <span className={`px-2.5 lg:px-3 py-1 rounded-full text-[7px] lg:text-[8px] font-bold tracking-widest uppercase ${colors[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
};

const PromoManager = () => {
  const [promos, setPromos] = useState([]);
  const [newPromo, setNewPromo] = useState({ code: '', discount_percentage: '', active: true, expires_at: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchPromos(); }, []);

  const fetchPromos = async () => {
    const { data } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });
    setPromos(data || []);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('promo_codes').insert([{
      code: newPromo.code,
      discount_percentage: parseFloat(newPromo.discount_percentage),
      active: true,
      expires_at: newPromo.expires_at || null
    }]);
    if (!error) {
      setNewPromo({ code: '', discount_percentage: '', active: true, expires_at: '' });
      fetchPromos();
    } else {
      alert(error.message);
    }
    setLoading(false);
  };

  const togglePromo = async (code, currentStatus) => {
    const { error } = await supabase.from('promo_codes').update({ active: !currentStatus }).eq('code', code);
    if (!error) fetchPromos();
  };

  const handleDelete = async (code) => {
    if (!confirm('Delete this promo code?')) return;
    const { error } = await supabase.from('promo_codes').delete().eq('code', code);
    if (!error) fetchPromos();
  };

  return (
    <div className="space-y-6 lg:space-y-10">
      <h1 className="text-3xl lg:text-4xl font-bold text-dark-slate uppercase tracking-tighter">Promotions</h1>
      
      <form onSubmit={handleAdd} className="glass p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] flex flex-col md:flex-row items-stretch md:items-end gap-4 lg:gap-4">
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-4">Code</label>
          <input required placeholder="E.G. COZY20" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold uppercase" value={newPromo.code} onChange={e => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})} />
        </div>
        <div className="w-full md:w-28 space-y-2">
          <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-4">Disc %</label>
          <input required type="number" placeholder="10" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold" value={newPromo.discount_percentage} onChange={e => setNewPromo({...newPromo, discount_percentage: e.target.value})} />
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-4">Expiry</label>
          <input type="datetime-local" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold text-slate-500" value={newPromo.expires_at} onChange={e => setNewPromo({...newPromo, expires_at: e.target.value})} />
        </div>
        <button disabled={loading} className="bg-dark-slate text-white px-8 h-[52px] rounded-2xl font-bold text-[10px] tracking-[0.3em] flex items-center justify-center">
          {loading ? <Loader2 className="animate-spin" /> : 'ACTIVATE'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {promos.map(p => (
          <div key={p.code} className={`glass p-5 lg:p-6 rounded-[2rem] border-2 transition-all ${p.active ? 'border-transparent' : 'border-slate-100 opacity-60'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base lg:text-lg font-black text-dark-slate tracking-tight">{p.code}</h3>
                <p className="text-xl lg:text-2xl font-bold text-accent-gold">{p.discount_percentage}% OFF</p>
                {p.expires_at && (
                  <p className="text-[7px] lg:text-[8px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
                    Exp: {new Date(p.expires_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-1.5 lg:space-x-2">
                <button onClick={() => togglePromo(p.code, p.active)} className={`p-1.5 lg:p-2 rounded-full transition-colors ${p.active ? 'text-emerald-400 bg-emerald-50' : 'text-slate-300 hover:bg-slate-50'}`}>
                  <Package size={14} />
                </button>
                <button onClick={() => handleDelete(p.code)} className="p-1.5 lg:p-2 text-slate-200 hover:text-red-400 hover:bg-red-50 rounded-full transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsManager = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const isBypass = localStorage.getItem('cozyfits_admin_bypass') === 'true';

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (isBypass) {
      setMessage({ text: 'Cannot change password in Bypass Mode.', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ text: 'Min 6 characters required', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setMessage({ text: 'Password updated successfully!', type: 'success' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-10 max-w-2xl">
      <h1 className="text-3xl lg:text-4xl font-bold text-dark-slate uppercase tracking-tighter">Settings</h1>
      
      <div className="glass p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] space-y-6 lg:space-y-8">
        <div>
          <h2 className="text-lg lg:text-xl font-bold text-dark-slate mb-2">Update Password</h2>
          <p className="text-[11px] lg:text-xs text-slate-400 font-medium leading-relaxed">Change your admin portal access password. This will update your real Supabase account credentials.</p>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-5 lg:space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-4">New Password</label>
            <input 
              required 
              type="password"
              placeholder="••••••••" 
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-4">Confirm</label>
            <input 
              required 
              type="password"
              placeholder="••••••••" 
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
            />
          </div>

          {message.text && (
            <p className={`text-[9px] lg:text-[10px] font-bold uppercase tracking-widest px-4 ${message.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
              {message.text}
            </p>
          )}

          <button 
            disabled={loading || !newPassword}
            className="w-full bg-dark-slate text-white py-4 lg:py-5 rounded-2xl font-bold text-[9px] lg:text-[10px] tracking-[0.4em] flex justify-center items-center transition-all hover:shadow-xl disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'UPDATE PASSWORD'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
