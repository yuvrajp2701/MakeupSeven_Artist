import React from 'react';
import { Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';

import Colors from '../utils/Colors';
import ArtistHomeScreen from '../screen/artist/ArtistHomeScreen';
import ArtistBookingsScreen from '../screen/artist/ArtistBookingsScreen';
import ArtistPortfolioScreen from '../screen/artist/ArtistPortfolioScreen';
import ArtistWalletScreen from '../screen/artist/ArtistWalletScreen';
import ArtistBookingsStackNavigator from './ArtistBookingsStackNavigator';
import CoursesScreen from '../screen/CoursesScreen';

type ArtistTabParamList = {
  Home: undefined;
  Portfolio: undefined;
  Bookings: undefined;
  Courses: undefined;
  Wallet: undefined;
};

const Tab = createBottomTabNavigator<ArtistTabParamList>();

const ArtistBottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }: { route: RouteProp<ArtistTabParamList, keyof ArtistTabParamList> }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarStyle: {
        height: 70, // Slightly reduced for better proportion
        paddingBottom: 10,
        paddingTop: 10,
        backgroundColor: '#fff',
        borderTopWidth: 0,
        elevation: 10, // Shadow for "floating" effect
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      tabBarIcon: ({ focused, color }) => {
        let iconName = 'home';
        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Portfolio') {
          iconName = 'person';
        } else if (route.name === 'Bookings') {
          iconName = 'event-note';
        } else if (route.name === 'Courses') {
          iconName = 'menu-book';
        } else if (route.name === 'Wallet') {
          iconName = 'account-balance-wallet';
        }

        return <MaterialIcons name={iconName} size={26} color={color} style={{ marginBottom: 4 }} />;
      },
      tabBarActiveTintColor: '#000000', // Active Color
      tabBarInactiveTintColor: '#9CA3AF', // Inactive Color (Gray)
      tabBarLabel: ({ focused }) => (
        <Text
          style={{
            color: focused ? Colors.black : Colors.textSecondary,
            fontSize: 12,
            fontWeight: focused ? '600' : '400',
          }}
        >
          {route.name}
        </Text>
      ),
    })}
  >
    <Tab.Screen name="Home" component={ArtistHomeScreen} />
    <Tab.Screen name="Portfolio" component={ArtistPortfolioScreen} />
    <Tab.Screen
      name="Bookings"
      component={ArtistBookingsStackNavigator}
    />
    <Tab.Screen name="Courses" component={CoursesScreen} />
    <Tab.Screen name="Wallet" component={ArtistWalletScreen} />
  </Tab.Navigator>
);

export default ArtistBottomTabNavigator;
