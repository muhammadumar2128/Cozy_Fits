
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
  console.log('--- COZYFITS CONNECTION DIAGNOSTIC ---');
  console.log(`URL: ${supabaseUrl}`);
  
  try {
    // 1. Test Products Table
    console.log('\n1. Checking "products" table...');
    const { data: products, error: pError } = await supabase.from('products').select('count');
    if (pError) console.error('❌ Products Table Error:', pError.message);
    else console.log('✅ Products table is accessible.');

    // 2. Test Categories Table
    console.log('\n2. Checking "categories" table...');
    const { data: categories, error: cError } = await supabase.from('categories').select('count');
    if (cError) console.error('❌ Categories Table Error:', cError.message);
    else console.log('✅ Categories table is accessible.');

    // 3. Test Storage Bucket
    console.log('\n3. Checking "products" storage bucket...');
    const { data: bucket, error: bError } = await supabase.storage.getBucket('products');
    if (bError) console.error('❌ Storage Bucket Error:', bError.message);
    else console.log('✅ "products" bucket exists and is accessible.');

    // 4. Test Auth
    console.log('\n4. Checking Auth system...');
    const { data: auth, error: aError } = await supabase.auth.getSession();
    if (aError) console.error('❌ Auth Error:', aError.message);
    else console.log('✅ Auth system is initialized.');

  } catch (err) {
    console.error('\n💥 CRITICAL ERROR:', err.message);
  }
}

checkConnection();
