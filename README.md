# TicketsZetu Operations Scanner 🎫

An enterprise-grade, offline-first access control application for the TicketsZetu platform. Built with React Native and Expo, this edge client is designed for high-throughput, chaotic event environments where speed, network resilience, and strict security are mandatory.

## 🏗 Core Architecture & Features

This is not a basic barcode reader. It is a strictly governed operations terminal:

* **Offline-First Synchronization (The Queue Engine):** Network drops at festivals are inevitable. Scans are immediately captured in RAM and persisted via `AsyncStorage` using Zustand. The engine automatically time-shifts and flushes the queue to the database the millisecond connectivity is restored.
* **Context-Aware Security:** Eliminates cross-event fraud. Agents must authenticate via Supabase and lock into a specific `event_id` and `gate` before the camera activates. The database strictly rejects tickets belonging to other deployments.
* **Rapid-Fire Throughput:** UI blocking is removed. The scanner operates on an aggressive 800ms cooldown loop, utilizing non-blocking banner notifications and synchronous native audio (`expo-audio`) for "no-look" scanning.
* **Anti Pass-Back Engine:** Gate agents can seamlessly toggle between `SCAN IN` and `SCAN OUT` modes, reversing ticket states to allow secure VIP re-entry without opening vulnerabilities for pass-back fraud.

## 🛠 Tech Stack

* **Framework:** React Native / Expo (SDK 51+) / Expo Router
* **Backend Integration:** Supabase (Auth & Postgres RPCs)
* **State & Offline Persistence:** Zustand + AsyncStorage
* **Hardware APIs:** `expo-camera`, `expo-audio`, React Native Haptics/Vibration
* **Session Storage:** SQLite (`expo-sqlite/localStorage`)

## 🔐 Environment Setup

To run this project locally, you must connect it to the TicketsZetu Supabase instance. Create a `.env` file in the root directory (do not commit this file):

```env
EXPO_PUBLIC_SUPABASE_URL=[https://your-project-id.supabase.co](https://your-project-id.supabase.co)
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-long-anon-key