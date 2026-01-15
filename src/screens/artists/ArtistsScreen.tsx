import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../utils/Colors';
import { scale, verticalScale, moderateScale, hp } from '../../utils/Responsive';

const CATEGORIES = ['Waxing', 'Facial', 'Pedicure', 'Hydra Facial'];

const ARTISTS = [
    {
        id: '1',
        name: 'Priya Sharma',
        rating: 4.8,
        reviews: 128,
        desc: 'Beauty Artist, and other skills add here',
        price: 1299,
        oldPrice: 1599,
        distance: '2.5 km',
        time: '45 mins',
        image: require('../../asset/images/artists1.png'),
        location: 'West Delhi',
        starting: '1,200rs',
    },
    {
        id: '2',
        name: 'Priya Sharma',
        rating: 4.8,
        reviews: 128,
        desc: 'Beauty Artist, and other skills add here',
        price: 1299,
        oldPrice: 1599,
        distance: '2.5 km',
        time: '45 mins',
        image: require('../../asset/images/artists2.png'),
        location: 'West Delhi',
        starting: '1,200rs',
    },
    {
        id: '3',
        name: 'Priya Sharma',
        rating: 4.8,
        reviews: 128,
        desc: 'Beauty Artist, and other skills add here',
        price: 1299,
        oldPrice: 1599,
        distance: '2.5 km',
        time: '45 mins',
        image: require('../../asset/images/artists2.png'),
        location: 'West Delhi',
        starting: '1,200rs',
    },
];

const ArtistsScreen = () => {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const filteredArtists = ARTISTS.filter(
        artist =>
            (!selectedCategory ||
                artist.desc.toLowerCase().includes(selectedCategory.toLowerCase())) &&
            (!search ||
                artist.name.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={[Colors.secondary, Colors.white]}
                style={styles.header}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            >
                <Text style={styles.headerTitle}>Best Artists for you</Text>

                <View style={styles.searchBarRow}>
                    <View style={styles.searchBarContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search"
                            value={search}
                            onChangeText={setSearch}
                            placeholderTextColor={Colors.textSecondary}
                        />
                    </View>

                    <TouchableOpacity style={styles.filterBtn}>
                        <Image
                            source={require('../../asset/images/Filter.png')}
                            style={styles.filterIcon}
                        />
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {CATEGORIES.map(item => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.chip,
                                selectedCategory === item && styles.chipActive,
                            ]}
                            onPress={() =>
                                setSelectedCategory(selectedCategory === item ? '' : item)
                            }
                        >
                            <Text
                                style={[
                                    styles.chipText,
                                    selectedCategory === item && styles.chipTextActive,
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </LinearGradient>

            {/* Best Artists */}
            <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Best Artists near you</Text>
                <View style={styles.locationRow}>
                    <Image
                        source={require('../../asset/images/location.png')}
                        style={styles.locationIcon}
                    />
                    <Text>West Delhi</Text>
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalContent}
            >
                {ARTISTS.map(item => (
                    <View key={item.id} style={styles.bestArtistCard}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={item.image} style={styles.bestArtistImg} />

                            <View>
                                <Text style={styles.artistName}>{item.name}</Text>
                                <View style={styles.ratingRow}>
                                    <Text style={styles.ratingStar}>★</Text>
                                    <Text style={styles.ratingText}>{item.rating}</Text>
                                    <Text style={styles.ratingCount}> ({item.reviews})</Text>
                                </View>
                                <Text style={styles.startingText}>
                                    Starting from {item.starting}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <Image
                                source={require('../../asset/images/location.png')}
                                style={styles.infoIcon}
                            />
                            <Text style={styles.infoText}>{item.distance}</Text>

                            <Image
                                source={require('../../asset/images/Time.png')}
                                style={styles.infoIcon}
                            />
                            <Text style={styles.infoText}>{item.time}</Text>

                            <TouchableOpacity style={styles.bookBtn}>
                                <Text style={styles.bookBtnText}>Book</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Top Artists */}
            <Text style={styles.sectionTitle2}>Our Top Artists</Text>

            <FlatList
                data={filteredArtists}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                    <View style={styles.topArtistCard}>
                        <Image source={item.image} style={styles.topArtistImg} />

                        <View style={{ flex: 1 }}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.artistName}>{item.name}</Text>
                                <View style={styles.ratingRow}>
                                    <Text style={styles.ratingStar}>★</Text>
                                    <Text style={styles.ratingText}>{item.rating}</Text>
                                    <Text style={styles.ratingCount}> ({item.reviews})</Text>
                                </View>
                            </View>

                            <Text style={styles.artistDesc}>{item.desc}</Text>

                            <View style={styles.rowBetween}>
                                <View style={styles.priceRow}>
                                    <Text style={styles.price}>₹{item.price}</Text>
                                    <Text style={styles.oldPrice}>₹{item.oldPrice}</Text>
                                </View>
                                <Text style={styles.distance}>{item.distance}</Text>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },

    header: {
        paddingTop: hp(4),
        paddingBottom: hp(2),
        paddingHorizontal: scale(12),
        borderBottomLeftRadius: scale(28),
        borderBottomRightRadius: scale(28),
    },

    headerTitle: {
        fontSize: scale(18),
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: verticalScale(8),
    },

    searchBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(8),
    },

    searchBarContainer: {
        flex: 1,
        backgroundColor: Colors.inputBackground,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.primary,
        paddingHorizontal: 8,
        marginRight: 8,
    },

    searchInput: {
        height: scale(40),
        fontSize: scale(14),
        color: Colors.text,
    },

    filterBtn: {
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        padding: 10,
    },

    filterIcon: {
        width: 20,
        height: 20,
        tintColor: Colors.primary,
    },

    chip: {
        backgroundColor: Colors.inputBackground,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 6,
        marginRight: 8,
    },

    chipActive: {
        backgroundColor: Colors.primary,
    },

    chipText: {
        fontSize: scale(13),
        color: Colors.text,
    },

    chipTextActive: {
        color: Colors.white,
        fontWeight: 'bold',
    },

    sectionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: scale(12),
        marginVertical: verticalScale(6),
    },

    sectionTitle: {
        fontSize: scale(15),
        fontWeight: 'bold',
    },

    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    locationIcon: {
        width: 16,
        height: 16,
        tintColor: Colors.primary,
        marginRight: 4,
    },

    horizontalContent: {
        paddingHorizontal: scale(12),
    },

    bestArtistCard: {
        backgroundColor: Colors.inputBackground,
        borderRadius: 14,
        padding: 10,
        marginRight: 12,
        borderWidth: 1,
        borderColor: Colors.primary,
        width: scale(260),
    },

    bestArtistImg: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 10,
    },

    artistName: {
        fontSize: scale(15),
        fontWeight: 'bold',
    },

    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    ratingStar: {
        color: Colors.primary,
    },

    ratingText: {
        fontWeight: 'bold',
        color: Colors.primary,
    },

    ratingCount: {
        fontSize: scale(12),
        color: Colors.textSecondary,
    },

    startingText: {
        fontSize: scale(12),
        color: Colors.textSecondary,
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },

    infoIcon: {
        width: 14,
        height: 14,
        tintColor: Colors.textSecondary,
        marginRight: 4,
    },

    infoText: {
        fontSize: scale(12),
        color: Colors.textSecondary,
        marginRight: 10,
    },

    bookBtn: {
        marginLeft: 'auto',
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 4,
    },

    bookBtnText: {
        color: Colors.primary,
        fontWeight: 'bold',
    },

    sectionTitle2: {
        fontSize: scale(15),
        fontWeight: 'bold',
        marginHorizontal: scale(12),
        marginVertical: verticalScale(6),
    },

    topArtistCard: {
        flexDirection: 'row',
        backgroundColor: Colors.inputBackground,
        borderRadius: 14,
        padding: 10,
        marginHorizontal: scale(12),
        marginBottom: 12,
    },

    topArtistImg: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 10,
    },

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    artistDesc: {
        fontSize: scale(13),
        color: Colors.text,
    },

    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    price: {
        fontWeight: 'bold',
        fontSize: scale(15),
        marginRight: 6,
    },

    oldPrice: {
        textDecorationLine: 'line-through',
        fontSize: scale(12),
        color: Colors.textSecondary,
    },

    distance: {
        fontSize: scale(12),
        color: Colors.textSecondary,
    },
});

export default ArtistsScreen;
