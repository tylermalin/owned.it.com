'use client';

import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Mail, ShoppingBag, FileCheck, Percent, ExternalLink } from 'lucide-react';

const CONTRACT_ADDRESS = '0x2CfE077af112B9F6e6Ed39e327D3d31c840401BD';
const CONTRACT_URL = `https://sepolia.basescan.org/address/${CONTRACT_ADDRESS}`;

const worksToday = [
    { icon: Mail, title: 'Sign in with email', desc: 'A magic link creates a wallet on Base for you. No seed phrase.' },
    { icon: ShoppingBag, title: 'Buy with USDC', desc: 'Checkout uses USDC on Base Sepolia. You approve the payment, then confirm the purchase.' },
    { icon: FileCheck, title: 'Onchain receipt', desc: "Every purchase mints an ERC-721 token to the buyer's wallet as proof of purchase." },
    { icon: Percent, title: 'Fixed 3% fee', desc: 'The contract splits each sale 97% to the seller balance and 3% to OWNED.' },
];

const testingSteps = [
    'Sign in with your email.',
    'Get Sepolia ETH for gas from a public faucet.',
    "Get test USDC from Circle's faucet, on the Base Sepolia network.",
    'Buy a test product. Your receipt appears in your library.',
];

const comingAtLaunch = [
    'Your own store contract, created in one click',
    'Listing and editing your products',
    'Downloads unlocked only for buyers',
    'Payouts from your own contract to your wallet',
];

const roadmap = [
    'Coupons and signed discounts',
    'Affiliate payouts at purchase',
    'Bookings',
    'Memberships',
    'Bundles',
    'Verified reviews',
    'CSV export',
];

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Nav />

            <main className="max-w-4xl mx-auto px-6 pt-40 pb-32 space-y-24">
                {/* Beta notice */}
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 md:p-14 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="relative space-y-6">
                        <div className="inline-block px-4 py-1.5 bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
                            Private Beta
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight italic leading-none">How OWNED works <span className="text-primary">(beta)</span></h1>
                        <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
                            OWNED is in private beta on Base Sepolia testnet. Mainnet launch: December 8, 2026. This page describes what works today. Everything else is on the roadmap below.
                        </p>
                        <Link href="/register" className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all">
                            Join the waitlist
                        </Link>
                    </div>
                </div>

                {/* What works today */}
                <section className="space-y-10">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight italic">What works today</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {worksToday.map((item, i) => (
                            <div key={i} className="bg-white rounded-[2rem] border border-border p-8 shadow-saas space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black tracking-tight">{item.title}</h3>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* How money moves today */}
                <section className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight italic">How money moves today</h2>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                        During the beta, sales settle into a single OWNED-operated contract. Sellers are onboarded by hand and paid out from it. At launch, each creator gets their own store contract, and only the creator's wallet can withdraw from it.
                    </p>
                </section>

                {/* Testing on Base Sepolia */}
                <section className="space-y-10">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight italic">Testing on Base Sepolia</h2>
                    <ol className="space-y-5">
                        {testingSteps.map((step, i) => (
                            <li key={i} className="flex gap-5 items-start bg-white rounded-[1.5rem] border border-border p-6 shadow-saas">
                                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-black">{i + 1}</div>
                                <p className="text-base font-medium text-foreground leading-relaxed pt-1">{step}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* Coming at launch */}
                <section className="space-y-8">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight italic">Coming at launch</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {comingAtLaunch.map((item, i) => (
                            <li key={i} className="flex gap-3 items-start text-base font-medium text-foreground bg-white rounded-2xl border border-border p-6 shadow-saas">
                                <span className="text-primary font-black">→</span> {item}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* On the roadmap */}
                <section className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight italic">On the roadmap</h2>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                        {roadmap.join(' · ')}
                    </p>
                </section>

                {/* Contract */}
                <section className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight italic">Contract</h2>
                    <div className="bg-white rounded-[2rem] border border-border p-8 shadow-saas space-y-4">
                        <p className="text-base text-muted-foreground font-medium leading-relaxed">
                            CreatorStore.sol on Base Sepolia at{' '}
                            <Link href={CONTRACT_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline break-all">
                                0x2CfE…01BD
                            </Link>
                            . Open source and unaudited. An independent review happens before mainnet.
                        </p>
                        <Link
                            href={CONTRACT_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:underline"
                        >
                            View on Basescan <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="py-20 border-t border-border bg-white text-center">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-muted-foreground uppercase text-[10px] font-black tracking-widest">
                    <img src="/assets/logo.png" alt="OWNED" className="h-[100px] w-auto opacity-50" />
                    <div className="flex gap-8">
                        <Link href="/pricing">Pricing</Link>
                        <Link href="/terms">Terms</Link>
                    </div>
                    <p>© 2026 OWNED · IT</p>
                </div>
            </footer>
        </div>
    );
}
