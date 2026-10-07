import { Metadata } from 'next';
import { LandingPageClient } from '@/components/LandingPageClient';

export const metadata: Metadata = {
  title: "OWNED: Deploy Your Creator Store on Base | Fixed 3% Fee · Private Beta",
  description: "Deploy your own creator storefront smart contract on Base. USDC checkout, an onchain receipt for every sale, a fixed 3% fee. In private beta on Base Sepolia testnet — mainnet launch December 8, 2026.",
  openGraph: {
    title: "OWNED: Deploy Your Creator Store on Base",
    description: "USDC checkout, onchain receipts, a fixed 3% fee. In private beta on Base Sepolia testnet — mainnet launch December 8, 2026.",
    images: ["https://ownedit.xyz/assets/logo.png"],
  },
  other: {
    'base:app_id': '698bc660f5cfc733257240f2',
    'fc:miniapp': JSON.stringify({
      version: "next",
      imageUrl: "https://ownedit.xyz/assets/logo.png",
      button: {
        title: "Launch App",
        action: {
          type: "launch_miniapp",
          name: "OWNED IT",
          url: "https://ownedit.xyz"
        }
      }
    }),
  },
};

export default function Home() {
  return <LandingPageClient />;
}
