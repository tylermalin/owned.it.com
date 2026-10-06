'use client';

import Link from 'next/link';
import { ArrowLeft, Check, Star, Users, BarChart3 } from 'lucide-react';
import { AuthButton } from '@/components/AuthButton';
import { WaitlistForm } from '@/components/WaitlistForm';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white/80 border-b border-border sticky top-0 z-50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-[10px] flex justify-between items-center">
                    <Link href="/" className="py-2">
                        <img src="/assets/logo.png" alt="OWNED" className="w-[120px] h-[120px] object-contain" />
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/pricing" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Pricing
                        </Link>
                        <AuthButton />
                    </div>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6 py-24">
                <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Benefits Side */}
                    <div className="lg:sticky lg:top-32 space-y-12">
                        <div className="space-y-6">
                            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-primary/10">
                                Pro Seller Waitlist
                            </div>
                            <h1 className="text-6xl font-black tracking-tighter leading-none">
                                Scale with <span className="text-primary italic">Professional</span> Tools.
                            </h1>
                            <p className="text-2xl text-muted-foreground font-medium italic leading-relaxed">
                                Pay for tooling, not permission. Pro onboarding isn't open yet — join the waitlist to be first in.
                            </p>
                        </div>

                        <div className="bg-white rounded-[3rem] border border-border p-10 shadow-saas space-y-8">
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary italic">Planned for Pro</h3>
                            <ul className="grid grid-cols-1 gap-6">
                                <li className="flex gap-4 items-center font-bold text-foreground">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                                    </div>
                                    Web Dashboard Entry
                                </li>
                                <li className="flex gap-4 items-center font-bold text-foreground">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <BarChart3 className="w-4 h-4 text-primary" />
                                    </div>
                                    Revenue & Sales Analytics
                                </li>
                                <li className="flex gap-4 items-center font-bold text-foreground">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Users className="w-4 h-4 text-primary" />
                                    </div>
                                    Community Gating Tools
                                </li>
                                <li className="flex gap-4 items-center font-bold text-foreground">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Star className="w-4 h-4 text-primary" />
                                    </div>
                                    Priority Protocol Support
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Waitlist Side */}
                    <div className="bg-white rounded-[4rem] border-2 border-primary shadow-saas-lg p-10 md:p-16 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                        <div className="relative">
                            <WaitlistForm
                                source="register-pro"
                                heading="Join the Pro Waitlist"
                                subheading="Pro seller onboarding isn't live yet. Leave your details and we'll reach out when it opens."
                            />
                        </div>
                    </div>
                </div>
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
