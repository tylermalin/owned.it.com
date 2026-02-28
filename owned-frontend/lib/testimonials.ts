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

export const TESTIMONIALS_DATA: Record<number, Testimonial[]> = {
    1: [ // Strategy Session
        {
            id: 'ts-1-1',
            productId: 1,
            rating: 5,
            content: "The 60-minute session with Tyler was a game-changer for our protocol launch. The architecture review saved us months of rework.",
            author: "Sovereign Builder #42",
            date: "2026-02-15",
            isVerified: true,
            isIncentivized: false
        },
        {
            id: 'ts-1-2',
            productId: 1,
            rating: 5,
            content: "Worth every cent. Transparent pricing and direct expertise. Finally, a consultant who actually ships code.",
            author: "Founder Alpha",
            date: "2026-02-20",
            isVerified: true,
            isIncentivized: true // Incentivized review
        }
    ],
    2: [ // The Definitive Guide
        {
            id: 'ts-2-1',
            productId: 2,
            rating: 5,
            content: "Chapter 1 alone is worth the pre-sale price. The Sovereignty Crisis is the best analysis of creator risk I've read.",
            author: "Digital Nomad",
            date: "2026-02-25",
            isVerified: true,
            isIncentivized: false
        },
        {
            id: 'ts-2-2',
            productId: 2,
            rating: 4,
            content: "Heavy content, but essential. Using the 'Review Discount' made it a no-brainer to pick up the pre-sale.",
            author: "Base Developer",
            date: "2026-02-27",
            isVerified: true,
            isIncentivized: true
        }
    ],
    7: [ // The Builder's Club
        {
            id: 'ts-7-1',
            productId: 7,
            rating: 5,
            content: "The weekly calls are the highlight of my week. The alpha shared in the private Discord is invaluable.",
            author: "Community Member #1",
            date: "2026-02-28",
            isVerified: true,
            isIncentivized: false
        }
    ]
};

export function getTestimonials(productId: number): Testimonial[] {
    return TESTIMONIALS_DATA[productId] || [];
}

export function getAverageRating(productId: number): number {
    const list = getTestimonials(productId);
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, t) => acc + t.rating, 0);
    return Math.round((sum / list.length) * 10) / 10;
}
