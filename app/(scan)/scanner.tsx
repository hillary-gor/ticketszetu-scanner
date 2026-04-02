import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, ActivityIndicator, Animated, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import NetInfo from '@react-native-community/netinfo';
import { Audio } from 'expo-av';
import { supabase } from '../../utils/supabase';
import { useSyncStore, QueuedScan } from '../../store/syncStore';
import { Ionicons } from '@expo/vector-icons';

// Case sensitivity matches syncStore.ts
type ScanMode = 'in' | 'out'; 
type BannerState = { visible: boolean; type: 'success' | 'error' | 'processing'; message: string };

interface RpcResponse {
  success: boolean;
  message?: string;
  scanned_at?: string;
  gate_name?: string;
  error_code?: string;
}

export default function ScannerScreen() {
  const router = useRouter();
  const { gate, eventId } = useLocalSearchParams<{ gate: string, eventId: string }>(); 
  
  const [permission, requestPermission] = useCameraPermissions();
  const [scanMode, setScanMode] = useState<ScanMode>('in'); 
  const [banner, setBanner] = useState<BannerState>({ visible: false, type: 'processing', message: '' });
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [torchOn, setTorchOn] = useState<boolean>(false); 
  
  const { addScanToQueue, processQueue, queue, isSyncing } = useSyncStore();
  const isScanning = useRef(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  const soundSuccess = useRef<Audio.Sound | null>(null);
  const soundError = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, { toValue: 246, duration: 1000, useNativeDriver: true }),
        Animated.timing(scanLineAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    async function loadAudio() {
      try {
        const { sound: s1 } = await Audio.Sound.createAsync(require('../../assets/sounds/success.mp3'));
        const { sound: s2 } = await Audio.Sound.createAsync(require('../../assets/sounds/error.mp3'));
        soundSuccess.current = s1;
        soundError.current = s2;
      } catch (error) {
        console.warn("Audio files missing. Operating in silent/vibrate mode.", error);
      }
    }
    loadAudio();

    return () => {
      soundSuccess.current?.unloadAsync();
      soundError.current?.unloadAsync();
    };
  }, [scanLineAnim]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = !!state.isConnected && !!state.isInternetReachable;
      setIsOnline(online);
      if (online && queue.length > 0) processQueue();
    });
    return () => unsubscribe();
  }, [queue.length, processQueue]);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission, requestPermission]);

  const isValidUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

  const playFeedback = async (type: 'success' | 'error') => {
    if (type === 'success') {
      Vibration.vibrate(100);
      await soundSuccess.current?.replayAsync();
    } else {
      Vibration.vibrate([0, 200, 100, 200]); 
      await soundError.current?.replayAsync();
    }
  };

  const showBanner = (type: BannerState['type'], message: string) => {
    setBanner({ visible: true, type, message });
  };

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (isScanning.current) return;
    isScanning.current = true;
    showBanner('processing', 'VERIFYING...');

    try {
      if (!isValidUUID(data)) throw new Error('INVALID TICKET FORMAT');
      if (!eventId) throw new Error('CRITICAL: NO EVENT CONTEXT');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('SESSION EXPIRED');

      const scanPayload: QueuedScan = {
        ticket_id: data,
        scanned_by: user.id,
        gate_name: gate || 'UNKNOWN_GATE',
        device_id: 'EXPO_CLIENT',
        scanned_at: new Date().toISOString(), 
        event_id: eventId,
        scan_type: scanMode 
      };

      if (isOnline) {
        try {
          // Note: Because Javascript sends 'in' / 'out', our db RPC 
          // must expect lowercase or use UPPER(p_scan_type) in Postgres.
          const { data: rpcData, error: rpcError } = await supabase.rpc('scan_ticket', {
            p_ticket_id: scanPayload.ticket_id,
            p_scanned_by: scanPayload.scanned_by,
            p_gate_name: scanPayload.gate_name,
            p_device_id: scanPayload.device_id,
            p_event_id: scanPayload.event_id, 
            p_scan_type: scanPayload.scan_type.toUpperCase(),
            p_offline_scanned_at: undefined 
          });

          if (rpcError) throw rpcError;
          if (!rpcData) throw new Error('NO RESPONSE');

          const result = rpcData as unknown as RpcResponse;

          if (result.success) {
            playFeedback('success');
            showBanner('success', result.message || 'ACCESS GRANTED');
          } else {
            playFeedback('error');
            showBanner('error', result.message || 'ACCESS DENIED');
          }
        } catch (networkError) {
            console.warn('Network request failed, shifting to offline queue:', networkError);
            addScanToQueue(scanPayload);
            playFeedback('success'); 
            showBanner('success', 'SAVED OFFLINE');
          }
      } else {
        addScanToQueue(scanPayload);
        playFeedback('success');
        showBanner('success', 'SAVED OFFLINE');
      }

    } catch (error: any) {
      playFeedback('error');
      showBanner('error', error.message || 'FATAL ERROR');
    }

    setTimeout(() => {
      setBanner({ visible: false, type: 'processing', message: '' });
      isScanning.current = false;
    }, 800); 
  };

  if (!permission?.granted) return <View style={styles.container}><ActivityIndicator color="#FF9500" /></View>;

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={torchOn}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={!isScanning.current ? handleBarcodeScanned : undefined}
      />

      <View style={styles.reticleContainer} pointerEvents="none">
        <View style={styles.reticle}>
          <Animated.View style={[styles.laser, { transform: [{ translateY: scanLineAnim }] }]} />
        </View>
      </View>

      {banner.visible && (
        <View style={[styles.banner, banner.type === 'success' ? styles.bannerSuccess : banner.type === 'error' ? styles.bannerError : styles.bannerProcessing]}>
          <Text style={styles.bannerText}>{banner.message}</Text>
        </View>
      )}

      <View style={styles.hud}>
        <View style={styles.hudTopRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={[styles.networkPill, { backgroundColor: isOnline ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)' }]}>
            <View style={[styles.networkDot, { backgroundColor: isOnline ? '#10B981' : '#EF4444' }]} />
            <Text style={[styles.networkText, { color: isOnline ? '#10B981' : '#EF4444' }]}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </Text>
          </View>

          <TouchableOpacity style={[styles.iconButton, { backgroundColor: torchOn ? '#FFFFFF' : 'rgba(10, 18, 29, 0.8)' }]} onPress={() => setTorchOn(!torchOn)}>
            <Ionicons name={torchOn ? "flash" : "flash-off"} size={20} color={torchOn ? "#0A121D" : "#FFFFFF"} />
          </TouchableOpacity>
        </View>

        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, scanMode === 'in' && styles.toggleBtnActiveIn]} 
            onPress={() => setScanMode('in')}
          >
            <Text style={[styles.toggleText, scanMode === 'in' && { color: '#FFFFFF' }]}>SCAN IN</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, scanMode === 'out' && styles.toggleBtnActiveOut]} 
            onPress={() => setScanMode('out')}
          >
            <Text style={[styles.toggleText, scanMode === 'out' && { color: '#FFFFFF' }]}>SCAN OUT</Text>
          </TouchableOpacity>
        </View>
      </View>

      {queue.length > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.syncRow}>
            {isSyncing ? <ActivityIndicator size="small" color="#FF9500" /> : <Ionicons name="cloud-upload" size={16} color="#FF9500" />}
            <Text style={styles.queueText}>{isSyncing ? ' SYNCING...' : ` PENDING SYNC: ${queue.length}`}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A121D' },
  reticleContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  reticle: { width: 250, height: 250, borderWidth: 2, borderColor: 'rgba(255, 149, 0, 0.5)', borderRadius: 24, overflow: 'hidden' },
  laser: { width: '100%', height: 4, backgroundColor: '#FF9500', shadowColor: '#FF9500', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10, elevation: 5 },
  
  banner: { position: 'absolute', top: 180, left: 20, right: 20, padding: 20, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 },
  bannerSuccess: { backgroundColor: '#10B981' },
  bannerError: { backgroundColor: '#EF4444' },
  bannerProcessing: { backgroundColor: '#0A121D', borderWidth: 1, borderColor: '#1F3A5C' },
  bannerText: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', letterSpacing: 1 },

  hud: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 20, right: 20, gap: 16 },
  hudTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconButton: { width: 44, height: 44, backgroundColor: 'rgba(10, 18, 29, 0.8)', borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#1F3A5C' },
  networkPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1 },
  networkDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  networkText: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  
  toggleContainer: { flexDirection: 'row', backgroundColor: 'rgba(10, 18, 29, 0.8)', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: '#1F3A5C' },
  toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  toggleBtnActiveIn: { backgroundColor: '#10B981' },
  toggleBtnActiveOut: { backgroundColor: '#EF4444' },
  toggleText: { color: '#8A99A8', fontSize: 13, fontWeight: '900', letterSpacing: 1 },

  bottomBar: { position: 'absolute', bottom: Platform.OS === 'ios' ? 40 : 20, alignSelf: 'center', backgroundColor: 'rgba(10, 18, 29, 0.95)', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#1F3A5C' },
  syncRow: { flexDirection: 'row', alignItems: 'center' },
  queueText: { color: '#FF9500', fontSize: 13, fontWeight: '800', marginLeft: 8 }
});