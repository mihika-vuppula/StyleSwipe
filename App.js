import { theme } from './src/styles/Theme'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import SwipeScreen from './src/screens/SwipeScreen';
import MatchScreen from './src/screens/MatchScreen';
import AccountScreen from './src/screens/AccountScreen';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
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
        </NavigationContainer>
    );
}
