import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';

const InputGroup = ({ label, placeholder, value, onChangeText, keyboardType, icon }: any) => (
    <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <View style={styles.inputWrapper}>
            {icon && <FontAwesome name={icon} size={14} color="#9CA3AF" style={{ marginRight: 10 }} />}
            <TextInput
                style={styles.textInput}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
            />
        </View>
    </View>
);

const styles = StyleSheet.create({
    fieldContainer: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        backgroundColor: '#fff',
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        color: '#111827',
        height: '100%',
    },
});

export default InputGroup;
