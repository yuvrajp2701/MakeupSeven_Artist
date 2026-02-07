import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from '../screen/auth/AuthStack';

import ArtistStackNavigator from './ArtistStackNavigator';
import CourseCheckoutScreen from '../screen/CourseCheckoutScreen';
import PaymentSuccessScreen from '../screen/PaymentSuccessScreen';
import CourseDetailsScreen from '../screen/CourseDetailsScreen';
import CoursePlayerScreen from '../screen/CoursePlayerScreen';


const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                <RootStack.Screen name="Artist" component={ArtistStackNavigator} />
                <RootStack.Screen name="Auth" component={AuthStack} />
                <RootStack.Screen name="CourseCheckout" component={CourseCheckoutScreen} />
                <RootStack.Screen name="CourseDetails" component={CourseDetailsScreen} />
                <RootStack.Screen name="CoursePlayer" component={CoursePlayerScreen} />
                <RootStack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
