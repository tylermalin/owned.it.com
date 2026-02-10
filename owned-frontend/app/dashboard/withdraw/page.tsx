'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { WithdrawButton } from '@/components/WithdrawButton';
import { useCreatorBalance } from '@/lib/hooks';
import { formatUSDC } from '@/lib/utils';

export default function WithdrawPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="font-serif text-4xl font-bold mb-2">Withdraw Earnings</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Transfer your creator balance to your wallet
                    </p>
                </div>

                <BalanceCard />

                <div className="max-w-2xl">
                    <div className="border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
                        <h2 className="font-serif text-2xl font-bold">How It Works</h2>
                        <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
                            <li>• You receive 97% of each sale</li>
                            <li>• Platform takes 3% fee</li>
                            <li>• Withdraw anytime to your connected wallet</li>
                            <li>• USDC is transferred directly onchain</li>
                        </ul>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function BalanceCard() {
    const { data: balance, isLoading } = useCreatorBalance();

    return (
        <div className="max-w-2xl">
            <div className="border border-neutral-200 dark:border-neutral-800 p-8">
                <div className="mb-6">
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                        Available Balance
                    </div>
                    <div className="font-serif text-5xl font-bold">
                        {isLoading ? '...' : balance ? formatUSDC(balance as bigint) : '$0.00'}
                    </div>
                </div>

                <WithdrawButton />
            </div>
        </div>
    );
}
