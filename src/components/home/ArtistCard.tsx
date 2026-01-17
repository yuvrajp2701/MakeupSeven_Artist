import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';

interface Props {
  image: any;
  name: string;
  rating: string;
  price: string;
}

const ArtistCard: React.FC<Props> = ({ image, name, rating, price }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={image} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>

        <View style={styles.ratingRow}>
          <FontAwesome name="star" size={14} color="#F5B301" />
          <Text style={styles.rating}>{rating}</Text>
        </View>

        <Text style={styles.price}>{price}</Text>

        <View style={styles.bottomRow}>
          <View style={styles.metaRow}>
            <FontAwesome name="map-marker" size={14} color="#777" />
            <Text style={styles.metaText}>2.5 km</Text>

            <FontAwesome
              name="clock-o"
              size={14}
              color="#777"
              style={{ marginLeft: 10 }}
            />
            <Text style={styles.metaText}>45 mins</Text>
          </View>

          <TouchableOpacity style={styles.bookBtn}>
            <Text style={styles.bookText}>Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ArtistCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 10,
    marginRight: 14,
    width: 270,
    borderWidth: 1.5,
    borderColor: '#FF9256',
  },

  image: {
    width: 76,
    height: 82,
    borderRadius: 12,
  },

  info: {
    marginLeft: 12,
    flex: 1,
  },

  name: {
    fontSize: 19,
    fontWeight: '600',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  rating: {
    marginLeft: 4,
    color: '#555',
    fontSize: 13,
  },

  price: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '400',
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: -84,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },

  bookBtn: {
    borderWidth: 1.5,
    borderColor: '#FF9256',
    backgroundColor: '#91614721',
    borderRadius: 11,
    marginTop: 6,   
    paddingHorizontal: 16,
    paddingVertical: 4,
  },

  bookText: {
    color: '#000000ff',
    fontWeight: '600',
  },
});
