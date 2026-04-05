import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import ScreenView from '../../utils/ScreenView';
import { apiCall } from '../../services/api';
import { getToken } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');
const ITEM_MARGIN = 16;
const CAROUSEL_WIDTH = width - (ITEM_MARGIN * 2);

const TABS = ['About', 'Availability', 'Services', 'Reviews'];

const ArtistPortfolioScreen = ({ navigation }: any) => {
  const { userToken } = useAuth();
  const [activeTab, setActiveTab] = useState('About');
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [portfolioImages, setPortfolioImages] = useState<any[]>([]);
  const [artistServices, setArtistServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [isProfilePending, setIsProfilePending] = useState(false);

  // Premium Overlay animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    ).start();
  }, []);

  const sliderRef = useRef<FlatList>(null);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const token = userToken || await getToken();
      if (!token) {
        console.warn('[Portfolio] No token found');
        return;
      }

      // 1. Fetch Provider Profile
      let providerProfile;
      try {
        providerProfile = await apiCall('/service-providers/profile', { method: 'GET', token });
        setProfile(providerProfile);

        // Check approval status
        if (providerProfile?.approvalStatus === 'PENDING') {
          setIsProfilePending(true);
        } else {
          setIsProfilePending(false);
        }
      } catch (e) {
        console.warn('Provider profile fetch error:', e);
        // Fallback to /auth/me if provider-specific fetch fails
        const meResponse = await apiCall('/auth/me', { method: 'GET', token });
        const userObj = meResponse?.user || meResponse;
        providerProfile = userObj?.serviceProvider || userObj;
        setProfile(providerProfile);

        if (providerProfile?.approvalStatus === 'PENDING') {
          setIsProfilePending(true);
        } else {
          setIsProfilePending(false);
        }
      }

      const spId = providerProfile?.id || providerProfile?._id;

      // 2. Fetch Portfolio Images
      if (providerProfile?.portfolioImages && Array.isArray(providerProfile.portfolioImages) && providerProfile.portfolioImages.length > 0) {
        setPortfolioImages(providerProfile.portfolioImages);
      } else if (spId) {
        try {
          const portfolioData = await apiCall(`/service-providers/portfolio/${spId}`, { method: 'GET', token });
          const imgs = Array.isArray(portfolioData) ? portfolioData : (portfolioData?.images || []);
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>", imgs);

          setPortfolioImages(imgs);
        } catch (e) {
          console.warn('Portfolio fetch error:', e);
        }
      }

      // 3. Fetch My Services (only if approved)
      if (!isProfilePending) {
        try {
          const servicesData = await apiCall('/services/my', { method: 'GET', token });
          const sList = Array.isArray(servicesData) ? servicesData : (servicesData?.services || servicesData?.data || []);
          setArtistServices(sList);
        } catch (e) {
          console.warn('Services fetch error:', e);
        }
      }

      // 4. Fetch Availability (Next 7 Days) (only if approved)
      if (spId && !isProfilePending) {
        try {
          const availData = await apiCall(`/artist-availability/availability-for-next-seven/${spId}`, { method: 'GET', token });
          const aList = Array.isArray(availData) ? availData : (availData?.data || availData?.availability || []);
          setAvailability(aList);
        } catch (e) {
          console.warn('Availability fetch error:', e);
        }
      }

      // 5. Fetch Reviews (only if approved)
      if (spId && !isProfilePending) {
        try {
          const reviewsData = await apiCall(`/reviews/provider/${spId}`, { method: 'GET', token });
          const rList = Array.isArray(reviewsData) ? reviewsData : (reviewsData?.reviews || reviewsData?.data || []);
          setReviews(rList);
        } catch (e) {
          console.warn('Reviews fetch error:', e);
        }
      }

    } catch (error) {
      console.warn('Data fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  // Periodically check approval status
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isProfilePending) {
      intervalId = setInterval(async () => {
        try {
          const token = userToken || await getToken();
          if (token) {
            const providerProfile = await apiCall('/service-providers/profile', { method: 'GET', token });
            if (providerProfile?.approvalStatus !== 'PENDING') {
              // Profile approved, refresh data
              setIsProfilePending(false);
              fetchData();
            }
          }
        } catch (error) {
          console.warn('Error checking approval status:', error);
        }
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isProfilePending, userToken]);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  // Auto-scroll effect
  React.useEffect(() => {
    if (portfolioImages.length <= 1) return;
    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= portfolioImages.length) {
        nextIndex = 0;
      }
      setActiveIndex(nextIndex);
      sliderRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex, portfolioImages]);

  const onScrollEnd = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / CAROUSEL_WIDTH);
    setActiveIndex(index);
  };

  const getItemLayout = (_: any, index: number) => ({
    length: CAROUSEL_WIDTH,
    offset: CAROUSEL_WIDTH * index,
    index,
  });

  const displayImages = portfolioImages;

  const renderImageSource = (item: any) => {
    if (typeof item === 'number') return item;
    if (typeof item === 'string') return { uri: item };
    const uri = item?.url || item?.uri || item?.image || item?.imageUrl || item?.secure_url || item?.path || item?.src;
    return { uri };
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <FontAwesome name="angle-left" size={22} color="#7B4DFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Portfolio</Text>
            </View>

            {/* CAROUSEL */}
            {displayImages.length > 0 ? (
              <View style={styles.carouselWrapper}>
                <FlatList
                  ref={sliderRef}
                  data={displayImages}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(_, i) => i.toString()}
                  onMomentumScrollEnd={onScrollEnd}
                  snapToInterval={CAROUSEL_WIDTH}
                  decelerationRate="fast"
                  pagingEnabled={false}
                  getItemLayout={getItemLayout}
                  contentContainerStyle={{ paddingHorizontal: ITEM_MARGIN }}
                  renderItem={({ item }) => (
                    <View style={{ width: CAROUSEL_WIDTH, alignItems: 'center' }}>
                      <Image source={renderImageSource(item)} style={styles.carouselImage} />
                    </View>
                  )}
                />

                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => navigation.navigate('EditRecentWorks')}
                >
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>

                <View style={styles.dotsRow}>
                  {displayImages.map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.dot,
                        activeIndex === i && styles.activeDot,
                      ]}
                    />
                  ))}
                </View>
              </View>
            ) : (
              <View style={{ marginHorizontal: 20, marginTop: 12, height: 180, backgroundColor: '#F3F4F6', borderRadius: 18, justifyContent: 'center', alignItems: 'center' }}>
                <FontAwesome name="image" size={40} color="#D1D5DB" />
                <Text style={{ color: '#9CA3AF', marginTop: 10 }}>No portfolio images yet</Text>

                <TouchableOpacity
                  style={{ marginTop: 15, backgroundColor: '#7B4DFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 }}
                  onPress={() => navigation.navigate('EditRecentWorks')}
                >
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Add Images</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* RECENT WORKS */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent works</Text>
              <View style={styles.seeAllRow}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditRecentWorks')}
                  style={styles.seeAllRow}
                >
                  <Text style={styles.seeAll}>See all</Text>
                  <FontAwesome name="angle-right" size={16} color="#7B4DFF" />
                </TouchableOpacity>
              </View>
            </View>

            {displayImages.length > 0 ? (
              <FlatList
                data={displayImages}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                  <Image source={renderImageSource(item)} style={styles.workImage} />
                )}
              />
            ) : (
              <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                <Text style={{ color: '#6B7280' }}>No recent works added yet.</Text>
              </View>
            )}

            {/* TABS */}
            <View style={styles.tabsRow}>
              {TABS.map(tab => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[
                    styles.tab,
                    activeTab === tab && styles.activeTab,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab && styles.activeTabText,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ABOUT */}
            {activeTab === 'About' && (
              <>
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>About</Text>
                    <TouchableOpacity>
                      <Text style={styles.editLink}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.cardText}>
                    {profile?.bio || 'No bio provided.'}
                  </Text>
                </View>

                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Details</Text>
                  </View>

                  <View style={{ gap: 10 }}>
                    <Text style={styles.certSub}>Experience Level: {profile?.experienceLevel || profile?.experience || 'N/A'}</Text>
                    <Text style={styles.certSub}>Specialization: {Array.isArray(profile?.specialization) ? profile.specialization.join(', ') : (profile?.specialization || 'N/A')}</Text>
                    <Text style={styles.certSub}>Languages: {Array.isArray(profile?.languagesSpoken) ? profile.languagesSpoken.join(', ') : (profile?.languagesSpoken || 'N/A')}</Text>
                  </View>
                </View>
              </>
            )}

            {activeTab === 'Availability' && (
              <>
                {availability.length > 0 ? (
                  availability.map((item, index) => (
                    <View key={index} style={styles.availabilityInfoCard}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                            {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </Text>
                          <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
                            {item.startTime} - {item.endTime}
                          </Text>
                        </View>
                        <View style={{ backgroundColor: '#EFE4FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                          <Text style={{ color: '#7B4DFF', fontSize: 12, fontWeight: '600' }}>Available</Text>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.availabilityInfoCard}>
                    <Text style={styles.availabilityInfoText}>
                      Manage your available dates and let customers know when you're free to work
                    </Text>
                  </View>
                )}

                <TouchableOpacity style={styles.availabilityBtn} onPress={() => navigation.navigate('SetAvailability')}>
                  <Text style={styles.availabilityBtnText}>
                    {availability.length > 0 ? 'Edit Availability' : 'Set Your Availability'}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {activeTab === 'Services' && (
              <>
                {artistServices.length > 0 ? artistServices.map((item, index) => (
                  <View key={index} style={styles.serviceCard}>
                    <View>
                      <Text style={styles.serviceTitle}>{item.name}</Text>
                      <View style={styles.serviceMeta}>
                        <FontAwesome name="clock-o" size={14} color="#9CA3AF" />
                        <Text style={styles.serviceDuration}>{item.duration} mins</Text>
                      </View>
                      <Text style={styles.servicePrice}>₹{item.basePrice || item.price}</Text>
                    </View>
                    <View style={styles.serviceRight}>
                      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('EditService', { service: item })}>
                        <Text style={styles.addBtnText}>Edit</Text>
                      </TouchableOpacity>
                      <Text style={styles.basePrice}>Base Price</Text>
                    </View>
                  </View>
                )) : (
                  <View style={styles.card}>
                    <Text style={{ textAlign: 'center', color: '#6B7280' }}>No services added yet.</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.editServicesBtn}
                  onPress={() => navigation.navigate('EditService')}
                >
                  <Text style={styles.editServicesText}>Add New Service</Text>
                </TouchableOpacity>
              </>
            )}

            {activeTab === 'Reviews' && (
              <>
                {reviews.length > 0 ? reviews.map(review => (
                  <View key={review.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {review.name?.charAt(0) || review.user?.name?.charAt(0) || review.userId?.name?.charAt(0) || 'U'}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.reviewName}>{review.name || review.user?.name || review.userId?.name || 'Anonymous'}</Text>
                        <View style={styles.starRow}>
                          {[...Array(5)].map((_, i) => (
                            <FontAwesome
                              key={i}
                              name="star"
                              size={14}
                              color={i < review.rating ? '#FBBF24' : '#E5E7EB'}
                            />
                          ))}
                        </View>
                      </View>
                      <Text style={styles.reviewDate}>{review.date || (review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '')}</Text>
                    </View>
                    <Text style={styles.reviewText}>{review.comment || review.reviewText || review.feedback}</Text>
                  </View>
                )) : (
                  <View style={styles.card}>
                    <Text style={{ textAlign: 'center', color: '#6B7280' }}>No reviews yet.</Text>
                  </View>
                )}

                <TouchableOpacity style={styles.viewAllReviewsBtn} onPress={() => navigation.navigate('AllReviews')}>
                  <Text style={styles.viewAllReviewsText}>
                    View All Reviews
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </ScreenView>

      {/* Premium Overlay - Only show when profile is pending */}
      {isProfilePending && (
        <View style={styles.premiumOverlay} pointerEvents="box-none">
          <LinearGradient
            colors={['rgba(15,10,40,0.82)', 'rgba(30,15,70,0.96)']}
            style={styles.premiumGradient}
          >
            {/* Decorative glow circles */}
            <View style={styles.glowCircle1} />
            <View style={styles.glowCircle2} />

            {/* Badge */}
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>⏳  PENDING APPROVAL</Text>
            </View>

            {/* Animated Icon */}
            <Animated.View style={[styles.premiumIconCircle, { transform: [{ scale: pulseAnim }] }]}>
              <LinearGradient
                colors={['#9B59FF', '#6C2FD9']}
                style={styles.premiumIconGradient}
              >
                <Text style={{ fontSize: 44 }}>👤</Text>
              </LinearGradient>
            </Animated.View>

            <Text style={styles.premiumTitle}>Profile Under Review</Text>
            <Text style={styles.premiumSubtitle}>
              Your profile is currently pending approval by our admin team.{`\n`}
              Some features will be available once your profile is approved.
            </Text>

            {/* Feature pills */}
            <View style={styles.featurePillsRow}>
              <View style={styles.featurePill}><Text style={styles.featurePillText}>📋  Profile Review</Text></View>
              <View style={styles.featurePill}><Text style={styles.featurePillText}>✅  Approval in 24-48h</Text></View>
              <View style={styles.featurePill}><Text style={styles.featurePillText}>🎨  Portfolio Access</Text></View>
            </View>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

export default ArtistPortfolioScreen;

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 44,
    backgroundColor: '#EFE4FF',
  },
  backBtn: {
    width: 46,
    height: 46,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    marginLeft: 86,
    fontSize: 25,
    fontWeight: '600',
    color: '#7B4DFF',
  },

  carouselWrapper: {
    marginTop: 12,
  },

  carouselImage: {
    width: '100%',
    height: 180,
    borderRadius: 18,
    resizeMode: 'cover',
  },

  editBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
  },
  editText: { color: '#7B4DFF', fontWeight: '600' },

  dotsRow: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#EFE4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CFC4FF',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 16,
    backgroundColor: '#7B4DFF',
  },

  sectionHeader: {
    marginTop: 28,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 20, fontWeight: '600' },
  seeAllRow: { flexDirection: 'row', alignItems: 'center' },
  seeAll: { color: '#7B4DFF', marginRight: 4, fontSize: 16 },

  workImage: {
    width: 90,
    height: 90,
    borderRadius: 16,
    marginHorizontal: 8,
    marginTop: 14,
  },

  tabsRow: {
    flexDirection: 'row',
    marginTop: 28,
    marginHorizontal: 20,
    backgroundColor: '#F3EDFF',
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  activeTab: { backgroundColor: '#fff' },
  tabText: { fontSize: 13, color: '#9CA3AF' },
  activeTabText: { color: '#7B4DFF', fontWeight: '600' },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 19,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardTitle: { fontWeight: '500', fontSize: 20 },
  editLink: { color: '#7B4DFF', fontSize: 17 },
  viewAll: { color: '#7B4DFF', fontSize: 12 },

  cardText: { fontSize: 15, color: '#6B7280', lineHeight: 24 },

  certRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  certIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFE4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  availabilityBtn: {
    marginTop: 22,
    marginHorizontal: 20,
    backgroundColor: '#7B4DFF',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  availabilityBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  availabilityInfoCard: {
    marginTop: 14,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    elevation: 2,
  },

  availabilityInfoText: {
    textAlign: 'center',
    fontSize: 17,
    color: '#6B7280',
    marginTop: 20,
    lineHeight: 20,
  },

  certTitle: { fontSize: 14, fontWeight: '500' },
  certSub: { fontSize: 12, color: '#6B7280' },
  serviceRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  serviceCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
  },

  serviceTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },

  serviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  serviceDuration: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6B7280',
  },

  servicePrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7B4DFF',
  },

  addBtn: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#FDBA8C',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },

  addBtnText: {
    color: '#F97316',
    fontWeight: '600',
  },

  editServicesBtn: {
    marginTop: 26,
    marginHorizontal: 20,
    backgroundColor: '#7B4DFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },

  editServicesText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  basePrice: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 6,
  },
  reviewCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },

  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7B4DFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  reviewName: {
    fontWeight: '600',
    fontSize: 15,
  },

  starRow: {
    flexDirection: 'row',
    marginTop: 4,
  },

  reviewDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  reviewText: {
    marginTop: 12,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },

  reviewImagesRow: {
    flexDirection: 'row',
    marginTop: 12,
  },

  reviewImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 10,
  },

  viewAllReviewsBtn: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },

  viewAllReviewsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  // Premium Overlay Styles
  premiumOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    elevation: 999,
  },
  premiumGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    overflow: 'hidden',
  },
  glowCircle1: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(139, 92, 246, 0.18)',
    top: -60,
    right: -80,
  },
  glowCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(99, 47, 217, 0.15)',
    bottom: 60,
    left: -60,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(155, 89, 255, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 255, 0.5)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 28,
  },
  premiumBadgeText: {
    color: '#D8B4FE',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  premiumIconCircle: {
    marginBottom: 24,
    shadowColor: '#9B59FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  premiumIconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
    marginBottom: 14,
    textAlign: 'center',
  },
  premiumSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 36,
  },
  featurePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(179, 136, 255, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  featurePillText: {
    color: '#C4B5FD',
    fontSize: 12,
    fontWeight: '500',
  },
});