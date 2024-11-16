import { theme } from './src/styles/Theme';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import SwipeScreen from './src/screens/SwipeScreen';
import SignInScreen from './src/screens/SignInScreen';
import MatchScreen from './src/screens/MatchScreen';
import AccountScreen from './src/screens/AccountScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Swipe"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          let IconComponent;

          if (route.name === 'Swipe') {
            IconComponent = MaterialCommunityIcons;
            iconName = 'cards';
          } else if (route.name === 'Match') {
            IconComponent = Ionicons;
            iconName = 'heart';
          } else if (route.name === 'Account') {
            IconComponent = Ionicons;
            iconName = 'person';
          }

          return <IconComponent name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primaryColor,
        tabBarInactiveTintColor: theme.secondaryColor,
        tabBarLabelStyle: { display: 'none' },
        tabBarStyle: {
          height: 60,
          backgroundColor: '#f3f3f3',
          borderTopWidth: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Swipe" component={SwipeScreen} />
      <Tab.Screen name="Match" component={MatchScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  console.log('App component loaded'); // Log to ensure App.js is executed

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignInScreen">
        <Stack.Screen
          name="SignInScreen"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
