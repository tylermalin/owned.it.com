'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { Home, Store, Tag, BookOpen, User } from 'lucide-react';
import { isActive } from './navigation';

export type TabItem = { label: string; href: string; icon: LucideIcon; exact?: boolean };

export const SITE_TABS: TabItem[] = [
    { label: 'Home', href: '/', icon: Home, exact: true },
    { label: 'Market', href: '/products', icon: Store },
    { label: 'Pricing', href: '/pricing', icon: Tag },
    { label: 'Docs', href: '/docs', icon: BookOpen },
    { label: 'Account', href: '/dashboard/library', icon: User },
];

/** App-style bottom navigation, phones and tablets only. */
export function MobileTabBar({ items = SITE_TABS, label = 'Quick navigation' }: { items?: TabItem[]; label?: string }) {
    const pathname = usePathname();
    return (
        <nav
            aria-label={label}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
        >
            <ul className="mx-auto flex max-w-lg items-stretch justify-around">
                {items.map(({ label: l, href, icon: Icon, exact }) => {
                    const active = exact ? pathname === href : isActive(pathname, href);
                    return (
                        <li key={href} className="flex-1">
                            <Link
                                href={href}
                                aria-current={active ? 'page' : undefined}
                                className={`relative flex flex-col items-center gap-1 px-1 pb-2 pt-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                    active ? 'text-primary' : 'text-muted-foreground'
                                }`}
                            >
                                <span
                                    className={`absolute inset-x-5 top-0 h-[3px] rounded-b-full transition-opacity ${active ? 'brand-scanlines opacity-100' : 'opacity-0'}`}
                                    aria-hidden="true"
                                />
                                <Icon className={`h-5 w-5 transition-transform duration-200 ${active ? 'scale-110' : ''}`} strokeWidth={active ? 2.5 : 2} />
                                {l}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
