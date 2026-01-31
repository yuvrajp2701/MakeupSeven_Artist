import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import LinearGradient from 'react-native-linear-gradient';
import ScreenView from '../../utils/ScreenView';

const ArtistHomeScreen = () => {
  return (
    <ScreenView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.hello}>Hey Artist 👋</Text>
              <Text style={styles.name}>Priya Sharma</Text>
            </View>

            <TouchableOpacity style={styles.bell}>
              <FontAwesome name="bell-o" size={20} color="#000" />
              <View style={styles.dot} />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatCard title="This Month" value="₹3,240" icon="rupee" />
            <StatCard title="Rating" value="4.9" icon="star-o" />
            <StatCard title="Bookings" value="48" icon="calendar-o" />
          </View>

          {/* Quick Cards */}
          <View style={styles.quickRow}>
            <LinearGradient
              colors={['#7C3AED', '#8B5CF6']}
              style={styles.quickCard}
            >
              <FontAwesome name="book" size={30} color="#fff" />
              <Text style={styles.quickTitle}>Courses</Text>
              <Text style={styles.quickSub}>1 completed</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#FFE9D9', '#FFD9C6']}
              style={styles.quickCard}
            >
              <FontAwesome name="magic" size={30} color="#7C3AED" />
              <Text style={styles.quickTitleDark}>Portfolio</Text>
              <Text style={styles.quickSubDark}>Manage profile</Text>
            </LinearGradient>
          </View>

          {/* Upcoming Bookings */}
          <SectionHeader title="Upcoming Bookings" action="See All" />

          <BookingCard
            name="Emily Davis"
            service="Bridal Hair Styling"
            time="Tomorrow · 2:00 PM"
            price="₹280"
          />

          <BookingCard
            name="Sarah Johnson"
            service="Evening Makeup"
            time="Dec 18 · 10:00 AM"
            price="₹280"
          />

          {/* Earnings */}
          <SectionHeader title="Earnings Overview" />

          <LinearGradient
            colors={['#7C3AED', '#8B5CF6']}
            style={styles.earnings}
          >
            <Text style={styles.earningsLabel}>Total Earnings</Text>
            <Text style={styles.earningsValue}>₹8,430</Text>
            <Text style={styles.earningsSub}>+12.5% from last month</Text>
          </LinearGradient>

          {/* Activity */}
          <SectionHeader title="Recent Activity" />

          <ActivityCard
            icon="money"
            title="Payment Received"
            sub="Photoshoot Makeup service"
            amount="+₹200"
            timeAgo="2 hours ago"
          />

          <ActivityCard
            icon="star"
            title="New 5-Star Review"
            sub="Jessica Miller left a review"
          timeAgo="2 hours ago"
         />

        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default ArtistHomeScreen;

/* ----------------- COMPONENTS ----------------- */

const StatCard = ({ title, value, icon }: any) => (
  <View style={styles.statCard}>
    <View style={styles.statIcon}>
      <FontAwesome name={icon} size={16} color="#10B981" />
    </View>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const SectionHeader = ({ title, action }: any) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>

    {action && (
      <View style={styles.sectionActionRow}>
        <Text style={styles.sectionAction}>{action}</Text>
        <FontAwesome
          name="angle-right"
          size={16}
          color="#7C3AED"
          style={{ marginLeft: 4, marginTop: 1 }}
        />
      </View>
    )}
  </View>
);


const BookingCard = ({ name, service, time, price, image }: any) => (
  <View style={styles.bookingCard}>
    {/* Left Image */}
    <View style={styles.bookingImageWrapper}>
      <Image
        source={image || require('../../asset/images/artists1.png')}
        style={styles.bookingImage}
      />
    </View>

    {/* Middle Content */}
    <View style={styles.bookingContent}>
      <Text style={styles.bookingName}>{name}</Text>
      <Text style={styles.bookingSub}>{service}</Text>
      <Text style={styles.bookingTime}>{time}</Text>
    </View>

    {/* Right Price */}
    {price && <Text style={styles.bookingPrice}>{price}</Text>}
  </View>
);


const ActivityCard = ({ icon, title, sub, amount, timeAgo }: any) => (
  <View style={styles.activityCard}>
    {/* Top Row */}
    <View style={styles.activityTopRow}>
      <FontAwesome name={icon} size={25} color="#10B981" />

      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activitySub}>{sub}</Text>
      </View>

      {amount && <Text style={styles.activityAmount}>{amount}</Text>}
    </View>

    {/* Bottom Time */}
    {timeAgo && (
      <Text style={styles.activityTime}>{timeAgo}</Text>
    )}
  </View>
);


/* ----------------- STYLES ----------------- */

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingVertical: 30 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hello: { fontSize: 15, color: '#6B7280' },
  name: { fontSize: 26, fontWeight: '400', marginTop: 2 },

  bell: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7C3AED',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 35,
  },
  statCard: {
    width: '30%',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 4,
  },
  statIcon: {
    width: 40,
    height: 35,
    borderRadius: 17,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statTitle: { fontSize: 14, color: '#6B7280' },
  statValue: { fontSize: 20, fontWeight: '500', marginTop: 4 },

  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  quickCard: {
    width: '48%',
    borderRadius: 20,
    padding: 30,
  },
  quickTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginTop: 12 },
  quickSub: { color: '#E9D5FF', fontSize: 14, marginTop:7 },
  quickTitleDark: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  quickSubDark: { fontSize: 13, color: '#6B7280' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 23,
  },
  sectionActionRow: {
  flexDirection: 'row',
  alignItems: 'center',
},
bookingImageWrapper: {
  width: 80,
  height: 80,
  borderRadius: 10,
  overflow: 'hidden',
  marginRight: 12,
  backgroundColor: '#F3F4F6',
},

bookingImage: {
  width: '100%',
  height: '100%',
  resizeMode: 'cover',
},

bookingContent: {
  flex: 1,
},

  sectionTitle: { fontSize: 20, fontWeight: '400' },
  sectionAction: { color: '#7C3AED', fontSize: 13 },

  bookingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 2,
  },
  bookingName: { fontWeight: '500',fontSize: 17,marginTop:5 },
  bookingSub: { fontSize: 15, color: '#6B7280',marginTop:9 },
  bookingTime: { fontSize: 13, color: '#9CA3AF',marginBottom:15, },
  bookingPrice: { color: '#7C3AED', fontWeight: '500',fontSize: 20, alignSelf: 'center', },

  earnings: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 25,
    marginTop:-17,
  },
  earningsLabel: { color: '#E9D5FF',fontSize: 16, },
  earningsValue: { color: '#fff', fontSize: 32, fontWeight: '500' },
  earningsSub: { color: '#DDD6FE', fontSize: 15,marginTop:20, },

  activityCard: {
flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 14,
    paddingLeft:19,
    borderRadius: 14,
    marginBottom: 32,
    marginTop:-11,
    elevation: 2,
  },
  activityTitle: { fontWeight: '500',fontSize:17, },
  activitySub: { fontSize: 14, color: '#6B7280' },
  activityAmount: {
    marginLeft: 'auto',
    fontSize:20,
    color: '#10B981',
    fontWeight: '600',
  },
activityTopRow: {
  flexDirection: 'row',
  alignItems: 'center',
},
activityContent: {
  marginLeft: 17,
  flex: 1,
},

activityTime: {
  marginTop: 5,
  fontSize: 12,
  marginLeft:45,
  marginBottom:9,
  color: '#9CA3AF',
},

});
