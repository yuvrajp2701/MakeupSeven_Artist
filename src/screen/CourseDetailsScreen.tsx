import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const CourseDetailsScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const course = route.params?.course || {
        title: 'Editorial & Fashion Makeup',
        image: require('../asset/images/artists2.png'),
        badge: 'Intermediate',
        rating: 4.8,
        price: '₹1299',
        duration: '3.5 hours',
        lessons: '10 lessons',
        description: 'Learn creative and avant-garde makeup techniques for editorial shoots and fashion shows.',
    };

    const lessons = [
        { id: 1, title: 'Lesson 1: Editorial Techniques', duration: '20 min' },
        { id: 2, title: 'Lesson 2: Editorial Techniques', duration: '22 min' },
        { id: 3, title: 'Lesson 3: Editorial Techniques', duration: '24 min' },
        { id: 4, title: 'Lesson 4: Editorial Techniques', duration: '26 min' },
        { id: 5, title: 'Lesson 5: Editorial Techniques', duration: '28 min' },
        { id: 6, title: 'Lesson 6: Editorial Techniques', duration: '30 min' },
    ];

    const learningPoints = [
        'Editorial makeup styles and trends',
        'Creative color application',
        'Working with photographers',
        'Runway makeup techniques',
    ];

    const intPrice = typeof course.price === 'string'
        ? parseInt(course.price.replace(/[^0-9]/g, ''))
        : course.price;

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Hero Header */}
                <ImageBackground source={course.image} style={styles.heroImage}>
                    <LinearGradient
                        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
                        style={styles.heroGradient}
                    >
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <FontAwesome name="arrow-left" size={18} color="#fff" />
                        </TouchableOpacity>

                        <View style={styles.heroContent}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{course.badge}</Text>
                            </View>
                            <Text style={styles.heroTitle}>{course.title}</Text>
                            <View style={styles.heroMetaRow}>
                                <View style={styles.metaItem}>
                                    <FontAwesome name="star" size={12} color="#FBBF24" />
                                    <Text style={styles.metaText}>{course.rating}</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <FontAwesome name="users" size={12} color="#ccc" />
                                    <Text style={styles.metaText}>1,923</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <FontAwesome name="clock-o" size={12} color="#ccc" />
                                    <Text style={styles.metaText}>{course.duration}</Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </ImageBackground>

                <View style={styles.contentContainer}>
                    {/* Instructor */}
                    <View style={styles.instructorRow}>
                        <Image
                            source={require('../asset/images/face.png')}
                            style={styles.instructorAvatar}
                        />
                        <View>
                            <Text style={styles.instructorLabel}>Instructor</Text>
                            <Text style={styles.instructorName}>MakeupSeven Academy</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* About */}
                    <Text style={styles.sectionTitle}>About This Course</Text>
                    <Text style={styles.descriptionText}>
                        {course.description}
                    </Text>

                    {/* What You'll Learn */}
                    <Text style={styles.sectionTitle}>What You'll Learn</Text>
                    <View style={styles.learningBox}>
                        {learningPoints.map((point, index) => (
                            <View key={index} style={styles.learningPoint}>
                                <View style={styles.checkCircle}>
                                    <FontAwesome name="check" size={10} color="#fff" />
                                </View>
                                <Text style={styles.learningText}>{point}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Course Content */}
                    <Text style={styles.sectionTitle}>Course Content (10 lessons)</Text>
                    <View style={styles.lessonList}>
                        {lessons.map((lesson, index) => (
                            <View key={lesson.id} style={styles.lessonItem}>
                                <View style={styles.playIconCircle}>
                                    <FontAwesome name="play-circle-o" size={20} color="#6B7280" />
                                </View>
                                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                                <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                            </View>
                        ))}
                        <TouchableOpacity style={styles.moreLessonsBtn}>
                            <Text style={styles.moreLessonsText}>+4 more lessons</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View>
                    <Text style={styles.priceLabel}>Price</Text>
                    <Text style={styles.priceValue}>₹{intPrice}</Text>
                </View>
                <TouchableOpacity
                    style={styles.purchaseBtn}
                    onPress={() => navigation.navigate('CoursePlayer', {
                        course: course
                    })}
                >
                    <Text style={styles.purchaseBtnText}>Purchase & Start</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    heroImage: {
        width: '100%',
        height: 280,
    },
    heroGradient: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 50,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroContent: {
        marginBottom: 10,
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 10,
    },
    heroMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        color: '#eee',
        fontSize: 13,
    },
    contentContainer: {
        padding: 20,
    },
    instructorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    instructorAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    instructorLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    instructorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
        marginTop: 8,
    },
    descriptionText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 22,
        marginBottom: 24,
    },
    learningBox: {
        backgroundColor: '#F3ECFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    learningPoint: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#8B5CF6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    learningText: {
        fontSize: 13,
        color: '#4B5563',
        flex: 1,
    },
    lessonList: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    lessonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    playIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    lessonTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
        flex: 1,
    },
    lessonDuration: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    moreLessonsBtn: {
        padding: 16,
        alignItems: 'center',
    },
    moreLessonsText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#8B5CF6',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    priceLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    priceValue: {
        fontSize: 22,
        fontWeight: '700',
        color: '#7C3AED',
    },
    purchaseBtn: {
        backgroundColor: '#8B5CF6',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
    },
    purchaseBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CourseDetailsScreen;
