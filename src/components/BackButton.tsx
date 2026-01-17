import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useNavigation } from '@react-navigation/native';

interface BackButtonProps {
  color?: string;
  size?: number;
  backgroundColor?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  color = '#7B4DFF',
  size = 22,
  backgroundColor = '#bea6ff41',
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={() => navigation.goBack()}
      activeOpacity={0.8}
    >
      <FontAwesome name="arrow-left" size={size} color={color} />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
