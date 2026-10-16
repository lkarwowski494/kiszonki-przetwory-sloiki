import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { theme } from '../../src/ui/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.bgCard,
          borderTopColor: theme.colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.colors.pickleGreen,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Receptury',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '📖' : '📕'}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="kreator"
        options={{
          title: 'Kreator',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '🥒' : '🧮'}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="fermentacja"
        options={{
          title: 'Fermentacja',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '🫧' : '⏳'}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="spizarnia"
        options={{
          title: 'Spiżarnia',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '🫙' : '📦'}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="ratownik"
        options={{
          title: 'Ratownik',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '🩺' : '💡'}</Text>
          ),
        }}
      />
    </Tabs>
  );
}
