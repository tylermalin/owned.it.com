'use client';

import { Share2 } from 'lucide-react';
import { WaitlistForm } from '@/components/WaitlistForm';

export function ReferralsNotice() {
    return (
        <div className="max-w-2xl mx-auto w-full space-y-10">
            <div className="text-center space-y-6">
                <div className="brand-sticker w-14 h-14 rounded-2xl flex items-center justify-center mx-auto">
                    <Share2 className="w-6 h-6" />
                </div>
                <div className="inline-block rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Coming December 8
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight">Referrals are <span className="text-brand-gradient">coming</span></h2>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                    Referrals are coming with our December 8 launch. Creators will set a referral share per product, paid onchain at the moment of sale.
                </p>
            </div>
            <div className="brand-card overflow-hidden rounded-[2rem] bg-white">
                <div className="brand-scanlines h-2.5" aria-hidden="true" />
                <div className="p-6 md:p-10">
                <WaitlistForm
                    source="referrals"
                    heading="Get early access"
                    subheading="Join the waitlist and we'll let you know the moment referrals go live."
                />
                </div>
            </div>
        </div>
    );
}
