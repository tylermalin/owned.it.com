'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { RecentActivity } from '@/components/RecentActivity';
import { useCreatorBalance, useNextTokenId } from '@/lib/hooks';
import { formatUSDC } from '@/lib/utils';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import {
    Layout,
    Package,
    DollarSign,
    Settings,
    Plus,
    ArrowUpRight
} from 'lucide-react';

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <div className="space-y-10">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Dashboard</h1>
                        <p className="text-lg text-muted-foreground font-medium">
                            Manage your digital empire on Base.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <Link
                            href="/dashboard/products"
                            className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center gap-2 shadow-saas hover:scale-105 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Add Product
                        </Link>
                    </div>
                </div>

                <DashboardStats />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
                            <Link href="#" className="text-sm font-bold text-primary hover:underline">View All</Link>
                        </div>
                        <div className="bg-white border border-border rounded-4xl p-2 shadow-sm">
                            <RecentActivity />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold tracking-tight">Quick Actions</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <Link
                                href="/dashboard/products"
                                className="bg-white border border-border p-8 rounded-4xl hover:shadow-saas hover:border-primary/30 transition-all group"
                            >
                                <div className="p-3 bg-primary/10 text-primary w-fit rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Add Product</h3>
                                <p className="text-sm text-muted-foreground font-medium">
                                    Create a new digital product or membership
                                </p>
                            </Link>
                            <Link
                                href="/dashboard/withdraw"
                                className="bg-white border border-border p-8 rounded-4xl hover:shadow-saas hover:border-primary/30 transition-all group"
                            >
                                <div className="p-3 bg-emerald-100 text-emerald-600 w-fit rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Withdraw Earnings</h3>
                                <p className="text-sm text-muted-foreground font-medium">
                                    Transfer your USDC balance to your wallet
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
    const { data: balance } = useCreatorBalance();
    const { data: nextTokenId } = useNextTokenId();

    const totalSales = nextTokenId ? Number(nextTokenId) - 1 : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-border p-8 rounded-4xl shadow-sm hover:shadow-saas transition-all">
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
                    Balance
                </div>
                <div className="text-4xl font-black text-foreground italic tracking-tight">
                    {balance ? formatUSDC(balance as bigint) : '$0.00'}
                </div>
            </div>
            <div className="bg-white border border-border p-8 rounded-4xl shadow-sm hover:shadow-saas transition-all">
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
                    Total Sales
                </div>
                <div className="text-4xl font-black text-foreground italic tracking-tight">
                    {totalSales}
                </div>
            </div>
            <div className="bg-white border border-border p-8 rounded-4xl shadow-sm hover:shadow-saas transition-all">
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
                    Store Status
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <div className="text-4xl font-black text-foreground italic tracking-tight">Active</div>
                </div>
            </div>
        </div>
    );
}

