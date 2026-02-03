import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import HeaderLocation from '../components/home/HeaderLocation';
import SearchBar from '../components/home/SearchBar';
import HeroBanner from '../components/home/HeroBanner';
import CategoryList from '../components/home/CategoryList';
import ArtistList from '../components/home/ArtistList';
import BottomTabBar from '../components/BottomTabBar';
import ScreenView from '../utils/ScreenView';

const HomeScreen = () => {
  return (
    <ScreenView>
      <LinearGradient
        colors={['#FFFFFF', '#FFFAF7']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, backgroundColor: '#F6F1FF' }}>
            <HeaderLocation />
            <SearchBar />
            <HeroBanner />
          </View>
          <CategoryList />
          <ArtistList />
        </ScrollView>
      </LinearGradient>
      {/* <BottomTabBar active="Home" /> */}
    </ScreenView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
  },
});
