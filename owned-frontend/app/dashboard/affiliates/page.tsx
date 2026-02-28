'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { useMagic } from '@/components/MagicProvider';
import {
    getAffiliateSales,
    getAffiliateEarnings,
    getAffiliateSaleCount,
    generateAffiliateLink,
    AffiliateSale
} from '@/lib/affiliateTracker';
import { useAllProducts, useProduct } from '@/lib/hooks';
import { getIPFSGatewayUrl, ProductMetadata } from '@/lib/ipfs';
import { formatUSDC } from '@/lib/utils';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
    Link as LinkIcon,
    DollarSign,
    TrendingUp,
    Users,
    Globe,
    Copy,
    ChevronRight,
    ExternalLink
} from 'lucide-react';

export default function AffiliatesPage() {
    const { user: magicUser } = useMagic();
    const effectiveAddress = magicUser?.publicAddress;

    const [sales, setSales] = useState<AffiliateSale[]>([]);
    const [earnings, setEarnings] = useState(0);
    const [saleCount, setSaleCount] = useState(0);

    useEffect(() => {
        if (effectiveAddress) {
            setSales(getAffiliateSales(effectiveAddress));
            setEarnings(getAffiliateEarnings(effectiveAddress));
            setSaleCount(getAffiliateSaleCount(effectiveAddress));
        }
    }, [effectiveAddress]);

    return (
        <DashboardLayout>
            <div className="space-y-10">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Affiliate Program</h1>
                    <p className="text-lg text-muted-foreground font-medium">
                        Promote creators and earn commissions on every sale.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-border p-8 rounded-4xl shadow-sm space-y-2">
                        <div className="flex items-center gap-3 text-emerald-500 mb-2">
                            <div className="p-2 bg-emerald-50 rounded-xl">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Total Earnings</span>
                        </div>
                        <p className="text-4xl font-black italic tracking-tighter">{earnings.toFixed(2)} USDC</p>
                    </div>

                    <div className="bg-white border border-border p-8 rounded-4xl shadow-sm space-y-2">
                        <div className="flex items-center gap-3 text-blue-500 mb-2">
                            <div className="p-2 bg-blue-50 rounded-xl">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Referral Sales</span>
                        </div>
                        <p className="text-4xl font-black italic tracking-tighter">{saleCount}</p>
                    </div>

                    <div className="bg-white border border-border p-8 rounded-4xl shadow-sm space-y-2">
                        <div className="flex items-center gap-3 text-primary mb-2">
                            <div className="p-2 bg-primary/5 rounded-xl">
                                <Globe className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Active Links</span>
                        </div>
                        <p className="text-4xl font-black italic tracking-tighter">
                            {/* We could track actively visited links here */}
                            {Array.from(new Set(sales.map(s => s.productId))).length}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Marketplace to Promote */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold tracking-tight">Available to Promote</h2>
                            <Link href="/products" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                                View Marketplace <ExternalLink className="w-3 h-3" />
                            </Link>
                        </div>
                        <AffiliateMarketplace effectiveAddress={effectiveAddress || ''} />
                    </div>

                    {/* Recent Sales Table */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold tracking-tight">Recent Commissions</h2>
                        <div className="bg-white border border-border rounded-4xl shadow-sm overflow-hidden">
                            {sales.length > 0 ? (
                                <div className="divide-y divide-border">
                                    {sales.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10).map((sale) => (
                                        <div key={sale.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold">{sale.productName || `Product #${sale.productId}`}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                                    {new Date(sale.timestamp).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-emerald-600">+{sale.commission.toFixed(2)} USDC</p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                                    {sale.commissionPercent}% Commission
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center space-y-3">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium italic">No affiliate sales yet. Start promoting products to earn!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function AffiliateMarketplace({ effectiveAddress }: { effectiveAddress: string }) {
    const { productIds, isLoading } = useAllProducts();

    if (isLoading) {
        return <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-50 rounded-3xl animate-pulse" />)}
        </div>;
    }

    return (
        <div className="space-y-4">
            {productIds.map(id => (
                <AffiliateProductCard key={id} productId={id} effectiveAddress={effectiveAddress} />
            ))}
        </div>
    );
}

function AffiliateProductCard({ productId, effectiveAddress }: { productId: number, effectiveAddress: string }) {
    const { data: product, isLoading: isContractLoading } = useProduct(productId);
    const [metadata, setMetadata] = useState<ProductMetadata | null>(null);
    const [isMetadataLoading, setIsMetadataLoading] = useState(false);

    useEffect(() => {
        if (product && (product as any).ipfsHash) {
            const fetchMetadata = async () => {
                setIsMetadataLoading(true);
                try {
                    const url = getIPFSGatewayUrl((product as any).ipfsHash);
                    const res = await fetch(url);
                    if (res.ok) {
                        setMetadata(await res.json());
                    }
                } finally {
                    setIsMetadataLoading(false);
                }
            };
            fetchMetadata();
        }
    }, [product]);

    if (isContractLoading || isMetadataLoading) return null;
    if (!metadata || !metadata.affiliateEnabled) return null;

    const affiliateLink = generateAffiliateLink(productId, effectiveAddress);

    const copyLink = () => {
        navigator.clipboard.writeText(affiliateLink);
        toast.success('Affiliate link copied!');
    };

    return (
        <div className="bg-white border border-border p-6 rounded-3xl shadow-sm hover:shadow-saas transition-all flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-border/50">
                {metadata.image ? (
                    <img src={getIPFSGatewayUrl(metadata.image.replace('ipfs://', ''))} className="w-full h-full object-cover" alt="" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary italic font-bold">#{productId}</div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold truncate">{metadata.name}</h3>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-md border border-emerald-100">
                        {metadata.affiliatePercent}% EARN
                    </span>
                </div>
                <p className="text-xs text-muted-foreground truncate opacity-70 mb-2">{metadata.subtitle || 'Promote this product'}</p>
                <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-50 rounded-lg px-3 py-1.5 flex items-center gap-2 border border-border/50">
                        <LinkIcon className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] font-mono text-muted-foreground truncate w-full">{affiliateLink}</span>
                    </div>
                    <button
                        onClick={copyLink}
                        className="p-2 bg-primary text-primary-foreground rounded-lg hover:scale-105 transition-transform"
                        title="Copy Affiliate Link"
                    >
                        <Copy className="w-3.5 h-3.5" />
                    </button>
                    <Link
                        href={`/products/${productId}/checkout`}
                        target="_blank"
                        className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                        title="View Product"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
