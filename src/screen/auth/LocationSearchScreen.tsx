import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../utils/Colors';
import { scale, verticalScale, moderateScale, hp } from '../../utils/Responsive';
import { apiCall } from '../../services/api';
import { getToken } from '../../services/auth';

const LOCATIONS = [
    {
        id: '1',
        title: 'New Delhi',
        subtitle: 'Street Delhi, India',
        icon: require('../../asset/images/location.png'),
    },
    {
        id: '2',
        title: 'New Delhi metro station',
        subtitle: 'Ajmeri Gate, New Delhi, Delhi, India',
        icon: require('../../asset/images/location.png'),
    },
];

const LocationSearchScreen = ({ navigation }: any) => {
    const [search, setSearch] = useState('');
    const [locations, setLocations] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const response = await apiCall('/service-zones/getServiceZones?type=POLYGON&ownerType=MASTER_CITY&isActive=true', {
                method: 'GET',
                token: token || undefined
            });

            const zones = Array.isArray(response) ? response : (response?.data || response?.zones || []);
            const mapped = zones.map((z: any) => ({
                id: z.id || z._id,
                title: z.name || 'Unknown Zone',
                subtitle: z.city || 'Available Service Area',
                icon: require('../../asset/images/location.png'),
            }));

            setLocations(mapped);
            setFiltered(mapped);
        } catch (error) {
            console.warn('Failed to fetch service zones:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (text: string) => {
        setSearch(text);
        if (!text) {
            setFiltered(locations);
        } else {
            setFiltered(
                locations.filter(item =>
                    item.title.toLowerCase().includes(text.toLowerCase())
                )
            );
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.secondary, Colors.white]}
                style={styles.header}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            >
                <TouchableOpacity style={styles.backBtn} onPress={navigation.goBack}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
            </LinearGradient>
            <View style={styles.content}>
                <Text style={styles.heading}>Enter your location</Text>
                <View style={styles.searchRow}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for area, street name"
                        value={search}
                        onChangeText={handleSearch}
                    />
                </View>
                <TouchableOpacity style={styles.currentLocRow}>
                    <Image
                        source={require('../../asset/images/pinLocation.png')}
                        style={styles.locIcon}
                        resizeMode="contain"
                    />
                    <Text style={styles.currentLocText}>Use your current location</Text>
                </TouchableOpacity>
                {loading ? (
                    <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={filtered}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => navigation.navigate('ReferralCode')} style={styles.resultRow}>
                                <Image source={item.icon} style={styles.locIcon} />
                                <View>
                                    <Text style={styles.resultTitle}>{item.title}</Text>
                                    <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        style={styles.resultList}
                    />
                )}
            </View>
        </View>
    );
};

export default LocationSearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        paddingTop: hp(4),
        paddingBottom: hp(2),
        paddingHorizontal: scale(20),
    },
    backBtn: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(12),
        backgroundColor: Colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(10),
    },
    backText: {
        fontSize: scale(22),
        fontWeight: 'bold',
        color: Colors.primary,
    },
    content: {
        flex: 1,
        paddingHorizontal: scale(24),
    },
    heading: {
        fontSize: scale(16),
        fontWeight: '400',
        marginBottom: verticalScale(12),
        color: Colors.black,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(8),
    },
    searchInput: {
        flex: 1,
        height: scale(44),
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: moderateScale(10),
        paddingHorizontal: scale(16),
        fontSize: scale(14),
        backgroundColor: Colors.inputBackground,
        fontWeight: '400',
    },
    currentLocRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(8),
        marginBottom: verticalScale(12),
    },
    locIcon: {
        width: scale(20),
        height: scale(20),
        marginRight: scale(8),
    },
    currentLocText: {
        color: Colors.textblue,
        fontSize: scale(15),
        fontWeight: '500'
    },
    resultList: {
        marginTop: verticalScale(8),
    },
    resultRow: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: Colors.inputBackground,
        borderRadius: 10,
        padding: scale(12),
        marginBottom: verticalScale(10),
        borderWidth: 1,
        borderColor: Colors.border,
    },
    resultTitle: {
        fontSize: scale(14),
        fontWeight: '500',
        color: Colors.black,
    },
    resultSubtitle: {
        fontSize: scale(12),
        color: Colors.text,
        fontWeight: '400',
    },
});
