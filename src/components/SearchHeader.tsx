import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import BackButton from './BackButton';

const SearchHeader = () => {
  return (
    <View style={styles.wrapper}>
      <BackButton />

      <View style={styles.searchBox}>
        <FontAwesome name="search" size={16} color="#999" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#999"
          style={styles.input}
        />
      </View>
    </View>
  );
};

export default SearchHeader;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    marginHorizontal: 20,
  },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    marginLeft: 10,
  },

  input: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});
