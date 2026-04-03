/**
 * -----------------------------------------------------------------------------------
 * ENGINE: SUPABASE CLIENT & NATIVE NETWORK LAYER
 * -----------------------------------------------------------------------------------
 * * CORE ARCHITECTURE:
 * - Singleton Pattern: Instantiates a single, globally available database client.
 * - Strict Typing: Injects the `<Database>` generic, forcing TypeScript to validate 
 * all RPC calls and table queries against your exact Postgres schema.
 * - Native Storage: Uses `expo-sqlite/localStorage` instead of standard AsyncStorage. 
 * SQLite provides faster, synchronous read/writes essential for immediate session 
 * verification during app boot.
 * * DEPENDENCIES & POLYFILLS:
 * - `react-native-url-polyfill`: React Native's native `URL` object is incomplete. 
 * This polyfill ensures the Supabase fetch client can correctly parse REST endpoints.
 * * @critical `detectSessionInUrl` is explicitly set to `false`. This prevents the 
 * auth engine from running web-based OAuth parsing logic, which causes silent 
 * failures in compiled native iOS/Android binaries.
 * -----------------------------------------------------------------------------------
 */

import 'react-native-url-polyfill/auto';
import 'expo-sqlite/localStorage/install'; 
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('FATAL: Missing Supabase Environment Variables');
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