import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles/createArtistStyles';

interface Props {
    step: 0 | 1 | 2;
    onStepChange: (s: 0 | 1 | 2) => void;
}

const ProfileStepHeader: React.FC<Props> = ({ step, onStepChange }) => {
    const progressWidth = step === 0 ? '33%' : step === 1 ? '66%' : '100%';

    return (
        <View style={styles.headerContainer}>
            {/* Title row */}
            <View style={styles.navRow}>
                <View style={styles.backButtonPlaceholder} />
                <Text style={styles.headerTitle}>Create your artist profile</Text>
            </View>

            {/* Progress bar */}
            <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: progressWidth }]} />
            </View>

            {/* Step tabs */}
            <View style={styles.tabsRow}>
                {(['Profile', 'Portfolio', 'Services'] as const).map((label, idx) => (
                    <TouchableOpacity
                        key={label}
                        style={styles.tabItem}
                        onPress={() => onStepChange(idx as 0 | 1 | 2)}
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
                ))}
            </View>
        </View>
    );
};

export default ProfileStepHeader;
