export interface ShowcaseExample {
    slug: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    badAssExample: string;
    sections: {
        theExample: {
            title: string;
            content: string;
            metrics: string[];
        };
        theBuild: {
            title: string;
            steps: string[];
            tech: string[];
        };
        theLaunch: {
            title: string;
            strategy: string[];
        };
        theGrowthPlan: {
            title: string;
            goals: string[];
        };
    };
}

export const SHOWCASE_DATA: Record<string, ShowcaseExample> = {
    'sovereign-course': {
        slug: 'sovereign-course',
        title: 'High-Ticket Education',
        description: 'Sell a course as an NFT. The buyer owns the access key forever.',
        icon: 'GraduationCap',
        color: 'blue',
        badAssExample: 'The $50k/mo Solopreneur Course',
        sections: {
            theExample: {
                title: 'The Example: High-Ticket Education',
                content: 'A comprehensive video series for solopreneurs, sold as a 100-delegate NFT collection. Each token grants lifetime access to the curriculum and private community.',
                metrics: ['$50,000 Monthly Revenue', '100% Retained Ownership', 'Zero Platform Fees']
            },
            theBuild: {
                title: 'The Build: Infrastructure',
                steps: [
                    'Deploy Storefront Contract on Base',
                    'Upload 20+ HD Video Lessons to IPFS/Arweave',
                    'Set Price to 1.5 ETH ($4,500)',
                    'Configure Token-Gating for Discord'
                ],
                tech: ['ERC-721 Access Tokens', 'IPFS Video Hosting', 'Base L2 Settlement']
            },
            theLaunch: {
                title: 'The Launch: First $1,000',
                strategy: [
                    'Offer 10 "Founding Member" slots at 50% discount',
                    'Direct DM outreach to existing audience',
                    'Launch "Sovereignty" webinar with live checkout'
                ]
            },
            theGrowthPlan: {
                title: 'The Growth Plan: Scaling to $10k+',
                goals: [
                    'Implement Affiliate Program (30% commission to members)',
                    'Host Monthly Live Strategy Calls (Token-gated)',
                    'Partner with 5 niche influencers for curated drops'
                ]
            }
        }
    },
    'notion-template': {
        slug: 'notion-template',
        title: 'Productivity Systems',
        description: 'Direct delivery of workspace templates without 10-30% platform take rates.',
        icon: 'FileText',
        color: 'indigo',
        badAssExample: 'Infinite OS Project Management',
        sections: {
            theExample: {
                title: 'The Example: Infinite OS',
                content: 'A high-fidelity Notion system for remote product teams. Delivered instantly via encrypted metadata after USDC settlement.',
                metrics: ['97% Profit Margin', 'Instant Settlement', 'No Gumroad Approvals']
            },
            theBuild: {
                title: 'The Build: Efficiency',
                steps: [
                    'Create Master Notion Template',
                    'Zip PDF Guide + Link into single archive',
                    'Deploy as Digital Download Product',
                    'Set Price to $97 USDC'
                ],
                tech: ['Smart Contract Payment Splitter', 'IPFS Asset Storage', 'Magic Link Auth']
            },
            theLaunch: {
                title: 'The Launch: First $1,000',
                strategy: [
                    'Post "Build in Public" thread on X',
                    'Offer free Lite version to 500 early signups',
                    'Email "The Sovereign Link" to existing newsletter'
                ]
            },
            theGrowthPlan: {
                title: 'The Growth Plan: Scaling to $10k+',
                goals: [
                    'Bundle with 1:1 onboarding calls',
                    'Create "Build Your Agency" upsell package',
                    'Run targeted ads to "Productive Founder" niche'
                ]
            }
        }
    },
    'sovereign-circle': {
        slug: 'sovereign-circle',
        title: 'Private Communities',
        description: 'NFT-gated Discord and weekly calls with instant membership.',
        icon: 'Users2',
        color: 'emerald',
        badAssExample: 'The Sovereignty Circle',
        sections: {
            theExample: {
                title: 'The Example: Sovereignty Circle',
                content: 'A monthly membership NFT that grants access to a private Discord and weekly strategy calls with protocol founders.',
                metrics: ['Recurring Revenue', 'Exclusive Access', 'Tradeable Membership']
            },
            theBuild: {
                title: 'The Build: Community',
                steps: [
                    'Deploy Subscription Manager Contract',
                    'Set Monthly Price to $47 USDC',
                    'Configure Bot to verify NFT ownership in Discord',
                    'Upload Exclusive Member PDFs to IPFS'
                ],
                tech: ['ERC-1155 Membership Tokens', 'Token-Gated Bot', 'On-chain Expiry Logic']
            },
            theLaunch: {
                title: 'The Launch: First $1,000',
                strategy: [
                    'Invite 20 loyal followers for a "Genesis Month"',
                    'Daily progress updates in Public Discord channels',
                    'Host a "Sovereign Build-along" livestream'
                ]
            },
            theGrowthPlan: {
                title: 'The Growth Plan: Scaling to $10k+',
                goals: [
                    'Add "Founder Tier" for high-ticket consulting',
                    'Build an NFT-gated member directory',
                    'Incentivize members to refer New Builders'
                ]
            }
        }
    },
    'strategy-session': {
        slug: 'strategy-session',
        title: 'High-Value Consulting',
        description: 'Sell your time and strategy expertise with automated booking.',
        icon: 'Clock3',
        color: 'amber',
        badAssExample: '60-Min Protocol Strategy Session',
        sections: {
            theExample: {
                title: 'The Example: Strategy Session',
                content: 'A high-impact 60-minute session with Tyler Malin. Covers protocol architecture and sovereign business strategy.',
                metrics: ['$297/hr Consulting', 'No Platform Fees', 'Full Calendar Ownership']
            },
            theBuild: {
                title: 'The Build: Consulting',
                steps: [
                    'Deploy Consulting Product Contract',
                    'Connect Calendar to checkout success',
                    'Set Price to $297 USDC',
                    'Automate confirmation email'
                ],
                tech: ['On-chain Payment Rails', 'Dynamic Booking Integration', 'Base Settlement']
            },
            theLaunch: {
                title: 'The Launch: First $1,000',
                strategy: [
                    'Promote on X with specific transformation outcomes',
                    'Bundle with "The Definitive Guide" for bonus value',
                    'Open 5 "Beta" slots for public case studies'
                ]
            },
            theGrowthPlan: {
                title: 'The Growth Plan: Scaling to $10k+',
                goals: [
                    'Create "Retainer" package for monthly support',
                    'Hire a junior strategist for "Build-along" calls',
                    'Launch "Sovereign Strategy" masterclass'
                ]
            }
        }
    },
    'sovereign-sound': {
        slug: 'sovereign-sound',
        title: 'Creative Media',
        description: 'Sell music, art, and games with built-in perpetual royalties.',
        icon: 'Music',
        color: 'rose',
        badAssExample: 'Sovereign Sound Genesis Drop',
        sections: {
            theExample: {
                title: 'The Example: Genesis Sound',
                content: 'A digital album drop with 5 exclusive tracks and high-res cover art. Each sale builds a permanent listener relationship.',
                metrics: ['Perpetual Royalties', 'Zero Record Label Take', 'Direct Fan Connection']
            },
            theBuild: {
                title: 'The Build: Creative',
                steps: [
                    'Upload Audio to IPFS (lossless quality)',
                    'Set Resale Royalty to 10%',
                    'Deploy Creative NFT Contract',
                    'Customize Marketplace Listing Card'
                ],
                tech: ['EIP-2981 Royalty Standard', 'IPFS Audio Hosting', 'Base L2 NFT Minting']
            },
            theLaunch: {
                title: 'The Launch: First $1,000',
                strategy: [
                    'Tease snippets on TikTok/Instagram',
                    'Hold a "Private Listening" Discord event',
                    'Airdrop "Early Listener" badges to top fans'
                ]
            },
            theGrowthPlan: {
                title: 'The Growth Plan: Scaling to $10k+',
                goals: [
                    'Incorporate "Merch" bundles with NFT ownership',
                    'Tour ticketing via the OWNED Events protocol',
                    'Collaborate with 3 other Sovereign Artists'
                ]
            }
        }
    },
    'sovereign-bootcamp': {
        slug: 'sovereign-bootcamp',
        title: 'IRL & Virtual Events',
        description: 'Scalable ticketing for workshops or global meetups. Verifiable on-chain.',
        icon: 'MapPin',
        color: 'violet',
        badAssExample: 'Founder & Team Bootcamp',
        sections: {
            theExample: {
                title: 'The Example: Founder Bootcamp',
                content: 'An intensive 2-day IRL workshop for startup teams. Tickets are issued as NFTs, eliminating resale fraud and platform middleman fees.',
                metrics: ['100% Ticket Revenue', 'Secondary Royalty Support', 'Instant Verification']
            },
            theBuild: {
                title: 'The Build: Events',
                steps: [
                    'Deploy Event Ticketing Contract',
                    'Set Tiered Pricing (Early Bird / General)',
                    'Generate QR Code Verification Portal',
                    'Upload Venue Info & Schedule to IPFS'
                ],
                tech: ['NFT Tickets', 'On-chain Gating', 'Base Scan Verification']
            },
            theLaunch: {
                title: 'The Launch: First $1,000',
                strategy: [
                    'Announce on X and LinkedIn to builder audiences',
                    'Offer "BOGO" discount for first 5 teams',
                    'Partner with a local co-working space for promo'
                ]
            },
            theGrowthPlan: {
                title: 'The Growth Plan: Scaling to $10k+',
                goals: [
                    'Expand to 5 cities globally',
                    'Sell "Virtual Access" recordings post-event',
                    'Create a "Bootcamp Alumni" DAO'
                ]
            }
        }
    },
    'sovereign-arcade': {
        slug: 'sovereign-arcade',
        title: 'Indie Game Distribution',
        description: 'Digital games delivered as IPFS downloads or browser links.',
        icon: 'Play',
        color: 'orange',
        badAssExample: 'Retro-Sovereign Arcade',
        sections: {
            theExample: {
                title: 'The Example: Retro Arcade',
                content: 'A collection of 3 indie games sold as a bundle. Ownership is tied to a lifetime access NFT.',
                metrics: ['Direct Distribution', 'No App Store Tax', 'Global Availability']
            },
            theBuild: {
                title: 'The Build: Gaming',
                steps: [
                    'Upload Game Binaries/Builds to IPFS',
                    'Deploy Software License Contract',
                    'Integrate with Web3 Browser Player',
                    'Set Price to $20 USDC'
                ],
                tech: ['NFT Software Licenses', 'IPFS Game Assets', 'Base L2 Settlement']
            },
            theLaunch: {
                title: 'The Launch: First $1,000',
                strategy: [
                    'Launch on Product Hunt and Indie Hacker forums',
                    'Host a high-score tournament via Twitter',
                    'Give away free keys to 10 gaming streamers'
                ]
            },
            theGrowthPlan: {
                title: 'The Growth Plan: Scaling to $10k+',
                goals: [
                    'Add in-game items as NFTs',
                    'Collaborate with other devs for "Bundle Drops"',
                    'Build a sovereign "Leaderboard" protocol'
                ]
            }
        }
    },
    'unified-identity': {
        slug: 'unified-identity',
        title: 'Social Identity',
        description: 'Aggregate your entire digital presence with one links-style page.',
        icon: 'Link2',
        color: 'slate',
        badAssExample: 'The Unified Identity Link',
        sections: {
            theExample: {
                title: 'The Example: Unified Identity',
                content: 'A comprehensive sovereign "Link-in-Bio" page for creators. Fully customizable and owned via smart contract.',
                metrics: ['100% Data Control', 'Censorship Resistant', 'Custom Branding']
            },
            theBuild: {
                title: 'The Build: Identity',
                steps: [
                    'Configure Custom Subdomain (e.g. tyler.owned.it)',
                    'Deploy Identity Registry Contract',
                    'Upload Profile Metadata to IPFS',
                    'Link X, Farcaster, and Storefront'
                ],
                tech: ['ENS/Base Name Service', 'IPFS Metadata', 'Identity Smart Contract']
            },
            theLaunch: {
                title: 'The Launch: First $1,000',
                strategy: [
                    'Update all social bio links to the new URL',
                    'Post a "Sovereign Shift" thread on Farcaster',
                    'Offer free setup to 10 top creators'
                ]
            },
            theGrowthPlan: {
                title: 'The Growth Plan: Scaling to $10k+',
                goals: [
                    'Integrate personal "Newsletters" via the link',
                    'Add "Tip Me in USDC" directly on the page',
                    'Build a verified "Creator Directory"'
                ]
            }
        }
    }
};
