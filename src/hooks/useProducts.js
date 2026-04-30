import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useProducts = (category = null, newArrivalsOnly = false) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (category && category !== 'All') {
          query = query.eq('category', category);
        }

        if (newArrivalsOnly) {
          query = query.eq('is_new_arrival', true);
        }

        const { data, error } = await query;

        if (error) throw error;
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, newArrivalsOnly]);

  return { products, loading, error };
};
