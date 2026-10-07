'use client';

import { useParams } from 'next/navigation';
import { useUserProfile, useAllProducts, useProduct } from '@/lib/hooks';
import { getIPFSGatewayUrl, ProductMetadata } from '@/lib/ipfs';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMagic } from '@/components/MagicProvider';
import { generateAffiliateLink } from '@/lib/affiliateTracker';
import toast from 'react-hot-toast';
import {
    Twitter,
    Globe,
    Github,
    ExternalLink,
    Instagram,
    Youtube,
    Share2,
    Copy,
    ShoppingBag,
} from 'lucide-react';
import { formatUSDC } from '@/lib/utils';

export default function PublicProfilePage() {
    const params = useParams();
    const [address, setAddress] = useState<string | null>(null);
    const { profile, isLoading: isProfileLoading } = useUserProfile(address || undefined);
    const { productIds, isLoading: isProductsLoading } = useAllProducts();
    const { user } = useMagic();
    const viewerWallet = user?.publicAddress;

    useEffect(() => {
        if (params?.address) {
            setAddress(params.address as string);
        }
    }, [params]);

    const copyProfileUrl = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Profile URL copied!');
    };

    if (!address || isProfileLoading || isProductsLoading) {
        return (
            <div className="bg-background flex justify-center px-6 py-12 md:py-16">
                <div className="max-w-2xl w-full space-y-6 animate-pulse">
                    <div className="h-48 bg-slate-100 rounded-3xl" />
                    <div className="flex flex-col items-center gap-4 -mt-16">
                        <div className="w-28 h-28 bg-slate-200 rounded-full" />
                        <div className="w-48 h-8 bg-slate-100 rounded-xl" />
                        <div className="w-64 h-4 bg-slate-100 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    const displayName = profile?.displayName || `${address.slice(0, 6)}...${address.slice(-4)}`;

    return (
        <div className="bg-background flex flex-col items-center pb-16 md:pb-20">

            {/* ── Banner ── */}
            <div className="w-full h-52 md:h-72 bg-gradient-to-br from-primary/30 via-primary/10 to-slate-100 relative overflow-hidden">
                {profile?.banner ? (
                    <img
                        src={getIPFSGatewayUrl(profile.banner)}
                        alt="Banner"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/5 to-slate-50" />
                )}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
            </div>

            {/* ── Profile card ── */}
            <div className="max-w-lg w-full px-5 -mt-16 md:-mt-20 relative z-10 flex flex-col items-center text-center gap-5">

                {/* Avatar */}
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
                    {profile?.avatar ? (
                        <img src={getIPFSGatewayUrl(profile.avatar)} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-black">
                            {address.slice(2, 4).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Name + bio */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight text-foreground">{displayName}</h1>
                    {profile?.bio && (
                        <p className="text-base text-slate-600 font-medium leading-relaxed max-w-sm">{profile.bio}</p>
                    )}
                </div>

                {/* Social row */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {profile?.socials?.twitter && (
                        <SocialChip href={`https://twitter.com/${profile.socials.twitter.replace('@', '')}`} label={`@${profile.socials.twitter.replace('@', '')}`} icon={<Twitter className="w-4 h-4" />} />
                    )}
                    {profile?.socials?.instagram && (
                        <SocialChip href={`https://instagram.com/${profile.socials.instagram.replace('@', '')}`} label={profile.socials.instagram} icon={<Instagram className="w-4 h-4" />} />
                    )}
                    {profile?.socials?.youtube && (
                        <SocialChip href={profile.socials.youtube} label="YouTube" icon={<Youtube className="w-4 h-4" />} />
                    )}
                    {profile?.socials?.website && (
                        <SocialChip href={profile.socials.website.startsWith('http') ? profile.socials.website : `https://${profile.socials.website}`} label={profile.socials.website.replace(/^https?:\/\//, '')} icon={<Globe className="w-4 h-4" />} />
                    )}
                    {profile?.socials?.github && (
                        <SocialChip href={`https://github.com/${profile.socials.github}`} label={profile.socials.github} icon={<Github className="w-4 h-4" />} />
                    )}
                    {/* Share own store */}
                    <button
                        onClick={copyProfileUrl}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 hover:border-primary hover:text-primary transition-all shadow-sm"
                    >
                        <Share2 className="w-3.5 h-3.5" />
                        Share store
                    </button>
                </div>

                {/* ── Products ── */}
                <div className="w-full pt-10 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-slate-200" />
                        <p className="eyebrow flex items-center gap-2">
                            <ShoppingBag className="w-3 h-3" />
                            Store
                        </p>
                        <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                        {productIds.map(id => (
                            <ProfileProductCard
                                key={id}
                                productId={id}
                                creatorAddress={address}
                                viewerWallet={viewerWallet ?? undefined}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SocialChip({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 hover:border-primary hover:text-primary transition-all shadow-sm hover:shadow-md"
        >
            {icon}
            {label}
        </a>
    );
}

function ProfileProductCard({
    productId,
    creatorAddress,
    viewerWallet,
}: {
    productId: number;
    creatorAddress: string;
    viewerWallet?: string;
}) {
    const { data: product, isLoading: isProductLoading } = useProduct(productId);
    const [metadata, setMetadata] = useState<ProductMetadata | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (product && (product as any).ipfsHash) {
            const fetchMetadata = async () => {
                try {
                    const url = getIPFSGatewayUrl((product as any).ipfsHash);
                    const res = await fetch(url);
                    if (res.ok) setMetadata(await res.json());
                } catch { }
            };
            fetchMetadata();
        }
    }, [product]);

    if (isProductLoading || !product || !metadata) return null;

    // Only show products created by this wallet
    const isCreatorProduct = (product as any).creator?.toLowerCase() === creatorAddress.toLowerCase() || (product as any).isTest;
    if (!isCreatorProduct) return null;

    const isAffiliate = !!metadata.affiliateEnabled;
    const image = metadata.image ? getIPFSGatewayUrl(metadata.image.replace('ipfs://', '')) : null;
    const price = (product as any).price;

    const handleSellThis = async () => {
        const link = generateAffiliateLink(productId, viewerWallet || '');
        await navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success(`Affiliate link copied! Earn ${metadata.affiliatePercent || 15}% per sale.`);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className="bg-white border border-border rounded-3xl overflow-hidden card-lift text-left flex flex-col">
            {/* Cover */}
            {image && (
                <div className="aspect-video w-full overflow-hidden bg-slate-50">
                    <img src={image} alt={metadata.name} className="w-full h-full object-cover" />
                </div>
            )}

            <div className="p-6 space-y-4 flex-1 flex flex-col">
                {/* Type badge + Commission badge */}
                <div className="flex flex-wrap gap-2">
                    {metadata.productType && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                            {metadata.productType}
                        </span>
                    )}
                    {isAffiliate && (
                        <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                            {metadata.affiliatePercent}% Commission
                        </span>
                    )}
                </div>

                <div className="flex-1 space-y-1">
                    <h3 className="text-xl font-black tracking-tight text-foreground leading-tight">{metadata.name}</h3>
                    {metadata.subtitle && (
                        <p className="text-sm text-muted-foreground font-medium">{metadata.subtitle}</p>
                    )}
                </div>

                {/* Price */}
                <p className="text-2xl font-black text-primary tracking-tight">
                    {formatUSDC(price)} USDC
                </p>

                {/* CTA buttons */}
                <div className={`grid gap-3 ${isAffiliate ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    <Link
                        href={`/products/${productId}/checkout`}
                        className="btn-brand rounded-xl px-4 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em]"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Buy this
                    </Link>

                    {isAffiliate && (
                        <button
                            onClick={handleSellThis}
                            className={`rounded-xl px-4 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em] transition-all ${copied
                                ? 'bg-emerald-50 border-2 border-emerald-300 text-emerald-700'
                                : 'btn-secondary'
                                }`}
                        >
                            <Copy className="w-3.5 h-3.5" />
                            {copied ? 'Copied!' : 'Sell this — $0'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
