'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

export function ScrollTriggerPopup() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (typeof window !== 'undefined' && scrollPercent > 50 && !localStorage.getItem('owned_scroll_popup_shown')) {
                setIsVisible(true);
                localStorage.setItem('owned_scroll_popup_shown', 'true');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-8 right-8 z-[90] max-w-sm w-full animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-white rounded-[2rem] border border-border shadow-2xl relative group">
                <div className="overflow-hidden rounded-t-[2rem]"><div className="brand-scanlines h-2" aria-hidden="true" /></div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute -top-3 -right-3 p-2 bg-white border border-border rounded-full hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="space-y-6 p-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-xl">👋</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-primary">Enjoying this?</div>
                    </div>

                    <h3 className="text-2xl font-black tracking-tight leading-tight text-foreground">Get the complete blueprint: The Definitive Guide</h3>

                    <p className="text-sm text-muted-foreground font-medium">
                        108 pages covering infrastructure, product architecture, distribution, and economics.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/products/2/checkout"
                            className="btn-brand flex w-full rounded-xl px-6 h-12 items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-center"
                        >
                            Buy Full Guide ($97) →
                        </Link>
                        <Link
                            href="/products/6/checkout"
                            className="btn-secondary flex w-full rounded-xl px-6 h-12 items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-center"
                        >
                            Get Chapter 1 Free →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
