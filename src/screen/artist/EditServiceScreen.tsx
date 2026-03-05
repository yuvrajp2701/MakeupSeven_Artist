import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    ActivityIndicator,
    Alert,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import ScreenView from '../../utils/ScreenView';
import { useRoute } from '@react-navigation/native';
import { apiCall } from '../../services/api';
import { getToken } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';

const EditServiceScreen = ({ navigation }: any) => {
    const route = useRoute<any>();
    const { userToken } = useAuth();
    const editingService = route.params?.service;

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(editingService?.name || '');
    const [description, setDescription] = useState(editingService?.description || '');
    const [duration, setDuration] = useState(editingService?.duration?.toString() || '60');
    const [basePrice, setBasePrice] = useState(editingService?.basePrice?.toString() || '');
    const [discountPrice, setDiscountPrice] = useState(editingService?.discountPrice?.toString() || '');
    const [whoShouldTake, setWhoShouldTake] = useState(editingService?.whoShouldTake || '');
    const [whoShouldAvoid, setWhoShouldAvoid] = useState(editingService?.whoShouldAvoid || '');

    const [avoidService, setAvoidService] = useState(true);

    const handleSave = async () => {
        if (!name || !basePrice || !duration) {
            Alert.alert("Validation", "Please fill name, price and duration.");
            return;
        }

        try {
            setLoading(true);
            const token = userToken || await getToken();
            if (!token) return;

            const payload = {
                name,
                description,
                duration: parseInt(duration),
                basePrice: parseFloat(basePrice),
                discountPrice: discountPrice ? parseFloat(discountPrice) : parseFloat(basePrice),
                whoShouldTake,
                whoShouldAvoid,
                category: editingService?.category || "Makeup", // Default category
            };

            if (editingService?.id || editingService?._id) {
                const id = editingService.id || editingService._id;
                await apiCall(`/services/${id}`, {
                    method: 'PUT',
                    token,
                    body: payload
                });
                Alert.alert("Success", "Service updated successfully");
            } else {
                await apiCall('/services', {
                    method: 'POST',
                    token,
                    body: payload
                });
                Alert.alert("Success", "Service created successfully");
            }
            navigation.goBack();
        } catch (e: any) {
            console.error('Save service error:', e);
            Alert.alert("Error", e.message || "Failed to save service");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>

                    {/* HEADER */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                            <FontAwesome name="angle-left" size={22} color="#7B4DFF" />
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>{editingService ? 'Edit Service' : 'Add Service'}</Text>

                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                            {loading ? <ActivityIndicator size="small" color="#7B4DFF" /> : <FontAwesome name="save" size={18} color="#7B4DFF" />}
                        </TouchableOpacity>
                    </View>

                    {/* SERVICE CARD */}
                    <View style={styles.serviceCard}>
                        {/* Service Name */}
                        <Text style={styles.label}>Service Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Bridal Makeup"
                            value={name}
                            onChangeText={setName}
                        />

                        {/* Description */}
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            multiline
                            placeholder="Describe your service..."
                            value={description}
                            onChangeText={setDescription}
                        />

                        {/* Duration */}
                        <Text style={styles.label}>Duration (minutes)</Text>
                        <View style={styles.durationBox}>
                            <FontAwesome name="clock-o" size={16} color="#6B7280" />
                            <TextInput
                                style={[styles.input, { flex: 1, backgroundColor: 'transparent' }]}
                                value={duration}
                                onChangeText={setDuration}
                                keyboardType="numeric"
                            />
                        </View>

                        {/* Prices */}
                        <View style={styles.priceRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Base Price (₹)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={basePrice}
                                    onChangeText={setBasePrice}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Discount Price (₹)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={discountPrice}
                                    onChangeText={setDiscountPrice}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        {/* Extra Info */}
                        <Text style={styles.sectionTitle}>Extra service information</Text>

                        {/* Text Areas */}
                        <Text style={styles.label}>Who should take this service?</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="e.g. To increase glow..."
                            value={whoShouldTake}
                            onChangeText={setWhoShouldTake}
                        />

                        <Text style={styles.label}>Who should avoid this service?</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="e.g. If you have active acne..."
                            value={whoShouldAvoid}
                            onChangeText={setWhoShouldAvoid}
                        />

                        <TouchableOpacity
                            style={[styles.saveMainBtn, loading && { opacity: 0.7 }]}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveMainText}>Save Service</Text>}
                        </TouchableOpacity>
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

    serviceCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 16,
        marginTop: 20,
        elevation: 2,
    },

    label: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 14,
        marginBottom: 6,
    },

    input: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        color: '#000',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },

    durationBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 12,
        borderRadius: 12,
    },

    priceRow: {
        flexDirection: 'row',
        gap: 12,
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginTop: 20,
        color: '#000',
    },

    saveMainBtn: {
        marginTop: 24,
        backgroundColor: '#7B4DFF',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    saveMainText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
