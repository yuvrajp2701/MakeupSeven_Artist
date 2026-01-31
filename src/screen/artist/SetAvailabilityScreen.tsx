import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import ScreenView from '../../utils/ScreenView';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// November 2024 (static for now – can be dynamic later)
const DATES = [
  null, null, null, null, 1, 2, 3,
  4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17,
  18, 19, 20, 21, 22, 23, 24,
  25, 26, 27, 28, 29, 30,
];

const SetAvailabilityScreen = ({ navigation }: any) => {
  const [availableDates, setAvailableDates] = useState<number[]>([
    4, 7, 12, 13, 16, 17, 18, 19, 20, 22, 23, 26, 28,
  ]);

  const toggleDate = (date: number) => {
    setAvailableDates(prev =>
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  return (
    <ScreenView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>

          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <FontAwesome name="angle-left" size={22} color="#7B4DFF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Set Availability</Text>

            <TouchableOpacity style={styles.iconBtn}>
              <FontAwesome name="save" size={18} color="#7B4DFF" />
            </TouchableOpacity>
          </View>

          {/* INSTRUCTION */}
          <Text style={styles.helperText}>
            Click on date to set that date as available
          </Text>

          {/* CALENDAR */}
          <View style={styles.calendarCard}>
            <View style={styles.monthRow}>
              <TouchableOpacity>
                <FontAwesome name="angle-left" size={18} />
              </TouchableOpacity>

              <Text style={styles.monthText}>November 2024</Text>

              <TouchableOpacity>
                <FontAwesome name="angle-right" size={18} />
              </TouchableOpacity>
            </View>

            {/* DAYS */}
            <View style={styles.daysRow}>
              {DAYS.map(d => (
                <Text key={d} style={styles.dayText}>{d}</Text>
              ))}
            </View>

            {/* DATES */}
            <View style={styles.datesGrid}>
              {DATES.map((date, index) =>
                date ? (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateCell,
                      availableDates.includes(date) && styles.activeDate,
                    ]}
                    onPress={() => toggleDate(date)}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        availableDates.includes(date) && styles.activeDateText,
                      ]}
                    >
                      {date}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View key={index} style={styles.dateCell} />
                )
              )}
            </View>

            {/* LEGEND */}
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={styles.legendDot} />
                <Text style={styles.legendText}>available</Text>
              </View>
            </View>
          </View>

          {/* LEGEND CARD */}
          <View style={styles.legendCard}>
            <Text style={styles.legendTitle}>Legend</Text>

            <View style={styles.legendLine}>
              <View style={styles.legendDot} />
              <Text style={styles.legendText}>Available</Text>
            </View>

            <View style={styles.legendLine}>
              <View style={styles.legendOutline} />
              <Text style={styles.legendText}>Unavailable</Text>
            </View>
          </View>

          {/* INFO CARD */}
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Keep your calendar updated to get more bookings.
              Customers can only book on dates marked as available.
            </Text>
          </View>

          {/* SAVE BUTTON */}
          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save Availability</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default SetAvailabilityScreen;
const styles = StyleSheet.create({
  container: { paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#EFE4FF',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7B4DFF',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  helperText: {
    marginTop: 16,
    marginHorizontal: 20,
    color: '#6B7280',
    fontSize: 13,
  },

  calendarCard: {
    marginTop: 14,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },

  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthText: { fontSize: 16, fontWeight: '600' },

  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  dayText: { width: '14%', textAlign: 'center', color: '#6B7280' },

  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  dateCell: {
    width: '14%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  dateText: { fontSize: 14 },
  activeDate: {
    backgroundColor: '#7B4DFF',
    borderRadius: 8,
  },
  activeDateText: { color: '#fff', fontWeight: '600' },
legendItem: {
  flexDirection: 'row',
  alignItems: 'center',
},
  legendRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  legendCard: {
    marginTop: 16,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  legendTitle: { fontWeight: '600', marginBottom: 8 },
  legendLine: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#7B4DFF',
    marginRight: 8,
  },
  legendOutline: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 8,
  },
  legendText: { fontSize: 13, color: '#374151' },

  infoCard: {
    marginTop: 16,
    marginHorizontal: 20,
    backgroundColor: '#FFF5EE',
    borderRadius: 16,
    padding: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },

  saveBtn: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: '#7B4DFF',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
