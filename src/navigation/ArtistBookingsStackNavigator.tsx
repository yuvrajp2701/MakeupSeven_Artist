import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ArtistBookingsScreen from '../screen/artist/ArtistBookingsScreen';
import BookingDetailsScreen from '../screen/artist/BookingDetailsScreen';
import ServiceOngoingScreen from '../screen/artist/ServiceOngoingScreen';
import CustomerOtpScreen from '../screen/artist/CustomerOtpScreen';
import ServiceCompletedScreen from '../screen/artist/ServiceCompletedScreen';

export type ArtistBookingsStackParamList = {
    ArtistBookings: undefined;
    BookingDetails: any;
    ServiceOngoing: any;
    CustomerOtp: any;
    ServiceCompleted: { price: string };
};

const Stack = createNativeStackNavigator<ArtistBookingsStackParamList>();

const ArtistBookingsStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="ArtistBookings"
                component={ArtistBookingsScreen}
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
                name="ServiceCompleted"
                component={ServiceCompletedScreen}
            />
        </Stack.Navigator>
    );
};

export default ArtistBookingsStackNavigator;
