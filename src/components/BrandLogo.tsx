import React from 'react';
import { Text, StyleSheet, View, TextStyle } from 'react-native';

interface BrandLogoProps {
  size?: number;          // base font size
  color?: string;         // main text color
  highlightColor?: string; // "Seven" color
  align?: 'left' | 'center' | 'right';
}

const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 28,
  color = '#000',
  highlightColor = '#8855FF',
  align = 'center',
}) => {
  return (
    <View style={{ alignItems: alignMap[align] }}>
      <Text style={[styles.logo, { fontSize: size, color }]}>
        Makeup
        <Text style={{ color: highlightColor }}>Seven</Text>
      </Text>
    </View>
  );
};

const alignMap: Record<'left' | 'center' | 'right', 'flex-start' | 'center' | 'flex-end'> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

const styles = StyleSheet.create({
  logo: {
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});

export default BrandLogo;
