import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import ScreenView from '../../utils/ScreenView';

const reviews = [
  {
    id: 1,
    name: 'Ravi',
    rating: 4,
    date: 'August 13, 2024',
    text:
      'I loved this dress so much as soon as I tried it on I knew I had to buy it in another color. I am 5\'3 about 155lbs and I carry all my weight in my upper body. When I put it on I felt like it thinned me out and I got so many compliments.',
    images: [
      require('../../asset/images/artists1.png'),
      require('../../asset/images/artists2.png'),
      require('../../asset/images/mask.png'),
    ],
  },
  {
    id: 2,
    name: 'Priya Kumar',
    rating: 5,
    date: 'August 10, 2024',
    text:
      'Amazing makeup skills! Made me look absolutely stunning for my wedding. The makeup lasted all day and night. Highly recommended!',
    images: [],
  },
  {
    id: 3,
    name: 'Ananya Singh',
    rating: 5,
    date: 'August 5, 2024',
    text:
      'Very professional and talented artist. Understood exactly what I wanted and delivered perfectly. Will definitely book again!',
    images: [
      require('../../asset/images/hero-face.png'),
    ],
  },
];

const ArtistAllReviewsScreen = ({ navigation }: any) => {
  return (
    <ScreenView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>

          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <FontAwesome name="angle-left" size={22} color="#7B4DFF" />
            </TouchableOpacity>

            <View>
              <Text style={styles.headerTitle}>Priya Sharma</Text>
              <Text style={styles.headerSub}>243 total reviews</Text>
            </View>
          </View>

          {/* SUMMARY */}
          <View style={styles.summaryCard}>
            <View style={styles.ratingLeft}>
              <Text style={styles.bigRating}>4.8</Text>
              <View style={styles.starRow}>
                {[...Array(5)].map((_, i) => (
                  <FontAwesome
                    key={i}
                    name="star"
                    size={18}
                    color={i < 4 ? '#FBBF24' : '#E5E7EB'}
                  />
                ))}
              </View>
              <Text style={styles.basedOn}>Based on 243 reviews</Text>
            </View>

            <View style={styles.ratingBars}>
              {[5, 4, 3, 2, 1].map((star, i) => (
                <View key={i} style={styles.barRow}>
                  <Text style={styles.barLabel}>{star}</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${[70, 20, 5, 3, 2][i]}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.barCount}>
                    {[170, 49, 12, 7, 5][i]}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* REVIEWS LIST */}
          {reviews.map(item => (
            <View key={item.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.name.charAt(0)}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewName}>{item.name}</Text>
                  <View style={styles.starRowSmall}>
                    {[...Array(5)].map((_, i) => (
                      <FontAwesome
                        key={i}
                        name="star"
                        size={14}
                        color={i < item.rating ? '#FBBF24' : '#E5E7EB'}
                      />
                    ))}
                  </View>
                </View>

                <Text style={styles.reviewDate}>{item.date}</Text>
              </View>

              <Text style={styles.reviewText}>{item.text}</Text>

              {item.images.length > 0 && (
                <View style={styles.reviewImagesRow}>
                  {item.images.map((img, idx) => (
                    <Image
                      key={idx}
                      source={img}
                      style={styles.reviewImage}
                    />
                  ))}
                </View>
              )}
            </View>
          ))}

        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default ArtistAllReviewsScreen;
const styles = StyleSheet.create({
  container: { paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#EFE4FF',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7B4DFF',
  },
  headerSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  summaryCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    flexDirection: 'row',
  },

  ratingLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  bigRating: {
    fontSize: 32,
    fontWeight: '700',
  },
  basedOn: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },

  ratingBars: {
    flex: 1,
    justifyContent: 'space-between',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  barLabel: { width: 12 },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginHorizontal: 6,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#7B4DFF',
    borderRadius: 4,
  },
  barCount: { width: 30, fontSize: 12 },

  reviewCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
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
  },
  reviewName: {
    fontWeight: '600',
    fontSize: 15,
  },
  reviewDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  starRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  starRowSmall: {
    flexDirection: 'row',
    marginTop: 4,
  },

  reviewText: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
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
});
