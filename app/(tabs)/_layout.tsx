import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { theme } from '../../src/ui/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.bgCard,
          borderTopColor: theme.colors.border,
          height: 66,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: theme.colors.pickleGreen,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Rytuał',
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 28, height: 26, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 20, lineHeight: 24, textAlign: 'center' }}>{focused ? '⚖️' : '⏱️'}</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="dojrzewalnia"
        options={{
          title: 'Dojrzewalnia',
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 28, height: 26, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 20, lineHeight: 24, textAlign: 'center' }}>{focused ? '🫙' : '🫧'}</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="wiedza"
        options={{
          title: 'Wiedza',
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 28, height: 26, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 20, lineHeight: 24, textAlign: 'center' }}>{focused ? '📖' : '📕'}</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

