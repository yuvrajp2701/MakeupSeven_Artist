import React from 'react';
import { View, StyleSheet } from 'react-native';
import SearchHeader from '../components/SearchHeader';
import SearchTags from '../components/SearchTags';
import ScreenView from '../utils/ScreenView';

const SearchScreen = () => {
  return (
    <ScreenView>
    <View style={styles.container}>
      <SearchHeader />
      <SearchTags />
    </View>
    </ScreenView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7DDFF',
    paddingTop: 55,
  },
});
