import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia } from 'wagmi/chains';
import { http, fallback } from 'wagmi';

// Redefine baseSepolia with a working RPC to prevent failover to the unhealthy default node
const healthyBaseSepolia = {
  ...baseSepolia,
  rpcUrls: {
    ...baseSepolia.rpcUrls,
    default: {
      http: ['https://base-sepolia-rpc.publicnode.com'],
    },
    public: {
      http: ['https://base-sepolia-rpc.publicnode.com'],
    },
  },
};

export const config = getDefaultConfig({
  appName: 'OWNED',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [healthyBaseSepolia],
  transports: {
    [baseSepolia.id]: fallback([
      http('https://base-sepolia-rpc.publicnode.com'),
      http('https://base-sepolia.gateway.tenderly.co'),
    ]),
  },
  ssr: true,
});


