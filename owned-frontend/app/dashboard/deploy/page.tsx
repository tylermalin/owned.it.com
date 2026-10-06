'use client';

import { Rocket, Shield, Zap } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { WaitlistForm } from '@/components/WaitlistForm';

export default function DeployPage() {
    return (
        <DashboardLayout>
            <div className="flex-1 flex items-center justify-center p-6 py-12">
                <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Visual Side */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-primary/10">
                                Sovereign Deployment
                            </div>
                            <h1 className="text-5xl font-black tracking-tight leading-tight">
                                Deploy Your <span className="text-primary italic">Sovereign</span> Store.
                            </h1>
                            <p className="text-xl text-muted-foreground font-medium italic leading-relaxed">
                                Store deployment isn't open to the public yet. Join the waitlist and we'll invite you as soon as it's live.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 bg-white rounded-xl border border-border shadow-sm flex items-center justify-center shrink-0">
                                    <Shield className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-foreground">100% Ownership</h3>
                                    <p className="text-sm text-muted-foreground font-medium">You own the contract. You own the funds.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 bg-white rounded-xl border border-border shadow-sm flex items-center justify-center shrink-0">
                                    <Rocket className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-foreground">Own It Once</h3>
                                    <p className="text-sm text-muted-foreground font-medium">A one-time deployment that lives on Base.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 bg-white rounded-xl border border-border shadow-sm flex items-center justify-center shrink-0">
                                    <Zap className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-foreground">Instant Fulfillment</h3>
                                    <p className="text-sm text-muted-foreground font-medium">Native IPFS delivery for all products.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Waitlist Side */}
                    <div className="bg-white rounded-[3rem] border border-border shadow-saas p-10 md:p-12">
                        <WaitlistForm
                            source="deploy-store"
                            heading="Join the Deployment Waitlist"
                            subheading="Store deployment isn't live yet. Leave your details and we'll reach out when onboarding opens."
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
