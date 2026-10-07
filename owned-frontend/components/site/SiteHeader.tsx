'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu, X } from 'lucide-react';
import { AuthButton } from '@/components/AuthButton';
import { PRIMARY_NAV, isActive } from './navigation';

function ScrollProgress() {
    const [p, setP] = useState(0);
    useEffect(() => {
        let raf = 0;
        const update = () => {
            raf = 0;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);
    return (
        <div className="absolute inset-x-0 bottom-0 h-[2px]" aria-hidden="true">
            <div className="brand-scanlines h-full origin-left transition-transform duration-150 ease-out" style={{ transform: `scaleX(${p})` }} />
        </div>
    );
}

export function SiteHeader() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close the mobile menu on navigation (render-phase reset, no effect) and on Escape.
    const [menuPath, setMenuPath] = useState(pathname);
    if (menuPath !== pathname) {
        setMenuPath(pathname);
        setOpen(false);
    }
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
        <>
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:shadow-lg"
            >
                Skip to content
            </a>

            <div className="bg-[var(--brand-ink)] px-4 py-1.5 text-center text-white">
                <p className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--brand-pink)]" />
                    Testnet beta · Mainnet Dec 8
                </p>
            </div>
            <div className="brand-scanlines h-[3px] w-full" aria-hidden="true" />

            <header
                className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
                    scrolled || open
                        ? 'bg-white/85 shadow-[0_1px_0_rgba(11,11,15,0.08),0_8px_24px_-16px_rgba(11,11,15,0.25)] backdrop-blur-md'
                        : 'bg-white/0'
                }`}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6 md:h-[72px]">
                    <Link href="/" className="group flex shrink-0 items-center" aria-label="OWNED IT home">
                        <img
                            src="/assets/logo-wordmark-480.png"
                            alt="OWNED IT"
                            width={480}
                            height={240}
                            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-105 md:h-11"
                        />
                    </Link>

                    <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
                        {PRIMARY_NAV.map((item) => {
                            const active = isActive(pathname, item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={active ? 'page' : undefined}
                                    className={`link-draw pb-1 text-[11px] font-black uppercase tracking-[0.18em] ${
                                        active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:block">
                            <AuthButton variant="secondary" />
                        </div>
                        <Link
                            href="/register"
                            className="btn-brand hidden items-center gap-2 rounded-xl px-5 py-3 text-xs font-black uppercase tracking-[0.12em] sm:inline-flex"
                        >
                            Join waitlist <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <button
                            type="button"
                            onClick={() => setOpen((v) => !v)}
                            aria-expanded={open}
                            aria-controls="mobile-menu"
                            aria-label={open ? 'Close menu' : 'Open menu'}
                            className="btn-secondary inline-flex h-11 w-11 items-center justify-center rounded-xl lg:hidden"
                        >
                            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                <ScrollProgress />

                {open && (
                    <div id="mobile-menu" className="menu-in border-t border-border bg-white lg:hidden">
                        <nav aria-label="Mobile" className="mx-auto flex max-w-7xl flex-col px-6 py-4">
                            {PRIMARY_NAV.map((item) => {
                                const active = isActive(pathname, item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        aria-current={active ? 'page' : undefined}
                                        className={`flex items-center justify-between border-b border-border py-4 text-lg font-black tracking-tight ${
                                            active ? 'text-primary' : 'text-foreground'
                                        }`}
                                    >
                                        {item.label}
                                        <ArrowRight className="h-4 w-4 opacity-40" />
                                    </Link>
                                );
                            })}
                            <div className="flex flex-col gap-3 pt-5">
                                <Link
                                    href="/register"
                                    className="btn-brand inline-flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-black uppercase tracking-[0.12em]"
                                >
                                    Join waitlist <ArrowRight className="h-4 w-4" />
                                </Link>
                                <AuthButton variant="secondary" block />
                            </div>
                        </nav>
                    </div>
                )}
            </header>
        </>
    );
}
