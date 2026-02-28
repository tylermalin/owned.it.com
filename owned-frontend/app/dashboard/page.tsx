'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { RecentActivity } from '@/components/RecentActivity';
import { useNextTokenId } from '@/lib/hooks';
import { formatUSDC } from '@/lib/utils';
import { WalletBalances } from '@/components/WalletBalances';
import { useMagic } from '@/components/MagicProvider';
import { useContractOwner } from '@/lib/useOwner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Layout,
    Package,
    DollarSign,
    Settings,
    Plus,
    ArrowUpRight,
    Store
} from 'lucide-react';

export default function DashboardPage() {
    const { user: magicUser } = useMagic();
    const { data: owner, isLoading } = useContractOwner();

    const [hasDemoPro, setHasDemoPro] = useState(false);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setHasDemoPro(localStorage.getItem('demo_pro_access') === 'true');
        }
    }, []);

    const isOwner = magicUser?.publicAddress ? (
        ((owner as string) && magicUser.publicAddress.toLowerCase() === (owner as string).toLowerCase()) || hasDemoPro
    ) : false;

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Verifying Store Ownership</div>
                </div>
            </DashboardLayout>
        );
    }

    if (!isOwner) {
        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto space-y-12 py-12">
                    <WalletBalances />
                    <div className="text-center space-y-6">
                        <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-primary/10">
                            Creator Dashboard Locked
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                            Ready to <span className="text-primary italic">Monetize</span>?
                        </h1>
                        <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                            Unlock the professional dashboard, on-chain product deployment, and affiliate tracking suite.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white border border-border p-10 rounded-[3rem] shadow-saas space-y-8">
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary italic">Pro Features</h3>
                            <ul className="space-y-6">
                                <li className="flex gap-4 items-center font-bold text-foreground">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">✓</div>
                                    Full Revenue Analytics
                                </li>
                                <li className="flex gap-4 items-center font-bold text-foreground">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">✓</div>
                                    On-chain Product Deployment
                                </li>
                                <li className="flex gap-4 items-center font-bold text-foreground">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">✓</div>
                                    Affiliate Network Controls
                                </li>
                            </ul>
                            <Link
                                href="/register"
                                className="block w-full py-6 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.3em] text-sm text-center shadow-saas hover:scale-105 transition-all"
                            >
                                Get Started
                            </Link>
                        </div>

                        <div className="bg-slate-900 text-white border border-slate-800 p-10 rounded-[3rem] shadow-saas space-y-8">
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary italic">Try it out</h3>
                            <p className="text-slate-400 font-medium leading-relaxed">
                                Not ready to launch? You can still create test products and bundles locally to see how the checkout flow works.
                            </p>
                            <Link
                                href="/dashboard/products"
                                className="block w-full py-6 bg-white/10 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-sm text-center border border-white/10 hover:bg-white/20 transition-all"
                            >
                                Try Test Mode
                            </Link>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-16">
                <div className="flex justify-between items-end mb-16">
                    <div className="space-y-2">
                        <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-primary/10 mb-2">
                            Creator Ecosystem
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter text-foreground leading-none">Dashboard</h1>
                        <p className="text-xl text-muted-foreground font-medium italic">
                            Manage your digital empire on Base.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <Link
                            href="/dashboard/products"
                            className="px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 shadow-saas hover:bg-primary hover:scale-105 active:scale-95 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Add Product
                        </Link>
                    </div>
                </div>

                <WalletBalances />
                <DashboardStats />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-black tracking-tight">Recent Activity</h2>
                            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All Activity →</Link>
                        </div>
                        <div className="glass rounded-[3rem] p-4 shadow-sm overflow-hidden">
                            <RecentActivity />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h2 className="text-3xl font-black tracking-tight">Quick Actions</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <Link
                                href="/dashboard/products"
                                className="glass p-10 rounded-[3rem] hover:shadow-saas-lg hover:scale-[1.02] transition-all group border border-border/50"
                            >
                                <div className="p-4 bg-primary text-white w-fit rounded-2xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-glow">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black mb-3">Add Product</h3>
                                <p className="text-sm text-muted-foreground font-medium italic leading-relaxed">
                                    Create a new digital product or membership.
                                </p>
                            </Link>
                            <Link
                                href="/dashboard/withdraw"
                                className="glass p-10 rounded-[3rem] hover:shadow-saas-lg hover:scale-[1.02] transition-all group border border-border/50"
                            >
                                <div className="p-4 bg-emerald-500 text-white w-fit rounded-2xl mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-xl shadow-emerald-500/10">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black mb-3">Withdraw Earnings</h3>
                                <p className="text-sm text-muted-foreground font-medium italic leading-relaxed">
                                    Transfer your USDC balance to your wallet instantly.
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function DashboardStats() {
    const { data: nextTokenId } = useNextTokenId();

    const totalSales = nextTokenId ? Number(nextTokenId) - 1 : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="glass p-10 rounded-[3rem] shadow-saas hover:shadow-saas-lg transition-all border border-border/50 group">
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-6 group-hover:text-primary transition-colors">
                    Gross Volume
                </div>
                <div className="text-5xl font-black text-foreground italic tracking-tighter">
                    {totalSales}
                </div>
            </div>
            <div className="glass p-10 rounded-[3rem] shadow-saas hover:shadow-saas-lg transition-all border border-border/50 group">
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-6 group-hover:text-primary transition-colors">
                    Protocol Status
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse shadow-glow shadow-emerald-500/50" />
                    <div className="text-5xl font-black text-foreground italic tracking-tighter">Live</div>
                </div>
            </div>
        </div>
    );
}
