import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { dbStore } from '../src/data/db/database';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  useEffect(() => {
    dbStore.init();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
