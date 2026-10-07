'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

export function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (typeof window !== 'undefined' && e.clientY < 0 && !localStorage.getItem('owned_exit_intent_shown')) {
                setIsVisible(true);
                localStorage.setItem('owned_exit_intent_shown', 'true');
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] max-w-xl w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="brand-scanlines h-2" aria-hidden="true" />
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center space-y-6 p-8 md:p-12">
                    <div className="inline-block brand-sticker rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em]">
                        Wait! Before You Go...
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Get Chapter 1 of The Definitive Guide (Free)</h2>

                    <p className="text-lg text-muted-foreground font-medium">
                        Learn why platform dependency is a structural risk—and how smart contracts eliminate custody, policy drift, and freeze risk.
                    </p>

                    <div className="pt-8">
                        <Link
                            href="/products/6/checkout"
                            className="btn-brand flex w-full rounded-xl px-6 h-12 items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-center"
                        >
                            Get Free Chapter →
                        </Link>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 mt-4">
                            Minted as a free Proof-of-Knowledge NFT on Base.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
