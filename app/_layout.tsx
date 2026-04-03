/**
 * --------------------------------------------------------------------------
 * INTERFACE: GLOBAL APPLICATION SHELL
 * --------------------------------------------------------------------------
 * * CORE ARCHITECTURE:
 * - Root Registry: Acts as the absolute base layer for Expo Router navigation.
 * - Headless Design: Disables the default native headers globally (`headerShown: false`). 
 * This ensures that child routes (like the custom Login UI and Scanner HUD) have 
 * 100% control over the screen real estate.
 * - Logic Delegation: Authentication guards and session state are intentionally 
 * omitted from this global shell and delegated to the `/(scan)/_layout.tsx` firewall.
 * * @critical Keep this file as light as possible to minimize app boot time. 
 * --------------------------------------------------------------------------
 */

import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}