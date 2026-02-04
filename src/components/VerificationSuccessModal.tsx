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
});

export default VerificationSuccessModal;
