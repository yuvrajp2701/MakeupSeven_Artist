import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenView from '../../utils/ScreenView';

const ServiceCompletedScreen = () => {
  const navigation = useNavigation<any>();
  const { params }: any = useRoute();

  // optional auto redirect (ex: to Wallet)
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Wallet');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenView>
      <View style={styles.overlay}>
        <View style={styles.modal}>

          {/* SUCCESS ICON */}
          <View style={styles.iconCircle}>
            <FontAwesome name="check" size={28} color="#16A34A" />
          </View>

          {/* TITLE */}
          <Text style={styles.title}>Service Completed!</Text>

          {/* SUBTEXT */}
          <Text style={styles.subText}>
            Payment is being processed
          </Text>

          {/* AMOUNT CARD */}
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amountValue}>{params?.price ?? '₹1299'}</Text>

            <View style={styles.processingRow}>
              <FontAwesome name="hourglass-half" size={14} color="#F59E0B" />
              <Text style={styles.processingText}>Processing...</Text>
            </View>
          </View>

        </View>
      </View>
    </ScreenView>
  );
};

export default ServiceCompletedScreen;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modal: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 24,
    alignItems: 'center',
  },

  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
  },

  subText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },

  amountCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },

  amountLabel: {
    fontSize: 13,
    color: '#6B7280',
  },

  amountValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#7C3AED',
    marginVertical: 6,
  },

  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  processingText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#F59E0B',
  },
});
