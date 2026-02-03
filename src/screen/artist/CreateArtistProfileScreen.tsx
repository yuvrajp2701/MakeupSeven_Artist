import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useNavigation } from '@react-navigation/native';
import ScreenView from '../../utils/ScreenView';
import Dropdown from '../../components/Dropdown';

const CreateArtistProfileScreen = () => {
  const navigation = useNavigation<any>();

  // 0 = Profile, 1 = Portfolio, 2 = Services
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const progressWidth =
    step === 0 ? '16.6%' : step === 1 ? '50%' : '83.3%';

  return (
    <ScreenView>
     <ScrollView
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="always"
>


        {/* ===== HEADER + STEPPER ===== */}
        <View style={styles.headerWrapper}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <FontAwesome name="arrow-left" size={16} color="#7C3AED" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              Create your artist profile
            </Text>
          </View>

          {/* ===== STEPPER ===== */}
          <View style={styles.stepperWrapper}>

            {/* LINE */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: progressWidth }]} />
            </View>

            {/* LABELS */}
            <View style={styles.stepsRow}>
              <Text style={[styles.stepText, step === 0 && styles.activeStep]}>
                Profile
              </Text>
              <Text style={[styles.stepText, step === 1 && styles.activeStep]}>
                Portfolio
              </Text>
              <Text style={[styles.stepText, step === 2 && styles.activeStep]}>
                Services
              </Text>
            </View>
          </View>
        </View>

        {/* ===== FORM ===== */}
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Personal information</Text>

          {/* Upload */}
          <TouchableOpacity style={styles.uploadBox} activeOpacity={0.9}>
            <View style={styles.uploadIcon}>
              <FontAwesome name="upload" size={18} color="#7C3AED" />
            </View>
            <Text style={styles.uploadTitle}>Upload Images</Text>
            <Text style={styles.uploadSub}>PNG, JPG up to 10MB each</Text>
          </TouchableOpacity>

          <Input label="Full name" placeholder="Enter your full name" />
          <Input label="Mobile number" placeholder="Enter your mobile number" />
          <Input label="Email address" placeholder="Enter your email address" />

          <Dropdown
            label="Gender"
            placeholder="Select gender"
            options={['Male', 'Female', 'Other']}
          />

          <Dropdown
            label="Languages spoken"
            placeholder="Select language"
            options={['English', 'Hindi', 'Marathi']}
          />

          <Text style={styles.sectionTitle}>Location & Services Area</Text>

          <Dropdown
            label="City"
            placeholder="Select your city"
            options={['Mumbai', 'Delhi', 'Bangalore']}
          />

          <Input label="Area / locality" placeholder="Enter your area or locality" />
          <Input label="Pincode" placeholder="Enter pin code" />

          <Dropdown
            label="Service radius"
            placeholder="Select radius"
            options={['5 km', '10 km', '20 km']}
          />

          <Text style={styles.sectionTitle}>Professional overview</Text>

          <Dropdown
            label="Primary category"
            placeholder="Select primary category"
            options={['Makeup', 'Hair', 'Nails']}
          />

          <Dropdown
            label="Experience"
            placeholder="Select experience level"
            options={['0–1 years', '2–5 years', '5+ years']}
          />

          <Dropdown
            label="Specialization"
            placeholder="Select specialization"
            options={['Bridal', 'Party', 'Photoshoot']}
          />

          {/* SAVE */}
          <TouchableOpacity
            style={styles.saveBtn}
            activeOpacity={0.9}
            onPress={() => setStep(1)}
          >
            <Text style={styles.saveText}>Save and continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default CreateArtistProfileScreen;

/* ================= INPUT ================= */

const Input = ({ label, placeholder }: any) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      style={styles.input}
    />
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3ECFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7C3AED',
  },

  /* ===== STEPPER ===== */

  stepperWrapper: {
    marginBottom: 14,
  },

  progressTrack: {
    height: 3,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 10,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 2,
  },

  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  stepText: {
    width: '33.33%',
    textAlign: 'center',
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  activeStep: {
    color: '#7C3AED',
    fontWeight: '600',
  },

  /* ===== FORM ===== */

  container: {
    padding: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 12,
  },

  uploadBox: {
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 16,
  },

  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEE9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  uploadTitle: {
    fontSize: 14,
    fontWeight: '500',
  },

  uploadSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },

  field: {
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 6,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },

  saveBtn: {
    backgroundColor: '#7C3AED',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 24,
  },

  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
