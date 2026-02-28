'use client';

import { useState } from 'react';
import { MagicAuth } from '@/components/MagicAuth';
import { useMagic } from '@/components/MagicProvider';
import { FiatOnramp } from '@/components/FiatOnramp';
import { PumpFunIntegration } from '@/components/PumpFunIntegration';
import { getBalance, requestAirdrop } from '@/lib/solana';

export default function MagicDemo() {
    const { user } = useMagic();
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCheckBalance = async () => {
        if (user?.publicAddress) {
            setLoading(true);
            try {
                const bal = await getBalance(user.publicAddress);
                setBalance(bal);
            } catch (error) {
                console.error('Failed to get balance:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAirdrop = async () => {
        if (user?.publicAddress) {
            setLoading(true);
            try {
                await requestAirdrop(user.publicAddress);
                alert('Airdrop requested!');
                handleCheckBalance();
            } catch (error) {
                console.error('Airdrop failed:', error);
                alert('Airdrop failed. See console.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-zinc-950 text-zinc-100">
            <h1 className="mb-8 text-3xl font-bold">Magic Wallet Demo</h1>
            <MagicAuth />

            {user && (
                <div className="mt-8 flex flex-col gap-6 w-full max-w-sm">
                    <div className="p-4 border border-zinc-800 rounded bg-zinc-900">
                        <h2 className="text-xl font-semibold mb-4 text-blue-400">Solana Actions</h2>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleCheckBalance}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                Check SOL Balance
                            </button>
                            {balance !== null && <div className="text-center font-mono">{balance} SOL</div>}

                            <button
                                onClick={handleAirdrop}
                                disabled={loading}
                                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                            >
                                Request Airdrop (Devnet)
                            </button>
                        </div>
                    </div>

                    <div className="p-4 border border-zinc-800 rounded bg-zinc-900">
                        <h2 className="text-xl font-semibold mb-4 text-indigo-400">Fiat Onramp</h2>
                        <div className="flex justify-center">
                            <FiatOnramp />
                        </div>
                    </div>

                    <PumpFunIntegration />
                </div>
            )}
        </div>
    );
}
