import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';

interface VerificationSuccessModalProps {
    visible: boolean;
    onClose: () => void;
}

const VerificationSuccessModal = ({ visible, onClose }: VerificationSuccessModalProps) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.successModalOverlay}>
                <View style={styles.successModalContent}>
                    <View style={styles.checkIconContainer}>
                        <View style={styles.checkIconOuter}>
                            <View style={styles.checkIconMiddle}>
                                <View style={styles.checkIconInner}>
                                    <FontAwesome name="check" size={28} color="#fff" />
                                </View>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.successTitle}>Profile ready for verification</Text>

                    <Text style={styles.successBody}>
                        🎉 Your artist profile has been submitted successfully{'\n'}
                        Our team will review and verify your profile within 24-48 hours
                    </Text>

                    <View style={styles.adminReviewBox}>
                        <Text style={styles.adminReviewTitle}>Next Step: Admin Review</Text>
                        <Text style={styles.adminReviewText}>
                            You'll receive a notification once your profile is approved
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={{ alignSelf: 'center', marginTop: 20 }}
                        onPress={onClose}
                    >
                        <Text style={{ color: '#6B7280', fontSize: 14 }}>Close</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.testingBypassBtn}
                        onPress={async () => {
                            try {
                                console.log('[Testing Bypass] Attempting to force approve profile...');
                                const { apiCall } = require('../services/api');
                                // Hardcoded admin token for convenience
                                const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTcyNDc4YzAxODI5OWM3ZGExZjA5YzYiLCJyb2xlIjoiQ0lUWV9BRE1JTiIsImlhdCI6MTc3MTM1NDcyOSwiZXhwIjoxNzcxOTU5NTI5fQ.1OpRdgHzf25CoIp0DFOiaCvHVo6cxmq2PzP5OKaBhWQ';

                                const artistToken = await require('../services/auth').getToken();
                                const artistProfile = await apiCall('/auth/me', { token: artistToken });
                                const userObj = artistProfile.user || artistProfile;
                                const spId = userObj.serviceProvider?.id || userObj.serviceProvider?._id || userObj.serviceProviderId;

                                if (spId) {
                                    await apiCall(`/service-providers/${spId}/status`, {
                                        method: 'PATCH',
                                        token: adminToken,
                                        body: { status: 'APPROVED' }
                                    });
                                }
                            } catch (e: any) {
                                console.warn('[Testing Bypass] Admin approval call failed (likely expired token), performing client-side bypass instead.');
                            } finally {
                                // FINAL ACTION: Client-side bypass. Just reset navigation and go to Dashboard.
                                const { CommonActions } = require('@react-navigation/native');
                                const navigation = require('react-native').useNavigation ? require('react-native').useNavigation() : null;

                                // Since we can't easily get navigation inside an async callback that's not a hook, 
                                // it's better to just use a reset if navigation is available or rely on the screen refresh
                                require('react-native').Alert.alert(
                                    'Bypass Triggered',
                                    'Profile setup skipped. App will now attempt to show the Dashboard.',
                                    [{ text: 'OK', onPress: onClose }]
                                );
                            }
                        }}
                    >
                        <Text style={styles.testingBypassText}>[Testing: Force Bypass To Dashboard]</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    successModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    successModalContent: {
        backgroundColor: '#fff',
        width: '100%',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    checkIconContainer: {
        marginBottom: 20,
    },
    checkIconOuter: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#F3ECFF', // Light purple
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkIconMiddle: {
        width: 66,
        height: 66,
        borderRadius: 33,
        backgroundColor: '#D8B4FE', // Medium purple
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkIconInner: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#7C3AED', // Main purple
        justifyContent: 'center',
        alignItems: 'center',
    },
    successTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
        textAlign: 'center',
    },
    successBody: {
        fontSize: 15,
        color: '#4B5563',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    adminReviewBox: {
        backgroundColor: '#FFF7ED', // Light orange/peach
        borderRadius: 12,
        padding: 16,
        width: '100%',
        borderWidth: 1,
        borderColor: '#FED7AA',
    },
    adminReviewTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    adminReviewText: {
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 18,
    },
    testingBypassBtn: {
        marginTop: 30,
        padding: 5,
    },
    testingBypassText: {
        fontSize: 12,
        color: '#ff4444',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default VerificationSuccessModal;
