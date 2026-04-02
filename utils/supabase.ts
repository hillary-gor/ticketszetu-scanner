// utils/supabase.ts
import 'react-native-url-polyfill/auto';
import 'expo-sqlite/localStorage/install'; 
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase'; // Pulling from your types folder

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Environment Variables');
}

// Pass the <Database> generic to strictly type your entire app
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});