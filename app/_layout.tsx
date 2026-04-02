// app/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  // The root layout simply provides a headless navigation stack for the entire app.
  return <Stack screenOptions={{ headerShown: false }} />;
}