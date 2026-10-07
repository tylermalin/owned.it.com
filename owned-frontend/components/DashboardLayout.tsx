'use client';

import { useIsAdmin } from '@/lib/hooks';
import { useContractOwner } from '@/lib/useOwner';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Library, User, Package, Share2, ShieldCheck, Wallet, Store, ArrowUpRight, Loader2, KeyRound } from 'lucide-react';
import { useMagic } from '@/components/MagicProvider';
import { AuthButton } from '@/components/AuthButton';
import { SiteHeader } from '@/components/site/SiteHeader';
import { MobileTabBar, type TabItem } from '@/components/site/MobileTabBar';

type NavItem = { label: string; href: string; icon: LucideIcon };

/**
 * App shell for signed-in pages: the same top header as the public site, a sidebar on
 * desktop and a bottom tab bar on phones. Auth gate and owner redirect live here.
 */
export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading: isMagicLoading } = useMagic();
    const { data: owner, isLoading } = useContractOwner();
    const isAdmin = useIsAdmin();
    const router = useRouter();
    const pathname = usePathname();

    const isMagicConnected = !!user?.publicAddress;
    const isOwner = !!user?.publicAddress && user.publicAddress.toLowerCase() === owner?.toLowerCase();

    // Restricted routes that only the owner can access (Core Store Management)
    const ownerOnlyRoutes = ['/dashboard', '/dashboard/withdraw'];
    const isOwnerOnlyRoute = ownerOnlyRoutes.includes(pathname);

    useEffect(() => {
        // Redirect non-owners away from owner-specific pages
        if (!isLoading && !isOwner && isMagicConnected && isOwnerOnlyRoute) {
            router.push('/dashboard/library');
        }
    }, [isOwner, isLoading, isMagicConnected, isOwnerOnlyRoute, router]);

    const navItems: NavItem[] = [
        ...(isOwner ? [{ label: 'Overview', href: '/dashboard', icon: LayoutDashboard }] : []),
        { label: 'Library', href: '/dashboard/library', icon: Library },
        { label: 'Products', href: '/dashboard/products', icon: Package },
        ...(isOwner ? [{ label: 'Withdraw', href: '/dashboard/withdraw', icon: Wallet }] : []),
        { label: 'Affiliates', href: '/dashboard/affiliates', icon: Share2 },
        { label: 'Profile', href: '/dashboard/profile', icon: User },
        ...(isAdmin ? [{ label: 'Admin', href: '/dashboard/admin', icon: ShieldCheck }] : []),
    ];

    // Bottom bar holds five slots; the rest stay reachable from the account menu.
    const tabs: TabItem[] = (
        isOwner
            ? navItems.filter((i) => ['Overview', 'Library', 'Products', 'Withdraw', 'Profile'].includes(i.label))
            : navItems.filter((i) => ['Library', 'Products', 'Affiliates', 'Profile'].includes(i.label)).concat([
                  { label: 'Market', href: '/products', icon: Store },
              ])
    ).map((i) => ({ ...i, exact: true }));

    const isActive = (href: string) => (href === '/dashboard' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

    let body: React.ReactNode;
    if (!isMagicConnected && !isMagicLoading) {
        body = (
            <div className="flex flex-1 items-center justify-center px-6 py-16">
                <div className="brand-card w-full max-w-md overflow-hidden rounded-[2rem] bg-white text-center">
                    <div className="brand-scanlines h-2.5" aria-hidden="true" />
                    <div className="space-y-6 p-8 md:p-10">
                        <div className="brand-sticker mx-auto flex h-14 w-14 items-center justify-center rounded-2xl">
                            <KeyRound className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black tracking-tight">Access dashboard</h1>
                            <p className="font-medium text-muted-foreground">
                                Connect your wallet to access your library and management tools.
                            </p>
                        </div>
                        <AuthButton block />
                        <Link href="/products" className="link-draw inline-block pb-0.5 text-sm font-bold text-muted-foreground hover:text-foreground">
                            Browse the marketplace
                        </Link>
                    </div>
                </div>
            </div>
        );
    } else if (isLoading || isMagicLoading) {
        body = (
            <div className="flex flex-1 items-center justify-center py-24" role="status" aria-live="polite">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <div className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Loading dashboard</div>
                </div>
            </div>
        );
    } else {
        body = (
            <div className="mx-auto flex w-full max-w-7xl flex-1 gap-10 px-4 pb-28 pt-6 sm:px-6 md:pt-8 lg:pb-16">
                {/* Desktop sidebar */}
                <aside className="hidden w-60 shrink-0 lg:block">
                    <div className="sticky top-24 space-y-6">
                        <div>
                            <p className="eyebrow mb-3 px-3">Workspace</p>
                            <nav aria-label="Dashboard" className="space-y-1">
                                {navItems.map(({ label, href, icon: Icon }) => {
                                    const active = isActive(href);
                                    return (
                                        <Link
                                            key={href}
                                            href={href}
                                            aria-current={active ? 'page' : undefined}
                                            className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
                                                active ? 'bg-[var(--brand-ink)] text-white' : 'text-muted-foreground hover:bg-white hover:text-foreground'
                                            }`}
                                        >
                                            {active && <span className="brand-scanlines absolute inset-y-2 left-0 w-1 rounded-r-full" aria-hidden="true" />}
                                            <Icon className={`h-[18px] w-[18px] transition-transform duration-200 ${active ? '' : 'group-hover:-rotate-6 group-hover:scale-110'}`} />
                                            {label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                        <div className="rounded-2xl border border-border bg-white p-4">
                            <p className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground">Testnet beta</p>
                            <p className="mt-1 text-xs font-medium text-muted-foreground">Base Sepolia. Test USDC only until mainnet on Dec 8.</p>
                            <Link href="/products" className="link-draw mt-3 inline-flex items-center gap-1 pb-0.5 text-xs font-bold text-foreground">
                                Public marketplace <ArrowUpRight className="h-3 w-3" />
                            </Link>
                        </div>
                    </div>
                </aside>

                <div className="page-enter min-w-0 flex-1">{children}</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-50/60 selection:bg-primary/20">
            <SiteHeader />
            <main id="main" className="flex flex-1 flex-col">
                {body}
            </main>
            {isMagicConnected && <MobileTabBar items={tabs} label="Dashboard" />}
            {!isMagicConnected && <MobileTabBar />}
        </div>
    );
}
