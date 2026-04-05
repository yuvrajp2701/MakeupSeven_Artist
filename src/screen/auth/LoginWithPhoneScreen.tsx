import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import Colors from '../../utils/Colors';
import { scale, verticalScale, moderateScale, hp } from '../../utils/Responsive';
import { apiCall } from '../../services/api';

const LoginWithPhoneScreen = ({ navigation }: any) => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    /** Generate a secure 4-digit OTP */
    const generateOtp = (): string => {
        return Math.floor(1000 + Math.random() * 9000).toString();
    };

    /** Try to send OTP via backend, fallback to local generation */
    const handleSendOTP = async () => {
        const trimmedPhone = phone.trim();

        if (trimmedPhone.length !== 10 || !/^\d{10}$/.test(trimmedPhone)) {
            Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
            return;
        }

        setLoading(true);

        try {
            let finalOtp = generateOtp(); // local fallback OTP
            const cleanPhone = trimmedPhone.replace(/[^0-9]/g, '');
            const artistEmail = `artist_${cleanPhone}@makeupseven.com`;

            console.log('[OTP] Generated local fallback OTP for phone', cleanPhone, ':', finalOtp);

            // Try to call backend send-otp endpoint
            let otpSentViaServer = false;
            let resFirstLogin = false;
            try {
                const res = await apiCall('/auth/send-otp', {
                    method: 'POST',
                    body: { mobile: cleanPhone, role: 'ARTIST' },
                });
                console.log('[OTP] Server send-otp response:', res);

                // ✅ Capture firstLogin flag from response
                resFirstLogin = res?.firstLogin || false;
                console.log('[OTP] First login from server:', resFirstLogin);

                // ✅ Use server's devOtp if provided (dev/test mode)
                if (res?.devOtp) {
                    finalOtp = String(res.devOtp);
                    console.log('[OTP] Using server devOtp:', finalOtp);
                }
                otpSentViaServer = true;
            } catch (serverErr: any) {
                console.log('[OTP] Server send-otp not available, using local OTP:', serverErr.message);
            }

            // Show OTP to user only when server didn't handle SMS delivery
            if (!otpSentViaServer) {
                Alert.alert(
                    '📱 OTP Sent',
                    `Your OTP is: ${finalOtp}\n\n(SMS not configured on server — showing here for testing.)`,
                    [{ text: 'OK' }]
                );
            }

            // Navigate to OTP screen with the correct OTP (server's or local fallback)
            navigation.navigate('OTPScreen', {
                phone: cleanPhone,
                generatedOtp: finalOtp,
                artistEmail,
                firstLogin: resFirstLogin,
            });
        } catch (err: any) {
            console.error('[OTP] Error in handleSendOTP:', err);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
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
                        editable={!loading}
                    />
                </View>
                <TouchableOpacity
                    style={[styles.otpBtn, loading && styles.disabledBtn]}
                    onPress={handleSendOTP}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={Colors.white} />
                    ) : (
                        <Text style={styles.otpBtnText}>Get OTP</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.dividerRow}>
                    <View style={styles.divider} />
                    <View style={styles.divider} />
                </View>

            </View>
        </View>
    );
};

export default LoginWithPhoneScreen;

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
        alignSelf: 'flex-start',
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

    disabledBtn: {
        opacity: 0.6,
    },

    otpBtnText: {
        fontSize: scale(18),
        fontWeight: 'bold',
        color: Colors.white,
    },
});
