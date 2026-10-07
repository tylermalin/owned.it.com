'use client';

import { Rocket, Shield, Zap } from 'lucide-react';
import { PageHeader } from '@/components/site/PageHeader';
import { WaitlistForm } from '@/components/WaitlistForm';

export default function DeployPage() {
    return (
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 pb-16 md:pb-20 lg:grid-cols-2 lg:gap-12 lg:px-6">
            {/* Visual Side */}
            <div className="space-y-2">
                <div className="lg:[&>section>div]:px-0">
                    <PageHeader
                        eyebrow="Sovereign Deployment"
                        title="Deploy Your"
                        accent="Sovereign"
                        after="Store."
                        lede="Store deployment isn't open to the public yet. Join the waitlist and we'll invite you as soon as it's live."
                    />
                </div>

                <div className="space-y-6 px-6 lg:px-0">
                    <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white">
                            <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">100% Ownership</h3>
                            <p className="text-sm font-medium text-muted-foreground">You own the contract. You own the funds.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white">
                            <Rocket className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">Own It Once</h3>
                            <p className="text-sm font-medium text-muted-foreground">A one-time deployment that lives on Base.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white">
                            <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">Instant Fulfillment</h3>
                            <p className="text-sm font-medium text-muted-foreground">Native IPFS delivery for all products.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Waitlist Side */}
            <div className="px-6 lg:px-0 lg:pt-16">
                <div className="brand-card brand-card-hover overflow-hidden rounded-[2rem] bg-white">
                    <div className="brand-scanlines h-2.5" aria-hidden="true" />
                    <div className="p-6 md:p-10">
                        <WaitlistForm
                            source="deploy-store"
                            heading="Join the Deployment Waitlist"
                            subheading="Store deployment isn't live yet. Leave your details and we'll reach out when onboarding opens."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
