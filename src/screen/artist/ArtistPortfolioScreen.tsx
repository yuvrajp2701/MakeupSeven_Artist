import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Dimensions,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useFocusEffect } from '@react-navigation/native';
import ScreenView from '../../utils/ScreenView';
import { apiCall } from '../../services/api';
import { getToken } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');
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

  const sliderRef = useRef<FlatList>(null);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const token = userToken || await getToken();
      if (!token) {
        console.warn('[Portfolio] No token found');
        return;
      }

      // 1. Fetch Profile
      const response = await apiCall('/auth/me', { method: 'GET', token });
      const userObj = response?.user || response;
      const spObj = userObj?.serviceProvider;
      setProfile({ ...userObj, ...spObj });

      // 2. Fetch Portfolio
      if (spObj?.portfolioImages && Array.isArray(spObj.portfolioImages) && spObj.portfolioImages.length > 0) {
        setPortfolioImages(spObj.portfolioImages);
      } else {
        const spId = spObj?.id || userObj?.serviceProviderId;
        if (spId) {
          try {
            const portfolioData = await apiCall(`/service-providers/portfolio/${spId}`, { method: 'GET', token });
            const imgs = Array.isArray(portfolioData) ? portfolioData : (portfolioData?.images || []);
            setPortfolioImages(imgs);
          } catch (e) {
            console.warn('Portfolio fetch error:', e);
          }
        }
      }

      // 3. Fetch My Services
      try {
        const servicesData = await apiCall('/services/my', { method: 'GET', token });
        const sList = Array.isArray(servicesData) ? servicesData : (servicesData?.services || servicesData?.data || []);
        setArtistServices(sList);
      } catch (e) {
        console.warn('Services fetch error:', e);
      }

      // 4. Fetch Reviews
      try {
        const spId = spObj?.id || userObj?.serviceProviderId;
        console.log(`[Reviews] Fetching for Provider ID: ${spId}`);

        let reviewsData;
        try {
          // Attempt specific provider reviews first as it's verified working
          if (spId) {
            reviewsData = await apiCall(`/reviews/provider/${spId}`, { method: 'GET', token });
          } else {
            // Fallback to /my if ID is missing (though /my is currently 404)
            reviewsData = await apiCall('/reviews/my', { method: 'GET', token });
          }
        } catch (e) {
          console.warn('Reviews primary fetch failed, trying fallback /reviews/my:', e);
          reviewsData = await apiCall('/reviews/my', { method: 'GET', token });
        }

        const rList = Array.isArray(reviewsData) ? reviewsData : (reviewsData?.reviews || reviewsData?.data || []);
        setReviews(rList);
        console.log(`[Reviews] Loaded ${rList.length} reviews`);
      } catch (e) {
        console.warn('Final Reviews fetch error:', e);
      }

    } catch (error) {
      console.warn('Data fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [userToken]);

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
      if (nextIndex >= (portfolioImages.length > 0 ? portfolioImages.length : 2)) {
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

  const displayImages = portfolioImages.length > 0 ? portfolioImages : [
    require('../../asset/images/artists1.png'),
    require('../../asset/images/artists2.png'),
  ];

  const renderImageSource = (item: any) => {
    if (typeof item === 'number') return item;
    const uri = typeof item === 'string' ? item : (item?.url || item?.uri || item?.image);
    return { uri };
  };

  return (
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

          <FlatList
            data={displayImages}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <Image source={renderImageSource(item)} style={styles.workImage} />
            )}
          />

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
                  <TouchableOpacity onPress={() => navigation.navigate('profile')}>
                    <Text style={styles.editLink}>Edit</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.cardText}>
                  {profile?.bio || 'No bio provided. Professional makeup artist passionate about enhancing natural beauty.'}
                </Text>
              </View>

              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Details</Text>
                </View>

                <View style={{ gap: 10 }}>
                  <Text style={styles.certSub}>Experience: {profile?.experience || '5+ Years'}</Text>
                  <Text style={styles.certSub}>Specialization: {Array.isArray(profile?.specialization) ? profile.specialization.join(', ') : (profile?.specialization || 'Bridal, Party Makeup')}</Text>
                  <Text style={styles.certSub}>Languages: {Array.isArray(profile?.languagesSpoken) ? profile.languagesSpoken.join(', ') : (profile?.languagesSpoken || 'English, Hindi')}</Text>
                </View>
              </View>
            </>
          )}

          {activeTab === 'Availability' && (
            <>
              {/* Primary Button */}
              <TouchableOpacity style={styles.availabilityBtn} onPress={() => navigation.navigate('SetAvailability')}>
                <Text style={styles.availabilityBtnText}>
                  Set Your Availability
                </Text>
              </TouchableOpacity>

              {/* Info Card */}
              <View style={styles.availabilityInfoCard}>
                <Text style={styles.availabilityInfoText}>
                  Manage your available dates and let customers know when
                  you're free to work
                </Text>
              </View>
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
                    <Text style={styles.servicePrice}>₹{item.basePrice}</Text>
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
                        {review.name?.charAt(0) || 'U'}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewName}>{review.name}</Text>
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
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <Text style={styles.reviewText}>{review.comment}</Text>
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
    width: '100%', // Take full width of the parent container (which is CAROUSEL_WIDTH)
    height: 180, // Reduced height for smaller look
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
  cardTitle: { fontWeight: '500', fontSize: 20, },
  editLink: { color: '#7B4DFF', fontSize: 17, },
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

});
