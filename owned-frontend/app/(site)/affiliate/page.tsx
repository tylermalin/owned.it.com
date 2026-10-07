'use client';

import { PageHeader } from '@/components/site/PageHeader';
import { WaitlistForm } from '@/components/WaitlistForm';

// Same copy and waitlist source as components/ReferralsNotice, laid out with the site system.
export default function AffiliatePage() {
    return (
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 pb-16 md:pb-20 lg:grid-cols-2 lg:gap-12 lg:px-6">
            <div className="lg:[&>section>div]:px-0">
                <PageHeader
                    eyebrow="Coming December 8"
                    title="Referrals are"
                    accent="coming"
                    lede="Referrals are coming with our December 8 launch. Creators will set a referral share per product, paid onchain at the moment of sale."
                />
            </div>

            <div className="px-6 lg:px-0 lg:pt-16">
                <div className="brand-card brand-card-hover overflow-hidden rounded-[2rem] bg-white">
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
        </div>
    );
}
