'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AuthButton } from '@/components/AuthButton';
import { ReferralsNotice } from '@/components/ReferralsNotice';

export default function AffiliatePage() {
    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white/80 border-b border-border sticky top-0 z-50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-[10px] flex justify-between items-center">
                    <Link href="/" className="py-2">
                        <img src="/assets/logo.png" alt="OWNED" className="w-[120px] h-[120px] object-contain" />
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Link>
                        <AuthButton />
                    </div>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6 py-24">
                <ReferralsNotice />
            </main>

            {/* Simple Footer */}
            <footer className="py-12 border-t border-border bg-white mt-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">OWNED · THE PROTOCOL FOR CREATORS</p>
                </div>
            </footer>
        </div>
    );
}
