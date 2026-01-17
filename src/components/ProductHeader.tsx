import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import BackButton from '../components/BackButton';

const ProductHeader = () => {
  return (
    <View style={styles.header}>
      <BackButton />

      <View style={styles.searchBox}>
        <FontAwesome name="search" size={16} color="#999" />
        <Text style={styles.searchText}>Facial</Text>
      </View>
    </View>
  );
};

export default ProductHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  searchBox: {
    flex: 1,
    marginLeft: 10,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  searchText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#999',
  },
});
