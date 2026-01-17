import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ArtistHeader from './ArtistHeader';
import ArtistCard from './ArtistCard';

const artists = [
  {
    id: '1',
    name: 'Priya Sharma',
    rating: '4.8 (128)',
    price: 'Starting from ₹1200',
    image: require('../../asset/images/artists1.png'),
  },
  {
    id: '2',
    name: 'Neha Verma',
    rating: '4.6 (98)',
    price: 'Starting from ₹1000',
    image: require('../../asset/images/artists2.png'),
  },
];

const ArtistList = () => {
  return (
    <View style={styles.container}>
      <ArtistHeader />

      <FlatList
        data={artists}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ArtistCard {...item} />}
      />
    </View>
  );
};

export default ArtistList;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginTop: 40,
  },
});
