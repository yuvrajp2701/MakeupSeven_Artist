import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../utils/Colors';
import { scale, verticalScale, moderateScale, hp } from '../../utils/Responsive';

const OTP_LENGTH = 4;

const OTPScreen = ({ navigation }: any) => {
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [timer, setTimer] = useState(30);
    const inputs = useRef<Array<TextInput | null>>([]);

    /* Timer */
    useEffect(() => {
        if (!timer) return;
        const interval = setInterval(() => setTimer(t => t - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    /* OTP Change */
    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < OTP_LENGTH - 1) {
            inputs.current[index + 1]?.focus();
        }

        if (!value && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const isOtpComplete = otp.every(digit => digit !== '');

    const handleVerify = () => {
        if (!isOtpComplete) return;
        navigation.navigate('LocationSearch');
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={[Colors.secondary, Colors.white]}
                style={styles.header}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            >
                <TouchableOpacity style={styles.backBtn} onPress={navigation.goBack}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>

                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../asset/images/logo.png')}
                        style={styles.logosty}
                        resizeMode="contain"
                    />
                </View>
            </LinearGradient>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.heading}>OTP Verification</Text>
                <Text style={styles.subText}>
                    We’ve sent an OTP to +91 XXXXXXXX3211
                </Text>

                {/* OTP Inputs */}
                <View style={styles.otpRow}>
                    {otp.map((value, index) => (
                        <TextInput
                            key={index}
                            ref={ref => (inputs.current[index] = ref)}
                            style={styles.otpInput}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={value}
                            onChangeText={text => handleChange(text, index)}
                            autoFocus={index === 0}
                        />
                    ))}
                </View>

                {/* Timer */}
                <Text style={styles.timerText}>
                    Retry OTP in{' '}
                    <Text style={styles.timerCount}>
                        00:{timer < 10 ? `0${timer}` : timer}
                    </Text>
                </Text>

                {/* Confirm */}
                <TouchableOpacity
                    style={[
                        styles.confirmBtn,
                        !isOtpComplete && styles.disabledBtn,
                    ]}
                    onPress={handleVerify}
                    disabled={!isOtpComplete}
                >
                    <Text style={styles.confirmText}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default OTPScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },

    header: {
        paddingTop: hp(4),
        paddingBottom: hp(3),
        paddingHorizontal: scale(20),
        borderBottomLeftRadius: scale(28),
        borderBottomRightRadius: scale(28),
    },

    backBtn: {
        width: scale(50),
        height: scale(50),
        borderRadius: scale(12),
        backgroundColor: Colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(10),
        bottom: verticalScale(10)
    },

    backText: {
        fontSize: scale(22),
        fontWeight: 'bold',
        color: Colors.primary,
    },

    logo: {
        fontSize: scale(30),
        fontWeight: 'bold',
    },

    logoBlack: {
        color: Colors.black,
    },

    logoPrimary: {
        color: Colors.primary,
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

    content: {
        flex: 1,
        paddingHorizontal: scale(24),
    },

    heading: {
        fontSize: scale(20),
        fontWeight: 'bold',
        marginBottom: verticalScale(6),
        color: Colors.black,
    },

    subText: {
        fontSize: scale(14),
        color: Colors.text,
        marginBottom: verticalScale(20),
    },

    otpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(20),
    },

    otpInput: {
        width: scale(60),
        height: scale(56),
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: moderateScale(10),
        textAlign: 'center',
        fontSize: scale(22),
        color: Colors.primary,
        backgroundColor: Colors.inputBackground,
    },

    timerText: {
        fontSize: scale(14),
        color: Colors.text,
        marginBottom: verticalScale(20),
    },

    timerCount: {
        color: Colors.primary,
        fontWeight: 'bold',
    },

    confirmBtn: {
        backgroundColor: Colors.primary,
        borderRadius: moderateScale(10),
        paddingVertical: verticalScale(14),
        alignItems: 'center',
    },

    disabledBtn: {
        opacity: 0.5,
    },

    confirmText: {
        fontSize: scale(18),
        fontWeight: 'bold',
        color: Colors.white,
    },
});
