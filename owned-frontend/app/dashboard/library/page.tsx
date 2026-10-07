'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { usePurchasedItems } from '@/lib/hooks';
import { getIPFSGatewayUrl, ProductMetadata } from '@/lib/ipfs';
import { useState, useEffect } from 'react';
import { DEMO_METADATA } from '@/lib/demo';
import {
    Package,
    Download,
    ExternalLink,
    ShieldCheck,
    Clock,
    ChevronRight,
    Search,
    Star
} from 'lucide-react';
import Link from 'next/link';
import { AssetDetails } from '@/components/AssetDetails';

export default function LibraryPage() {
    const { data: assets, isLoading } = usePurchasedItems();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAsset, setSelectedAsset] = useState<{ asset: any, metadata: any } | null>(null);

    const filteredAssets = assets?.filter(asset => {
        const metadata = (asset.id >= 1 && asset.id <= 6) ? DEMO_METADATA[asset.id] : null; // Basic check, will be better with actual metadata
        // Since we don't have metadata yet here, we'll just filter by ID or placeholder
        return asset.id.toString().includes(searchTerm);
    });

    return (
        <DashboardLayout>
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight">Your Library</h1>
                        <p className="text-sm md:text-base text-muted-foreground font-medium">
                            Access all your digital assets and memberships in one place.
                        </p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <label htmlFor="library-search" className="sr-only">Search your assets</label>
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            id="library-search"
                            type="text"
                            placeholder="Search your assets..."
                            className="h-12 w-full rounded-xl border border-border bg-white pl-12 pr-4 text-base font-medium placeholder:text-muted-foreground/50 focus:border-[var(--brand-magenta)] focus:outline-none focus:ring-2 focus:ring-[rgba(192,24,144,0.25)]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white border border-border rounded-3xl p-6 space-y-6 animate-pulse">
                                <div className="aspect-square bg-slate-100 rounded-3xl" />
                                <div className="space-y-3">
                                    <div className="h-6 bg-slate-100 rounded-xl w-3/4" />
                                    <div className="h-4 bg-slate-100 rounded-xl w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredAssets?.length === 0 ? (
                    <div className="rounded-3xl border border-border bg-white p-8 md:p-16 text-center space-y-6">
                        <div className="p-6 bg-slate-50 text-slate-400 w-fit mx-auto rounded-full">
                            <Package className="w-16 h-16" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black tracking-tight">Your library is empty</h2>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                You haven't purchased any items yet. Explore the marketplace to find something amazing.
                            </p>
                        </div>
                        <Link
                            href="/products"
                            className="btn-brand rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em]"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAssets?.map((asset) => (
                            <AssetCard
                                key={asset.id}
                                asset={asset}
                                onSelect={(metadata) => setSelectedAsset({ asset, metadata })}
                            />
                        ))}
                    </div>
                )}
            </div>

            {selectedAsset && (
                <AssetDetails
                    isOpen={!!selectedAsset}
                    onClose={() => setSelectedAsset(null)}
                    asset={selectedAsset.asset}
                    metadata={selectedAsset.metadata}
                />
            )}
        </DashboardLayout>
    );
}

function AssetCard({ asset, onSelect }: { asset: any, onSelect: (metadata: any) => void }) {
    const [metadata, setMetadata] = useState<ProductMetadata | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (DEMO_METADATA[asset.id]) {
            setMetadata(DEMO_METADATA[asset.id]);
            setIsLoading(false);
            return;
        }

        const fetchMeta = async () => {
            try {
                const url = getIPFSGatewayUrl(asset.ipfsHash);
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    setMetadata(data);
                }
            } catch (e) {
                console.error('Meta fetch failed', e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMeta();
    }, [asset.id, asset.ipfsHash]);

    if (isLoading) return <div className="bg-white border border-border rounded-3xl aspect-square animate-pulse" />;

    const title = metadata?.name || `Asset #${asset.id}`;
    const image = metadata?.image ? getIPFSGatewayUrl(metadata.image.replace('ipfs://', '')) : null;
    const displayImage = metadata?.image?.startsWith('/') ? metadata.image : image;

    return (
        <div className="bg-white border border-border rounded-3xl overflow-hidden group card-lift flex flex-col">
            <div className="relative aspect-square overflow-hidden border-b border-border bg-slate-50">
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Package className="w-20 h-20" />
                    </div>
                )}

                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Verified On Base
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-2">
                    <h3 className="text-xl font-black tracking-tight line-clamp-1">{title}</h3>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        Purchase ID: {asset.id}
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => onSelect(metadata)}
                        className="btn-brand rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em] w-full"
                    >
                        VIEW DETAILS
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    {metadata?.redirectUrl ? (
                        <a
                            href={metadata.redirectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-100 transition-all border border-border"
                        >
                            <ExternalLink className="w-3 h-3" />
                            Direct Access
                        </a>
                    ) : metadata?.digitalFileHash ? (
                        <a
                            href={getIPFSGatewayUrl(metadata.digitalFileHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-100 transition-all border border-border"
                        >
                            <Download className="w-3 h-3" />
                            Download
                        </a>
                    ) : null}

                    <Link
                        href={`/dashboard/library/${asset.id}/testimonial`}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-amber-50 text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-amber-100 transition-all border border-amber-200"
                    >
                        <Star className="w-3 h-3 fill-current" />
                        Rate & Review
                    </Link>
                </div>
            </div>
        </div>
    );
}
