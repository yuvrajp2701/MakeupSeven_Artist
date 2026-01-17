import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';

interface Props {
  item: {
    title: string;
    time: string;
    price: string;
    oldPrice: string;
    image: any;
  };
}

const ProductCard: React.FC<Props> = ({ item }) => {
  return (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />

      <TouchableOpacity style={styles.addBtn}>
        <Text style={styles.addText}>Add</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{item.title}</Text>

      <View style={styles.row}>
        <FontAwesome name="clock-o" size={15} color="#777" />
        <Text style={styles.time}>{item.time}</Text>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.oldPrice}>{item.oldPrice}</Text>
      </View>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    marginBottom: 9,
    marginHorizontal: 4,
    marginTop: 5,   
    borderWidth: 1,
    borderColor: '#FFE1CF',
  },

  image: {
    width: '100%',
    height: 100,
    borderRadius: 12,
  },

  addBtn: {
    position: 'absolute',
    top: 79,
    left: 47,
    alignSelf: 'center',
    backgroundColor: '#FFE1CF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: -2,
  },

  addText: {
    fontWeight: '600',
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  time: {
    marginLeft: 4,
    fontSize: 11,
    color: '#777',
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  price: {
    fontWeight: '700',
    fontSize: 17,
    marginRight: 6,
  },

  oldPrice: {
    fontSize: 12,
    color: '#d00101ff',
    textDecorationLine: 'line-through',
  },
});
