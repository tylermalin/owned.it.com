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
                    <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Verifying Store Ownership</div>
                </div>
            </DashboardLayout>
        );
    }

    if (!isOwner) {
        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="space-y-2">
                        <span className="brand-sticker inline-block rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em]">
                            Creator Dashboard Locked
                        </span>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                            Ready to <span className="text-brand-gradient">Monetize</span>?
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground font-medium max-w-2xl">
                            Unlock the professional dashboard, on-chain product deployment, and affiliate tracking suite.
                        </p>
                    </div>

                    <WalletBalances />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="rounded-3xl border border-border bg-white p-6 md:p-8 card-lift space-y-6">
                            <p className="eyebrow">Pro Features</p>
                            <ul className="space-y-4">
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
                                className="btn-brand rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em] w-full"
                            >
                                Get Started
                            </Link>
                        </div>

                        <div className="rounded-3xl border border-border bg-white p-6 md:p-8 card-lift space-y-6">
                            <p className="eyebrow">Try it out</p>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                Not ready to launch? You can still create test products and bundles locally to see how the checkout flow works.
                            </p>
                            <Link
                                href="/dashboard/products"
                                className="btn-secondary rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em] w-full"
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
            <div className="space-y-10">
                <div className="flex flex-wrap justify-between items-end gap-4">
                    <div className="space-y-1">
                        <p className="eyebrow">Creator Ecosystem</p>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">Dashboard</h1>
                        <p className="text-sm md:text-base text-muted-foreground font-medium">
                            Manage your digital empire on Base.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <Link
                            href="/dashboard/products"
                            className="btn-brand rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em]"
                        >
                            <Plus className="w-4 h-4" />
                            Add Product
                        </Link>
                    </div>
                </div>

                <WalletBalances />
                <DashboardStats />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl md:text-2xl font-black tracking-tight">Recent Activity</h2>
                            <Link href="#" className="link-draw pb-0.5 text-xs font-bold text-primary hover:text-foreground">View All Activity →</Link>
                        </div>
                        <div className="rounded-3xl border border-border bg-white p-4 overflow-hidden">
                            <RecentActivity />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl md:text-2xl font-black tracking-tight">Quick Actions</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <Link
                                href="/dashboard/products"
                                className="rounded-3xl border border-border bg-white p-6 md:p-8 card-lift block group"
                            >
                                <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl mb-6 group-hover:scale-110 transition-transform">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black tracking-tight mb-2">Add Product</h3>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                    Create a new digital product or membership.
                                </p>
                            </Link>
                            <Link
                                href="/dashboard/withdraw"
                                className="rounded-3xl border border-border bg-white p-6 md:p-8 card-lift block group"
                            >
                                <div className="p-3 bg-emerald-50 text-emerald-600 w-fit rounded-xl mb-6 group-hover:scale-110 transition-transform">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black tracking-tight mb-2">Withdraw Earnings</h3>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-border bg-white p-6 md:p-8 card-lift group">
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-4 group-hover:text-primary transition-colors">
                    Gross Volume
                </div>
                <div className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                    {totalSales}
                </div>
            </div>
            <div className="rounded-3xl border border-border bg-white p-6 md:p-8 card-lift group">
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-4 group-hover:text-primary transition-colors">
                    Protocol Status
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
                    <div className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Live</div>
                </div>
            </div>
        </div>
    );
}
