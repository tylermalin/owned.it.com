'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { MagicProvider } from '@/components/MagicProvider';
import { AffiliateProvider } from '@/components/AffiliateContext';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Signal the Base app that our app is ready to be displayed
        const initSDK = async () => {
            await sdk.actions.ready();
        };
        initSDK();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <MagicProvider>
                <AffiliateProvider>
                    {children}
                </AffiliateProvider>
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            background: '#171717',
                            color: '#fafaf9',
                            border: '1px solid #404040',
                        },
                    }}
                />
            </MagicProvider>
        </QueryClientProvider>
    );
}
