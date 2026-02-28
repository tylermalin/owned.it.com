'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Star, Users, BarChart3, Loader2 } from 'lucide-react';
import { AuthButton } from '@/components/AuthButton';
import { useMagic } from '@/components/MagicProvider';
import { useSubscribePro } from '@/lib/registryHooks';
import { EXPLORER_URL } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const router = useRouter();
    const { user: magicUser, isLoading: isMagicLoading } = useMagic();
    const isMagicConnected = !!magicUser?.publicAddress;
    const { subscribe, isApprovePending, isApproveSuccess, isActionPending, isActionSuccess, actionHash, actionError } = useSubscribePro();

    const [formData, setFormData] = useState({
        storeName: '',
        email: '',
        socialHandle: ''
    });

    useEffect(() => {
        if (isActionSuccess) {
            localStorage.setItem('demo_pro_access', 'true');
            toast.success('Subscription activated! 7-day trial started.');
            setTimeout(() => router.push('/dashboard'), 3000);
        }
    }, [isActionSuccess, router]);

    useEffect(() => {
        if (actionError) {
            const message = typeof actionError === 'string' ? actionError : (actionError as any).message || 'Unknown error';
            toast.error('Activation failed: ' + message);
        }
    }, [actionError]);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isMagicConnected) {
            toast.error('Please sign in first');
            return;
        }
        subscribe();
    };

    const isPending = isApprovePending || isActionPending;
    const buttonText = isApprovePending
        ? 'Approving USDC...'
        : isActionPending
            ? 'Activating...'
            : 'Activate Pro Access';

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
                                Pro Seller Onboarding
                            </div>
                            <h1 className="text-6xl font-black tracking-tighter leading-none">
                                Scale with <span className="text-primary italic">Professional</span> Tools.
                            </h1>
                            <p className="text-2xl text-muted-foreground font-medium italic leading-relaxed">
                                Pay for tooling, not permission. Unlock the dashboard, analytics, and fulfillment suite.
                            </p>
                        </div>

                        <div className="bg-white rounded-[3rem] border border-border p-10 shadow-saas space-y-8">
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary italic">Included in Pro</h3>
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

                    {/* Registration Side */}
                    <div className="bg-white rounded-[4rem] border-2 border-primary shadow-saas-lg p-10 md:p-16 space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

                        <div className="relative space-y-2">
                            <h2 className="text-3xl font-black tracking-tight italic">Start Your 7-Day Trial</h2>
                            <p className="text-base text-muted-foreground font-medium">No platform risk. Cancel anytime. Still own your contracts.</p>
                        </div>

                        <form onSubmit={handleSubscribe} className="relative space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Proposed Store Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. The Alpha Lab"
                                    className="w-full px-8 py-5 rounded-3xl bg-slate-50 border border-border text-foreground font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-lg"
                                    value={formData.storeName}
                                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Work Email</label>
                                <input
                                    type="email"
                                    placeholder="you@creators.com"
                                    className="w-full px-8 py-5 rounded-3xl bg-slate-50 border border-border text-foreground font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-lg"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">X / Twitter Handle</label>
                                <div className="flex items-center gap-3">
                                    <span className="text-xl font-bold text-muted-foreground pl-2">@</span>
                                    <input
                                        type="text"
                                        placeholder="handle"
                                        className="flex-1 px-8 py-5 rounded-3xl bg-slate-50 border border-border text-foreground font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-lg"
                                        value={formData.socialHandle}
                                        onChange={(e) => setFormData({ ...formData, socialHandle: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-6 space-y-4">
                                <button
                                    type="submit"
                                    disabled={!formData.storeName || !formData.email || isPending}
                                    className="w-full py-7 bg-primary text-primary-foreground rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-sm shadow-saas hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:scale-100 shadow-primary/20 flex items-center justify-center gap-4"
                                >
                                    {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                                    {buttonText}
                                </button>

                                {actionHash && (
                                    <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-wider italic">
                                        Escrow initiated: <a href={`${EXPLORER_URL}/tx/${actionHash}`} target="_blank" rel="noopener noreferrer" className="text-primary underline">View on Basescan</a>
                                    </p>
                                )}

                                <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-wider">
                                    $9 / MONTH AFTER TRIAL · BILLED ONCHAIN
                                </p>
                                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-[10px] font-bold text-emerald-700 uppercase tracking-widest text-center">
                                    7-Day Free Trial hold in escrow
                                </div>
                            </div>
                        </form>
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
