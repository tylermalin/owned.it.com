import { ProductMetadata } from './ipfs';

export const DEMO_METADATA: Record<number, ProductMetadata> = {
    1: {
        name: "1:1 Strategy Session",
        subtitle: "High-Impact Coaching",
        description: "Personalized 60-minute strategy session to unlock your potential. We'll dive deep into your roadmap, product-market fit, and growth bottlenecks.",
        image: "/demo/coaching_call.png",
        callToAction: "BOOK SESSION",
        thumbnailStyle: "callout",
        productType: "coaching",
        price: "250.00"
    },
    2: {
        name: "AI Prompt Guide",
        subtitle: "Master Generative AI",
        description: "200+ high-performance prompts for startup founders. Includes templates for automated operations and viral marketing.",
        image: "/demo/ai_prompt_guide.png",
        callToAction: "GET ACCESS",
        thumbnailStyle: "button",
        productType: "digital",
        price: "49.00"
    },
    3: {
        name: "I Owned It (Official Audio)",
        subtitle: "Original Song by Tyler Malin",
        description: "Download the high-fidelity .mp3 of the official anthem. A tribute to onchain ownership and creator independence.",
        image: "/assets/product_song.png",
        callToAction: "DOWNLOAD SONG",
        thumbnailStyle: "button",
        productType: "digital",
        price: "1.00",
        digitalFileHash: "song-hash-placeholder"
    },
    4: {
        name: "Enterprise Invoicing Agent",
        subtitle: "Optimize Complex Billing",
        description: "A specialized AI agent built to automate and optimize enterprise-grade complex invoicing workflows.",
        image: "/assets/product_ai_agent.png",
        callToAction: "DEPLOY AGENT",
        thumbnailStyle: "button",
        productType: "digital",
        price: "250.00",
        redirectUrl: "https://ownedit.xyz/billing-agent"
    },
    5: {
        name: "Web3 & AI Conference 2026",
        subtitle: "General Admission Ticket",
        description: "Join us for the definitive conference on the intersection of Web3 and Artificial Intelligence. Includes all sessions, networking, and the afterparty.",
        image: "/assets/product_conference.png",
        callToAction: "BUY TICKET",
        thumbnailStyle: "button",
        productType: "digital",
        price: "150.00"
    }
};
