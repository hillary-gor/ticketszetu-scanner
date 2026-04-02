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
        <ActivityIndicator size="large" color="#00FF00" />
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