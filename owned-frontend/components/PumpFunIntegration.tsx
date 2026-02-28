'use client';

import { useState } from 'react';
import { useMagic } from '@/components/MagicProvider';
import { sendSol } from '@/lib/solana';

export const PumpFunIntegration = () => {
    const { user } = useMagic();
    const [tokenName, setTokenName] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLaunch = async () => {
        if (!user || !tokenName || !tokenSymbol) return;
        setLoading(true);
        try {
            // Placeholder for Pump.FUN launch logic:
            // 1. Create transaction to interact with Pump.FUN program
            // 2. Sign and send transaction via Magic
            console.log('Launching token on Pump.FUN:', { tokenName, tokenSymbol });

            // Simulating a transaction (sending 0.001 SOL to self as fee)
            if (user.publicAddress) {
                await sendSol(user.publicAddress, user.publicAddress, 0.001);
                alert(`Launched ${tokenName} (${tokenSymbol}) on Pump.FUN!`);
            }
        } catch (error) {
            console.error('Launch failed:', error);
            alert('Launch failed. See console.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border border-zinc-800 rounded bg-zinc-900 w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Pump.FUN Streamer Tools</h2>
            <div className="flex flex-col gap-3">
                <input
                    type="text"
                    placeholder="Token Name"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    className="px-3 py-2 bg-zinc-950 border border-zinc-700 rounded text-zinc-100 placeholder:text-zinc-600"
                />
                <input
                    type="text"
                    placeholder="Symbol (e.g. OWN)"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value)}
                    className="px-3 py-2 bg-zinc-950 border border-zinc-700 rounded text-zinc-100 placeholder:text-zinc-600"
                />
                <button
                    onClick={handleLaunch}
                    disabled={loading || !tokenName || !tokenSymbol}
                    className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50 transition-colors font-medium"
                >
                    {loading ? 'Launching...' : 'Launch Token'}
                </button>
                <div className="text-xs text-zinc-500 mt-2">
                    * Interactive Pump.FUN integration requires Program ID and ABI.
                </div>
            </div>
        </div>
    );
};
