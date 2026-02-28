'use client';

import { useState, useEffect } from 'react';
import { useAddProduct, useUpdateProduct } from '@/lib/dashboardHooks';
import { useProduct, useAllProducts } from '@/lib/hooks';
import { useMagic } from '@/components/MagicProvider';
import toast from 'react-hot-toast';
import { ProductTypeSelector, ProductType } from './ProductTypeSelector';
import { uploadToIPFS, uploadImageToIPFS, ProductMetadata } from '@/lib/ipfs';
import { RichTextEditor } from './RichTextEditor';
import { formatUnits } from 'viem';
import { DEMO_METADATA } from '@/lib/demo';

interface ProductFormProps {
    editProductId?: number | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function ProductForm({ editProductId, onSuccess, onCancel }: ProductFormProps) {
    const [step, setStep] = useState<'type' | 'details'>('type');
    const [productType, setProductType] = useState<ProductType | null>(null);
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [bottomTitle, setBottomTitle] = useState('');
    const [callToAction, setCallToAction] = useState('');
    const [thumbnailStyle, setThumbnailStyle] = useState<'button' | 'callout'>('button');
    const [price, setPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [ipfsHash, setIpfsHash] = useState('');
    const [maxSupply, setMaxSupply] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [digitalFile, setDigitalFile] = useState<File | null>(null);
    const [digitalFileHash, setDigitalFileHash] = useState('');
    const [redirectUrl, setRedirectUrl] = useState('');
    const [requiredInfo, setRequiredInfo] = useState<string[]>(['Name', 'Email']);
    const [newInfoField, setNewInfoField] = useState('');
    const [isAddingInfoField, setIsAddingInfoField] = useState(false);
    const [isUploadingIPFS, setIsUploadingIPFS] = useState(false);

    // Affiliate & Bundle
    const [affiliateEnabled, setAffiliateEnabled] = useState(false);
    const [affiliatePercent, setAffiliatePercent] = useState(15);
    const [bundleEnabled, setBundleEnabled] = useState(false);
    const [wholesalePrice, setWholesalePrice] = useState('');
    const [currentImageHash, setCurrentImageHash] = useState('');
    const [currentDigitalFileHash, setCurrentDigitalFileHash] = useState('');

    // Testimonial Discount
    const [testimonialDiscountEnabled, setTestimonialDiscountEnabled] = useState(false);
    const [testimonialDiscountPercent, setTestimonialDiscountPercent] = useState(10);
    const [testimonialDiscountLimit, setTestimonialDiscountLimit] = useState<number | ''>('');

    // Coaching / Webinar — availability scheduling
    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
    type Day = typeof DAYS[number];
    const [availTimezone, setAvailTimezone] = useState('America/Los_Angeles');
    const [sessionDuration, setSessionDuration] = useState(60);
    const [availSchedule, setAvailSchedule] = useState<{ day: Day; startTime: string; endTime: string }[]>([]);
    const [meetingUrl, setMeetingUrl] = useState('');

    // eCourse — curriculum
    type Lesson = { title: string; videoUrl: string; slidesUrl: string; description: string };
    type Module = { title: string; lessons: Lesson[] };
    const [curriculum, setCurriculum] = useState<Module[]>([]);

    // Community — gating
    const [discordInviteUrl, setDiscordInviteUrl] = useState('');

    // Merch / POD
    const [merchStoreLink, setMerchStoreLink] = useState('');
    const [merchFulfillment, setMerchFulfillment] = useState('Printful');
    const [merchSizes, setMerchSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
    const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
    const [merchColors, setMerchColors] = useState<{ name: string; hex: string }[]>([]);

    const { user, magic } = useMagic();
    const isOwner = user?.publicAddress?.toLowerCase() === process.env.NEXT_PUBLIC_OWNER_ADDRESS?.toLowerCase();
    const [isLocalTest, setIsLocalTest] = useState(!isOwner);

    const { addProduct, isPending: isAddPending, isConfirming: isAddConfirming, isSuccess: isAddSuccess, error: addError } = useAddProduct();
    const { updateProduct, isPending: isUpdatePending, isConfirming: isUpdateConfirming, isSuccess: isUpdateSuccess, error: updateError } = useUpdateProduct();

    // Fetch product data if in edit mode
    const { data: productData, isLoading: isProductLoading } = useProduct(editProductId || 0);

    // Dynamic discovery for ID generation
    const { productIds } = useAllProducts();

    // Populate form if editing
    useEffect(() => {
        if (editProductId && productData) {
            const p = productData as any;
            setProductId(editProductId.toString());
            setPrice(formatUnits(p.price, 6)); // USDC 6 decimals
            setIpfsHash(p.ipfsHash);
            setMaxSupply(p.maxSupply.toString());
            setStep('details');

            // Check demo metadata first for demo products
            const demoData = DEMO_METADATA[editProductId];
            if (demoData) {
                if (demoData.name) setProductName(demoData.name);
                if (demoData.description) setProductDescription(demoData.description);
                if (demoData.subtitle) setSubtitle(demoData.subtitle);
                if (demoData.bottomTitle) setBottomTitle(demoData.bottomTitle || '');
                if (demoData.callToAction) setCallToAction(demoData.callToAction);
                if (demoData.thumbnailStyle) setThumbnailStyle(demoData.thumbnailStyle as 'button' | 'callout');
                if (demoData.productType) setProductType(demoData.productType as ProductType);
                if (demoData.price) setPrice(demoData.price);
                if (demoData.redirectUrl) setRedirectUrl(demoData.redirectUrl);
                if (demoData.requiredInfo) setRequiredInfo(demoData.requiredInfo);
                return; // Skip IPFS fetch for demo products
            }

            // Fetch IPFS metadata to populate all form fields
            if (p.ipfsHash) {
                const fetchEditMetadata = async () => {
                    try {
                        // Try proxy API first
                        const res = await fetch(`/api/ipfs/fetch?hash=${p.ipfsHash}`);
                        if (res.ok) {
                            const data = await res.json();
                            if (data.name) setProductName(data.name);
                            if (data.description) setProductDescription(data.description);
                            if (data.subtitle) setSubtitle(data.subtitle);
                            if (data.bottomTitle) setBottomTitle(data.bottomTitle);
                            if (data.callToAction) setCallToAction(data.callToAction);
                            if (data.thumbnailStyle) setThumbnailStyle(data.thumbnailStyle);
                            if (data.productType) setProductType(data.productType as ProductType);
                            if (data.price) setPrice(data.price);
                            if (data.discountPrice) setDiscountPrice(data.discountPrice);
                            if (data.redirectUrl) setRedirectUrl(data.redirectUrl);
                            if (data.digitalFileHash) {
                                setDigitalFileHash(data.digitalFileHash);
                                setCurrentDigitalFileHash(data.digitalFileHash);
                            }
                            if (data.image) setCurrentImageHash(data.image.replace('ipfs://', ''));
                            if (data.requiredInfo) setRequiredInfo(data.requiredInfo);
                            if (data.consulting?.meetingUrl) setMeetingUrl(data.consulting.meetingUrl);

                            // Affiliate & Bundle settings
                            if (data.affiliateEnabled !== undefined) setAffiliateEnabled(data.affiliateEnabled);
                            if (data.affiliatePercent !== undefined) setAffiliatePercent(data.affiliatePercent);
                            if (data.bundleEnabled !== undefined) setBundleEnabled(data.bundleEnabled);
                            if (data.wholesalePrice !== undefined) setWholesalePrice(data.wholesalePrice);
                            if (data.testimonialDiscountPercent !== undefined) {
                                setTestimonialDiscountEnabled(true);
                                setTestimonialDiscountPercent(data.testimonialDiscountPercent);
                            }
                            return;
                        }
                        // Fallback to direct gateway
                        const fallback = await fetch(`https://gateway.pinata.cloud/ipfs/${p.ipfsHash}`);
                        if (fallback.ok) {
                            const data = await fallback.json();
                            if (data.name) setProductName(data.name);
                            if (data.description) setProductDescription(data.description);
                            if (data.subtitle) setSubtitle(data.subtitle);
                            if (data.bottomTitle) setBottomTitle(data.bottomTitle);
                            if (data.callToAction) setCallToAction(data.callToAction);
                            if (data.thumbnailStyle) setThumbnailStyle(data.thumbnailStyle);
                            if (data.productType) setProductType(data.productType as ProductType);
                            if (data.price) setPrice(data.price);
                            if (data.discountPrice) setDiscountPrice(data.discountPrice);
                            if (data.redirectUrl) setRedirectUrl(data.redirectUrl);
                            if (data.digitalFileHash) {
                                setDigitalFileHash(data.digitalFileHash);
                                setCurrentDigitalFileHash(data.digitalFileHash);
                            }
                            if (data.image) setCurrentImageHash(data.image.replace('ipfs://', ''));
                            if (data.requiredInfo) setRequiredInfo(data.requiredInfo);

                            // Affiliate & Bundle settings
                            if (data.affiliateEnabled !== undefined) setAffiliateEnabled(data.affiliateEnabled);
                            if (data.affiliatePercent !== undefined) setAffiliatePercent(data.affiliatePercent);
                            if (data.bundleEnabled !== undefined) setBundleEnabled(data.bundleEnabled);
                            if (data.wholesalePrice !== undefined) setWholesalePrice(data.wholesalePrice);
                            if (data.testimonialDiscountPercent !== undefined) {
                                setTestimonialDiscountEnabled(true);
                                setTestimonialDiscountPercent(data.testimonialDiscountPercent);
                            }
                        }
                    } catch (err) {
                        console.error('Failed to fetch edit metadata:', err);
                        toast.error('Could not load existing product details from IPFS.');
                    }
                };
                fetchEditMetadata();
            }
        }
    }, [editProductId, productData]);

    // Clear IPFS hash if details change to ensure user re-secures
    useEffect(() => {
        if (ipfsHash) setIpfsHash('');
    }, [productName, productDescription, subtitle, bottomTitle, callToAction, price, discountPrice, affiliateEnabled, affiliatePercent, bundleEnabled, wholesalePrice, imageFile, digitalFile, testimonialDiscountEnabled, testimonialDiscountPercent, testimonialDiscountLimit]);

    useEffect(() => {
        if (isAddSuccess || isUpdateSuccess) {
            toast.success(isAddSuccess ? 'Product added successfully!' : 'Product updated successfully!');
            resetForm();
            if (onSuccess) onSuccess();
        }
    }, [isAddSuccess, isUpdateSuccess]);

    useEffect(() => {
        if (addError || updateError) {
            toast.error('Transaction failed. Please try again.');
        }
    }, [addError, updateError]);

    const resetForm = () => {
        setStep('type');
        setProductType(null);
        setProductId('');
        setProductName('');
        setProductDescription('');
        setSubtitle('');
        setBottomTitle('');
        setCallToAction('');
        setThumbnailStyle('button');
        setPrice('');
        setDiscountPrice('');
        setIpfsHash('');
        setDigitalFileHash('');
        setRedirectUrl('');
        setMaxSupply('');
        setImageFile(null);
        setDigitalFile(null);
        setRequiredInfo(['Name', 'Email']);
        setAffiliateEnabled(false);
        setAffiliatePercent(15);
        setBundleEnabled(false);
        setWholesalePrice('');
        setTestimonialDiscountEnabled(false);
        setTestimonialDiscountPercent(10);
        setTestimonialDiscountLimit('');
    };

    const TYPE_TEMPLATES: Partial<Record<ProductType, () => void>> = {
        digital: () => {
            setProductName('Get My [Template/eBook/Guide] Now!');
            setSubtitle('Instant download delivered right to your inbox');
            setProductDescription('This guide will give you everything you need to achieve your goals.\n\nThis is for you if you want to:\n\n✅ Save hours of research\n\n✅ Get a proven system\n\n✅ Start seeing results immediately');
            setBottomTitle('Download Instantly');
            setCallToAction('Get Instant Access');
            setPrice('29');
            setThumbnailStyle('callout');
            setAffiliateEnabled(true);
            setAffiliatePercent(20);
        },
        coaching: () => {
            setProductName('Book a 1:1 Strategy Call with Me');
            setSubtitle('Limited spots available — reserve yours today');
            setProductDescription('On this 1:1 video call I will personally help you:\n\n✅ Give specific advice for your exact situation\n\n✅ Build a clear action plan to reach your goals\n\n✅ Answer all your questions live\n\nAfter booking you will receive a calendar invite with a Zoom link.');
            setBottomTitle('Work With Me 1:1');
            setCallToAction('Book My Call');
            setPrice('150');
            setRedirectUrl('https://cal.com/your-username');
        },
        course: () => {
            setProductName('Master [Skill] — Complete eCourse');
            setSubtitle('Self-paced. Lifetime access. Real results.');
            setProductDescription('This comprehensive course walks you step-by-step through everything you need to master [Skill].\n\n✅ Module 1: Foundation\n\n✅ Module 2: Core Skills\n\n✅ Module 3: Advanced Techniques\n\n✅ Module 4: Real World Projects\n\nYou will get lifetime access to all lessons plus any future updates.');
            setBottomTitle('Start Learning Today');
            setCallToAction('Enroll Now');
            setPrice('99');
            setThumbnailStyle('callout');
            setAffiliateEnabled(true);
            setAffiliatePercent(25);
        },
        membership: () => {
            setProductName('[Your Community] Premium Membership');
            setSubtitle('Monthly access to exclusive content and community');
            setProductDescription('Join our growing community of [X] members and get:\n\n✅ Weekly exclusive content drops\n\n✅ Private Discord access\n\n✅ Monthly live Q&A sessions\n\n✅ Priority support and feedback\n\nCancel anytime — no lock in.');
            setBottomTitle('Join the Inner Circle');
            setCallToAction('Become a Member');
            setPrice('19');
            setRedirectUrl('https://discord.gg/your-server');
            setAffiliateEnabled(true);
            setAffiliatePercent(30);
        },
        community: () => {
            setProductName('Join [Your Group Name]');
            setSubtitle('Private access to an exclusive community of like-minded people');
            setProductDescription('After purchase you will receive an invite link to our private group where you can:\n\n✅ Connect with [X]+ members\n\n✅ Get daily tips and resources\n\n✅ Share wins and get accountability\n\n✅ Access our resource library');
            setBottomTitle('Join the Community');
            setCallToAction('Get Access');
            setPrice('9');
            setRedirectUrl('https://discord.gg/your-server');
        },
        webinar: () => {
            setProductName('[Topic] — Live Webinar Training');
            setSubtitle('Join us live on [Date] at [Time] — Recording included');
            setProductDescription('In this live training you will learn:\n\n✅ How to [Key outcome 1]\n\n✅ The exact system for [Key outcome 2]\n\n✅ Common mistakes and how to avoid them\n\nA recording will be sent to all registrants within 24 hours.');
            setBottomTitle('Reserve Your Seat');
            setCallToAction('Register Now');
            setPrice('49');
            setRedirectUrl('https://zoom.us/j/your-meeting-id');
        },
        url: () => {
            setProductName('Access to [Private Resource]');
            setSubtitle('Instant access delivered after purchase');
            setProductDescription('After purchase you will receive immediate access to:\n\n✅ [Resource description]\n\nThis exclusive link is only shared with paying customers.');
            setBottomTitle('Get Instant Access');
            setCallToAction('Unlock Now');
            setPrice('5');
            setRedirectUrl('https://your-private-link.com');
        },
        custom: () => {
            setProductName('My [Product/Service] Offer');
            setSubtitle('Describe what makes this special');
            setProductDescription('Tell your buyers exactly what they will get.\n\n✅ Benefit 1\n\n✅ Benefit 2\n\n✅ Benefit 3\n\nInclude any delivery details or next steps after purchase.');
            setBottomTitle('Get Started');
            setCallToAction('Buy Now');
            setPrice('49');
        },
        merch: () => {
            setProductName('My [Merch Name] Collection');
            setSubtitle('Premium print-on-demand apparel');
            setProductDescription('Exclusive merch designed for my community.\n\n✅ High-quality print-on-demand\n✅ Ships directly to you\n✅ Multiple sizes and colors available\n\nSelect your size and color, then complete checkout to order.');
            setBottomTitle('Order Your Merch');
            setCallToAction('Order Now');
            setPrice('39');
            setAffiliateEnabled(true);
            setAffiliatePercent(15);
            setMerchSizes(['S', 'M', 'L', 'XL', '2XL']);
        },
    };

    const TYPE_TIPS: Record<ProductType, string> = {
        digital: '💡 Upload your file in Section 4 below. Buyers will receive the download link after purchase.',
        coaching: '💡 Set your weekly availability below — buyers will see your open slots. Paste your Cal.com or Calendly link in Redirect URL.',
        course: '💡 Build your course outline below. Add modules and lessons with video + slide links.',
        membership: '💡 Paste your Discord or community invite link in "Redirect URL". Members get access after payment.',
        community: '💡 Buyers receive an NFT on purchase. Set up Collab.Land in your Discord server to gate access with it.',
        webinar: '💡 Set your availability below, then add your Zoom or event link in "Redirect URL".',
        merch: '💡 Paste your Printful / Printify / Spring product URL in the Merch section below, add your mockup images, and set sizes + colors.',
        url: '💡 Add the private URL in "Redirect URL" below. Buyers are redirected there instantly after purchase.',
        custom: '💡 Describe exactly what the buyer gets and how it will be delivered in the description.',
    };

    const handleTypeSelect = (type: ProductType) => {
        setProductType(type);
        setStep('details');
        TYPE_TEMPLATES[type]?.();

        // Auto-fill Product ID with next number if not editing
        if (!productId && !editProductId) {
            const maxId = productIds.length > 0 ? Math.max(...productIds) : 6;
            setProductId((maxId + 1).toString());
        }
    };

    const handleBack = () => {
        if (editProductId) {
            if (onCancel) onCancel();
        } else {
            setStep('type');
        }
    };

    const handleUploadToIPFS = async () => {
        if (!productName || !productDescription || !price) {
            toast.error('Please fill in product name, description, and price first');
            return;
        }

        if (productType === 'digital' && !digitalFile && !currentDigitalFileHash && !redirectUrl) {
            toast.error('Please upload a digital asset or provide an external link');
            return;
        }

        setIsUploadingIPFS(true);
        toast.loading('Uploading to IPFS...', { id: 'ipfs-upload' });

        try {
            let imageHash = '';
            let fileHash = '';

            if (imageFile) {
                imageHash = await uploadImageToIPFS(imageFile);
            } else if (currentImageHash) {
                imageHash = currentImageHash;
            }

            if (digitalFile) {
                fileHash = await uploadImageToIPFS(digitalFile);
                setDigitalFileHash(fileHash);
            } else if (currentDigitalFileHash) {
                fileHash = currentDigitalFileHash;
                setDigitalFileHash(fileHash);
            }

            const metadata: ProductMetadata = {
                name: productName,
                description: productDescription,
                subtitle: subtitle || undefined,
                bottomTitle: bottomTitle || undefined,
                callToAction: callToAction || undefined,
                thumbnailStyle: thumbnailStyle,
                productType: productType || 'digital',
                price: price,
                discountPrice: discountPrice || undefined,
                image: imageHash ? `ipfs://${imageHash}` : undefined,
                digitalFileHash: fileHash || undefined,
                redirectUrl: redirectUrl || undefined,
                requiredInfo: requiredInfo,
                affiliateEnabled: affiliateEnabled,
                affiliatePercent: affiliateEnabled ? affiliatePercent : undefined,
                bundleEnabled: bundleEnabled,
                wholesalePrice: bundleEnabled && wholesalePrice ? wholesalePrice : undefined,
                testimonialDiscountPercent: testimonialDiscountEnabled ? testimonialDiscountPercent : undefined,
                testimonialDiscountLimit: testimonialDiscountEnabled && testimonialDiscountLimit !== '' ? Number(testimonialDiscountLimit) : undefined,
                // Coaching / Webinar availability
                availability: (productType === 'coaching' || productType === 'webinar') && availSchedule.length > 0 ? {
                    timezone: availTimezone,
                    sessionDuration,
                    schedule: availSchedule,
                } : undefined,
                consulting: (productType === 'coaching' || productType === 'webinar') && meetingUrl ? {
                    meetingUrl
                } : undefined,
                // eCourse curriculum
                curriculum: productType === 'course' && curriculum.length > 0 ? { modules: curriculum } : undefined,
                // Community gating
                communityGating: productType === 'community' && discordInviteUrl ? {
                    discordInviteUrl,
                    gatingType: 'nft',
                } : undefined,
                // Merch / POD
                merch: productType === 'merch' && merchStoreLink ? {
                    storeLink: merchStoreLink,
                    fulfillmentPartner: merchFulfillment || undefined,
                    sizes: merchSizes.length > 0 ? merchSizes : undefined,
                    colors: merchColors.length > 0 ? merchColors : undefined,
                } : undefined,
                attributes: [
                    { trait_type: 'Product Type', value: productType || 'digital' },
                    { trait_type: 'Original Price', value: `$${price}` },
                    { trait_type: 'Discount Price', value: discountPrice ? `$${discountPrice}` : 'None' },
                    ...(affiliateEnabled ? [{ trait_type: 'Affiliate Commission', value: `${affiliatePercent}%` }] : []),
                ],
            };

            const hash = await uploadToIPFS(metadata);
            setIpfsHash(hash);
            toast.success(`Uploaded to IPFS! Hash: ${hash}`, { id: 'ipfs-upload' });
        } catch (error: any) {
            console.error('IPFS upload error:', error);
            toast.error(error?.message || 'Failed to upload to IPFS', { id: 'ipfs-upload' });
        } finally {
            setIsUploadingIPFS(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!productId || !price || !ipfsHash) {
            toast.error('Please fill in all required fields and upload to IPFS');
            return;
        }

        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum <= 0) {
            toast.error('Price must be greater than 0');
            return;
        }

        const supply = maxSupply === '' ? 0 : parseInt(maxSupply);

        const finalPrice = discountPrice !== '' ? discountPrice : price;

        if (isLocalTest && !editProductId) {
            // Save to LocalStorage
            const TEST_PRODUCTS_KEY = 'owned-local-products';
            const localData = localStorage.getItem(TEST_PRODUCTS_KEY);
            let localProducts = localData ? JSON.parse(localData) : {};

            localProducts[productId] = {
                creator: user?.publicAddress?.toLowerCase() || '',
                name: productName,
                description: productDescription,
                price: finalPrice,
                ipfsHash: ipfsHash,
                maxSupply: supply,
                productType: productType,
                image: currentImageHash ? `ipfs://${currentImageHash}` : undefined,
                affiliateEnabled,
                affiliatePercent,
                bundleEnabled,
                wholesalePrice,
                testimonialDiscountPercent: testimonialDiscountEnabled ? testimonialDiscountPercent : undefined,
                testimonialDiscountLimit: testimonialDiscountEnabled && testimonialDiscountLimit !== '' ? Number(testimonialDiscountLimit) : undefined
            };

            localStorage.setItem(TEST_PRODUCTS_KEY, JSON.stringify(localProducts));
            toast.success('Test product created locally!');
            resetForm();
            if (onSuccess) onSuccess();
            return;
        }

        if (editProductId) {
            updateProduct(parseInt(productId), finalPrice, ipfsHash, supply);
        } else {
            addProduct(parseInt(productId), finalPrice, ipfsHash, supply);
        }
    };

    const isLoading = isAddPending || isAddConfirming || isUpdatePending || isUpdateConfirming || isProductLoading;

    if (step === 'type' && !editProductId) {
        return <ProductTypeSelector onSelect={handleTypeSelect} />;
    }

    const getProductTypeLabel = () => {
        const labels: Record<ProductType, string> = {
            digital: 'Digital Product',
            coaching: 'Coaching Call',
            custom: 'Custom Product',
            course: 'eCourse',
            membership: 'Recurring Membership',
            webinar: 'Webinar',
            community: 'Community',
            url: 'Direct Link',
            merch: 'Merch / POD',
        };
        return productType ? labels[productType] : editProductId ? 'Edit Product' : '';
    };

    return (
        <div className="space-y-10">
            <div className="flex items-center gap-6">
                <button
                    onClick={handleBack}
                    type="button"
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-border shadow-sm hover:shadow-saas hover:border-primary/30 transition-all text-muted-foreground"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <div>
                    <h3 className="text-3xl font-extrabold tracking-tight">{getProductTypeLabel()}</h3>
                    <p className="text-sm text-muted-foreground font-medium">
                        {editProductId ? 'Update your product details and pricing.' : `Configure your ${productType === 'coaching' ? 'booking' : 'checkout'} experience.`}
                    </p>
                </div>
            </div>

            {/* Onboarding Tip Banner */}
            {productType && !editProductId && (
                <div className="px-5 py-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800 font-medium">
                    {TYPE_TIPS[productType]}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-16 max-w-3xl pb-32">
                {/* Style Selection */}
                <div className="space-y-8 glass-card p-1">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary text-primary-foreground text-sm font-black shadow-saas">1</span>
                        <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Pick a style</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-6 px-1">
                        <button
                            type="button"
                            onClick={() => setThumbnailStyle('button')}
                            className={`p-6 border-2 rounded-3xl transition-all text-left space-y-4 group ${thumbnailStyle === 'button' ? 'border-primary bg-primary/5 shadow-saas' : 'border-border bg-white hover:border-primary/20 hover:shadow-sm'}`}
                        >
                            <div className="h-20 w-full bg-slate-50 rounded-2xl flex items-center justify-center border border-border">
                                <div className="px-4 py-2 bg-white rounded-xl shadow-sm transform group-hover:scale-105 transition-transform">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Standard Card</span>
                                </div>
                            </div>
                            <p className="text-sm font-bold uppercase tracking-widest text-center text-foreground">Classic List</p>
                        </button>
                        <button
                            type="button"
                            onClick={() => setThumbnailStyle('callout')}
                            className={`p-6 border-2 rounded-3xl transition-all text-left space-y-4 group ${thumbnailStyle === 'callout' ? 'border-primary bg-primary/5 shadow-saas' : 'border-border bg-white hover:border-primary/20 hover:shadow-sm'}`}
                        >
                            <div className="h-20 w-full bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/20">
                                <div className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl shadow-saas transform group-hover:scale-105 transition-transform">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Premium Card</span>
                                </div>
                            </div>
                            <p className="text-sm font-bold uppercase tracking-widest text-center text-foreground">Featured Highlight</p>
                        </button>
                    </div>
                </div>

                {/* Visual Asset */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary text-primary-foreground text-sm font-black shadow-saas">2</span>
                        <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Visual Asset</h4>
                    </div>
                    <div className="p-16 border-2 border-dashed border-border bg-white rounded-4xl text-center relative group hover:border-primary transition-colors">
                        {imageFile ? (
                            <div className="absolute inset-4 rounded-3xl overflow-hidden shadow-saas">
                                <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-white text-primary text-xs px-6 py-2.5 rounded-full uppercase tracking-widest font-black shadow-lg">Change Image</span>
                                </div>
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    className="w-full h-full object-cover"
                                    alt="Preview"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-5 bg-slate-50 rounded-3xl text-3xl group-hover:scale-110 transition-transform">🖼️</div>
                                <div className="space-y-2">
                                    <p className="text-lg font-bold">Drop your product cover here</p>
                                    <p className="text-sm text-muted-foreground font-medium italic">Recommended: 1200x630px · JPG, PNG, WEBP</p>
                                </div>
                            </div>
                        )}
                        <input
                            type="file"
                            id="productImage"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                </div>

                {/* Product Details */}
                <div className="space-y-10">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary text-primary-foreground text-sm font-black shadow-saas">3</span>
                        <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Product Details</h4>
                    </div>

                    <div className="space-y-8 bg-white border border-border p-10 rounded-4xl shadow-sm">
                        <div className="space-y-2">
                            <label htmlFor="productName" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                Product Title *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="productName"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value.slice(0, 50))}
                                    className="w-full px-5 py-4 bg-slate-50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-xl transition-all"
                                    placeholder="Get My [Template/eBook/Course] Now!"
                                    required
                                    disabled={isLoading}
                                />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground bg-white px-2 py-1 rounded-lg border border-border">{productName.length}/50</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="subtitle" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                Subtitle
                            </label>
                            <input
                                type="text"
                                id="subtitle"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value.slice(0, 100))}
                                className="w-full px-5 py-4 bg-slate-50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-lg transition-all"
                                placeholder="We will deliver this file right to your inbox"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="productDescription" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                Description *
                            </label>
                            <RichTextEditor
                                value={productDescription}
                                onChange={setProductDescription}
                                placeholder="Tell your customers exactly what they are getting..."
                                disabled={isLoading}
                                minHeight="200px"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div className="space-y-2">
                                <label htmlFor="bottomTitle" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                    Checkout Heading *
                                </label>
                                <input
                                    type="text"
                                    id="bottomTitle"
                                    value={bottomTitle}
                                    onChange={(e) => setBottomTitle(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-lg transition-all"
                                    placeholder="Secure Your Access"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="callToAction" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                    CTA Button *
                                </label>
                                <input
                                    type="text"
                                    id="callToAction"
                                    value={callToAction}
                                    onChange={(e) => setCallToAction(e.target.value.slice(0, 30))}
                                    className="w-full px-5 py-4 bg-slate-50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-black uppercase tracking-widest transition-all"
                                    placeholder="PURCHASE"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border border-dashed">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                Required Customer Information
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {requiredInfo.map((info) => (
                                    <div key={info} className="px-4 py-2 bg-slate-100 text-slate-900 rounded-xl flex items-center gap-2 group border border-border">
                                        <span className="text-sm font-bold">{info}</span>
                                        <button
                                            type="button"
                                            onClick={() => setRequiredInfo(requiredInfo.filter(i => i !== info))}
                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                ))}
                                {isAddingInfoField ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newInfoField}
                                            onChange={(e) => setNewInfoField(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (newInfoField.trim() && !requiredInfo.includes(newInfoField.trim())) {
                                                        setRequiredInfo([...requiredInfo, newInfoField.trim()]);
                                                    }
                                                    setNewInfoField('');
                                                    setIsAddingInfoField(false);
                                                }
                                            }}
                                            placeholder="e.g. Phone Number"
                                            className="px-4 py-2 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium"
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (newInfoField.trim() && !requiredInfo.includes(newInfoField.trim())) {
                                                    setRequiredInfo([...requiredInfo, newInfoField.trim()]);
                                                }
                                                setNewInfoField('');
                                                setIsAddingInfoField(false);
                                            }}
                                            className="px-3 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors"
                                        >
                                            Add
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNewInfoField('');
                                                setIsAddingInfoField(false);
                                            }}
                                            className="px-2 py-2 text-muted-foreground hover:text-slate-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingInfoField(true)}
                                        className="px-4 py-2 border-2 border-dashed border-border rounded-xl text-xs font-bold text-muted-foreground hover:border-primary hover:text-primary transition-all"
                                    >
                                        + Add Field
                                    </button>
                                )}
                            </div>
                            <p className="text-[10px] text-muted-foreground italic">These fields will be requested during checkout and stored on IPFS.</p>
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary text-primary-foreground text-sm font-black shadow-saas">4</span>
                        <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Pricing</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-white border border-border p-10 rounded-4xl shadow-sm">
                        <div className="space-y-2">
                            <label htmlFor="price" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                Original Price (USDC)
                            </label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">$</span>
                                <input
                                    type="text"
                                    id="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full pl-10 pr-5 py-5 bg-slate-50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-black text-2xl italic tracking-tight transition-all"
                                    placeholder="97.00"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="discountPrice" className="text-xs font-bold uppercase tracking-widest text-primary ml-1">
                                Discounted Price (USDC)
                            </label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-primary">$</span>
                                <input
                                    type="text"
                                    id="discountPrice"
                                    value={discountPrice}
                                    onChange={(e) => setDiscountPrice(e.target.value)}
                                    className="w-full pl-10 pr-5 py-5 bg-white border-2 border-primary rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 font-black text-2xl italic tracking-tight transition-all"
                                    placeholder="0 for FREE"
                                    disabled={isLoading}
                                />
                            </div>
                            <p className="text-[10px] text-primary/70 font-bold uppercase tracking-widest mt-1 ml-1">The actual price paid on-chain.</p>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="maxSupply" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                Max Supply (0 for ∞)
                            </label>
                            <input
                                type="number"
                                id="maxSupply"
                                value={maxSupply}
                                onChange={(e) => setMaxSupply(e.target.value)}
                                className="w-full px-5 py-5 bg-slate-50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-xl transition-all"
                                placeholder="0"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                {/* Affiliate & Resale */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary text-primary-foreground text-sm font-black shadow-saas">5</span>
                        <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Affiliate & Resale</h4>
                    </div>

                    <div className="bg-white border border-border p-10 rounded-4xl shadow-sm space-y-8">
                        {/* Allow Affiliates */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="font-bold text-foreground">Allow Affiliate Reselling</p>
                                <p className="text-sm text-muted-foreground">Let others promote and resell this product for a commission</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setAffiliateEnabled(!affiliateEnabled)}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${affiliateEnabled ? 'bg-primary' : 'bg-slate-200'}`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${affiliateEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        {/* Commission Slider */}
                        {affiliateEnabled && (
                            <div className="space-y-4 pl-1">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                        Commission Rate
                                    </label>
                                    <span className="text-2xl font-black italic text-primary tracking-tight">{affiliatePercent}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="50"
                                    step="5"
                                    value={affiliatePercent}
                                    onChange={(e) => setAffiliatePercent(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    <span>5%</span>
                                    <span>25%</span>
                                    <span>50%</span>
                                </div>
                                <p className="text-xs text-muted-foreground italic">
                                    Affiliates earn {affiliatePercent}% (${price ? (parseFloat(price) * affiliatePercent / 100).toFixed(2) : '0.00'}) per sale they generate.
                                </p>
                            </div>
                        )}

                        <div className="border-t border-border border-dashed pt-8" />

                        {/* Allow Bundling */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="font-bold text-foreground">Allow Bundle Inclusion</p>
                                <p className="text-sm text-muted-foreground">Let other creators include this product in their curated bundles</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setBundleEnabled(!bundleEnabled)}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${bundleEnabled ? 'bg-primary' : 'bg-slate-200'}`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${bundleEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        {bundleEnabled && (
                            <div className="space-y-4 pl-1">
                                <p className="text-xs text-muted-foreground italic">
                                    Other creators can include this product in their bundles. They'll pay the affiliate commission rate above per sale.
                                </p>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                        Wholesale / Bundle Price (USDC)
                                    </label>
                                    <div className="relative max-w-xs">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">$</span>
                                        <input
                                            type="text"
                                            value={wholesalePrice}
                                            onChange={(e) => setWholesalePrice(e.target.value)}
                                            className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-lg transition-all"
                                            placeholder={price ? (parseFloat(price) * 0.7).toFixed(2) : '0.00'}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground italic">
                                        Optional. Leave blank to use the full retail price. This is the price affiliates pay you when including this product in a bundle.
                                    </p>
                                </div>
                                <p className="text-[10px] text-muted-foreground italic mt-2">
                                    Leave blank to offer the discount indefinitely, or set a limit to create urgency.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Testimonial Discount ── */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500 text-white text-sm font-black shadow-saas">⭐</span>
                        <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Community Testimonials</h4>
                    </div>

                    <div className="bg-white border border-border p-10 rounded-4xl shadow-sm space-y-8">
                        {/* Allow Testimonial Discount */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="font-bold text-foreground">Offer Testimonial Discount</p>
                                <p className="text-sm text-muted-foreground">Give buyers an upfront discount in exchange for a community review within 7 days.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setTestimonialDiscountEnabled(!testimonialDiscountEnabled)}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${testimonialDiscountEnabled ? 'bg-primary' : 'bg-slate-200'}`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${testimonialDiscountEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        {/* Discount Slider */}
                        {testimonialDiscountEnabled && (
                            <div className="space-y-4 pl-1">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                        Discount Rate
                                    </label>
                                    <span className="text-2xl font-black italic text-primary tracking-tight">{testimonialDiscountPercent}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="50"
                                    step="5"
                                    value={testimonialDiscountPercent}
                                    onChange={(e) => setTestimonialDiscountPercent(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    <span>5%</span>
                                    <span>25%</span>
                                    <span>50%</span>
                                </div>
                                <p className="text-xs text-muted-foreground italic mb-6">
                                    Buyers save {testimonialDiscountPercent}% upfront. They agree to provide a high-quality community testimonial later.
                                </p>

                                <div className="space-y-2 mt-4 pt-4 border-t border-dashed border-border">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                        Limit Discount Quantity (Optional)
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            min="1"
                                            value={testimonialDiscountLimit}
                                            onChange={(e) => setTestimonialDiscountLimit(e.target.value === '' ? '' : parseInt(e.target.value))}
                                            className="w-32 px-4 py-3 bg-slate-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                                            placeholder="e.g. 10"
                                        />
                                        <span className="text-sm font-bold text-muted-foreground">sales only</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Digital Asset (digital) ── */}
                {productType === 'digital' && (
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-500 text-white text-sm font-black shadow-saas">💻</span>
                            <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Digital Asset</h4>
                        </div>
                        <div className="bg-white border border-border rounded-4xl p-8 space-y-8">

                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Upload File</label>
                                <div className="p-10 border-2 border-dashed border-border bg-slate-50 rounded-3xl text-center relative group hover:border-primary transition-colors">
                                    {digitalFile ? (
                                        <div className="space-y-2 relative z-10 pointer-events-none">
                                            <div className="text-4xl">📄</div>
                                            <p className="text-sm font-bold text-primary">{digitalFile.name}</p>
                                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">({(digitalFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                                        </div>
                                    ) : currentDigitalFileHash ? (
                                        <div className="space-y-2 relative z-10 pointer-events-none">
                                            <div className="text-3xl">✅</div>
                                            <p className="text-sm font-bold text-primary">File previously uploaded</p>
                                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest break-all px-4">{currentDigitalFileHash}</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3 relative z-10 pointer-events-none">
                                            <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform text-2xl">📥</div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-foreground">Click or Drag to Upload File</p>
                                                <p className="text-[11px] text-muted-foreground font-medium italic">Max 100MB (PDF, ZIP, MP4, etc.)</p>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        onChange={(e) => setDigitalFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="h-px bg-border flex-1"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">OR</span>
                                <div className="h-px bg-border flex-1"></div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Provide External Link</label>
                                <input
                                    type="url"
                                    value={redirectUrl}
                                    onChange={(e) => setRedirectUrl(e.target.value)}
                                    placeholder="https://google.com/drive/..."
                                    className="w-full px-5 py-4 bg-slate-50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                                />
                                <p className="text-[10px] text-muted-foreground italic">If you provide a link instead of uploading a file, buyers will be redirected here after purchase.</p>
                            </div>

                        </div>
                    </div>
                )}

                {/* ── Availability Scheduler (coaching / webinar) ── */}
                {(productType === 'coaching' || productType === 'webinar') && (
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500 text-white text-sm font-black shadow-saas">📅</span>
                            <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Availability Schedule</h4>
                        </div>
                        <div className="bg-white border border-border rounded-4xl p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Timezone</label>
                                    <select
                                        value={availTimezone}
                                        onChange={e => setAvailTimezone(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                                    >
                                        {['America/Los_Angeles', 'America/Denver', 'America/Chicago', 'America/New_York', 'America/Sao_Paulo', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney'].map(tz => (
                                            <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Session Duration</label>
                                    <select
                                        value={sessionDuration}
                                        onChange={e => setSessionDuration(parseInt(e.target.value))}
                                        className="w-full px-4 py-3 bg-slate-50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                                    >
                                        {[15, 30, 45, 60, 90, 120].map(m => (
                                            <option key={m} value={m}>{m} minutes</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Available Days & Windows</label>
                                {DAYS.map(day => {
                                    const slot = availSchedule.find(s => s.day === day);
                                    return (
                                        <div key={day} className="flex items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (slot) {
                                                        setAvailSchedule(availSchedule.filter(s => s.day !== day));
                                                    } else {
                                                        setAvailSchedule([...availSchedule, { day, startTime: '09:00', endTime: '17:00' }]);
                                                    }
                                                }}
                                                className={`w-14 text-center px-2 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${slot ? 'bg-primary text-primary-foreground border-primary' : 'bg-white border-border text-muted-foreground'
                                                    }`}
                                            >{day}</button>
                                            {slot && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <input type="time" value={slot.startTime}
                                                        onChange={e => setAvailSchedule(availSchedule.map(s => s.day === day ? { ...s, startTime: e.target.value } : s))}
                                                        className="px-3 py-1.5 bg-slate-50 border border-border rounded-xl font-medium text-sm" />
                                                    <span className="text-muted-foreground font-bold">→</span>
                                                    <input type="time" value={slot.endTime}
                                                        onChange={e => setAvailSchedule(availSchedule.map(s => s.day === day ? { ...s, endTime: e.target.value } : s))}
                                                        className="px-3 py-1.5 bg-slate-50 border border-border rounded-xl font-medium text-sm" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="space-y-2 pt-6 border-t border-border border-dashed">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    Online Meeting Link
                                </label>
                                <input
                                    type="url"
                                    value={meetingUrl}
                                    onChange={(e) => setMeetingUrl(e.target.value)}
                                    placeholder="e.g. https://zoom.us/j/123456789 or https://meet.google.com/abc-defg-hij"
                                    className="w-full px-5 py-4 bg-slate-50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium transition-all"
                                />
                                <p className="text-[10px] text-muted-foreground italic">
                                    Buyers will receive this link natively on checkout and in their calendar invite after purchasing a session.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Course / Module Builder (course) ── */}
                {productType === 'course' && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-500 text-white text-sm font-black shadow-saas">🎓</span>
                                <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Course Curriculum</h4>
                            </div>
                            <button
                                type="button"
                                onClick={() => setCurriculum([...curriculum, { title: `Module ${curriculum.length + 1}`, lessons: [] }])}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all"
                            >+ Add Module</button>
                        </div>
                        <div className="space-y-4">
                            {curriculum.map((mod, mi) => (
                                <div key={mi} className="bg-white border border-border rounded-3xl p-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black text-muted-foreground uppercase tracking-widest w-20">Module {mi + 1}</span>
                                        <input
                                            type="text"
                                            value={mod.title}
                                            onChange={e => setCurriculum(curriculum.map((m, i) => i === mi ? { ...m, title: e.target.value } : m))}
                                            className="flex-1 px-4 py-2 bg-slate-50 border border-border rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Module title..."
                                        />
                                        <button type="button" onClick={() => setCurriculum(curriculum.filter((_, i) => i !== mi))}
                                            className="text-slate-400 hover:text-red-500 transition-colors text-xs">✕</button>
                                    </div>
                                    <div className="pl-6 space-y-3">
                                        {mod.lessons.map((lesson, li) => (
                                            <div key={li} className="grid grid-cols-1 gap-2 p-4 bg-slate-50 rounded-2xl border border-border">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-muted-foreground uppercase w-16">Lesson {li + 1}</span>
                                                    <input type="text" value={lesson.title} placeholder="Lesson title"
                                                        onChange={e => setCurriculum(curriculum.map((m, i) => i === mi ? { ...m, lessons: m.lessons.map((l, j) => j === li ? { ...l, title: e.target.value } : l) } : m))}
                                                        className="flex-1 px-3 py-1.5 bg-white border border-border rounded-xl text-sm font-medium focus:outline-none"
                                                    />
                                                    <button type="button" onClick={() => setCurriculum(curriculum.map((m, i) => i === mi ? { ...m, lessons: m.lessons.filter((_, j) => j !== li) } : m))}
                                                        className="text-slate-300 hover:text-red-400 transition-colors text-xs">✕</button>
                                                </div>
                                                <input type="url" value={lesson.videoUrl} placeholder="Video URL (YouTube / Vimeo)"
                                                    onChange={e => setCurriculum(curriculum.map((m, i) => i === mi ? { ...m, lessons: m.lessons.map((l, j) => j === li ? { ...l, videoUrl: e.target.value } : l) } : m))}
                                                    className="px-3 py-1.5 bg-white border border-border rounded-xl text-xs font-medium focus:outline-none w-full"
                                                />
                                                <input type="url" value={lesson.slidesUrl} placeholder="Slides URL (Google Slides / Notion)"
                                                    onChange={e => setCurriculum(curriculum.map((m, i) => i === mi ? { ...m, lessons: m.lessons.map((l, j) => j === li ? { ...l, slidesUrl: e.target.value } : l) } : m))}
                                                    className="px-3 py-1.5 bg-white border border-border rounded-xl text-xs font-medium focus:outline-none w-full"
                                                />
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setCurriculum(curriculum.map((m, i) => i === mi ? { ...m, lessons: [...m.lessons, { title: '', videoUrl: '', slidesUrl: '', description: '' }] } : m))}
                                            className="text-xs font-bold text-primary hover:underline"
                                        >+ Add Lesson</button>
                                    </div>
                                </div>
                            ))}
                            {curriculum.length === 0 && (
                                <div className="border-2 border-dashed border-border rounded-3xl p-10 text-center text-muted-foreground">
                                    <p className="text-sm font-medium">No modules yet. Click &quot;Add Module&quot; to start building your course.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Community / Discord NFT Gate (community) ── */}
                {productType === 'community' && (
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-500 text-white text-sm font-black shadow-saas">🤝</span>
                            <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">NFT Community Access</h4>
                        </div>
                        <div className="bg-white border border-border rounded-4xl p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Discord Invite URL</label>
                                <input
                                    type="url"
                                    value={discordInviteUrl}
                                    onChange={e => setDiscordInviteUrl(e.target.value)}
                                    placeholder="https://discord.gg/your-server"
                                    className="w-full px-5 py-4 bg-slate-50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                                />
                            </div>
                            <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-3">
                                <p className="text-xs font-black uppercase tracking-widest text-indigo-700">🔐 How NFT Gating Works</p>
                                <ol className="text-sm text-indigo-800 space-y-1.5 list-decimal list-inside">
                                    <li>Buyer purchases → an ERC-721 NFT is minted to their wallet automatically.</li>
                                    <li>Add the <strong>Collab.Land</strong> bot to your Discord server.</li>
                                    <li>In Collab.Land, create a Token Role with the contract address shown below.</li>
                                    <li>Members holding the NFT can verify and receive their Discord role.</li>
                                </ol>
                                <p className="text-[11px] text-indigo-600 font-mono mt-2">Contract: {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '(deploy to see address)'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Merch / Print-on-Demand (merch) ── */}
                {productType === 'merch' && (
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-orange-500 text-white text-sm font-black shadow-saas">👕</span>
                            <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Merch Details</h4>
                        </div>
                        <div className="bg-white border border-border rounded-4xl p-8 space-y-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">POD Store Link</label>
                                <input
                                    type="url"
                                    value={merchStoreLink}
                                    onChange={e => setMerchStoreLink(e.target.value)}
                                    placeholder="https://printful.com/my-product or spring.com/..."
                                    className="w-full px-5 py-4 bg-slate-50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Fulfillment Partner</label>
                                <select
                                    value={merchFulfillment}
                                    onChange={e => setMerchFulfillment(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                                >
                                    {['Printful', 'Printify', 'Spring / Teespring', 'Inkbase', 'Gelato', 'Other'].map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Available Sizes</label>
                                <div className="flex flex-wrap gap-2">
                                    {ALL_SIZES.map(size => (
                                        <button
                                            key={size} type="button"
                                            onClick={() => setMerchSizes(merchSizes.includes(size) ? merchSizes.filter(s => s !== size) : [...merchSizes, size])}
                                            className={`px-4 py-2 rounded-xl border-2 text-sm font-black uppercase tracking-widest transition-all ${merchSizes.includes(size) ? 'bg-primary text-primary-foreground border-primary' : 'bg-white border-border text-muted-foreground'
                                                }`}
                                        >{size}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Available Colors</label>
                                    <button
                                        type="button"
                                        onClick={() => setMerchColors([...merchColors, { name: '', hex: '#000000' }])}
                                        className="text-xs font-bold text-primary hover:underline"
                                    >+ Add Color</button>
                                </div>
                                <div className="space-y-2">
                                    {merchColors.map((color, ci) => (
                                        <div key={ci} className="flex items-center gap-3">
                                            <input
                                                type="color" value={color.hex}
                                                onChange={e => setMerchColors(merchColors.map((c, i) => i === ci ? { ...c, hex: e.target.value } : c))}
                                                className="w-10 h-10 rounded-xl border border-border cursor-pointer"
                                            />
                                            <input
                                                type="text" value={color.name} placeholder="Color name (e.g. Black, Forest Green)"
                                                onChange={e => setMerchColors(merchColors.map((c, i) => i === ci ? { ...c, name: e.target.value } : c))}
                                                className="flex-1 px-4 py-2 bg-slate-50 border border-border rounded-xl text-sm font-medium focus:outline-none"
                                            />
                                            <button type="button" onClick={() => setMerchColors(merchColors.filter((_, i) => i !== ci))}
                                                className="text-slate-400 hover:text-red-500 transition-colors">✕</button>
                                        </div>
                                    ))}
                                    {merchColors.length === 0 && (
                                        <p className="text-xs text-muted-foreground italic">No colors added yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Submission */}
                <div className="fixed bottom-0 left-0 right-0 md:sticky md:bottom-8 bg-white/80 backdrop-blur-xl border-t md:border border-border p-6 md:p-8 md:rounded-4xl z-[100] shadow-saas-lg md:mx-auto">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
                        <div className="flex items-center gap-6">
                            <div className="hidden lg:block space-y-1">
                                <label htmlFor="productId" className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                                    Product ID
                                </label>
                                <input
                                    type="number"
                                    id="productId"
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                    className="w-24 bg-transparent border-none p-0 focus:outline-none font-black text-2xl text-primary"
                                    required
                                    disabled={!!editProductId}
                                />
                            </div>
                            <div className="h-10 w-px bg-border hidden lg:block" />
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Draft Summary</p>
                                <p className="font-bold text-foreground">
                                    {productName || 'New Product'} · {price ? `$${price}` : '$--'}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {!ipfsHash ? (
                                <button
                                    type="button"
                                    onClick={handleUploadToIPFS}
                                    disabled={isUploadingIPFS || isLoading || !productName || !productDescription || !price}
                                    className="flex-1 md:flex-none px-10 py-5 bg-slate-100 text-slate-950 text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-200 disabled:opacity-50 transition-all"
                                >
                                    {isUploadingIPFS ? 'Encrypting...' : 'Secure Assets'}
                                </button>
                            ) : (
                                <div className="hidden md:flex items-center gap-3 px-6 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-emerald-500/20">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Content Secured
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading || !ipfsHash}
                                className="flex-1 md:flex-none md:px-12 py-5 bg-primary text-primary-foreground hover:scale-105 active:scale-95 disabled:opacity-50 transition-all font-black uppercase tracking-[0.3em] rounded-2xl text-lg shadow-saas shadow-primary/20"
                            >
                                {isAddPending || isUpdatePending ? 'CONSENTING...' : isAddConfirming || isUpdateConfirming ? 'FINALIZING...' : editProductId ? 'UPDATE PRODUCT' : 'LAUNCH PRODUCT'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
