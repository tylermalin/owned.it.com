'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { LayoutDashboard } from 'lucide-react';

export function Nav() {
    const { isConnected } = useAccount();

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-6 py-[10px] flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center py-2">
                        <img src="/assets/logo.png" alt="OWNED" className="w-[120px] h-[120px] object-contain hover:scale-105 transition-transform" />
                    </Link>
                    <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-muted-foreground transition-all">
                        <Link href="/products" className="hover:text-primary transition-colors">Marketplace</Link>
                        <Link href="/#features" className="hover:text-primary transition-colors">Features</Link>
                        <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
                        <Link href="/investors" className="hover:text-primary transition-colors text-[10px] px-3 py-1 bg-slate-50 rounded-lg border border-border">Investors</Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {isConnected && (
                        <Link
                            href="/dashboard"
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold border border-border transition-all"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            DASHBOARD
                        </Link>
                    )}
                    <ConnectButton />
                </div>
            </div>
        </nav>
    );
}
