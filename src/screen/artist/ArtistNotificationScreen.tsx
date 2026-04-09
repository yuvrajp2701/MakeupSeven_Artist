import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SectionList, SafeAreaView, StatusBar, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { apiCall } from '../../services/api';
import { getToken } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import ScreenView from '../../utils/ScreenView';

const FILTERS = ['All', 'Bookings', 'Payments', 'Reviews'];

const ArtistNotificationScreen = ({ navigation }: any) => {
    const { userToken } = useAuth();
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const token = userToken || await getToken();
            if (!token) return;

            const filterParam = selectedFilter.toLowerCase();
            const response = await apiCall(`/notifications?filter=${filterParam}`, { method: 'GET', token });

            let list: any[] = [];
            if (response && typeof response === 'object' && !Array.isArray(response) && (response.Today || response.Yesterday || response.Earlier)) {
                if (response.Today?.length > 0) list.push({ title: 'Today', data: response.Today });
                if (response.Yesterday?.length > 0) list.push({ title: 'Yesterday', data: response.Yesterday });
                if (response.Earlier?.length > 0) list.push({ title: 'Earlier', data: response.Earlier });
            } else {
                const flatList = Array.isArray(response) ? response : (response?.data || response?.notifications || []);
                if (flatList.length > 0) list = [{ title: 'All Notifications', data: flatList }];
            }
            setNotifications(list);
        } catch (error) {
            console.log('[Notifications] Error fetching notifications', error);
        } finally {
            setLoading(false);
        }
    }, [userToken, selectedFilter]);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const token = userToken || await getToken();
            if (!token) return;

            const response = await apiCall('/notifications/unread-count', { method: 'GET', token });
            setUnreadCount(response?.count || response?.unreadCount || response?.data?.count || 0);
        } catch (error) {
            console.log('[Notifications] Error fetching unread count', error);
        }
    }, [userToken]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        fetchUnreadCount();
    }, [fetchUnreadCount, notifications]);

    const handleMarkRead = async (id: string, currentUnread: boolean) => {
        if (!currentUnread) return;
        try {
            const token = userToken || await getToken();
            if (!token) return;

            await apiCall(`/notifications/${id}/read`, { method: 'PATCH', token });
            setNotifications(prev => prev.map(section => ({
                ...section,
                data: section.data.map((n: any) => {
                    const nId = n.id || n._id;
                    return nId === id ? { ...n, isRead: true, unread: false } : n;
                })
            })));
            fetchUnreadCount();
        } catch (error) {
            console.log('Error marking notification read', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const token = userToken || await getToken();
            if (!token) return;

            setLoading(true);
            await apiCall('/notifications/read-all', { method: 'PATCH', token });
            await fetchNotifications();
            fetchUnreadCount();
        } catch (error) {
            console.log('Error marking all read', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        Alert.alert('Delete Notification', 'Are you sure you want to delete this notification?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const token = userToken || await getToken();
                        if (!token) return;

                        await apiCall(`/notifications/${id}`, { method: 'DELETE', token });
                        setNotifications(prev => prev.map(section => ({
                            ...section,
                            data: section.data.filter((n: any) => {
                                const nId = n.id || n._id;
                                return nId !== id;
                            })
                        })).filter(section => section.data.length > 0));
                        fetchUnreadCount();
                    } catch (error) {
                        console.log('Error deleting notification', error);
                    }
                }
            }
        ]);
    };

    const renderItem = ({ item }: { item: any }) => {
        const isUnread = item.unread !== undefined ? item.unread : (item.isRead === false);
        const iconName = item.icon || (item.type === 'booking' ? 'calendar-today' : item.type === 'payment' ? 'attach-money' : item.type === 'review' ? 'star' : 'notifications');
        const bgColor = item.bgColor || (item.type === 'payment' ? '#E8F5E9' : '#E3F2FD');
        const color = item.color || (item.type === 'payment' ? '#00C853' : '#2962FF');
        // Handle potentially missing time values
        const timeString = item.time || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now');
        const nId = item.id || item._id;

        return (
            <TouchableOpacity
                style={styles.notificationCard}
                onPress={() => handleMarkRead(nId, isUnread)}
                activeOpacity={0.7}
            >
                <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
                    <Icon name={iconName} size={24} color={color} />
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                        <View style={styles.rightHeaderAction}>
                            {isUnread && <View style={styles.unreadDot} />}
                            <TouchableOpacity onPress={() => handleDelete(nId)} style={styles.deleteButton}>
                                <Icon name="close" size={18} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={styles.message}>{item.body || item.message || item.description}</Text>
                    <Text style={styles.time}>{timeString}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScreenView>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#F3EFFF" />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={24} color="#555" />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.headerTitle}>Notifications</Text>
                        {unreadCount > 0 && <Text style={styles.unreadCountText}>{unreadCount} Unread</Text>}
                    </View>
                    <TouchableOpacity style={styles.markReadButton} onPress={handleMarkAllRead}>
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
                <SectionList
                    sections={notifications}
                    keyExtractor={(item, index) => (item.id || item._id || index).toString()}
                    renderItem={renderItem}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.sectionHeader}>{title}</Text>
                    )}
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
        </ScreenView>
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
        paddingVertical: 30,
        backgroundColor: '#F3EFFF',
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
    unreadCountText: {
        fontSize: 12,
        color: '#8855FF',
        fontWeight: '600',
        marginTop: 2,
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
    sectionHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginTop: 8,
        marginBottom: 4,
    },
    notificationCard: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
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
    rightHeaderAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#8855FF',
    },
    deleteButton: {
        padding: 2,
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
