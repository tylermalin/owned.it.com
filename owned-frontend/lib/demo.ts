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
        price: "250.00",
        salePoints: [
            "60-minute intensive 1:1 strategy deep-dive",
            "Custom roadmap and execution plan included",
            "Direct followup support via encrypted channel",
            "Lifetime access to session recordings"
        ]
    },
    2: {
        name: "AI Prompt Guide",
        subtitle: "Master Generative AI",
        description: "200+ high-performance prompts for startup founders. Includes templates for automated operations and viral marketing.",
        image: "/demo/ai_prompt_guide.png",
        callToAction: "GET ACCESS",
        thumbnailStyle: "button",
        productType: "digital",
        price: "49.00",
        salePoints: [
            "200+ battle-tested prompts for high-growth startups",
            "Ready-to-use templates for operations and marketing",
            "Updated monthly with the latest LLM optimizations",
            "Blockchain-verified ownership of the guide"
        ]
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
    }
};
