'use client';

import { useAccount } from 'wagmi';
import { useContractOwner } from '@/lib/useOwner';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { address, isConnected } = useAccount();
    const { data: owner, isLoading } = useContractOwner();
    const router = useRouter();
    const pathname = usePathname();

    const isOwner = address && (owner as string) && address.toLowerCase() === (owner as string).toLowerCase();

    useEffect(() => {
        if (!isLoading && !isOwner && isConnected) {
            router.push('/products');
        }
    }, [isOwner, isLoading, isConnected, router]);

    const navItems = [
        {
            label: 'Overview', href: '/dashboard', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            )
        },
        {
            label: 'Products', href: '/dashboard/products', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            )
        },
        {
            label: 'Withdraw', href: '/dashboard/withdraw', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            )
        },
    ];

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-4xl border border-border p-12 text-center space-y-8 shadow-saas">
                    <div className="p-4 bg-primary/10 text-primary w-fit mx-auto rounded-3xl animate-bounce-slow">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-extrabold tracking-tight">Creator Portal</h1>
                        <p className="text-muted-foreground font-medium">
                            Connect your wallet to manage your products and withdraw earnings.
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <ConnectButton />
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Loading Dashboard</div>
                </div>
            </div>
        );
    }

    if (!isOwner) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-4xl border border-border p-12 text-center space-y-8 shadow-saas">
                    <h1 className="text-3xl font-extrabold tracking-tight text-red-500">Access Restricted</h1>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                        Only the verified store owner can access the management dashboard for this contract.
                    </p>
                    <Link
                        href="/products"
                        className="inline-block w-full py-4 bg-muted hover:bg-slate-200 rounded-2xl font-bold transition-all"
                    >
                        View Marketplace
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 flex">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-border sticky top-0 h-screen flex flex-col p-6 space-y-10">
                <Link href="/" className="px-6 py-2">
                    <img src="/assets/logo.png" alt="OWNED" className="h-8 w-auto hover:brightness-110 transition-all" />
                </Link>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all ${isActive
                                    ? 'bg-primary text-primary-foreground shadow-saas'
                                    : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground'
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-6 border-t border-border space-y-4">
                    <Link
                        href="/products"
                        className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        Public Store
                    </Link>
                    <div className="flex justify-center pt-2">
                        <ConnectButton />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-12 max-w-[1280px]">
                {children}
            </main>
        </div>
    );
}
