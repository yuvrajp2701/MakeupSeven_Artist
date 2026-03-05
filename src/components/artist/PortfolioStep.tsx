import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import styles from './styles/createArtistStyles';

const PORTFOLIO_IMAGES = [
    require('../../asset/images/facial.png'),
    require('../../asset/images/artists1.png'),
    require('../../asset/images/artists2.png'),
    require('../../asset/images/bestartists1.png'),
];

const PortfolioStep: React.FC = () => {
    return (
        <View>
            <Text style={[styles.sectionHeader, { marginBottom: 8 }]}>Portfolio Images & Videos</Text>
            <Text style={styles.helperText}>Upload clear, well lit photos to get more bookings</Text>

            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8}>
                <View style={styles.uploadIconCircle}>
                    <FontAwesome name="upload" size={20} color="#7C3AED" />
                </View>
                <Text style={styles.uploadTitle}>Upload Images / videos</Text>
                <Text style={styles.uploadSubtitle}>PNG, JPG up to 50MB each</Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Your portfolio images</Text>
            <View style={styles.imageGrid}>
                {PORTFOLIO_IMAGES.map((img, index) => (
                    <View key={index} style={styles.gridImageWrapper}>
                        <Image source={img} style={styles.gridImage} resizeMode="cover" />
                    </View>
                ))}
            </View>
        </View>
    );
};

export default PortfolioStep;
