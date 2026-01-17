import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useNavigation } from '@react-navigation/native';

interface Props {
  label: string;
}

const TagItem: React.FC<Props> = ({ label }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={styles.tag}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('Products', { category: label })}
    >
      <FontAwesome name="arrow-up" size={12} color="#555" />
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

export default TagItem;

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8D0FF',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
  },

  text: {
    marginLeft: 6,
    fontSize: 14,
    color: '#333',
  },
});
