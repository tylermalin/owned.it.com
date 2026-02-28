'use client';

import { useState, useEffect } from 'react';
import { Nav } from '@/components/Nav';
import { useMagic } from '@/components/MagicProvider';
import {
    APPROVED_PARTNERS,
    generatePartnerAffiliateLink,
    generateGuestAffiliateLink,
    type PartnerProduct
} from '@/lib/partnerProducts';
import {
    Copy,
    Check,
    Zap,
    Users,
    TrendingUp,
    Share2,
    ExternalLink,
    Gift,
    LinkIcon,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AffiliatePage() {
    const { user } = useMagic();
    const walletAddress = user?.publicAddress;

    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('all');

    const categories = ['all', ...Array.from(new Set(APPROVED_PARTNERS.map(p => p.category)))];

    const filteredPartners = filter === 'all'
        ? APPROVED_PARTNERS
        : APPROVED_PARTNERS.filter(p => p.category === filter);

    const copyLink = async (product: PartnerProduct) => {
        const link = walletAddress
            ? generatePartnerAffiliateLink(product.productId, walletAddress)
            : generateGuestAffiliateLink(product.productId);

        try {
            await navigator.clipboard.writeText(link);
            setCopiedId(product.id);
            toast.success('Affiliate link copied!');
            setTimeout(() => setCopiedId(null), 2500);
        } catch {
            toast.error('Could not copy link');
        }
    };

    const getLink = (product: PartnerProduct) => {
        return walletAddress
            ? generatePartnerAffiliateLink(product.productId, walletAddress)
            : generateGuestAffiliateLink(product.productId);
    };

    return (
        <div className="min-h-screen bg-[#fafaf9]">
            <Nav />

            {/* Hero */}
            <section className="pt-32 pb-16 px-6 max-w-5xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest">
                    <Zap className="w-3.5 h-3.5" />
                    Partner Store — Share & Earn
                </div>
                <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-slate-900">
                    Share Products.<br />Earn Crypto.
                </h1>
                <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                    Generate your personal affiliate link for any approved product below.
                    Share it anywhere. Earn USDC on every sale — no wallet required to start.
                </p>

                {/* Stats Row */}
                <div className="flex items-center justify-center gap-10 pt-4">
                    <div className="text-center">
                        <p className="text-3xl font-black text-slate-900">{APPROVED_PARTNERS.length}</p>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Products</p>
                    </div>
                    <div className="w-px h-10 bg-border" />
                    <div className="text-center">
                        <p className="text-3xl font-black text-slate-900">30 days</p>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Cookie window</p>
                    </div>
                    <div className="w-px h-10 bg-border" />
                    <div className="text-center">
                        <p className="text-3xl font-black text-slate-900">Instant</p>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">USDC payouts</p>
                    </div>
                </div>

                {!walletAddress && (
                    <div className="inline-flex items-center gap-3 px-6 py-4 bg-white border border-border rounded-2xl text-sm text-slate-600 font-medium shadow-sm">
                        <Gift className="w-5 h-5 text-primary" />
                        <span>Sign in with your wallet to track earnings — or share &amp; earn as a guest</span>
                    </div>
                )}
            </section>

            {/* How It Works */}
            <section className="py-12 px-6 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: <LinkIcon className="w-6 h-6" />, step: '1', title: 'Copy Your Link', desc: 'Click "Share & Earn" on any product to generate your unique affiliate link.' },
                        { icon: <Share2 className="w-6 h-6" />, step: '2', title: 'Share Anywhere', desc: 'Post it on X, LinkedIn, Discord, or anywhere your audience hangs out.' },
                        { icon: <TrendingUp className="w-6 h-6" />, step: '3', title: 'Earn USDC', desc: 'Every purchase made through your link within 30 days earns you a commission.' },
                    ].map(item => (
                        <div key={item.step} className="bg-white border border-border rounded-[2.5rem] p-8 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                    {item.icon}
                                </div>
                                <span className="text-4xl font-black text-slate-100">{item.step}.</span>
                            </div>
                            <h3 className="text-xl font-black tracking-tight">{item.title}</h3>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-12 px-6 max-w-5xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black tracking-tight">Approved Products</h2>
                    {/* Category filter */}
                    {categories.length > 1 && (
                        <div className="flex items-center gap-2 flex-wrap">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-primary text-primary-foreground shadow-saas' : 'bg-white border border-border text-muted-foreground hover:border-primary/30'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {filteredPartners.length === 0 ? (
                    <div className="py-24 text-center space-y-4">
                        <div className="text-6xl">🚀</div>
                        <h3 className="text-2xl font-black tracking-tight">Partner products coming soon</h3>
                        <p className="text-muted-foreground font-medium max-w-md mx-auto">
                            We're onboarding our first wave of approved creators. Check back soon — or{' '}
                            <Link href="/dashboard/deploy" className="text-primary font-bold hover:underline">
                                list your own product
                            </Link>
                            {' '}to become a partner.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredPartners.map(product => (
                            <PartnerCard
                                key={product.id}
                                product={product}
                                onCopy={() => copyLink(product)}
                                copied={copiedId === product.id}
                                link={getLink(product)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* CTA — become a partner */}
            <section className="py-20 px-6 max-w-4xl mx-auto">
                <div className="bg-slate-900 text-white rounded-[3.5rem] p-12 text-center space-y-6">
                    <div className="text-5xl">💎</div>
                    <h2 className="text-4xl font-black italic tracking-tighter">Want to list your product?</h2>
                    <p className="text-slate-400 font-medium max-w-lg mx-auto">
                        Deploy your own creator storefront on Base and get your products listed in our partner store — free.
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <Link
                            href="/dashboard/deploy"
                            className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-colors"
                        >
                            List Your Product
                        </Link>
                        <Link
                            href="/dashboard/affiliates"
                            className="px-8 py-4 border border-white/20 text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-colors"
                        >
                            View Earnings
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

function PartnerCard({ product, onCopy, copied, link }: {
    product: PartnerProduct;
    onCopy: () => void;
    copied: boolean;
    link: string;
}) {
    return (
        <div className="group bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:border-primary/10 transition-all flex flex-col">
            {/* Cover */}
            <div className="aspect-video bg-slate-50 relative overflow-hidden">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                        {product.category === 'digital' ? '📁' :
                            product.category === 'coaching' ? '🤙' :
                                product.category === 'course' ? '🎓' :
                                    product.category === 'membership' ? '👑' :
                                        product.category === 'community' ? '🤝' :
                                            product.category === 'webinar' ? '🎥' : '✨'}
                    </div>
                )}
                {product.badge && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest shadow-saas">
                        {product.badge}
                    </div>
                )}
                <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 font-black italic text-lg text-primary">
                    ${product.price}
                </div>
            </div>

            {/* Info */}
            <div className="p-8 flex-1 space-y-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {product.category}
                        </span>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            {product.commissionPercent}% commission
                        </span>
                    </div>
                    <h3 className="text-xl font-black italic tracking-tight group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium mt-1 leading-relaxed">{product.description}</p>
                </div>

                {/* Link preview */}
                <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3 overflow-hidden">
                    <LinkIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-xs text-slate-500 font-medium truncate">{link}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onCopy}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-primary'}`}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Share & Earn'}
                    </button>
                    <a
                        href={`/products/${product.productId}/checkout`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-slate-50 border border-border rounded-2xl flex items-center justify-center text-slate-600 hover:text-primary hover:border-primary/30 transition-all"
                    >
                        <ExternalLink className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </div>
    );
}
