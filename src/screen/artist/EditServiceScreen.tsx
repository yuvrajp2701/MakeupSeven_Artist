import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import ScreenView from '../../utils/ScreenView';

const EditServiceScreen = ({ navigation }: any) => {
    const [avoidService, setAvoidService] = useState(true);

    return (
        <ScreenView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>

                    {/* HEADER */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                            <FontAwesome name="angle-left" size={22} color="#7B4DFF" />
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>Edit services</Text>

                        <TouchableOpacity style={styles.saveBtn}>
                            <FontAwesome name="save" size={18} color="#7B4DFF" />
                        </TouchableOpacity>
                    </View>

                    {/* ADD SERVICE */}
                    <View style={styles.addServiceRow}>
                        <Text style={styles.addServiceText}>Add service</Text>
                        <TouchableOpacity style={styles.addIcon}>
                            <FontAwesome name="plus" size={14} color="#7B4DFF" />
                        </TouchableOpacity>
                    </View>

                    {/* SERVICE CARD */}
                    <View style={styles.serviceCard}>

                        {/* Service Header */}
                        <View style={styles.serviceHeader}>
                            <Text style={styles.serviceTitle}>Service 1</Text>
                            <FontAwesome name="angle-up" size={18} color="#9CA3AF" />
                        </View>

                        {/* Service Name */}
                        <Text style={styles.label}>Service Name</Text>
                        <TextInput
                            style={styles.input}
                            value="Bridal Makeup"
                        />

                        {/* Description */}
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            multiline
                            value="Complete bridal look with trial"
                        />

                        {/* Duration */}
                        <Text style={styles.label}>Duration</Text>
                        <View style={styles.durationBox}>
                            <FontAwesome name="clock-o" size={16} color="#6B7280" />
                            <Text style={styles.durationText}>2 hours</Text>
                        </View>

                        {/* Prices */}
                        <View style={styles.priceRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Normal Price (₹)</Text>
                                <TextInput style={styles.input} value="2200" keyboardType="numeric" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Discount Price (₹)</Text>
                                <TextInput style={styles.input} value="2200" keyboardType="numeric" />
                            </View>
                        </View>

                        {/* Upload Images */}
                        <Text style={styles.label}>Upload service images</Text>
                        <TouchableOpacity style={styles.uploadBox}>
                            <FontAwesome name="upload" size={42} color="#7B4DFF" />
                            <Text style={styles.uploadText}>Upload Images</Text>
                            <Text style={styles.uploadSub}>PNG, JPG up to 10MB each</Text>
                        </TouchableOpacity>
                        <Text style={styles.label}>Services Images</Text>

                        {/* Image Preview */}
                        <View style={styles.imageRow}>
                            {[1, 2, 3].map(i => (
                                <Image
                                    key={i}
                                    source={require('../../asset/images/artists1.png')}
                                    style={styles.previewImage}
                                />
                            ))}
                        </View>

                        {/* Extra Info */}
                        <Text style={styles.sectionTitle}>Extra service information</Text>

                        {/* Procedures */}
                        <Text style={styles.label}>Procedures</Text>

                        <View style={styles.procedureBox}>
                            <Text style={styles.procedureTitle}>1. Cleansing</Text>
                            <Text style={styles.procedureSub}>
                                Removes dirt & makeup for clean base
                            </Text>
                        </View>

                        <View style={styles.procedureBox}>
                            <Text style={styles.procedureTitle}>2. Steam & Exfoliation</Text>
                            <Text style={styles.procedureSub}>
                                Opens pores + removes dead skin cells
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.editProcedureBtn}>
                            <Text style={styles.editProcedureText}>Edit procedure</Text>
                        </TouchableOpacity>

                        {/* Toggle */}
                        <View style={styles.toggleBox}>
                            <View>
                                <Text style={styles.toggleTitle}>
                                    Who Should Take / Avoid This Service
                                </Text>
                                <Text style={styles.toggleSub}>
                                    Who should take this service?
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.toggle,
                                    avoidService && styles.toggleActive,
                                ]}
                                onPress={() => setAvoidService(!avoidService)}
                            >
                                <View style={styles.toggleDot} />
                            </TouchableOpacity>
                        </View>

                        {/* Text Areas */}
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Who should take this service?"
                            value="To increase glow..."
                        />

                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Who should avoid this service?"
                            value="To increase glow..."
                        />

                    </View>

                </View>
            </ScrollView>
        </ScreenView>
    );
};

export default EditServiceScreen;
const styles = StyleSheet.create({
    container: { paddingBottom: 40 },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#EFE4FF',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: '#7B4DFF',
    },
    saveBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },

    addServiceRow: {
        margin: 20,
        padding: 14,
        backgroundColor: '#fff',
        borderRadius: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        elevation: 2,
    },
    addServiceText: { fontWeight: '400', fontSize: 22, },
    addIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#EFE4FF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    serviceCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 16,
        elevation: 2,
    },

    serviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    serviceTitle: { fontSize: 18, fontWeight: '600' },

    label: {
        fontSize: 15,
        color: '#6B7280',
        marginTop: 14,
        marginBottom: 6,
    },

    input: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },

    durationBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 12,
    },
    durationText: { marginLeft: 8 },

    priceRow: {
        flexDirection: 'row',
        gap: 12,
    },

    uploadBox: {
        marginTop: 10,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#7B4DFF',
        borderRadius: 14,
        padding: 20,
        alignItems: 'center',
    },
    uploadText: { marginTop: 15, fontWeight: '500', fontSize: 17, },
    uploadSub: { fontSize: 16, color: '#6B7280', marginTop: 10, },

    imageRow: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 20,
    },
    previewImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 10,
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginTop: 20,
    },

    procedureBox: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 12,
        marginTop: 10,
    },
    procedureTitle: { fontWeight: '600', fontSize: 17, },
    procedureSub: { fontSize: 15, color: '#6B7280' },

    editProcedureBtn: {
        width: '100%',
        marginTop: 12,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#7B4DFF',
        backgroundColor: '#d4c8f4cd',
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editProcedureText: { color: '#7B4DFF' },

    toggleBox: {
        marginTop: 20,
        padding: 14,
        backgroundColor: '#F3EDFF',
        borderRadius: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    toggleTitle: { fontWeight: '600' },
    toggleSub: { fontSize: 12, color: '#6B7280' },

    toggle: {
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
    },
    toggleActive: {
        backgroundColor: '#7B4DFF',
    },
    toggleDot: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#fff',
        marginLeft: 3,
    },
});
