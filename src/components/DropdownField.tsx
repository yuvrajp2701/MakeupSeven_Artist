import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';

const DropdownField = ({ label, value, placeholder, onPress }: any) => {
    const ref = useRef<any>(null);

    const handlePress = () => {
        ref.current?.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
            onPress({ x: pageX, y: pageY, width, height });
        });
    };

    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TouchableOpacity
                ref={ref}
                style={styles.dropdownBox}
                onPress={handlePress}
                activeOpacity={0.8}
            >
                <Text style={[styles.dropdownValue, !value && { color: '#9CA3AF' }]}>
                    {value || placeholder}
                </Text>
                <FontAwesome name="angle-down" size={16} color="#7C3AED" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    fieldContainer: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    dropdownBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        backgroundColor: '#fff',
    },
    dropdownValue: {
        fontSize: 16,
        color: '#111827',
    },
});

export default DropdownField;
