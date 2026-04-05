import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    Switch,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import DropdownField from '../DropdownField';
import InputGroup from '../InputGroup';
import AddProcedureModal from '../AddProcedureModal';
import EssentialsModal from './EssentialsModal';
import styles from './styles/createArtistStyles';

const ESSENTIAL_PLACEHOLDER = require('../../asset/images/facial.png');

const INITIAL_PRIMARY = [require('../../asset/images/facial.png')];
const INITIAL_OTHER = [
    require('../../asset/images/artists1.png'),
    require('../../asset/images/artists2.png'),
];

interface Props {
    serviceCategory: string;
    setServiceCategory: (v: string) => void;
    serviceName: string;
    setServiceName: (v: string) => void;
    serviceDesc: string;
    setServiceDesc: (v: string) => void;
    serviceDuration: string;
    setServiceDuration: (v: string) => void;
    servicePrice: string;
    setServicePrice: (v: string) => void;
    serviceDiscountPrice: string;
    setServiceDiscountPrice: (v: string) => void;
    whoShouldTake: string;
    setWhoShouldTake: (v: string) => void;
    whoShouldAvoid: string;
    setWhoShouldAvoid: (v: string) => void;
    servicePrimaryImages: any[];
    setServicePrimaryImages: (v: any[]) => void;
    serviceOtherImages: any[];
    setServiceOtherImages: (v: any[]) => void;
    openDropdown: (
        options: string[],
        setValue: (val: string) => void,
        layout: { x: number; y: number; width: number; height: number }
    ) => void;
    pickDocument?: (onFilePicked: (file: any) => void) => void;
    categoryOptions: string[];
}

const ServicesStep: React.FC<Props> = ({
    serviceCategory, setServiceCategory,
    serviceName, setServiceName,
    serviceDesc, setServiceDesc,
    serviceDuration, setServiceDuration,
    servicePrice, setServicePrice,
    serviceDiscountPrice, setServiceDiscountPrice,
    whoShouldTake, setWhoShouldTake,
    whoShouldAvoid, setWhoShouldAvoid,
    servicePrimaryImages, setServicePrimaryImages,
    serviceOtherImages, setServiceOtherImages,
    openDropdown, pickDocument,
    categoryOptions,
}) => {
    const [serviceExpanded, setServiceExpanded] = useState(true);
    const [extraInfoEnabled, setExtraInfoEnabled] = useState(true);

    const [exclusiveEssentials, setExclusiveEssentials] = useState<Array<{ image: any; title: string; type?: string }>>([]);
    const [essentialModalVisible, setEssentialModalVisible] = useState(false);
    const [essentialTitle, setEssentialTitle] = useState('');
    const [essentialImage, setEssentialImage] = useState<any>(null);

    const [procedureModalVisible, setProcedureModalVisible] = useState(false);
    const [procedures, setProcedures] = useState([{ title: '', description: '', expanded: true }]);
    const [proceduresSaved, setProceduresSaved] = useState(false);

    const handleUploadPrimary = () => {
        if (pickDocument) {
            pickDocument((file) => setServicePrimaryImages([...servicePrimaryImages, file]));
        }
    };

    const handleUploadOther = () => {
        if (pickDocument) {
            pickDocument((file) => setServiceOtherImages([...serviceOtherImages, file]));
        }
    };

    return (
        <View>
            {/* Header */}
            <View style={styles.addServiceHeader}>
                <Text style={styles.sectionHeaderNoMargin}>Add service</Text>
                <TouchableOpacity style={styles.addServiceBtn}>
                    <FontAwesome name="plus" size={16} color="#7C3AED" />
                </TouchableOpacity>
            </View>

            {/* Service Card */}
            <View style={styles.serviceCard}>
                <TouchableOpacity
                    style={styles.serviceHeaderRow}
                    onPress={() => setServiceExpanded(!serviceExpanded)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.serviceTitle}>Service 1</Text>
                    <FontAwesome name={serviceExpanded ? 'angle-up' : 'angle-down'} size={20} color="#6B7280" />
                </TouchableOpacity>

                {serviceExpanded && (
                    <View style={styles.serviceBody}>
                        <DropdownField label="Service Category" value={serviceCategory} placeholder="Select category"
                            onPress={(layout: any) => openDropdown(categoryOptions, setServiceCategory, layout)} />

                        <InputGroup label="Service Name" placeholder="Bridal Makeup" value={serviceName} onChangeText={setServiceName} />
                        <InputGroup label="Description" placeholder="Complete bridal look with trial" value={serviceDesc} onChangeText={setServiceDesc} />
                        <InputGroup label="Duration" placeholder="2 hours" value={serviceDuration} onChangeText={setServiceDuration} icon="clock-o" />

                        <View style={styles.rowInputs}>
                            <View style={styles.halfInput}>
                                <InputGroup label="Normal Price (₹)" placeholder="2200" value={servicePrice} onChangeText={setServicePrice} keyboardType="numeric" />
                            </View>
                            <View style={styles.halfInput}>
                                <InputGroup label="Discount Price (₹)" placeholder="2200" value={serviceDiscountPrice} onChangeText={setServiceDiscountPrice} keyboardType="numeric" />
                            </View>
                        </View>

                        {/* Primary Service Images */}
                        <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 4 }]}>Primary Service Files (Max 3)</Text>
                        <Text style={[styles.helperText, { marginBottom: 12 }]}>Main shots for this service</Text>
                        {servicePrimaryImages.length < 3 && (
                            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8} onPress={handleUploadPrimary}>
                                <View style={styles.uploadIconCircle}>
                                    <FontAwesome name="paperclip" size={20} color="#7C3AED" />
                                </View>
                                <Text style={styles.uploadTitle}>Attach Primary File</Text>
                                <Text style={styles.uploadSubtitle}>PNG, JPG, PDF up to 10MB each</Text>
                            </TouchableOpacity>
                        )}
                        <View style={styles.primaryImagesList}>
                            {servicePrimaryImages.map((img, index) => (
                                <View key={index} style={styles.primaryImageWrapper}>
                                    {typeof img === 'number' || (typeof img === 'string') || img.type?.includes('image') || img.uri || img.url ? (
                                        <Image
                                            source={typeof img === 'number' ? img : { uri: typeof img === 'string' ? img : (img.uri || img.url) }}
                                            style={styles.primaryImageItem}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View style={[styles.primaryImageItem, { backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }]}>
                                            <FontAwesome name="file-text-o" size={40} color="#7C3AED" />
                                            <Text style={{ fontSize: 12, marginTop: 8 }}>{img.name || 'File'}</Text>
                                        </View>
                                    )}
                                    <TouchableOpacity style={styles.removeBtn} onPress={() => {
                                        const updated = [...servicePrimaryImages];
                                        updated.splice(index, 1);
                                        setServicePrimaryImages(updated);
                                    }}>
                                        <FontAwesome name="times" size={14} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        {/* Other Service Images */}
                        <Text style={[styles.sectionTitle, { marginTop: 12, marginBottom: 4 }]}>Service Gallery (Max 6)</Text>
                        <Text style={[styles.helperText, { marginBottom: 12 }]}>Additional details or angles</Text>
                        {serviceOtherImages.length < 6 && (
                            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8} onPress={handleUploadOther}>
                                <View style={styles.uploadIconCircle}>
                                    <FontAwesome name="paperclip" size={20} color="#7C3AED" />
                                </View>
                                <Text style={styles.uploadTitle}>Attach Gallery File</Text>
                                <Text style={styles.uploadSubtitle}>PNG, JPG, PDF up to 10MB each</Text>
                            </TouchableOpacity>
                        )}
                        <View style={styles.imageGrid}>
                            {serviceOtherImages.map((img, index) => (
                                <View key={index} style={styles.gridImageWrapper}>
                                    {typeof img === 'number' || (typeof img === 'string') || img.type?.includes('image') || img.uri || img.url ? (
                                        <Image
                                            source={typeof img === 'number' ? img : { uri: typeof img === 'string' ? img : (img.uri || img.url) }}
                                            style={styles.gridImage}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View style={[styles.gridImage, { backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }]}>
                                            <FontAwesome name="file-text-o" size={30} color="#7C3AED" />
                                            <Text style={{ fontSize: 9, marginTop: 4, textAlign: 'center', paddingHorizontal: 4 }} numberOfLines={1}>{img.name || 'File'}</Text>
                                        </View>
                                    )}
                                    <TouchableOpacity style={styles.removeBtnSmall} onPress={() => {
                                        const updated = [...serviceOtherImages];
                                        updated.splice(index, 1);
                                        setServiceOtherImages(updated);
                                    }}>
                                        <FontAwesome name="times" size={12} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        {/* Exclusive Essentials */}
                        {/* <View style={styles.essentialsSection}>
                            <View style={styles.essentialsSectionHeader}>
                                <View>
                                    <Text style={[styles.sectionTitle, { fontSize: 15, fontWeight: '600', color: '#111827' }]}>
                                        Exclusive Essentials
                                    </Text>
                                    <Text style={[styles.helperText, { marginBottom: 0, marginTop: 2 }]}>
                                        Add products/essentials used in this service (Max 10)
                                    </Text>
                                </View>
                                {exclusiveEssentials.length < 10 && (
                                    <TouchableOpacity style={styles.essentialsAddBtn} onPress={() => { setEssentialTitle(''); setEssentialModalVisible(true); }}>
                                        <FontAwesome name="plus" size={14} color="#7C3AED" />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* {exclusiveEssentials.length === 0 ? (
                                <TouchableOpacity style={styles.essentialsEmptyBox} onPress={() => { setEssentialTitle(''); setEssentialModalVisible(true); }}>
                                    <View style={styles.essentialsEmptyIcon}>
                                        <FontAwesome name="image" size={22} color="#7C3AED" />
                                    </View>
                                    <Text style={styles.essentialsEmptyTitle}>Add Exclusive Essentials</Text>
                                    <Text style={styles.essentialsEmptySubtitle}>Products, tools or kits used in this service</Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.essentialsGrid}>
                                    {exclusiveEssentials.map((item, index) => (
                                        <View key={index} style={styles.essentialCard}>
                                            <Image source={item.image} style={styles.essentialCardImage} resizeMode="cover" />
                                            <Text style={styles.essentialCardTitle} numberOfLines={2}>{item.title}</Text>
                                            <TouchableOpacity style={styles.essentialRemoveBtn} onPress={() => {
                                                const updated = [...exclusiveEssentials];
                                                updated.splice(index, 1);
                                                setExclusiveEssentials(updated);
                                            }}>
                                                <FontAwesome name="times" size={10} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                    {exclusiveEssentials.length < 10 && (
                                        <TouchableOpacity style={styles.essentialAddTile} onPress={() => { setEssentialTitle(''); setEssentialModalVisible(true); }}>
                                            <FontAwesome name="plus" size={20} color="#7C3AED" />
                                            <Text style={styles.essentialAddTileText}>Add more</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            
                        </View> */}

                        {/* Extra Service Info */}
                        <Text style={[styles.sectionTitle, { fontSize: 16, marginTop: 10, marginBottom: 12 }]}>Extra service information</Text>

                        {!proceduresSaved ? (
                            <TouchableOpacity style={styles.procedureButton} onPress={() => setProcedureModalVisible(true)}>
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
                                    trackColor={{ false: '#D1D5DB', true: '#7C3AED' }}
                                    thumbColor="#fff"
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

            {/* Essentials Modal */}
            <EssentialsModal
                visible={essentialModalVisible}
                onClose={() => setEssentialModalVisible(false)}
                essentialTitle={essentialTitle}
                setEssentialTitle={setEssentialTitle}
                pickDocument={pickDocument}
                essentialImage={essentialImage}
                setEssentialImage={setEssentialImage}
                onAdd={() => {
                    if (!essentialTitle.trim()) return;
                    setExclusiveEssentials(prev => [...prev, { image: essentialImage || ESSENTIAL_PLACEHOLDER, title: essentialTitle.trim(), type: essentialImage?.type }]);
                    setEssentialModalVisible(false);
                    setEssentialImage(null);
                }}
            />

            {/* Procedure Modal */}
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
        </View>
    );
};

export default ServicesStep;
