/**
 * --------------------------------------------------------------------------------------------------
 * ENGINE: OFFLINE SYNCHRONIZATION STORE (ZUSTAND)
 * --------------------------------------------------------------------------------------------------
 * * CORE ARCHITECTURE:
 * - Persistence: Uses AsyncStorage to survive hard app crashes and reboots.
 * - Non-Blocking: Captures scan payloads instantly to RAM while the UI moves on.
 * - Auto-Recovery: Attempts to flush the queue sequentially when NetInfo detects WiFi/Cellular.
 * * DATA INTEGRITY:
 * - Time-Shifting: Preserves the exact `scanned_at` timestamp of the physical offline scan,
 * overriding the Postgres `NOW()` function when finally synced.
 * - Context Preservation: Caches the `event_id` and `scan_type` so the DB can perform
 * retroactive security validation upon sync.
 * * @critical If you add a new parameter to the `scan_ticket` Postgres RPC,
 * you MUST add it to the `processQueue` payload mapping below, or offline syncs will silently fail.
 * --------------------------------------------------------------------------------------------------
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../utils/supabase";

// What does a scan look like while waiting in the queue?
export interface QueuedScan {
  ticket_id: string;
  scanned_by: string;
  gate_name: string;
  device_id: string;
  scanned_at: string;
  event_id: string;
  scan_type: "in" | "out";
}

interface SyncState {
  queue: QueuedScan[];
  isSyncing: boolean;
  addScanToQueue: (scan: QueuedScan) => void;
  processQueue: () => Promise<void>;
  clearQueue: () => void;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set, get) => ({
      queue: [],
      isSyncing: false,

      // 1. Instantly drop the scan into the queue (happens in milliseconds)
      addScanToQueue: (scan) => {
        set((state) => ({ queue: [...state.queue, scan] }));
      },

      // 2. Fire the queued scans to Supabase
      processQueue: async () => {
        const { queue, isSyncing } = get();

        // Don't run if already syncing or if the queue is empty
        if (isSyncing || queue.length === 0) return;

        set({ isSyncing: true });

        const remainingQueue: QueuedScan[] = [];

        // Try to process every scan in the queue
        for (const scan of queue) {
          try {
            const { error } = await supabase.rpc("scan_ticket", {
              p_ticket_id: scan.ticket_id,
              p_scanned_by: scan.scanned_by,
              p_gate_name: scan.gate_name,
              p_device_id: scan.device_id,
              p_event_id: scan.event_id,
              p_scan_type: scan.scan_type.toUpperCase(),
              p_offline_scanned_at: scan.scanned_at,
            });

            if (error) {
              console.error(`Failed to sync ticket ${scan.ticket_id}:`, error);
              // If it failed (e.g. network dropped again), keep it in the queue
              remainingQueue.push(scan);
            }
          } catch (err) {
            // Catastrophic failure (e.g., airplane mode), keep it in the queue
            console.error(`Offline sync failed for ${scan.ticket_id}:`, err);
            remainingQueue.push(scan);
          }
        }

        // Update the state with whatever scans survived (failed to sync)
        set({ queue: remainingQueue, isSyncing: false });
      },

      clearQueue: () => set({ queue: [] }),
    }),
    {
      name: "ticketszetu-offline-queue",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
