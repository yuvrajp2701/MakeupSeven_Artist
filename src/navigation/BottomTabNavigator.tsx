import React from 'react';
import { Image, Text } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Colors from '../utils/Colors';
import HomeScreen from '../screen/HomeScreen';
import BookingsScreen from '../screen/BookingsScreen';
import ProfileScreen from '../screen/ProfileScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';
import ArtistsScreen from '../screens/artists/ArtistsScreen';
import CreateArtistProfileScreen from '../screen/artist/CreateArtistProfileScreen';
import CoursesScreen from '../screen/CoursesScreen';



type TabParamList = {
    Home: undefined;
    Artists: undefined;
    Bookings: undefined;
    Courses: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const tabImages: Record<keyof TabParamList, any> = {
    Home: require('../asset/images/tabImages/home.png'),
    Artists: require('../asset/images/tabImages/artist.png'),
    Bookings: require('../asset/images/tabImages/book.png'),
    Courses: require('../asset/images/tabImages/book.png'), // Placeholder, using Vector Icon in render
    Profile: require('../asset/images/tabImages/profile.png'),
};


const BottomTabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }: { route: RouteProp<TabParamList, keyof TabParamList> }) => ({
            headerShown: false,
            tabBarShowLabel: true,
            tabBarActiveTintColor: Colors.black,
            tabBarInactiveTintColor: Colors.textSecondary,
            tabBarStyle: {
                height: 60,
                paddingBottom: 6,
                paddingTop: 6,
            },
            tabBarIcon: ({ focused }: { focused: boolean }) => {
                if (route.name === 'Courses') {
                    return (
                        <FontAwesome
                            name="graduation-cap"
                            size={20}
                            color={focused ? Colors.black : Colors.textSecondary}
                            style={{ marginBottom: 2 }}
                        />
                    );
                }
                return (
                    <Image
                        source={tabImages[route.name as keyof typeof tabImages]}
                        style={{
                            width: 24,
                            height: 24,
                            tintColor: focused ? Colors.black : Colors.textSecondary,
                            marginBottom: 2,
                        }}
                        resizeMode="contain"
                    />
                );
            },
            tabBarLabel: ({ focused }: { focused: boolean }) => (
                <Text style={{ color: focused ? Colors.black : Colors.textSecondary, fontSize: 12, fontWeight: focused ? 'bold' : 'normal' }}>
                    {route.name}
                </Text>
            ),
        })}
    >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Artists" component={ArtistsScreen} />
        <Tab.Screen name="Bookings" component={BookingsScreen} />
        <Tab.Screen name="Courses" component={CoursesScreen} />
        <Tab.Screen name="Profile" component={CreateArtistProfileScreen} />
    </Tab.Navigator>
);

export default BottomTabNavigator;
