import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('LoginWithPhone' as never);
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <LinearGradient
            colors={['rgba(136, 85, 255, 0.3)', 'rgba(136, 85, 255, 0.1)']}
            style={styles.container}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={require('../../asset/images/logo.png')}
                    style={styles.logosty}
                    resizeMode="contain"
                />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logosty: {
        width: '100%',
        height: '100%',
    },
    imageContainer: {
        height: 53,
        width: '90%',
    },
});

export default SplashScreen;
