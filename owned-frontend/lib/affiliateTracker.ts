/**
 * Affiliate Tracker — client-side localStorage-based tracking
 * for affiliate referrals, sales, and commission calculations.
 */

export interface AffiliateReferral {
    productId: number;
    referrer: string;         // wallet address of the affiliate
    timestamp: number;
    expiresAt: number;        // 30-day cookie window
}

export interface AffiliateSale {
    id: string;
    productId: number;
    referrer: string;
    buyer: string;
    amount: number;           // sale price in USDC
    commission: number;       // amount earned by affiliate
    commissionPercent: number;
    timestamp: number;
    productName?: string;
}

const REFERRAL_KEY = 'owned-affiliate-referrals';
const SALES_KEY = 'owned-affiliate-sales';
const REFERRAL_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// ── Referral Tracking ────────────────────────────────

/** Store a referral when someone visits via ?ref=address */
export function storeReferral(productId: number, referrer: string): void {
    if (typeof window === 'undefined') return;
    try {
        const referrals = getReferrals();
        // Update existing or add new
        const existing = referrals.findIndex(r => r.productId === productId);
        const entry: AffiliateReferral = {
            productId,
            referrer: referrer.toLowerCase(),
            timestamp: Date.now(),
            expiresAt: Date.now() + REFERRAL_DURATION_MS,
        };
        if (existing >= 0) {
            referrals[existing] = entry;
        } else {
            referrals.push(entry);
        }
        localStorage.setItem(REFERRAL_KEY, JSON.stringify(referrals));
    } catch { }
}

/** Get the active referrer for a product (if within 30-day window) */
export function getReferrer(productId: number): string | null {
    if (typeof window === 'undefined') return null;
    try {
        const referrals = getReferrals();
        const ref = referrals.find(
            r => r.productId === productId && r.expiresAt > Date.now()
        );
        return ref?.referrer || null;
    } catch {
        return null;
    }
}

/** Get all active referrals */
export function getReferrals(): AffiliateReferral[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(REFERRAL_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

// ── Sale Recording ───────────────────────────────────

/** Record an affiliate sale after a successful purchase */
export function recordAffiliateSale(
    productId: number,
    referrer: string,
    buyer: string,
    amount: number,
    commissionPercent: number,
    productName?: string
): AffiliateSale {
    const sale: AffiliateSale = {
        id: `${productId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        productId,
        referrer: referrer.toLowerCase(),
        buyer: buyer.toLowerCase(),
        amount,
        commission: amount * (commissionPercent / 100),
        commissionPercent,
        timestamp: Date.now(),
        productName,
    };

    if (typeof window !== 'undefined') {
        try {
            const sales = getAffiliateSales();
            sales.push(sale);
            localStorage.setItem(SALES_KEY, JSON.stringify(sales));
        } catch { }
    }

    return sale;
}

/** Get all affiliate sales, optionally filtered by referrer */
export function getAffiliateSales(referrer?: string): AffiliateSale[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(SALES_KEY);
        const sales: AffiliateSale[] = stored ? JSON.parse(stored) : [];
        if (referrer) {
            return sales.filter(s => s.referrer === referrer.toLowerCase());
        }
        return sales;
    } catch {
        return [];
    }
}

/** Get total earnings for a referrer */
export function getAffiliateEarnings(referrer: string): number {
    const sales = getAffiliateSales(referrer);
    return sales.reduce((sum, s) => sum + s.commission, 0);
}

/** Get total number of affiliate sales */
export function getAffiliateSaleCount(referrer?: string): number {
    return getAffiliateSales(referrer).length;
}

/** Generate an affiliate link for a product */
export function generateAffiliateLink(
    productId: number,
    referrerAddress: string,
    baseUrl?: string
): string {
    const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    return `${base}/products/${productId}/checkout?ref=${referrerAddress}`;
}
