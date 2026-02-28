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
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold tracking-tight">Your Library</h1>
                        <p className="text-lg text-muted-foreground font-medium">
                            Access all your digital assets and memberships in one place.
                        </p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search your assets..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white border border-border rounded-4xl p-8 space-y-6 animate-pulse">
                                <div className="aspect-square bg-slate-100 rounded-3xl" />
                                <div className="space-y-3">
                                    <div className="h-6 bg-slate-100 rounded-xl w-3/4" />
                                    <div className="h-4 bg-slate-100 rounded-xl w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredAssets?.length === 0 ? (
                    <div className="bg-white border border-border rounded-4xl p-20 text-center space-y-8 shadow-sm">
                        <div className="p-6 bg-slate-50 text-slate-400 w-fit mx-auto rounded-full">
                            <Package className="w-16 h-16" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Your library is empty</h2>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                You haven't purchased any items yet. Explore the marketplace to find something amazing.
                            </p>
                        </div>
                        <Link
                            href="/products"
                            className="inline-block px-8 py-3 bg-primary text-primary-foreground font-bold rounded-2xl hover:scale-105 transition-all"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

    if (isLoading) return <div className="bg-white border border-border rounded-4xl aspect-square animate-pulse" />;

    const title = metadata?.name || `Asset #${asset.id}`;
    const image = metadata?.image ? getIPFSGatewayUrl(metadata.image.replace('ipfs://', '')) : null;
    const displayImage = metadata?.image?.startsWith('/') ? metadata.image : image;

    return (
        <div className="bg-white border border-border rounded-4xl overflow-hidden group hover:shadow-saas transition-all flex flex-col">
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

                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Verified On Base
                </div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-2">
                    <h3 className="text-xl font-bold tracking-tight line-clamp-1">{title}</h3>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                        Purchase ID: {asset.id}
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => onSelect(metadata)}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:gap-4 transition-all shadow-saas shadow-primary/10"
                    >
                        VIEW DETAILS
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    {metadata?.redirectUrl ? (
                        <a
                            href={metadata.redirectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-border"
                        >
                            <ExternalLink className="w-3 h-3" />
                            Direct Access
                        </a>
                    ) : metadata?.digitalFileHash ? (
                        <a
                            href={getIPFSGatewayUrl(metadata.digitalFileHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-border"
                        >
                            <Download className="w-3 h-3" />
                            Download
                        </a>
                    ) : null}

                    <Link
                        href={`/dashboard/library/${asset.id}/testimonial`}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-amber-50 text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all border border-amber-200"
                    >
                        <Star className="w-3 h-3 fill-current" />
                        Rate & Review
                    </Link>
                </div>
            </div>
        </div>
    );
}
