'use client';

import Link from 'next/link';
import { Check, Minus } from 'lucide-react';
import { AuthButton } from '@/components/AuthButton';

const tiers = [
    {
        name: "Own It Once",
        subtitle: "Deploy + Own Forever",
        price: "$297",
        description: "one-time payment",
        bestFor: "Crypto-native creators & developers",
        includes: [
            "CreatorStore smart contract",
            "IPFS-hosted storefront bundle",
            "Native USDC payments on Base",
            "3% protocol fee (onchain)",
            "Access NFTs (ERC-721)"
        ],
        notIncluded: [
            "Dashboard editing",
            "Analytics UI",
            "Fulfillment tools",
            "Ongoing IPFS pinning guarantees"
        ],
        cta: "Deploy My Store",
        href: "/dashboard/deploy",
        microcopy: "Your store works forever. OWNED never owns it."
    },
    {
        name: "Pro Seller",
        subtitle: "Professional Tooling",
        price: "$9",
        description: "/ month + 3% per transaction",
        highlight: "Most creators choose this",
        bestFor: "Professional creators & sellers",
        includes: [
            "Everything in Own It Once",
            "Web dashboard (add/edit products)",
            "Sales & revenue analytics",
            "Discord + access integrations",
            "Product fulfillment tools",
            "IPFS pinning & hosting",
            "Tracking & conversion insights"
        ],
        cta: "Start as Pro Seller",
        href: "/register",
        microcopy: "Pay for tools. Not permission.",
        footerNote: "Fees capped at $109 / month"
    },
    {
        name: "Enterprise",
        subtitle: "OWNED Protocol, Your Brand",
        price: "Custom",
        description: "custom pricing",
        bestFor: "Funds, Media orgs, Large communities",
        includes: [
            "Multiple stores per org",
            "Team permissions",
            "Advanced analytics exports",
            "Custom fee routing",
            "Dedicated IPFS infra",
            "Optional white-label frontend",
            "Priority support"
        ],
        cta: "Talk to Us",
        href: "/contact",
        microcopy: "Infrastructure, not software."
    }
];

const features = [
    { name: "Store ownership", own: true, pro: true, ent: true },
    { name: "Smart contract", own: true, pro: true, ent: true },
    { name: "IPFS storefront", own: true, pro: true, ent: true },
    { name: "USDC on Base", own: true, pro: true, ent: true },
    { name: "Dashboard", own: false, pro: true, ent: true },
    { name: "Analytics", own: false, pro: true, ent: true },
    { name: "Fulfillment", own: false, pro: true, ent: true },
    { name: "Fee cap", own: true, pro: true, ent: "Custom" },
    { name: "White-label", own: false, pro: false, ent: true },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-slate-50/50">
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

            <main className="max-w-7xl mx-auto px-6 py-24">
                {/* Hero */}
                <div className="text-center space-y-6 mb-24">
                    <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-primary/10">
                        Ownership First
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black tracking-tight text-foreground">
                        Pricing that respects <span className="text-primary italic">ownership.</span>
                    </h1>
                    <p className="text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed italic">
                        Most platforms extract rent as you grow. We charge for tools, not permission.
                    </p>
                </div>

                {/* Decision Guidance */}
                <div className="mb-32 space-y-24">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight italic">Which Plan Should You Choose?</h2>
                        <p className="text-xl text-muted-foreground font-medium italic">Not sure which tier fits your business? Here's how to decide:</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="p-10 bg-white rounded-[3rem] border border-border shadow-saas space-y-6">
                            <div className="text-lg font-black text-foreground">Choose <span className="text-primary italic">"Own It Once"</span> if:</div>
                            <ul className="space-y-4">
                                {[
                                    "You're earning $0-5K/month and want to test sovereign commerce",
                                    "You're comfortable with smart contracts and onchain tools",
                                    "You want maximum ownership with minimal ongoing costs",
                                    "You can handle product setup without a dashboard"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3 text-sm font-medium text-foreground">
                                        <span className="text-primary">✅</span> {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-6 border-t border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Best for: Crypto-native creators, developers, technical founders</div>
                        </div>

                        <div className="p-10 bg-white rounded-[3rem] border border-primary shadow-saas scale-105 relative space-y-6">
                            <div className="absolute top-0 right-10 -translate-y-1/2 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-saas">Recommended</div>
                            <div className="text-lg font-black text-foreground">Choose <span className="text-primary italic">"Pro Seller"</span> if:</div>
                            <ul className="space-y-4">
                                {[
                                    "You're earning $5K-50K/month and want professional tooling",
                                    "You want a web dashboard to manage products easily",
                                    "You need analytics, fulfillment, and conversion insights",
                                    "You sell multiple products and want convenience"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3 text-sm font-medium text-foreground">
                                        <span className="text-primary">✅</span> {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-6 border-t border-border/50 text-[10px] font-black uppercase tracking-widest text-primary">Best for: Professional creators, course sellers, digital product businesses</div>
                        </div>

                        <div className="p-10 bg-white rounded-[3rem] border border-border shadow-saas space-y-6">
                            <div className="text-lg font-black text-foreground">Choose <span className="text-primary italic">"Enterprise"</span> if:</div>
                            <ul className="space-y-4">
                                {[
                                    "You're a fund, DAO, media org, or large community",
                                    "You need to manage multiple stores with team permissions",
                                    "You want white-label options and custom fee routing",
                                    "You require dedicated infrastructure and priority support"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3 text-sm font-medium text-foreground">
                                        <span className="text-primary">✅</span> {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-6 border-t border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Best for: Organizations, agencies, communities, investment groups</div>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-xl text-muted-foreground font-medium italic mb-6">Still not sure?</p>
                        <Link href="/contact" className="inline-block px-10 py-5 bg-foreground text-background rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-saas hover:scale-105 transition-all">Book a Strategy Session → ($297)</Link>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-4 italic">I'll tell you which tier fits your business model.</p>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-32">
                    {tiers.map((tier, idx) => (
                        <div
                            key={idx}
                            className={`relative flex flex-col glass rounded-[3.5rem] ${tier.highlight ? 'ring-2 ring-primary bg-white/90 scale-105 z-10' : 'bg-white/60'} p-12 shadow-saas hover:shadow-saas-lg transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] group`}
                        >
                            {tier.highlight && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-glow animate-pulse">
                                    {tier.highlight}
                                </div>
                            )}

                            <div className="mb-12 text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">{tier.subtitle}</p>
                                <h2 className="text-5xl font-black tracking-tight text-foreground">{tier.name}</h2>
                            </div>

                            <div className="mb-12 text-center">
                                <div className="flex items-baseline justify-center gap-2">
                                    <span className="text-6xl font-black italic tracking-tighter text-foreground">{tier.price}</span>
                                    <span className="text-sm font-bold text-muted-foreground text-left max-w-[120px] leading-tight uppercase tracking-widest">{tier.description}</span>
                                </div>
                                {tier.footerNote && <p className="text-[10px] font-black text-primary uppercase mt-4 tracking-[0.2em]">{tier.footerNote}</p>}
                            </div>

                            <div className="space-y-8 mb-16 flex-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] border-b border-border pb-6">
                                    Strategic for {tier.bestFor}
                                </p>
                                <ul className="space-y-5">
                                    {tier.includes.map((item, i) => (
                                        <li key={i} className="flex gap-4 text-sm font-medium text-foreground group/item">
                                            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover/item:bg-primary transition-colors duration-300">
                                                <Check className="w-3.5 h-3.5 text-primary group-hover/item:text-white transition-colors duration-300" strokeWidth={4} />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                    {tier.notIncluded?.map((item, i) => (
                                        <li key={i} className="flex gap-4 text-sm font-medium text-muted-foreground opacity-50">
                                            <Minus className="w-6 h-6 shrink-0 opacity-20" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-6 text-center">
                                <Link
                                    href={tier.href}
                                    className={`block w-full py-8 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs transition-all hover:scale-[1.05] active:scale-[0.95] shadow-saas ${tier.highlight ? 'bg-slate-900 text-white shadow-slate-900/20' : 'bg-white/50 border border-border text-foreground hover:bg-white'}`}
                                >
                                    {tier.cta}
                                </Link>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50 italic">{tier.microcopy}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Comparison Table */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black tracking-tight italic">Protocol Breakdown</h2>
                    </div>
                    <div className="bg-white rounded-[3rem] border border-border shadow-saas overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="p-8 text-left text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-border">Feature</th>
                                    <th className="p-8 text-center text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-border">Own It Once</th>
                                    <th className="p-8 text-center text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-border">Pro Seller</th>
                                    <th className="p-8 text-center text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-border">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody>
                                {features.map((feature, i) => (
                                    <tr key={i} className="group border-b border-border/50 last:border-0 hover:bg-slate-50/30 transition-colors">
                                        <td className="p-8 text-sm font-bold text-foreground">{feature.name}</td>
                                        <td className="p-8 text-center">
                                            {typeof feature.own === 'boolean' ? (
                                                feature.own ? <Check className="w-5 h-5 text-primary mx-auto" strokeWidth={3} /> : <Minus className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                                            ) : (
                                                <span className="text-xs font-bold text-primary uppercase">{feature.own}</span>
                                            )}
                                        </td>
                                        <td className="p-8 text-center">
                                            {typeof feature.pro === 'boolean' ? (
                                                feature.pro ? <Check className="w-5 h-5 text-primary mx-auto" strokeWidth={3} /> : <Minus className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                                            ) : (
                                                <span className="text-xs font-bold text-primary uppercase">{feature.pro}</span>
                                            )}
                                        </td>
                                        <td className="p-8 text-center">
                                            {typeof feature.ent === 'boolean' ? (
                                                feature.ent ? <Check className="w-5 h-5 text-primary mx-auto" strokeWidth={3} /> : <Minus className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                                            ) : (
                                                <span className="text-xs font-bold text-primary uppercase">{feature.ent}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Trust Section */}
                <div className="bg-white p-16 md:p-24 rounded-[4rem] border border-border shadow-saas text-center space-y-12 mb-32 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32" />

                    <div className="relative space-y-6">
                        <h2 className="text-5xl font-black tracking-tight">You Own <span className="text-primary">Your Contracts.</span></h2>
                        <p className="text-xl text-muted-foreground font-medium italic">Every store is a sovereign smart contract on Base.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Check className="w-6 h-6 text-primary" strokeWidth={3} />
                            </div>
                            <h3 className="text-xl font-bold">You own your contracts</h3>
                            <p className="text-sm text-muted-foreground font-medium">Your store isn't hosted on our servers. It's deployed to the blockchain. You control it.</p>
                        </div>
                        <div className="space-y-4 border-y md:border-y-0 md:border-x border-border/50 py-12 md:py-0">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Check className="w-6 h-6 text-primary" strokeWidth={3} />
                            </div>
                            <h3 className="text-xl font-bold">You control your funds</h3>
                            <p className="text-sm text-muted-foreground font-medium">Payments settle directly to your wallet in real-time. We never hold your money.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Check className="w-6 h-6 text-primary" strokeWidth={3} />
                            </div>
                            <h3 className="text-xl font-bold">You can leave anytime</h3>
                            <p className="text-sm text-muted-foreground font-medium">Sovereign infrastructure means no lock-in. Export your data anytime. Point your contract to a new interface.</p>
                        </div>
                    </div>

                    <div className="relative pt-8">
                        <div className="text-4xl font-black italic tracking-tighter text-foreground decoration-primary decoration-4 underline-offset-[12px] underline">
                            Stack ownership, not subscriptions.
                        </div>
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
