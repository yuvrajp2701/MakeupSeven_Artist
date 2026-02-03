import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

interface FloatingDropdownOverlayProps {
    visible: boolean;
    onClose: () => void;
    position: { top: number; left: number; width: number };
    options: string[];
    onSelect: (item: string) => void;
}

const FloatingDropdownOverlay = ({ visible, onClose, position, options, onSelect }: FloatingDropdownOverlayProps) => {
    if (!visible) return null;

    return (
        <View style={[styles.modalOverlay, { zIndex: 9999, elevation: 9999 }]}>
            <TouchableOpacity style={styles.overlayBackdrop} activeOpacity={1} onPress={onClose} />
            <View style={[
                styles.floatingMenu,
                {
                    top: position.top,
                    left: position.left,
                    width: position.width,
                }
            ]}>
                <FlatList
                    data={options}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.optionItem}
                            onPress={() => onSelect(item)}
                        >
                            <Text style={styles.optionText}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    style={{ maxHeight: 200 }}
                    showsVerticalScrollIndicator={true}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    overlayBackdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    floatingMenu: {
        position: 'absolute',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    optionItem: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB',
    },
    optionText: {
        fontSize: 16,
        color: '#374151',
    },
});

export default FloatingDropdownOverlay;
