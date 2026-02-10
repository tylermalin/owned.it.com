# Getting Your NFT.Storage API Token

NFT.Storage provides free IPFS storage for NFTs and metadata. Follow these steps:

## Step 1: Sign Up (Free)

1. Visit <https://nft.storage>
2. Click "Sign Up" or "Get Started"
3. Sign up with your email or GitHub account
4. Verify your email

## Step 2: Get API Token

1. Once logged in, go to your dashboard
2. Click on "API Keys" in the sidebar
3. Click "New Key" or "+ Create New Key"
4. Give it a name (e.g., "OWNED Dashboard")
5. Copy the generated token (starts with `eyJ...`)

## Step 3: Add to Your Project

1. Open `/Users/tylermalin/owned.it.com/owned-frontend/.env.local`
2. Replace `your_nft_storage_token_here` with your actual token:

   ```
   NEXT_PUBLIC_NFT_STORAGE_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Save the file
4. Restart your dev server (the terminal will auto-reload)

## Step 4: Test

1. Visit <http://localhost:3000/dashboard/products>
2. Select a product type
3. Fill in product details
4. Click "Upload to IPFS & Generate Hash"
5. Should work! ✅

## Free Tier Limits

- ✅ Unlimited uploads
- ✅ Unlimited storage
- ✅ No credit card required
- ✅ Perfect for development and production

## Alternative: Manual Entry

If you prefer not to use NFT.Storage, you can:

1. Upload your metadata to IPFS manually using any service
2. Copy the IPFS hash
3. Paste it directly into the "IPFS Hash" field
4. Skip the "Upload to IPFS" button

---

**Need Help?**

- NFT.Storage Docs: <https://nft.storage/docs>
- Discord: <https://discord.gg/nftstorage>
