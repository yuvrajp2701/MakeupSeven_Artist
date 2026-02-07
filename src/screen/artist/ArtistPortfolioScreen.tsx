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
import ScreenView from '../../utils/ScreenView';
const { width } = Dimensions.get('window');
const ITEM_MARGIN = 16;
const CAROUSEL_WIDTH = width - (ITEM_MARGIN * 2);


const carouselImages = [
  require('../../asset/images/artists1.png'),
  require('../../asset/images/artists2.png'),
  require('../../asset/images/mask.png'),
  require('../../asset/images/hero-face.png'),
];

const works = [
  require('../../asset/images/artists1.png'),
  require('../../asset/images/artists2.png'),
  require('../../asset/images/mask.png'),
  require('../../asset/images/hero-face.png'),
];
const services = [
  {
    title: 'Bridal Makeup',
    duration: '2 hours',
    price: '₹2,200',
  },
  {
    title: 'Pre-Wedding Shoot',
    duration: '2 hours',
    price: '₹2,200',
  },
  {
    title: 'Party Makeup',
    duration: '2 hours',
    price: '₹2,200',
  },
];

const tabs = ['About', 'Availability', 'Services', 'Reviews'];
const reviews = [
  {
    id: 1,
    name: 'Ravi',
    rating: 4,
    date: 'August 13, 2024',
    comment:
      'I loved the service so much! Professional and talented. Highly recommended.',
    images: [
      require('../../asset/images/artists1.png'),
      require('../../asset/images/artists2.png'),
      require('../../asset/images/mask.png'),
    ],
  },
  {
    id: 2,
    name: 'Priya',
    rating: 5,
    date: 'August 10, 2024',
    comment:
      'Amazing work! Made me look absolutely stunning. The makeup lasted all day.',
    images: [],
  },
];

const ArtistPortfolioScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('About');
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<FlatList>(null);

  // Auto-scroll effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= carouselImages.length) {
        nextIndex = 0;
      }
      setActiveIndex(nextIndex);
      sliderRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 1000); // 1 second interval

    return () => clearInterval(interval);
  }, [activeIndex]);

  const onScrollEnd = (e: any) => {
    // Determine index based on scroll position + small offset for robustness
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / CAROUSEL_WIDTH);
    setActiveIndex(index);
  };

  const getItemLayout = (_: any, index: number) => ({
    length: CAROUSEL_WIDTH,
    offset: CAROUSEL_WIDTH * index,
    index,
  });

  return (
    <ScreenView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>

          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn}>
              <FontAwesome name="angle-left" size={22} color="#7B4DFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Portfolio</Text>
          </View>

          {/* CAROUSEL */}
          <View style={styles.carouselWrapper}>
            <FlatList
              ref={sliderRef}
              data={carouselImages}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, i) => i.toString()}
              onMomentumScrollEnd={onScrollEnd}
              snapToInterval={CAROUSEL_WIDTH}
              decelerationRate="fast"
              pagingEnabled={false} // Disabled to allow custom snapWidth with margins
              getItemLayout={getItemLayout}
              contentContainerStyle={{ paddingHorizontal: ITEM_MARGIN }}
              renderItem={({ item }) => (
                <View style={{ width: CAROUSEL_WIDTH, alignItems: 'center' }}>
                  {/* Wrapped in a View to enforce width per item */}
                  <Image source={item} style={styles.carouselImage} />
                </View>
              )}
            />

            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>

            <View style={styles.dotsRow}>
              {carouselImages.map((_, i) => (
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

              <FontAwesome name="angle-right" size={16} color="#7B4DFF" />
            </View>
          </View>

          <FlatList
            data={works}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <Image source={item} style={styles.workImage} />
            )}
          />

          {/* TABS */}
          <View style={styles.tabsRow}>
            {tabs.map(tab => (
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
                  <Text style={styles.editLink}>Edit</Text>
                </View>
                <Text style={styles.cardText}>
                  Professional makeup artist with 5+ years of experience in
                  special events. Passionate about enhancing natural beauty.
                </Text>
              </View>

              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Certifications</Text>
                  <Text style={styles.viewAll}>View All</Text>
                </View>

                <View style={styles.certRow}>
                  <View style={styles.certIcon}>
                    <FontAwesome name="certificate" size={16} color="#7B4DFF" />
                  </View>
                  <View>
                    <Text style={styles.certTitle}>
                      Advanced Bridal Makeup Techniques
                    </Text>
                    <Text style={styles.certSub}>
                      MakeupSeven Academy
                    </Text>
                  </View>
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
              {services.map((item, index) => (
                <View key={index} style={styles.serviceCard}>

                  {/* LEFT CONTENT */}
                  <View>
                    <Text style={styles.serviceTitle}>{item.title}</Text>

                    <View style={styles.serviceMeta}>
                      <FontAwesome name="clock-o" size={14} color="#9CA3AF" />
                      <Text style={styles.serviceDuration}>{item.duration}</Text>
                    </View>

                    <Text style={styles.servicePrice}>{item.price}</Text>
                  </View>

                  {/* RIGHT CONTENT */}
                  <View style={styles.serviceRight}>
                    <TouchableOpacity style={styles.addBtn}>
                      <Text style={styles.addBtnText}>Add</Text>
                    </TouchableOpacity>

                    <Text style={styles.basePrice}>Base Price</Text>
                  </View>

                </View>
              ))}

              <TouchableOpacity
                style={styles.editServicesBtn}
                onPress={() => navigation.navigate('EditService')}
              >
                <Text style={styles.editServicesText}>Edit Services</Text>
              </TouchableOpacity>

            </>
          )}
          {activeTab === 'Reviews' && (
            <>
              {reviews.map(review => (
                <View key={review.id} style={styles.reviewCard}>

                  {/* Header */}
                  <View style={styles.reviewHeader}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {review.name.charAt(0)}
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

                  {/* Comment */}
                  <Text style={styles.reviewText}>{review.comment}</Text>

                  {/* Images */}
                  {review.images.length > 0 && (
                    <View style={styles.reviewImagesRow}>
                      {review.images.map((img, i) => (
                        <Image key={i} source={img} style={styles.reviewImage} />
                      ))}
                    </View>
                  )}
                </View>
              ))}

              {/* View All */}
              <TouchableOpacity style={styles.viewAllReviewsBtn} onPress={() => navigation.navigate('AllReviews')}>
                <Text style={styles.viewAllReviewsText}>
                  View All Reviews (243)
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
