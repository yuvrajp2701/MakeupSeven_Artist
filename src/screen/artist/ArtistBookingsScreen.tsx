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
import ScreenView from '../../utils/ScreenView';
import { useNavigation } from '@react-navigation/native';



const ArtistBookingsScreen = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const navigation = useNavigation<any>();  

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
                Upcoming (2)
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
                Past (1)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Booking Cards */}
          {activeTab === 'upcoming' && (
            <>
<BookingCard
  image={require('../../asset/images/artists1.png')}
  name="Sarah Johnson"
  service="Wedding Makeup"
  date="2024-12-15"
  time="10:00 AM"
  address="123 Main St, New York"
  price="₹1299"
  status="Pending"
  onPressCall={() =>
    navigation.navigate('BookingDetails', {
      name: 'Sarah Johnson',
      service: 'Wedding Makeup',
      date: '2024-12-15',
      time: '10:00 AM',
      address: '123 Main St, New York',
      price: '₹1299',
      status: 'Pending',
    })
  }
/>


<BookingCard
  image={require('../../asset/images/artists1.png')}
  name="Emily Davis"
  service="Bridal Hair Styling"
  date="2024-12-16"
  time="2:00 PM"
  address="456 Park Ave, Brooklyn"
  price="₹799"
  status="Confirmed"
  onPressCall={() =>
    navigation.navigate('BookingDetails', {
      name: 'Emily Davis',
      service: 'Bridal Hair Styling',
      date: '2024-12-16',
      time: '2:00 PM',
      address: '456 Park Ave, Brooklyn',
      price: '₹799',
      status: 'Confirmed',
    })
  }
/>

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
  onPressCall,
}: any) => (

  <View style={styles.card}>
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

<TouchableOpacity style={styles.callBtn} onPress={onPressCall}>
  <FontAwesome name="phone" size={16} color="#000" />
</TouchableOpacity>


      </View>
    </View>
  </View>
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
