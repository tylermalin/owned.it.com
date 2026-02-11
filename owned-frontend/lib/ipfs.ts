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
}

// Helper to upload via local proxy API (to bypass CORS)
async function uploadToLighthouse(blob: Blob | File, fileName: string): Promise<string> {
    const formData = new FormData();
    // Wrap blob in File if it's not already one, to ensure fileName is preserved
    const file = blob instanceof File ? blob : new File([blob], fileName, { type: blob.type });
    formData.append('file', file);

    const response = await fetch('/api/ipfs/upload', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Proxy Upload Error:', errorData);
        throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.Hash) {
        throw new Error('Invalid response from upload proxy');
    }

    return data.Hash;
}

export async function uploadToIPFS(metadata: ProductMetadata): Promise<string> {
    try {
        const metadataString = JSON.stringify(metadata, null, 2);
        const blob = new Blob([metadataString], { type: 'application/json' });
        return await uploadToLighthouse(blob, `metadata-${Date.now()}.json`);
    } catch (error: any) {
        console.error('Error uploading to IPFS:', error);
        throw new Error(`Failed to upload to IPFS: ${error?.message || 'Unknown error'}`);
    }
}

export async function uploadImageToIPFS(file: File): Promise<string> {
    try {
        return await uploadToLighthouse(file, file.name);
    } catch (error: any) {
        console.error('Error uploading image to IPFS:', error);
        throw new Error(`Failed to upload image to IPFS: ${error?.message || 'Unknown error'}`);
    }
}

// Helper to get IPFS gateway URL
export function getIPFSGatewayUrl(hash: string): string {
    return `https://nftstorage.link/ipfs/${hash}`;
}
