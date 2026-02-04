import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import InputGroup from './InputGroup';

interface Procedure {
    title: string;
    description: string;
    expanded: boolean;
}

interface AddProcedureModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (procedures: Procedure[]) => void;
    initialProcedures?: Procedure[];
}

const AddProcedureModal = ({ visible, onClose, onSave, initialProcedures }: AddProcedureModalProps) => {
    // We keep internal state for procedures while the modal is open
    const [procedures, setProcedures] = useState<Procedure[]>(
        initialProcedures || [{ title: '', description: '', expanded: true }]
    );

    const handleSave = () => {
        onSave(procedures);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>

                    <View style={styles.modalHeaderRow}>
                        <Text style={styles.modalTitle}>Add Procedure</Text>
                        <TouchableOpacity
                            style={styles.addStepBtn}
                            onPress={() => setProcedures([...procedures, { title: '', description: '', expanded: true }])}
                        >
                            <FontAwesome name="plus" size={14} color="#7C3AED" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                        {procedures.map((proc, index) => (
                            <View key={index} style={styles.procedureCard}>
                                <TouchableOpacity
                                    style={styles.procedureHeader}
                                    onPress={() => {
                                        const newProcs = [...procedures];
                                        newProcs[index].expanded = !newProcs[index].expanded;
                                        setProcedures(newProcs);
                                    }}
                                >
                                    <Text style={styles.procedureTitle}>Procedure {index + 1}</Text>
                                    <FontAwesome name={proc.expanded ? "angle-up" : "angle-down"} size={18} color="#7C3AED" />
                                </TouchableOpacity>

                                {proc.expanded && (
                                    <View style={styles.procedureBody}>
                                        <InputGroup
                                            label="Procedure title"
                                            placeholder="Enter title"
                                            value={proc.title}
                                            onChangeText={(txt: string) => {
                                                const newProcs = [...procedures];
                                                newProcs[index].title = txt;
                                                setProcedures(newProcs);
                                            }}
                                        />
                                        <InputGroup
                                            label="Procedure description"
                                            placeholder="Enter description"
                                            value={proc.description}
                                            onChangeText={(txt: string) => {
                                                const newProcs = [...procedures];
                                                newProcs[index].description = txt;
                                                setProcedures(newProcs);
                                            }}
                                        />
                                    </View>
                                )}
                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.saveButton}
                        activeOpacity={0.9}
                        onPress={handleSave}
                    >
                        <Text style={styles.saveButtonText}>Save and continue</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '80%',
    },
    modalHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#374151',
    },
    addStepBtn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#F3ECFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    procedureCard: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    procedureHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    procedureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    procedureBody: {
        marginTop: 16,
    },
    saveButton: {
        backgroundColor: '#7C3AED',
        height: 54,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AddProcedureModal;
