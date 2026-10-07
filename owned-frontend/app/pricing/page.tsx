'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { AuthButton } from '@/components/AuthButton';

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

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Beta status bar */}
            <div className="bg-slate-900 text-white text-center text-[11px] md:text-xs font-bold px-6 py-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                <span className="uppercase tracking-[0.25em] text-primary">Private Beta</span>
                <span className="text-slate-300">OWNED is in private beta on Base Sepolia testnet. Mainnet launch: December 8, 2026.</span>
                <Link href="/register" className="underline underline-offset-4 decoration-primary/60 hover:text-primary transition-colors">Join the waitlist</Link>
            </div>

            {/* Header */}
            <header className="bg-white/80 border-b border-border sticky top-0 z-50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-[10px] flex justify-between items-center">
                    <Link href="/" className="py-2">
                        <img src="/assets/logo.png" alt="OWNED" className="w-[120px] h-[120px] object-contain" />
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/products" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Marketplace</Link>
                        <Link href="/pricing" className="text-sm font-bold uppercase tracking-widest text-primary">Pricing</Link>
                        <AuthButton />
                    </nav>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-24 space-y-32">
                {/* Hero */}
                <div className="text-center space-y-6">
                    <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-primary/10">
                        One fee
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black tracking-tight text-foreground">
                        One fee. <span className="text-primary italic">Only when you sell.</span>
                    </h1>
                    <p className="text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed italic">
                        OWNED takes 3% of each sale. The contract enforces it. No monthly plan, no setup fee, no upgrade wall.
                    </p>
                </div>

                {/* Tiers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Creator */}
                    <div className="relative flex flex-col glass rounded-[3.5rem] bg-white/80 ring-2 ring-primary p-12 shadow-saas">
                        <div className="mb-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">For Creators</p>
                            <h2 className="text-5xl font-black tracking-tight text-foreground">Creator</h2>
                            <p className="mt-4 text-xl font-bold text-foreground">
                                $0 to start. <span className="text-primary italic">3% per sale.</span>
                            </p>
                        </div>

                        <div className="flex-1 space-y-6">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] border-b border-border pb-6">At launch:</p>
                            <ul className="space-y-5">
                                {creatorIncludes.map((item, i) => (
                                    <li key={i} className="flex gap-4 text-sm font-medium text-foreground">
                                        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                            <Check className="w-3.5 h-3.5 text-primary" strokeWidth={4} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Link
                            href="/register"
                            className="mt-12 block w-full py-8 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs text-center transition-all hover:scale-[1.03] active:scale-[0.97] shadow-saas bg-slate-900 text-white shadow-slate-900/20"
                        >
                            Join the waitlist
                        </Link>
                    </div>

                    {/* Organizations */}
                    <div className="relative flex flex-col glass rounded-[3.5rem] bg-white/60 p-12 shadow-saas">
                        <div className="mb-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">For Organizations</p>
                            <h2 className="text-5xl font-black tracking-tight text-foreground">Organizations</h2>
                            <p className="mt-4 text-xl font-bold text-foreground italic">Custom.</p>
                        </div>

                        <div className="flex-1">
                            <p className="text-lg text-muted-foreground font-medium leading-relaxed italic">
                                Running several stores, or need terms we don't offer yet? Tell us what you're building.
                            </p>
                        </div>

                        <Link
                            href="/contact"
                            className="mt-12 block w-full py-8 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs text-center transition-all hover:scale-[1.03] active:scale-[0.97] shadow-saas bg-white/50 border border-border text-foreground hover:bg-white"
                        >
                            Contact us
                        </Link>
                    </div>
                </div>

                {/* How the 3% works */}
                <div className="space-y-12">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight italic text-center">How the 3% works</h2>
                    <ol className="max-w-3xl mx-auto space-y-6">
                        {howItWorks.map((step, i) => (
                            <li key={i} className="flex gap-6 items-start bg-white rounded-[2rem] border border-border p-8 shadow-saas">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-black">{i + 1}</div>
                                <p className="text-lg font-medium text-foreground leading-relaxed">{step}</p>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Roadmap */}
                <div className="bg-white rounded-[4rem] border border-border shadow-saas p-16 md:p-24 text-center space-y-8">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight italic">On the roadmap, not yet live</h2>
                    <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                        {roadmap.join(' · ')}
                    </p>
                </div>

                {/* Straight answers */}
                <div className="space-y-12">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight italic text-center">Straight answers</h2>
                    <div className="max-w-3xl mx-auto space-y-6">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-white rounded-[2rem] border border-border p-8 shadow-saas space-y-3">
                                <h3 className="text-lg font-black text-foreground">{faq.q}</h3>
                                <p className="text-base text-muted-foreground font-medium leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-20 border-t border-border bg-white mt-20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-sm text-muted-foreground font-medium">© 2026 OWNED · IT</p>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <Link href="/pricing" className="hover:text-primary transition-colors text-primary">Pricing</Link>
                        <Link href="https://x.com/owneditxyz" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Twitter</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
