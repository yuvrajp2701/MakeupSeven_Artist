import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from '../screen/auth/AuthStack';
import BottomTabNavigator from './BottomTabNavigator';
import SearchScreen from '../screen/SearchScreen';
import ProductScreen from '../screen/ProductScreen';
import ArtistStackNavigator from './ArtistStackNavigator';


const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                <RootStack.Screen name="BottomTab" component={BottomTabNavigator} />
                <RootStack.Screen name="Auth" component={AuthStack} />
                <RootStack.Screen name="Search" component={SearchScreen} />
                <RootStack.Screen name="Products" component={ProductScreen} />
                <RootStack.Screen name="Artist" component={ArtistStackNavigator} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
