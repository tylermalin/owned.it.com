export interface Coupon {
    code: string;
    discountPercent: number; // 0 to 100
    validFrom?: string; // ISO date string
    validTo?: string; // ISO date string
    maxRedemptions?: number;
    redemptionCount: number;
    applicableProductIds?: number[]; // Empty means all
}

// Coupons are disabled. On-chain pricing cannot currently honor a partial
// discount without the real purchase reverting or overcharging, so no codes
// are live. Keep this empty until discounts are enforced at the contract level.
export const ACTIVE_COUPONS: Coupon[] = [];

export interface ValidationResult {
    isValid: boolean;
    error?: string;
    coupon?: Coupon;
}

export function validateCoupon(code: string, productId: number): ValidationResult {
    if (!code) return { isValid: false };

    const coupon = ACTIVE_COUPONS.find(c => c.code.toLowerCase() === code.toLowerCase());

    if (!coupon) {
        return { isValid: false, error: 'Invalid coupon code' };
    }

    // Check dates
    const now = new Date();
    if (coupon.validFrom && new Date(coupon.validFrom) > now) {
        return { isValid: false, error: 'Coupon is not yet active' };
    }
    if (coupon.validTo && new Date(coupon.validTo) < now) {
        return { isValid: false, error: 'Coupon has expired' };
    }

    // Check redemptions
    if (coupon.maxRedemptions && coupon.redemptionCount >= coupon.maxRedemptions) {
        return { isValid: false, error: 'Coupon redemption limit reached' };
    }

    // Check product applicability
    if (coupon.applicableProductIds && coupon.applicableProductIds.length > 0) {
        if (!coupon.applicableProductIds.includes(productId)) {
            return { isValid: false, error: 'Coupon is not valid for this product' };
        }
    }

    return { isValid: true, coupon };
}
