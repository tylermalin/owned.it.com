export interface Testimonial {
    id: string;
    productId: number;
    rating: number; // 1-5
    content: string;
    author: string;
    date: string;
    isVerified: boolean;
    isIncentivized: boolean; // Transparent: true if they got a "Review Discount"
}

// Seed/sample testimonials removed during security remediation. Real
// testimonials will be sourced from verified buyers in Phase 2.
export const TESTIMONIALS_DATA: Record<number, Testimonial[]> = {};

export function getTestimonials(productId: number): Testimonial[] {
    return TESTIMONIALS_DATA[productId] || [];
}

export function getAverageRating(productId: number): number {
    const list = getTestimonials(productId);
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, t) => acc + t.rating, 0);
    return Math.round((sum / list.length) * 10) / 10;
}
