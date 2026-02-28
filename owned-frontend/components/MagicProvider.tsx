'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Magic } from 'magic-sdk';
import { magic } from '@/lib/magic';

export type MagicUser = {
    issuer: string | null;
    email: string | null;
    publicAddress: string | null;
};

type MagicContextType = {
    magic: Magic | null;
    user: MagicUser | null;
    isLoading: boolean;
    isLoggingIn: boolean;
    login: (email: string) => Promise<void>;
    logout: () => Promise<void>;
};

const MagicContext = createContext<MagicContextType>({
    magic: null,
    user: null,
    isLoading: true,
    isLoggingIn: false,
    login: async () => { },
    logout: async () => { },
});

export const useMagic = () => useContext(MagicContext);

export const MagicProvider = ({ children }: { children: ReactNode }) => {
    const [magicInstance, setMagicInstance] = useState<Magic | null>(null);
    const [user, setUser] = useState<MagicUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        const initMagic = async () => {
            if (typeof window !== 'undefined') {
                const m = magic as Magic | null;
                setMagicInstance(m);

                if (m) {
                    try {
                        const isLoggedIn = await m.user.isLoggedIn();
                        if (isLoggedIn) {
                            const userData = (await m.user.getInfo()) as any;
                            console.log('Magic session found, userData:', userData);
                            const address = userData.publicAddress || (userData.issuer ? userData.issuer.split(':')[2] : null);
                            setUser({
                                issuer: userData.issuer ?? null,
                                email: userData.email ?? null,
                                publicAddress: address,
                            });
                        }
                    } catch (error) {
                        console.error('Magic initialization failed:', error);
                    }
                }
                setIsLoading(false);
            }
        };
        initMagic();
    }, []);

    const login = useCallback(async (email: string) => {
        if (!magicInstance) {
            console.error('Magic instance not initialized');
            return;
        }
        setIsLoggingIn(true);
        try {
            console.log('Starting Magic Email OTP login for:', email);
            await magicInstance.auth.loginWithEmailOTP({ email });
            const userData: any = await magicInstance.user.getInfo();
            console.log('Magic login metadata fetched:', userData);
            const address = userData.publicAddress || (userData.issuer ? userData.issuer.split(':')[2] : null);
            setUser({
                issuer: userData.issuer ?? null,
                email: userData.email ?? null,
                publicAddress: address,
            });
            console.log('Magic state updated with address:', address);
        } catch (error: any) {
            console.error('Magic login failed with detailed error:', {
                message: error.message,
                code: error.code,
                raw: error
            });
            throw error;
        } finally {
            setIsLoggingIn(false);
        }
    }, [magicInstance]);

    const logout = useCallback(async () => {
        if (!magicInstance) return;
        try {
            await magicInstance.user.logout();
            setUser(null);
        } catch (error) {
            console.error('Magic logout failed:', error);
        }
    }, [magicInstance]);

    return (
        <MagicContext.Provider value={{ magic: magicInstance, user, isLoading, isLoggingIn, login, logout }}>
            {children}
        </MagicContext.Provider>
    );
};
