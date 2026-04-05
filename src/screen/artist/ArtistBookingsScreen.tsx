import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ScreenView from '../../utils/ScreenView';
import { apiCall } from '../../services/api';
import { getToken } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';

// Helper function to format address object to string
const formatAddress = (address: any): string => {
  if (!address) return 'Address not available';
  if (typeof address === 'string') return address;
  if (typeof address === 'object') {
    const parts = [
      address.street,
      address.city,
      address.state,
      address.pincode
    ].filter(part => part && typeof part === 'string' && part.trim().length > 0);
    return parts.length > 0 ? parts.join(', ') : 'Address not available';
  }
  return 'Address not available';
};

// Helper function to get status badge style
const getStatusStyle = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return styles.statusPending;
    case 'APPROVED':
      return styles.statusApproved;
    case 'STARTED':
      return styles.statusStarted;
    case 'COMPLETED':
      return styles.statusCompleted;
    case 'REJECTED':
    case 'CANCELLED':
    case 'CANCELLED_BY_ARTIST':
      return styles.statusCancelled;
    default:
      return styles.statusPending;
  }
};

// Helper function to get status text color
const getStatusTextStyle = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return styles.statusTextPending;
    case 'APPROVED':
      return styles.statusTextApproved;
    case 'STARTED':
      return styles.statusTextStarted;
    case 'COMPLETED':
      return styles.statusTextCompleted;
    case 'REJECTED':
    case 'CANCELLED':
    case 'CANCELLED_BY_ARTIST':
      return styles.statusTextCancelled;
    default:
      return styles.statusTextPending;
  }
};

// Booking Card Component
const BookingCard = ({ booking, onPress }: any) => {
  // Format the address safely before rendering
  const formattedAddress = formatAddress(booking.address);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(booking)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.bookingId}>#{booking.bookingID || booking.id || 'N/A'}</Text>
        <View style={[styles.statusBadge, getStatusStyle(booking.status)]}>
          <Text style={[styles.statusText, getStatusTextStyle(booking.status)]}>
            {booking.status || 'PENDING'}
          </Text>
        </View>
      </View>

      <View style={styles.customerInfo}>
        <FontAwesome name="user" size={16} color="#7C3AED" />
        <Text style={styles.customerName}>
          {booking.user?.name || booking.customerName || 'Customer'}
        </Text>
      </View>

      <View style={styles.serviceInfo}>
        <FontAwesome name="briefcase" size={16} color="#7C3AED" />
        <Text style={styles.serviceName}>
          {booking.service?.name || 'Service'}
        </Text>
      </View>

      <View style={styles.addressInfo}>
        <FontAwesome name="map-marker" size={16} color="#7C3AED" />
        <Text style={styles.address} numberOfLines={2}>
          {formattedAddress}
        </Text>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <FontAwesome name="calendar" size={14} color="#6B7280" />
          <Text style={styles.detailText}>
            {booking.bookingDate || 'N/A'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <FontAwesome name="clock-o" size={14} color="#6B7280" />
          <Text style={styles.detailText}>
            {booking.formattedTimeSlot || `${booking.startTime || 'N/A'} - ${booking.endTime || 'N/A'}`}
          </Text>
        </View>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Total Amount:</Text>
        <Text style={styles.priceValue}>₹{booking.totalPrice || booking.servicePrice || 0}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Main Screen Component
const ArtistBookingsScreen = () => {
  const navigation = useNavigation<any>();
  const { userToken } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, past

  const fetchBookings = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const token = userToken || await getToken();
      if (!token) return;

      const endpoint = activeTab === 'upcoming'
        ? '/booking/upcoming-bookings'
        : '/booking/past-bookings';

      console.log(`Fetching ${activeTab} bookings from:`, endpoint);

      const response = await apiCall(endpoint, { method: 'GET', token });

      // Handle different response structures
      let bookingsData = [];
      if (response?.data && Array.isArray(response.data)) {
        bookingsData = response.data;
      } else if (response?.bookings && Array.isArray(response.bookings)) {
        bookingsData = response.bookings;
      } else if (Array.isArray(response)) {
        bookingsData = response;
      } else {
        bookingsData = [];
      }

      console.log(`Fetched ${activeTab} Bookings:`, bookingsData.length);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [activeTab])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings(false);
  };

  const handleBookingPress = (booking: any) => {
    navigation.navigate('BookingDetails', booking);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="calendar-check-o" size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No {activeTab} bookings</Text>
      <Text style={styles.emptyText}>
        {activeTab === 'upcoming'
          ? "You don't have any upcoming bookings at the moment."
          : "You haven't completed any bookings yet."}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  if (loading && !refreshing) {
    return (
      <ScreenView>
        {renderHeader()}
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.loaderText}>Loading bookings...</Text>
        </View>
      </ScreenView>
    );
  }

  return (
    <ScreenView>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id || item.bookingID || Math.random().toString()}
        renderItem={({ item }) => (
          <BookingCard booking={item} onPress={handleBookingPress} />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7C3AED']} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </ScreenView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    backgroundColor: '#EEE9FF',
    paddingHorizontal: 26,
    paddingTop: 62,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#7C3AED',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#7C3AED',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusApproved: {
    backgroundColor: '#D1FAE5',
  },
  statusStarted: {
    backgroundColor: '#DBEAFE',
  },
  statusCompleted: {
    backgroundColor: '#D1FAE5',
  },
  statusCancelled: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextPending: {
    color: '#F59E0B',
  },
  statusTextApproved: {
    color: '#10B981',
  },
  statusTextStarted: {
    color: '#3B82F6',
  },
  statusTextCompleted: {
    color: '#059669',
  },
  statusTextCancelled: {
    color: '#EF4444',
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  serviceName: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  address: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
    lineHeight: 18,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7C3AED',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ArtistBookingsScreen;
