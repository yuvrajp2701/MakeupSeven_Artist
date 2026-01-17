import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TagItem from './TagItem';

const tags = [
  'Waxing',
  'Facial',
  'Hydra Facial',
  'Spa',
  'Hair Cut',
  'Pedicure',
  'Head Massage',
  'Threading',
  'Mani-Pedi',
  'Body Polishing',
  'Clean-up',
  'Nail',
  'Hair Spa',
];

const SearchTags = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trending searches near you</Text>

      <View style={styles.tagsWrapper}>
        {tags.map((item, index) => (
          <TagItem key={index} label={item} />
        ))}
      </View>
    </View>
  );
};

export default SearchTags;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    flex: 1,
  },

  title: {
    fontSize: 19,
    fontWeight: '600',
    marginBottom: 17,
    color: '#000',
  },

  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
