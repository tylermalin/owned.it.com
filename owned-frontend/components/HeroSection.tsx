'use client';

import { useState } from 'react';
import { ArrowRight, Check, Loader2, ExternalLink } from 'lucide-react';

const CONTRACT_URL = 'https://sepolia.basescan.org/address/0x2CfE077af112B9F6e6Ed39e327D3d31c840401BD';
const FOUNDER_URL = 'https://x.com/tylermalin';

// Example sale shown in the checkout card. 3% fee, matching the contract.
const EXAMPLE_PRICE = 29;
const EXAMPLE_FEE = +(EXAMPLE_PRICE * 0.03).toFixed(2);
const EXAMPLE_NET = +(EXAMPLE_PRICE - EXAMPLE_FEE).toFixed(2);
const usd = (n: number) => `$${n.toFixed(2)}`;

function HeroWaitlist() {
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState(''); // honeypot: real people never see or fill this
    const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
    const [error, setError] = useState('');

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (state === 'sending') return;
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
            setError('Enter a valid email address.');
            setState('error');
            return;
        }
        if (website) {
            setState('done');
            return;
        }
        setState('sending');
        setError('');
        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), source: 'hero' }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Could not record your signup.');
            }
            setState('done');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
            setState('error');
        }
    };

    if (state === 'done') {
        return (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-4" role="status">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                    <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                </span>
                <p className="text-sm font-semibold text-foreground">
                    You&apos;re on the list. One email when onboarding opens, nothing else.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="w-full max-w-xl" noValidate>
            <div className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="hero-email" className="sr-only">Email address</label>
                <input
                    id="hero-email"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 w-full min-w-0 rounded-2xl sm:flex-1 border border-border bg-white px-5 text-base font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[var(--brand-magenta)] focus:ring-2 focus:ring-[rgba(192,24,144,0.25)]"
                />
                <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="absolute -left-[9999px] h-px w-px opacity-0"
                />
                <button
                    type="submit"
                    disabled={state === 'sending'}
                    className="btn-brand group inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl px-7 text-sm font-black uppercase tracking-[0.12em] active:scale-[0.98] disabled:opacity-60"
                >
                    {state === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Join the waitlist
                    {state !== 'sending' ? <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /> : null}
                </button>
            </div>
            <p className={`mt-3 text-xs font-medium ${state === 'error' ? 'text-red-600' : 'text-muted-foreground'}`} aria-live="polite">
                {state === 'error' ? error : 'Free to join. No payment, no wallet needed yet.'}
            </p>
        </form>
    );
}

function CheckoutCard() {
    return (
        <div className="relative mx-auto w-full max-w-md" aria-label="Example checkout showing a 3% fee">
            <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-[rgba(192,24,144,0.10)] blur-3xl" />
            <div className="brand-card overflow-hidden rounded-[2rem] bg-white">
                <div className="brand-scanlines h-2.5 w-full" aria-hidden="true" />
                <div className="p-6 sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Example checkout</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">USDC on Base</span>
                </div>

                <div className="mb-6 flex items-center gap-4">
                    <div className="brand-scanlines flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[1.5px] border-[var(--brand-ink)] text-xl font-black text-white [text-shadow:1px_1px_0_#0b0b0f]">P</div>
                    <div className="min-w-0">
                        <p className="truncate text-lg font-bold text-foreground">Founder Prompt Pack</p>
                        <p className="text-sm text-muted-foreground">Digital download</p>
                    </div>
                    <p className="ml-auto text-2xl font-black text-foreground">{usd(EXAMPLE_PRICE)}</p>
                </div>

                <dl className="space-y-3 border-t border-border pt-5 text-sm">
                    <div className="flex justify-between">
                        <dt className="text-muted-foreground">Buyer pays</dt>
                        <dd className="font-semibold text-foreground">{usd(EXAMPLE_PRICE)}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-muted-foreground">OWNED fee (3%)</dt>
                        <dd className="font-semibold text-foreground">{usd(EXAMPLE_FEE)}</dd>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 px-3 py-2.5">
                        <dt className="font-bold text-foreground">You receive</dt>
                        <dd className="text-lg font-black text-emerald-700">{usd(EXAMPLE_NET)}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-muted-foreground">Credited</dt>
                        <dd className="font-semibold text-foreground">At the moment of sale</dd>
                    </div>
                </dl>

                <div className="btn-brand mt-6 flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold" aria-hidden="true">
                    Pay {EXAMPLE_PRICE.toFixed(2)} USDC
                </div>
                </div>
            </div>
        </div>
    );
}

const PROOF = ['3% fee, fixed in the contract', 'No monthly fee', 'Open source on Basescan'];

export function HeroSection() {
    return (
        <main className="relative overflow-hidden pt-40 sm:pt-32 lg:pt-32">
            <div className="absolute left-1/2 top-0 -z-10 h-[520px] w-[1000px] -translate-x-1/2 rounded-full bg-[rgba(192,24,144,0.06)] blur-[120px]" />

            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-8 lg:min-h-[600px] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 lg:pb-8">
                {/* Left: message and capture */}
                <div className="flex min-w-0 flex-col items-start">
                    <div className="brand-sticker mb-6 inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em]">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand-pink)] opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand-pink)]" />
                        </span>
                        <span><span className="hidden sm:inline">Private beta</span><span className="sm:hidden">Beta</span> on Base · Mainnet Dec 8</span>
                    </div>

                    <h1 className="mb-5 text-[2.4rem] font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[4rem]">
                        Get paid <span className="text-brand-gradient">the second</span> you make the sale.
                    </h1>

                    <p className="mb-7 max-w-xl text-lg leading-relaxed text-muted-foreground lg:text-xl">
                        Sell digital products from a store you own. Buyers pay in USDC. You keep 97%, settled onchain. No monthly fee.
                    </p>

                    <HeroWaitlist />

                    <a
                        href="#how-it-works"
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-foreground underline-offset-4 hover:text-primary hover:underline"
                    >
                        See how it works <ArrowRight className="h-4 w-4" />
                    </a>

                    <ul className="mt-7 hidden flex-wrap gap-x-6 gap-y-2 sm:flex">
                        {PROOF.map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right: proof of the split */}
                <CheckoutCard />
            </div>

            {/* Trust bar */}
            <div className="brand-scanlines h-[3px] w-full" aria-hidden="true" />
            <div className="border-b border-border bg-slate-50/70">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 py-4 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    <span>Built on Base</span>
                    <span aria-hidden="true">·</span>
                    <span>Settles in USDC</span>
                    <span aria-hidden="true">·</span>
                    <a href={CONTRACT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-[var(--brand-magenta)]">
                        Contract on Basescan <ExternalLink className="h-3 w-3" />
                    </a>
                    <span aria-hidden="true">·</span>
                    <a href={FOUNDER_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-[var(--brand-magenta)]">
                        Built by Tyler Malin <ExternalLink className="h-3 w-3" />
                    </a>
                </div>
            </div>
        </main>
    );
}
