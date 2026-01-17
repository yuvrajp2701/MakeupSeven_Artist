import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';

const categories = [
  { id: '1', title: 'Face mask', icon: require('../../asset/images/mask.png') },
  { id: '2', title: 'Face wash', icon: require('../../asset/images/face.png') },
  { id: '3', title: 'Manicures', icon: require('../../asset/images/nail.png') },
  { id: '4', title: 'Haircut', icon: require('../../asset/images/scissor.png') },
];

const CategoryList = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
<View style={styles.headerRow}>
  <Text style={styles.heading}>Explore our categories</Text>

  <View style={styles.seeAllWrapper}>
    <Text style={styles.seeAll}>See all</Text>
    <FontAwesome
      name="angle-right"
      size={32}
      style={{ marginLeft: 14 }}
    />
  </View>
</View>


      {/* Categories */}
      <View style={styles.row}>
        {categories.map(item => (
          <View key={item.id} style={styles.card}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.text}>{item.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
 container: {
  marginHorizontal: 20,
  marginTop: 10,
},

headerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 42,
},

heading: {
  fontSize: 20,
  fontWeight: '600',
},

seeAll: {
  fontSize: 17,
  color: '#2b2b2bff',
  fontWeight: '500',
},

row: {
  flexDirection: 'row',
  justifyContent: 'space-between', 
  alignItems: 'center',
},

card: {
  alignItems: 'center',
  width: '22%',
},

icon: {
  width: 60,
  height: 60,
  borderRadius: 30,
  marginBottom: 6,
},
seeAllWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
},


text: {
  marginTop: 9,
  fontWeight: '700',
  fontSize: 15,
  textAlign: 'center',
},

});

export default CategoryList;
