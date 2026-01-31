import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenView from '../../utils/ScreenView';

const ArtistCoursesScreen = () => {
  return (
    <ScreenView>
      <View style={styles.container}>
        <Text style={styles.title}>Courses</Text>
        <Text style={styles.subTitle}>
          Manage your enrolled & completed courses
        </Text>
      </View>
    </ScreenView>
  );
};

export default ArtistCoursesScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '500',
  },
  subTitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 6,
  },
});
