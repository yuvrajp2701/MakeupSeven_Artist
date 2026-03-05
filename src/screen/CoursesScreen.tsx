import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useNavigation } from '@react-navigation/native';
import Colors from '../utils/Colors'; // Assuming Colors exists, otherwise will duplicate or use hex
import LinearGradient from 'react-native-linear-gradient';
import { apiCall } from '../services/api';
import { getToken } from '../services/auth';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const MOCK_COURSES = [
    {
        id: '1',
        title: 'Advanced Bridal Makeup Techniques',
        description: 'Master the art of bridal makeup with advanced techniques, color theory, and long-lasting',
        duration: '4.5 hours',
        lessons: '12 lessons',
        rating: 4.9,
        price: '₹1499',
        image: require('../asset/images/artists1.png'), // Placeholder
        badge: 'Advanced',
        status: 'Completed',
    },
    {
        id: '2',
        title: 'Editorial & Fashion Makeup',
        description: 'Learn creative and avant-garde makeup techniques for editorial shoots and fashion',
        duration: '3.5 hours',
        lessons: '10 lessons',
        rating: 4.8,
        price: '₹1299',
        image: require('../asset/images/artists2.png'), // Placeholder
        badge: 'Intermediate',
        status: 'Enroll',
    },
    {
        id: '3',
        title: 'Airbrush Makeup Fundamentals',
        description: 'Complete guide to airbrush makeup including equipment setup and professional techniques.',
        duration: '2.5 hours',
        lessons: '8 lessons',
        rating: 4.9,
        price: '₹999',
        image: require('../asset/images/bestartists1.png'), // Placeholder
        badge: 'Beginner',
        status: 'Enroll',
    },
];

const CoursesScreen = () => {
    const navigation = useNavigation<any>();
    const { userToken } = useAuth();
    const [courses, setCourses] = useState<any[]>(MOCK_COURSES);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ done: 1, certified: 1, total: 4 });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const token = userToken || (await getToken()) || undefined;

            // Note: Placeholder endpoint for now
            const response = await apiCall('/academy/courses', { method: 'GET', token });

            if (response && (Array.isArray(response) || response.data || response.courses)) {
                const fetchedList = Array.isArray(response) ? response : (response.courses || response.data || []);
                if (fetchedList.length > 0) {
                    setCourses(fetchedList);

                    // Update stats based on fetched data if available
                    setStats({
                        done: fetchedList.filter((c: any) => c.status === 'Completed').length,
                        certified: fetchedList.filter((c: any) => c.isCertified).length,
                        total: fetchedList.length
                    });
                }
            }
        } catch (error) {
            console.log('[Courses] Fetch failed, using mock data:', error);
            // Stay with mock data
        } finally {
            setLoading(false);
        }
    };

    const renderCourseItem = ({ item }: { item: any }) => (
        <View style={styles.courseCard}>
            <View style={styles.imageContainer}>
                <Image
                    source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                    style={styles.courseImage}
                    resizeMode="cover"
                />
                <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
                {item.status === 'Completed' && (
                    <View style={styles.certifiedBadge}>
                        <FontAwesome name="certificate" size={10} color="#fff" style={{ marginRight: 4 }} />
                        <Text style={styles.certifiedText}>Certified</Text>
                    </View>
                )}
            </View>

            <View style={styles.cardContent}>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <Text style={styles.courseDesc} numberOfLines={2}>{item.description}</Text>

                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <FontAwesome name="clock-o" size={12} color="#6B7280" />
                        <Text style={styles.metaText}>{item.duration}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <FontAwesome name="book" size={12} color="#6B7280" />
                        <Text style={styles.metaText}>{item.lessons}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <FontAwesome name="star" size={12} color="#FBBF24" />
                        <Text style={styles.metaText}>{item.rating}</Text>
                    </View>
                </View>

                <View style={styles.footerRow}>
                    <Text style={styles.price}>{item.price}</Text>

                    {item.status === 'Completed' ? (
                        <View style={styles.completedButton}>
                            <FontAwesome name="check" size={12} color="#10B981" />
                            <Text style={styles.completedBtnText}>Completed</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.enrollButton}
                            onPress={() => navigation.navigate('CourseDetails', {
                                course: item
                            })}
                        >
                            <Text style={styles.enrollBtnText}>Enroll Now</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Professional Courses</Text>
                <Text style={styles.headerSubtitle}>Learn from industry experts</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchCourses} />
                }
            >

                {/* Progress Card */}
                <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.progressCard}
                >
                    <View style={styles.progressRow}>
                        <View>
                            <Text style={styles.progressLabel}>Your Progress</Text>
                            <View style={styles.ratioRow}>
                                <Text style={styles.ratioMain}>{stats.done}/</Text>
                                <Text style={styles.ratioTotal}>{stats.total}</Text>
                            </View>
                            <Text style={styles.ratioLabel}>Total</Text>
                        </View>

                        <View style={styles.chartContainer}>
                            {/* Placeholder for chart icon */}
                            <View style={styles.chartIconCircle}>
                                <FontAwesome name="line-chart" size={16} color="#fff" />
                            </View>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.done}</Text>
                            <Text style={styles.statLabel}>Done</Text>
                        </View>
                        <View style={[styles.statItem, { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.2)', paddingLeft: 20 }]}>
                            <Text style={styles.statValue}>{stats.certified}</Text>
                            <Text style={styles.statLabel}>Certified</Text>
                        </View>
                    </View>
                </LinearGradient>

                <Text style={styles.sectionTitle}>All Courses</Text>

                {courses.map(course => (
                    <View key={course.id} style={{ marginBottom: 16 }}>
                        {renderCourseItem({ item: course })}
                    </View>
                ))}

                <View style={{ height: 80 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 10,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    scrollContent: {
        padding: 16,
    },
    progressCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    progressLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginBottom: 4,
    },
    ratioRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    ratioMain: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
    },
    ratioTotal: {
        fontSize: 20,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.8)',
    },
    ratioLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 30,
    },
    statItem: {

    },
    statValue: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
    },
    chartContainer: {
        justifyContent: 'flex-start',
    },
    chartIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },

    // Course Card
    courseCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    imageContainer: {
        height: 150,
        width: '100%',
        position: 'relative',
    },
    courseImage: {
        width: '100%',
        height: '100%',
    },
    badgeContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
    certifiedBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#10B981',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    certifiedText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    cardContent: {
        padding: 16,
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 6,
    },
    courseDesc: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 12,
        lineHeight: 18,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 4,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        color: '#7C3AED',
    },
    enrollButton: {
        backgroundColor: '#7C3AED',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    enrollBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
    completedButton: {
        backgroundColor: '#D1FAE5',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    completedBtnText: {
        color: '#10B981',
        fontWeight: '600',
        fontSize: 13,
        marginLeft: 6,
    },
});

export default CoursesScreen;
