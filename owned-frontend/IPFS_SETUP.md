# IPFS Setup with Pinata

We've switched to **Pinata** for IPFS uploads because Lighthouse was experiencing connection timeouts on your network. Pinata is the industry standard and highly reliable.

## How to Get Your Pinata JWT

1. Visit [Pinata Cloud](https://app.pinata.cloud/) and sign up for a free account.
2. Go to **API Keys** in the sidebar.
3. Click **"New Key"**.
4. Enable **all admin permissions** (default).
5. Give it a name (e.g., "Owned Store").
6. Click **"Generate Key"**.
7. **IMPORTANT**: Copy the **JWT** (the very long string). You won't be able to see it again!

## Configure Your Environment

Add the JWT to your `.env.local`:

```bash
NEXT_PUBLIC_PINATA_JWT=your_very_long_jwt_here
```

## How to Test

1. Restart your dev server: `npm run dev`
2. Go to: <http://localhost:3000/dashboard/products>
3. Fill in your product info and click **"Upload to IPFS"**.
4. The hash will now generate through our secure server-side proxy!

## Why Pinata?

- ✅ 1GB free storage
- ✅ Fastest IPFS pinning service
- ✅ Reliable API with no connection timeouts
- ✅ Industry standard for NFT projects
