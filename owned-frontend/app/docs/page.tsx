'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import {
    BookOpen, Download, Package, Clock, Users, TrendingUp, Tag, Share2, Layers,
    Star, Shield, ShoppingBag, Library, Settings, ChevronRight, ExternalLink,
    Cpu, Globe, Database, Zap, ArrowRight, Lock, CheckCircle, AlertTriangle,
    FileText, BarChart3, Gift, HelpCircle
} from 'lucide-react';

const sections = [
    { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
    { id: 'account-onboarding', label: 'Account Onboarding', icon: Shield },
    { id: 'building-your-store', label: 'Building Your Store', icon: Settings },
    { id: 'product-types', label: 'Product Types', icon: Package },
    { id: 'revenue-mechanics', label: 'Revenue Mechanics', icon: TrendingUp },
    { id: 'coupons', label: 'Coupons & Discounts', icon: Tag },
    { id: 'affiliates', label: 'Affiliate Program', icon: Share2 },
    { id: 'bundles', label: 'Bundling', icon: Layers },
    { id: 'review-incentives', label: 'Review Incentives', icon: Star },
    { id: 'managing-products', label: 'Managing Products', icon: Settings },
    { id: 'for-buyers', label: 'For Buyers', icon: ShoppingBag },
    { id: 'admin', label: 'Admin & Governance', icon: Lock },
    { id: 'technical-appendix', label: 'Technical Appendix', icon: Cpu },
];

function useActiveSection(ids: string[]) {
    const [active, setActive] = useState(ids[0]);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id);
                        break;
                    }
                }
            },
            { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
        );
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [ids]);
    return active;
}

function SectionAnchor({ id }: { id: string }) {
    return <div id={id} className="-scroll-mt-32 scroll-mt-32 absolute" style={{ marginTop: '-8rem' }} />;
}

function SectionHeader({ icon: Icon, label, badge }: { icon: any; label: string; badge?: string }) {
    return (
        <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
                {badge && <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-1">{badge}</div>}
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">{label}</h2>
            </div>
        </div>
    );
}

function InfoBlock({ type, children }: { type: 'tip' | 'warning' | 'info'; children: React.ReactNode }) {
    const styles = {
        tip: { bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle, iconColor: 'text-emerald-600', label: 'Pro Tip' },
        warning: { bg: 'bg-amber-50 border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-600', label: 'Important' },
        info: { bg: 'bg-blue-50 border-blue-200', icon: HelpCircle, iconColor: 'text-blue-600', label: 'Note' },
    }[type];
    const Icon = styles.icon;
    return (
        <div className={`p-6 rounded-2xl border ${styles.bg} flex gap-4 my-6`}>
            <Icon className={`w-5 h-5 ${styles.iconColor} shrink-0 mt-0.5`} />
            <div>
                <div className={`text-[9px] font-black uppercase tracking-[0.3em] ${styles.iconColor} mb-1`}>{styles.label}</div>
                <div className="text-sm font-medium text-foreground leading-relaxed">{children}</div>
            </div>
        </div>
    );
}

function StepCard({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
    return (
        <div className="flex gap-6 p-8 bg-white rounded-3xl border border-border shadow-sm mb-4">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0">{number}</div>
            <div>
                <h4 className="font-black text-lg text-foreground mb-2">{title}</h4>
                <div className="text-sm text-muted-foreground font-medium leading-relaxed">{children}</div>
            </div>
        </div>
    );
}

function ProductTypeCard({ icon: Icon, color, title, useCase, mechanic, decisions }: {
    icon: any; color: string; title: string; useCase: string; mechanic: string[]; decisions: { q: string; a: string }[];
}) {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-white rounded-[2.5rem] border border-border shadow-saas overflow-hidden mb-6">
            <button
                onClick={() => setOpen(!open)}
                className="w-full p-10 text-left flex items-center gap-6 hover:bg-slate-50/50 transition-colors"
            >
                <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shrink-0`}>
                    <Icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                    <h3 className="text-2xl font-black text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground font-medium mt-1">{useCase}</p>
                </div>
                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${open ? 'rotate-90' : ''}`} />
            </button>
            {open && (
                <div className="px-10 pb-10 space-y-8 border-t border-border/50">
                    <div className="pt-8">
                        <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-4">How It Works</div>
                        <ol className="space-y-3">
                            {mechanic.map((step, i) => (
                                <li key={i} className="flex gap-4 text-sm font-medium text-foreground">
                                    <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-[10px] font-black shrink-0">{i + 1}</span>
                                    {step}
                                </li>
                            ))}
                        </ol>
                    </div>
                    {decisions.length > 0 && (
                        <div>
                            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-4">Key Decisions</div>
                            <div className="space-y-4">
                                {decisions.map((d, i) => (
                                    <div key={i} className="bg-slate-50 rounded-2xl p-6">
                                        <div className="font-bold text-sm text-foreground mb-2">{d.q}</div>
                                        <div className="text-sm text-muted-foreground font-medium leading-relaxed">{d.a}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-border my-6">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-slate-50 border-b border-border">
                        {headers.map((h, i) => (
                            <th key={i} className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className={`border-b border-border/50 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                            {row.map((cell, j) => (
                                <td key={j} className="px-6 py-4 font-medium text-foreground">{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function DocsPage() {
    const activeSection = useActiveSection(sections.map(s => s.id));

    return (
        <div className="min-h-screen bg-background">
            <Nav />

            {/* Hero */}
            <div className="relative pt-40 pb-20 overflow-hidden border-b border-border bg-gradient-to-b from-slate-50/80 to-white">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />
                <div className="max-w-7xl mx-auto px-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-primary/10">
                        <BookOpen className="w-3 h-3" />
                        Sovereign Commerce User Guide
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-6 leading-[0.9]">
                        Build Your Store.<br />
                        <span className="text-primary italic font-serif">Sell Anywhere.</span><br />
                        Own Everything.
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed mb-10">
                        The complete protocol reference for creators running sovereign commerce on Base. Base Network · Protocol-Integrated Commerce.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {['Base Network', 'USDC Settlement', 'IPFS Storage', 'Smart Contracts'].map(tag => (
                            <span key={tag} className="px-4 py-2 bg-white border border-border rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground shadow-sm">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex gap-16 items-start">

                    {/* Sticky Sidebar TOC */}
                    <aside className="hidden xl:block w-72 shrink-0 sticky top-28 self-start">
                        <div className="bg-white border border-border rounded-[2rem] shadow-saas overflow-hidden">
                            <div className="p-6 border-b border-border bg-slate-50/50">
                                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Contents</div>
                            </div>
                            <nav className="p-4">
                                {sections.map(({ id, label, icon: Icon }) => (
                                    <a
                                        key={id}
                                        href={`#${id}`}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[11px] font-bold uppercase tracking-wider mb-1 ${activeSection === id
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-slate-50'
                                            }`}
                                    >
                                        <Icon className="w-3.5 h-3.5 shrink-0" />
                                        {label}
                                    </a>
                                ))}
                            </nav>
                            <div className="p-6 border-t border-border bg-slate-50/50">
                                <Link href="/dashboard/deploy" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                                    Deploy Your Store <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0 space-y-24">

                        {/* ─── Getting Started ─── */}
                        <section>
                            <div id="getting-started" className="scroll-mt-32" />
                            <SectionHeader icon={BookOpen} label="Getting Started" badge="Introduction" />

                            <div className="prose-like space-y-6">
                                <p className="text-xl text-foreground font-bold tracking-tight">Why OWNED Matters: The Sovereignty Thesis</p>
                                <p className="text-base text-muted-foreground font-medium leading-relaxed">
                                    Traditional commerce platforms make you a tenant. Your store, customer data, and transaction history exist at the platform's discretion. One policy change, one payment processor's decision, one algorithm flag—and your business can disappear.
                                </p>
                                <p className="text-base text-muted-foreground font-medium leading-relaxed">
                                    OWNED inverts this. You operate on rails you control.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { icon: Zap, title: 'Instant Settlement', desc: 'Smart contracts execute settlement without intermediaries. USDC goes directly to your wallet.' },
                                        { icon: Database, title: 'Permanent Storage', desc: 'IPFS makes your media and metadata immutable and uncensorable. It exists independent of any platform.' },
                                        { icon: Shield, title: 'Non-Custodial', desc: 'OWNED never holds your funds. Your private keys are yours. No holds, no freezes, no review periods.' },
                                        { icon: Globe, title: 'Portable Reputation', desc: 'Community reputation lives on-chain and is portable across platforms. You own your history.' },
                                    ].map(({ icon: Icon, title, desc }) => (
                                        <div key={title} className="bg-white p-8 rounded-3xl border border-border shadow-sm">
                                            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                                <Icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <h4 className="font-black text-foreground mb-2">{title}</h4>
                                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">{desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* ─── Account Onboarding ─── */}
                        <section>
                            <div id="account-onboarding" className="scroll-mt-32" />
                            <SectionHeader icon={Shield} label="Account Onboarding" badge="Step-by-Step" />

                            <p className="text-base text-muted-foreground font-medium leading-relaxed mb-8">
                                Getting started takes under 2 minutes. No crypto experience required.
                            </p>

                            <div className="space-y-4 mb-10">
                                <StepCard number="1" title="Non-Custodial Magic Link Sign In">
                                    Navigate to the OWNED website and click <strong>Sign In</strong>. Enter your email address. You'll receive a magic link—click it to log in. No password required. OWNED generates a unique wallet address on Base for you automatically.
                                </StepCard>
                                <StepCard number="2" title="Fund Your Wallet">
                                    OWNED runs on Base (mainnet) or Base Sepolia (testnet). You need <strong>ETH</strong> for gas (~$0.01 per transaction on Base) and <strong>USDC</strong> for payments. Use a bridge like Uniswap or Stargate to move USDC from Ethereum to Base.
                                </StepCard>
                                <StepCard number="3" title="You're Ready to Sell">
                                    Your store exists the moment you sign in. Your wallet address is your store's on-chain identifier. Navigate to the Dashboard to create your first product.
                                </StepCard>
                            </div>

                            <InfoBlock type="warning">
                                <strong>You own your keys.</strong> OWNED never holds your private keys. Your wallet address is permanently yours. You can export your keys or connect an external wallet (MetaMask, Coinbase Wallet) at any time without asking permission.
                            </InfoBlock>

                            <div className="bg-slate-900 text-white rounded-3xl p-8 mt-8">
                                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-4">Testnet vs. Mainnet</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="font-bold mb-3 text-slate-300 text-sm">🧪 Testnet (Base Sepolia)</div>
                                        <ul className="space-y-2 text-sm text-slate-400 font-medium">
                                            <li>• Get Sepolia ETH from Alchemy/Infura faucet (free)</li>
                                            <li>• Use test USDC (mint via the interface)</li>
                                            <li>• Safe to experiment — no real funds</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="font-bold mb-3 text-slate-300 text-sm">🚀 Mainnet (Base)</div>
                                        <ul className="space-y-2 text-sm text-slate-400 font-medium">
                                            <li>• Bridge USDC from Ethereum to Base via Uniswap</li>
                                            <li>• Hold a small amount of ETH for gas</li>
                                            <li>• Base gas is cheap — typically &lt;$0.01 per transaction</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ─── Building Your Store ─── */}
                        <section>
                            <div id="building-your-store" className="scroll-mt-32" />
                            <SectionHeader icon={Settings} label="Building Your Store" badge="Core Concepts" />

                            <p className="text-base text-muted-foreground font-medium leading-relaxed mb-8">
                                Your store doesn't need to be "created" — it emerges from your wallet. Your address is your store's on-chain identifier, giving you permanence that no platform can revoke.
                            </p>

                            <InfoBlock type="info">
                                No one can delete your store. The smart contract is immutable on Base. Your products are pinned to IPFS. Payment settlement is final and cannot be reversed without your explicit approval.
                            </InfoBlock>

                            <div className="mt-8">
                                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-6">Store Branding Setup</div>
                                <div className="space-y-3">
                                    {[
                                        { step: 'Dashboard → Store Settings', action: 'Navigate to your profile/store settings panel' },
                                        { step: 'Store Name', action: 'Your brand name — publicly visible and stored on-chain' },
                                        { step: 'Store Description', action: 'Mission statement stored on IPFS, pinned to your contract metadata' },
                                        { step: 'Logo / Banner', action: 'Upload an image — immediately pinned to IPFS' },
                                        { step: 'Social Links', action: 'Twitter, Discord, and other profiles appear on your public store' },
                                    ].map(({ step, action }) => (
                                        <div key={step} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-border">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-lg shrink-0 mt-0.5">{step}</div>
                                            <p className="text-sm font-medium text-muted-foreground">{action}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* ─── Product Types ─── */}
                        <section>
                            <div id="product-types" className="scroll-mt-32" />
                            <SectionHeader icon={Package} label="Product Types & Setup" badge="4 Core Types" />

                            <p className="text-base text-muted-foreground font-medium leading-relaxed mb-8">
                                OWNED supports four core product types. Each has different delivery mechanics, metadata, and settlement patterns. Expand each to see how it works.
                            </p>

                            <ProductTypeCard
                                icon={Download}
                                color="bg-blue-500/10 text-blue-600"
                                title="Digital Downloads"
                                useCase="Ebooks, courses, templates, software, design files, research datasets"
                                mechanic={[
                                    'Upload your file — OWNED compresses and pins it to IPFS',
                                    'Create a product record with metadata (title, description, cover image, price)',
                                    'Buyer purchases with USDC — contract verifies payment and marks them as owner',
                                    'Buyer downloads the file instantly via IPFS link in their Library',
                                    'USDC hits your wallet. Transaction recorded on Base. Done.',
                                ]}
                                decisions={[
                                    { q: 'File Size Limits', a: 'OWNED supports up to 100 MB. For larger assets, consider splitting them or linking to external storage in the product description.' },
                                    { q: 'Resale Rights', a: 'Set the Transferable flag in product settings. If enabled, buyers can resell the product and you earn a commission % on resales.' },
                                    { q: 'Versioning', a: 'To update a file (e.g., new ebook edition), edit the product and re-upload. Don\'t delete and recreate — that breaks links for existing buyers.' },
                                ]}
                            />
                            <ProductTypeCard
                                icon={Package}
                                color="bg-orange-500/10 text-orange-600"
                                title="Physical Merchandise"
                                useCase="T-shirts, books, hardware, art prints, or any tangible good requiring shipping"
                                mechanic={[
                                    'Create a product with SKU, weight, dimensions, and production cost',
                                    'Buyer purchases and provides shipping info at checkout',
                                    'Transaction records buyer\'s address on-chain (encrypted until you retrieve it)',
                                    'You receive USDC payment, ship the product, and mark it fulfilled in the dashboard',
                                    'Buyer can track the shipment and leave a review once received',
                                ]}
                                decisions={[
                                    { q: 'Shipping Pricing', a: 'Choose fixed (e.g., $10 flat), weight-based (calculated at checkout), or free shipping (absorbed into product price).' },
                                    { q: 'Inventory Management', a: 'Track stock in the dashboard. Set a Low Stock Alert threshold. OWNED doesn\'t auto-delist sold-out items — you control that.' },
                                    { q: 'Returns & Refunds', a: 'Set your return window (0–90 days). If a buyer initiates a return within the window, you have 7 days to approve. Approval triggers auto USDC refund.' },
                                ]}
                            />
                            <ProductTypeCard
                                icon={Clock}
                                color="bg-amber-500/10 text-amber-600"
                                title="Consulting / Time-Based Services"
                                useCase="1-on-1 coaching, strategy sessions, design reviews, or any time-sold service"
                                mechanic={[
                                    'Create a Time Slot product (e.g., "1 Hour Strategy Call," $200)',
                                    'Specify available slots — OWNED syncs with your calendar',
                                    'Buyer selects a time and pays USDC. Appointment is auto-confirmed',
                                    'Complete the session and mark it done in the dashboard',
                                    'USDC is released to your wallet upon completion',
                                ]}
                                decisions={[
                                    { q: 'Cancellation Policy', a: 'Set your cancellation window (e.g., 48 hours before). Buyer cancels within window = refund. You cancel = refund + $25 apology credit.' },
                                    { q: 'No-Show Policy', a: 'Recommended: no refund if buyer doesn\'t show after 10-minute grace period. They can reschedule for a rescheduling fee.' },
                                    { q: 'Group Sessions', a: 'Set a max capacity (e.g., 5 participants). Price lower per person — OWNED handles pro-rata splits for group discounts.' },
                                ]}
                            />
                            <ProductTypeCard
                                icon={Users}
                                color="bg-emerald-500/10 text-emerald-600"
                                title="Token-Gated Community / NFT Membership"
                                useCase="Exclusive Discord communities, private research access, or ongoing membership perks"
                                mechanic={[
                                    'Create a membership product with duration and perks (Discord role, private Notion, weekly calls)',
                                    'Buyer pays USDC — OWNED mints an NFT in their wallet as membership proof',
                                    'NFT authenticates access when buyer connects wallet to your Discord or Notion',
                                    'Time-limited NFTs expire at renewal date — buyer receives renewal reminder',
                                    'If transferable, buyer can sell their membership NFT (you earn resale commission)',
                                ]}
                                decisions={[
                                    { q: 'Membership Duration', a: 'Monthly (auto-renews), annual (one payment), or lifetime (one-time). Buyers approve auto-renewal USDC deduction at purchase.' },
                                    { q: 'Tier Structure', a: 'Offer multiple tiers (e.g., Bronze $10/mo, Silver $25/mo, Gold $100/mo) with different perk levels.' },
                                    { q: 'Resale Rights', a: 'If enabled, members can trade their membership NFT up or down in tier without your approval.' },
                                ]}
                            />
                        </section>

                        {/* ─── Revenue Mechanics ─── */}
                        <section>
                            <div id="revenue-mechanics" className="scroll-mt-32" />
                            <SectionHeader icon={TrendingUp} label="Revenue Mechanics" badge="Pricing & Growth" />

                            <p className="text-base text-muted-foreground font-medium leading-relaxed mb-8">
                                All prices are set in USDC — USD-pegged, no volatility adjustment required. Set once, holds forever.
                            </p>

                            <div className="bg-slate-900 text-white rounded-3xl p-8 mb-8">
                                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-6">USDC Decimal Reference</div>
                                <DataTable
                                    headers={['Display Price', 'USDC (6 decimals)', 'Notes']}
                                    rows={[
                                        ['$1.00', '1,000,000', 'Minimum practical price'],
                                        ['$9.99', '9,990,000', 'Subscription tier example'],
                                        ['$49.99', '49,990,000', 'Digital product sweet spot'],
                                        ['$297.00', '297,000,000', 'Deploy store fee'],
                                    ]}
                                />
                                <p className="text-xs text-slate-500 font-medium">USDC has 6 decimal places. The on-chain value is always the display price × 1,000,000.</p>
                            </div>

                            <InfoBlock type="tip">
                                On testnet, use low prices ($1–5) to test checkout flows safely. On mainnet, price for revenue. USDC is USD-pegged so your pricing is always stable.
                            </InfoBlock>
                        </section>

                        {/* ─── Coupons ─── */}
                        <section>
                            <div id="coupons" className="scroll-mt-32" />
                            <SectionHeader icon={Tag} label="Coupons & Discount Codes" badge="Growth Tool" />

                            <p className="text-base text-muted-foreground font-medium leading-relaxed mb-8">
                                Coupons are custom discount codes you create and distribute manually — ideal for early backers, email lists, or partnership deals.
                            </p>

                            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-4">Creating a Coupon</div>
                            <div className="space-y-3 mb-8">
                                {[
                                    'Dashboard → Products → Manage Coupons',
                                    'Click Create New Coupon',
                                    'Fill in code, discount %, applicable products, expiration, and max uses',
                                    'Click Create — OWNED generates the coupon with a shareable link',
                                    'Share the code (email, social, DM) — buyers enter it at checkout',
                                ].map((s, i) => (
                                    <div key={i} className="flex items-start gap-4 text-sm font-medium text-foreground p-4 bg-white border border-border rounded-2xl">
                                        <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black text-[10px] shrink-0">{i + 1}</span>
                                        {s}
                                    </div>
                                ))}
                            </div>

                            <DataTable
                                headers={['Field', 'Description']}
                                rows={[
                                    ['Coupon Code', 'Unique string (e.g., LAUNCH20, EARLYBIRD, BDAY50)'],
                                    ['Discount %', '0–100%. E.g., 20 = 20% off the price at checkout'],
                                    ['Applicable Products', 'All products, or select specific ones to target'],
                                    ['Expiration', 'Date/time the code expires (optional — leave blank for permanent)'],
                                    ['Max Uses', 'Cap redemptions (e.g., 50 uses max), or unlimited'],
                                ]}
                            />

                            <InfoBlock type="tip">
                                Create codes per channel to measure what's working: <strong>EMAIL_SUBSCRIBERS</strong> (15% off), <strong>TWITTER_FOLLOWERS</strong> (10%), <strong>PARTNER_REFERRAL</strong> (20%), <strong>EARLY_BIRD</strong> (30% — expires in 7 days).
                            </InfoBlock>
                        </section>

                        {/* ─── Affiliates ─── */}
                        <section>
                            <div id="affiliates" className="scroll-mt-32" />
                            <SectionHeader icon={Share2} label="Affiliate Program" badge="Distribution" />

                            <p className="text-base text-muted-foreground font-medium leading-relaxed mb-8">
                                OWNED's affiliate system turns your customers into salespeople. Anyone — influencer, complementary creator, or buyer — can promote and earn a commission on sales they drive.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white p-8 rounded-3xl border border-border shadow-sm space-y-4">
                                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Setup (Seller)</div>
                                    <ol className="space-y-3">
                                        {[
                                            'Dashboard → Products → [Product] → Affiliate Settings',
                                            'Set commission % (e.g., 20%)',
                                            'Choose: Open program (anyone joins) or Curated (you approve)',
                                            'Save — OWNED generates unique affiliate links per product',
                                        ].map((s, i) => (
                                            <li key={i} className="flex gap-3 text-sm font-medium text-foreground">
                                                <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black text-[9px] shrink-0">{i + 1}</span>
                                                {s}
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                                <div className="bg-white p-8 rounded-3xl border border-border shadow-sm space-y-4">
                                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">How Affiliates Join</div>
                                    <ol className="space-y-3">
                                        {[
                                            'Navigate to any product page on OWNED',
                                            'Click Become an Affiliate',
                                            'Open: instant affiliate code granted. Curated: pending approval',
                                            'Share the link: owned.app/product/[id]?affiliate=handle',
                                            'Any buyer via that link is attributed to them',
                                        ].map((s, i) => (
                                            <li key={i} className="flex gap-3 text-sm font-medium text-foreground">
                                                <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black text-[9px] shrink-0">{i + 1}</span>
                                                {s}
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>

                            <InfoBlock type="info">
                                Commissions are calculated on-chain. Every 7 days, OWNED aggregates sales per affiliate and deposits USDC directly to their wallet. You can also manually trigger payouts early from the Dashboard.
                            </InfoBlock>

                            <DataTable
                                headers={['Strategy', 'Commission', 'Best For']}
                                rows={[
                                    ['Open Program + High Commission', '25–30%', 'Max reach, enthusiastic promotion'],
                                    ['Curated Program + Standard', '15–20%', 'Quality partners, better support materials'],
                                    ['Tiered (performance-based)', '10% → 15% → 20%', 'Incentivize growth and sustained effort'],
                                ]}
                            />
                        </section>

                        {/* ─── Bundles ─── */}
                        <section>
                            <div id="bundles" className="scroll-mt-32" />
                            <SectionHeader icon={Layers} label="Bundling" badge="AOV Growth" />

                            <p className="text-base text-muted-foreground font-medium leading-relaxed mb-8">
                                Bundles package multiple products at a discounted price — increasing average order value by 20–40% and simplifying buying decisions.
                            </p>

                            <div className="bg-slate-900 text-white rounded-3xl p-8 mb-8">
                                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-4">Example Bundle</div>
                                <div className="space-y-2 mb-6">
                                    {[
                                        ['Product A — Digital Guide', '$50'],
                                        ['Product B — Strategy Session', '$30'],
                                        ['Product C — Community Access', '$20'],
                                    ].map(([name, price]) => (
                                        <div key={name} className="flex justify-between py-2 border-b border-white/10 text-sm">
                                            <span className="text-slate-300 font-medium">{name}</span>
                                            <span className="text-white font-black">{price}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between py-3 text-sm font-medium text-slate-400">
                                        <span>Total individual</span><span>$100</span>
                                    </div>
                                    <div className="flex justify-between py-3 text-sm font-black">
                                        <span className="text-primary">Bundle price</span><span className="text-primary">$70 (30% savings)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-4">Creating a Bundle</div>
                            <div className="space-y-3 mb-8">
                                {[
                                    'Dashboard → Products → Create Bundle',
                                    'Name the bundle (e.g., "Ultimate Creator Toolkit")',
                                    'Select products to include — OWNED auto-calculates discount %',
                                    'Set optional expiration date and affiliate commission',
                                    'Publish — the bundle appears in your store and the marketplace',
                                ].map((s, i) => (
                                    <div key={i} className="flex gap-4 text-sm font-medium text-foreground p-4 bg-white border border-border rounded-2xl items-start">
                                        <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black text-[10px] shrink-0">{i + 1}</span>
                                        {s}
                                    </div>
                                ))}
                            </div>

                            <InfoBlock type="tip">
                                Use bundles strategically: pair slow-moving inventory with bestsellers, create time-limited holiday bundles, or introduce new products by bundling them with proven ones.
                            </InfoBlock>
                        </section>

                        {/* ─── Review Incentives ─── */}
                        <section>
                            <div id="review-incentives" className="scroll-mt-32" />
                            <SectionHeader icon={Star} label="Reviewer Incentives" badge="Trust & Proof" />

                            <p className="text-base text-muted-foreground font-medium leading-relaxed mb-8">
                                Reviews are your most valuable marketing asset. OWNED makes it easy to incentivize high-quality feedback without hiding the incentive — the transparency is the asset.
                            </p>

                            <div className="bg-white rounded-3xl border border-border shadow-saas p-8 mb-8">
                                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-6">How Testimonial Incentives Work</div>
                                <ol className="space-y-4">
                                    {[
                                        'Dashboard → Products → [Product] → Review Incentives — enable and set a % (e.g., 20%)',
                                        'At checkout, buyer sees: "Get 20% off by writing a review within 7 days"',
                                        'Buyer chooses: pay full price now (no review needed), or commit to review for 20% discount',
                                        'If they opt in, their purchase is flagged on-chain as "review_pending"',
                                        'When they submit a review (1–5 stars + text), it publishes with a transparent "Incentivized (20%)" tag',
                                    ].map((s, i) => (
                                        <li key={i} className="flex gap-4 text-sm font-medium text-foreground">
                                            <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black text-[10px] shrink-0">{i + 1}</span>
                                            {s}
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            <InfoBlock type="info">
                                Traditional platforms hide or ban paid reviews. OWNED discloses the incentive on-chain. A buyer who received a discount and still leaves a glowing review is actually more credible signal than an anonymous 5-star.
                            </InfoBlock>

                            <DataTable
                                headers={['Situation', 'Recommended Incentive']}
                                rows={[
                                    ['New product — need initial social proof', '25–30%'],
                                    ['Established product — already has reviews', '10–15% or none'],
                                    ['Premium / high-ticket product', '5–10% (lower volume needed)'],
                                ]}
                            />
                        </section>

                        {/* ─── Managing Products ─── */}
                        <section>
                            <div id="managing-products" className="scroll-mt-32" />
                            <SectionHeader icon={Settings} label="Managing Your Store" badge="Edit · Archive · Delete" />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {[
                                    { title: 'Editing', icon: FileText, points: ['Dashboard → Products → Edit', 'Change title, description, images, price', 'Price changes apply to new purchases only', 'Edit affiliate %, review incentive %', 'Save — live on IPFS immediately'] },
                                    { title: 'Archiving', icon: Library, points: ['Product disappears from storefront', 'Remains on-chain (accessible via direct link)', 'Cannot accept new purchases', 'Fully reversible — unarchive any time', 'More → Archive in product detail'] },
                                    { title: 'Deleting', icon: AlertTriangle, points: ['Permanent — rarely needed', 'Removed from on-chain marketplace', 'Existing buyers keep IPFS access', 'No new purchases possible', 'More → Delete → Confirm'] },
                                ].map(({ title, icon: Icon, points }) => (
                                    <div key={title} className="bg-white p-8 rounded-3xl border border-border shadow-sm">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                                                <Icon className="w-4 h-4 text-primary" />
                                            </div>
                                            <h4 className="font-black text-lg text-foreground">{title}</h4>
                                        </div>
                                        <ul className="space-y-2">
                                            {points.map((p, i) => (
                                                <li key={i} className="text-sm font-medium text-muted-foreground flex gap-2">
                                                    <span className="text-primary mt-1">•</span>{p}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            <InfoBlock type="warning">
                                <strong>Only edit, don't replace.</strong> If you need to update a digital file, edit the existing product and re-upload. Deleting and recreating breaks all existing buyer download links.
                            </InfoBlock>
                        </section>

                        {/* ─── For Buyers ─── */}
                        <section>
                            <div id="for-buyers" className="scroll-mt-32" />
                            <SectionHeader icon={ShoppingBag} label="For Buyers: Ownership & Trust" badge="Buyer Guide" />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                {[
                                    { icon: FileText, title: 'The Example', desc: 'See the product in action — ebook preview, course demo, template screenshot.' },
                                    { icon: Cpu, title: 'The Build', desc: 'Understand the technology. What tools were used? What\'s the architecture?' },
                                    { icon: TrendingUp, title: 'The Growth Plan', desc: 'See how the creator plans to improve it. Future roadmap, iterations, value-adds.' },
                                ].map(({ icon: Icon, title, desc }) => (
                                    <div key={title} className="bg-white p-8 rounded-3xl border border-border shadow-sm">
                                        <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                            <Icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <h4 className="font-black text-foreground mb-2">{title}</h4>
                                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">{desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-4">Making a Purchase</div>
                            <div className="space-y-3 mb-8">
                                {[
                                    'Click Add to Cart or Buy Now on any product',
                                    'Enter a coupon code if you have one',
                                    'Review the incentive offer (if applicable): "Get 20% off by reviewing within 7 days" — opt in or skip',
                                    'For physical products, enter shipping info',
                                    'Approve the transaction in your wallet — Metamask, Coinbase Wallet, or Magic',
                                    'Payment finalized — you own the asset (IPFS file, NFT, or order receipt)',
                                ].map((s, i) => (
                                    <div key={i} className="flex gap-4 text-sm font-medium text-foreground p-4 bg-white border border-border rounded-2xl items-start">
                                        <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black text-[10px] shrink-0">{i + 1}</span>
                                        {s}
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white rounded-3xl border border-border shadow-saas p-8">
                                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-4">Community Sentiment & Review Badges</div>
                                <div className="space-y-4">
                                    {[
                                        { badge: '✅ Verified Purchase', desc: 'Green badge — reviewer actually bought the item on OWNED.' },
                                        { badge: '🏷️ Incentivized (X% discount)', desc: 'Reviewer received a discount for feedback. Disclosed transparently so you can weigh it accordingly.' },
                                        { badge: '⭐ Star Rating + Written Review', desc: '1–5 stars plus a comment. Creator can reply to address concerns or say thank you.' },
                                    ].map(({ badge, desc }) => (
                                        <div key={badge} className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
                                            <div className="font-black text-sm text-foreground shrink-0">{badge}</div>
                                            <p className="text-sm text-muted-foreground font-medium">{desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* ─── Admin ─── */}
                        <section>
                            <div id="admin" className="scroll-mt-32" />
                            <SectionHeader icon={Lock} label="Admin & Platform Governance" badge="Restricted Access" />

                            <InfoBlock type="warning">
                                The Admin Portal is restricted to OWNED founders and trusted platform stewards. It oversees marketplace health, moderation, and community growth.
                            </InfoBlock>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                {[
                                    {
                                        icon: BarChart3, title: 'Product Oversight',
                                        items: ['Feature top creations on the homepage', 'Hide products that violate platform guidelines', 'Flag sellers with patterns of refunds or chargebacks']
                                    },
                                    {
                                        icon: Users, title: 'Member Directory',
                                        items: ['View all registered accounts with wallet address', 'See social profiles linked and seller reputation', 'Review flagged accounts and restricted status']
                                    },
                                    {
                                        icon: Gift, title: 'Asset Gifting',
                                        items: ['Grant free access to premium courses for partners', 'Award prizes to top sellers or contributors', 'Seed memberships for influencers and beta testers']
                                    },
                                ].map(({ icon: Icon, title, items }) => (
                                    <div key={title} className="bg-white p-8 rounded-3xl border border-border shadow-sm">
                                        <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                            <Icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <h4 className="font-black text-foreground mb-4">{title}</h4>
                                        <ul className="space-y-2">
                                            {items.map((item, i) => (
                                                <li key={i} className="text-sm font-medium text-muted-foreground flex gap-2">
                                                    <span className="text-primary mt-1">•</span>{item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* ─── Technical Appendix ─── */}
                        <section>
                            <div id="technical-appendix" className="scroll-mt-32" />
                            <SectionHeader icon={Cpu} label="Technical Appendix" badge="Infrastructure" />

                            <DataTable
                                headers={['Component', 'Role & Details']}
                                rows={[
                                    ['Blockchain', 'Base (L2 Ethereum). Testnet: Base Sepolia. Mainnet: Base. All contracts, transactions, and reputation live here. Immutable and uncensorable.'],
                                    ['Settlement', 'USDC (ERC-20 stablecoin). Settles directly to your wallet. No holds, no freezes, no middleman.'],
                                    ['Storage', 'IPFS. All media, files, and metadata are pinned. Permanent, distributed, uncensorable.'],
                                    ['Smart Contract', 'CreatorStore.sol. Open-source, audited, transparent. Handles products, purchases, payments, and reputation.'],
                                ]}
                            />

                            <div className="mt-10 mb-6">
                                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-6">What Happens On-Chain</div>
                                <div className="space-y-4">
                                    {[
                                        { fn: 'Account Creation', code: '—', desc: 'When you sign in, your wallet address is linked to a CreatorStore contract on Base. Your address is the owner.' },
                                        { fn: 'Product Creation', code: 'createProduct()', desc: 'Metadata is hashed and stored on-chain. Media is pinned to IPFS; the IPFS hash is stored in the contract.' },
                                        { fn: 'Purchases', code: 'purchase()', desc: 'Contract verifies USDC payment, records the buyer\'s address, and mints a receipt NFT or entry.' },
                                        { fn: 'Payment Settlement', code: '—', desc: 'USDC transfers to your wallet immediately. No 7-day hold, no platform review.' },
                                        { fn: 'Reputation', code: '—', desc: 'Reviews are stored in your contract. Avg rating and count are publicly readable and tamper-proof.' },
                                    ].map(({ fn, code, desc }) => (
                                        <div key={fn} className="bg-white p-6 rounded-2xl border border-border flex flex-col sm:flex-row gap-4">
                                            <div className="sm:w-48 shrink-0">
                                                <div className="font-black text-sm text-foreground">{fn}</div>
                                                {code !== '—' && <code className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded mt-1 inline-block">{code}</code>}
                                            </div>
                                            <p className="text-sm font-medium text-muted-foreground leading-relaxed">{desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-900 text-white rounded-3xl p-8 mb-8">
                                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-6">Gas Costs on Base</div>
                                <DataTable
                                    headers={['Action', 'Estimated Cost', 'Comparison']}
                                    rows={[
                                        ['Create a product', '~$0.01–0.05', 'vs. Gumroad: 10% of every sale'],
                                        ['Make a purchase', '~$0.01–0.03', 'vs. Stripe: 2.9% + $0.30 per transaction'],
                                        ['Leave a review', '~$0.005–0.01', 'vs. Traditional: impossible to put on-chain'],
                                    ]}
                                />
                            </div>

                            <div className="bg-white rounded-3xl border border-border shadow-saas p-8">
                                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-6">Verifying Your Store On-Chain</div>
                                <div className="space-y-3">
                                    {[
                                        'Go to basescan.org (Base\'s block explorer)',
                                        'Paste your wallet address in the search bar',
                                        'Navigate to the "Contract" tab',
                                        'Every transaction, function call, and state change is visible — purchases, reviews, payouts, all of it',
                                    ].map((s, i) => (
                                        <div key={i} className="flex gap-4 text-sm font-medium text-foreground p-4 bg-slate-50 rounded-2xl">
                                            <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black text-[10px] shrink-0">{i + 1}</span>
                                            {s}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-6 border-t border-border">
                                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-4">Data Ownership & Export</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {[
                                            'Export transaction history (CSV) from the Dashboard',
                                            'Access your contract directly via Basescan or any blockchain indexer',
                                            'If OWNED shuts down tomorrow, your store continues to exist',
                                        ].map((item, i) => (
                                            <div key={i} className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-sm font-bold text-emerald-700">
                                                ✅ {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ─── Closing CTA ─── */}
                        <section className="bg-slate-900 text-white rounded-[3rem] p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                            <div className="relative text-center space-y-8">
                                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Build for Permanence</div>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic leading-tight">
                                    Ready to Stop Renting<br />Your Business?
                                </h2>
                                <p className="text-xl text-slate-400 font-medium italic max-w-2xl mx-auto leading-relaxed">
                                    Every tool in this guide — coupons, affiliates, bundles, incentives — is wired into one thesis: your business should outlast any single platform.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                    <Link href="/dashboard/deploy" className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-glow hover:scale-105 transition-all flex items-center gap-3 justify-center">
                                        Deploy Your Store <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <Link href="/products" className="px-10 py-5 bg-white/10 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm border border-white/10 hover:bg-white/20 transition-all flex items-center gap-3 justify-center">
                                        Browse Marketplace
                                    </Link>
                                </div>
                                <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">Build once. Own everything. © 2026 OWNED · IT</p>
                            </div>
                        </section>

                    </main>
                </div>
            </div>
        </div>
    );
}
