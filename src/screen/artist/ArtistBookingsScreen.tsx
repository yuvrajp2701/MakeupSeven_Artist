import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import ScreenView from '../../utils/ScreenView';
import { apiCall } from '../../services/api';
import { getToken } from '../../services/auth';
import { DUMMY_BOOKINGS } from '../../utils/dummyData';


const ArtistBookingsScreen = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      if (!token) {
        console.log('No token available, skipping fetch');
        setBookings([]);
        return;
      }

      const response = await apiCall('/booking', { method: 'GET', token });
      const data = Array.isArray(response) ? response : (response?.bookings || response?.data || []);

      console.log('Fetched Bookings:', data.length);
      // Fall back to dummy data when API returns nothing (dev / staging)
      setBookings(data.length > 0 ? data : DUMMY_BOOKINGS);
    } catch (error) {
      console.warn('Failed to fetch bookings, using dummy data:', error);
      setBookings(DUMMY_BOOKINGS); // Show dummy data on network error during dev
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBookings();
  }, []);

  const getFilteredBookings = () => {
    const now = new Date();
    return bookings.filter((booking: any) => {
      const bDate = booking.bookingDate || booking.date;
      const bookingDate = new Date(bDate);
      if (isNaN(bookingDate.getTime())) return false;

      const status = (booking.status || '').toUpperCase();
      const isActive = ['PENDING', 'CONFIRMED', 'APPROVED', 'STARTED'].includes(status);
      const isCompleted = ['COMPLETED', 'CANCELLED', 'REJECTED', 'CANCELLED_BY_ARTIST'].includes(status);

      if (activeTab === 'upcoming') {
        // Show future bookings OR any booking that is still active (not completed/cancelled) regardless of date
        const isFuture = bookingDate >= now;
        return (isFuture && !isCompleted) || isActive;
      } else {
        // Show past bookings that are NOT active, OR any explicitly completed/cancelled booking
        const isPast = bookingDate < now;
        return (isPast && !isActive) || isCompleted;
      }
    });
  };

  const filteredBookings = getFilteredBookings();

  return (
    <ScreenView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchBookings} />
        }
      >
        <View style={styles.container}>

          {/* Header */}
          <Text style={styles.title}>Bookings</Text>
          <Text style={styles.subTitle}>Manage your appointments</Text>

          {/* Tabs */}
          <View style={styles.tabContainer} >
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'upcoming' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('upcoming')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'upcoming' && styles.activeTabText,
                ]}
              >
                Upcoming ({bookings.filter(b => {
                  const d = new Date(b.bookingDate || b.date);
                  const status = (b.status || '').toUpperCase();
                  const isActive = ['PENDING', 'CONFIRMED', 'APPROVED', 'STARTED'].includes(status);
                  const isCompleted = ['COMPLETED', 'CANCELLED', 'REJECTED', 'CANCELLED_BY_ARTIST'].includes(status);
                  return (d >= new Date() && !isCompleted) || isActive;
                }).length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'past' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('past')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'past' && styles.activeTabText,
                ]}
              >
                Past ({bookings.filter(b => {
                  const d = new Date(b.bookingDate || b.date);
                  const status = (b.status || '').toUpperCase();
                  const isActive = ['PENDING', 'CONFIRMED', 'APPROVED', 'STARTED'].includes(status);
                  const isCompleted = ['COMPLETED', 'CANCELLED', 'REJECTED', 'CANCELLED_BY_ARTIST'].includes(status);
                  return (d < new Date() && !isActive) || isCompleted;
                }).length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {loading ? (
            <View style={{ marginTop: 50 }}>
              <ActivityIndicator size="large" color="#7C3AED" />
            </View>
          ) : (
            <>
              {filteredBookings.length === 0 ? (
                <View style={{ marginTop: 50, alignItems: 'center' }}>
                  <Text style={{ color: '#6B7280', fontSize: 16 }}>No {activeTab} bookings found.</Text>
                </View>
              ) : (
                filteredBookings.map((booking: any, index: number) => {
                  const bDateStr = booking.bookingDate || booking.date;
                  const bDate = new Date(bDateStr);

                  return (
                    <BookingCard
                      key={booking.id || index}
                      image={booking.user?.profileImage ? { uri: booking.user.profileImage } : require('../../asset/images/facial.png')}
                      name={booking.user?.name || booking.userName || 'Unknown User'}
                      service={booking.service?.name || booking.serviceName || 'Makeup Service'}
                      date={bDate.toLocaleDateString()}
                      time={bDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      address={booking.address || 'Location not specified'}
                      price={`₹${booking.totalPrice || booking.price || booking.totalAmount || 0}`}
                      status={booking.status || 'Pending'}
                      onPressCard={() =>
                        navigation.navigate('BookingDetails', {
                          ...booking,
                          bookingId: booking._id || booking.id,
                          name: booking.user?.name || booking.userName || 'Unknown User',
                          service: booking.service?.name || booking.serviceName || 'Service',
                          date: bDate.toLocaleDateString(),
                          time: bDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          price: `₹${booking.totalPrice || booking.price || booking.totalAmount || 0}`,
                          status: booking.status || 'Pending',
                        })
                      }
                    />
                  );
                })
              )}
            </>
          )}
        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default ArtistBookingsScreen;

/* ---------------- COMPONENT ---------------- */

const getStatusColor = (status: string) => {
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'PENDING': return { bg: '#FEF3C7', text: '#D97706' }; // Yellow
    case 'CONFIRMED':
    case 'APPROVED': return { bg: '#DBEAFE', text: '#2563EB' }; // Blue
    case 'STARTED': return { bg: '#E0E7FF', text: '#4F46E5' }; // Indigo
    case 'COMPLETED': return { bg: '#D1FAE5', text: '#059669' }; // Green
    case 'CANCELLED':
    case 'CANCELLED_BY_ARTIST':
    case 'REJECTED': return { bg: '#FEE2E2', text: '#DC2626' }; // Red
    default: return { bg: '#F3F4F6', text: '#6B7280' }; // Gray
  }
};

const BookingCard = ({
  image,
  name,
  service,
  date,
  time,
  address,
  price,
  status,
  onPressCard,
}: any) => {
  const { bg, text } = getStatusColor(status);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={onPressCard}
    >
      <Image source={image} style={styles.cardImage} />

      <View style={styles.cardContent}>
        <View style={styles.rowBetween}>
          <Text style={styles.name}>{name}</Text>

          <View style={[styles.statusBadge, { backgroundColor: bg }]}>
            <Text style={[styles.statusText, { color: text }]}>
              {status}
            </Text>
          </View>
        </View>

        <Text style={styles.service}>{service}</Text>

        <View style={styles.infoRow}>
          <FontAwesome name="calendar" size={12} color="#9CA3AF" />
          <Text style={styles.infoText}>{date}</Text>

          <FontAwesome
            name="clock-o"
            size={12}
            color="#9CA3AF"
            style={{ marginLeft: 10 }}
          />
          <Text style={styles.infoText}>{time}</Text>
        </View>

        <View style={styles.infoRow}>
          <FontAwesome name="map-marker" size={14} color="#9CA3AF" />
          <Text style={styles.infoText}>{address}</Text>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.price}>{price}</Text>

          <TouchableOpacity style={styles.callBtn} activeOpacity={0.8}>
            <FontAwesome name="phone" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  title: {
    fontSize: 26,
    fontWeight: '500',
  },

  subTitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 6,
  },

  tabContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C4B5FD',
    marginTop: 25,
    padding: 4,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: '#EDE9FE',
  },

  tabText: {
    fontSize: 14,
    color: '#6B7280',
  },

  activeTabText: {
    color: '#000',
    fontWeight: '500',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    marginTop: 20,
    elevation: 2,
  },

  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },

  cardContent: {
    flex: 1,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  name: {
    fontSize: 17,
    fontWeight: '500',
  },

  service: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 6,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  infoText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginLeft: 6,
  },

  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  price: {
    fontSize: 20,
    fontWeight: '500',
    color: '#7C3AED',
  },

  callBtn: {
    marginLeft: 'auto',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
