import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteShell } from '@/components/site/SiteShell';

export const metadata = { title: 'Page not found · OWNED IT' };

export default function NotFound() {
    return (
        <SiteShell>
            <section className="relative overflow-hidden" data-no-reveal>
                <div className="absolute left-1/2 top-0 -z-10 h-[360px] w-[900px] -translate-x-1/2 rounded-full bg-[rgba(192,24,144,0.06)] blur-[110px]" />
                <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center md:py-28">
                    <span className="brand-sticker mb-8 inline-flex -rotate-2 items-center gap-2 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-pink)]" />
                        Error 404
                    </span>
                    <h1 className="text-[2.4rem] font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                        This page isn&apos;t <span className="text-brand-gradient">onchain</span> or off it.
                    </h1>
                    <p className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-muted-foreground">
                        The link may be old, or the store may have moved. Everything else is right where you left it.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link href="/" className="btn-brand inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-xs font-black uppercase tracking-[0.12em]">
                            Back home <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link href="/products" className="btn-secondary inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-xs font-black uppercase tracking-[0.12em]">
                            Browse marketplace
                        </Link>
                    </div>
                    <div className="brand-scanlines mt-14 h-2 w-40 rounded-full" aria-hidden="true" />
                </div>
            </section>
        </SiteShell>
    );
}
