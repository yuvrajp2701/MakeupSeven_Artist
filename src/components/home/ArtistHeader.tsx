import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';

const ArtistHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Best Artists near you</Text>

      <View style={styles.locationRow}>
        <FontAwesome name="map-marker" size={18} color="#000" />
        <Text style={styles.locationText}>West Delhi</Text>
      </View>
    </View>
  );
};

export default ArtistHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: '600',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationText: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: '700',
  },
});
