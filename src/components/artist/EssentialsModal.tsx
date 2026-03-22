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

interface Props {
    // Modal state
    visible: boolean;
    onClose: () => void;
    essentialTitle: string;
    setEssentialTitle: (v: string) => void;
    onAdd: () => void;
    pickDocument?: (onFilePicked: (file: any) => void) => void;
    essentialImage?: any;
    setEssentialImage: (img: any) => void;
}

const EssentialsModal: React.FC<Props> = ({
    visible, onClose,
    essentialTitle, setEssentialTitle,
    onAdd,
    pickDocument,
    essentialImage,
    setEssentialImage,
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
                <Text style={styles.essentialModalSubtitle}>Choose a document/image and give it a name</Text>

                {/* Image Picker Placeholder */}
                <TouchableOpacity
                    style={styles.essentialImagePickerBox}
                    activeOpacity={0.8}
                    onPress={() => pickDocument && pickDocument(setEssentialImage)}
                >
                    {essentialImage ? (
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            {essentialImage.type?.includes('image') || typeof essentialImage === 'number' ? (
                                <Image source={typeof essentialImage === 'number' ? essentialImage : { uri: essentialImage.uri }} style={{ width: 60, height: 60, borderRadius: 10 }} />
                            ) : (
                                <FontAwesome name="file-text-o" size={40} color="#7C3AED" />
                            )}
                            <Text style={{ fontSize: 12, marginTop: 8, color: '#374151' }}>{essentialImage.name || 'File Selected'}</Text>
                        </View>
                    ) : (
                        <>
                            <View style={styles.essentialImagePickerIcon}>
                                <FontAwesome name="paperclip" size={24} color="#7C3AED" />
                            </View>
                            <Text style={styles.essentialImagePickerText}>Tap to attach file</Text>
                            <Text style={styles.essentialImagePickerSub}>Images or PDF up to 10MB</Text>
                        </>
                    )}
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
