import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useNavigation, useRoute } from '@react-navigation/native';
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

const BookingDetailsScreen = () => {
  const navigation = useNavigation<any>();
  const { params }: any = useRoute();

  // 🔥 booking state
  const bookingId = params._id || params.id || params.bookingId;
  const [bookingData, setBookingData] = useState<any>(params || {});
  const [isAccepted, setIsAccepted] = useState(bookingData?.status === 'APPROVED' || bookingData?.status === 'STARTED' || bookingData?.status === 'COMPLETED');
  const [loading, setLoading] = useState(false);
  const { userToken } = useAuth();

  // Detect dummy bookings so we skip real API calls
  const isDummy = typeof bookingId === 'string' && bookingId.startsWith('dummy-');

  React.useEffect(() => {
    if (!bookingId || isDummy) return;
    const fetchBookingDetails = async () => {
      try {
        const token = userToken || await getToken();
        if (!token) return;
        setLoading(true);
        const response = await apiCall(`/booking/booking/${bookingId}`, { method: 'GET', token });
        const data = response?.booking || response?.data || response;
        if (data) {
          setBookingData(data);
          setIsAccepted(data.status === 'APPROVED' || data.status === 'STARTED' || data.status === 'COMPLETED');
        }
      } catch (error) {
        console.warn('Error fetching booking details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId, userToken, isDummy]);

  const handleStatusUpdate = async (newStatus: string) => {
    // ── Dummy mode: instant local state update, no network ──
    if (isDummy) {
      setLoading(true);
      await new Promise<void>(r => setTimeout(r, 600)); // simulate network delay
      if (newStatus === 'APPROVED' || newStatus === 'STARTED') {
        setIsAccepted(true);
        setBookingData((prev: any) => ({ ...prev, status: newStatus }));
      } else if (newStatus === 'REJECTED' || newStatus === 'CANCELLED') {
        navigation.goBack();
      }
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = userToken || await getToken();
      if (!token) return;

      if (!bookingId) {
        console.warn("No booking ID found in params:", params);
        return;
      }

      console.log(`[StatusUpdate] Attempting ${newStatus} for ID: ${bookingId}`);

      let endpoint = '';
      if (newStatus === 'APPROVED') endpoint = 'approve';
      else if (newStatus === 'REJECTED') endpoint = 'reject';
      else if (newStatus === 'CANCELLED') endpoint = 'cancel-by-artist';
      else endpoint = newStatus.toLowerCase();

      try {
        console.log(`API REQUEST: PUT /booking/${bookingId}/${endpoint}`);

        const response = await apiCall(`/booking/${bookingId}/${endpoint}`, {
          method: 'PUT',
          token,
          body: {} 
        });

        if (newStatus === 'APPROVED' || newStatus === 'STARTED') {
          setIsAccepted(true);
          setBookingData((prev: any) => ({ ...prev, status: newStatus }));
        } else if (newStatus === 'REJECTED' || newStatus === 'CANCELLED') {
          navigation.goBack();
        }

        console.log(`Booking ${newStatus} success:`, response);
      } catch (err: any) {
        console.warn(`[StatusUpdate] ${endpoint} failed:`, err.message);
        const errorMsg = err.message || `Failed to update booking to ${newStatus}`;
        Alert.alert("Booking Update Failed", errorMsg);
        throw err;
      }
    } catch (error) {
      // already handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenView>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={18} color="#7C3AED" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking details</Text>
        </View>

        {/* STATUS */}
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>
            {bookingData?.status || (isAccepted ? 'Confirmed' : 'Awaiting Confirmation')}
          </Text>
        </View>

        <View style={styles.container}>
          {/* BOOKING INFORMATION */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Booking Information</Text>

              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {bookingData?.user?.name?.charAt(0) || bookingData?.name?.charAt(0) || bookingData?.customerName?.charAt(0) || 'U'}
                </Text>
              </View>
            </View>

            <InfoRow icon="user" label="Customer" value={bookingData?.user?.name || bookingData?.name || bookingData?.customerName || 'Customer'} />
            <InfoRow icon="calendar" label="Date" value={bookingData?.bookingDate || bookingData?.date || 'N/A'} />
            <InfoRow icon="clock-o" label="Time" value={bookingData?.formattedTimeSlot || `${bookingData?.startTime || 'N/A'} - ${bookingData?.endTime || 'N/A'}`} />
            
            {/* FIXED ADDRESS RENDERING */}
            <InfoRow
              icon="map-marker"
              label="Location"
              value={formatAddress(bookingData?.address)}
            />

            {/* AMOUNT */}
            <View style={styles.amountRow}>
              <View style={styles.amountIcon}>
                <FontAwesome name="rupee" size={24} color="#F59E0B" />
              </View>

              <View style={styles.amountTextContainer}>
                <Text style={styles.amountLabel}>Amount</Text>
                <Text style={styles.amountValue}>₹{bookingData?.totalPrice || bookingData?.price || bookingData?.totalAmount || '0'}</Text>
              </View>
            </View>
          </View>

          {/* ACTIONS */}
          {bookingData?.status === 'PENDING' && (
            <View style={styles.card}>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.acceptBtn, loading && { opacity: 0.7 }]}
                  onPress={() => handleStatusUpdate('APPROVED')}
                  activeOpacity={0.9}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.acceptText}>Accept</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.declineOutlineBtn, loading && { opacity: 0.7 }]}
                  onPress={() => handleStatusUpdate('REJECTED')}
                  activeOpacity={0.9}
                  disabled={loading}
                >
                  <Text style={styles.declineOutlineText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* CUSTOMER CONTACT (ONLY AFTER ACCEPT) */}
          {isAccepted && (
            <>
              {/* CUSTOMER CONTACT */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Customer Contact</Text>

                <TouchableOpacity style={styles.callBtn}>
                  <FontAwesome name="phone" size={16} color="#7C3AED" />
                  <Text style={styles.callText}>Call Customer</Text>
                </TouchableOpacity>
              </View>

              {/* START SERVICE */}
              {bookingData?.status === 'APPROVED' && (
                <TouchableOpacity
                  style={[styles.startServiceBtn, loading && { opacity: 0.7 }]}
                  onPress={() => {
                    navigation.navigate('CustomerOtp', {
                      ...bookingData,
                      bookingId: bookingId,
                      mode: 'start'
                    });
                  }}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.startServiceText}>Start Service</Text>}
                </TouchableOpacity>
              )}

              {/* CANCEL BOOKING (Only after accept but before start) */}
              {bookingData?.status === 'APPROVED' && (
                <TouchableOpacity
                  style={[styles.declineBtn, loading && { opacity: 0.7 }]}
                  onPress={() => handleStatusUpdate('CANCELLED')}
                  activeOpacity={0.9}
                  disabled={loading}
                >
                  <Text style={styles.declineText}>Cancel Booking</Text>
                </TouchableOpacity>
              )}

              {/* COMPLETE SERVICE */}
              {bookingData?.status === 'STARTED' && (
                 <TouchableOpacity
                   style={[styles.startServiceBtn, loading && { opacity: 0.7 }]}
                   onPress={() => {
                     navigation.navigate('CustomerOtp', {
                       ...bookingData,
                       bookingId: bookingId,
                       mode: 'complete'
                     });
                   }}
                   disabled={loading}
                 >
                   {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.startServiceText}>Complete Service</Text>}
                 </TouchableOpacity>
              )}
            </>
          )}

        </View>
      </ScrollView>
    </ScreenView>
  );
};

const InfoRow = ({ icon, label, value }: any) => (
  <View style={styles.infoRowBox}>
    <View style={styles.iconBox}>
      <FontAwesome name={icon} size={24} color="#7C3AED" />
    </View>

    <View style={{ flex: 1 }}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    backgroundColor: '#EEE9FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 26,
    paddingTop: 62,
    paddingBottom: 36,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#7C3AED',
    marginLeft: 12,
  },
  statusPill: {
    alignSelf: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 29,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 19,
    fontWeight: '500',
    color: '#F59E0B',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 22,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '500',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  infoRowBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#EEE9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '400',
    marginTop: 2,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E5',
    padding: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  amountIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#FFEDD5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  amountTextContainer: {
    flexDirection: 'column',
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  amountValue: {
    fontSize: 22,
    fontWeight: '600',
    color: '#7C3AED',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: '#7C3AED',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  acceptText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  declineOutlineBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  declineOutlineText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  startServiceBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  startServiceText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE9FF',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 10,
  },
  callText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '500',
    color: '#7C3AED',
  },
  declineBtn: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 30,
  },
  declineText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
});

export default BookingDetailsScreen;