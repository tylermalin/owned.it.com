'use client';

import { usePublicClient } from 'wagmi';
import { useEffect, useState } from 'react';
import { CREATOR_STORE_ADDRESS } from '@/lib/constants';
import CreatorStoreABI from '@/lib/CreatorStoreABI.json';
import { formatUSDC, shortenAddress } from '@/lib/utils';

interface Activity {
    type: 'sale' | 'withdrawal';
    amount: bigint;
    address: string;
    timestamp: string;
    txHash: string;
}

export function RecentActivity() {
    const publicClient = usePublicClient();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchActivity() {
            if (!publicClient) return;

            try {
                setError(null);
                // Fetch last 1000 blocks for sales
                // In a real app, you'd want a more robust indexing solution
                const logs = await publicClient.getContractEvents({
                    address: CREATOR_STORE_ADDRESS,
                    abi: CreatorStoreABI,
                    eventName: 'ProductPurchased',
                    fromBlock: 'earliest', // Note: On Base Sepolia this is fine for now
                });

                const formattedLogs = logs.map((log: any) => ({
                    type: 'sale' as const,
                    productId: log.args.productId,
                    amount: log.args.price as bigint,
                    address: log.args.buyer as string,
                    txHash: log.transactionHash,
                    timestamp: 'Recent', // Timestamps require fetching block data
                })).reverse();

                setActivities(formattedLogs as any);
            } catch (err: any) {
                console.error('Error fetching activity:', err);
                setError('Unable to fetch recent activity. The blockchain provider may be temporarily down.');
            } finally {
                setIsLoading(false);
            }
        }


        fetchActivity();
    }, [publicClient]);

    if (isLoading) return <div className="text-sm animate-pulse">Loading activity...</div>;
    if (error) return <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/10 p-4 border border-red-200 dark:border-red-800">{error}</div>;
    if (activities.length === 0) return <div className="text-sm text-neutral-500 italic">No recent activity</div>;

    return (
        <div className="border border-neutral-200 dark:border-neutral-800">
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {activities.slice(0, 5).map((activity, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                        <div className="flex flex-col">
                            <span className="font-bold">Sale: Product #{(activity as any).productId.toString()}</span>
                            <span className="text-xs text-neutral-500">{shortenAddress(activity.address)} bought this</span>
                        </div>
                        <div className="text-right flex flex-col">
                            <span className="font-serif font-bold">+{formatUSDC(activity.amount)}</span>
                            <a
                                href={`https://sepolia.basescan.org/tx/${activity.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-neutral-400 hover:text-neutral-600 underline"
                            >
                                View Tx
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
