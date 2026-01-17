import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';

const HeaderLocation = () => {
  return (
    <View style={styles.container}>
      <FontAwesome name="map-marker" size={22} style={{ marginTop: -18 }} color="#000" />

      <View style={styles.textContainer}>
        {/* Title Row */}
        <View style={styles.titleRow}>
          <Text style={styles.locationTitle}>Sector 16 C</Text>
          <FontAwesome
            name="angle-down"
            size={30}
            color="#000"
            style={styles.arrow}
          />
        </View>

        {/* Subtitle */}
        <Text style={styles.locationSub}>
          Sector 16 C, Dwarka, New Delhi 110078, India
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 23,
    alignItems: 'center',
  },

  textContainer: {
    marginLeft: 12,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginRight: 6,
  },

  arrow: {
    marginTop: 1,
    marginLeft: 5,
  },

  locationSub: {
    fontSize: 13,
    color: '#0f0f0fff',
    marginTop: -5,
    marginLeft: -30,
  },
});

export default HeaderLocation;
