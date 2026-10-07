'use client';

import { Check, Star, Users, BarChart3 } from 'lucide-react';
import { PageHeader } from '@/components/site/PageHeader';
import { WaitlistForm } from '@/components/WaitlistForm';

export default function RegisterPage() {
    return (
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 pb-16 md:pb-20 lg:grid-cols-2 lg:gap-12 lg:px-6">
            {/* Benefits Side */}
            <div className="space-y-2">
                <div className="lg:[&>section>div]:px-0">
                    <PageHeader
                        eyebrow="Pro Seller Waitlist"
                        title="Scale with"
                        accent="Professional"
                        after="Tools."
                        lede="Pay for tooling, not permission. Pro onboarding isn't open yet — join the waitlist to be first in."
                    />
                </div>

                <div className="px-6 lg:px-0">
                    <div className="space-y-6 rounded-3xl border border-border bg-white p-6 md:p-8">
                        <p className="eyebrow text-primary">Planned for Pro</p>
                        <ul className="grid grid-cols-1 gap-5">
                            <li className="flex items-center gap-4 font-bold text-foreground">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                                </div>
                                Web Dashboard Entry
                            </li>
                            <li className="flex items-center gap-4 font-bold text-foreground">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <BarChart3 className="h-4 w-4 text-primary" />
                                </div>
                                Revenue & Sales Analytics
                            </li>
                            <li className="flex items-center gap-4 font-bold text-foreground">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Users className="h-4 w-4 text-primary" />
                                </div>
                                Community Gating Tools
                            </li>
                            <li className="flex items-center gap-4 font-bold text-foreground">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Star className="h-4 w-4 text-primary" />
                                </div>
                                Priority Protocol Support
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Waitlist Side */}
            <div className="px-6 lg:px-0 lg:pt-16">
                <div className="brand-card brand-card-hover overflow-hidden rounded-[2rem] bg-white">
                    <div className="brand-scanlines h-2.5" aria-hidden="true" />
                    <div className="p-6 md:p-10">
                        <WaitlistForm
                            source="register-pro"
                            heading="Join the Pro Waitlist"
                            subheading="Pro seller onboarding isn't live yet. Leave your details and we'll reach out when it opens."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
