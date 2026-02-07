import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ArtistBottomTabNavigator from './ArtistBottomTabNavigator';
import SetAvailabilityScreen from '../screen/artist/SetAvailabilityScreen';
import EditServiceScreen from '../screen/artist/EditServiceScreen';
import ArtistAllReviewsScreen from '../screen/artist/ArtistAllReviewsScreen';
import EditRecentWorksScreen from '../screen/artist/EditRecentWorksScreen';
import BookingDetailsScreen from '../screen/artist/BookingDetailsScreen';
import ServiceOngoingScreen from '../screen/artist/ServiceOngoingScreen';
import CustomerOtpScreen from '../screen/artist/CustomerOtpScreen';
import ArtistNotificationScreen from '../screen/artist/ArtistNotificationScreen';



const Stack = createNativeStackNavigator();

const ArtistStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Bottom Tabs */}
      <Stack.Screen
        name="ArtistTabs"
        component={ArtistBottomTabNavigator}
      />

      {/* Availability Flow */}
      <Stack.Screen
        name="SetAvailability"
        component={SetAvailabilityScreen}
      />

      <Stack.Screen
        name="EditService"
        component={EditServiceScreen}
      />
      <Stack.Screen
        name="AllReviews"
        component={ArtistAllReviewsScreen}
      />
      <Stack.Screen
        name="EditRecentWorks"
        component={EditRecentWorksScreen}
      />
      <Stack.Screen
        name="BookingDetails"
        component={BookingDetailsScreen}
      />
      <Stack.Screen
        name="ServiceOngoing"
        component={ServiceOngoingScreen}
      />
      <Stack.Screen
        name="CustomerOtp"
        component={CustomerOtpScreen}
      />
      <Stack.Screen
        name="Notifications"
        component={ArtistNotificationScreen}
      />

    </Stack.Navigator>
  );
};

export default ArtistStackNavigator;
