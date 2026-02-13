import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import ScreenView from '../../utils/ScreenView';

// Dummy Data
const DUMMY_BOOKINGS = [
  {
    id: '1',
    user: {
      name: 'Sarah Jones',
      profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    service: {
      name: 'Bridal Makeup',
    },
    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    address: '123 Main St, New York, NY',
    price: 15000,
    status: 'Confirmed',
  },
  {
    id: '2',
    user: {
      name: 'Emily Davis',
      profileImage: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    service: {
      name: 'Party Makeup',
    },
    date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    address: '456 Elm St, Brooklyn, NY',
    price: 8000,
    status: 'Pending',
  },
  {
    id: '3',
    user: {
      name: 'Jessica Wilson',
      profileImage: 'https://randomuser.me/api/portraits/women/12.jpg',
    },
    service: {
      name: 'Hairstyling',
    },
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    address: '789 Oak St, Queens, NY',
    price: 5000,
    status: 'Completed',
  },
  {
    id: '4',
    user: {
      name: 'Amanda Brown',
      profileImage: 'https://randomuser.me/api/portraits/women/33.jpg',
    },
    service: {
      name: 'Event Makeup',
    },
    date: new Date(Date.now() - 172800000).toISOString(), // Day before yesterday
    address: '321 Pine St, Bronx, NY',
    price: 7000,
    status: 'Cancelled',
  },
];

const ArtistBookingsScreen = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [bookings, setBookings] = useState<any[]>(DUMMY_BOOKINGS);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  // Removed fetchBookings and useFocusEffect since we are using dummy data

  const getFilteredBookings = () => {
    const now = new Date();
    return bookings.filter((booking: any) => {
      const bookingDate = new Date(booking.date); // Ensure your API returns a valid date string
      if (activeTab === 'upcoming') {
        return bookingDate >= now || booking.status === 'Pending' || booking.status === 'Confirmed'; // Adjust logic as needed
      } else {
        return bookingDate < now || booking.status === 'Completed' || booking.status === 'Cancelled';
      }
    });
  };

  const filteredBookings = getFilteredBookings();

  return (
    <ScreenView>
      <ScrollView showsVerticalScrollIndicator={false}>
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
                  const d = new Date(b.date);
                  return d >= new Date() || b.status === 'Pending' || b.status === 'Confirmed';
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
                  const d = new Date(b.date);
                  return d < new Date() || b.status === 'Completed' || b.status === 'Cancelled';
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
                filteredBookings.map((booking: any, index: number) => (
                  <BookingCard
                    key={index}
                    image={booking.user?.profileImage ? { uri: booking.user.profileImage } : require('../../asset/images/artists1.png')}
                    name={booking.user?.name || booking.userName || 'Unknown User'}
                    service={booking.service?.name || booking.serviceName || 'Service'}
                    date={new Date(booking.date).toLocaleDateString()}
                    time={new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    address={booking.address || 'No address provided'}
                    price={`₹${booking.price || booking.totalAmount || 0}`}
                    status={booking.status || 'Pending'}
                    onPressCard={() =>
                      navigation.navigate('BookingDetails', {
                        ...booking, // Pass the whole object
                        name: booking.user?.name || booking.userName || 'Unknown User',
                        service: booking.service?.name || booking.serviceName || 'Service',
                        date: new Date(booking.date).toLocaleDateString(),
                        time: new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        price: `₹${booking.price || booking.totalAmount || 0}`,
                        status: booking.status || 'Pending',
                      })
                    }
                  />
                ))
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
}: any) => (

  <TouchableOpacity
    activeOpacity={0.9}
    style={styles.card}
    onPress={onPressCard}
  >

    <Image source={image} style={styles.cardImage} />

    <View style={styles.cardContent}>
      <View style={styles.rowBetween}>
        <Text style={styles.name}>{name}</Text>

        <View
          style={[
            styles.statusBadge,
            status === 'Pending' ? styles.pending : styles.confirmed,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              status === 'Pending'
                ? styles.pendingText
                : styles.confirmedText,
            ]}
          >
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

  pending: {
    backgroundColor: '#FEF3C7',
  },

  confirmed: {
    backgroundColor: '#DBEAFE',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },

  pendingText: {
    color: '#F59E0B',
  },

  confirmedText: {
    color: '#2563EB',
  },
});
