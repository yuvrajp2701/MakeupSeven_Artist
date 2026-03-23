import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import ScreenView from '../../utils/ScreenView';
import { apiCall } from '../../services/api';
import { getToken } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const SetAvailabilityScreen = ({ navigation }: any) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('21:00');
  const [showTimePicker, setShowTimePicker] = useState<'start' | 'end' | null>(null);
  const { userToken } = useAuth();

  // Helper to get dates for current selected month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dates: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) dates.push(null);
    for (let i = 1; i <= daysInMonth; i++) dates.push(i);
    return dates;
  };

  const toggleDate = (day: number) => {
    const dateKey = `${selectedMonth.getFullYear()}-${(selectedMonth.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setAvailableDates(prev =>
      prev.includes(dateKey)
        ? prev.filter(d => d !== dateKey)
        : [...prev, dateKey]
    );
  };

  // Generate time options from 00:00 to 23:30 in 30-minute intervals
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(time);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const handleTimeSelect = (time: string) => {
    if (showTimePicker === 'start') {
      setStartTime(time);
    } else if (showTimePicker === 'end') {
      setEndTime(time);
    }
    setShowTimePicker(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = userToken || await getToken();
      if (!token) {
        Alert.alert("Auth Error", "Please login again.");
        return;
      }

      if (availableDates.length === 0) {
        Alert.alert("Validation", "Please select at least one date.");
        return;
      }

      const availabilityData = availableDates.map(date => ({
        date,
        startTime,
        endTime
      }));

      await apiCall('/artist-availability/artist', {
        method: 'POST',
        token,
        body: { availability: availabilityData }
      });

      Alert.alert("Success", "Availability updated successfully!");
      navigation.goBack();
    } catch (e: any) {
      console.error('Save availability failed:', e);
      Alert.alert("Error", e.message || "Failed to update availability");
    } finally {
      setSaving(false);
    }
  };

  const changeMonth = (offset: number) => {
    const next = new Date(selectedMonth);
    next.setMonth(next.getMonth() + offset);
    setSelectedMonth(next);
  };

  const monthName = selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const DATES = getDaysInMonth(selectedMonth);

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

            <TouchableOpacity style={styles.iconBtn} onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator size="small" color="#7B4DFF" /> : <FontAwesome name="save" size={18} color="#7B4DFF" />}
            </TouchableOpacity>
          </View>

          {/* INSTRUCTION */}
          <Text style={styles.helperText}>
            Click on date to set that date as available for bookings.
          </Text>

          {/* CALENDAR */}
          <View style={styles.calendarCard}>
            <View style={styles.monthRow}>
              <TouchableOpacity onPress={() => changeMonth(-1)}>
                <FontAwesome name="angle-left" size={18} />
              </TouchableOpacity>

              <Text style={styles.monthText}>{monthName}</Text>

              <TouchableOpacity onPress={() => changeMonth(1)}>
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
              {DATES.map((date, index) => {
                const dateKey = date ? `${selectedMonth.getFullYear()}-${(selectedMonth.getMonth() + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}` : '';
                const isSelected = availableDates.includes(dateKey);

                return date ? (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateCell,
                      isSelected && styles.activeDate,
                    ]}
                    onPress={() => toggleDate(date)}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        isSelected && styles.activeDateText,
                      ]}
                    >
                      {date}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View key={index} style={styles.dateCell} />
                );
              })}
            </View>

            {/* LEGEND */}
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={styles.legendDot} />
                <Text style={styles.legendText}>available</Text>
              </View>
            </View>
          </View>

          {/* TIME SELECTION */}
          <View style={styles.timeCard}>
            <Text style={styles.timeTitle}>Working Hours</Text>
            
            <View style={styles.timeRow}>
              <View style={styles.timeItem}>
                <Text style={styles.timeLabel}>Start Time</Text>
                <TouchableOpacity 
                  style={styles.timeButton}
                  onPress={() => setShowTimePicker('start')}
                >
                  <Text style={styles.timeValue}>{startTime}</Text>
                  <FontAwesome name="clock-o" size={16} color="#7B4DFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.timeItem}>
                <Text style={styles.timeLabel}>End Time</Text>
                <TouchableOpacity 
                  style={styles.timeButton}
                  onPress={() => setShowTimePicker('end')}
                >
                  <Text style={styles.timeValue}>{endTime}</Text>
                  <FontAwesome name="clock-o" size={16} color="#7B4DFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* LEGEND CARD */}
          <View style={styles.legendCard}>
            <Text style={styles.legendTitle}>Legend</Text>

            <View style={styles.legendLine}>
              <View style={styles.legendDot} />
              <Text style={styles.legendText}>Available (Client can book you)</Text>
            </View>

            <View style={styles.legendLine}>
              <View style={styles.legendOutline} />
              <Text style={styles.legendText}>Unavailable (Offline)</Text>
            </View>
          </View>

          {/* INFO CARD */}
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Keep your calendar updated to get more bookings.
              Only dates marked in purple will be visible to customers for booking.
            </Text>
          </View>

          {/* SAVE BUTTON */}
          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Availability</Text>}
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* TIME PICKER MODAL */}
      {showTimePicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select {showTimePicker === 'start' ? 'Start' : 'End'} Time
              </Text>
              <TouchableOpacity onPress={() => setShowTimePicker(null)}>
                <FontAwesome name="times" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.timeList} showsVerticalScrollIndicator={false}>
              {timeOptions.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={styles.timeOption}
                  onPress={() => handleTimeSelect(time)}
                >
                  <Text style={styles.timeOptionText}>{time}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
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

  /* TIME SELECTION STYLES */
  timeCard: {
    marginTop: 16,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  timeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  timeItem: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  timeValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },

  /* MODAL STYLES */
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '80%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  timeList: {
    maxHeight: 300,
  },
  timeOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  timeOptionText: {
    fontSize: 16,
    color: '#111827',
    textAlign: 'center',
  },
});
