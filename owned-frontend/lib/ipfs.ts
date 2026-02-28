// Removed unused import
// import { NFTStorage, File, Blob } from 'nft.storage';

export type ThumbnailStyle = 'button' | 'callout';

export interface ProductMetadata {
    name: string;
    description: string;
    subtitle?: string;
    bottomTitle?: string;
    callToAction?: string;
    thumbnailStyle?: ThumbnailStyle;
    productType: string;
    price: string;
    discountPrice?: string;
    image?: string;
    externalUrl?: string;
    digitalFileHash?: string;
    redirectUrl?: string;
    requiredInfo?: string[];
    salePoints?: string[];
    socialLinks?: {
        twitter?: string;
        website?: string;
        blog?: string;
        instagram?: string;
        github?: string;
    };
    attributes?: Array<{
        trait_type: string;
        value: string;
    }>;
    // Affiliate & Bundle System
    affiliateEnabled?: boolean;
    affiliatePercent?: number;
    bundleEnabled?: boolean;
    wholesalePrice?: string;
    bundleItems?: Array<{
        productId: number;
        creatorAddress: string;
        affiliatePercent: number;
    }>;
    // Coaching / Webinar — weekly availability
    availability?: {
        timezone: string;
        sessionDuration: number;   // minutes
        schedule: {
            day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
            startTime: string;     // "09:00"
            endTime: string;       // "17:00"
        }[];
    };
    // eCourse — structured module/lesson curriculum
    curriculum?: {
        modules: {
            title: string;
            lessons: {
                title: string;
                videoUrl?: string;
                slidesUrl?: string;
                description?: string;
            }[];
        }[];
    };
    // Community — NFT-gated Discord
    communityGating?: {
        discordInviteUrl: string;
        discordServerId?: string;
        gatingType: 'nft';
    };
    community?: {
        discordUrl: string;
    };
    // Consulting / Meeting
    consulting?: {
        meetingUrl: string;
    };
    // Merch / Print-on-Demand
    merch?: {
        storeLink: string;
        fulfillmentPartner?: string;
        sizes?: string[];
        colors?: { name: string; hex: string }[];
        mockupImages?: string[];   // IPFS hashes
    };
    testimonialDiscountPercent?: number;
    testimonialDiscountLimit?: number;
}


// Helper to upload directly to Pinata using a temporary, scoped API key
async function uploadToPinata(blob: Blob | File, fileName: string): Promise<string> {
    const formData = new FormData();
    // Wrap blob in File if it's not already one, to ensure fileName is preserved
    const file = blob instanceof File ? blob : new File([blob], fileName, { type: blob.type });
    formData.append('file', file);

    // Add metadata
    formData.append('pinataMetadata', JSON.stringify({ name: fileName }));

    // Get a temporary Pinata JWT from our backend (bypasses Vercel 4.5MB payload limit)
    const keyRes = await fetch('/api/ipfs/key');
    if (!keyRes.ok) {
        const errorData = await keyRes.json().catch(() => ({}));
        console.error('Failed to grab temporary upload key:', errorData);
        throw new Error(errorData.error || 'Failed to initialize secure upload session.');
    }
    const { JWT } = await keyRes.json();

    // Upload directly to Pinata from the browser
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${JWT}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error('Direct Pinata Upload Error:', errorData);
        throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.IpfsHash) {
        throw new Error('Invalid response from secure upload service');
    }

    return data.IpfsHash;
}

export async function uploadToIPFS(metadata: ProductMetadata): Promise<string> {
    try {
        const metadataString = JSON.stringify(metadata, null, 2);
        const blob = new Blob([metadataString], { type: 'application/json' });
        return await uploadToPinata(blob, `metadata-${Date.now()}.json`);
    } catch (error: any) {
        console.error('Error uploading to IPFS:', error);
        throw new Error(`Failed to upload to IPFS: ${error?.message || 'Unknown error'}`);
    }
}

export async function uploadImageToIPFS(file: File): Promise<string> {
    try {
        return await uploadToPinata(file, file.name);
    } catch (error: any) {
        console.error('Error uploading image to IPFS:', error);
        throw new Error(`Failed to upload image to IPFS: ${error?.message || 'Unknown error'}`);
    }
}

// Helper to get IPFS gateway URL using internal proxy to avoid CORS/reliability issues
export function getIPFSGatewayUrl(hash: string): string {
    return `/api/ipfs/fetch?hash=${hash}`;
}
