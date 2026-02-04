import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenView from '../utils/ScreenView';

const CourseCheckoutScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    // Assume course details are passed via route params, or use a default/placeholder for now
    const course = route.params?.course || {
        title: 'Advanced Bridal Makeup Techniques',
        academy: 'MakeupSeven Academy',
        price: 1499,
        image: require('../asset/images/artists1.png'),
    };

    const platformFee = 0;
    const tax = Math.round(course.price * 0.18);
    const totalAmount = course.price + platformFee + tax;

    const [selectedMethod, setSelectedMethod] = useState('UPI');

    return (
        <ScreenView style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={20} color="#7C3AED" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Booking details</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Course Summary Card */}
                <View style={styles.summaryCard}>
                    <Text style={styles.cardHeaderLabel}>Course Purchase</Text>

                    <View style={styles.courseRow}>
                        <Image source={course.image} style={styles.courseImage} resizeMode="cover" />
                        <View style={styles.courseInfo}>
                            <Text style={styles.courseTitle}>{course.title}</Text>
                            <Text style={styles.academyName}>{course.academy}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.costRow}>
                        <Text style={styles.costLabel}>Platform Fee</Text>
                        <Text style={styles.costValue}>₹{platformFee}</Text>
                    </View>
                    <View style={styles.costRow}>
                        <Text style={styles.costLabel}>Course Price</Text>
                        <Text style={styles.costValue}>₹{course.price}</Text>
                    </View>
                    <View style={styles.costRow}>
                        <Text style={styles.costLabel}>Tax (18% GST)</Text>
                        <Text style={styles.costValue}>₹{tax}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>₹{totalAmount}</Text>
                    </View>
                </View>

                {/* Payment Methods */}
                <Text style={styles.sectionTitle}>Select Payment Method</Text>

                {/* UPI Option */}
                <TouchableOpacity
                    style={[styles.paymentOption, selectedMethod === 'UPI' && styles.paymentOptionSelected]}
                    onPress={() => setSelectedMethod('UPI')}
                >
                    <View style={styles.paymentRow}>
                        <View style={[styles.methodIconBox, { backgroundColor: '#7C3AED' }]}>
                            <FontAwesome name="bank" size={18} color="#fff" />
                        </View>
                        <View style={styles.methodInfo}>
                            <Text style={styles.methodTitle}>UPI</Text>
                            <Text style={styles.methodSubtitle}>Pay using UPI ID</Text>
                        </View>
                        {selectedMethod === 'UPI' && (
                            <FontAwesome name="check-circle" size={20} color="#7C3AED" />
                        )}
                    </View>
                </TouchableOpacity>

                {/* Card Option */}
                <TouchableOpacity
                    style={[styles.paymentOption, selectedMethod === 'Card' && styles.paymentOptionSelected]}
                    onPress={() => setSelectedMethod('Card')}
                >
                    <View style={styles.paymentRow}>
                        <View style={[styles.methodIconBox, { backgroundColor: '#F3F4F6' }]}>
                            <FontAwesome name="credit-card" size={16} color="#4B5563" />
                        </View>
                        <View style={styles.methodInfo}>
                            <Text style={styles.methodTitle}>Credit / Debit Card</Text>
                            <Text style={styles.methodSubtitle}>Visa, Mastercard, RuPay</Text>
                        </View>
                        {selectedMethod === 'Card' && (
                            <FontAwesome name="check-circle" size={20} color="#7C3AED" />
                        )}
                    </View>
                </TouchableOpacity>

                {/* Wallet Option */}
                <TouchableOpacity
                    style={[styles.paymentOption, selectedMethod === 'Wallet' && styles.paymentOptionSelected]}
                    onPress={() => setSelectedMethod('Wallet')}
                >
                    <View style={styles.paymentRow}>
                        <View style={[styles.methodIconBox, { backgroundColor: '#F3F4F6' }]}>
                            <FontAwesome name="google-wallet" size={16} color="#4B5563" />
                        </View>
                        <View style={styles.methodInfo}>
                            <Text style={styles.methodTitle}>Digital Wallets</Text>
                            <Text style={styles.methodSubtitle}>Paytm, PhonePe, Google Pay</Text>
                        </View>
                        {selectedMethod === 'Wallet' && (
                            <FontAwesome name="check-circle" size={20} color="#7C3AED" />
                        )}
                    </View>
                </TouchableOpacity>

                {/* Secure Badge */}
                <View style={styles.secureBadge}>
                    <FontAwesome name="shield" size={18} color="#10B981" />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.secureTitle}>Secure Payment</Text>
                        <Text style={styles.secureSubtitle}>256-bit SSL encrypted transaction</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Footer Pay Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.payButton}
                    onPress={() => navigation.navigate('PaymentSuccess', {
                        transactionId: 'TXN' + Math.floor(Math.random() * 100000000),
                        course: { ...course, price: totalAmount },
                        paymentMethod: selectedMethod === 'Card' ? 'Credit Card' : selectedMethod
                    })}
                >
                    <Text style={styles.payButtonText}>Pay ₹{totalAmount}</Text>
                </TouchableOpacity>
            </View>

        </ScreenView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Light gray background
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#EDE4FF', // Lavender header background
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#7C3AED',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },

    // Summary Card
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1, // As per image border looks purposeful
        borderColor: '#7C3AED', // Purple border
        marginBottom: 24,
    },
    cardHeaderLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 12,
    },
    courseRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    courseImage: {
        width: 80,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#ccc',
    },
    courseInfo: {
        marginLeft: 12,
        flex: 1,
        justifyContent: 'center',
    },
    courseTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    academyName: {
        fontSize: 12,
        color: '#6B7280',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 12,
    },
    costRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    costLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    costValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#7C3AED',
    },

    // Payment Section
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    paymentOption: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    paymentOptionSelected: {
        borderColor: '#7C3AED',
        borderWidth: 1.5,
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    methodIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    methodInfo: {
        flex: 1,
        marginLeft: 12,
    },
    methodTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    methodSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },

    // Secure Badge
    secureBadge: {
        backgroundColor: '#ECFDF5', // Light green
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#D1FAE5',
    },
    secureTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#065F46',
    },
    secureSubtitle: {
        fontSize: 11,
        color: '#10B981',
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    payButton: {
        backgroundColor: '#7C3AED',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    payButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default CourseCheckoutScreen;
