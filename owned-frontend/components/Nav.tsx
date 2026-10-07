'use client';

import { useState, useEffect } from 'react';
import { AuthButton } from '@/components/AuthButton';
import Link from 'next/link';
import { useMagic } from '@/components/MagicProvider';
import { LayoutDashboard } from 'lucide-react';

export function Nav() {
    const { user: magicUser } = useMagic();
    const isMagicConnected = !!magicUser?.publicAddress;
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className="fixed top-0 w-full z-50 transition-all duration-500">
            <div className="w-full bg-[var(--brand-ink)] text-white py-1.5 text-center px-4 relative z-50">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-pink)] animate-pulse" />
                    Testnet beta · No live transactions
                </p>
            </div>
            <div className="brand-scanlines h-[3px] w-full" aria-hidden="true" />
            <div className={`px-6 transition-all duration-500 ${isScrolled ? 'pt-2' : 'pt-4'}`}>
                <div className={`max-w-7xl mx-auto px-6 flex justify-between items-center transition-all duration-500 rounded-[2rem] ${isScrolled ? 'glass shadow-saas-lg py-2' : 'bg-transparent py-2'}`}>
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center group">
                            <img
                                src="/assets/logo-wordmark-480.png"
                                alt="OWNED IT"
                                width={480}
                                height={240}
                                className="h-11 w-auto object-contain transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-105 md:h-12"
                            />
                        </Link>

                        <div className="hidden lg:flex items-center gap-10">
                            {[
                                { label: 'Marketplace', href: '/products' },
                                { label: 'Partner Store', href: '/affiliate' },
                                { label: 'Features', href: '/#features' },
                                { label: 'Pricing', href: '/pricing' },
                                { label: 'Docs', href: '/docs' }
                            ].map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-[var(--brand-magenta)] transition-all relative group"
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 brand-scanlines transition-all duration-300 group-hover:w-full" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {isMagicConnected && (
                            <Link
                                href="/dashboard"
                                className="hidden md:flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:scale-105 active:scale-95 transition-all shadow-saas"
                            >
                                <LayoutDashboard className="w-3.5 h-3.5" />
                                Dashboard
                            </Link>
                        )}
                        <div className="scale-90 origin-right">
                            <AuthButton />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
