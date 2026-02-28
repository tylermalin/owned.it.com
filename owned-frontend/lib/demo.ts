import { ProductMetadata } from './ipfs';

export const DEMO_METADATA: Record<number, ProductMetadata> = {
    1: {
        name: "Strategy Session",
        subtitle: "Founder & Team Bootcamp",
        description: "60 minute bootcamp and strategy planning kickoff with CEO Tyler Malin and OwnedIt Team. Map your path from platform to protocol. Deep dive into store architecture, launch strategy, and execution roadmap.",
        image: "/demo/coaching_call.png",
        callToAction: "BOOK BOOTCAMP",
        thumbnailStyle: "callout",
        productType: "consulting",
        price: "297.00",
        salePoints: [
            "60-minute intensive strategy bootcamp",
            "Kickoff with CEO Tyler Malin & Team",
            "Store architecture & launch strategy review",
            "7 days of direct followup support"
        ],
        testimonialDiscountPercent: 20
    },
    2: {
        name: "The Definitive Guide",
        subtitle: "Pre-Sale - $95",
        description: "108 pages. 21 chapters. The complete technical and strategic blueprint for building sovereign commerce infrastructure. Includes Chapter 1 (Free Download) - The Sovereignty Crisis.",
        image: "/demo/ai_prompt_guide.png",
        callToAction: "PRE-ORDER GUIDE",
        thumbnailStyle: "button",
        productType: "digital",
        price: "95.00",
        salePoints: [
            "Pre-Sale pricing $95 (Limited time)",
            "Chapter One included for Free",
            "Next-gen Product Architecture patterns",
            "Sovereign Distribution Systems"
        ],
        testimonialDiscountPercent: 15
    },
    /* ... IDs 3-6 ... */
    3: {
        name: "I Owned It (Official Audio)",
        subtitle: "Original Song by Tyler Malin",
        description: "Download the high-fidelity .mp3 of the official anthem. A tribute to onchain ownership and creator independence.",
        image: "/assets/product_song.png",
        callToAction: "DOWNLOAD SONG",
        thumbnailStyle: "button",
        productType: "digital",
        price: "1.00",
        salePoints: [
            "High-fidelity lossless .mp3 master",
            "Exclusive ownership rights to the anthem",
            "Special Collector's Badge in the app",
            "Early access to upcoming releases"
        ],
        digitalFileHash: "song-hash-placeholder"
    },
    4: {
        name: "Enterprise Invoicing Agent",
        subtitle: "Optimize Complex Billing",
        description: "A specialized AI agent built to automate and optimize enterprise-grade complex invoicing workflows.",
        image: "/assets/product_ai_agent.png",
        callToAction: "DEPLOY AGENT",
        thumbnailStyle: "button",
        productType: "agent",
        price: "250.00",
        salePoints: [
            "Autonomous processing of complex enterprise bills",
            "Direct integration with major ERP systems",
            "99.9% accuracy compared to manual audit",
            "Drastically reduce time-to-payment"
        ],
        redirectUrl: "https://ownedit.xyz/billing-agent"
    },
    5: {
        name: "Web3 & AI Conference 2026",
        subtitle: "General Admission Ticket",
        description: "Join us for the definitive conference on the intersection of Web3 and Artificial Intelligence. Includes all sessions, networking, and the afterparty.",
        image: "/assets/product_conference.png",
        callToAction: "BUY TICKET",
        thumbnailStyle: "button",
        productType: "ticket",
        price: "150.00",
        salePoints: [
            "Full physical access to the 2026 conference",
            "Networking lunch with industry leaders",
            "Limited edition physical merch pack",
            "NFT-gate to the digital twin event"
        ]
    },
    6: {
        name: "The Definitive Guide (Chapter 1)",
        subtitle: "Free Sample Chapter",
        description: "Go deep into Chapter 1: The Sovereignty Crisis. Learn why your creator business is at risk on legacy platforms and the bridge to the protocol era.",
        image: "/demo/ai_prompt_guide.png",
        callToAction: "GET FREE CHAPTER",
        thumbnailStyle: "button",
        productType: "digital",
        price: "0.00",
        salePoints: [
            "Full access to Chapter 1: The Sovereignty Crisis",
            "Analysis of legacy platform structural risks",
            "The bridge to sovereign commerce infrastructure",
            "Minted as a free proof-of-knowledge NFT"
        ],
        redirectUrl: "/downloads/chapter1.pdf"
    },
    7: {
        name: "The Builder's Club Membership",
        subtitle: "Founding Member - $47/mo",
        description: "Monthly Membership NFT that gives you exclusive access to the inner circle of sovereign builders. Includes weekly strategy calls and access to the private Discord.",
        image: "/assets/membership_nft.png",
        callToAction: "JOIN CIRCLE",
        thumbnailStyle: "button",
        productType: "digital",
        price: "47.00",
        salePoints: [
            "Weekly Strategy Calls with Tyler & Team",
            "Private Discord community access",
            "Priority Support & Protocol Alpha",
            "Minted as a transferable Membership NFT"
        ],
        testimonialDiscountPercent: 25
    }
};
