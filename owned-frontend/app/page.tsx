import { Metadata } from 'next';
import { LandingPageClient } from '@/components/LandingPageClient';

export const metadata: Metadata = {
  title: "OWNED: Deploy Your Sovereign Creator Store on Base | 3% Fees, Instant Settlement, Zero Custody Risk",
  description: "Deploy your own creator storefront smart contract on Base. Accept USDC instantly, sell directly to your audience. 3% fees, no middlemen, no custody risk. Own your infrastructure, not rent it.",
  openGraph: {
    title: "OWNED: Deploy Your Sovereign Creator Store on Base",
    description: "Deploy your own creator storefront smart contract on Base. Accept USDC instantly, sell directly to your audience. 3% fees, no middlemen, no custody risk.",
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
