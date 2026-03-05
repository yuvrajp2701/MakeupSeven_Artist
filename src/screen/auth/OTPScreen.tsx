import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../utils/Colors';
import { scale, verticalScale, moderateScale, hp } from '../../utils/Responsive';
import { useAuth } from '../../context/AuthContext';
import { apiCall } from '../../services/api';

const OTP_LENGTH = 4;
const RESEND_TIMER = 30;

const OTPScreen = ({ navigation, route }: any) => {
    const { phone, generatedOtp, artistEmail } = route.params || {};

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [timer, setTimer] = useState(RESEND_TIMER);
    const [loading, setLoading] = useState(false);
    const [currentOtp, setCurrentOtp] = useState<string>(generatedOtp || '');

    const inputs = useRef<Array<TextInput | null>>([]);
    const { login } = useAuth();

    // ─── Timer countdown ────────────────────────────────────────────────
    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => setTimer(t => t - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    // ─── OTP input handler ───────────────────────────────────────────────
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

    // ─── Generate new OTP ────────────────────────────────────────────────
    const generateNewOtp = (): string => {
        return Math.floor(1000 + Math.random() * 9000).toString();
    };

    // ─── Resend OTP ──────────────────────────────────────────────────────
    const handleResend = useCallback(async () => {
        let newOtp = generateNewOtp(); // local fallback
        setOtp(Array(OTP_LENGTH).fill(''));
        setTimer(RESEND_TIMER);
        inputs.current[0]?.focus();

        console.log('[OTP] Resending OTP for phone', phone, '— local fallback:', newOtp);

        // Try backend send-otp
        let sentViaServer = false;
        try {
            const res = await apiCall('/auth/send-otp', {
                method: 'POST',
                body: { mobile: phone },
            });

            // ✅ Use server's devOtp if provided
            if (res?.devOtp) {
                newOtp = String(res.devOtp);
                console.log('[OTP] Resend — using server devOtp:', newOtp);
            }
            sentViaServer = true;
            console.log('[OTP] Resend via server success');
        } catch (err: any) {
            console.log('[OTP] Resend via server failed, using local OTP:', err.message);
        }

        // Update the OTP we verify against
        setCurrentOtp(newOtp);

        if (!sentViaServer) {
            Alert.alert(
                '📱 OTP Resent',
                `Your new OTP is: ${newOtp}\n\n(SMS not configured on server, showing here for testing.)`,
                [{ text: 'OK' }]
            );
        }
    }, [phone]);

    // ─── Authenticate with backend after OTP is verified ─────────────────
    const authenticateWithBackend = async (enteredOtp: string) => {
        const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
        // Email derived from phone — matches the /auth/register pattern
        const artistEmail = `artist_${cleanPhone}@makeupseven.com`;

        // ── Step 1: Call /auth/verify-otp to confirm identity ──────────────
        let verifyToken: string | null = null;
        let verifiedUserRole: string | null = null;
        try {
            console.log('[Auth] Calling /auth/verify-otp for mobile:', cleanPhone);
            const verifyRes = await apiCall('/auth/verify-otp', {
                method: 'POST',
                body: { mobile: cleanPhone, otp: enteredOtp, role: 'ARTIST' },
            });
            verifyToken = verifyRes?.token || verifyRes?.data?.token || null;
            verifiedUserRole = verifyRes?.user?.role || verifyRes?.data?.user?.role || null;
            console.log('[Auth] /auth/verify-otp returned role:', verifiedUserRole);
        } catch (verifyErr: any) {
            console.log('[Auth] /auth/verify-otp failed:', verifyErr.message);
        }

        // ── Step 2: If verify-otp gave us an ARTIST token, done ────────────
        if (verifyToken && verifiedUserRole === 'ARTIST') {
            console.log('[Auth] Got ARTIST token directly from verify-otp ✅');
            await login(verifyToken);
            return;
        }

        // ── Step 3: Try register as ARTIST with phone-based email ───────────
        // (This is phone number user trying to become an artist)
        try {
            console.log('[Auth] Registering as ARTIST with email:', artistEmail);
            const regRes = await apiCall('/auth/register', {
                method: 'POST',
                body: {
                    mobile: cleanPhone,
                    name: `Artist_${cleanPhone.slice(-4)}`,
                    email: artistEmail,
                    password: 'password123',
                    role: 'ARTIST',
                },
            });
            console.log('[Auth] Register response:', regRes?.message);
        } catch (regErr: any) {
            console.log('[Auth] Register attempt:', regErr.message);
            // "already exists" is fine — account may already exist, try login below
        }

        // ── Step 4: Login with the ARTIST email + password ──────────────────
        try {
            console.log('[Auth] Logging in as ARTIST:', artistEmail);
            const loginRes = await apiCall('/auth/login', {
                method: 'POST',
                body: { identifier: artistEmail, password: 'password123' },
            });
            const token = loginRes?.token || loginRes?.data?.token;
            if (token) {
                console.log('[Auth] Artist login success ✅');
                await login(token);
                return;
            }
        } catch (loginErr: any) {
            console.log('[Auth] Artist email login failed:', loginErr.message);
        }

        // ── Step 5: Try login with mobile as identifier ─────────────────────
        try {
            console.log('[Auth] Trying login with mobile number:', cleanPhone);
            const mobileLoginRes = await apiCall('/auth/login', {
                method: 'POST',
                body: { identifier: cleanPhone, password: 'password123' },
            });
            const token = mobileLoginRes?.token || mobileLoginRes?.data?.token;
            if (token) {
                console.log('[Auth] Mobile login success ✅');
                await login(token);
                return;
            }
        } catch (mobileErr: any) {
            console.log('[Auth] Mobile login failed:', mobileErr.message);
        }

        // ── Step 6: Fallback — use verify-otp token even if USER role ───────
        if (verifyToken) {
            console.log('[Auth] Using verify-otp token as last resort (role may be USER)');
            await login(verifyToken);
            return;
        }

        throw new Error('Authentication failed. Please try again or contact support.');
    };

    // ─── Verify OTP ──────────────────────────────────────────────────────
    const handleVerify = async () => {
        const enteredOtp = otp.join('');

        if (enteredOtp.length < OTP_LENGTH) {
            Alert.alert('Incomplete OTP', 'Please enter all 4 digits of the OTP.');
            return;
        }

        // Validate OTP
        if (enteredOtp !== currentOtp) {
            Alert.alert(
                'Invalid OTP ❌',
                'The OTP you entered is incorrect. Please check and try again.'
            );
            return;
        }

        try {
            setLoading(true);
            console.log('[Auth] OTP verified successfully for phone:', phone);
            await authenticateWithBackend(enteredOtp);
        } catch (e: any) {
            console.error('[Auth] Authentication failed:', e);
            Alert.alert(
                'Login Failed',
                e.message || 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const isOtpComplete = otp.every(digit => digit !== '');

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
                    We've sent an OTP to +91 {phone || 'XXXXXXXXXX'}
                </Text>

                {/* OTP Inputs */}
                <View style={styles.otpRow}>
                    {otp.map((value, index) => (
                        <TextInput
                            key={index}
                            ref={ref => { inputs.current[index] = ref; }}
                            style={styles.otpInput}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={value}
                            onChangeText={text => handleChange(text, index)}
                            autoFocus={index === 0}
                        />
                    ))}
                </View>

                {/* Timer & Resend */}
                <View style={styles.timerRow}>
                    {timer > 0 ? (
                        <Text style={styles.timerText}>
                            Retry OTP in{' '}
                            <Text style={styles.timerCount}>
                                00:{timer < 10 ? `0${timer}` : timer}
                            </Text>
                        </Text>
                    ) : (
                        <TouchableOpacity onPress={handleResend}>
                            <Text style={styles.resendText}>Resend OTP</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Confirm Button */}
                <TouchableOpacity
                    style={[
                        styles.confirmBtn,
                        (!isOtpComplete || loading) && styles.disabledBtn,
                    ]}
                    onPress={handleVerify}
                    disabled={!isOtpComplete || loading}
                >
                    {loading ? (
                        <ActivityIndicator color={Colors.white} />
                    ) : (
                        <Text style={styles.confirmText}>Confirm</Text>
                    )}
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
        bottom: verticalScale(10),
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
        alignSelf: 'flex-start',
    },

    logosty: {
        width: '100%',
        height: '100%',
    },

    content: {
        flex: 1,
        paddingHorizontal: scale(24),
        paddingTop: verticalScale(24),
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

    timerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(20),
    },

    timerText: {
        fontSize: scale(14),
        color: Colors.text,
    },

    resendText: {
        fontSize: scale(14),
        color: Colors.primary,
        fontWeight: 'bold',
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
