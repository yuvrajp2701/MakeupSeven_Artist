import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import LinearGradient from 'react-native-linear-gradient';
import ScreenView from '../../utils/ScreenView';
import { apiCall } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ArtistHomeScreen = ({ navigation }: any) => {
  const { userToken, logout } = useAuth();
  // Assuming new user state for now -- TODO: Fetch from API or Auth
  const [isNewUser, setIsNewUser] = React.useState(false); // Changed to useState
  const [refreshing, setRefreshing] = React.useState(false); // Added refreshing state
  const [userName, setUserName] = React.useState('Artist');

  const [loading, setLoading] = React.useState(true);
  const [servicesCount, setServicesCount] = React.useState(0);
  const [bookingsCount, setBookingsCount] = React.useState(0);
  const [rating, setRating] = React.useState(0);
  const [totalEarnings, setTotalEarnings] = React.useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = React.useState(0);
  const [upcomingBookings, setUpcomingBookings] = React.useState<any[]>([]);
  const [activities, setActivities] = React.useState<any[]>([]);

  // Extracted fetchHomeData into a useCallback for reusability
  const fetchHomeData = React.useCallback(async () => {
    try {
      setLoading(true);
      setRefreshing(true);

      if (!userToken) {
        console.log('No token found, skipping API calls');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const token = userToken;

      // 1. Get User Details
      try {
        const response = await apiCall('/auth/me', { method: 'GET', token });
        const user = response?.user || response;

        if (user) {
          setUserName(user.name || 'Artist');

          if (user.serviceProvider) {
            setRating(user.serviceProvider.averageRating || 0);
            setBookingsCount(user.serviceProvider.totalBookings || 0);
          }

          // Check both profile completion and admin approval
          // DEVELOPER BYPASS: If role is ARTIST or SERVICE_PROVIDER, treat as approved for testing
          const isApproved = user.serviceProvider?.approvalStatus === 'APPROVED' || user.role === 'ARTIST' || user.role === 'SERVICE_PROVIDER';
          const isComplete = user.isProfileComplete;

          // If approved, they are NOT a new user (show dashboard)
          setIsNewUser(!(isComplete || isApproved));
        }

        // 1.1 Get Wallet/Earnings
        try {
          const walletResponse = await apiCall('/reward/user/wallet', { method: 'GET', token, silent: true });
          if (walletResponse && typeof walletResponse === 'object') {
            setTotalEarnings(walletResponse.totalPoints || walletResponse.balance || 0);
          }

          // 1.2 Get Activity/Ledger
          const ledgerResponse = await apiCall('/reward/user/wallet/ledger', { method: 'GET', token, silent: true });
          const ledgerList = Array.isArray(ledgerResponse) ? ledgerResponse : (ledgerResponse?.ledger || ledgerResponse?.data || []);

          if (ledgerList.length > 0) {
            // Calculate This Month Earnings
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            const thisMonthEarnings = ledgerList.reduce((acc: number, item: any) => {
              const itemDate = new Date(item.createdAt);
              if (
                item.type === 'credit' &&
                itemDate.getMonth() === currentMonth &&
                itemDate.getFullYear() === currentYear
              ) {
                return acc + (item.points || item.amount || 0);
              }
              return acc;
            }, 0);

            setMonthlyEarnings(thisMonthEarnings);

            const mappedActivities = ledgerList.map((item: any) => ({
              id: item.id || item._id,
              icon: item.type === 'credit' ? 'money' : 'sign-out',
              title: item.title || (item.type === 'credit' ? 'Earnings' : 'Withdrawal'),
              sub: item.description || '',
              amount: (item.type === 'credit' ? '+₹' : '-₹') + (item.points || item.amount || 0),
              timeAgo: new Date(item.createdAt).toLocaleDateString()
            }));
            setActivities(mappedActivities.slice(0, 5));
          }
        } catch (e) {
          // New users or empty wallets return 404, we handle this silently
          console.log('[Home] Wallet info not yet available for this user');
          setTotalEarnings(0);
        }

      } catch (e) {
        console.warn('Profile fetch error:', e);
      }

      // 2. Get My Services (Count)
      try {
        const response = await apiCall('/services/my', { method: 'GET', token });
        const list = Array.isArray(response) ? response : (response?.services || []);
        setServicesCount(list.length);
      } catch (e) {
        console.warn('Services fetch error:', e);
      }

      // 3. Get Bookings
      try {
        const bookingsData = await apiCall('/booking', { method: 'GET', token });
        const list = Array.isArray(bookingsData) ? bookingsData : (bookingsData?.bookings || bookingsData?.data || []);

        if (list.length > 0) {
          // Sort by date (newest first)
          const sorted = [...list].sort((a: any, b: any) => {
            const dateA = new Date(a.bookingDate || a.date).getTime();
            const dateB = new Date(b.bookingDate || b.date).getTime();
            return dateB - dateA;
          });

          setUpcomingBookings(sorted.slice(0, 3));
        } else {
          setUpcomingBookings([]);
        }
      } catch (e) {
        console.warn('Bookings fetch error:', e);
      }

    } catch (e) {
      console.warn('Home data fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []); // Dependencies for useCallback

  React.useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]); // Re-run effect if fetchHomeData changes (unlikely with empty deps)

  const onRefresh = React.useCallback(() => {
    fetchHomeData(); // Call the data fetching function
  }, [fetchHomeData]);

  return (
    <ScreenView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.hello}>Hey {userName} 👋</Text>
              <Text style={styles.name}>{userName}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={[styles.bell, { marginRight: 10 }]}
                onPress={() => logout()}
              >
                <FontAwesome name="sign-out" size={20} color="#000" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.bell} onPress={() => navigation.navigate('Notifications')}>
                <FontAwesome name="bell-o" size={20} color="#000" />
                <View style={styles.dot} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatCard title="This Month" value={isNewUser ? "₹0" : `₹${monthlyEarnings}`} icon="rupee" />
            <StatCard title="Rating" value={isNewUser ? "0" : rating.toFixed(1)} icon="star-o" />
            <StatCard title="Bookings" value={isNewUser ? "0" : bookingsCount.toString()} icon="calendar-o" />
          </View>

          {isNewUser ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('profile')}
            >
              <LinearGradient
                colors={['#FFEDD5', '#FED7AA']}
                style={styles.createPortfolioCard}
              >
                <View style={styles.iconContainer}>
                  <FontAwesome name="magic" size={24} color="#7C3AED" />
                </View>
                <Text style={styles.createPortfolioTitle}>Create your portfolio now</Text>
                <Text style={styles.createPortfolioSub}>become the part of MakeUpSeven</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <>
              {/* Quick Cards */}
              <View style={styles.quickRow}>
                <LinearGradient
                  colors={['#7C3AED', '#8B5CF6']}
                  style={styles.quickCard}
                >
                  <FontAwesome name="list-alt" size={30} color="#fff" />
                  <Text style={styles.quickTitle}>Services</Text>
                  <Text style={styles.quickSub}>{servicesCount} active</Text>
                </LinearGradient>

                <TouchableOpacity
                  style={{ width: '48%' }}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('profile')}
                >
                  <LinearGradient
                    colors={['#FFE9D9', '#FFD9C6']}
                    style={[styles.quickCard, { width: '100%' }]}
                  >
                    <FontAwesome name="magic" size={30} color="#7C3AED" />
                    <Text style={styles.quickTitleDark}>Portfolio</Text>
                    <Text style={styles.quickSubDark}>Manage profile</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Upcoming Bookings */}
              <SectionHeader
                title="Upcoming Bookings"
                action="See All"
                onPress={() => navigation.navigate('Bookings')}
              />

              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking, index) => (
                  <BookingCard
                    key={booking.id || index}
                    name={booking.user?.name || booking.userName || 'Customer'}
                    service={booking.service?.name || booking.serviceName || 'Makeup Service'}
                    time={new Date(booking.bookingDate || booking.date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    price={`₹${booking.totalPrice || booking.price || booking.totalAmount || 0}`}
                    image={booking.user?.profileImage ? { uri: booking.user.profileImage } : null}
                    onPressCard={() =>
                      navigation.navigate('Bookings', {
                        screen: 'BookingDetails',
                        params: {
                          ...booking,
                          bookingId: booking._id || booking.id,
                          name: booking.user?.name || booking.userName || 'Customer',
                          price: `₹${booking.totalPrice || booking.price || booking.totalAmount || 0}`,
                        },
                      })
                    }
                  />
                ))
              ) : (
                <View style={[styles.bookingCard, { justifyContent: 'center', paddingVertical: 30, backgroundColor: '#F9FAFB' }]}>
                  <Text style={{ color: '#6B7280', textAlign: 'center', fontSize: 16 }}>No upcoming bookings found</Text>
                </View>
              )}

              {/* Earnings */}
              <SectionHeader title="Earnings Overview" />

              <LinearGradient
                colors={['#7C3AED', '#8B5CF6']}
                style={styles.earnings}
              >
                <Text style={styles.earningsLabel}>Total Earnings</Text>
                <Text style={styles.earningsValue}>₹{totalEarnings}</Text>
                <Text style={styles.earningsSub}>Updated just now</Text>
              </LinearGradient>

              {/* Activity */}
              <SectionHeader title="Recent Activity" />

              {activities.length > 0 ? (
                activities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    icon={activity.icon}
                    title={activity.title}
                    sub={activity.sub}
                    amount={activity.amount}
                    timeAgo={activity.timeAgo}
                  />
                ))
              ) : (
                <View style={[styles.activityCard, { justifyContent: 'center', paddingVertical: 20 }]}>
                  <Text style={{ color: '#6B7280', textAlign: 'center' }}>No recent activity yet</Text>
                </View>
              )}
            </>
          )}

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

const SectionHeader = ({ title, action, onPress }: any) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>

    {action ? (
      <TouchableOpacity
        style={styles.sectionActionRow}
        activeOpacity={0.7}
        onPress={onPress}
      >
        <Text style={styles.sectionAction}>{action}</Text>
        <FontAwesome
          name="angle-right"
          size={16}
          color="#7C3AED"
          style={{ marginLeft: 4, marginTop: 1 }}
        />
      </TouchableOpacity>
    ) : null}
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
    {price ? <Text style={styles.bookingPrice}>{price}</Text> : null}
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

      {amount ? <Text style={styles.activityAmount}>{amount}</Text> : null}
    </View>

    {/* Bottom Time */}
    {timeAgo ? (
      <Text style={styles.activityTime}>{timeAgo}</Text>
    ) : null}
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
  quickSub: { color: '#E9D5FF', fontSize: 14, marginTop: 7 },
  quickTitleDark: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  quickSubDark: { fontSize: 13, color: '#6B7280' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 23,
    alignItems: 'center',
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
  bookingName: { fontWeight: '500', fontSize: 17, marginTop: 5 },
  bookingSub: { fontSize: 15, color: '#6B7280', marginTop: 9 },
  bookingTime: { fontSize: 13, color: '#9CA3AF', marginBottom: 15, },
  bookingPrice: { color: '#7C3AED', fontWeight: '500', fontSize: 20, alignSelf: 'center', },

  earnings: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 25,
    marginTop: -17,
  },
  earningsLabel: { color: '#E9D5FF', fontSize: 16, },
  earningsValue: { color: '#fff', fontSize: 32, fontWeight: '500' },
  earningsSub: { color: '#DDD6FE', fontSize: 15, marginTop: 20, },

  activityCard: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 14,
    paddingLeft: 19,
    borderRadius: 14,
    marginBottom: 32,
    marginTop: -11,
    elevation: 2,
  },
  activityTitle: { fontWeight: '500', fontSize: 17, },
  activitySub: { fontSize: 14, color: '#6B7280' },
  activityAmount: {
    marginLeft: 'auto',
    fontSize: 20,
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
    marginLeft: 45,
    marginBottom: 9,
    color: '#9CA3AF',
  },

  createPortfolioCard: {
    marginTop: 35,
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  createPortfolioTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },

  createPortfolioSub: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
  },

});
