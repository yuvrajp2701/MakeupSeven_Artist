import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { apiCall } from '../../services/api';
import { getToken } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';


const NOTIFICATIONS_DEFAULT = [
    {
        id: '1',
        type: 'alert',
        title: 'Welcome to MakeupSeven',
        message: 'Start by completing your artist profile to get more bookings.',
        time: 'Just now',
        unread: true,
        icon: 'stars',
        color: '#8855FF',
        bgColor: '#F3EFFF',
    }
];

const FILTERS = ['All', 'Bookings', 'Payments', 'Reviews'];

const ArtistNotificationScreen = ({ navigation }: any) => {
    const { userToken } = useAuth();
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<any[]>(NOTIFICATIONS_DEFAULT);

    const fetchNotifications = React.useCallback(async () => {
        try {
            setLoading(true);
            const token = userToken || await getToken();
            if (!token) return;

            // Using ledger as a proxy for notifications since there's no explicit notification API
            const response = await apiCall('/reward/user/wallet/ledger', { method: 'GET', token });
            const list = Array.isArray(response) ? response : (response?.ledger || response?.data || []);

            if (list.length > 0) {
                const mapped = list.map((item: any) => ({
                    id: item.id || item._id,
                    type: item.type === 'credit' ? 'payment' : 'processing',
                    title: item.title || (item.type === 'credit' ? 'Payment Received' : 'Transaction'),
                    message: item.description || (item.type === 'credit' ? `You earned ₹${item.points || item.amount}` : 'Transaction processed'),
                    time: new Date(item.createdAt).toLocaleDateString(),
                    unread: false,
                    icon: item.type === 'credit' ? 'attach-money' : 'access-time',
                    color: item.type === 'credit' ? '#00C853' : '#2962FF',
                    bgColor: item.type === 'credit' ? '#E8F5E9' : '#E3F2FD',
                }));
                // Combine with default welcome message
                setNotifications([...NOTIFICATIONS_DEFAULT, ...mapped]);
            }
        } catch (error) {
            // Ledger 404 means no transactions yet, which is normal for new users
            console.log('[Notifications] Ledger info not available yet (normal for new users)');
            setNotifications(NOTIFICATIONS_DEFAULT);
        } finally {
            setLoading(false);
        }
    }, [userToken]);

    React.useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const renderItem = ({ item }: { item: any }) => (
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
                <TouchableOpacity style={styles.markReadButton} onPress={fetchNotifications}>
                    <Icon name="refresh" size={24} color="#8855FF" />
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
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshing={loading}
                onRefresh={fetchNotifications}
                ListEmptyComponent={
                    !loading ? (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <Text style={{ color: '#999' }}>No notifications found</Text>
                        </View>
                    ) : null
                }
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
