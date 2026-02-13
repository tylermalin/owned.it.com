'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProduct, usePurchaseProduct } from '@/lib/hooks';
import { formatUSDC } from '@/lib/utils';
import { getIPFSGatewayUrl, ProductMetadata } from '@/lib/ipfs';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { DEMO_METADATA } from '@/lib/demo';
import { Calendar } from '@/components/Calendar';
import {
    CheckCircle2,
    ShieldCheck,
    Lock,
    Zap,
    LayoutDashboard
} from 'lucide-react';

export default function CheckoutPage() {
    const params = useParams();
    const router = useRouter();
    const productId = parseInt(params.id as string);
    const { isConnected, address } = useAccount();

    const { data: product, isLoading: isContractLoading, error: contractError } = useProduct(productId);
    const { purchaseProduct, isPending, isConfirming, isSuccess, error: purchaseError } = usePurchaseProduct();

    const [metadata, setMetadata] = useState<ProductMetadata | null>(null);
    const [isMetadataLoading, setIsMetadataLoading] = useState(false);
    const [customerInfo, setCustomerInfo] = useState<Record<string, string>>({
        Name: '',
        Email: '',
    });
    const [bookingDate, setBookingDate] = useState<Date | null>(null);
    const [bookingTime, setBookingTime] = useState<string | null>(null);

    // Fetch IPFS Metadata
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
                    if (!res.ok) throw new Error('Failed to fetch metadata');
                    const data = await res.json();
                    setMetadata(data);

                    // Initialize custom fields if present
                    if (data.requiredInfo) {
                        const info: Record<string, string> = {};
                        data.requiredInfo.forEach((field: string) => {
                            info[field] = '';
                        });
                        setCustomerInfo(prev => ({ ...info, ...prev }));
                    }
                } catch (err) {
                    console.error('Metadata fetch error:', err);
                    toast.error('Failed to load product metadata. Retrying with public gateway...');
                    try {
                        const fallbackUrl = `https://cloudflare-ipfs.com/ipfs/${(product as any).ipfsHash}`;
                        const res = await fetch(fallbackUrl);
                        if (res.ok) setMetadata(await res.json());
                    } catch (e) {
                        console.error('Fallback fetch error:', e);
                    }
                } finally {
                    setIsMetadataLoading(false);
                }
            };
            fetchMetadata();
        }
    }, [product, productId]);

    useEffect(() => {
        if (isSuccess) {
            toast.success('Purchase successful! Redirecting...');
            setTimeout(() => router.push('/dashboard'), 3000);
        }
    }, [isSuccess, router]);

    useEffect(() => {
        if (purchaseError) {
            toast.error('Purchase failed. Check your USDC balance or allowance.');
        }
    }, [purchaseError]);

    const handleInfoChange = (field: string, value: string) => {
        setCustomerInfo(prev => ({ ...prev, [field]: value }));
    };

    const handlePurchase = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected) {
            toast.error('Please connect your wallet first');
            return;
        }

        // Basic validation
        for (const field of Object.keys(customerInfo)) {
            if (!customerInfo[field]) {
                toast.error(`Please fill in ${field}`);
                return;
            }
        }

        const isBooking = metadata?.productType === 'coaching' || metadata?.productType === 'consulting';
        if (isBooking && (!bookingDate || !bookingTime)) {
            toast.error('Please select a date and time for your session');
            return;
        }

        purchaseProduct(productId);
    };

    // For demo purposes, we show demo products even without contract data
    const isDemoProduct = productId >= 1 && productId <= 6;
    const demoData = DEMO_METADATA[productId];

    if (isContractLoading || isMetadataLoading) {
        return (
            <div className="min-h-screen bg-[#fafaf9] dark:bg-[#171717] flex items-center justify-center">
                <div className="animate-pulse font-serif text-2xl">Loading Experience...</div>
            </div>
        );
    }

    if ((contractError || !product || !(product as any).active) && !isDemoProduct) {
        return (
            <div className="min-h-screen bg-[#fafaf9] dark:bg-[#171717] flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-6">
                    <h1 className="font-serif text-4xl font-bold">Product Not Found</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        This product may have been deactivated or never existed.
                    </p>
                    <Link href="/products" className="inline-block px-8 py-3 bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 font-bold uppercase tracking-widest">
                        Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

    const price = product ? (product as any).price : (demoData?.price ? BigInt(Math.round(parseFloat(demoData.price) * 1000000)) : BigInt(0));
    const title = metadata?.name || `Product #${productId}`;
    const subtitle = metadata?.subtitle;
    const description = metadata?.description || 'No description provided';
    const ctaText = metadata?.callToAction || 'Complete Purchase';
    const bottomTitle = metadata?.bottomTitle || 'Secure Your Access';
    const isOwned = isSuccess;

    const image = metadata?.image ? getIPFSGatewayUrl(metadata.image.replace('ipfs://', '')) : null;
    const displayImage = metadata?.image?.startsWith('/') ? metadata.image : image;

    if (isOwned) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-xl w-full bg-white rounded-[3rem] p-12 shadow-saas border border-border text-center space-y-10">
                    <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm border border-emerald-100">
                        <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tight">Access Granted.</h1>
                        <p className="text-lg text-muted-foreground font-medium px-6">
                            You successfully verified your ownership on Base. Access your digital asset below.
                        </p>
                    </div>

                    {displayImage && (
                        <div className="aspect-[16/9] rounded-3xl overflow-hidden border border-border shadow-sm">
                            <img src={displayImage} className="w-full h-full object-cover" alt={title} />
                        </div>
                    )}

                    <div className="pt-4 space-y-4">
                        {(metadata?.digitalFileHash || metadata?.redirectUrl) ? (
                            <a
                                href={metadata.redirectUrl || (metadata.digitalFileHash ? getIPFSGatewayUrl(metadata.digitalFileHash) : '#')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full px-12 py-6 bg-emerald-600 text-white font-black uppercase tracking-[0.3em] rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-saas shadow-emerald-500/20 text-center"
                            >
                                {metadata.redirectUrl ? 'ACCESS CONTENT' : 'DOWNLOAD ASSET'}
                            </a>
                        ) : (
                            <div className="p-8 bg-slate-50 rounded-3xl border border-dashed border-border">
                                <p className="text-sm font-bold text-muted-foreground italic">Check your wallet for the official Proof NFT.</p>
                            </div>
                        )}
                        <Link
                            href="/products"
                            className="block text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
                        >
                            Return to Shop
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-[3.5rem] shadow-saas border border-border overflow-hidden">
                    <div className="px-10 py-[10px] border-b border-border bg-slate-50/50 flex justify-between items-center">
                        <Link href="/" className="flex items-center py-2 px-4">
                            <img src="/assets/logo.png" alt="OWNED" className="w-[150px] h-[150px] object-contain hover:brightness-110 transition-all" />
                        </Link>
                        <div className="flex items-center gap-4">
                            {isConnected && (
                                <Link
                                    href="/dashboard"
                                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 rounded-xl text-xs font-bold border border-border transition-all"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    DASHBOARD
                                </Link>
                            )}
                            <ConnectButton />
                        </div>
                    </div>

                    <div className="p-12 space-y-12">
                        <div className="space-y-8 text-center">
                            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-primary/10">
                                Official Product Launch
                            </div>
                            {displayImage && (
                                <div className="max-w-md mx-auto aspect-square rounded-[2.5rem] overflow-hidden border border-border shadow-saas hover:scale-[1.02] transition-transform duration-500">
                                    <img src={displayImage} className="w-full h-full object-cover" alt={title} />
                                </div>
                            )}
                            <div className="space-y-3">
                                <h1 className="text-5xl font-extrabold tracking-tight text-foreground leading-tight">{title}</h1>
                                {subtitle && <p className="text-xl text-muted-foreground font-medium italic">{subtitle}</p>}
                            </div>
                            <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
                        </div>

                        {metadata?.salePoints && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                                {metadata.salePoints.map((point, i) => (
                                    <div key={i} className="flex items-start gap-3 bg-white border border-border p-4 rounded-2xl shadow-sm hover:border-primary/20 transition-all group">
                                        <div className="p-1 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 leading-tight">{point}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-50 border border-border rounded-[2.5rem] p-10 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold tracking-tight">{bottomTitle}</h2>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Final Price</p>
                                <div className="flex flex-col items-end">
                                    <p className="text-3xl font-black italic tracking-tighter text-primary">
                                        {formatUSDC(price) === '0.00' ? 'FREE' : `${formatUSDC(price)} USDC`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handlePurchase} className="space-y-6">
                            <div className="space-y-4">
                                {Object.keys(customerInfo).map((field) => (
                                    <div key={field} className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{field}</label>
                                        <input
                                            type={field.toLowerCase() === 'email' ? 'email' : 'text'}
                                            className="w-full px-6 py-4 bg-white border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-lg transition-all"
                                            placeholder={`Enter your ${field.toLowerCase()}...`}
                                            value={customerInfo[field]}
                                            onChange={(e) => handleInfoChange(field, e.target.value)}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            {(metadata?.productType === 'coaching' || metadata?.productType === 'consulting') && (
                                <div className="space-y-6 pt-6 border-t border-border border-dashed">
                                    <Calendar onSelect={(date, time) => {
                                        setBookingDate(date);
                                        setBookingTime(time);
                                    }} />
                                    {bookingDate && bookingTime && (
                                        <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Selected Time</p>
                                                <p className="font-bold text-emerald-900">{bookingDate.toLocaleDateString()} at {bookingTime}</p>
                                            </div>
                                            <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-sm">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isPending || isConfirming}
                                className="w-full px-12 py-6 bg-primary text-primary-foreground font-black uppercase tracking-[0.3em] rounded-3xl text-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all shadow-saas shadow-primary/20"
                            >
                                {isPending || isConfirming ? 'CONFIRMING...' : ctaText.toUpperCase()}
                            </button>
                        </form>
                    </div>

                    <div className="pt-4 pb-12 flex flex-col items-center gap-6">
                        <div className="flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
                            <div className="text-xs font-black uppercase tracking-widest">Base L2</div>
                            <div className="text-xs font-black uppercase tracking-widest">USDC Verified</div>
                            <div className="text-xs font-black uppercase tracking-widest">AES Encrypted</div>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] text-center max-w-sm leading-relaxed">
                            This transaction is recorded permanently. Your access key is minted as a blockchain-verified Proof NFT.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center">
                <Link href="/products" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                    ← Back to Explore
                </Link>
            </div>
        </div>
    );
}
