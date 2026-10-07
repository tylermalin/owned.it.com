'use client';

import { useState } from 'react';
import { useMagic } from '@/components/MagicProvider';
import { CreditCard, Loader2, ExternalLink } from 'lucide-react';

interface FiatOnrampProps {
    className?: string;
    compact?: boolean;
}

export const FiatOnramp = ({ className = '', compact = false }: FiatOnrampProps) => {
    const { magic, user } = useMagic();
    const [loading, setLoading] = useState(false);

    const handleOnramp = async () => {
        if (!magic) return;
        setLoading(true);
        try {
            // Ensure user is logged in
            const isLoggedIn = await magic.user.isLoggedIn();
            if (!isLoggedIn) {
                await magic.wallet.connectWithUI();
            }

            // Open Magic's built-in wallet UI which includes buy/onramp
            await magic.wallet.showUI();
        } catch (error) {
            console.error('Onramp failed:', error);
        } finally {
            setLoading(false);
        }
    };

    if (compact) {
        return (
            <button
                onClick={handleOnramp}
                disabled={loading}
                className={`btn-brand inline-flex items-center justify-center gap-2 px-4 h-10 rounded-xl text-xs font-black uppercase tracking-[0.12em] disabled:opacity-50 ${className}`}
            >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
                Buy USDC
            </button>
        );
    }

    return (
        <div className={`bg-primary/5 border border-primary/20 rounded-3xl p-6 space-y-4 ${className}`}>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[image:var(--brand-cta)] rounded-xl flex items-center justify-center shadow-sm">
                    <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-sm font-bold text-foreground">Need USDC?</p>
                    <p className="text-xs text-muted-foreground font-medium">Buy with credit card or bank transfer</p>
                </div>
            </div>

            <button
                onClick={handleOnramp}
                disabled={loading}
                className="btn-brand w-full rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em] disabled:opacity-50"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Opening Wallet...
                    </>
                ) : (
                    <>
                        <CreditCard className="w-4 h-4" />
                        Buy USDC with Card
                        <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </>
                )}
            </button>

            <p className="text-[10px] text-center text-muted-foreground font-medium">
                Powered by Magic · Instant delivery to your wallet
            </p>
        </div>
    );
};
