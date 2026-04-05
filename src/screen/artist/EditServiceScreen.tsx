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
    Switch,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import ScreenView from '../../utils/ScreenView';
import { useRoute } from '@react-navigation/native';
import { apiCall } from '../../services/api';
import { getToken } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import { getCategoryIdByName } from '../../services/categoryService';

const EditServiceScreen = ({ navigation }: any) => {
    const route = useRoute<any>();
    const { userToken } = useAuth();
    const editingService = route.params?.service;

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(editingService?.name || '');
    const [description, setDescription] = useState(editingService?.description || '');
    const [duration, setDuration] = useState(editingService?.duration?.toString() || '60');
    const [basePrice, setBasePrice] = useState(editingService?.basePrice?.toString() || '');
    const [normalPrice, setNormalPrice] = useState(editingService?.normalPrice?.toString() || editingService?.basePrice?.toString() || '');
    const [discountPrice, setDiscountPrice] = useState(editingService?.discountPrice?.toString() || '');
    const [whoShouldTake, setWhoShouldTake] = useState(editingService?.whoShouldTake || '');
    const [whoShouldAvoid, setWhoShouldAvoid] = useState(editingService?.whoShouldAvoid || '');
    const [isActive, setIsActive] = useState(editingService?.isActive !== undefined ? editingService.isActive : true);
    const [categoryId, setCategoryId] = useState(editingService?.categoryId || editingService?.category?._id || '');

    const handleSave = async () => {
        if (!name || !basePrice || !duration) {
            Alert.alert("Validation", "Please fill name, price and duration.");
            return;
        }

        try {
            setLoading(true);
            const token = userToken || await getToken();
            if (!token) return;

            // Get category ID - either from state or fetch by name
            let finalCategoryId = categoryId;
            if (!finalCategoryId && editingService?.category) {
                const categoryName = typeof editingService.category === 'string'
                    ? editingService.category
                    : editingService.category.name;
                finalCategoryId = getCategoryIdByName(categoryName);
            } else if (!finalCategoryId) {
                // Default category
                finalCategoryId = getCategoryIdByName("Makeup");
            }

            // Prepare payload according to the required structure
            const payload = {
                name: name.trim(),
                description: description.trim(),
                basePrice: parseFloat(basePrice),
                duration: parseInt(duration),
                categoryId: finalCategoryId,
                normalPrice: normalPrice ? parseFloat(normalPrice) : parseFloat(basePrice),
                discountPrice: discountPrice ? parseFloat(discountPrice) : parseFloat(basePrice),
                whoShouldTake: whoShouldTake.trim(),
                whoShouldAvoid: whoShouldAvoid.trim(),
                isActive: isActive,
            };

            let response;
            if (editingService?.id || editingService?._id) {
                const id = editingService.id || editingService._id;
                // For update - using PATCH
                response = await apiCall(`/services/${id}`, {
                    method: 'PATCH',
                    token,
                    body: payload
                });
                console.log("Update response:", response);
                Alert.alert("Success", "Service updated successfully");
            } else {
                // For create - using POST
                response = await apiCall('/services', {
                    method: 'POST',
                    token,
                    body: payload
                });
                console.log("Create response:", response);
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
                        <Text style={styles.label}>Service Name *</Text>
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
                        <Text style={styles.label}>Duration (minutes) *</Text>
                        <View style={styles.durationBox}>
                            <FontAwesome name="clock-o" size={16} color="#6B7280" />
                            <TextInput
                                style={[styles.input, { flex: 1, backgroundColor: 'transparent' }]}
                                value={duration}
                                onChangeText={setDuration}
                                keyboardType="numeric"
                                placeholder="60"
                            />
                        </View>

                        {/* Prices */}
                        <Text style={styles.label}>Pricing</Text>
                        <View style={styles.priceRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.subLabel}>Base Price (₹) *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={basePrice}
                                    onChangeText={setBasePrice}
                                    keyboardType="numeric"
                                    placeholder="e.g. 1000"
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.subLabel}>Normal Price (₹)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={normalPrice}
                                    onChangeText={setNormalPrice}
                                    keyboardType="numeric"
                                    placeholder="e.g. 1500"
                                />
                            </View>
                        </View>

                        <View style={styles.priceRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.subLabel}>Discount Price (₹)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={discountPrice}
                                    onChangeText={setDiscountPrice}
                                    keyboardType="numeric"
                                    placeholder="e.g. 800"
                                />
                            </View>
                        </View>

                        {/* Extra Info */}
                        <Text style={styles.sectionTitle}>Extra service information</Text>

                        {/* Text Areas */}
                        <Text style={styles.label}>Who should take this service?</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="e.g. Brides looking for natural glow..."
                            value={whoShouldTake}
                            onChangeText={setWhoShouldTake}
                            multiline
                        />

                        <Text style={styles.label}>Who should avoid this service?</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="e.g. If you have active acne..."
                            value={whoShouldAvoid}
                            onChangeText={setWhoShouldAvoid}
                            multiline
                        />

                        {/* Active Status Switch (only for edit mode) */}
                        {editingService && (
                            <View style={styles.switchContainer}>
                                <Text style={styles.label}>Service Status</Text>
                                <View style={styles.switchRow}>
                                    <Text style={styles.switchLabel}>
                                        {isActive ? 'Active' : 'Inactive'}
                                    </Text>
                                    <Switch
                                        value={isActive}
                                        onValueChange={setIsActive}
                                        trackColor={{ false: '#E5E7EB', true: '#7B4DFF' }}
                                        thumbColor={isActive ? '#fff' : '#fff'}
                                    />
                                </View>
                                <Text style={styles.switchHint}>
                                    {isActive ? 'Service is visible to customers' : 'Service is hidden from customers'}
                                </Text>
                            </View>
                        )}

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
        fontWeight: '500',
    },

    subLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 4,
    },

    input: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        color: '#000',
        borderWidth: 1,
        borderColor: '#F3F4F6',
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
        borderWidth: 1,
        borderColor: '#F3F4F6',
        gap: 8,
    },

    priceRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 8,
        color: '#111827',
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
    switchContainer: {
        marginTop: 16,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    switchLabel: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '500',
    },
    switchHint: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 6,
    },
});