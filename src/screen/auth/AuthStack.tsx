import React from 'react';
import { SplashScreen, LoginWithPhoneScreen, OTPScreen } from './index';
import LocationSearchScreen from './LocationSearchScreen';
import ReferralCodeScreen from './ReferralCodeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type AuthStackParamList = {
    Splash: undefined;
    LoginWithPhone: undefined;
    OTPScreen: {
        phone: string;
        generatedOtp: string;
        artistEmail?: string;
    };
    LocationSearch: undefined;
    ReferralCode: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="LoginWithPhone" component={LoginWithPhoneScreen} />
        <Stack.Screen name="OTPScreen" component={OTPScreen} />
        <Stack.Screen name="LocationSearch" component={LocationSearchScreen} />
        <Stack.Screen name="ReferralCode" component={ReferralCodeScreen} />
    </Stack.Navigator>
);

export default AuthStack;
