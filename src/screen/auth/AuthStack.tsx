import React from 'react';
import { SplashScreen, LoginWithPhoneScreen, OTPScreen } from './index';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type AuthStackParamList = {
    Splash: undefined;
    LoginWithPhone: undefined;
    OTPScreen: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="LoginWithPhone" component={LoginWithPhoneScreen} />
        <Stack.Screen name="OTPScreen" component={OTPScreen} />
    </Stack.Navigator>
);

export default AuthStack;
