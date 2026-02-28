'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { useAllProducts, useProduct, useIsAdmin, useAllMembers, savePurchaseReceipt } from '@/lib/hooks';
import { useState, useEffect } from 'react';
import {
    Users,
    ShoppingBag,
    ShieldAlert,
    Eye,
    EyeOff,
    Star,
    Gift,
    Search,
    ChevronRight,
    ArrowUpRight,
    Activity,
    Lock,
    Wallet
} from 'lucide-react';
import { getIPFSGatewayUrl } from '@/lib/ipfs';
import { formatUSDC, parseUSDC } from '@/lib/utils';
import { ADMIN_ADDRESS } from '@/lib/constants';
import { usePurchasedItems, usePlatformStats } from '@/lib/hooks';
import { AssetDetails } from '@/components/AssetDetails';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const isAdmin = useIsAdmin();
    const router = useRouter();
    const { productIds, isLoading: productsLoading } = useAllProducts();
    const [searchQuery, setSearchQuery] = useState('');
    const [hiddenProducts, setHiddenProducts] = useState<number[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<number[]>([]);
    const [activeTab, setActiveTab] = useState<'products' | 'members' | 'stats' | 'vault'>('products');
    const { stats, isLoading: statsLoading } = usePlatformStats();
    const { data: vaultAssets, isLoading: vaultLoading } = usePurchasedItems(ADMIN_ADDRESS);
    const { members, isLoading: membersLoading } = useAllMembers();
    const [selectedAsset, setSelectedAsset] = useState<{ asset: any, metadata: any } | null>(null);
    const [giftingTo, setGiftingTo] = useState<string | null>(null);

    // Persistence for admin settings (Mocked via localStorage for now)
    useEffect(() => {
        const hidden = localStorage.getItem('hidden-products');
        const featured = localStorage.getItem('featured-products');
        if (hidden) setHiddenProducts(JSON.parse(hidden));
        if (featured) setFeaturedProducts(JSON.parse(featured));
    }, []);

    const toggleHide = (id: number) => {
        const newHidden = hiddenProducts.includes(id)
            ? hiddenProducts.filter(p => p !== id)
            : [...hiddenProducts, id];
        setHiddenProducts(newHidden);
        localStorage.setItem('hidden-products', JSON.stringify(newHidden));
        toast.success(hiddenProducts.includes(id) ? 'Product restored' : 'Product hidden from public store');
    };

    const toggleFeature = (id: number) => {
        const newFeatured = featuredProducts.includes(id)
            ? featuredProducts.filter(p => p !== id)
            : [...featuredProducts, id];
        setFeaturedProducts(newFeatured);
        localStorage.setItem('featured-products', JSON.stringify(newFeatured));
        toast.success(featuredProducts.includes(id) ? 'Product unfeatured' : 'Product featured on marketplace');
    };

    const handleGift = (productId: number, memberAddress: string) => {
        savePurchaseReceipt(memberAddress, productId);
        toast.success(`Product #${productId} gifted to ${memberAddress.slice(0, 6)}...${memberAddress.slice(-4)}`);
        setGiftingTo(null);
    };

    if (!isAdmin) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-4xl border border-border shadow-sm">
                    <div className="p-4 bg-red-50 text-red-500 rounded-3xl mb-6">
                        <Lock className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Access Denied</h1>
                    <p className="text-muted-foreground font-medium mt-2">This dashboard is restricted to authorized administrators only.</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                            <ShieldAlert className="w-3.5 h-3.5" /> Admin Portal
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight italic">Protocol Oversight</h1>
                        <p className="text-lg text-muted-foreground font-medium">Manage products, members, and platform health.</p>
                    </div>

                    <div className="flex bg-white p-1.5 border border-border rounded-2xl shadow-sm overflow-x-auto">
                        {(['products', 'members', 'stats', 'vault'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-white shadow-saas' : 'text-muted-foreground hover:bg-slate-50'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'products' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-2xl text-sm font-medium focus:outline-none focus:border-primary/30 shadow-sm"
                                />
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-black">{productIds.length}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Products</div>
                            </div>
                        </div>

                        <div className="bg-white border border-border rounded-4xl shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-bottom border-border">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sales</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productIds.filter(id => {
                                        if (!searchQuery) return true;
                                        // This is a bit slow as it triggers useProduct for each, but better than nothing for now
                                        // In real app, we'd have a pre-fetched list
                                        return true;
                                    }).map(id => (
                                        <AdminProductRow
                                            key={id}
                                            id={id}
                                            stats={stats.productStats[id]}
                                            isHidden={hiddenProducts.includes(id)}
                                            isFeatured={featuredProducts.includes(id)}
                                            onToggleHide={() => toggleHide(id)}
                                            onToggleFeature={() => toggleFeature(id)}
                                            onGift={() => setGiftingTo(id.toString())}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'members' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="text-right">
                                <div className="text-2xl font-black">{members.length}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Members</div>
                            </div>
                        </div>

                        <div className="bg-white border border-border rounded-4xl shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-bottom border-border">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Member / Account</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Socials</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.length === 0 ? (
                                        <tr className="border-t border-border">
                                            <td colSpan={4} className="px-8 py-20 text-center text-muted-foreground font-medium italic">No members found</td>
                                        </tr>
                                    ) : (
                                        members.map(member => (
                                            <MemberRow
                                                key={member.address}
                                                member={member}
                                                onGift={giftingTo ? () => handleGift(parseInt(giftingTo), member.address) : undefined}
                                            />
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StatCard
                            title="Total Protocol Volume"
                            value={formatUSDC(stats.totalVolume)}
                            trend="+12%"
                            isLoading={statsLoading}
                            icon={<Activity className="w-5 h-5" />}
                        />
                        <StatCard
                            title="Total Sales Count"
                            value={stats.totalSales.toString()}
                            trend="+5%"
                            isLoading={statsLoading}
                            icon={<ShoppingBag className="w-5 h-5" />}
                        />
                        <StatCard
                            title="Vault Balance"
                            value={vaultAssets ? vaultAssets.length.toString() : '0'}
                            trend="Admin held"
                            isLoading={vaultLoading}
                            icon={<Wallet className="w-5 h-5" />}
                        />
                    </div>
                )}

                {activeTab === 'vault' && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold">Admin Vault</h3>
                                <p className="text-sm text-muted-foreground">Digital assets held in the primary administrator wallet.</p>
                            </div>
                            <div className="px-4 py-2 bg-slate-50 border border-border rounded-xl text-[10px] font-black text-muted-foreground">
                                {ADMIN_ADDRESS}
                            </div>
                        </div>

                        {vaultLoading ? (
                            <div className="text-center py-20 animate-pulse">Scanning vault...</div>
                        ) : vaultAssets?.length === 0 ? (
                            <div className="bg-white border border-border rounded-4xl p-20 text-center space-y-4">
                                <Wallet className="w-12 h-12 text-slate-300 mx-auto" />
                                <p className="text-muted-foreground font-medium">Vault is currently empty.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {vaultAssets?.map((asset: any) => (
                                    <AdminVaultCard
                                        key={asset.id}
                                        asset={asset}
                                        onSelect={(metadata) => setSelectedAsset({ asset, metadata })}
                                    />
                                ))}
                            </div>
                        )}
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

function AdminProductRow({ id, stats, isHidden, isFeatured, onToggleHide, onToggleFeature, onGift }: {
    id: number;
    stats?: { sold: number; revenue: bigint };
    isHidden: boolean;
    isFeatured: boolean;
    onToggleHide: () => void;
    onToggleFeature: () => void;
    onGift: () => void;
}) {
    const { data, isLoading } = useProduct(id);
    const product = data?.product;
    const metadata = data?.metadata;

    if (isLoading) return (
        <tr className="border-t border-border animate-pulse">
            <td colSpan={5} className="px-8 py-6 h-20 bg-slate-50/50" />
        </tr>
    );

    return (
        <tr className="border-t border-border hover:bg-slate-50/50 transition-all group">
            <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden border border-border">
                        {metadata?.image && <img src={getIPFSGatewayUrl(metadata.image)} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                        <div className="font-bold text-slate-900">{metadata?.name || `Product #${id}`}</div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{metadata?.type || 'Digital'}</div>
                    </div>
                </div>
            </td>
            <td className="px-8 py-5">
                <div className="font-black text-slate-900">{product?.price ? `$${formatUSDC(product.price)}` : 'FREE'}</div>
            </td>
            <td className="px-8 py-5">
                <div className="flex flex-col">
                    <div className="font-bold text-slate-900">{stats?.sold || 0} sold</div>
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        {stats?.revenue ? formatUSDC(stats.revenue) : '$0.00'} rev
                    </div>
                </div>
            </td>
            <td className="px-8 py-5">
                <div className="flex items-center gap-2">
                    {isHidden ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-100">
                            <EyeOff className="w-3 h-3" /> Hidden
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                            <Eye className="w-3 h-3" /> Public
                        </span>
                    )}
                    {isFeatured && (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100">
                            <Star className="w-3 h-3 fill-current" /> Featured
                        </span>
                    )}
                </div>
            </td>
            <td className="px-8 py-5">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                        onClick={onToggleFeature}
                        className={`p-2 rounded-xl border transition-all ${isFeatured ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-white border-border text-slate-400 hover:border-amber-200 hover:text-amber-500'}`}
                        title={isFeatured ? 'Unfeature' : 'Feature Product'}
                    >
                        <Star className={`w-4 h-4 ${isFeatured ? 'fill-current' : ''}`} />
                    </button>
                    <button
                        onClick={onToggleHide}
                        className={`p-2 rounded-xl border transition-all ${isHidden ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-border text-slate-400 hover:border-red-200 hover:text-red-500'}`}
                        title={isHidden ? 'Show in Store' : 'Hide from Store'}
                    >
                        {isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={onGift}
                        className="p-2 bg-white border border-border text-slate-400 rounded-xl hover:border-primary hover:text-primary transition-all"
                        title="Gift to Member"
                    >
                        <Gift className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

function MemberRow({ member, onGift }: { member: any; onGift?: () => void }) {
    return (
        <tr className="border-t border-border hover:bg-slate-50/50 transition-all group">
            <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full overflow-hidden border border-border flex items-center justify-center">
                        {member.profile?.avatar ? (
                            <img src={getIPFSGatewayUrl(member.profile.avatar)} className="w-full h-full object-cover" />
                        ) : (
                            <Users className="w-5 h-5 text-slate-400" />
                        )}
                    </div>
                    <div>
                        <div className="font-bold text-slate-900">{member.profile?.displayName || 'Anonymous Member'}</div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest font-mono">{member.address.slice(0, 10)}...{member.address.slice(-8)}</div>
                    </div>
                </div>
            </td>
            <td className="px-8 py-5">
                {member.isAdmin ? (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20">Admin</span>
                ) : (
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-border">Member</span>
                )}
            </td>
            <td className="px-8 py-5">
                <div className="flex gap-2">
                    {member.profile?.socials?.twitter && <div className="w-6 h-6 bg-slate-50 rounded-lg border border-border flex items-center justify-center text-[10px] font-bold">X</div>}
                    {member.profile?.socials?.farcaster && <div className="w-6 h-6 bg-slate-50 rounded-lg border border-border flex items-center justify-center text-[10px] font-bold">F</div>}
                    {!member.profile?.socials?.twitter && !member.profile?.socials?.farcaster && <span className="text-muted-foreground italic text-xs">None</span>}
                </div>
            </td>
            <td className="px-8 py-5">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    {onGift && (
                        <button
                            onClick={onGift}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-saas hover:gap-4 transition-all"
                        >
                            <Gift className="w-3 h-3" /> Select for Gift
                        </button>
                    )}
                    <button className="p-2 bg-white border border-border text-slate-400 rounded-xl hover:border-primary hover:text-primary transition-all">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

function StatCard({ title, value, trend, icon, isLoading }: { title: string; value: string; trend: string; icon: React.ReactNode; isLoading?: boolean }) {
    if (isLoading) return (
        <div className="bg-white border border-border rounded-4xl p-8 space-y-4 shadow-sm animate-pulse">
            <div className="h-10 bg-slate-50 rounded-2xl w-10" />
            <div className="space-y-2">
                <div className="h-8 bg-slate-50 rounded-xl w-3/4" />
                <div className="h-4 bg-slate-50 rounded-xl w-1/2" />
            </div>
        </div>
    );

    return (
        <div className="bg-white border border-border rounded-4xl p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="p-2.5 bg-primary/5 text-primary rounded-2xl">{icon}</div>
                <div className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100">{trend}</div>
            </div>
            <div>
                <div className="text-3xl font-black tracking-tight">{value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{title}</div>
            </div>
        </div>
    );
}
function AdminVaultCard({ asset, onSelect }: { asset: any, onSelect: (metadata: any) => void }) {
    const [metadata, setMetadata] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const { getIPFSGatewayUrl } = await import('@/lib/ipfs');
                const { DEMO_METADATA } = await import('@/lib/demo');

                if (DEMO_METADATA[asset.id]) {
                    setMetadata(DEMO_METADATA[asset.id]);
                } else if (asset.ipfsHash) {
                    const url = getIPFSGatewayUrl(asset.ipfsHash);
                    const res = await fetch(url);
                    if (res.ok) {
                        setMetadata(await res.json());
                    }
                }
            } catch (e) {
                console.error('Vault meta fetch error', e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMeta();
    }, [asset.id, asset.ipfsHash]);

    if (isLoading) return <div className="aspect-[4/5] bg-slate-50 rounded-3xl animate-pulse" />;

    const title = metadata?.name || `Asset #${asset.id}`;
    const image = metadata?.image ? getIPFSGatewayUrl(metadata.image.replace('ipfs://', '')) : null;
    const displayImage = metadata?.image?.startsWith('/') ? metadata.image : image;

    return (
        <div
            onClick={() => onSelect(metadata)}
            className="bg-white border border-border rounded-3xl p-6 space-y-6 hover:shadow-saas transition-all cursor-pointer group"
        >
            <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-border">
                {displayImage ? (
                    <img src={displayImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ShoppingBag className="w-12 h-12" />
                    </div>
                )}
            </div>
            <div className="space-y-2 text-center">
                <h4 className="font-bold text-slate-900">{title}</h4>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Holdings Entry #{asset.id}
                </div>
            </div>
        </div>
    );
}
