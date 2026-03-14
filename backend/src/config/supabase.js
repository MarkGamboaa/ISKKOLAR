import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_KEY. Use the service_role secret key from Supabase settings.');
}

if (supabaseServiceKey.startsWith('sb_publishable_')) {
  throw new Error('Invalid SUPABASE_SERVICE_KEY. You used a publishable key. Use the service_role secret key.');
}

// Client for frontend use (anon key)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for backend use (service key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default supabaseClient;
