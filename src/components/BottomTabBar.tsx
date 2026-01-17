import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';

const BottomTabBar = ({ active = 'Home' }) => {
  const tabs = [
    { name: 'Home', icon: 'home' },
    { name: 'Artists', icon: 'user' },
    { name: 'Bookings', icon: 'calendar' },
    { name: 'Profile', icon: 'user-circle' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = active === tab.name;

        return (
          <TouchableOpacity key={tab.name} style={styles.tab}>
            <FontAwesome
              name={tab.icon}
              size={22}
              color={isActive ? '#7B4DFF' : '#999'}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? '#7B4DFF' : '#999' },
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 85,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EDEDED',
  },

  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default BottomTabBar;
