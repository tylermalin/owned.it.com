'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { PageHeader } from '@/components/site/PageHeader';

const creatorIncludes = [
    'Your own store contract on Base, deployed in one click',
    'USDC checkout for buyers, with card onramp',
    'An onchain receipt (ERC-721) for every purchase',
    'Downloads and links unlocked only for buyers',
    'Dashboard for products, sales and payouts',
    'Withdraw to your wallet anytime. Only your wallet can.',
];

const howItWorks = [
    'A buyer pays in USDC.',
    'Your store contract splits the payment at purchase: 97% to your balance, 3% to OWNED.',
    'Your balance stays in your contract until you withdraw it. OWNED cannot touch it.',
    "The fee is fixed when your store is created. We can't raise it on you later.",
];

const roadmap = [
    'Recurring memberships',
    'Discord and community gating',
    'Analytics export',
    'Multi-store teams',
    'White-label storefronts',
];

const faqs = [
    {
        q: 'Is the contract audited?',
        a: 'Not yet. An independent review happens before mainnet, and products are capped at $500 each until a full audit is done.',
    },
    {
        q: 'What happens if OWNED disappears?',
        a: 'Your store contract stays on Base. You can still withdraw your balance directly onchain.',
    },
    {
        q: 'Do buyers need crypto?',
        a: 'They need USDC on Base. At launch, buyers can get it with a card during checkout.',
    },
];

const btn = 'rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em]';

export default function PricingPage() {
    return (
        <>
            <PageHeader
                eyebrow="Pricing"
                title="One fee."
                accent="Only when you sell."
                lede="OWNED takes 3% of each sale. The contract enforces it. No monthly plan, no setup fee, no upgrade wall."
                align="center"
            />

            <div className="mx-auto max-w-6xl px-6 pb-16 md:pb-20">
                {/* Tiers */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Creator */}
                    <div className="brand-card brand-card-hover relative flex flex-col overflow-hidden rounded-[2rem] bg-white">
                        <div className="brand-scanlines h-2.5" aria-hidden="true" />
                        <div className="flex flex-1 flex-col p-6 md:p-10">
                            <div className="mb-8">
                                <p className="eyebrow mb-3 text-primary">For Creators</p>
                                <h2 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">Creator</h2>
                                <p className="mt-4 text-xl font-bold text-foreground">
                                    $0 to start. <span className="text-primary">3% per sale.</span>
                                </p>
                            </div>

                            <div className="flex-1 space-y-6">
                                <p className="border-b border-border pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">At launch:</p>
                                <ul className="space-y-4">
                                    {creatorIncludes.map((item, i) => (
                                        <li key={i} className="flex gap-4 text-sm font-medium text-foreground">
                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                <Check className="h-3.5 w-3.5 text-primary" strokeWidth={4} />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link href="/register" className={`btn-brand mt-10 w-full ${btn}`}>
                                Join the waitlist
                            </Link>
                        </div>
                    </div>

                    {/* Organizations */}
                    <div className="relative flex flex-col rounded-3xl border border-border bg-white p-6 md:p-10 card-lift">
                        <div className="mb-8">
                            <p className="eyebrow mb-3 text-primary">For Organizations</p>
                            <h2 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">Organizations</h2>
                            <p className="mt-4 text-xl font-bold text-foreground">Custom.</p>
                        </div>

                        <div className="flex-1">
                            <p className="text-lg font-medium leading-relaxed text-muted-foreground">
                                Running several stores, or need terms we don&apos;t offer yet? Tell us what you&apos;re building.
                            </p>
                        </div>

                        <Link href="/contact" className={`btn-secondary mt-10 w-full ${btn}`}>
                            Contact us
                        </Link>
                    </div>
                </div>

                {/* How the 3% works */}
                <section className="py-16 md:py-20">
                    <h2 className="mb-10 text-center text-3xl font-black tracking-tight text-foreground md:text-4xl">
                        How the <span className="text-brand-gradient">3%</span> works
                    </h2>
                    <ol className="mx-auto max-w-3xl space-y-4">
                        {howItWorks.map((step, i) => (
                            <li key={i} className="flex items-start gap-5 rounded-3xl border border-border bg-white p-6 md:p-8 card-lift">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-black text-primary">{i + 1}</div>
                                <p className="text-lg font-medium leading-relaxed text-foreground">{step}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* Roadmap */}
                <section className="space-y-6 rounded-3xl border border-border bg-white p-6 text-center md:p-12">
                    <p className="eyebrow">Roadmap</p>
                    <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">On the roadmap, not yet live</h2>
                    <p className="text-xl font-medium leading-relaxed text-muted-foreground">{roadmap.join(' · ')}</p>
                </section>

                {/* Straight answers */}
                <section className="pt-16 md:pt-20">
                    <h2 className="mb-10 text-center text-3xl font-black tracking-tight text-foreground md:text-4xl">Straight answers</h2>
                    <div className="mx-auto max-w-3xl space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="space-y-3 rounded-3xl border border-border bg-white p-6 md:p-8">
                                <h3 className="text-lg font-black text-foreground">{faq.q}</h3>
                                <p className="text-base font-medium leading-relaxed text-muted-foreground">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
