'use client';

import { useProduct } from '@/lib/hooks';
import { formatUSDC } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { getIPFSGatewayUrl, ProductMetadata } from '@/lib/ipfs';

import { DEMO_METADATA } from '@/lib/demo';

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

    if (isContractLoading || isMetadataLoading) {
        return (
            <div className="border border-neutral-200 dark:border-neutral-800 p-6 animate-pulse space-y-4">
                <div className="aspect-video bg-neutral-200 dark:bg-neutral-800"></div>
                <div className="h-8 bg-neutral-200 dark:bg-neutral-800 w-3/4"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 w-1/2"></div>
            </div>
        );
    }

    if (error || !product || !(product as any).active) {
        return null;
    }

    const { price, maxSupply, sold } = product as any;
    const title = metadata?.name || `Product #${productId}`;
    const subtitle = metadata?.subtitle;
    const availability = BigInt(maxSupply) > BigInt(0) ? `${sold.toString()}/${maxSupply.toString()} sold` : `${sold.toString()} sold`;
    const image = metadata?.image ? getIPFSGatewayUrl(metadata.image.replace('ipfs://', '')) : null;
    const style = metadata?.thumbnailStyle || 'button';
    const displayImage = metadata?.image?.startsWith('/') ? metadata.image : image;

    if (style === 'callout') {
        return (
            <Link
                href={`/products/${productId}/checkout`}
                className="group relative bg-white dark:bg-slate-900 rounded-4xl overflow-hidden flex flex-col min-h-[420px] shadow-saas hover:shadow-saas-lg hover:scale-[1.02] transition-all border border-border"
            >
                {image ? (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={displayImage || ''}
                            alt={title}
                            className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-700 scale-100 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                    </div>
                ) : (
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 to-transparent" />
                )}

                <div className="relative flex-1 p-10 flex flex-col justify-center items-center text-center space-y-6 z-10">
                    <div className="space-y-3">
                        {subtitle && (
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block">
                                {subtitle}
                            </p>
                        )}
                        <h3 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
                            {title}
                        </h3>
                    </div>

                    <div className="pt-4">
                        <div className="inline-block px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-bold uppercase tracking-widest text-sm shadow-saas transition-transform group-hover:scale-105">
                            {metadata?.callToAction || 'View Details'}
                        </div>
                    </div>
                </div>

                <div className="relative p-8 flex justify-between items-center bg-muted/50 dark:bg-slate-800/50 backdrop-blur-sm border-t border-border z-10 transition-colors group-hover:bg-muted">
                    <div className="flex items-center gap-4">
                        <p className="text-3xl font-black text-foreground italic">
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
            className="group bg-white dark:bg-slate-900 border border-border rounded-4xl p-6 shadow-sm hover:shadow-saas hover:border-primary/30 transition-all flex flex-col"
        >
            <div className="space-y-6 flex-1">
                {image && (
                    <div className="aspect-[4/3] bg-muted rounded-2xl overflow-hidden border border-border relative">
                        <img
                            src={displayImage || ''}
                            alt={title}
                            className="w-full h-full object-cover transition-all duration-500 scale-100 group-hover:scale-105"
                        />
                        <div className="absolute top-3 right-3 text-[10px] font-bold bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-muted-foreground shadow-sm">
                            #{productId}
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                        {subtitle && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                                {subtitle}
                            </span>
                        )}
                        <h3 className="text-2xl font-bold text-foreground transition-colors group-hover:text-primary leading-tight">
                            {title}
                        </h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 font-medium">
                        {metadata?.description || 'No description provided.'}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-6 mt-auto border-t border-border/50">
                    <div className="flex flex-col">
                        <p className="text-2xl font-black text-foreground italic">
                            {formatUSDC(price)}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            {availability}
                        </p>
                    </div>
                    <div className="px-5 py-2.5 bg-muted group-hover:bg-primary group-hover:text-primary-foreground text-foreground rounded-xl text-xs font-bold transition-all shadow-sm">
                        View
                    </div>
                </div>
            </div>
        </Link>
    );
}
