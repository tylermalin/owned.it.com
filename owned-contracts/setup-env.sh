#!/bin/bash

# OWNED Contract Deployment - Environment Setup Helper
# This script helps you set up your .env file correctly

echo "=== OWNED Contract Deployment Setup ==="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Creating from template..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
fi

echo "📋 Current .env configuration:"
echo ""

# Check PRIVATE_KEY
if grep -q "your_private_key_here" .env; then
    echo "❌ PRIVATE_KEY: Not set (still has placeholder)"
    echo "   → Export your private key from MetaMask/wallet"
    echo "   → Must include '0x' prefix"
    echo "   → Should be 66 characters total (0x + 64 hex chars)"
else
    PRIVATE_KEY=$(grep "^PRIVATE_KEY=" .env | cut -d'=' -f2)
    if [[ $PRIVATE_KEY == 0x* ]] && [ ${#PRIVATE_KEY} -eq 66 ]; then
        echo "✅ PRIVATE_KEY: Set correctly (0x + 64 characters)"
    else
        echo "⚠️  PRIVATE_KEY: Set but may be incorrect"
        echo "   → Current length: ${#PRIVATE_KEY} (should be 66)"
        echo "   → Must start with 0x"
    fi
fi

# Check PLATFORM_FEE_ADDRESS
if grep -q "your_platform_fee_wallet_here" .env; then
    echo "❌ PLATFORM_FEE_ADDRESS: Not set (still has placeholder)"
    echo "   → Use your wallet address (with 0x prefix)"
else
    PLATFORM_ADDRESS=$(grep "^PLATFORM_FEE_ADDRESS=" .env | cut -d'=' -f2)
    if [[ $PLATFORM_ADDRESS == 0x* ]] && [ ${#PLATFORM_ADDRESS} -eq 42 ]; then
        echo "✅ PLATFORM_FEE_ADDRESS: Set correctly"
    else
        echo "⚠️  PLATFORM_FEE_ADDRESS: Set but may be incorrect"
        echo "   → Should start with 0x and be 42 characters total"
    fi
fi

# Check RPC URL
if grep -q "https://sepolia.base.org" .env; then
    echo "✅ BASE_SEPOLIA_RPC_URL: Set to default"
else
    echo "⚠️  BASE_SEPOLIA_RPC_URL: Custom value set"
fi

# Check BaseScan API key
if grep -q "your_basescan_api_key_here" .env; then
    echo "⚠️  BASESCAN_API_KEY: Not set (contract won't be auto-verified)"
    echo "   → Get from: https://basescan.org/myapikey"
    echo "   → Optional but recommended"
else
    echo "✅ BASESCAN_API_KEY: Set"
fi

echo ""
echo "=== Next Steps ==="
echo ""

# Count issues
ISSUES=0
grep -q "your_private_key_here" .env && ((ISSUES++))
grep -q "your_platform_fee_wallet_here" .env && ((ISSUES++))

if [ $ISSUES -eq 0 ]; then
    echo "✅ Environment looks good!"
    echo ""
    echo "Ready to deploy:"
    echo "  source .env"
    echo "  forge script script/Deploy.s.sol --rpc-url \$BASE_SEPOLIA_RPC_URL --broadcast --verify"
else
    echo "⚠️  Please update your .env file with actual values"
    echo ""
    echo "Edit .env and replace:"
    echo "  - PRIVATE_KEY with your wallet's private key (WITH 0x prefix)"
    echo "  - PLATFORM_FEE_ADDRESS with your wallet address (with 0x prefix)"
    echo ""
    echo "Then run this script again to verify."
fi

echo ""
