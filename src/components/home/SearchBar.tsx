import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useNavigation } from '@react-navigation/native';

const SearchBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      
      {/* Search box */}
      <TouchableOpacity
        style={styles.searchBox}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Search')}
      >
        <FontAwesome name="search" size={18} color="#999" />
        <TextInput
          pointerEvents="none" 
          editable={false}
          placeholder="Search"
          placeholderTextColor="#999"
          style={styles.input}
        />
      </TouchableOpacity>

      {/* Filter button */}
      <TouchableOpacity style={styles.filterBox}>
        <FontAwesome name="sliders" size={18} color="#7B4DFF" />
      </TouchableOpacity>

    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 3,
    marginBottom: 12,
    gap: 10,
    zIndex: 5,
  },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    paddingHorizontal: 20,
    height: 50,
  },

  input: {
    flex: 1,
    fontSize: 17,
    marginLeft: 15,
    color: '#333',
  },

  filterBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
