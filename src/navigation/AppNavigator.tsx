import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from '../screen/auth/AuthStack';
import BottomTabNavigator from './BottomTabNavigator';

const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                <RootStack.Screen name="Auth" component={AuthStack} />
                <RootStack.Screen name="BottomTab" component={BottomTabNavigator} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
