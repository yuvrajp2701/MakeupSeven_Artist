import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
  Pressable,
  Dimensions,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useNavigation } from '@react-navigation/native';
import ScreenView from '../../utils/ScreenView';
import InputGroup from '../../components/InputGroup';
import DropdownField from '../../components/DropdownField';
import FloatingDropdownOverlay from '../../components/FloatingDropdownOverlay';

const { width } = Dimensions.get('window');

const CreateArtistProfileScreen = () => {
  const navigation = useNavigation<any>();

  // Stepper State: 0 = Profile, 1 = Portfolio, 2 = Services
  const [step, setStep] = useState<0 | 1 | 2>(0);

  // Form State
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  const [gender, setGender] = useState('');
  const [language, setLanguage] = useState('');

  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');
  const [radius, setRadius] = useState('');

  const [category, setCategory] = useState('');
  const [experience, setExperience] = useState('');
  const [specialization, setSpecialization] = useState('');

  // Dropdown Logic (Shared Modal)
  const [modalVisible, setModalVisible] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  // Use ref for the callback to avoid closure staleness issues in state
  // Use ref for the callback to avoid closure staleness issues in state
  const onOptionSelectRef = useRef<(val: string) => void>(() => { });

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

  const progressWidth = step === 0 ? '33%' : step === 1 ? '66%' : '100%';

  return (
    <ScreenView style={styles.screen}>
      <View style={styles.headerContainer}>
        {/* HEADER */}
        <View style={styles.navRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={18} color="#7C3AED" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create your artist profile</Text>
        </View>

        {/* PROGRESS BAR */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: progressWidth }]} />
        </View>

        {/* STEPPER LABELS (BELOW LINE) */}
        <View style={styles.tabsRow}>
          <Text style={[styles.tabText, step === 0 && styles.activeTabText]}>
            Profile
          </Text>
          <Text style={[styles.tabText, step === 1 && styles.activeTabText]}>
            Portfolio
          </Text>
          <Text style={[styles.tabText, step === 2 && styles.activeTabText]}>
            Services
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* SECTION: Personal Information */}
        <Text style={styles.sectionHeader}>Personal Information</Text>

        <Text style={styles.fieldLabel}>Upload photo</Text>
        <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8}>
          <View style={styles.uploadIconCircle}>
            <FontAwesome name="upload" size={20} color="#7C3AED" />
          </View>
          <Text style={styles.uploadTitle}>Upload Images</Text>
          <Text style={styles.uploadSubtitle}>PNG, JPG up to 10MB each</Text>
        </TouchableOpacity>

        <InputGroup
          label="Full name"
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
        />
        <InputGroup
          label="Mobile number"
          placeholder="Enter your mobile number"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />
        <InputGroup
          label="Email address"
          placeholder="your email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          icon="envelope-o"
        />

        <DropdownField
          label="Gender"
          value={gender}
          placeholder="Select gender"
          onPress={(layout: any) => openDropdown(['Male', 'Female', 'Other'], setGender, layout)}
        />

        <DropdownField
          label="Language spoken"
          value={language}
          placeholder="Select language"
          onPress={(layout: any) => openDropdown(['English', 'Hindi', 'Marathi', 'Gujarati'], setLanguage, layout)}
        />


        {/* SECTION: Location & Services Area */}
        <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Location & Services Area</Text>

        <DropdownField
          label="City"
          value={city}
          placeholder="Select your city"
          onPress={(layout: any) => openDropdown(['Mumbai', 'Delhi', 'Bangalore', 'Pune'], setCity, layout)}
        />

        <InputGroup
          label="Area / locality"
          placeholder="Enter your area or locality"
          value={area}
          onChangeText={setArea}
        />
        <InputGroup
          label="Pincode"
          placeholder="Enter pin code"
          value={pincode}
          onChangeText={setPincode}
          keyboardType="numeric"
        />

        {/* Service Radius - Stylized as Dropdown since no Slider */}
        <DropdownField
          label="Service radius"
          value={radius}
          placeholder="Select radius"
          onPress={(layout: any) => openDropdown(['5 km', '10 km', '15 km', '20 km', '30 km'], setRadius, layout)}
        />
        <Text style={styles.helperText}>Customer within this radius can book your service</Text>


        {/* SECTION: Professional overview */}
        <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Professional overview</Text>

        <DropdownField
          label="Select your primary category"
          value={category}
          placeholder="Select primary category"
          onPress={(layout: any) => openDropdown(['Makeup', 'Hair Styling', 'Nail Art', 'Mehendi'], setCategory, layout)}
        />

        <DropdownField
          label="Experience"
          value={experience}
          placeholder="Select your experience level"
          onPress={(layout: any) => openDropdown(['Fresher (0-1 y)', 'Mid-level (2-5 y)', 'Senior (5+ y)'], setExperience, layout)}
        />

        <DropdownField
          label="Specialization"
          value={specialization}
          placeholder="Select specialization"
          onPress={(layout: any) => openDropdown(['Bridal Makeup', 'Party Makeup', 'Editorial'], setSpecialization, layout)}
        />


        {/* SAVE BUTTON */}
        <TouchableOpacity style={styles.saveButton} activeOpacity={0.9} onPress={() => setStep(prev => prev < 2 ? (prev + 1) as any : 0)}>
          <Text style={styles.saveButtonText}>Save and continue</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>


      {/* FLOATING DROPDOWN OVERLAY */}
      <FloatingDropdownOverlay
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        position={dropdownPos}
        options={currentOptions}
        onSelect={(val) => onOptionSelectRef.current(val)}
      />

    </ScreenView>
  );
};

/* --- STYLES --- */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingTop: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3ECFF',
    borderRadius: 20,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7C3AED',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    width: '33.33%',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#111827',
    fontWeight: '600',
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    width: '100%',
    flexDirection: 'row',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  scrollContent: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },

  // Upload Box
  uploadBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    marginBottom: 20,
    backgroundColor: '#F9FAFB',
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3ECFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  uploadSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },

  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },

  helperText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: -8,
    marginBottom: 16,
    textAlign: 'right',
  },

  // Button
  saveButton: {
    backgroundColor: '#7C3AED',
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

});

export default CreateArtistProfileScreen;
