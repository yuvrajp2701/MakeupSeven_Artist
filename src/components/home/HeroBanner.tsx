import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Dimensions } from 'react-native';
import BrandLogo from '../BrandLogo';

const { width } = Dimensions.get('window');

const images = [
  require('../../asset/images/hero-face.png'),
  require('../../asset/images/hero-face.png'),
  require('../../asset/images/hero-face.png'),
  require('../../asset/images/hero-face.png'),
];

const HeroBanner = () => {
  const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      const next = (index + 1) % images.length;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setIndex(next);
    }, 3000);

    return () => clearInterval(interval);
  }, [index]);

  const onScrollEnd = (e: any) => {
    const currentIndex = Math.round(
      e.nativeEvent.contentOffset.x / width
    );
    setIndex(currentIndex);
  };

  return (
    <View style={styles.container}>

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item }) => (
          <Image source={item} style={styles.image} />
        )}
      />

      {/* Curve */}
      <View style={styles.curve} />

      {/* Text */}
      <View style={styles.textWrapper}>
        <BrandLogo />
        <Text style={styles.subtitle}>Skin & facials</Text>
        <Text style={styles.desc}>Glow everyday inside and out.</Text>
      </View>

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {images.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              index === i && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 295,
    marginHorizontal: 1,
    marginTop: -74,
    overflow: 'hidden',
    backgroundColor: '#EFE4FF',
  },

  image: {
    width,
    height: '100%',
    resizeMode: 'cover',
  },

  curve: {
    position: 'absolute',
    right: -100,
    top: -80,
    width: 330,
    height: 316,
    borderRadius: 200,
    backgroundColor: '#E6D8FF',
    borderWidth: 3,
    borderColor: '#7B4DFF',
  },

  textWrapper: {
    position: 'absolute',
    right: 10,
    top: 63,
  },

  subtitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#7B4DFF',
    marginTop: 23,
    right: -15,
  },

  desc: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
    marginTop: 2,
    right: -65,
  },

  dotsContainer: {
    position: 'absolute',
    bottom: 6,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6D8FF',
    paddingHorizontal: 1,
    paddingVertical: 4,
    borderRadius: 20,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1C4FF',
    marginHorizontal: 4,
  },

  activeDot: {
    width: 16,
    backgroundColor: '#7B4DFF',
  },
});

export default HeroBanner;
