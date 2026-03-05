import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';

export const saveToken = async (token: string) => {
    try {
        await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
        console.error('Error saving token:', e);
    }
};

export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) {
            console.log('╔════════════ CURRENT AUTH TOKEN ════════════╗');
            console.log(token);
            console.log('╚════════════════════════════════════════════╝');
        } else {
            console.log('⚠️ [getToken] No token found in AsyncStorage');
        }
        return token;
    } catch (e) {
        console.error('Error getting token:', e);
        return null;
    }
};

export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (e) {
        console.error('Error removing token:', e);
    }
};
