/**
 * Approved Affiliate Partner Products
 *
 * These products are pre-approved for universal affiliate sharing.
 * Anyone (with or without a wallet) can generate and share a referral link
 * for these products and earn a commission on sales.
 *
 * To add a new partner product, add an entry to APPROVED_PARTNERS below.
 */

export interface PartnerProduct {
    /** Unique slug for this partner product */
    id: string;
    /** Display name */
    name: string;
    /** Short description shown on the partner store card */
    description: string;
    /** Category for filtering */
    category: 'digital' | 'coaching' | 'course' | 'membership' | 'community' | 'webinar' | 'tool';
    /** Cover image URL (use IPFS gateway URL or external HTTPS) */
    image?: string;
    /** Price in USDC */
    price: number;
    /** Commission percentage for affiliates */
    commissionPercent: number;
    /** On-chain product ID in the CreatorStore contract */
    productId: number;
    /** Creator's wallet address */
    creatorAddress: string;
    /** Optional badge text (e.g. "New", "Best Seller") */
    badge?: string;
}

/**
 * Curated list of approved partner products available for affiliate sharing.
 * Seed this with your own products initially, then expand as you onboard partners.
 */
export const APPROVED_PARTNERS: PartnerProduct[] = [
    {
        id: 'creator-accelerator',
        name: 'The Creator Accelerator',
        description: 'Complete 8-module course on high-leverage content creation and monetization.',
        category: 'course',
        price: 199,
        commissionPercent: 25,
        productId: 3,
        creatorAddress: '0x321...',
        badge: 'Best Seller',
        image: '/assets/demo/course.jpg'
    },
    {
        id: 'inner-circle-membership',
        name: 'OWNED Inner Circle',
        description: 'Private gated community for Base builders and on-chain creators.',
        category: 'community',
        price: 29,
        commissionPercent: 15,
        productId: 4,
        creatorAddress: '0x999...',
        badge: 'New',
        image: '/assets/demo/community.jpg'
    },
    {
        id: 'merch-hoodie',
        name: 'The "On-Chain" Hoodie',
        description: 'Premium heavy-weight oversized hoodie. Limited edition release.',
        category: 'digital', // Using digital as fallback for merch cat if not matches
        price: 65,
        commissionPercent: 10,
        productId: 5,
        creatorAddress: '0x111...',
        image: '/assets/demo/merch.jpg'
    },
];

/** Generate an affiliate link for a partner product */
export function generatePartnerAffiliateLink(
    productId: number,
    referrerAddress: string
): string {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://ownedit.xyz';
    return `${base}/products/${productId}/checkout?ref=${referrerAddress}`;
}

/** Generate a guest (wallet-less) affiliate link using a stable browser session ID */
export function generateGuestAffiliateLink(productId: number): string {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://ownedit.xyz';
    const guestId = getOrCreateGuestId();
    return `${base}/products/${productId}/checkout?ref=${guestId}`;
}

/** Get or create a stable guest session ID stored in localStorage */
function getOrCreateGuestId(): string {
    if (typeof window === 'undefined') return 'guest';
    const key = 'owned-guest-id';
    let id = localStorage.getItem(key);
    if (!id) {
        id = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        localStorage.setItem(key, id);
    }
    return id;
}
