/**
 * -------------------------------------------------------------------------------------------------
 * INTERFACE: PROTECTED ROUTE LAYOUT & AUTH GUARD
 * -------------------------------------------------------------------------------------------------
 * * CORE ARCHITECTURE:
 * - Authentication Middleware: Acts as an impenetrable wrapper for all screens 
 * inside the `/(scan)` route group. 
 * - Real-Time Session Tracking: Subscribes to Supabase's `onAuthStateChange`. 
 * If a token expires, or an admin revokes the scanner's access remotely, this 
 * listener triggers instantly and ejects the user.
 * - Anti-Flicker UX: Blocks rendering with a pure black loading state (`isAuthenticated === null`) 
 * until the async storage resolves the session, preventing the dashboard from flashing 
 * visibly on screen for unauthenticated users.
 * * @critical Do not remove the `inScanGroup` segment check. It prevents an infinite 
 * navigation loop between the root layout and this protected layout.
 * -------------------------------------------------------------------------------------------------
 */

import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments, Href } from 'expo-router';
import { supabase } from '../../utils/supabase';
import { ActivityIndicator, View } from 'react-native';

export default function ScanLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // 1. Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // 2. Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated === null) return;

    // Cast to string to bypass Expo's strict typed routes memory cache
    const inScanGroup = (segments[0] as string) === '(scan)';

    if (!isAuthenticated && inScanGroup) {
      // Kick them back to the login screen
      router.replace('/' as Href);
    } else if (isAuthenticated && !inScanGroup) {
      // Send them to the dashboard
      router.replace('/(scan)/dashboard' as Href);
    }
  }, [isAuthenticated, segments, router]);

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, backgroundColor: '#050505', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF9500" />
      </View>
    );
  }

  // If authenticated, render the protected screens
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="scanner" />
    </Stack>
  );
}