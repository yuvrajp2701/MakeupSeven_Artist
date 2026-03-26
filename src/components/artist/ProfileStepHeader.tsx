import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import styles from './styles/createArtistStyles';

import { useNavigation } from '@react-navigation/native';
import FontAwesome from '@react-native-vector-icons/fontawesome';

interface Props {
  step: 0 | 1 | 2;
  onStepChange: (s: 0 | 1 | 2) => void;
  status?: string;
}

const ProfileStepHeader: React.FC<Props> = ({ step, onStepChange, status = 'IDLE' }) => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const progressWidth = step === 0 ? '33%' : step === 1 ? '66%' : '100%';

  return (
    <View style={styles.headerContainer}>
      {/* Title row */}
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.backButtonPlaceholder} onPress={() => navigation.goBack()}>
          <FontAwesome name="angle-left" size={24} color="#7B4DFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create your artist profile</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: progressWidth }]} />
      </View>

      {/* Step tabs */}
      <View style={styles.tabsRow}>
        {(['Profile', 'Portfolio', 'Services'] as const).map((label, idx) => {
          // If status is PENDING, lock Portfolio and Services
          const isDisabled = status === 'PENDING' && idx > 0;

          return (
            <TouchableOpacity
              key={label}
              style={[styles.tabItem, isDisabled && { opacity: 0.5 }]}
              onPress={() => {
                if (isDisabled) {
                  setIsModalVisible(true);
                } else {
                  onStepChange(idx as 0 | 1 | 2);
                }
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  step === idx && styles.activeTabText,
                  { width: '100%' },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContent}>
            <View style={localStyles.lockIconOuter}>
              <View style={localStyles.lockIconInner}>
                <FontAwesome name="lock" size={32} color="#fff" />
              </View>
            </View>

            <Text style={localStyles.modalTitle}>Profile Pending Approval</Text>

            <Text style={localStyles.modalBody}>
              Your profile is currently under review by our admin team.{'\n\n'}
              Please wait for approval to access Portfolio and Services sections.
            </Text>

            <TouchableOpacity
              style={localStyles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={localStyles.closeButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  lockIconOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3ECFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  lockIconInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7B4DFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalBody: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  closeButton: {
    backgroundColor: '#7B4DFF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileStepHeader;
