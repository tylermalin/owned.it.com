'use client';

import { useIsAdmin } from '@/lib/hooks';
import { useContractOwner } from '@/lib/useOwner';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    ShoppingBag,
    Library,
    User,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Store,
    Users,
    ShieldAlert
} from 'lucide-react';
import { useMagic } from '@/components/MagicProvider';
import { AuthButton } from '@/components/AuthButton';
import { toast } from 'react-hot-toast';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, isLoading: isMagicLoading } = useMagic();
    const { data: owner, isLoading } = useContractOwner();
    const isAdmin = useIsAdmin();
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isMagicConnected = !!user?.publicAddress;
    const isOwner = user?.publicAddress?.toLowerCase() === owner?.toLowerCase();

    // Restricted routes that only the owner can access (Core Store Management)
    const ownerOnlyRoutes = ['/dashboard', '/dashboard/withdraw'];
    const isOwnerOnlyRoute = ownerOnlyRoutes.includes(pathname);

    useEffect(() => {
        // Redirect non-owners away from owner-specific pages
        if (!isLoading && !isOwner && isMagicConnected && isOwnerOnlyRoute) {
            router.push('/dashboard/library');
        }
    }, [isOwner, isLoading, isMagicConnected, isOwnerOnlyRoute, router]);

    const navItems = [
        {
            label: 'Library', href: '/dashboard/library', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            )
        },
        {
            label: 'Profile', href: '/dashboard/profile', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            )
        },
        {
            label: 'Products', href: '/dashboard/products', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            )
        },
        {
            label: 'Affiliates', href: '/dashboard/affiliates', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            )
        },
        {
            label: 'Partner Store', href: '/affiliate', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
            )
        },
        ...(isAdmin ? [
            {
                label: 'Admin', href: '/dashboard/admin', icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                )
            },
        ] : []),
        ...(isOwner ? [
            {
                label: 'Overview', href: '/dashboard', icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                )
            },
            {
                label: 'Withdraw', href: '/dashboard/withdraw', icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                )
            },
        ] : []),
    ];

    if (!isMagicConnected && !isMagicLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-4xl border border-border p-12 text-center space-y-8 shadow-saas">
                    <div className="p-4 bg-primary/10 text-primary w-fit mx-auto rounded-3xl animate-bounce-slow">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-extrabold tracking-tight">Access Dashboard</h1>
                        <p className="text-muted-foreground font-medium">
                            Connect your wallet to access your library and management tools.
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <AuthButton />
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

    return (
        <div className="min-h-screen bg-slate-50/50 flex">
            {/* Sidebar */}
            <aside className="w-80 glass border-r border-border sticky top-0 h-screen flex flex-col p-8 space-y-12">
                <Link href="/" className="px-4 group">
                    <div className="relative">
                        <img src="/assets/logo.png" alt="OWNED" className="w-[120px] h-[120px] object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-2" />
                        <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </Link>

                <nav className="flex-1 space-y-3">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.15em] transition-all group ${isActive
                                    ? 'bg-primary text-primary-foreground shadow-saas shadow-primary/20 scale-[1.02]'
                                    : 'text-muted-foreground hover:bg-white/50 hover:text-foreground'
                                    }`}
                            >
                                <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-primary'}`}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-8 border-t border-border space-y-6">
                    <Link
                        href="/products"
                        className="flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all group"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <Store className="w-4 h-4" />
                        </div>
                        Public Store
                    </Link>
                    <div className="flex justify-center">
                        <div className="scale-95">
                            <AuthButton />
                        </div>
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
