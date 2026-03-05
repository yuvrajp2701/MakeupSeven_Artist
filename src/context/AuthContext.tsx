import React, { createContext, useState, useEffect, useContext } from 'react';
import { getToken, saveToken as saveTokenToStorage, removeToken as removeTokenFromStorage } from '../services/auth';

interface AuthContextType {
    userToken: string | null;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Decode JWT payload — pure JS, works in React Native (Hermes/JSC) */
const decodeJwtRole = (token: string): string | null => {
    try {
        const parts = token.split('.');
        if (parts.length < 2) { return null; }

        // Manual base64url → base64 → string decode
        let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4 !== 0) { base64 += '='; }

        // Decode using globalThis or fallback character-by-character
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let str = '';
        let i = 0;
        base64 = base64.replace(/[^A-Za-z0-9+/=]/g, '');
        while (i < base64.length) {
            const enc1 = chars.indexOf(base64.charAt(i++));
            const enc2 = chars.indexOf(base64.charAt(i++));
            const enc3 = chars.indexOf(base64.charAt(i++));
            const enc4 = chars.indexOf(base64.charAt(i++));
            str += String.fromCharCode((enc1 << 2) | (enc2 >> 4));
            if (enc3 !== 64) { str += String.fromCharCode(((enc2 & 15) << 4) | (enc3 >> 2)); }
            if (enc4 !== 64) { str += String.fromCharCode(((enc3 & 3) << 6) | enc4); }
        }

        const decoded = JSON.parse(str);
        return decoded?.role || null;
    } catch {
        return null;
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await getToken();

                if (token) {
                    const role = decodeJwtRole(token);
                    console.log('[AuthContext] Stored token role:', role);

                    // ✅ Only allow ARTIST tokens into the app
                    if (role === 'ARTIST') {
                        setUserToken(token);
                    } else {
                        // USER/unknown role — clear the stale token, force re-login
                        console.log('[AuthContext] Non-ARTIST role detected — clearing token to force re-login');
                        await removeTokenFromStorage();
                        setUserToken(null);
                    }
                } else {
                    setUserToken(null);
                }
            } catch (e) {
                console.error('Failed to load token', e);
                setUserToken(null);
            } finally {
                setIsLoading(false);
            }
        };
        loadToken();
    }, []);

    const login = async (token: string) => {
        await saveTokenToStorage(token);
        setUserToken(token);
    };

    const logout = async () => {
        await removeTokenFromStorage();
        setUserToken(null);
    };

    return (
        <AuthContext.Provider value={{ userToken, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
