import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


const NOTIFICATIONS = [
    {
        id: '1',
        type: 'booking_req',
        title: 'New Booking Request',
        message: 'Sarah Johnson wants to book Wedding Makeup for Dec 15',
        time: '2 min ago',
        unread: true,
        icon: 'event',
        color: '#8855FF', // Purple
        bgColor: '#F3EFFF',
    },
    {
        id: '2',
        type: 'booking_conf',
        title: 'Booking Confirmed',
        message: 'Emily Davis confirmed the booking for Bridal Hair Styling',
        time: '1 hour ago',
        unread: true,
        icon: 'check-circle',
        color: '#00C853', // Green
        bgColor: '#E8F5E9',
    },
    {
        id: '3',
        type: 'payment',
        title: 'Payment Received',
        message: '$200 has been credited to your wallet for Photoshoot Makeup',
        time: '3 hours ago',
        unread: true,
        icon: 'attach-money',
        color: '#00C853', // Green
        bgColor: '#E8F5E9',
    },
    {
        id: '4',
        type: 'review',
        title: 'New Review',
        message: 'Jessica Miller left you a 5-star review',
        time: '5 hours ago',
        unread: false,
        icon: 'star',
        color: '#FFAB00', // Amber
        bgColor: '#FFF8E1',
    },
    {
        id: '5',
        type: 'processing',
        title: 'Payment Processing',
        message: '$450 from Bridal Makeup is being processed',
        time: '1 day ago',
        unread: false,
        icon: 'access-time',
        color: '#2962FF', // Blue
        bgColor: '#E3F2FD',
    },
    {
        id: '6',
        type: 'alert',
        title: 'Upcoming Service',
        message: 'You have a booking tomorrow at 2:00 PM with Emily Davis',
        time: '1 day ago',
        unread: false,
        icon: 'error-outline',
        color: '#FF6D00', // Orange
        bgColor: '#FFF3E0',
    },
    {
        id: '7',
        type: 'profile',
        title: 'Profile Views',
        message: 'Your portfolio was viewed 15 times this week',
        time: '2 days ago',
        unread: false,
        icon: 'person-outline',
        color: '#AA00FF', // Purple accent
        bgColor: '#F3E5F5',
    },
    {
        id: '8',
        type: 'offer',
        title: 'Special Offer',
        message: 'Boost your profile visibility for 20% off this weekend',
        time: '3 days ago',
        unread: false,
        icon: 'card-giftcard',
        color: '#F50057', // Pink
        bgColor: '#FCE4EC',
    },
];

const FILTERS = ['All', 'Bookings', 'Payments', 'Reviews'];

const ArtistNotificationScreen = ({ navigation }: any) => {
    const [selectedFilter, setSelectedFilter] = useState('All');

    const renderItem = ({ item }: { item: typeof NOTIFICATIONS[0] }) => (
        <View style={styles.notificationCard}>
            <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
                <Icon name={item.icon} size={24} color={item.color} />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    {item.unread && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{item.time}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F3EFFF" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#555" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notification</Text>
                <TouchableOpacity style={styles.markReadButton}>
                    <Icon name="done-all" size={24} color="#8855FF" />
                </TouchableOpacity>
            </View>

            {/* Filters */}
            <View style={styles.filterContainer}>
                <FlatList
                    horizontal
                    data={FILTERS}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.filterChip,
                                selectedFilter === item && styles.activeFilterChip
                            ]}
                            onPress={() => setSelectedFilter(item)}
                        >
                            <Text style={[
                                styles.filterText,
                                selectedFilter === item && styles.activeFilterText
                            ]}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* List */}
            <FlatList
                data={NOTIFICATIONS}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#F3EFFF', // Light purple header bg
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#8855FF',
    },
    markReadButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterContainer: {
        paddingVertical: 16,
        backgroundColor: '#fff',
    },
    filterChip: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        marginRight: 10,
    },
    activeFilterChip: {
        backgroundColor: '#8855FF',
    },
    filterText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    activeFilterText: {
        color: '#fff',
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
        gap: 16,
    },
    notificationCard: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 0,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        // Elevation for Android
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        flex: 1,
        marginRight: 8,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#8855FF',
        marginTop: 6,
    },
    message: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
        marginBottom: 8,
    },
    time: {
        fontSize: 12,
        color: '#999',
    },
});

export default ArtistNotificationScreen;
