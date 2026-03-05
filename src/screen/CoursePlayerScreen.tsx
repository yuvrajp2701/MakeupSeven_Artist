import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenView from '../utils/ScreenView';

const { width, height } = Dimensions.get('window');

const CoursePlayerScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    // Default course data
    const course = route.params?.course || {
        title: 'Editorial & Fashion Makeup',
        image: require('../asset/images/artists2.png'),
    };

    const [activeLessonId, setActiveLessonId] = useState(1);
    const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);

    const lessons = [
        { id: 1, title: 'Lesson 1: Editorial Techniques', duration: '20 min' },
        { id: 2, title: 'Lesson 2: Editorial Techniques', duration: '22 min' },
        { id: 3, title: 'Lesson 3: Editorial Techniques', duration: '24 min' },
        { id: 4, title: 'Lesson 4: Editorial Techniques', duration: '26 min' },
        { id: 5, title: 'Lesson 5: Editorial Techniques', duration: '28 min' },
        { id: 6, title: 'Lesson 6: Editorial Techniques', duration: '30 min' },
        { id: 7, title: 'Lesson 7: Editorial Techniques', duration: '32 min' },
    ];

    const currentLesson = lessons.find(l => l.id === activeLessonId) || lessons[0];

    const handleMarkComplete = () => {
        if (!completedLessonIds.includes(activeLessonId)) {
            setCompletedLessonIds([...completedLessonIds, activeLessonId]);
        }

        const nextLessonId = activeLessonId + 1;
        const hasNextLesson = lessons.some(l => l.id === nextLessonId);

        if (hasNextLesson) {
            setActiveLessonId(nextLessonId);
        }
    };

    return (
        <View style={styles.container}>
            {/* Video Player Area used placeholder image */}
            <ImageBackground
                source={typeof course.image === 'string' ? { uri: course.image } : course.image}
                style={styles.videoPlayer}
            >
                <View style={styles.videoOverlay}>
                    {/* Header Controls */}
                    <View style={styles.videoHeader}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                            <FontAwesome name="arrow-left" size={20} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', gap: 16 }}>
                            <TouchableOpacity style={styles.headerBtn}>
                                <FontAwesome name="share-alt" size={18} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerBtn}>
                                <FontAwesome name="bookmark-o" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Play Button */}
                    <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
                        <FontAwesome name="play" size={32} color="#fff" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>

                    {/* Duration Label */}
                    <View style={styles.durationLabel}>
                        <Text style={styles.durationText}>20 min</Text>
                    </View>
                </View>
            </ImageBackground>

            {/* Bottom Sheet Content */}
            <View style={styles.bottomSheet}>
                <View style={styles.handleBar} />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                    {/* Current Lesson Info */}
                    <View style={styles.currentLessonHeader}>
                        <View style={styles.lessonIconCircle}>
                            <FontAwesome name="play-circle-o" size={20} color="#8B5CF6" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.currentLessonTitle}>{currentLesson.title}</Text>
                            <Text style={styles.currentLessonSub}>{currentLesson.duration}</Text>
                        </View>
                    </View>

                    {/* Lesson Description Note */}
                    <View style={styles.noteBox}>
                        <Text style={styles.noteText}>
                            In this lesson, you'll learn advanced techniques and professional tips to master this important skill. Follow along and practice to get the best results.
                        </Text>
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity style={styles.markCompleteBtn} onPress={handleMarkComplete}>
                        <FontAwesome name="check-circle-o" size={18} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.markCompleteText}>Mark Complete & Continue</Text>
                    </TouchableOpacity>

                    {/* Course Content List */}
                    <Text style={styles.sectionTitle}>Course Content</Text>
                    <View style={styles.listContainer}>
                        {lessons.map((lesson) => {
                            const isActive = lesson.id === activeLessonId;
                            const isCompleted = completedLessonIds.includes(lesson.id);

                            return (
                                <TouchableOpacity
                                    key={lesson.id}
                                    style={[
                                        styles.lessonItem,
                                        isActive && styles.activeLessonItem,
                                        isCompleted && !isActive && styles.completedLessonItem
                                    ]}
                                    onPress={() => setActiveLessonId(lesson.id)}
                                >
                                    <View style={[
                                        styles.itemIcon,
                                        isActive && styles.activeItemIcon,
                                        isCompleted && !isActive && styles.completedItemIcon
                                    ]}>
                                        <FontAwesome
                                            name={isCompleted ? "check" : (isActive ? "play-circle" : "play-circle-o")}
                                            size={isCompleted ? 14 : 20}
                                            color={isActive || isCompleted ? "#fff" : "#9CA3AF"}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.itemTitle, isActive && styles.activeItemTitle]}>
                                            {lesson.title}
                                        </Text>
                                        <Text style={[styles.itemDuration, isActive && styles.activeItemDuration]}>
                                            {lesson.duration}
                                        </Text>
                                    </View>
                                    {isActive && (
                                        <View style={styles.activeDot} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Video background
    },
    videoPlayer: {
        width: '100%',
        height: height * 0.35, // Top 35% height
    },
    videoOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoHeader: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    headerBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#8B5CF6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'rgba(139, 92, 246, 0.4)',
    },
    durationLabel: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    durationText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    bottomSheet: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: -20, // Overlap video slightly
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    currentLessonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    lessonIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3ECFF', // Light purple
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    currentLessonTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 2,
    },
    currentLessonSub: {
        fontSize: 12,
        color: '#6B7280',
    },
    noteBox: {
        backgroundColor: '#FFF7ED', // Light Orange-ish
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFEDD5',
        marginBottom: 20,
    },
    noteText: {
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 20,
    },
    markCompleteBtn: {
        backgroundColor: '#8B5CF6',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 24,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    markCompleteText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
    },
    listContainer: {
        gap: 12,
    },
    lessonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    activeLessonItem: {
        backgroundColor: '#F3ECFF',
        borderColor: '#8B5CF6',
    },
    itemIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activeItemIcon: {
        backgroundColor: '#8B5CF6',
    },
    itemTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 2,
    },
    activeItemTitle: {
        color: '#7C3AED',
    },
    itemDuration: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    activeItemDuration: {
        color: '#8B5CF6',
    },
    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#8B5CF6',
        marginLeft: 8,
    },
    completedLessonItem: {
        backgroundColor: '#ECFDF5',
        borderColor: '#10B981',
    },
    completedItemIcon: {
        backgroundColor: '#10B981',
    },
});

export default CoursePlayerScreen;
