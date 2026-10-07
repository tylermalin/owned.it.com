import type { ReactNode } from 'react';

/**
 * The standard opening for every interior page: sticker eyebrow, display headline,
 * one-paragraph lede, optional actions. Put the emphasized phrase in `accent`.
 */
export function PageHeader({
    eyebrow,
    title,
    accent,
    after,
    lede,
    actions,
    align = 'left',
    children,
}: {
    eyebrow?: string;
    title: string;
    accent?: string;
    after?: string;
    lede?: ReactNode;
    actions?: ReactNode;
    align?: 'left' | 'center';
    children?: ReactNode;
}) {
    const center = align === 'center';
    return (
        <section className="relative overflow-hidden" data-no-reveal>
            <div className="absolute left-1/2 top-0 -z-10 h-[360px] w-[900px] -translate-x-1/2 rounded-full bg-[rgba(192,24,144,0.06)] blur-[110px]" />
            <div className={`mx-auto max-w-7xl px-6 pb-10 pt-12 md:pb-14 md:pt-16 ${center ? 'text-center' : ''}`}>
                <div className={`max-w-3xl ${center ? 'mx-auto' : ''}`}>
                    {eyebrow && (
                        <span className="brand-sticker mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-pink)]" />
                            {eyebrow}
                        </span>
                    )}
                    <h1 className="text-[2.4rem] font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                        {title}
                        {accent && (
                            <>
                                {' '}
                                <span className="text-brand-gradient">{accent}</span>
                            </>
                        )}
                        {after && <> {after}</>}
                    </h1>
                    {lede && <div className={`mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl ${center ? 'mx-auto' : ''}`}>{lede}</div>}
                    {actions && <div className={`mt-8 flex flex-wrap gap-3 ${center ? 'justify-center' : ''}`}>{actions}</div>}
                    {children}
                </div>
            </div>
        </section>
    );
}
