'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/site/PageHeader';
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
        <>
            <PageHeader
                eyebrow="Private Beta"
                title="How OWNED works"
                accent="(beta)"
                lede="OWNED is in private beta on Base Sepolia testnet. Mainnet launch: December 8, 2026. This page describes what works today. Everything else is on the roadmap below."
                actions={
                    <Link href="/register" className="btn-brand inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-xs font-black uppercase tracking-[0.12em]">
                        Join the waitlist
                    </Link>
                }
            />

            <div className="mx-auto max-w-3xl space-y-16 px-6 pb-16 md:space-y-20 md:pb-20">
                {/* What works today */}
                <section className="space-y-8">
                    <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">What works today</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {worksToday.map((item, i) => (
                            <div key={i} className="space-y-4 rounded-3xl border border-border bg-white p-6 md:p-8 card-lift">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-black tracking-tight">{item.title}</h3>
                                <p className="text-sm font-medium leading-relaxed text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* How money moves today */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">How money moves today</h2>
                    <p className="text-lg font-medium leading-relaxed text-muted-foreground">
                        During the beta, sales settle into a single OWNED-operated contract. Sellers are onboarded by hand and paid out from it. At launch, each creator gets their own store contract, and only the creator&apos;s wallet can withdraw from it.
                    </p>
                </section>

                {/* Testing on Base Sepolia */}
                <section className="space-y-8">
                    <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">Testing on Base Sepolia</h2>
                    <ol className="space-y-4">
                        {testingSteps.map((step, i) => (
                            <li key={i} className="flex items-start gap-5 rounded-3xl border border-border bg-white p-6">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-black text-primary">{i + 1}</div>
                                <p className="pt-1 text-base font-medium leading-relaxed text-foreground">{step}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* Coming at launch */}
                <section className="space-y-8">
                    <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">Coming at launch</h2>
                    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {comingAtLaunch.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 rounded-3xl border border-border bg-white p-6 text-base font-medium text-foreground">
                                <span className="font-black text-primary">→</span> {item}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* On the roadmap */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">On the roadmap</h2>
                    <p className="text-lg font-medium leading-relaxed text-muted-foreground">
                        {roadmap.join(' · ')}
                    </p>
                </section>

                {/* Contract */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">Contract</h2>
                    <div className="space-y-4 rounded-3xl border border-border bg-white p-6 md:p-8">
                        <p className="text-base font-medium leading-relaxed text-muted-foreground">
                            CreatorStore.sol on Base Sepolia at{' '}
                            <Link href={CONTRACT_URL} target="_blank" rel="noopener noreferrer" className="link-draw break-all pb-0.5 font-bold text-primary hover:text-foreground">
                                0x2CfE…01BD
                            </Link>
                            . Open source and unaudited. An independent review happens before mainnet.
                        </p>
                        <Link
                            href={CONTRACT_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-draw inline-flex items-center gap-2 pb-0.5 text-xs font-black uppercase tracking-widest text-primary hover:text-foreground"
                        >
                            View on Basescan <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
