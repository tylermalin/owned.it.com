'use client';

import { useState, useEffect } from 'react';
import { useAddProduct, useUpdateProduct } from '@/lib/dashboardHooks';
import { useProduct } from '@/lib/hooks';
import toast from 'react-hot-toast';
import { ProductTypeSelector, ProductType } from './ProductTypeSelector';
import { uploadToIPFS, uploadImageToIPFS, ProductMetadata } from '@/lib/ipfs';
import { formatUnits } from 'viem';

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
    const [isUploadingIPFS, setIsUploadingIPFS] = useState(false);

    const { addProduct, isPending: isAddPending, isConfirming: isAddConfirming, isSuccess: isAddSuccess, error: addError } = useAddProduct();
    const { updateProduct, isPending: isUpdatePending, isConfirming: isUpdateConfirming, isSuccess: isUpdateSuccess, error: updateError } = useUpdateProduct();

    // Fetch product data if in edit mode
    const { data: productData, isLoading: isProductLoading } = useProduct(editProductId || 0);

    // Populate form if editing
    useEffect(() => {
        if (editProductId && productData) {
            const p = productData as any;
            setProductId(editProductId.toString());
            setPrice(formatUnits(p.price, 6)); // USDC 6 decimals
            setIpfsHash(p.ipfsHash);
            setMaxSupply(p.maxSupply.toString());
            setStep('details');

            // Note: We can't easily "re-fetch" all metadata fields from IPFS and set them in state 
            // without a separate helper. For this demo, we'll assume the user might want 
            // to re-enter metadata or we could add a "Fetch Metadata" button.
            // For now, let's at least set the name if we have it in DEMO_METADATA
        }
    }, [editProductId, productData]);

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
    };

    const handleTypeSelect = (type: ProductType) => {
        setProductType(type);
        setStep('details');

        // Template Pre-fills
        if (type === 'coaching') {
            setProductName('Book a 1:1 Call with Me');
            setProductDescription('I am here to help you achieve your goals.\n\nOn this 1:1 Video Call, I will personally help you:\n\nGive you specific advice to your situation\n\nBuild a plan to reach your goals\n\nWalk you through all of your questions');
            setBottomTitle('Work With Me 1:1');
            setCallToAction('Book a Call');
            setPrice('9.99');
        } else if (type === 'digital') {
            setProductName('Get My [Template/eBook/Course] Now!');
            setSubtitle('We will deliver this file right to your inbox');
            setProductDescription('This [Template/eBook/Course] will teach you everything you need to achieve your goals.\n\nThis guide is for you if you’re looking to:\n\nAchieve your Dream\n\nFind Meaning in Your Work\n\nBe Happy');
            setBottomTitle('Get My Guide');
            setCallToAction('PURCHASE');
            setPrice('9.99');
            setThumbnailStyle('callout');
        }

        // Auto-fill Product ID with next number if not editing
        if (!productId && !editProductId) {
            const nextId = Math.floor(Math.random() * 1000) + 3;
            setProductId(nextId.toString());
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

        setIsUploadingIPFS(true);
        toast.loading('Uploading to IPFS...', { id: 'ipfs-upload' });

        try {
            let imageHash = '';
            let fileHash = '';

            if (imageFile) {
                imageHash = await uploadImageToIPFS(imageFile);
            }

            if (digitalFile) {
                fileHash = await uploadImageToIPFS(digitalFile);
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
                attributes: [
                    { trait_type: 'Product Type', value: productType || 'digital' },
                    { trait_type: 'Price', value: `$${price}` },
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

        if (editProductId) {
            updateProduct(parseInt(productId), price, ipfsHash, supply);
        } else {
            addProduct(parseInt(productId), price, ipfsHash, supply);
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
            url: 'URL / Media',
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
                            <textarea
                                id="productDescription"
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[160px] font-medium text-lg transition-all"
                                placeholder="Tell your customers exactly what they are getting..."
                                required
                                disabled={isLoading}
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
                    </div>
                </div>

                {/* Pricing */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary text-primary-foreground text-sm font-black shadow-saas">4</span>
                        <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Pricing</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-border p-10 rounded-4xl shadow-sm">
                        <div className="space-y-2">
                            <label htmlFor="price" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                Price (USDC) *
                            </label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">$</span>
                                <input
                                    type="text"
                                    id="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full pl-10 pr-5 py-5 bg-slate-50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-black text-3xl italic tracking-tight transition-all"
                                    placeholder="9.99"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
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
                                className="w-full px-5 py-5 bg-white border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-xl transition-all"
                                placeholder="0"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

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
