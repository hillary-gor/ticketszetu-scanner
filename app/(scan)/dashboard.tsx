/**
 * ---------------------------------------------------------------------------------------
 * INTERFACE: DEPLOYMENT DASHBOARD & AUTHORIZATION GATEWAY
 * ---------------------------------------------------------------------------------------
 * * CORE ARCHITECTURE:
 * - Role-Based Access Control (RBAC): Queries `brand_members` to ensure the 
 * logged-in agent can only view events belonging to their assigned organization.
 * - Context Builder: Forces a strict two-step flow (Event -> Gate) to construct 
 * the secure URL parameters (`eventId`, `gate`) required by the Scanner engine.
 * - Live Filtering & Time-Gating: Queries the database for 'published' events strictly 
 * within a rolling 72-hour operational window (24h past, 48h future) to prevent 
 * deploying scanners to expired or distant future events.
 * * @critical This UI assumes Row-Level Security (RLS) is strictly enforced on 
 * the Supabase backend. Do not rely solely on this UI filtering to protect event data.
 * ---------------------------------------------------------------------------------------
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter, Href } from 'expo-router';
import { supabase } from '../../utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { Database } from '../../types/supabase';

type EventRow = Database['public']['Tables']['events']['Row'];

const QUICK_GATES = [
  { id: 'MAIN_ENTRANCE', title: 'Main Entrance', icon: 'enter-outline' as const },
  { id: 'VIP_EAST', title: 'VIP Entrance', icon: 'star-outline' as const },
  { id: 'STAFF_DOOR', title: 'Staff Door', icon: 'briefcase-outline' as const },
];

export default function DashboardScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'SELECT_EVENT' | 'SELECT_GATE'>('SELECT_EVENT');
  const [events, setEvents] = useState<EventRow[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('Agent');
  const [customGate, setCustomGate] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    fetchAuthorizedEvents();
  }, []);

  const fetchAuthorizedEvents = async () => {
    setIsLoading(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error('Not authenticated');
      
      setUserEmail(authData.user.email?.split('@')[0] || 'Agent');

      // 1. Find which brands this scanner is authorized for
      const { data: brandMembers, error: brandErr } = await supabase
        .from('brand_members')
        .select('brand_id')
        .eq('user_id', authData.user.id);

      if (brandErr) throw brandErr;
      
      const brandIds = brandMembers?.map(bm => bm.brand_id) || [];
      
      if (brandIds.length === 0) {
        setEvents([]);
        setIsLoading(false);
        return;
      }

      // 2. Build the Rolling Operational Window (24h past -> 48h future)
      const activeWindowStart = new Date();
      activeWindowStart.setHours(activeWindowStart.getHours() - 24);
      
      const activeWindowEnd = new Date();
      activeWindowEnd.setHours(activeWindowEnd.getHours() + 48);

      // 3. Fetch ACTIVE events within the time gate
      const { data: eventData, error: eventErr } = await supabase
        .from('events')
        .select('*')
        .in('brand_id', brandIds)
        .eq('status', 'published')
        .gte('start_time', activeWindowStart.toISOString())
        .lte('start_time', activeWindowEnd.toISOString())
        .order('start_time', { ascending: true });

      if (eventErr) throw eventErr;
      setEvents(eventData || []);
    } catch (error: any) {
      Alert.alert('System Error', 'Failed to fetch your assigned events.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventSelect = (event: EventRow) => {
    setSelectedEvent(event);
    setStep('SELECT_GATE');
  };

  const handleGateSelect = (gateName: string) => {
    if (!gateName.trim() || !selectedEvent) return;
    const formattedGate = gateName.trim().toUpperCase().replace(/\s+/g, '_');
    
    // Hard-link the Event ID and the Gate to the Scanner URL
    router.push(`/(scan)/scanner?gate=${formattedGate}&eventId=${selectedEvent.id}` as Href);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/' as Href);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FF9500" />
        <Text style={{ color: '#8A99A8', marginTop: 16, fontWeight: '700' }}>SECURING DEPLOYMENT...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header dynamically changes based on step */}
        <View style={styles.header}>
          {step === 'SELECT_GATE' ? (
            <TouchableOpacity onPress={() => setStep('SELECT_EVENT')} style={styles.backNav}>
              <Ionicons name="arrow-back" size={20} color="#FF9500" />
              <Text style={styles.backNavText}>CHANGE EVENT</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.greeting}>AGENT: {userEmail}</Text>
          )}
          
          <Text style={styles.title}>
            {step === 'SELECT_EVENT' ? 'Select Active Event' : 'Select Deployment Gate'}
          </Text>
          
          {step === 'SELECT_GATE' && selectedEvent && (
            <View style={styles.activeEventPill}>
              <Text style={styles.activeEventText}>{selectedEvent.title}</Text>
            </View>
          )}
        </View>

        {/* STEP 1: EVENT SELECTION */}
        {step === 'SELECT_EVENT' && (
          <View style={styles.list}>
            {events.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color="#1F3A5C" />
                <Text style={styles.emptyText}>No active events assigned to you.</Text>
              </View>
            ) : (
              events.map((evt) => (
                <TouchableOpacity 
                  key={evt.id} 
                  style={styles.card} 
                  onPress={() => handleEventSelect(evt)}
                >
                  <View style={styles.cardIconWrapper}>
                    <Ionicons name="ticket-outline" size={24} color="#FF9500" />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>{evt.title}</Text>
                    <Text style={styles.cardSubtitle}>
                      {new Date(evt.start_time).toLocaleDateString()}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#334155" />
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* STEP 2: GATE SELECTION */}
        {step === 'SELECT_GATE' && (
          <View style={styles.list}>
            {QUICK_GATES.map((gate) => (
              <TouchableOpacity 
                key={gate.id} 
                style={styles.card} 
                onPress={() => handleGateSelect(gate.id)}
              >
                <View style={styles.cardIconWrapper}>
                  <Ionicons name={gate.icon} size={24} color="#10B981" />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{gate.title}</Text>
                </View>
                <Ionicons name="scan-outline" size={20} color="#334155" />
              </TouchableOpacity>
            ))}

            {!showCustom ? (
              <TouchableOpacity style={styles.customToggle} onPress={() => setShowCustom(true)}>
                <Ionicons name="add-circle-outline" size={24} color="#8A99A8" />
                <Text style={styles.customToggleText}>Custom Gate...</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.customInputContainer}>
                <Text style={styles.customInputLabel}>CUSTOM DEPLOYMENT</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. BACKSTAGE"
                    placeholderTextColor="#4B5563"
                    value={customGate}
                    onChangeText={setCustomGate}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity 
                    style={[styles.goButton, !customGate.trim() && styles.goButtonDisabled]}
                    onPress={() => handleGateSelect(customGate)}
                    disabled={!customGate.trim()}
                  >
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A121D' },
  scrollContent: { padding: 24, paddingTop: 80, paddingBottom: 40 },
  header: { marginBottom: 32 },
  greeting: { color: '#8A99A8', fontSize: 13, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  title: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', letterSpacing: -1, lineHeight: 38 },
  backNav: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backNavText: { color: '#FF9500', fontSize: 13, fontWeight: '800', letterSpacing: 1, marginLeft: 8 },
  activeEventPill: { marginTop: 16, backgroundColor: 'rgba(255, 149, 0, 0.1)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(255, 149, 0, 0.3)' },
  activeEventText: { color: '#FF9500', fontSize: 14, fontWeight: '700' },
  list: { gap: 16 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111D2B', borderWidth: 1, borderColor: '#1F3A5C', padding: 20, borderRadius: 16 },
  cardIconWrapper: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  cardTextContainer: { flex: 1 },
  cardTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  cardSubtitle: { color: '#8A99A8', fontSize: 13, fontWeight: '600' },
  emptyState: { alignItems: 'center', padding: 40, backgroundColor: '#111D2B', borderRadius: 16, borderWidth: 1, borderColor: '#1F3A5C' },
  emptyText: { color: '#8A99A8', marginTop: 16, fontWeight: '600', textAlign: 'center' },
  customToggle: { flexDirection: 'row', alignItems: 'center', padding: 20, marginTop: 8, borderWidth: 1, borderStyle: 'dashed', borderRadius: 16, borderColor: '#1F3A5C' },
  customToggleText: { color: '#8A99A8', fontSize: 15, fontWeight: '600', marginLeft: 12 },
  customInputContainer: { marginTop: 8, backgroundColor: '#0E1926', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#1F3A5C' },
  customInputLabel: { color: '#FF9500', fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12 },
  inputRow: { flexDirection: 'row', gap: 12 },
  input: { flex: 1, backgroundColor: '#0A121D', borderWidth: 1, borderColor: '#1F3A5C', borderRadius: 12, paddingHorizontal: 16, height: 52, color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  goButton: { width: 52, height: 52, backgroundColor: '#FF9500', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  goButtonDisabled: { opacity: 0.5, backgroundColor: '#1F3A5C' },
  footer: { padding: 24, backgroundColor: '#0A121D', borderTopWidth: 1, borderTopColor: '#111D2B' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' },
  logoutText: { color: '#EF4444', fontSize: 15, fontWeight: '700', marginLeft: 8 }
});