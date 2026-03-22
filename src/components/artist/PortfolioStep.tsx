import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import styles from './styles/createArtistStyles';

const STATIC_IMAGES = [
    require('../../asset/images/facial.png'),
    require('../../asset/images/artists1.png'),
    require('../../asset/images/artists2.png'),
    require('../../asset/images/bestartists1.png'),
];

interface Props {
    pickDocument?: (onFilePicked: (file: any) => void) => void;
}

const PortfolioStep: React.FC<Props> = ({ pickDocument }) => {
    const [portfolioImages, setPortfolioImages] = useState<any[]>(STATIC_IMAGES);

    const handleUpload = () => {
        if (pickDocument) {
            pickDocument((file) => {
                setPortfolioImages([...portfolioImages, file]);
            });
        }
    };

    return (
        <View>
            <Text style={[styles.sectionHeader, { marginBottom: 8 }]}>Portfolio Images & Videos</Text>
            <Text style={styles.helperText}>Upload clear, well lit photos to get more bookings</Text>

            <TouchableOpacity
                style={styles.uploadBox}
                activeOpacity={0.8}
                onPress={handleUpload}
            >
                <View style={styles.uploadIconCircle}>
                    <FontAwesome name="paperclip" size={20} color="#7C3AED" />
                </View>
                <Text style={styles.uploadTitle}>Attach Portfolio Files</Text>
                <Text style={styles.uploadSubtitle}>PNG, JPG, PDF up to 10MB each</Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Your portfolio</Text>
            <View style={styles.imageGrid}>
                {portfolioImages.map((img, index) => (
                    <View key={index} style={styles.gridImageWrapper}>
                        {typeof img === 'number' || img.type?.includes('image') ? (
                            <Image source={typeof img === 'number' ? img : { uri: img.uri }} style={styles.gridImage} resizeMode="cover" />
                        ) : (
                            <View style={[styles.gridImage, { backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }]}>
                                <FontAwesome name="file-text-o" size={30} color="#7C3AED" />
                                <Text style={{ fontSize: 9, marginTop: 4, textAlign: 'center', paddingHorizontal: 4 }} numberOfLines={1}>{img.name}</Text>
                            </View>
                        )}
                        <TouchableOpacity
                            style={styles.removeBtnSmall}
                            onPress={() => setPortfolioImages(portfolioImages.filter((_, i) => i !== index))}
                        >
                            <FontAwesome name="times" size={10} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default PortfolioStep;
