'use client';

import { useProduct } from '@/lib/hooks';
import { formatUSDC } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { getIPFSGatewayUrl, ProductMetadata } from '@/lib/ipfs';

import { DEMO_METADATA } from '@/lib/demo';
import { FormattedDescription } from '@/components/FormattedDescription';
import {
    Download,
    Ticket,
    Bot,
    Video,
    Music,
    Users,
    ExternalLink,
    CheckCircle2,
    Calendar,
    Globe,
    LayoutDashboard,
    Package
} from 'lucide-react';

interface ProductCardProps {
    productId: number;
}

export function ProductCard({ productId }: ProductCardProps) {
    const { data: product, isLoading: isContractLoading, error } = useProduct(productId);
    const [metadata, setMetadata] = useState<ProductMetadata | null>(null);
    const [isMetadataLoading, setIsMetadataLoading] = useState(false);

    useEffect(() => {
        if (DEMO_METADATA[productId]) {
            setMetadata(DEMO_METADATA[productId]);
            return;
        }

        if (product && (product as any).ipfsHash) {
            const fetchMetadata = async () => {
                setIsMetadataLoading(true);
                try {
                    const url = getIPFSGatewayUrl((product as any).ipfsHash);
                    const res = await fetch(url);
                    if (res.ok) {
                        const data = await res.json();
                        setMetadata(data);
                    }
                } catch (err) {
                    console.error('Metadata fetch error:', err);
                } finally {
                    setIsMetadataLoading(false);
                }
            };
            fetchMetadata();
        }
    }, [product]);

    // For demo purposes, if it's a demo product ID, we show it even without contract data
    const isDemoProduct = productId >= 1 && productId <= 7;

    if (isContractLoading || isMetadataLoading) {
        return (
            <div className="rounded-3xl border border-border bg-white p-6 animate-pulse space-y-4">
                <div className="aspect-video rounded-2xl bg-slate-100"></div>
                <div className="h-8 rounded-full bg-slate-100 w-3/4"></div>
                <div className="h-4 rounded-full bg-slate-100 w-1/2"></div>
            </div>
        );
    }

    if ((error || !product || !(product as any).active) && !isDemoProduct) {
        return null;
    }

    // Use contract data if available, otherwise use demo defaults
    const demoData = DEMO_METADATA[productId];
    const price = product ? (product as any).price : (demoData?.price ? BigInt(Math.round(parseFloat(demoData.price) * 1000000)) : BigInt(0));
    const maxSupply = product ? (product as any).maxSupply : BigInt(0);
    const sold = product ? (product as any).sold : BigInt(0);
    const title = metadata?.name || `Product #${productId}`;
    const subtitle = metadata?.subtitle;
    const availability = BigInt(maxSupply) > BigInt(0) ? `${sold.toString()}/${maxSupply.toString()} sold` : `${sold.toString()} sold`;
    const image = metadata?.image ? getIPFSGatewayUrl(metadata.image.replace('ipfs://', '')) : null;
    const style = metadata?.thumbnailStyle || 'button';
    const displayImage = metadata?.image?.startsWith('/') ? metadata.image : image;
    const productType = metadata?.productType || 'digital';

    const getCategoryIcon = () => {
        switch (productType.toLowerCase()) {
            case 'digital':
            case 'content':
                return <Download className="w-3.5 h-3.5" />;
            case 'ticket':
            case 'event':
                return <Ticket className="w-3.5 h-3.5" />;
            case 'agent':
            case 'ai':
                return <Bot className="w-3.5 h-3.5" />;
            case 'video':
                return <Video className="w-3.5 h-3.5" />;
            case 'music':
            case 'audio':
                return <Music className="w-3.5 h-3.5" />;
            case 'coaching':
            case 'mentorship':
            case 'consulting':
                return <Users className="w-3.5 h-3.5" />;
            default:
                return <Download className="w-3.5 h-3.5" />;
        }
    };

    const getCategoryLabel = () => {
        switch (productType.toLowerCase()) {
            case 'digital': return 'Digital Download';
            case 'ticket': return 'Event Ticket';
            case 'agent': return 'AI Agent';
            case 'coaching': return '1:1 Session';
            case 'music': return 'Original Audio';
            default: return productType.charAt(0).toUpperCase() + productType.slice(1);
        }
    };

    if (style === 'callout') {
        return (
            <Link
                href={`/products/${productId}/checkout`}
                className="group relative bg-white rounded-3xl overflow-hidden flex flex-col min-h-[420px] border border-border card-lift"
            >
                {image ? (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={displayImage || ''}
                            alt={title}
                            className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                    </div>
                ) : (
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 to-transparent" />
                )}

                <div className="relative flex-1 p-10 flex flex-col justify-center items-center text-center space-y-6 z-10">
                    <div className="space-y-3">
                        {subtitle && (
                            <p className="brand-sticker rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] inline-block">
                                {subtitle}
                            </p>
                        )}
                        <h3 className="text-3xl font-black tracking-tight text-foreground lg:text-4xl">
                            {title}
                        </h3>
                        <div className="flex items-center justify-center gap-1.5 pt-2">
                            <span className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                {getCategoryIcon()}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {getCategoryLabel()}
                            </span>
                        </div>
                        {metadata?.affiliateEnabled && (
                            <div className="flex items-center justify-center gap-1.5 mt-3">
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                    <Globe className="w-3 h-3" />
                                    {metadata.affiliatePercent}% Affiliate
                                </span>
                            </div>
                        )}
                        {metadata?.productType === 'bundle' && (
                            <div className="flex items-center justify-center gap-1.5 mt-2">
                                <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                    <Package className="w-3 h-3" />
                                    Product Bundle
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <div className="btn-brand rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em]">
                            {metadata?.callToAction || 'View Details'}
                        </div>
                    </div>
                </div>

                <div className="relative p-6 md:p-8 flex justify-between items-center bg-muted/50 backdrop-blur-sm border-t border-border z-10 transition-colors group-hover:bg-muted">
                    <div className="flex items-center gap-4">
                        <p className="text-3xl font-black tracking-tight text-foreground">
                            {formatUSDC(price)}
                        </p>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            {availability}
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-50">
                        #{productId}
                    </span>
                </div>
            </Link>
        );
    }

    return (
        <Link
            href={`/products/${productId}/checkout`}
            className="group bg-white border border-border rounded-3xl p-6 card-lift flex flex-col"
        >
            <div className="space-y-6 flex-1">
                {image && (
                    <div className="aspect-[4/3] bg-muted rounded-2xl overflow-hidden border border-border relative">
                        <img
                            src={displayImage || ''}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <div className="absolute top-3 right-3 text-[10px] font-bold bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-muted-foreground shadow-sm">
                            #{productId}
                        </div>
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm border border-border/50">
                            <span className="text-primary">{getCategoryIcon()}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {getCategoryLabel()}
                            </span>
                        </div>
                        {metadata?.affiliateEnabled && (
                            <div className="absolute bottom-3 right-3 px-2 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                                <Globe className="w-2.5 h-2.5" />
                                {metadata.affiliatePercent}% Affiliate
                            </div>
                        )}
                        {metadata?.productType === 'bundle' && (
                            <div className="absolute bottom-3 left-3 brand-sticker px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1">
                                <Package className="w-2.5 h-2.5" />
                                Bundle
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                        {subtitle && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                                {subtitle}
                            </span>
                        )}
                        <h3 className="text-2xl font-black tracking-tight text-foreground transition-colors group-hover:text-primary leading-tight">
                            {title}
                        </h3>
                    </div>
                    <FormattedDescription text={metadata?.description || 'No description provided.'} variant="card" />
                </div>

                <div className="flex items-center justify-between pt-6 mt-auto border-t border-border/50">
                    <div className="flex flex-col">
                        <p className="text-2xl font-black tracking-tight text-foreground">
                            {formatUSDC(price)}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            {availability}
                        </p>
                    </div>
                    <div className="btn-secondary rounded-xl px-5 h-10 inline-flex items-center justify-center text-xs font-black uppercase tracking-[0.12em]">
                        View
                    </div>
                </div>
            </div>
        </Link>
    );
}
