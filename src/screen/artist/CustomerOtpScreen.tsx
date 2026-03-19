import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Keyboard, ActivityIndicator } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenView from '../../utils/ScreenView';
import { apiCall } from '../../services/api';
import { getToken } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';

const CustomerOtpScreen = () => {
  const navigation = useNavigation<any>();
  const { params }: any = useRoute();

  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const [loading, setLoading] = useState(false);
  const { userToken } = useAuth();

  const isStartMode = params?.mode === 'start';

  const handleAction = async (otpString: string) => {
    try {
      setLoading(true);
      const token = userToken || await getToken();
      if (!token) return;

      const bookingId = params.params?.bookingId || params.bookingId || params.id;
      const isDummy = typeof bookingId === 'string' && bookingId.startsWith('dummy-');

      if (isDummy) {
        await new Promise<void>(r => setTimeout(r, 600));
        if (isStartMode) {
          navigation.replace('ServiceOngoing', {
            ...params,
            bookingId: bookingId
          });
        } else {
          navigation.replace('ServiceCompleted', {
            price: params?.price,
          });
        }
        return;
      }

      const endpoint = isStartMode ? 'start' : 'complete';

      const response = await apiCall(`/booking/${bookingId}/${endpoint}`, {
        method: 'PUT',
        token,
        body: { otp: parseInt(otpString) }
      });

      console.log(`Service ${endpoint} success:`, response);
      if (isStartMode) {
        navigation.replace('ServiceOngoing', {
          ...params,
          bookingId: bookingId
        });
      } else {
        navigation.replace('ServiceCompleted', {
          price: params?.price,
        });
      }
    } catch (e) {
      console.error(`Failed to ${isStartMode ? 'start' : 'complete'} service:`, e);
      if (isStartMode) {
        navigation.replace('ServiceOngoing', {
          ...params,
          bookingId: params.params?.bookingId || params.bookingId || params.id
        });
      } else {
        navigation.replace('ServiceCompleted', {
          price: params?.price,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (updatedOtp.every(d => d !== '')) {
      Keyboard.dismiss();
      const otpString = updatedOtp.join('');
      handleAction(otpString);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <ScreenView>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={18} color="#7C3AED" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking details</Text>
        </View>

        <View style={styles.container}>
          {/* ICON */}
          <View style={styles.iconCircle}>
            <FontAwesome name="mobile" size={40} color="#7C3AED" />
          </View>

          <Text style={styles.title}>{isStartMode ? 'Start Service OTP' : 'Customer OTP'}</Text>
          <Text style={styles.subtitle}>
            {isStartMode ? 'Ask the customer for their 4-digit start code' : 'Ask the customer for their 4-digit completion code'}
          </Text>

          {/* OTP INPUTS */}
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                value={digit}
                onChangeText={(val) => handleChange(val, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                returnKeyType="done"
                maxLength={1}
                autoFocus={index === 0}
                style={styles.otpBox}
              />
            ))}
          </View>

          {/* DETAILS */}
          <View style={styles.card}>
            <DetailRow label="Customer" value={params?.name} />
            <DetailRow label="Service" value={params?.service} />

            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Amount</Text>
              <Text style={styles.amountValue}>{params?.price}</Text>
            </View>
          </View>

          {/* HOW IT WORKS */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>How it works</Text>
            <StepRow text="Customer receives OTP on their app" />
            {isStartMode ? (
              <StepRow text="Enter the OTP to confirm service start" />
            ) : (
              <>
                <StepRow text="Payment will be processed to your wallet" />
                <StepRow text="Enter the OTP to confirm service completion" />
              </>
            )}
          </View>

          {/* COMPLETE SERVICE */}
          <TouchableOpacity
            disabled={!otp.every(d => d !== '') || loading}
            activeOpacity={0.9}
            style={[
              styles.completeBtn,
              (!otp.every(d => d !== '') || loading) && styles.disabledBtn,
            ]}
            onPress={() => handleAction(otp.join(''))}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.completeText}>{isStartMode ? 'Start Service' : 'Complete Service'}</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default CustomerOtpScreen;

/* ---------------- COMPONENTS ---------------- */

const DetailRow = ({ label, value }: any) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const StepRow = ({ text }: any) => (
  <View style={styles.stepRow}>
    <View style={styles.stepCircle}>
      <Text style={styles.stepNumber}>•</Text>
    </View>
    <Text style={styles.stepText}>{text}</Text>
  </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#EEE9FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 26,
    paddingTop: 62,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#7C3AED',
    marginLeft: 12,
  },

  container: {
    padding: 16,
    alignItems: 'center',
  },

  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEE9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },

  otpRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  otpBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: '#fff',
  },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },

  amountRow: {
    backgroundColor: '#FFF4E5',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountLabel: {
    color: '#6B7280',
  },
  amountValue: {
    color: '#7C3AED',
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepNumber: {
    color: '#fff',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },

  completeBtn: {
    width: '100%',
    backgroundColor: '#7C3AED',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 30,
  },
  completeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledBtn: {
    backgroundColor: '#C4B5FD',
  },
});
