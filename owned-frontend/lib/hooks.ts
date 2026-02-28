import { useState, useEffect } from 'react';
import { CREATOR_STORE_ADDRESS, CHAIN, RPC_URL, USDC_ADDRESS, ADMIN_ADDRESS, ADMIN_EMAIL } from './constants';
import CreatorStoreABI from './CreatorStoreABI.json';
import { createWalletClient, custom, createPublicClient, http, erc20Abi } from 'viem';
import { useMagic } from '@/components/MagicProvider';
import { formatUSDC, parseUSDC, getReadableError } from './utils';
import { DEMO_METADATA } from './demo';

export function useIsAdmin() {
    const { user } = useMagic();
    return !!user?.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// Create a direct public client for reads to replace useReadContract
export const publicClient = createPublicClient({
    chain: CHAIN,
    transport: http(RPC_URL)
});

export interface Product {
    price: bigint;
    ipfsHash: string;
    maxSupply: bigint;
    sold: bigint;
    active: boolean;
}


export function usePurchaseProduct() {
    const { user, magic } = useMagic();
    const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
    const [isPending, setIsPending] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [isApprovePending, setIsApprovePending] = useState(false);
    const [isApproveSuccess, setIsApproveSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const approveUSDC = async (amount: bigint) => {
        if (!user?.publicAddress || !magic) return false;

        setIsApprovePending(true);
        setError(null);

        try {
            const walletClient = createWalletClient({
                account: user.publicAddress as `0x${string}`,
                chain: CHAIN,
                transport: custom(magic.rpcProvider)
            });

            // Check current allowance first
            const currentAllowance = await publicClient.readContract({
                address: USDC_ADDRESS,
                abi: erc20Abi,
                functionName: 'allowance',
                args: [user.publicAddress as `0x${string}`, CREATOR_STORE_ADDRESS],
            });

            if (currentAllowance >= amount) {
                setIsApproveSuccess(true);
                return true;
            }

            const txHash = await walletClient.writeContract({
                address: USDC_ADDRESS,
                abi: erc20Abi,
                functionName: 'approve',
                args: [CREATOR_STORE_ADDRESS, amount],
            });

            await publicClient.waitForTransactionReceipt({ hash: txHash });
            setIsApproveSuccess(true);
            return true;
        } catch (err: any) {
            console.error('Approval error:', err);
            setError(err.message || 'Approval Failed');
            return false;
        } finally {
            setIsApprovePending(false);
        }
    };

    const purchaseProduct = async (productId: number, couponCode?: string, testimonialDiscount?: boolean) => {
        if (!user?.publicAddress || !magic) {
            setError('Please sign in first');
            return;
        }

        setIsPending(true);
        setError(null);
        setHash(undefined);
        setIsSuccess(false);

        try {
            // Get product price first
            const localData = typeof window !== 'undefined' ? localStorage.getItem(TEST_PRODUCTS_KEY) : null;
            let product: any = null;
            let isTest = false;

            const isDemo = DEMO_IDS.includes(productId);
            if (localData || isDemo) {
                try {
                    const localProducts = localData ? JSON.parse(localData) : {};
                    if (localProducts[productId] || isDemo) {
                        const demoMeta = DEMO_METADATA[productId];
                        const demoPrice = demoMeta?.price ? parseUSDC(demoMeta.price) : parseUSDC("10.00");
                        product = localProducts[productId] || { price: demoPrice };
                        isTest = true;
                    }
                } catch (e) { }
            }

            if (!product) {
                product = await publicClient.readContract({
                    address: CREATOR_STORE_ADDRESS,
                    abi: CreatorStoreABI,
                    functionName: 'getProduct',
                    args: [BigInt(productId)],
                }) as Product;
            }

            if (isTest) {
                // Simulate success for test products
                setIsConfirming(true);
                setTimeout(() => {
                    setIsConfirming(false);
                    setIsSuccess(true);
                }, 1500);
                return;
            }

            let priceInUSDC = product.price;

            // Apply Coupon Discount
            if (couponCode) {
                const { validateCoupon } = await import('./coupons');
                const result = validateCoupon(couponCode, productId);
                if (result.isValid && result.coupon) {
                    const discount = (priceInUSDC * BigInt(result.coupon.discountPercent)) / 100n;
                    priceInUSDC = priceInUSDC - discount;
                    setAppliedCoupon(couponCode);
                }
            }

            // Apply Testimonial Discount (Transparent Incentive)
            if (testimonialDiscount) {
                const demoMeta = DEMO_METADATA[productId];
                // For now, only supporting demo products for this specific mechanic in the hook
                // In a production app, we'd fetch the IPFS metadata here as well
                if (demoMeta?.testimonialDiscountPercent) {
                    const discount = (priceInUSDC * BigInt(demoMeta.testimonialDiscountPercent)) / 100n;
                    priceInUSDC = priceInUSDC - discount;
                }
            }

            // Step 0: Check if Free (via Coupon or Review Discount)
            if (priceInUSDC === 0n) {
                setIsConfirming(true);
                setTimeout(() => {
                    setIsConfirming(false);
                    setIsSuccess(true);
                }, 1000);
                return;
            }

            // Step 1: Check USDC Balance
            const userBalance = await publicClient.readContract({
                address: USDC_ADDRESS,
                abi: erc20Abi,
                functionName: 'balanceOf',
                args: [user.publicAddress as `0x${string}`],
            });

            if (userBalance < priceInUSDC) {
                setError(`Insufficient USDC balance. You have ${formatUSDC(userBalance)} but need ${formatUSDC(priceInUSDC)}.`);
                setIsPending(false);
                return;
            }

            // Step 1: Approve if needed
            const approved = await approveUSDC(priceInUSDC);
            if (!approved) return;

            // Step 2: Purchase
            const walletClient = createWalletClient({
                account: user.publicAddress as `0x${string}`,
                chain: CHAIN,
                transport: custom(magic.rpcProvider)
            });

            const txHash = await walletClient.writeContract({
                address: CREATOR_STORE_ADDRESS,
                abi: CreatorStoreABI as any,
                functionName: 'purchaseProduct',
                args: [BigInt(productId)],
            });

            setHash(txHash);
            setIsConfirming(true);

            // Wait for receipt manually using public client
            const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
            setIsConfirming(false);

            if (receipt.status === 'success') {
                setIsSuccess(true);
            } else {
                setError('Transaction failed on-chain');
            }
        } catch (err: any) {
            console.error('Purchase error:', err);
            setError(getReadableError(err));
        } finally {
            setIsPending(false);
            setIsConfirming(false);
        }
    };

    return {
        purchaseProduct,
        isPending,
        isConfirming,
        isSuccess,
        isApprovePending,
        isApproveSuccess,
        error,
        hash,
        appliedCoupon
    };
}

export function useCreatorBalance() {
    const [balance, setBalance] = useState<bigint>(0n);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await publicClient.readContract({
                    address: CREATOR_STORE_ADDRESS,
                    abi: CreatorStoreABI,
                    functionName: 'getCreatorBalance',
                }) as bigint;
                setBalance(res);
            } catch (err) {
                console.error('Error fetching creator balance:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetch();
    }, []);

    return { data: balance, isLoading };
}

export function useNextTokenId() {
    const [tokenId, setTokenId] = useState<bigint>(0n);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await publicClient.readContract({
                    address: CREATOR_STORE_ADDRESS,
                    abi: CreatorStoreABI,
                    functionName: 'nextTokenId',
                }) as bigint;
                setTokenId(res);
            } catch (err) {
                console.error('Error fetching next token id:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetch();
    }, []);

    return { data: tokenId, isLoading };
}

export function usePlatformBalance() {
    const [balance, setBalance] = useState<bigint>(0n);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await publicClient.readContract({
                    address: CREATOR_STORE_ADDRESS,
                    abi: CreatorStoreABI,
                    functionName: 'getPlatformBalance',
                }) as bigint;
                setBalance(res);
            } catch (err) {
                console.error('Error fetching platform balance:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetch();
    }, []);

    return { data: balance, isLoading };
}

const TEST_PRODUCTS_KEY = 'owned-local-products';
const DEMO_IDS = [1, 2, 6, 7]; // Added 6 for Chapter 1

export function useAllProducts(options?: { excludeLocal?: boolean }) {
    const [productIds, setProductIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProductIds = async () => {
            // Start with demo product IDs
            let allIds = [...DEMO_IDS];

            // Add local products from localStorage unless excluded
            if (!options?.excludeLocal) {
                const localData = typeof window !== 'undefined' ? localStorage.getItem(TEST_PRODUCTS_KEY) : null;
                if (localData) {
                    try {
                        const localProducts = JSON.parse(localData);
                        const localIds = Object.keys(localProducts).map(Number);
                        allIds = [...allIds, ...localIds];
                    } catch (e) {
                        console.error('Error parsing local products:', e);
                    }
                }
            }

            try {
                // Reduced block range to 1,000 to avoid persistent RPC errors
                const currentBlock = await publicClient.getBlockNumber();
                const fromBlock = currentBlock > 1000n ? currentBlock - 1000n : 0n;

                const logs = await publicClient.getLogs({
                    address: CREATOR_STORE_ADDRESS,
                    event: {
                        type: 'event',
                        name: 'ProductAdded',
                        inputs: [
                            { name: 'productId', type: 'uint256', indexed: true },
                            { name: 'price', type: 'uint256', indexed: false },
                            { name: 'ipfsHash', type: 'string', indexed: false },
                            { name: 'maxSupply', type: 'uint256', indexed: false }
                        ]
                    },
                    fromBlock,
                });

                const onChainIds = logs.map(log => Number(log.args.productId));
                allIds = [...allIds, ...onChainIds];

                // Final unique list
                setProductIds(Array.from(new Set(allIds)).sort((a, b) => b - a));
            } catch (err) {
                console.error('Error fetching on-chain product IDs:', err);
                setProductIds(Array.from(new Set(allIds)).sort((a, b) => b - a));
            } finally {
                setIsLoading(false);
            }
        };
        fetchProductIds();
    }, [options?.excludeLocal]);

    return { productIds, isLoading };
}

export function useProduct(productId: number | null | undefined) {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!productId) {
            setIsLoading(false);
            return;
        }

        const fetchProduct = async () => {
            setIsLoading(true);
            setError(null);

            const localData = typeof window !== 'undefined' ? localStorage.getItem(TEST_PRODUCTS_KEY) : null;
            const isDemo = DEMO_IDS.includes(productId);
            if (localData || isDemo) {
                try {
                    const localProducts = localData ? JSON.parse(localData) : {};
                    if (localProducts[productId] || isDemo) {
                        const demoMeta = DEMO_METADATA[productId];
                        const demoPrice = demoMeta?.price ? parseUSDC(demoMeta.price) : parseUSDC("10.00");
                        setData({
                            ...(localProducts[productId] || {
                                name: demoMeta?.name || `Demo Item #${productId}`,
                                ipfsHash: '',
                                price: demoPrice,
                                maxSupply: 100n
                            }),
                            isTest: true,
                            active: true,
                            sold: 0n,
                            price: localProducts[productId] ? parseUSDC(localProducts[productId].price || "0") : demoPrice
                        });
                        setIsLoading(false);
                        return;
                    }
                } catch (e) { }
            }

            // 2. Fallback to On-Chain
            try {
                const res = await publicClient.readContract({
                    address: CREATOR_STORE_ADDRESS,
                    abi: CreatorStoreABI,
                    functionName: 'getProduct',
                    args: [BigInt(productId)],
                }) as any;

                setData(res);
            } catch (err) {
                console.error(`Error fetching product ${productId}:`, err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [productId, publicClient]); // Added publicClient to dependencies

    return { data, isLoading, error };
}

// localStorage key for purchase receipts — written at checkout success
const PURCHASE_RECEIPTS_KEY = 'owned-purchase-receipts';

/** Save a product ID to the local purchase receipt cache for the given wallet */
export function savePurchaseReceipt(walletAddress: string, productId: number) {
    if (typeof window === 'undefined') return;
    try {
        const key = `${PURCHASE_RECEIPTS_KEY}-${walletAddress.toLowerCase()}`;
        const existing: number[] = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = Array.from(new Set([...existing, productId]));
        localStorage.setItem(key, JSON.stringify(updated));
    } catch { }
}

/** Get all locally cached purchased product IDs for the given wallet */
function getLocalPurchaseReceipts(walletAddress: string): number[] {
    if (typeof window === 'undefined') return [];
    try {
        const key = `${PURCHASE_RECEIPTS_KEY}-${walletAddress.toLowerCase()}`;
        return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
        return [];
    }
}

export function usePurchasedItems(address?: string) {
    const { user } = useMagic();
    const targetAddress = address || user?.publicAddress;
    const [assets, setAssets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!targetAddress) {
            setIsLoading(false);
            return;
        }

        const fetchAssets = async () => {
            try {
                // Scan up to 100,000 blocks back in 10k chunks to catch all purchases
                // Base Sepolia RPC limits getLogs to 10,000 blocks per request
                const currentBlock = await publicClient.getBlockNumber();
                const totalRange = 100000n;
                const CHUNK_SIZE = 10000n;
                const startBlock = currentBlock > totalRange ? currentBlock - totalRange : 0n;

                const logsPromises = [];
                for (let from = startBlock; from < currentBlock; from += CHUNK_SIZE) {
                    const to = from + CHUNK_SIZE - 1n > currentBlock ? currentBlock : from + CHUNK_SIZE - 1n;
                    logsPromises.push(
                        publicClient.getLogs({
                            address: CREATOR_STORE_ADDRESS,
                            event: {
                                type: 'event',
                                name: 'ProductPurchased',
                                inputs: [
                                    { name: 'productId', type: 'uint256', indexed: true },
                                    { name: 'buyer', type: 'address', indexed: true },
                                    { name: 'tokenId', type: 'uint256', indexed: false },
                                    { name: 'price', type: 'uint256', indexed: false }
                                ]
                            },
                            args: {
                                buyer: targetAddress as `0x${string}`
                            },
                            fromBlock: from,
                            toBlock: to,
                        })
                    );
                }

                const logsResults = await Promise.all(logsPromises);
                const logs = logsResults.flat();

                // Merge on-chain logs + localStorage receipt cache + demo product #6
                const onChainIds = logs.map(log => Number(log.args.productId));
                const localReceiptIds = getLocalPurchaseReceipts(targetAddress);

                const productIds = Array.from(new Set([
                    6,
                    ...onChainIds,
                    ...localReceiptIds,
                ]));

                // Fetch product details for each unique ID
                const assetData = await Promise.all(productIds.map(async (id) => {
                    try {
                        const product = await publicClient.readContract({
                            address: CREATOR_STORE_ADDRESS,
                            abi: CreatorStoreABI,
                            functionName: 'getProduct',
                            args: [BigInt(id)],
                        }) as Product;

                        return {
                            id,
                            ...product,
                            isDemo: id >= 1 && id <= 6
                        };
                    } catch (e) {
                        return null;
                    }
                }));

                setAssets(assetData.filter(a => a !== null));
            } catch (err) {
                console.error('Error fetching assets:', err);
                // Even on RPC error, show locally cached purchases
                if (user?.publicAddress) {
                    const localReceiptIds = getLocalPurchaseReceipts(user.publicAddress);
                    const fallbackIds = Array.from(new Set([6, ...localReceiptIds]));
                    const fallbackData = fallbackIds.map(id => ({ id, isDemo: id >= 1 && id <= 6 }));
                    setAssets(fallbackData);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssets();
    }, [user?.publicAddress]);

    return { data: assets, isLoading };
}

export function usePlatformStats() {
    const { productIds, isLoading: idsLoading } = useAllProducts();
    const [stats, setStats] = useState<{
        totalVolume: bigint;
        totalSales: number;
        productStats: Record<number, { sold: number; revenue: bigint }>;
    }>({
        totalVolume: 0n,
        totalSales: 0,
        productStats: {}
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (idsLoading) return;

        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const productData = await Promise.all(productIds.map(async (id) => {
                    const product = await publicClient.readContract({
                        address: CREATOR_STORE_ADDRESS,
                        abi: CreatorStoreABI,
                        functionName: 'getProduct',
                        args: [BigInt(id)],
                    }) as Product;
                    return { id, product };
                }));

                let totalVolume = 0n;
                let totalSales = 0;
                const productStats: Record<number, { sold: number; revenue: bigint }> = {};

                productData.forEach(({ id, product }) => {
                    const soldCount = Number(product.sold);
                    const revenue = product.price * product.sold;

                    productStats[id] = {
                        sold: soldCount,
                        revenue
                    };
                    totalVolume += revenue;
                    totalSales += soldCount;
                });

                setStats({ totalVolume, totalSales, productStats });
            } catch (err) {
                console.error('Error fetching platform stats:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [productIds, idsLoading]);

    return { stats, isLoading };
}

export interface UserProfile {
    displayName?: string;
    bio?: string;
    avatar?: string;
    banner?: string;
    phone?: string;
    altEmail?: string;
    socials: {
        twitter?: string;
        linkedIn?: string;
        website?: string;
        farcaster?: string;
        github?: string;
        instagram?: string;
        youtube?: string;
    };
    shippingAddress: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
    affiliateBio?: string;
}

const PROFILE_PREFIX = 'owned-profile-';

export function useUserProfile(address?: string) {
    const { user } = useMagic();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const effectiveAddress = address || user?.publicAddress;

    useEffect(() => {
        if (!effectiveAddress) {
            setProfile(null);
            setIsLoading(false);
            return;
        }

        const key = `${PROFILE_PREFIX}${effectiveAddress.toLowerCase()}`;
        const stored = localStorage.getItem(key);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Ensure nested objects exist
                setProfile({
                    ...parsed,
                    socials: parsed.socials || {},
                    shippingAddress: parsed.shippingAddress || {}
                });
            } catch (e) {
                console.error('Failed to parse profile', e);
            }
        } else {
            // Default empty profile
            setProfile({
                socials: {},
                shippingAddress: {}
            });
        }
        setIsLoading(false);
    }, [effectiveAddress]);

    const updateProfile = (data: Partial<UserProfile>) => {
        if (!effectiveAddress || !profile) return;

        // Deep merge logic for socials and shippingAddress
        const newProfile = {
            ...profile,
            ...data,
            socials: {
                ...(profile.socials || {}),
                ...(data.socials || {})
            },
            shippingAddress: {
                ...(profile.shippingAddress || {}),
                ...(data.shippingAddress || {})
            }
        };

        const key = `${PROFILE_PREFIX}${effectiveAddress.toLowerCase()}`;
        localStorage.setItem(key, JSON.stringify(newProfile));
        setProfile(newProfile);
    };

    return { profile, updateProfile, isLoading };
}

export function useAllMembers() {
    const [members, setMembers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = () => {
            if (typeof window === 'undefined') return;

            const allMembers: any[] = [];
            try {
                // In this architecture, we aggregate from localStorage profiles
                // We also include the admin as a default member
                const adminProfile = localStorage.getItem(`${PROFILE_PREFIX}${ADMIN_ADDRESS.toLowerCase()}`);
                if (adminProfile) {
                    allMembers.push({
                        address: ADMIN_ADDRESS,
                        profile: JSON.parse(adminProfile),
                        isAdmin: true
                    });
                } else {
                    allMembers.push({ address: ADMIN_ADDRESS, isAdmin: true, profile: { displayName: 'Admin' } });
                }

                // Scan for other profiles
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(PROFILE_PREFIX)) {
                        const address = key.replace(PROFILE_PREFIX, '');
                        if (address.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) continue;

                        try {
                            const profile = JSON.parse(localStorage.getItem(key) || '{}');
                            allMembers.push({ address, profile, isAdmin: false });
                        } catch (e) { }
                    }
                }
            } catch (e) {
                console.error('Error fetching members:', e);
            }

            setMembers(allMembers);
            setIsLoading(false);
        };

        fetchMembers();
    }, []);

    return { members, isLoading };
}
