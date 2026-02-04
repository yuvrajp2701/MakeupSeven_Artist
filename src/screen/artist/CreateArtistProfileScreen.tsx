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
  Image,
  Switch,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useNavigation } from '@react-navigation/native';
import ScreenView from '../../utils/ScreenView';
import InputGroup from '../../components/InputGroup';
import DropdownField from '../../components/DropdownField';
import FloatingDropdownOverlay from '../../components/FloatingDropdownOverlay';
import { Slider } from '@miblanchard/react-native-slider';
import AddProcedureModal from '../../components/AddProcedureModal';
import VerificationSuccessModal from '../../components/VerificationSuccessModal';

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
  const [radius, setRadius] = useState<number>(10);

  const [category, setCategory] = useState('');
  const [experience, setExperience] = useState('');
  const [specialization, setSpecialization] = useState('');


  // Service State
  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDiscountPrice, setServiceDiscountPrice] = useState('');
  const [whoShouldTake, setWhoShouldTake] = useState('');
  const [whoShouldAvoid, setWhoShouldAvoid] = useState('');
  const [extraInfoEnabled, setExtraInfoEnabled] = useState(true);

  const [serviceExpanded, setServiceExpanded] = useState(true);

  // Procedure State
  const [procedureModalVisible, setProcedureModalVisible] = useState(false);
  const [procedures, setProcedures] = useState([{ title: '', description: '', expanded: true }]);
  const [proceduresSaved, setProceduresSaved] = useState(false);

  // Verification Modal State
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);

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
            <FontAwesome name="arrow-left" size={25} color="#7C3AED" />
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

        {step === 0 && (
          <>
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

            {/* Service Radius */}
            <Text style={styles.fieldLabel}>Service radius</Text>
            <Slider
              value={radius}
              minimumValue={5}
              maximumValue={100}
              step={1}
              onValueChange={(val) => setRadius(val[0])}
              minimumTrackTintColor="#7C3AED"
              maximumTrackTintColor="#F3F4F6"
              thumbTintColor="#7C3AED"
              trackStyle={{ height: 10, borderRadius: 5 }}
              thumbStyle={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#7C3AED' }}
            />
            <View style={styles.radiusInfoRow}>
              <Text style={styles.radiusValueText}>{Math.round(radius)} km</Text>
              <Text style={styles.radiusHelperText}>Customer within this radius can book your service</Text>
            </View>

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
          </>
        )}

        {step === 1 && (
          <View>
            <Text style={[styles.sectionHeader, { marginBottom: 8 }]}>Portfolio Images & Videos</Text>
            <Text style={styles.helperText}>Upload clear, well lit photos to get more bookings</Text>

            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8}>
              <View style={styles.uploadIconCircle}>
                <FontAwesome name="upload" size={20} color="#7C3AED" />
              </View>
              <Text style={styles.uploadTitle}>Upload Images / videos</Text>
              <Text style={styles.uploadSubtitle}>PNG, JPG up to 50MB each</Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Your portfolio images</Text>
            <View style={styles.imageGrid}>
              {[
                require('../../asset/images/facial.png'),
                require('../../asset/images/artists1.png'),
                require('../../asset/images/artists2.png'),
                require('../../asset/images/bestartists1.png'),
              ].map((img, index) => (
                <Image key={index} source={img} style={styles.gridImage} resizeMode="cover" />
              ))}
            </View>
          </View>
        )}

        {step === 2 && (
          <View>
            <View style={styles.addServiceHeader}>
              <Text style={styles.sectionHeaderNoMargin}>Add service</Text>
              <TouchableOpacity style={styles.addServiceBtn}>
                <FontAwesome name="plus" size={16} color="#7C3AED" />
              </TouchableOpacity>
            </View>

            {/* SERVICE CARD */}
            <View style={styles.serviceCard}>
              <TouchableOpacity
                style={styles.serviceHeaderRow}
                onPress={() => setServiceExpanded(!serviceExpanded)}
                activeOpacity={0.7}
              >
                <Text style={styles.serviceTitle}>Service 1</Text>
                <FontAwesome name={serviceExpanded ? "angle-up" : "angle-down"} size={20} color="#6B7280" />
              </TouchableOpacity>

              {serviceExpanded && (
                <View style={styles.serviceBody}>
                  <InputGroup
                    label="Service Name"
                    placeholder="Bridal Makeup"
                    value={serviceName}
                    onChangeText={setServiceName}
                  />

                  <InputGroup
                    label="Description"
                    placeholder="Complete bridal look with trial"
                    value={serviceDesc}
                    onChangeText={setServiceDesc}
                  />

                  <InputGroup
                    label="Duration"
                    placeholder="2 hours"
                    value={serviceDuration}
                    onChangeText={setServiceDuration}
                    icon="clock-o"
                  />

                  <View style={styles.rowInputs}>
                    <View style={styles.halfInput}>
                      <InputGroup
                        label="Normal Price (₹)"
                        placeholder="2200"
                        value={servicePrice}
                        onChangeText={setServicePrice}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.halfInput}>
                      <InputGroup
                        label="Discount Price (₹)"
                        placeholder="2200"
                        value={serviceDiscountPrice}
                        onChangeText={setServiceDiscountPrice}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <Text style={styles.fieldLabel}>Upload service images</Text>
                  <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8}>
                    <View style={styles.uploadIconCircle}>
                      <FontAwesome name="upload" size={20} color="#7C3AED" />
                    </View>
                    <Text style={styles.uploadTitle}>Upload Images</Text>
                    <Text style={styles.uploadSubtitle}>PNG, JPG up to 10MB each</Text>
                  </TouchableOpacity>

                  <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Services images</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.serviceImagesRow}>
                    {[
                      require('../../asset/images/artists1.png'),
                      require('../../asset/images/artists2.png'),
                      require('../../asset/images/bestartists1.png'),
                      require('../../asset/images/facial.png'),
                    ].map((img, index) => (
                      <Image key={index} source={img} style={styles.serviceImageItem} resizeMode="cover" />
                    ))}
                  </ScrollView>

                  {/* EXTRA SERVICE INFO */}
                  <Text style={[styles.sectionTitle, { fontSize: 16, marginTop: 10, marginBottom: 12 }]}>Extra service information</Text>

                  {!proceduresSaved ? (
                    <TouchableOpacity
                      style={styles.procedureButton}
                      onPress={() => setProcedureModalVisible(true)}
                    >
                      <Text style={styles.procedureBtnText}>Add procedure</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.procedureSummaryBox}>
                      <Text style={styles.smallLabel}>Procedures</Text>
                      {procedures.map((proc, index) => (
                        <View key={index} style={styles.procedureSummaryItem}>
                          <Text style={styles.procIndex}>{index + 1}</Text>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.procTitle}>{proc.title || `Procedure ${index + 1}`}</Text>
                            <Text style={styles.procDesc}>{proc.description}</Text>
                          </View>
                        </View>
                      ))}

                      <TouchableOpacity style={styles.editProcedureBtn} onPress={() => setProcedureModalVisible(true)}>
                        <Text style={styles.editProcedureText}>Edit procedure</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  <View style={styles.extraInfoBox}>
                    <View style={styles.extraInfoHeader}>
                      <Text style={styles.extraInfoTitle}>Who Should Take / Avoid This Service</Text>
                      <Switch
                        trackColor={{ false: "#D1D5DB", true: "#7C3AED" }}
                        thumbColor={"#fff"}
                        ios_backgroundColor="#D1D5DB"
                        onValueChange={setExtraInfoEnabled}
                        value={extraInfoEnabled}
                      />
                    </View>

                    {extraInfoEnabled && (
                      <View>
                        <Text style={styles.smallLabel}>Who should take this service?</Text>
                        <TextInput
                          style={styles.textArea}
                          placeholder="To Increase glow..."
                          placeholderTextColor="#9CA3AF"
                          multiline
                          value={whoShouldTake}
                          onChangeText={setWhoShouldTake}
                          textAlignVertical="top"
                        />

                        <Text style={styles.smallLabel}>Who should avoid this service?</Text>
                        <TextInput
                          style={styles.textArea}
                          placeholder="To Increase glow..."
                          placeholderTextColor="#9CA3AF"
                          multiline
                          value={whoShouldAvoid}
                          onChangeText={setWhoShouldAvoid}
                          textAlignVertical="top"
                        />
                      </View>
                    )}
                  </View>

                </View>
              )}
            </View>
          </View>
        )}


        {/* SAVE BUTTON */}
        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.9}
          onPress={() => {
            if (step < 2) {
              setStep((prev) => (prev + 1) as any);
            } else {
              // Show Success Modal
              setVerificationModalVisible(true);
            }
          }}
        >
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

      {/* PROCEDURE MODAL COMPONENT */}
      <AddProcedureModal
        visible={procedureModalVisible}
        onClose={() => setProcedureModalVisible(false)}
        onSave={(newProcedures) => {
          setProcedures(newProcedures);
          setProceduresSaved(true);
          setProcedureModalVisible(false);
        }}
        initialProcedures={procedures}
      />

      {/* VERIFICATION SUCCESS MODAL COMPONENT */}
      <VerificationSuccessModal
        visible={verificationModalVisible}
        onClose={() => {
          setVerificationModalVisible(false);
          navigation.goBack();
        }}
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
    paddingTop: 40,
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
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3ECFF',
    borderRadius: 15,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
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
    marginTop: 10,
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
    fontSize: 20,
    fontWeight: '500',
    color: '#111827',
    marginTop: 20,
    marginBottom: 30,
  },

  // Upload Box
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  fieldLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 18,
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
  radiusInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
    marginBottom: 20,
  },
  radiusValueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  radiusHelperText: {
    fontSize: 16,
    color: '#6B7281',
    flex: 1,
    textAlign: 'right',
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridImage: {
    width: (width - 32 - 24) / 3,
    height: (width - 32 - 24) / 3,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#F3F4F6',
  },

  // Service Step
  serviceImagesRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 8,
  },
  serviceImageItem: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 10,
  },
  addServiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  addServiceBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F3ECFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  serviceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  serviceBody: {
    marginTop: 10,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  procedureButton: {
    borderWidth: 1,
    borderColor: '#C4B5FD',
    backgroundColor: '#F3ECFF', // Slight purple tint
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  procedureBtnText: {
    color: '#7C3AED',
    fontWeight: '600',
    fontSize: 16,
  },
  extraInfoBox: {
    backgroundColor: '#F3ECFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  extraInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  extraInfoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    paddingRight: 10,
  },
  smallLabel: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 8,
    marginTop: 4,
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    height: 100,
    color: '#1F2937',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeaderNoMargin: {
    fontSize: 20,
    fontWeight: '500',
    color: '#111827',
  },

  // Procedure Summary Box
  procedureSummaryBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  procedureSummaryItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 12,
  },
  procIndex: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 12,
    width: 20,
  },
  procTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  procDesc: {
    fontSize: 13,
    color: '#6B7280',
  },
  editProcedureBtn: {
    backgroundColor: '#F3ECFF',
    borderRadius: 10,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C4B5FD',
  },
  editProcedureText: {
    color: '#7C3AED',
    fontSize: 15,
    fontWeight: '600',
  },

});

export default CreateArtistProfileScreen;
