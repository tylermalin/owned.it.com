'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/wagmi';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {mounted ? (
                    <RainbowKitProvider
                        theme={darkTheme({
                            accentColor: '#171717',
                            accentColorForeground: '#fafaf9',
                            borderRadius: 'small',
                        })}
                    >
                        {children}
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
                    </RainbowKitProvider>
                ) : (
                    children
                )}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
