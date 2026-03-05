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

import { apiCall } from '../../services/api';
import { getToken } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';

const ArtistAllReviewsScreen = ({ navigation, route }: any) => {
  const { userToken } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [userInfo, setUserInfo] = React.useState({
    name: 'Artist',
    totalReviews: 0,
    averageRating: 0
  });

  const fetchReviews = React.useCallback(async () => {
    try {
      setLoading(true);
      const token = userToken || await getToken();
      if (!token) return;

      // 1. Get user info for header
      const userRes = await apiCall('/auth/me', { method: 'GET', token });
      const user = userRes?.user || userRes;

      let rList: any[] = [];
      const spId = user.serviceProvider?.id || user.serviceProviderId;

      // 2. Try fetching reviews, handle 404/API missing gracefully
      try {
        let reviewsData;
        if (spId) {
          console.log(`[AllReviews] Fetching for Provider ID: ${spId}`);
          reviewsData = await apiCall(`/reviews/provider/${spId}`, { method: 'GET', token });
        } else {
          reviewsData = await apiCall('/reviews/my', { method: 'GET', token });
        }
        rList = Array.isArray(reviewsData) ? reviewsData : (reviewsData?.reviews || reviewsData?.data || []);
      } catch (err) {
        console.warn('[AllReviews] Fetch failed:', err);
        // endpoint might not exist
      }

      setReviews(rList);

      if (user) {
        setUserInfo({
          name: user.name || 'Artist',
          // Prefer api count, fallback to review list length
          totalReviews: user.serviceProvider?.reviewCount || rList.length,
          averageRating: user.serviceProvider?.averageRating || 0
        });
      }

    } catch (e) {
      console.warn('Review screen error:', e);
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  React.useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

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
              <Text style={styles.headerTitle}>{userInfo.name}</Text>
              <Text style={styles.headerSub}>{userInfo.totalReviews} total reviews</Text>
            </View>
          </View>

          {/* SUMMARY */}
          <View style={styles.summaryCard}>
            <View style={styles.ratingLeft}>
              <Text style={styles.bigRating}>{userInfo.averageRating.toFixed(1)}</Text>
              <View style={styles.starRow}>
                {[...Array(5)].map((_, i) => (
                  <FontAwesome
                    key={i}
                    name="star"
                    size={18}
                    color={i < Math.round(userInfo.averageRating) ? '#FBBF24' : '#E5E7EB'}
                  />
                ))}
              </View>
              <Text style={styles.basedOn}>Based on {userInfo.totalReviews} reviews</Text>
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
          {/* REVIEWS LIST */}
          {reviews.length > 0 ? (
            reviews.map((item, index) => (
              <View key={item.id || index} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {(item.userName || item.name || '?').charAt(0)}
                    </Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewName}>{item.userName || item.name || 'Anonymous'}</Text>
                    <View style={styles.starRowSmall}>
                      {[...Array(5)].map((_, i) => (
                        <FontAwesome
                          key={i}
                          name="star"
                          size={14}
                          color={i < (item.rating || 0) ? '#FBBF24' : '#E5E7EB'}
                        />
                      ))}
                    </View>
                  </View>

                  <Text style={styles.reviewDate}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : (item.date || '')}
                  </Text>
                </View>

                <Text style={styles.reviewText}>{item.comment || item.text || ''}</Text>

                {item.images && item.images.length > 0 && (
                  <View style={styles.reviewImagesRow}>
                    {item.images.map((img: any, idx: number) => (
                      <Image
                        key={idx}
                        source={typeof img === 'string' ? { uri: img } : img}
                        style={styles.reviewImage}
                      />
                    ))}
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#666' }}>No reviews yet.</Text>
            </View>
          )}

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
