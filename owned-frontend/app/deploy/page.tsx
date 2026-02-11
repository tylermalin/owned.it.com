'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Rocket, Shield, Zap, Loader2 } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useDeployStore } from '@/lib/registryHooks';
import toast from 'react-hot-toast';

export default function DeployPage() {
    const router = useRouter();
    const { isConnected } = useAccount();
    const { deploy, isApprovePending, isApproveSuccess, isActionPending, isActionSuccess, actionHash, actionError } = useDeployStore();

    const [formData, setFormData] = useState({
        storeName: '',
        slug: '',
        email: ''
    });

    useEffect(() => {
        if (isActionSuccess) {
            toast.success('Store deployed successfully!');
            setTimeout(() => router.push('/dashboard'), 3000);
        }
    }, [isActionSuccess, router]);

    useEffect(() => {
        if (actionError) {
            toast.error('Deployment failed: ' + (actionError.message || 'Unknown error'));
        }
    }, [actionError]);

    const handleDeploy = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected) {
            toast.error('Please connect your wallet first');
            return;
        }
        deploy();
    };

    const isPending = isApprovePending || isActionPending;
    const buttonText = isApprovePending
        ? 'Approving USDC...'
        : isActionPending
            ? 'Deploying Store...'
            : `Deploy Store ($299)`;

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col">
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
                        <ConnectButton />
                    </div>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6 py-24">
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
                                Join the protocol. We'll deploy your CreatorStore contract on Base and pin your storefront to IPFS.
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
                                    <h3 className="font-bold text-lg text-foreground">One-time Payment</h3>
                                    <p className="text-sm text-muted-foreground font-medium">$299 USDC to live forever on Base.</p>
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

                    {/* Form Side */}
                    <div className="bg-white rounded-[3rem] border border-border shadow-saas p-10 md:p-12 space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black tracking-tight">Setup Your Store</h2>
                            <p className="text-sm text-muted-foreground font-medium">Enter your details to prepare the deployment.</p>
                        </div>

                        <form onSubmit={handleDeploy} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Store Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Creator Academy"
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-border text-foreground font-bold placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    value={formData.storeName}
                                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Store Slug</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-muted-foreground">ownedit.xyz/</span>
                                    <input
                                        type="text"
                                        placeholder="your-name"
                                        className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border border-border text-foreground font-bold placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-border text-foreground font-bold placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!formData.storeName || !formData.slug || !formData.email || isPending}
                                className="w-full py-6 bg-primary text-primary-foreground rounded-3xl font-black uppercase tracking-[0.3em] text-sm shadow-saas hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-primary/20 mt-4 flex items-center justify-center gap-3"
                            >
                                {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                                {buttonText}
                            </button>

                            {actionHash && (
                                <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-wider italic">
                                    Transaction confirmed: <a href={`https://sepolia.basescan.org/tx/${actionHash}`} target="_blank" rel="noopener noreferrer" className="text-primary underline">View on Basescan</a>
                                </p>
                            )}

                            <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-wider italic">
                                {isActionPending ? 'Deployment in progress...' : 'Deployment takes ~2 minutes once confirmed.'}
                            </p>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
