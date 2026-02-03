import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenView from '../../utils/ScreenView';

const ServiceOngoingScreen = () => {
  const navigation = useNavigation<any>();
  const { params }: any = useRoute();

  const [seconds, setSeconds] = useState(0);

  // ⏱ simple timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(
      2,
      '0'
    )}:${String(secs).padStart(2, '0')}`;
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

        <View style={styles.container}>
          {/* SERVICE ONGOING */}
          <View style={styles.cardCenter}>
            <View style={styles.clockCircle}>
              <FontAwesome name="clock-o" size={36} color="#7C3AED" />
            </View>

            <Text style={styles.ongoingTitle}>Service Ongoing</Text>
            <Text style={styles.ongoingSub}>
              Complete the service to proceed
            </Text>
          </View>

          {/* TIMER */}
          <View style={styles.timerBox}>
            <Text style={styles.timerLabel}>Time Elapsed</Text>
            <Text style={styles.timerValue}>{formatTime(seconds)}</Text>
          </View>

          {/* SERVICE DETAILS */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Service Details</Text>

            <DetailRow label="Service" value={params?.service} />
            <DetailRow label="Customer" value={params?.name} />

            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Amount</Text>
              <Text style={styles.amountValue}>{params?.price}</Text>
            </View>
          </View>

          {/* NEXT STEPS */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Next Steps</Text>

            <StepRow step="1" text="Complete the service for the customer" />
            <StepRow step="2" text="Ask customer for the completion OTP" />
            <StepRow step="3" text="Enter the OTP to mark service as complete" />
            <StepRow
              step="4"
              text="Payment will be processed to your wallet"
            />
          </View>

          {/* COMPLETE SERVICE */}
<TouchableOpacity
  style={styles.completeBtn}
  onPress={() =>
    navigation.navigate('CustomerOtp', {
      name: params.name,
      service: params.service,
      price: params.price,
    })
  }
>
  <Text style={styles.completeText}>Complete service</Text>
</TouchableOpacity>

        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default ServiceOngoingScreen;

/* ---------------- COMPONENTS ---------------- */

const DetailRow = ({ label, value }: any) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const StepRow = ({ step, text }: any) => (
  <View style={styles.stepRow}>
    <View style={styles.stepCircle}>
      <Text style={styles.stepNumber}>{step}</Text>
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
  },

  cardCenter: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },

  clockCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  ongoingTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  ongoingSub: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  timerBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  timerValue: {
    fontSize: 36,
    fontWeight: '600',
    color: '#7C3AED',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    color: '#6B7280',
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },

  amountRow: {
    backgroundColor: '#FFF4E5',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountLabel: {
    color: '#6B7280',
  },
  amountValue: {
    color: '#7C3AED',
    fontWeight: '600',
    fontSize: 16,
  },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },

  completeBtn: {
    backgroundColor: '#7C3AED',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  completeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
