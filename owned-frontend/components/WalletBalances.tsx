'use client';

import { useState, useEffect } from 'react';
import { useMagic } from '@/components/MagicProvider';
import { publicClient, useCreatorBalance } from '@/lib/hooks';
import { USDC_ADDRESS } from '@/lib/constants';
import { formatUSDC } from '@/lib/utils';
import { formatEther, erc20Abi } from 'viem';
import { Wallet, Coins, ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';

export function WalletBalances() {
    const { user: magicUser } = useMagic();
    const { data: claimableBalance } = useCreatorBalance();

    const [usdcBalance, setUsdcBalance] = useState<bigint | null>(null);
    const [ethBalance, setEthBalance] = useState<bigint | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!magicUser?.publicAddress) return;

        async function fetchBalances() {
            try {
                const eth = await publicClient.getBalance({
                    address: magicUser!.publicAddress as `0x${string}`
                });
                setEthBalance(eth);

                const usdc = await publicClient.readContract({
                    address: USDC_ADDRESS,
                    abi: erc20Abi,
                    functionName: 'balanceOf',
                    args: [magicUser!.publicAddress as `0x${string}`]
                });
                setUsdcBalance(usdc as bigint);
            } catch (err) {
                console.error("Failed to fetch balances", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchBalances();
        const interval = setInterval(fetchBalances, 10000);
        return () => clearInterval(interval);
    }, [magicUser?.publicAddress]);

    return (
        <div className="space-y-6 mb-16">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                    <Wallet className="w-8 h-8 text-primary" />
                    Wallet & Earnings
                </h2>
                <Link href={`https://basescan.org/address/${magicUser?.publicAddress}`} target="_blank" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                    View on Explorer →
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Native USDC Balance */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-saas relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Coins className="w-24 h-24 text-blue-500 -mr-8 -mt-8" />
                    </div>
                    <div className="relative z-10">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">
                            Wallet USDC
                        </div>
                        <div className="text-4xl font-black text-white italic tracking-tighter mb-2">
                            {isLoading ? '...' : (usdcBalance !== null ? formatUSDC(usdcBalance) : '$0.00')}
                        </div>
                        <div className="text-sm font-medium text-slate-500">
                            Available in your wallet
                        </div>
                    </div>
                </div>

                {/* Claimable Earnings */}
                <div className="bg-primary/10 border border-primary/20 p-8 rounded-[3rem] shadow-saas relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Wallet className="w-24 h-24 text-primary -mr-8 -mt-8" />
                    </div>
                    <div className="relative z-10">
                        <div className="text-[10px] font-black text-primary/80 uppercase tracking-[0.4em] mb-4">
                            Claimable Earnings
                        </div>
                        <div className="text-4xl font-black text-primary italic tracking-tighter mb-2">
                            {claimableBalance !== undefined ? formatUSDC(claimableBalance as bigint) : '$0.00'}
                        </div>
                        <div className="text-sm font-medium text-primary/60">
                            Revenue held in contract
                        </div>
                        {claimableBalance && (claimableBalance as bigint) > 0n && (
                            <Link href="/dashboard/withdraw" className="inline-flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                                Withdraw Now <ArrowRightLeft className="w-3 h-3" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* ETH Balance for Gas */}
                <div className="bg-white border border-border p-8 rounded-[3rem] shadow-sm relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-4">
                            Network Gas (ETH)
                        </div>
                        <div className="text-4xl font-black text-foreground italic tracking-tighter mb-2">
                            {isLoading ? '...' : (ethBalance !== null ? Number(formatEther(ethBalance)).toFixed(4) : '0.0000')}
                            <span className="text-xl ml-1 text-muted-foreground">ETH</span>
                        </div>
                        <div className="text-sm font-medium text-muted-foreground">
                            For transaction fees
                        </div>
                        {(!isLoading && ethBalance !== null && ethBalance === 0n) && (
                            <div className="mt-4 text-[10px] font-bold text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200 inline-block">
                                ⚠️ You need ETH to pay gas.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
