import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../utils/Colors';
import { scale, verticalScale, moderateScale, hp } from '../../utils/Responsive';

const ReferralCodeScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.secondary, Colors.white]}
                style={styles.header}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', bottom: verticalScale(2) }}>
                    <TouchableOpacity style={styles.backBtn} onPress={navigation.goBack}>
                        <Text style={styles.backText}>←</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.skipBtn}
                        onPress={() => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'BottomTab' }],
                            });
                        }}
                    >
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
            <View style={styles.content}>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Image source={require('../../asset/images/gift.png')} style={styles.giftIcon} />
                        <Text style={styles.label}>Referral Code (optional)</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Paste code"
                        placeholderTextColor={Colors.textSecondary}
                    />
                    <View style={styles.bonusRow}>
                        <Text style={styles.bonusIcon}>💡</Text>
                        <Text style={styles.bonusText}>Bonus:</Text>
                    </View>
                    <Text style={[styles.desc, { paddingVertical: verticalScale(6) }]}>Enter a referral code to get discount on your first order</Text>
                    <Text style={styles.desc}>On Sign up you will get +20 points</Text>
                </View>
            </View>
        </View>
    );
};

export default ReferralCodeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        paddingTop: hp(4),
        paddingBottom: hp(2),
        paddingHorizontal: scale(20),
    },
    backBtn: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(12),
        backgroundColor: Colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(10),
    },
    skipBtn: {
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(6),
        borderRadius: scale(8),
    },
    skipText: {
        color: Colors.primary,
        fontSize: scale(15),
        fontWeight: '500',
        bottom: verticalScale(3),
    },
    backText: {
        fontSize: scale(22),
        fontWeight: 'bold',
        color: Colors.primary,
        bottom: verticalScale(3),
    },
    content: {
        flex: 1,
        paddingHorizontal: scale(24),
    },
    card: {
        marginTop: verticalScale(10),
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: moderateScale(14),
        padding: scale(16),
        backgroundColor: Colors.white,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },
    giftIcon: {
        width: scale(20),
        height: scale(20),
        marginRight: scale(8),
        resizeMode: 'contain',
    },
    label: {
        fontSize: scale(15),
        fontWeight: '500',
        color: Colors.black,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: moderateScale(10),
        paddingHorizontal: scale(12),
        fontSize: scale(15),
        height: scale(44),
        marginBottom: verticalScale(10),
        backgroundColor: Colors.white,
    },
    bonusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(2),
    },
    bonusIcon: {
        fontSize: scale(14),
        marginRight: scale(4),
        color: Colors.primary,
    },
    bonusText: {
        fontSize: scale(13),
        color: Colors.primary,
        fontWeight: '500',
    },
    desc: {
        fontSize: scale(12),
        color: Colors.dullgray,
        marginBottom: verticalScale(2),
        width: '90%',
    },
});
