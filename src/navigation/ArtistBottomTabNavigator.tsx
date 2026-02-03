import React from 'react';
import { Image, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';

import Colors from '../utils/Colors';
import ArtistHomeScreen from '../screen/artist/ArtistHomeScreen';
import ArtistBookingsScreen from '../screen/artist/ArtistBookingsScreen';
import ArtistPortfolioScreen from '../screen/artist/ArtistPortfolioScreen';
import ArtistWalletScreen from '../screen/artist/ArtistWalletScreen';
import ArtistCoursesScreen from '../screen/artist/ArtistCoursesScreen';
import ArtistBookingsStackNavigator from './ArtistBookingsStackNavigator';

type ArtistTabParamList = {
  Home: undefined;
  Portfolio: undefined;
  Bookings: undefined;
  Courses: undefined;
  Wallet: undefined;
};

const Tab = createBottomTabNavigator<ArtistTabParamList>();

const tabImages: Record<keyof ArtistTabParamList, any> = {
  Home: require('../asset/images/tabImages/home.png'),
  Portfolio: require('../asset/images/tabImages/profile.png'),
  Bookings: require('../asset/images/tabImages/book.png'),
  Courses: require('../asset/images/tabImages/book.png'), // reused icon ✅
  Wallet: require('../asset/images/tabImages/book.png'),
};

const ArtistBottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }: { route: RouteProp<ArtistTabParamList, keyof ArtistTabParamList> }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarStyle: {
        height: 80,
        paddingBottom: 6,
        paddingTop: 6,
      },
      tabBarIcon: ({ focused }) => (
        <Image
          source={tabImages[route.name]}
          style={{
            width: 24,
            height: 24,
            tintColor: focused ? Colors.black : Colors.textSecondary,
            marginBottom: 2,
          }}
          resizeMode="contain"
        />
      ),
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
    <Tab.Screen name="Courses" component={ArtistCoursesScreen} />
    <Tab.Screen name="Wallet" component={ArtistWalletScreen} />
  </Tab.Navigator>
);

export default ArtistBottomTabNavigator;
