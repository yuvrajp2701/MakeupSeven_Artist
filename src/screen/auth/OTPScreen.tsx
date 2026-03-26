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
    Modal,
    KeyboardAvoidingView,
    Platform,
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

    // ── Name collection step ──────────────────────────────────────────────
    const [showNameModal, setShowNameModal] = useState(false);
    const [artistName, setArtistName] = useState('');
    const [nameLoading, setNameLoading] = useState(false);
    // temporarily store the verified OTP while waiting for name entry
    const verifiedOtpRef = useRef<string>('');

    const inputs = useRef<Array<TextInput | null>>([]);
    const { login } = useAuth();

    // ─── Timer countdown ─────────────────────────────────────────────────
    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => setTimer(t => t - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    // ─── OTP input handler ────────────────────────────────────────────────
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

    // ─── Resend OTP ───────────────────────────────────────────────────────
    const handleResend = useCallback(async () => {
        let newOtp = generateNewOtp();
        setOtp(Array(OTP_LENGTH).fill(''));
        setTimer(RESEND_TIMER);
        inputs.current[0]?.focus();

        console.log('[OTP] Resending OTP for phone', phone, '— local fallback:', newOtp);

        let sentViaServer = false;
        try {
            const res = await apiCall('/auth/send-otp', {
                method: 'POST',
                body: { mobile: phone },
            });

            if (res?.devOtp) {
                newOtp = String(res.devOtp);
                console.log('[OTP] Resend — using server devOtp:', newOtp);
            }
            sentViaServer = true;
            console.log('[OTP] Resend via server success');
        } catch (err: any) {
            console.log('[OTP] Resend via server failed, using local OTP:', err.message);
        }

        setCurrentOtp(newOtp);

        if (!sentViaServer) {
            Alert.alert(
                '📱 OTP Resent',
                `Your new OTP is: ${newOtp}\n\n(SMS not configured on server, showing here for testing.)`,
                [{ text: 'OK' }]
            );
        }
    }, [phone]);

    // ─── Authenticate with backend after name is collected ────────────────
    const authenticateWithBackend = async (enteredOtp: string, name: string) => {
        const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
        const derivedEmail = `artist_${cleanPhone}@makeupseven.com`;

        // ── Step 1: Verify OTP ─────────────────────────────────────────────
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

        // ── Step 2: If verify-otp gave us an ARTIST token, done ───────────
        if (verifyToken && (verifiedUserRole === 'ARTIST' || verifiedUserRole === 'SERVICE_PROVIDER')) {
            console.log('[Auth] Got ARTIST token directly from verify-otp ✅');
            try {
                // Update name in profile as requested
                await apiCall('/service-providers/profile', {
                    method: 'PATCH',
                    token: verifyToken,
                    body: { name: name }
                });
                console.log('[Auth] Profile name updated successfully');
            } catch (e: any) {
                console.warn('[Auth] Profile name update failed:', e.message);
            }
            await login(verifyToken);
            return;
        }

        // ── Step 3: Register as ARTIST with user-provided name ────────────
        try {
            console.log('[Auth] Registering as ARTIST — name:', name, ', email:', derivedEmail);
            const regRes = await apiCall('/auth/register', {
                method: 'POST',
                body: {
                    mobile: cleanPhone,
                    name: name,           // ← user-entered name
                    email: derivedEmail,
                    password: 'password123',
                    role: 'ARTIST',
                },
            });
            console.log('[Auth] Register response:', regRes?.message);
        } catch (regErr: any) {
            console.log('[Auth] Register attempt:', regErr.message);
            // "already exists" is fine — try login below
        }

        // ── Step 4: Login with the ARTIST email + password ────────────────
        try {
            console.log('[Auth] Logging in as ARTIST:', derivedEmail);
            const loginRes = await apiCall('/auth/login', {
                method: 'POST',
                body: { identifier: derivedEmail, password: 'password123' },
            });
            const token = loginRes?.token || loginRes?.data?.token;
            if (token) {
                console.log('[Auth] Artist login success ✅');
                try {
                    // Update name in profile as requested
                    await apiCall('/service-providers/profile', {
                        method: 'PATCH',
                        token: token,
                        body: { name: name }
                    });
                    console.log('[Auth] Profile name updated successfully after login');
                } catch (e: any) {
                    console.warn('[Auth] Profile name update failed after login:', e.message);
                }
                await login(token);
                return;
            }
        } catch (loginErr: any) {
            console.log('[Auth] Artist email login failed:', loginErr.message);
        }

        // ── Step 5: Try login with mobile as identifier ───────────────────
        try {
            console.log('[Auth] Trying login with mobile number:', cleanPhone);
            const mobileLoginRes = await apiCall('/auth/login', {
                method: 'POST',
                body: { identifier: cleanPhone, password: 'password123' },
            });
            const token = mobileLoginRes?.token || mobileLoginRes?.data?.token;
            if (token) {
                console.log('[Auth] Mobile login success ✅');
                try {
                    // Update name in profile as requested
                    await apiCall('/service-providers/profile', {
                        method: 'PATCH',
                        token: token,
                        body: { name: name }
                    });
                    console.log('[Auth] Profile name updated successfully after mobile login');
                } catch (e: any) {
                    console.warn('[Auth] Profile name update failed after mobile login:', e.message);
                }
                await login(token);
                return;
            }
        } catch (mobileErr: any) {
            console.log('[Auth] Mobile login failed:', mobileErr.message);
        }

        // ── Step 6: Fallback — use verify-otp token even if USER role ─────
        if (verifyToken) {
            console.log('[Auth] Using verify-otp token as last resort (role may be USER)');
            await login(verifyToken);
            return;
        }

        throw new Error('Authentication failed. Please try again or contact support.');
    };

    // ─── Step 1: Verify OTP locally, then show name modal ─────────────────
    const handleVerify = async () => {
        const enteredOtp = otp.join('');

        if (enteredOtp.length < OTP_LENGTH) {
            Alert.alert('Incomplete OTP', 'Please enter all 4 digits of the OTP.');
            return;
        }

        if (enteredOtp !== currentOtp) {
            Alert.alert(
                'Invalid OTP ❌',
                'The OTP you entered is incorrect. Please check and try again.'
            );
            return;
        }

        // OTP is correct — save it and open the name modal
        verifiedOtpRef.current = enteredOtp;
        setShowNameModal(true);
    };

    // ─── Step 2: Confirm name → authenticate → go to dashboard ───────────
    const handleNameConfirm = async () => {
        const trimmedName = artistName.trim();
        if (!trimmedName || trimmedName.length < 2) {
            Alert.alert('Name Required', 'Please enter your full name (at least 2 characters).');
            return;
        }

        try {
            setNameLoading(true);
            console.log('[Auth] OTP verified for phone:', phone, '— proceeding with name:', trimmedName);
            await authenticateWithBackend(verifiedOtpRef.current, trimmedName);
            // login() will update userToken → AppNavigator switches to Artist screens automatically
        } catch (e: any) {
            console.error('[Auth] Authentication failed:', e);
            Alert.alert(
                'Login Failed',
                e.message || 'Something went wrong. Please try again.'
            );
        } finally {
            setNameLoading(false);
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

                {/* Testing Hint */}
                <Text style={{ textAlign: 'center', color: Colors.primary, marginBottom: 15, fontSize: 13 }}>
                    💡 For testing purposes, please use the OTP: 1234
                </Text>


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

            {/* ── Name Collection Modal ───────────────────────────────────── */}
            <Modal
                visible={showNameModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowNameModal(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.modalCard}>
                        {/* Wave accent */}
                        <LinearGradient
                            colors={[Colors.primary, Colors.secondary]}
                            style={styles.modalAccent}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        />

                        <Text style={styles.modalTitle}>What's your name? 👋</Text>
                        <Text style={styles.modalSub}>
                            This will be displayed on your artist dashboard and profile.
                        </Text>

                        <TextInput
                            style={styles.nameInput}
                            placeholder="Enter your full name"
                            placeholderTextColor="#9CA3AF"
                            value={artistName}
                            onChangeText={setArtistName}
                            autoFocus
                            returnKeyType="done"
                            onSubmitEditing={handleNameConfirm}
                            maxLength={50}
                        />

                        <TouchableOpacity
                            style={[
                                styles.nameConfirmBtn,
                                (nameLoading || artistName.trim().length < 2) && styles.disabledBtn,
                            ]}
                            onPress={handleNameConfirm}
                            disabled={nameLoading || artistName.trim().length < 2}
                            activeOpacity={0.85}
                        >
                            {nameLoading ? (
                                <ActivityIndicator color={Colors.white} />
                            ) : (
                                <Text style={styles.nameConfirmText}>Continue to Dashboard →</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
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

    // ── Name Modal ────────────────────────────────────────────────────────
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'flex-end',
    },

    modalCard: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: moderateScale(28),
        borderTopRightRadius: moderateScale(28),
        paddingHorizontal: scale(24),
        paddingBottom: verticalScale(36),
        paddingTop: 0,
        overflow: 'hidden',
    },

    modalAccent: {
        height: scale(5),
        width: scale(60),
        borderRadius: scale(4),
        alignSelf: 'center',
        marginVertical: verticalScale(14),
    },

    modalTitle: {
        fontSize: scale(22),
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: verticalScale(6),
        textAlign: 'center',
    },

    modalSub: {
        fontSize: scale(13),
        color: Colors.text,
        textAlign: 'center',
        marginBottom: verticalScale(24),
        lineHeight: scale(19),
    },

    nameInput: {
        width: '100%',
        height: verticalScale(52),
        borderWidth: 1.5,
        borderColor: Colors.primary,
        borderRadius: moderateScale(12),
        paddingHorizontal: scale(16),
        fontSize: scale(16),
        color: Colors.black,
        backgroundColor: Colors.inputBackground,
        marginBottom: verticalScale(20),
    },

    nameConfirmBtn: {
        backgroundColor: Colors.primary,
        borderRadius: moderateScale(12),
        paddingVertical: verticalScale(15),
        alignItems: 'center',
    },

    nameConfirmText: {
        fontSize: scale(17),
        fontWeight: 'bold',
        color: Colors.white,
        letterSpacing: 0.3,
    },
});
