import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    Pressable,
    TextInput,
    Switch,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import styles from './styles/createArtistStyles';

interface EssentialItem {
    image: any;
    title: string;
}

interface Props {
    // Modal state
    visible: boolean;
    onClose: () => void;
    essentialTitle: string;
    setEssentialTitle: (v: string) => void;
    onAdd: () => void;
}

const EssentialsModal: React.FC<Props> = ({
    visible, onClose,
    essentialTitle, setEssentialTitle,
    onAdd,
}) => (
    <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
    >
        <Pressable style={styles.essentialModalOverlay} onPress={onClose}>
            <Pressable style={styles.essentialModalSheet} onPress={() => { }}>
                <View style={styles.essentialModalHandle} />

                <Text style={styles.essentialModalTitle}>Add Exclusive Essential</Text>
                <Text style={styles.essentialModalSubtitle}>Choose an image and give it a name</Text>

                {/* Image Picker Placeholder */}
                <TouchableOpacity style={styles.essentialImagePickerBox} activeOpacity={0.8}>
                    <View style={styles.essentialImagePickerIcon}>
                        <FontAwesome name="camera" size={24} color="#7C3AED" />
                    </View>
                    <Text style={styles.essentialImagePickerText}>Tap to select image</Text>
                    <Text style={styles.essentialImagePickerSub}>PNG, JPG up to 5MB</Text>
                </TouchableOpacity>

                {/* Title Input */}
                <Text style={styles.essentialInputLabel}>Essential Name</Text>
                <TextInput
                    style={styles.essentialInput}
                    placeholder="e.g. MAC Foundation, Contour Kit"
                    placeholderTextColor="#9CA3AF"
                    value={essentialTitle}
                    onChangeText={setEssentialTitle}
                    maxLength={40}
                />

                {/* Action Buttons */}
                <View style={styles.essentialModalActions}>
                    <TouchableOpacity style={styles.essentialCancelBtn} onPress={onClose}>
                        <Text style={styles.essentialCancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.essentialConfirmBtn, !essentialTitle.trim() && { opacity: 0.5 }]}
                        disabled={!essentialTitle.trim()}
                        onPress={onAdd}
                    >
                        <Text style={styles.essentialConfirmText}>Add Essential</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Pressable>
    </Modal>
);

export default EssentialsModal;
