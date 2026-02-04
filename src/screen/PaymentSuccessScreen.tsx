import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenView from '../utils/ScreenView';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const PaymentSuccessScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    // Default values if params are missing (for preview/dev)
    const transactionId = route.params?.transactionId || 'TXN54148532';
    const course = route.params?.course || {
        title: 'Advanced Bridal Makeup Techniques',
        academy: 'MakeupSeven Academy',
        price: 1769,
        image: require('../asset/images/artists1.png'),
    };
    const paymentMethod = route.params?.paymentMethod || 'Credit Card';
    const date = new Date().toLocaleString();

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

                {/* Success Icon */}
                <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <FontAwesome name="check" size={50} color="#fff" />
                    </View>
                </View>

                <Text style={styles.successTitle}>Payment Successful!</Text>
                <Text style={styles.successSubtitle}>Your course is now unlocked and ready to start</Text>

                {/* Receipt Card */}
                <View style={styles.receiptCard}>
                    <View style={styles.receiptRow}>
                        <Text style={styles.receiptLabel}>Transaction ID</Text>
                        <Text style={styles.receiptValue}>{transactionId}</Text>
                    </View>
                    <View style={styles.receiptRow}>
                        <Text style={styles.receiptLabel}>Course</Text>
                        <Text style={[styles.receiptValue, { flex: 1, textAlign: 'right', marginLeft: 20 }]}>{course.title}</Text>
                    </View>
                    <View style={styles.receiptRow}>
                        <Text style={styles.receiptLabel}>Amount Paid</Text>
                        <Text style={[styles.receiptValue, { color: '#7C3AED' }]}>₹{course.price}</Text>
                    </View>
                    <View style={styles.receiptRow}>
                        <Text style={styles.receiptLabel}>Payment Method</Text>
                        <Text style={styles.receiptValue}>{paymentMethod}</Text>
                    </View>
                    <View style={styles.receiptRow}>
                        <Text style={styles.receiptLabel}>Date & Time</Text>
                        <Text style={styles.receiptValue}>{date}</Text>
                    </View>
                </View>

                {/* Course Access Card */}
                <LinearGradient
                    colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.courseAccessCard}
                >
                    <View style={styles.courseHeader}>
                        <Image source={course.image} style={styles.courseThumb} />
                        <View style={styles.courseDetails}>
                            <Text style={styles.whiteTitle}>{course.title}</Text>
                            <Text style={styles.whiteSubtitle}>{course.academy}</Text>
                        </View>
                    </View>

                    <View style={styles.featuresRow}>
                        <View style={styles.featureItem}>
                            <FontAwesome name="book" size={14} color="#fff" style={{ marginBottom: 4 }} />
                            <Text style={styles.featureText}>12 Lessons</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <FontAwesome name="certificate" size={14} color="#fff" style={{ marginBottom: 4 }} />
                            <Text style={styles.featureText}>Certificate</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <FontAwesome name="check-circle" size={14} color="#fff" style={{ marginBottom: 4 }} />
                            <Text style={styles.featureText}>Lifetime</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.startBtn} onPress={() => navigation.navigate('CoursePlayer', { course })}>
                        <Text style={styles.startBtnText}>Start Learning Now</Text>
                    </TouchableOpacity>
                </LinearGradient>

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.actionBtn}>
                        <FontAwesome name="download" size={16} color="#111827" />
                        <Text style={styles.actionBtnText}>Download Receipt</Text>
                    </TouchableOpacity>
                    <View style={{ width: 16 }} />
                    <TouchableOpacity style={styles.actionBtn}>
                        <FontAwesome name="share-alt" size={16} color="#111827" />
                        <Text style={styles.actionBtnText}>Share</Text>
                    </TouchableOpacity>
                </View>

                {/* Email Info Box */}
                <View style={styles.emailInfoBox}>
                    <FontAwesome name="envelope" size={14} color="#9CA3AF" />
                    <Text style={styles.emailInfoText}>
                        Payment receipt has been sent to your email address
                    </Text>
                </View>

                <View style={{ height: 40 }} />

            </ScrollView>
        </ScreenView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#EDE4FF',
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
        padding: 20,
        alignItems: 'center',
    },
    iconContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#7C3AED',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    successTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
        textAlign: 'center',
    },
    successSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 30,
        textAlign: 'center',
    },
    receiptCard: {
        width: '100%',
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    receiptRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    receiptLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
    receiptValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#111827',
    },
    courseAccessCard: {
        width: '100%',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
    },
    courseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    courseThumb: {
        width: 80,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#ccc',
    },
    courseDetails: {
        marginLeft: 12,
        flex: 1,
    },
    whiteTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    whiteSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    featuresRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 12,
    },
    featureItem: {
        alignItems: 'center',
        flex: 1,
    },
    featureText: {
        color: '#fff',
        fontSize: 11,
    },
    startBtn: {
        backgroundColor: '#fff',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startBtnText: {
        color: '#7C3AED',
        fontWeight: '700',
        fontSize: 15,
    },
    actionRow: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 20,
    },
    actionBtn: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    actionBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    emailInfoBox: {
        flexDirection: 'row',
        backgroundColor: '#EFF6FF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    emailInfoText: {
        fontSize: 12,
        color: '#1E40AF',
        marginLeft: 10,
        flex: 1,
        textAlign: 'center',
    },
});

export default PaymentSuccessScreen;
