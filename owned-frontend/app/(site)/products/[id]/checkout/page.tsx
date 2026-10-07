'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePurchaseProduct, useProduct, savePurchaseReceipt } from '@/lib/hooks';
import { formatUSDC } from '@/lib/utils';
import { getIPFSGatewayUrl, ProductMetadata } from '@/lib/ipfs';
import { FiatOnramp } from '@/components/FiatOnramp';
import { useMagic } from '@/components/MagicProvider';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { DEMO_METADATA } from '@/lib/demo';
import { FormattedDescription } from '@/components/FormattedDescription';
import { Calendar } from '@/components/Calendar';
import { useAffiliate } from '@/components/AffiliateContext';
import {
    CheckCircle2,
    ShieldCheck,
    Lock,
    Zap,
    ChevronRight,
} from 'lucide-react';

export default function CheckoutPage() {
    const params = useParams();
    const router = useRouter();
    const productId = parseInt(params.id as string);
    const { user: magicUser, isLoading: isMagicLoading } = useMagic();
    const isMagicConnected = !!magicUser?.publicAddress;
    const isAuthLoading = isMagicLoading;

    const { data: product, isLoading: isContractLoading } = useProduct(productId);
    const { purchaseProduct, isPending, isConfirming, isSuccess, isApprovePending, error: purchaseError } = usePurchaseProduct();
    const { getReferrerForProduct } = useAffiliate();

    const [metadata, setMetadata] = useState<ProductMetadata | null>(null);
    const [isMetadataLoading, setIsMetadataLoading] = useState(false);
    const [referrer, setReferrer] = useState<string | null>(null);
    const [customerInfo, setCustomerInfo] = useState<Record<string, string>>({
        Name: '',
        Email: '',
    });
    const [bookingDate, setBookingDate] = useState<Date | null>(null);
    const [bookingTime, setBookingTime] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [isCurriculumExpanded, setIsCurriculumExpanded] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponValidation, setCouponValidation] = useState<{ isValid: boolean; error?: string; discountPercent?: number } | null>(null);
    const [wantsTestimonialDiscount, setWantsTestimonialDiscount] = useState(false);

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

    // Initialize referrer from affiliate context
    useEffect(() => {
        const ref = getReferrerForProduct(productId);
        if (ref) setReferrer(ref);
    }, [productId, getReferrerForProduct]);

    useEffect(() => {
        if (isSuccess) {
            // Save purchase receipt to localStorage so it always appears in library
            if (magicUser?.publicAddress) {
                savePurchaseReceipt(magicUser.publicAddress, productId);
            }

            // Affiliate/referral recording is disabled; it will be rebuilt on the
            // v2 contracts where a referral share is paid onchain at purchase.
            toast.success('Purchase successful! Redirecting...');
            setTimeout(() => router.push('/dashboard/library'), 3000);
        }
    }, [isSuccess, router, referrer, productId, metadata, magicUser]);

    useEffect(() => {
        if (purchaseError) {
            toast.error(purchaseError); // Use the actual error message from the hook
        }
    }, [purchaseError]);

    const handleInfoChange = (field: string, value: string) => {
        setCustomerInfo(prev => ({ ...prev, [field]: value }));
    };

    const handlePurchase = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isMagicConnected) {
            toast.error('Please sign in first');
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

        if (metadata?.productType === 'merch') {
            if (metadata.merch?.sizes && !selectedSize) {
                toast.error('Please select a size');
                return;
            }
            if (metadata.merch?.colors && !selectedColor) {
                toast.error('Please select a color');
                return;
            }
        }

        purchaseProduct(
            productId,
            couponValidation?.isValid ? couponCode : undefined,
            wantsTestimonialDiscount
        );
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        const { validateCoupon } = await import('@/lib/coupons');
        const result = validateCoupon(couponCode, productId);
        setCouponValidation({
            isValid: result.isValid,
            error: result.error,
            discountPercent: result.coupon?.discountPercent
        });
        if (result.isValid) {
            toast.success(`Coupon applied: ${result.coupon?.discountPercent}% off!`);
        } else {
            toast.error(result.error || 'Invalid coupon');
        }
    };

    // For demo purposes, we show demo products even without contract data
    const isDemoProduct = productId >= 1 && productId <= 6;
    const demoData = DEMO_METADATA[productId];

    if (isContractLoading || isMetadataLoading) {
        return (
            <div className="flex items-center justify-center px-6 py-12 md:py-16">
                <div className="max-w-2xl w-full bg-white rounded-3xl p-6 md:p-12 border border-border space-y-12 animate-pulse">
                    <div className="space-y-8 text-center">
                        <div className="w-32 h-6 bg-slate-100 rounded-full mx-auto" />
                        <div className="w-64 h-64 max-w-full bg-slate-100 rounded-3xl mx-auto" />
                        <div className="space-y-3">
                            <div className="w-3/4 h-10 bg-slate-100 rounded-xl mx-auto" />
                            <div className="w-1/2 h-6 bg-slate-100 rounded-xl mx-auto" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="w-full h-16 bg-slate-100 rounded-2xl" />
                        <div className="w-full h-16 bg-slate-100 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    if ((!product || !(product as any).active) && !isDemoProduct) {
        return (
            <div className="flex items-center justify-center px-6 py-24 md:py-32 text-center">
                <div className="max-w-md space-y-6">
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Product Not Found</h1>
                    <p className="text-muted-foreground">
                        This product may have been deactivated or never existed.
                    </p>
                    <Link href="/products" className="btn-brand rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em]">
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
    const isBooking = metadata?.productType === 'coaching' || metadata?.productType === 'consulting';

    const image = metadata?.image ? getIPFSGatewayUrl(metadata.image.replace('ipfs://', '')) : null;
    const displayImage = metadata?.image?.startsWith('/') ? metadata.image : image;

    const generateGoogleCalLink = () => {
        if (!bookingDate || !bookingTime || !metadata?.consulting?.meetingUrl) return '#';
        const start = new Date(bookingDate);
        const [hours, minutes] = bookingTime.split(':').map(Number);
        start.setHours(hours, minutes, 0, 0);

        const durationMins = metadata?.availability?.sessionDuration || 60;
        const end = new Date(start.getTime() + durationMins * 60000);

        const formatGoogleDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");

        const text = encodeURIComponent(`Meeting: ${title}`);
        const dates = `${formatGoogleDate(start)}/${formatGoogleDate(end)}`;
        const details = encodeURIComponent(description);
        const location = encodeURIComponent(metadata.consulting.meetingUrl);

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
    };

    if (isOwned) {
        return (
            <div className="flex items-center justify-center px-6 py-12 md:py-16">
                <div className="max-w-xl w-full brand-card rounded-[2rem] bg-white overflow-hidden text-center">
                    <div className="brand-scanlines h-2.5" aria-hidden="true" />
                    <div className="p-6 md:p-12 space-y-10">
                    <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-emerald-100">
                        <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black tracking-tight text-foreground">
                            {isBooking ? 'Session Confirmed.' : 'Access Granted.'}
                        </h1>
                        <p className="text-lg text-muted-foreground font-medium md:px-6">
                            {isBooking
                                ? 'Your booking has been secured on-chain.'
                                : 'You successfully verified your ownership on Base. Access your digital asset below.'}
                        </p>
                    </div>

                    {displayImage && (
                        <div className="aspect-[16/9] rounded-3xl overflow-hidden border border-border shadow-sm">
                            <img src={displayImage} className="w-full h-full object-cover" alt={title} />
                        </div>
                    )}

                    <div className="pt-4 space-y-4">
                        {isBooking && metadata?.consulting?.meetingUrl ? (
                            <div className="space-y-4">
                                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 mb-6">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Booked Time</p>
                                    <p className="font-bold text-emerald-900 text-lg">
                                        {bookingDate?.toLocaleDateString()} at {bookingTime}
                                    </p>
                                </div>
                                <a
                                    href={metadata.consulting.meetingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-brand w-full rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em]"
                                >
                                    JOIN MEETING
                                </a>
                                {bookingDate && bookingTime && (
                                    <a
                                        href={generateGoogleCalLink()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-secondary w-full rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em]"
                                    >
                                        📅 Add to Google Calendar
                                    </a>
                                )}
                            </div>
                        ) : (metadata?.digitalFileHash || metadata?.redirectUrl) ? (
                            <a
                                href={metadata.redirectUrl || (metadata.digitalFileHash ? getIPFSGatewayUrl(metadata.digitalFileHash) : '#')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em] rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-700"
                            >
                                {metadata.redirectUrl ? 'ACCESS CONTENT' : 'DOWNLOAD ASSET'}
                            </a>
                        ) : (
                            <div className="p-8 bg-slate-50 rounded-3xl border border-dashed border-border">
                                <p className="text-sm font-bold text-muted-foreground">Check your wallet for the official Proof NFT.</p>
                            </div>
                        )}
                        <Link
                            href="/products"
                            className="link-draw inline-block pb-0.5 text-xs font-black uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground"
                        >
                            Return to Shop
                        </Link>
                    </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-6 pt-12 pb-16 md:pt-16 md:pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    <div className="rounded-3xl border border-border bg-white p-6 md:p-10 space-y-12">
                        <div className="space-y-8 text-center">
                            <div className="brand-sticker inline-block rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em]">
                                Official Product Launch
                            </div>
                            {referrer && (
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full border border-emerald-200">
                                    <span>🔗</span>
                                    <span>Referred by {referrer.slice(0, 6)}...{referrer.slice(-4)}</span>
                                </div>
                            )}
                            {displayImage && (
                                <div className="max-w-md mx-auto aspect-square rounded-3xl overflow-hidden border border-border">
                                    <img src={displayImage} className="w-full h-full object-cover" alt={title} />
                                </div>
                            )}
                            <div className="space-y-3">
                                <h1 className="text-[2.4rem] sm:text-5xl font-black tracking-tight text-foreground leading-[1.05]">{title}</h1>
                                {subtitle && <p className="text-xl text-muted-foreground font-medium">{subtitle}</p>}
                            </div>
                            <FormattedDescription text={description} className="max-w-xl mx-auto" />
                        </div>

                        {metadata?.productType === 'bundle' && metadata?.bundleItems && (
                            <div className="space-y-6 pt-6 border-t border-border border-dashed">
                                <h3 className="text-xl font-black tracking-tight text-center">Included in this Bundle</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {metadata.bundleItems.map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-slate-50 border border-border p-4 rounded-xl">
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-primary shadow-sm border border-border/50">
                                                #{item.productId}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold truncate">Creator Asset</p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                                    By {item.creatorAddress.slice(0, 6)}...{item.creatorAddress.slice(-4)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {metadata?.productType === 'course' && metadata?.curriculum && (
                            <div className="space-y-6 pt-6 border-t border-border border-dashed">
                                <button
                                    onClick={() => setIsCurriculumExpanded(!isCurriculumExpanded)}
                                    className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-xl border border-border hover:bg-slate-100 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm">🎓</div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold">Preview Curriculum</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{metadata.curriculum.modules?.length || 0} Modules · {metadata.curriculum.modules?.reduce((acc: number, mod: any) => acc + (mod.lessons?.length || 0), 0)} Lessons</p>
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isCurriculumExpanded ? 'rotate-90' : ''}`} />
                                </button>

                                {isCurriculumExpanded && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {metadata.curriculum.modules?.map((mod: any, i: number) => (
                                            <div key={i} className="pl-4 border-l-2 border-slate-100 space-y-2">
                                                <p className="text-xs font-black uppercase tracking-widest text-primary/60">Module {i + 1}: {mod.title}</p>
                                                <ul className="space-y-1">
                                                    {mod.lessons?.map((lesson: any, j: number) => (
                                                        <li key={j} className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                                                            {lesson.title}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {metadata?.productType === 'community' && (
                            <div className="space-y-6 pt-6 border-t border-border border-dashed">
                                <div className="p-6 bg-primary/5 border border-primary/15 rounded-3xl space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🔐</div>
                                        <div>
                                            <p className="text-sm font-black uppercase tracking-widest text-primary">Token-Gated Community</p>
                                            <p className="text-[11px] text-muted-foreground font-medium">Ownership verified on-chain via Proof NFT</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-foreground/70 leading-relaxed font-medium">
                                        Purchasing this item mints a unique Proof NFT to your wallet. You'll use this to verify your membership and unlock private Discord channels.
                                    </p>
                                </div>
                            </div>
                        )}

                        {metadata?.salePoints && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                                {metadata.salePoints.map((point, i) => (
                                    <div key={i} className="flex items-start gap-3 bg-white border border-border p-4 rounded-xl hover:border-primary/20 transition-all group">
                                        <div className="p-1 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 leading-tight">{point}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:sticky lg:top-24 space-y-6">
                    <div className="brand-card rounded-[2rem] bg-white overflow-hidden">
                    <div className="brand-scanlines h-2.5" aria-hidden="true" />
                    <div className="p-6 md:p-8 space-y-8">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <h2 className="text-2xl font-black tracking-tight text-foreground">{bottomTitle}</h2>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Final Price</p>
                                <div className="flex flex-col items-end">
                                    {(couponValidation?.isValid || wantsTestimonialDiscount) && (
                                        <p className="text-sm font-bold text-muted-foreground line-through opacity-50">
                                            {formatUSDC(price)} USDC
                                        </p>
                                    )}
                                    <p className="text-3xl font-black tracking-tight text-primary">
                                        {(() => {
                                            let finalPrice = price;
                                            if (couponValidation?.isValid && couponValidation.discountPercent) {
                                                finalPrice = finalPrice - (finalPrice * BigInt(couponValidation.discountPercent) / 100n);
                                            }
                                            if (wantsTestimonialDiscount && metadata?.testimonialDiscountPercent) {
                                                finalPrice = finalPrice - (finalPrice * BigInt(metadata.testimonialDiscountPercent) / 100n);
                                            }

                                            if (finalPrice <= 0n) return 'FREE';
                                            return `${formatUSDC(finalPrice)} USDC`;
                                        })()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {metadata?.testimonialDiscountPercent && (
                            <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 space-y-4">
                                <label className="flex items-start gap-4 cursor-pointer group">
                                    <div className="relative flex items-center pt-1">
                                        <input
                                            type="checkbox"
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-emerald-300 checked:bg-emerald-500 checked:border-emerald-500 transition-all"
                                            checked={wantsTestimonialDiscount}
                                            onChange={(e) => setWantsTestimonialDiscount(e.target.checked)}
                                        />
                                        <CheckCircle2 className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 left-[3px] top-[4px] pointer-events-none transition-opacity" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-black uppercase tracking-widest text-emerald-700">Testimonial Discount</span>
                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full border border-emerald-200 uppercase">Save {metadata.testimonialDiscountPercent}%</span>
                                            {metadata.testimonialDiscountLimit && (
                                                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black rounded-full border border-amber-200 uppercase">First {metadata.testimonialDiscountLimit} Sales</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                                            I agree to provide a high-quality community testimonial within 7 days of use. I understand this discount is transparent and my review will be labeled as "Incentivized".
                                        </p>
                                    </div>
                                </label>
                            </div>
                        )}

                        <form onSubmit={handlePurchase} className="space-y-6">
                            <div className="space-y-4">
                                {Object.keys(customerInfo).map((field) => (
                                    <div key={field} className="space-y-2">
                                        <label className="text-xs font-bold text-foreground">{field}</label>
                                        <input
                                            type={field.toLowerCase() === 'email' ? 'email' : 'text'}
                                            className="h-12 w-full rounded-xl border border-border bg-white px-4 text-base font-medium placeholder:text-muted-foreground/50 focus:border-[var(--brand-magenta)] focus:outline-none focus:ring-2 focus:ring-[rgba(192,24,144,0.25)]"
                                            placeholder={`Enter your ${field.toLowerCase()}...`}
                                            value={customerInfo[field]}
                                            onChange={(e) => handleInfoChange(field, e.target.value)}
                                            required
                                        />
                                    </div>
                                ))}

                                {/* Coupon field hidden: discounts are disabled until enforced on-chain. */}

                                {metadata?.productType === 'merch' && metadata.merch && (
                                    <div className="space-y-6 pt-4">
                                        {metadata.merch.sizes && (
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-foreground">Select Size</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {metadata.merch.sizes.map((size: string) => (
                                                        <button
                                                            key={size}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedSize(size);
                                                                handleInfoChange('Size', size);
                                                            }}
                                                            className={`px-5 py-3 rounded-xl border-2 text-xs font-black uppercase tracking-widest transition-all ${selectedSize === size ? 'bg-primary text-primary-foreground border-primary' : 'bg-white border-border text-muted-foreground hover:border-primary/30'}`}
                                                        >
                                                            {size}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {metadata.merch.colors && (
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-foreground">Select Color</label>
                                                <div className="flex flex-wrap gap-3">
                                                    {metadata.merch.colors.map((color: { name: string, hex: string }) => (
                                                        <button
                                                            key={color.name}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedColor(color.name);
                                                                handleInfoChange('Color', color.name);
                                                            }}
                                                            className={`group relative flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all ${selectedColor === color.name ? 'border-primary bg-primary/5' : 'border-transparent bg-white shadow-sm hover:shadow-md'}`}
                                                        >
                                                            <div
                                                                className="w-10 h-10 rounded-xl border border-border shadow-inner"
                                                                style={{ backgroundColor: color.hex }}
                                                            />
                                                            <span className="text-[10px] font-black uppercase tracking-tight opacity-60">{color.name}</span>
                                                            {selectedColor === color.name && (
                                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center shadow-sm">
                                                                    <CheckCircle2 className="w-3 h-3" />
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
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

                            {isMagicConnected && formatUSDC(price) !== '0.00' && (
                                <FiatOnramp />
                            )}

                            <button
                                type="submit"
                                disabled={isAuthLoading || isPending || isConfirming}
                                className="btn-brand w-full rounded-xl px-6 h-14 inline-flex items-center justify-center gap-2 text-sm font-black uppercase tracking-[0.12em] disabled:opacity-50"
                            >
                                {!isMagicConnected ? (isAuthLoading ? 'CHECKING WALLET...' : 'SIGN IN TO PURCHASE') : isApprovePending ? 'APPROVING...' : isPending || isConfirming ? 'CONFIRMING...' : ctaText.toUpperCase()}
                            </button>
                        </form>
                    </div>
                    </div>

                    <div className="pt-2 flex flex-col items-center gap-4">
                        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-muted-foreground">
                            <div className="text-xs font-black uppercase tracking-widest">Base L2</div>
                            <div className="text-xs font-black uppercase tracking-widest">USDC Verified</div>
                            <div className="text-xs font-black uppercase tracking-widest">AES Encrypted</div>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] text-center max-w-sm leading-relaxed">
                            This transaction is recorded onchain. Your access key is minted as a blockchain-verified Proof NFT.
                        </p>
                    </div>

                    <div className="text-center">
                        <Link href="/products" className="link-draw pb-0.5 text-xs font-black text-muted-foreground hover:text-foreground uppercase tracking-[0.12em]">
                            ← Back to Explore
                        </Link>
                    </div>
                    </div>
            </div>
        </div>
    );
}

