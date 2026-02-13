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
            <div className="bg-white rounded-[3rem] p-12 max-w-xl w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center space-y-6">
                    <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                        Wait! Before You Go...
                    </div>

                    <h2 className="text-4xl font-black tracking-tight italic">Get Chapter 1 of The Definitive Guide (Free)</h2>

                    <p className="text-lg text-muted-foreground font-medium italic">
                        Learn why platform dependency is a structural risk—and how smart contracts eliminate custody, policy drift, and freeze risk.
                    </p>

                    <div className="pt-8">
                        <Link
                            href="/products/6/checkout"
                            className="block w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-lg hover:scale-[1.02] transition-all text-center"
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
