const { createPublicClient, http } = require('viem');
const { baseSepolia } = require('viem/chains');
const CreatorStoreABI = require('./lib/CreatorStoreABI.json');

const CREATOR_STORE_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x2CfE077af112B9F6e6Ed39e327D3d31c840401BD';

async function debugProduct() {
    const client = createPublicClient({
        chain: baseSepolia,
        transport: http('https://sepolia.base.org')
    });
    try {
        const product = await client.readContract({
            address: CREATOR_STORE_ADDRESS,
            abi: CreatorStoreABI,
            functionName: 'getProduct',
            args: [8n]
        });
        console.log('Product 8 details:', {
            price: product.price.toString(),
            ipfsHash: product.ipfsHash,
            maxSupply: product.maxSupply.toString(),
            sold: product.sold.toString(),
            active: product.active,
            creator: product.creator
        });
    } catch (err) {
        console.error('Error fetching product 8:', err);
    }
}

debugProduct();
