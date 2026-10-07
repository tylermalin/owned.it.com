import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { FOOTER_NAV, CONTRACT_URL, X_URL } from './navigation';

export function SiteFooter() {
    return (
        <footer className="mt-24 border-t border-border bg-slate-50/70">
            <div className="brand-scanlines h-[3px] w-full" aria-hidden="true" />
            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
                <div className="space-y-5">
                    <Link href="/" aria-label="OWNED IT home" className="inline-block">
                        <img src="/assets/logo-wordmark-480.png" alt="OWNED IT" width={480} height={240} className="h-12 w-auto" />
                    </Link>
                    <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                        Sell digital products from a store you own. Buyers pay in USDC. You keep 97%.
                    </p>
                    <span className="brand-sticker inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-pink)]" />
                        Testnet beta · Mainnet Dec 8
                    </span>
                </div>

                {FOOTER_NAV.map((group) => (
                    <nav key={group.title} aria-label={group.title} className="space-y-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-foreground">{group.title}</p>
                        <ul className="space-y-3">
                            {group.links.map((l) => (
                                <li key={l.href}>
                                    <Link href={l.href} className="link-draw pb-0.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}
            </div>

            <div className="border-t border-border">
                <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-6 text-xs font-medium text-muted-foreground md:flex-row md:items-center">
                    <p>© {new Date().getFullYear()} OWNED IT. Built on Base. Settles in USDC.</p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <a href={CONTRACT_URL} target="_blank" rel="noopener noreferrer" className="link-draw inline-flex items-center gap-1 pb-0.5 hover:text-foreground">
                            Contract on Basescan <ExternalLink className="h-3 w-3" />
                        </a>
                        <a href={X_URL} target="_blank" rel="noopener noreferrer" className="link-draw inline-flex items-center gap-1 pb-0.5 hover:text-foreground">
                            @owneditxyz on X <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                </div>
            </div>
            {/* room for the mobile tab bar */}
            <div className="h-20 lg:hidden" aria-hidden="true" />
        </footer>
    );
}
