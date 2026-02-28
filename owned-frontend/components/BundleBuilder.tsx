'use client';

import { useState, useEffect } from 'react';
import { useAllProducts, useProduct } from '@/lib/hooks';
import { useAddProduct } from '@/lib/dashboardHooks';
import { useMagic } from '@/components/MagicProvider';
import { getIPFSGatewayUrl, uploadToIPFS, ProductMetadata } from '@/lib/ipfs';
import { formatUSDC } from '@/lib/utils';
import {
    Package,
    Plus,
    X,
    ShoppingBag,
    CheckCircle2,
    ChevronRight,
    AlertCircle,
    Copy,
    Rocket
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BundleBuilderProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

interface BundledItem {
    productId: number;
    metadata: ProductMetadata;
    creatorAddress: string;
    wholesalePrice: string;
}

export function BundleBuilder({ onSuccess, onCancel }: BundleBuilderProps) {
    const { productIds, isLoading: isIdsLoading } = useAllProducts();
    const { addProduct, isPending, isConfirming, isSuccess, error: addError } = useAddProduct();

    const [selectedItems, setSelectedItems] = useState<BundledItem[]>([]);
    const [bundleName, setBundleName] = useState('');
    const [bundleDescription, setBundleDescription] = useState('');
    const [bundlePrice, setBundlePrice] = useState('');
    const [productId, setProductId] = useState('');

    const [viewMode, setViewMode] = useState<'owned' | 'affiliate'>('owned');
    const { user } = useMagic();
    const [isUploading, setIsUploading] = useState(false);
    const [ipfsHash, setIpfsHash] = useState('');

    useEffect(() => {
        if (isSuccess) {
            toast.success('Bundle launched successfully!');
            if (onSuccess) onSuccess();
        }
    }, [isSuccess]);

    useEffect(() => {
        if (addError) {
            toast.error(addError.message || 'Failed to launch bundle');
        }
    }, [addError]);

    const addToBundle = (item: BundledItem) => {
        if (selectedItems.find(i => i.productId === item.productId)) {
            toast.error('Product already in bundle');
            return;
        }
        setSelectedItems([...selectedItems, item]);
        toast.success(`Added ${item.metadata.name}`);
    };

    const removeFromBundle = (productId: number) => {
        setSelectedItems(selectedItems.filter(i => i.productId !== productId));
    };

    const calculateTotalRetail = () => {
        return selectedItems.reduce((acc, item) => acc + parseFloat(item.metadata.price || '0'), 0);
    };

    const calculateTotalWholesale = () => {
        return selectedItems.reduce((acc, item) => acc + parseFloat(item.wholesalePrice || item.metadata.price || '0'), 0);
    };

    const handleLaunch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!bundleName || !bundleDescription || !bundlePrice || !productId) {
            toast.error('Please fill in all bundle details');
            return;
        }

        if (selectedItems.length < 2) {
            toast.error('A bundle must have at least 2 products');
            return;
        }

        setIsUploading(true);
        toast.loading('Launching Bundle...', { id: 'bundle-launch' });

        try {
            const metadata: ProductMetadata = {
                name: bundleName,
                description: bundleDescription,
                productType: 'bundle',
                price: bundlePrice,
                bundleItems: selectedItems.map(item => ({
                    productId: item.productId,
                    creatorAddress: item.creatorAddress,
                    affiliatePercent: item.metadata.affiliatePercent || 0
                })),
                attributes: [
                    { trait_type: 'Product Type', value: 'Bundle' },
                    { trait_type: 'Items Count', value: selectedItems.length.toString() },
                    { trait_type: 'Original Value', value: `$${calculateTotalRetail().toFixed(2)}` }
                ]
            };

            const hash = await uploadToIPFS(metadata);
            setIpfsHash(hash);

            addProduct(parseInt(productId), bundlePrice, hash, 0); // 0 = unlimited supply for bundles
            toast.success('Metadata secured on IPFS', { id: 'bundle-launch' });
        } catch (err: any) {
            toast.error(err.message || 'Failed to launch bundle', { id: 'bundle-launch' });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between border-b border-border pb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Bundle Builder</h2>
                        <p className="text-sm text-muted-foreground">Combine multiple products into a single curated offer.</p>
                    </div>
                </div>
                <button
                    onClick={onCancel}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Product Selector */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setViewMode('owned')}
                                className={`text-lg font-bold transition-all ${viewMode === 'owned' ? 'text-primary' : 'text-slate-400'}`}
                            >
                                Your Products
                            </button>
                            <button
                                onClick={() => setViewMode('affiliate')}
                                className={`text-lg font-bold transition-all ${viewMode === 'affiliate' ? 'text-primary' : 'text-slate-400'}`}
                            >
                                Marketplace
                            </button>
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            {viewMode === 'owned' ? 'Your Portfolio' : 'Bundling Enabled'}
                        </span>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {isIdsLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-50 rounded-3xl animate-pulse" />)}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {productIds.map(id => (
                                    <ProductSelectCard key={id} productId={id} onAdd={addToBundle} showAffiliates={viewMode === 'affiliate'} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Bundle Configuration */}
                <form onSubmit={handleLaunch} className="space-y-8 bg-slate-50/50 p-8 rounded-4xl border border-border/50">
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5" />
                            Your Selection ({selectedItems.length})
                        </h3>

                        <div className="space-y-3">
                            {selectedItems.length > 0 ? (
                                selectedItems.map(item => (
                                    <div key={item.productId} className="bg-white p-4 rounded-2xl border border-border flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex-shrink-0 overflow-hidden border border-border/50">
                                                {item.metadata.image && (
                                                    <img src={getIPFSGatewayUrl(item.metadata.image.replace('ipfs://', ''))} className="w-full h-full object-cover" alt="" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold truncate">{item.metadata.name}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase">By {item.creatorAddress.slice(0, 6)}...</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFromBundle(item.productId)}
                                            className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 border-2 border-dashed border-border rounded-3xl text-center space-y-3">
                                    <p className="text-sm text-muted-foreground italic">Add at least 2 products to start bundling</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {selectedItems.length > 0 && (
                        <div className="space-y-8 pt-8 border-t border-border">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Bundle ID</label>
                                    <input
                                        type="number"
                                        value={productId}
                                        onChange={(e) => setProductId(e.target.value)}
                                        className="w-full px-5 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                        placeholder="e.g. 99"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Bundle Price (USDC)</label>
                                    <input
                                        type="text"
                                        value={bundlePrice}
                                        onChange={(e) => setBundlePrice(e.target.value)}
                                        className="w-full px-5 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Bundle Name</label>
                                <input
                                    type="text"
                                    value={bundleName}
                                    onChange={(e) => setBundleName(e.target.value)}
                                    className="w-full px-5 py-4 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                    placeholder="The Ultimate Creator Kit"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                                <textarea
                                    value={bundleDescription}
                                    onChange={(e) => setBundleDescription(e.target.value)}
                                    className="w-full px-5 py-4 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium min-h-[100px]"
                                    placeholder="What's included in this bundle?"
                                    required
                                />
                            </div>

                            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-muted-foreground">Combined Retail Value</span>
                                    <span className="text-sm font-bold">${calculateTotalRetail().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-primary/10">
                                    <span className="text-sm font-bold text-muted-foreground">Your Cost (Wholesale)</span>
                                    <span className="text-sm font-bold text-emerald-600">${calculateTotalWholesale().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-lg font-black italic tracking-tighter">Your Profit Margin</span>
                                    <span className="text-lg font-black italic tracking-tighter text-primary">
                                        {bundlePrice && calculateTotalWholesale() > 0
                                            ? `${(((parseFloat(bundlePrice) - calculateTotalWholesale()) / parseFloat(bundlePrice)) * 100).toFixed(0)}%`
                                            : '--'}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={selectedItems.length < 2 || isPending || isConfirming || isUploading}
                                className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] shadow-saas hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                <Rocket className="w-5 h-5" />
                                {isPending || isConfirming || isUploading ? 'LAUNCHING...' : 'LAUNCH BUNDLE'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

function ProductSelectCard({ productId, onAdd, showAffiliates }: { productId: number, onAdd: (item: BundledItem) => void, showAffiliates?: boolean }) {
    const { data: product, isLoading: isContractLoading } = useProduct(productId);
    const { user } = useMagic();
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
    if (!metadata) return null;

    // Logic for filtering:
    // 1. If showAffiliates is true: Show products that HAVE affiliateEnabled: true
    // 2. If showAffiliates is false: Show products that belong to the user (or are test products created by the user)

    const isOwned = (product as any).isTest || (product as any).creator?.toLowerCase() === user?.publicAddress?.toLowerCase();

    if (showAffiliates) {
        if (!metadata.affiliateEnabled) return null;
        if (isOwned) return null; // Don't show your own products in marketplace tab
    } else {
        if (!isOwned) return null; // Don't show other's products in your portfolio tab
    }

    const wholesalePrice = metadata.wholesalePrice || metadata.price || '0';

    return (
        <div className="bg-white border border-border p-5 rounded-3xl shadow-sm hover:border-primary/30 transition-all flex items-center gap-5">
            <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-border/50">
                {metadata.image ? (
                    <img src={getIPFSGatewayUrl(metadata.image.replace('ipfs://', ''))} className="w-full h-full object-cover" alt="" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">#{productId}</div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold truncate mb-0.5">{metadata.name}</h4>
                <div className="flex items-center gap-3">
                    <p className="text-[10px] font-bold text-muted-foreground border-r border-border pr-3">Retail: ${metadata.price}</p>
                    <p className="text-[10px] font-bold text-emerald-600">Wholesale: ${wholesalePrice}</p>
                </div>
            </div>

            <button
                onClick={() => onAdd({
                    productId,
                    metadata,
                    creatorAddress: (product as any).creator || user?.publicAddress || '0x...',
                    wholesalePrice
                })}
                className="p-3 bg-slate-50 text-slate-400 hover:bg-primary hover:text-white rounded-xl transition-all"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
    );
}
