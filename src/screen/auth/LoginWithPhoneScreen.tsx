

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import Colors from '../../utils/Colors';
import { scale, verticalScale, moderateScale, wp, hp } from '../../utils/Responsive';

const LoginWithPhoneScreen = ({ navigation }: any) => {
    const [phone, setPhone] = useState('');

    const handleSendOTP = () => {
        // TODO: Implement OTP send logic
        navigation.navigate('OTPScreen');
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../asset/images/authImg.png')} style={styles.bgImage} resizeMode="cover" />
            <View style={styles.card}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../asset/images/logo.png')}
                        style={styles.logosty}
                        resizeMode="contain"
                    />
                </View>
                <TouchableOpacity style={styles.socialBtn}>
                    <Image source={require('../../asset/images/google.png')} style={styles.socialIcon} />
                    <Text style={styles.socialText}>Sign Up with Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}>
                    <Image source={require('../../asset/images/apple.png')} style={styles.socialIcon} />
                    <Text style={styles.socialText}>Sign Up with Apple</Text>
                </TouchableOpacity>
                <View style={styles.dividerRow}>
                    <View style={styles.divider} />
                    <Text style={styles.orText}>or</Text>
                    <View style={styles.divider} />
                </View>
                <Text style={styles.inputLabel}>Enter Mobile Number</Text>
                <View style={styles.inputRow}>
                    <View style={styles.countryCodeBox}>
                        <Text style={styles.countryCodeText}>+91</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Mobile number"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                        placeholderTextColor={Colors.textSecondary}
                        maxLength={10}
                    />
                </View>
                <TouchableOpacity style={styles.otpBtn} onPress={handleSendOTP} activeOpacity={0.8}>
                    <Text style={styles.otpBtnText}>Get OTP</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.secondary,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    bgImage: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: hp(55),
    },

    card: {
        width: '90%',
        backgroundColor: Colors.card,
        borderRadius: moderateScale(24),
        padding: moderateScale(24),
        marginBottom: verticalScale(24),
        alignItems: 'center',
        elevation: 6,
    },

    imageContainer: {
        height: scale(28),
        width: scale(174),
        marginBottom: verticalScale(16),
        alignSelf: 'flex-start'
    },

    logosty: {
        width: '100%',
        height: '100%',
    },

    socialBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(16),
        borderRadius: moderateScale(8),
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.google,
        marginBottom: verticalScale(12),
    },

    socialIcon: {
        width: scale(22),
        height: scale(22),
        marginRight: scale(12),
        resizeMode: 'contain',
    },

    socialText: {
        fontSize: scale(16),
        color: Colors.text,
    },

    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: verticalScale(12),
    },

    divider: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },

    orText: {
        marginHorizontal: scale(8),
        fontSize: scale(14),
        color: Colors.textSecondary,
    },

    inputLabel: {
        alignSelf: 'flex-start',
        fontSize: scale(16),
        fontWeight: '500',
        color: Colors.text,
        marginBottom: verticalScale(6),
    },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: verticalScale(18),
    },

    countryCodeBox: {
        paddingHorizontal: scale(12),
        paddingVertical:
            Platform.OS === 'ios' ? verticalScale(10) : verticalScale(8),
        borderRadius: moderateScale(8),
        borderWidth: 1,
        borderColor: Colors.primary,
        marginRight: scale(8),
        backgroundColor: Colors.countryCodeBackground,
    },

    countryCodeText: {
        fontSize: scale(16),
        fontWeight: 'bold',
        color: Colors.primary,
    },

    input: {
        flex: 1,
        height: verticalScale(44),
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: moderateScale(8),
        paddingHorizontal: scale(12),
        fontSize: scale(16),
        backgroundColor: Colors.inputBackground,
        color: Colors.text,
    },

    otpBtn: {
        width: '100%',
        paddingVertical: verticalScale(14),
        borderRadius: moderateScale(10),
        backgroundColor: Colors.primary,
        alignItems: 'center',
    },

    otpBtnText: {
        fontSize: scale(18),
        fontWeight: 'bold',
        color: Colors.white,
    },
});

export default LoginWithPhoneScreen;
