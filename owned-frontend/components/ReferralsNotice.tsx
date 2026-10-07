'use client';

import { Share2 } from 'lucide-react';
import { WaitlistForm } from '@/components/WaitlistForm';

export function ReferralsNotice() {
    return (
        <div className="max-w-2xl mx-auto w-full space-y-12">
            <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <Share2 className="w-8 h-8" />
                </div>
                <div className="inline-block px-4 py-1.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-slate-200">
                    Coming December 8
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tight italic">Referrals are coming</h1>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                    Referrals are coming with our December 8 launch. Creators will set a referral share per product, paid onchain at the moment of sale.
                </p>
            </div>
            <div className="bg-white rounded-[3rem] border border-border shadow-saas p-10 md:p-12">
                <WaitlistForm
                    source="referrals"
                    heading="Get early access"
                    subheading="Join the waitlist and we'll let you know the moment referrals go live."
                />
            </div>
        </div>
    );
}
