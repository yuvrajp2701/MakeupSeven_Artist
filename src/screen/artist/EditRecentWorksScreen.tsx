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

const EditRecentWorksScreen = ({ navigation }: any) => {
  const { userToken } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [galleryImages, setGalleryImages] = React.useState<any[]>([]);

  const fetchGallery = React.useCallback(async () => {
    try {
      setLoading(true);
      const token = userToken || await getToken();
      if (!token) return;

      const response = await apiCall('/auth/me', { method: 'GET', token });
      const userObj = response?.user || response;
      const spObj = userObj?.serviceProvider;

      let imgs = spObj?.portfolioImages || [];

      if (imgs.length === 0) {
        const spId = spObj?.id || userObj?.serviceProviderId;
        if (spId) {
          try {
            const portfolioData = await apiCall(`/service-providers/portfolio/${spId}`, { method: 'GET', token });
            imgs = Array.isArray(portfolioData) ? portfolioData : (portfolioData?.images || []);
          } catch (e) {
            console.warn('Portfolio fetch error:', e);
          }
        }
      }
      setGalleryImages(imgs);
    } catch (e) {
      console.warn('Failed to fetch gallery:', e);
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  React.useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const renderImageSource = (item: any) => {
    if (typeof item === 'number') return item;
    const uri = typeof item === 'string' ? item : (item?.url || item?.uri || item?.image);
    return { uri };
  };

  const displayImages = galleryImages.length > 0 ? galleryImages : [
    require('../../asset/images/artists1.png'),
    require('../../asset/images/artists1.png'),
    require('../../asset/images/artists1.png'),
  ];
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

            <Text style={styles.headerTitle}>Edit recent works</Text>

            <TouchableOpacity style={styles.saveBtn}>
              <FontAwesome name="save" size={18} color="#7B4DFF" />
            </TouchableOpacity>
          </View>

          {/* UPLOAD BOX */}
          <TouchableOpacity style={styles.uploadBox}>
            <View style={styles.uploadIcon}>
              <FontAwesome name="upload" size={20} color="#7B4DFF" />
            </View>
            <Text style={styles.uploadText}>Upload Images</Text>
            <Text style={styles.uploadSub}>
              PNG, JPG up to 10MB each
            </Text>
          </TouchableOpacity>

          {/* GALLERY */}
          <Text style={styles.galleryTitle}>
            Your Gallery ({galleryImages.length > 0 ? galleryImages.length : 'Preview'})
          </Text>

          <View style={styles.galleryGrid}>
            {displayImages.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={renderImageSource(img)} style={styles.galleryImage} />

                {/* delete overlay (optional) */}
                <TouchableOpacity style={styles.deleteBtn}>
                  <FontAwesome name="times" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* TIPS */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Tips for great gallery:</Text>
            <Text style={styles.tip}>• Use high-quality, well-lit photos</Text>
            <Text style={styles.tip}>• Show variety in your work</Text>
            <Text style={styles.tip}>• Include before/after shots</Text>
            <Text style={styles.tip}>• Minimum 6 images recommended</Text>
          </View>

          {/* SAVE BUTTON */}
          <TouchableOpacity style={styles.saveGalleryBtn}>
            <Text style={styles.saveGalleryText}>Save Gallery</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default EditRecentWorksScreen;
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
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#7B4DFF',
  },
  saveBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  uploadBox: {
    margin: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#7B4DFF',
    borderRadius: 16,
    paddingVertical: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  uploadIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFE4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 15,
    fontWeight: '600',
  },
  uploadSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },

  galleryTitle: {
    marginHorizontal: 20,
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
  },

  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    marginTop: 10,
  },

  imageWrapper: {
    width: '33.33%',
    padding: 6,
  },

  galleryImage: {
    width: '100%',
    height: 110,
    borderRadius: 14,
    resizeMode: 'cover',
  },

  deleteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  tipsCard: {
    margin: 20,
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 16,
  },
  tipsTitle: {
    fontWeight: '600',
    marginBottom: 6,
  },
  tip: {
    fontSize: 13,
    color: '#374151',
    marginTop: 4,
  },

  saveGalleryBtn: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: '#7B4DFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveGalleryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
