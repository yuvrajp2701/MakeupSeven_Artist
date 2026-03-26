import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
} from '@react-native-documents/picker';

import ScreenView from '../../utils/ScreenView';
import FloatingDropdownOverlay from '../../components/FloatingDropdownOverlay';
import VerificationSuccessModal from '../../components/VerificationSuccessModal';

import ProfileStepHeader from '../../components/artist/ProfileStepHeader';
import ProfileInfoStep from '../../components/artist/ProfileInfoStep';
import PortfolioStep from '../../components/artist/PortfolioStep';
import ServicesStep from '../../components/artist/ServicesStep';

import { apiCall } from '../../services/api';
import { getToken } from '../../services/auth';
import createArtistStyles from '../../components/artist/styles/createArtistStyles';
import { fetchCities, getCityNames } from '../../services/cityService';
import { fetchCategories, getCategoryNames, getCategoryIdByName } from '../../services/categoryService';

const styles = createArtistStyles;

const CreateArtistProfileScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = route.params || {};

  // ── Stepper ────────────────────────────────────────────────
  const [step, setStep] = useState<0 | 1 | 2>(params?.initialStep || 0);
  const [status, setStatus] = useState<
    'IDLE' | 'PENDING' | 'APPROVED' | 'REJECTED'
  >('IDLE');

  // ── Personal info ──────────────────────────────────────────
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [language, setLanguage] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<any>(null);

  // ── Location ───────────────────────────────────────────────
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const [mapAddress, setMapAddress] = useState('');
  const [radius, setRadius] = useState<number>(10);

  // ── Professional ───────────────────────────────────────────
  const [category, setCategory] = useState('');
  const [experience, setExperience] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [portfolioImages, setPortfolioImages] = useState<any[]>([]);

  // ── Services ───────────────────────────────────────────────
  const [serviceCategory, setServiceCategory] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDiscountPrice, setServiceDiscountPrice] = useState('');
  const [whoShouldTake, setWhoShouldTake] = useState('');
  const [whoShouldAvoid, setWhoShouldAvoid] = useState('');
  const [servicePrimaryImages, setServicePrimaryImages] = useState<any[]>([]);
  const [serviceOtherImages, setServiceOtherImages] = useState<any[]>([]);

  // ── Dropdown Options ───────────────────────────────────────
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  // ── KYC ───────────────────────────────────────────────────
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentImages, setDocumentImages] = useState<any[]>([]);

  // ── Modals / UI ────────────────────────────────────────────
  const [verificationModalVisible, setVerificationModalVisible] =
    useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const onOptionSelectRef = useRef<(val: string) => void>(() => {});

  // ── Geocode pincode ────────────────────────────────────────
  const geocodePincode = async (code: string) => {
    if (code.length !== 6) return;
    try {
      setGeocoding(true);
      const url = `https://nominatim.openstreetmap.org/search?postalcode=${code}&country=India&format=json&limit=1`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'MakeupSevenApp/1.0' },
      });
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setLatitude(parseFloat(lat));
        setLongitude(parseFloat(lon));
        setMapAddress(display_name);
        const parts = display_name.split(', ');
        if (!city && parts.length > 2) setCity(parts[parts.length - 3] || '');
        if (!area && parts.length > 1) setArea(parts[0] || '');
      } else {
        Alert.alert(
          'Pincode Not Found',
          'Could not find location for this pincode. Please drag the map pin manually.',
        );
      }
    } catch (e) {
      console.warn('Geocoding failed:', e);
    } finally {
      setGeocoding(false);
    }
  };

  const pickImage = async (onImagePicked: (file: any) => void) => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        onImagePicked({
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName || 'profile.jpg',
        });
      }
    } catch (err) {
      console.warn('ImagePicker Error: ', err);
    }
  };

  // ── Document picker ────────────────────────────────────────
  const pickDocument = async (onFilePicked: (file: any) => void) => {
    try {
      const [res] = await pick({
        type: [types.images, types.pdf],
      });
      if (res) {
        onFilePicked({
          uri: res.uri,
          type: res.type,
          name: res.name,
          fileName: res.name,
        });
      }
    } catch (err) {
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
        // ignore
      } else {
        console.warn('Picker Error: ', err);
      }
    }
  };

  // ── Dropdown helper ────────────────────────────────────────
  const openDropdown = (
    options: string[],
    setValue: (val: string) => void,
    layout: { x: number; y: number; width: number; height: number },
  ) => {
    setCurrentOptions(options);
    setDropdownPos({
      top: layout.y + layout.height + 4,
      left: layout.x,
      width: layout.width,
    });
    onOptionSelectRef.current = (val: string) => {
      setValue(val);
      setModalVisible(false);
    };
    setModalVisible(true);
  };

  // ── Block hardware back ────────────────────────────────────
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true;
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, []),
  );

  // ── Fetch Profile & Status ──────────────────────────────────
  const fetchProfileAndStatus = async () => {
    try {
      const token = await getToken();
      if (token) {
        // Fetch User basic info
        const userRes = await apiCall('/auth/me', { token });
        const user = userRes?.user || userRes;
        if (user) {
          setFullName(user.name || '');
          setMobile(user.mobile || '');
          setEmail(user.email || '');
        }

        // Fetch Service Provider Profile to check status
        const providerRes = await apiCall('/service-providers/profile', {
          token,
        });
        if (providerRes) {
          const currentStatus = providerRes.approvalStatus || providerRes.status || 'IDLE';
          setStatus(currentStatus);
          // Optional: Pre-fill other fields if available
          if (providerRes.documentNumber)
            setDocumentNumber(providerRes.documentNumber);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch profile/status:', e);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [cities, categories] = await Promise.all([
        fetchCities(),
        fetchCategories(),
      ]);
      setCityOptions(cities);
      setCategoryOptions(categories.map(c => c.name));
    } catch (e) {
      console.warn('Failed to fetch dropdown data:', e);
    }
  };

  React.useEffect(() => {
    fetchProfileAndStatus();
    fetchDropdownData();
  }, []);

  React.useEffect(() => {
    if (showUpdateSuccess) {
      const timer = setTimeout(() => setShowUpdateSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showUpdateSuccess]);

  // ── Submit profile ─────────────────────────────────────────
  const submitProfile = async () => {
    if (!fullName || !mobile) {
      Alert.alert(
        'Required Fields',
        'Please fill in your full name and mobile number.',
      );
      return;
    }
    const token = await getToken();
    if (!token) {
      Alert.alert('Session Expired', 'Please log in again.');
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Basic Info
      formData.append('name', fullName);
      if (email) {
        formData.append('email', email);
      } else {
        formData.append(
          'email',
          `artist_${mobile.replace(/[^0-9]/g, '')}@makeupseven.temp`,
        );
      }

      // Bio / Specialization
      if (specialization) {
        formData.append('bio', specialization);
      }

      // Experience Level Mapping
      if (experience) {
        let level = 'STANDARD';
        if (experience.includes('Fresher')) level = 'BUDGET';
        if (experience.includes('Mid-level')) level = 'STANDARD';
        if (experience.includes('Senior')) level = 'PREMIUM';
        formData.append('experienceLevel', level);
      }

      // Targeted Customers (from gender)
      if (gender) {
        formData.append('targetedCustomers', JSON.stringify([gender]));
      }

      // Category IDs
      if (category) {
        const catId = getCategoryIdByName(category);
        formData.append('categoryIds', JSON.stringify([catId]));
      }

      // Languages
      if (language) {
        const langs = language
          .split(',')
          .map(l => l.trim())
          .filter(Boolean);
        formData.append('languagesSpoken', JSON.stringify(langs));
      }

      // Radius
      if (radius) {
        formData.append('radius', radius.toString());
      }

      // Locations
      if (latitude && longitude) {
        const locs = [
          {
            latitude,
            longitude,
            city: city || 'Unknown',
          },
        ];
        formData.append('locations', JSON.stringify(locs));
      }

      // KYC Document Number
      if (documentNumber) {
        formData.append('documentNumber', documentNumber);
      }

      // File: Profile Photo
      if (profilePhoto && profilePhoto.uri) {
        console.log('[Profile] Appending profileImages:', profilePhoto.uri);
        formData.append('profileImages', {
          uri: profilePhoto.uri,
          type: profilePhoto.type || 'image/jpeg',
          name: profilePhoto.name || 'profile.jpg',
        } as any);
      }

      // Files: KYC Documents
      if (documentImages.length > 0) {
        console.log('[Profile] Appending kycDocuments:', documentImages.length);
        documentImages.forEach((img, index) => {
          console.log(`[Profile] KYC [${index}]:`, img.uri);
          formData.append('kycDocuments', {
            uri: img.uri,
            type: img.type || 'image/jpeg',
            name: img.fileName || img.name || `document_${index}.jpg`,
          } as any);
        });
      }

      console.log('[Profile] Submitting Multipart PATCH /service-providers/profile');
      console.log('[Profile] FormData Keys:', (formData as any)._parts?.map((p: any) => p[0]));

      try {
        const res = await apiCall('/service-providers/profile', {
          method: 'PATCH',
          body: formData,
          token,
        });
        console.log('[Profile] Success:', JSON.stringify(res));

        setStatus('PENDING'); // Set to pending after submission
        setShowUpdateSuccess(true); // Show success banner
        setVerificationModalVisible(true);
        
        // Navigate to dashboard after successful submission
        setTimeout(() => {
          navigation.navigate('Artist');
        }, 2000); // Wait 2 seconds to show success message
      } catch (error: any) {
        console.error('[Profile] Submission failed:', error.message);
        Alert.alert(
          'Submission Error',
          error.message || 'Failed to submit profile.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Save / Next button ─────────────────────────────────────
  const handleSave = () => {
    if (step === 0) {
      submitProfile();
    } else if (step < 2) {
      setStep(prev => (prev + 1) as any);
    } else {
      submitProfile();
    }
  };

  const isApproved = status === 'APPROVED';
  const isPending = status === 'PENDING';

  return (
    <ScreenView style={styles.screen}>
      <ProfileStepHeader
        step={step}
        onStepChange={setStep}
        status={status}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {showUpdateSuccess && (
          <View
            style={{
              backgroundColor: '#ECFDF5',
              padding: 15,
              borderRadius: 12,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: '#10B981',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#10B981',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
                ✓
              </Text>
            </View>
            <Text
              style={{
                color: '#065F46',
                fontWeight: '600',
                fontSize: 14,
                flex: 1,
              }}
            >
              Profile updated successfully! It will be live after admin
              approval.
            </Text>
          </View>
        )}

        {isPending && !showUpdateSuccess && step === 0 && (
          <View
            style={{
              backgroundColor: '#F0F9FF',
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: '#BAE6FD',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#0EA5E9',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
                !
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: '#0369A1',
                  fontWeight: '700',
                  fontSize: 14,
                  marginBottom: 2,
                }}
              >
                Verification Pending
              </Text>
              <Text
                style={{
                  color: '#0C4A6E',
                  fontSize: 13,
                  lineHeight: 18,
                }}
              >
                Your profile is under review. Please wait for admin approval to
                access Portfolio and Services.
              </Text>
            </View>
          </View>
        )}

        {step === 0 && (
          <ProfileInfoStep
            fullName={fullName}
            setFullName={setFullName}
            mobile={mobile}
            setMobile={setMobile}
            email={email}
            setEmail={setEmail}
            gender={gender}
            setGender={setGender}
            language={language}
            setLanguage={setLanguage}
            city={city}
            setCity={setCity}
            area={area}
            setArea={setArea}
            pincode={pincode}
            setPincode={setPincode}
            geocoding={geocoding}
            latitude={latitude}
            longitude={longitude}
            mapAddress={mapAddress}
            setLatitude={setLatitude}
            setLongitude={setLongitude}
            radius={radius}
            setRadius={setRadius}
            geocodePincode={geocodePincode}
            category={category}
            setCategory={setCategory}
            experience={experience}
            setExperience={setExperience}
            specialization={specialization}
            setSpecialization={setSpecialization}
            documentNumber={documentNumber}
            setDocumentNumber={setDocumentNumber}
            documentImages={documentImages}
            setDocumentImages={setDocumentImages}
            pickDocument={pickDocument}
            openDropdown={openDropdown}
            cityOptions={cityOptions}
            categoryOptions={categoryOptions}
            profilePhoto={profilePhoto}
            setProfilePhoto={setProfilePhoto}
            pickImage={pickImage}
          />
        )}

        {step === 1 && (
          <PortfolioStep 
            portfolioImages={portfolioImages}
            setPortfolioImages={setPortfolioImages}
            pickDocument={pickDocument} 
          />
        )}

        {step === 2 && (
          <ServicesStep
            serviceCategory={serviceCategory}
            setServiceCategory={setServiceCategory}
            serviceName={serviceName}
            setServiceName={setServiceName}
            serviceDesc={serviceDesc}
            setServiceDesc={setServiceDesc}
            serviceDuration={serviceDuration}
            setServiceDuration={setServiceDuration}
            servicePrice={servicePrice}
            setServicePrice={setServicePrice}
            serviceDiscountPrice={serviceDiscountPrice}
            setServiceDiscountPrice={setServiceDiscountPrice}
            whoShouldTake={whoShouldTake}
            setWhoShouldTake={setWhoShouldTake}
            whoShouldAvoid={whoShouldAvoid}
            setWhoShouldAvoid={setWhoShouldAvoid}
            servicePrimaryImages={servicePrimaryImages}
            setServicePrimaryImages={setServicePrimaryImages}
            serviceOtherImages={serviceOtherImages}
            setServiceOtherImages={setServiceOtherImages}
            openDropdown={openDropdown}
            pickDocument={pickDocument}
            categoryOptions={categoryOptions}
          />
        )}

        {/* Save / Continue button */}
        {!isPending && (
          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.9}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              {step === 0 ? 'Submit' : 'Save and continue'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating Dropdown Overlay */}
      <FloatingDropdownOverlay
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        position={dropdownPos}
        options={currentOptions}
        onSelect={val => onOptionSelectRef.current(val)}
      />

      {/* Verification Success Modal */}
      <VerificationSuccessModal
        visible={verificationModalVisible}
        onClose={() => {
          setVerificationModalVisible(false);
          // Don't necessarily reset if we want them to stay and see the 'pending' status
          // navigation.reset({ index: 0, routes: [{ name: 'Artist' }] });
        }}
      />
    </ScreenView>
  );
};

export default CreateArtistProfileScreen;
