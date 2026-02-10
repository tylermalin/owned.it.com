# NFT.Storage Token Issue

## Problem

The token in your `.env.local` file is not in the correct format for NFT.Storage.

Current token: `872a050b.0ee43d1665484d8ba209f3185acd192e`

This looks like it might be from:

- Pinata (different service)
- An API key instead of a JWT token
- A different NFT.Storage format

## Solution: Get the Correct Token

### Step 1: Visit NFT.Storage

Go to <https://nft.storage> and sign in (or create account)

### Step 2: Create API Key

1. Click "API Keys" in the left sidebar
2. Click "+ New Key" button
3. Give it a name (e.g., "OWNED Dashboard")
4. Click "Create"

### Step 3: Copy the Token

The token should look like this:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDEyMzQ1Njc4OTBhYmNkZWYxMjM0NTY3ODkwYWJjZGVmMTIzNDU2NzgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMzUyNjQwMCwibmFtZSI6Im15LWFwaS1rZXkifQ.abcdefghijklmnopqrstuvwxyz1234567890
```

**Key characteristics:**

- Starts with `eyJ`
- Very long (200+ characters)
- Contains dots (`.`) separating three parts
- Is a JWT (JSON Web Token)

### Step 4: Update .env.local

Replace line 6 in `/Users/tylermalin/owned.it.com/owned-frontend/.env.local`:

**Before:**

```env
NEXT_PUBLIC_NFT_STORAGE_TOKEN=872a050b.0ee43d1665484d8ba209f3185acd192e
```

**After:**

```env
NEXT_PUBLIC_NFT_STORAGE_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your_actual_token
```

### Step 5: Restart

The dev server will auto-reload when you save the file.

---

## Alternative: Skip IPFS Upload

You can still use the dashboard without NFT.Storage:

1. **Manual IPFS Upload:**
   - Upload your metadata JSON to any IPFS service (Pinata, Infura, etc.)
   - Copy the IPFS hash
   - Paste it directly into the "IPFS Hash" field
   - Skip the "Upload to IPFS" button

2. **Use Placeholder:**
   - For testing, you can use any string as the IPFS hash
   - Example: `QmTest123`
   - The contract will accept any string

The dashboard works perfectly fine with manual IPFS hash entry!
