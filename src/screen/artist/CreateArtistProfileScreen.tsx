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
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';

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

const styles = createArtistStyles;

const CreateArtistProfileScreen = () => {
  const navigation = useNavigation<any>();

  // ── Stepper ────────────────────────────────────────────────
  const [step, setStep] = useState<0 | 1 | 2>(0);

  // ── Personal info ──────────────────────────────────────────
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [language, setLanguage] = useState('');

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

  // ── KYC ───────────────────────────────────────────────────
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarFront, setAadhaarFront] = useState<any>(null);
  const [aadhaarBack, setAadhaarBack] = useState<any>(null);
  const [panNumber, setPanNumber] = useState('');
  const [panImage, setPanImage] = useState<any>(null);

  // ── Modals / UI ────────────────────────────────────────────
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const onOptionSelectRef = useRef<(val: string) => void>(() => { });

  // ── Geocode pincode ────────────────────────────────────────
  const geocodePincode = async (code: string) => {
    if (code.length !== 6) return;
    try {
      setGeocoding(true);
      const url = `https://nominatim.openstreetmap.org/search?postalcode=${code}&country=India&format=json&limit=1`;
      const res = await fetch(url, { headers: { 'User-Agent': 'MakeupSevenApp/1.0' } });
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
        Alert.alert('Pincode Not Found', 'Could not find location for this pincode. Please drag the map pin manually.');
      }
    } catch (e) {
      console.warn('Geocoding failed:', e);
    } finally {
      setGeocoding(false);
    }
  };

  // ── Document picker ────────────────────────────────────────
  const pickDocument = (setter: (v: any) => void) => {
    Alert.alert('Select Document', 'Choose how you want to upload', [
      {
        text: 'Camera',
        onPress: () => launchCamera({ mediaType: 'photo', quality: 1, saveToPhotos: false }, (res: ImagePickerResponse) => {
          if (!res.didCancel && res.assets?.[0]) setter(res.assets[0]);
        }),
      },
      {
        text: 'Gallery',
        onPress: () => launchImageLibrary({ mediaType: 'photo', quality: 1 }, (res: ImagePickerResponse) => {
          if (!res.didCancel && res.assets?.[0]) setter(res.assets[0]);
        }),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // ── Dropdown helper ────────────────────────────────────────
  const openDropdown = (
    options: string[],
    setValue: (val: string) => void,
    layout: { x: number; y: number; width: number; height: number }
  ) => {
    setCurrentOptions(options);
    setDropdownPos({ top: layout.y + layout.height + 4, left: layout.x, width: layout.width });
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
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  // ── Pre-fill user data ─────────────────────────────────────
  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await getToken();
        if (token) {
          const response = await apiCall('/auth/me', { token });
          const user = response?.user || response;
          if (user) {
            setFullName(user.name || '');
            setMobile(user.mobile || '');
            setEmail(user.email || '');
          }
        }
      } catch (e) {
        console.warn('Failed to pre-fill user data:', e);
      }
    };
    fetchUserData();
  }, []);

  // ── Submit profile ─────────────────────────────────────────
  const submitProfile = async () => {
    if (!fullName || !mobile) {
      console.warn('Validation failed: Missing fullName or mobile');
      return;
    }
    const token = await getToken();
    if (!token) {
      console.warn('No token found, cannot submit profile');
      return;
    }

    try {
      setIsSubmitting(true);

      let spExists = false;
      try {
        const checkRes = await apiCall('/auth/me', { token });
        spExists = !!(checkRes?.user?.serviceProvider || checkRes?.serviceProvider);
      } catch (e) {
        console.log('SP check error (ignoring):', e);
      }

      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('mobile', mobile);
      formData.append('email', email || `artist_${mobile.replace(/[^0-9]/g, '')}@makeupseven.temp`);
      formData.append('gender', gender || '');
      formData.append('language', language);
      formData.append('city', city);
      formData.append('area', area);
      formData.append('pincode', pincode);
      formData.append('radius', String(radius));
      if (latitude !== null) formData.append('latitude', String(latitude));
      if (longitude !== null) formData.append('longitude', String(longitude));
      formData.append('category', category);
      formData.append('experience', experience);
      formData.append('specialization', specialization);
      formData.append('aadhaarNumber', aadhaarNumber);
      formData.append('panNumber', panNumber);
      if (aadhaarFront) formData.append('aadhaarFront', { uri: aadhaarFront.uri, type: aadhaarFront.type || 'image/jpeg', name: aadhaarFront.fileName || 'aadhaar_front.jpg' } as any);
      if (aadhaarBack) formData.append('aadhaarBack', { uri: aadhaarBack.uri, type: aadhaarBack.type || 'image/jpeg', name: aadhaarBack.fileName || 'aadhaar_back.jpg' } as any);
      if (panImage) formData.append('panCard', { uri: panImage.uri, type: panImage.type || 'image/jpeg', name: panImage.fileName || 'pan_card.jpg' } as any);

      const endpoint = spExists ? '/service-providers/profile' : '/service-providers';
      const method = spExists ? 'PUT' : 'POST';

      try {
        await apiCall(endpoint, { method, body: formData, token });
        if (step === 2 || step === 0) setVerificationModalVisible(true);
      } catch (error: any) {
        const fallbackEndpoint = !spExists ? '/service-providers/profile' : '/service-providers';
        const fallbackMethod = !spExists ? 'PUT' : 'POST';
        try {
          await apiCall(fallbackEndpoint, { method: fallbackMethod, body: formData, token });
          if (step === 2 || step === 0) setVerificationModalVisible(true);
        } catch (fbError: any) {
          if (fbError.message?.includes('role USER') || fbError.message?.includes('authorized')) {
            Alert.alert('Permission Error', 'This account is registered as a Customer. To submit an Artist profile, please register with a new mobile number.');
          } else {
            Alert.alert('Submission Failed', fbError.message || 'Something went wrong while saving your profile.');
          }
        }
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
      setStep((prev) => (prev + 1) as any);
    } else {
      submitProfile();
    }
  };

  return (
    <ScreenView style={styles.screen}>
      <ProfileStepHeader step={step} onStepChange={setStep} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === 0 && (
          <ProfileInfoStep
            fullName={fullName} setFullName={setFullName}
            mobile={mobile} setMobile={setMobile}
            email={email} setEmail={setEmail}
            gender={gender} setGender={setGender}
            language={language} setLanguage={setLanguage}
            city={city} setCity={setCity}
            area={area} setArea={setArea}
            pincode={pincode} setPincode={setPincode}
            geocoding={geocoding}
            latitude={latitude} longitude={longitude}
            mapAddress={mapAddress}
            setLatitude={setLatitude} setLongitude={setLongitude}
            radius={radius} setRadius={setRadius}
            geocodePincode={geocodePincode}
            category={category} setCategory={setCategory}
            experience={experience} setExperience={setExperience}
            specialization={specialization} setSpecialization={setSpecialization}
            aadhaarNumber={aadhaarNumber} setAadhaarNumber={setAadhaarNumber}
            aadhaarFront={aadhaarFront} setAadhaarFront={setAadhaarFront}
            aadhaarBack={aadhaarBack} setAadhaarBack={setAadhaarBack}
            panNumber={panNumber} setPanNumber={setPanNumber}
            panImage={panImage} setPanImage={setPanImage}
            pickDocument={pickDocument}
            openDropdown={openDropdown}
          />
        )}

        {step === 1 && <PortfolioStep />}

        {step === 2 && <ServicesStep openDropdown={openDropdown} />}

        {/* Save / Continue button */}
        <TouchableOpacity style={styles.saveButton} activeOpacity={0.9} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {step === 0 ? 'Submit' : 'Save and continue'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating Dropdown Overlay */}
      <FloatingDropdownOverlay
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        position={dropdownPos}
        options={currentOptions}
        onSelect={(val) => onOptionSelectRef.current(val)}
      />

      {/* Verification Success Modal */}
      <VerificationSuccessModal
        visible={verificationModalVisible}
        onClose={() => {
          setVerificationModalVisible(false);
          navigation.reset({ index: 0, routes: [{ name: 'Artist' }] });
        }}
      />
    </ScreenView>
  );
};

export default CreateArtistProfileScreen;
