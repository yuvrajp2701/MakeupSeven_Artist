// src/utils/Responsive.ts
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Based on iPhone 11 Pro's scale
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const scale = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
export const verticalScale = (size: number) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export const wp = (percentage: number) => (SCREEN_WIDTH * percentage) / 100;
export const hp = (percentage: number) => (SCREEN_HEIGHT * percentage) / 100;

export const SCREEN = {
    WIDTH: SCREEN_WIDTH,
    HEIGHT: SCREEN_HEIGHT,
};
