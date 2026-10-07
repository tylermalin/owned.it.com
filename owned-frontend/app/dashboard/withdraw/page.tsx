'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { WithdrawButton } from '@/components/WithdrawButton';
import { useCreatorBalance } from '@/lib/hooks';
import { formatUSDC } from '@/lib/utils';

export default function WithdrawPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">Withdraw Earnings</h1>
                    <p className="text-sm md:text-base text-muted-foreground font-medium">
                        Transfer your creator balance to your wallet
                    </p>
                </div>

                <BalanceCard />

                <div className="max-w-2xl">
                    <div className="rounded-3xl border border-border bg-white p-6 md:p-8 space-y-4">
                        <h2 className="text-xl font-black tracking-tight">How It Works</h2>
                        <ul className="space-y-2 text-muted-foreground font-medium">
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
            <div className="rounded-3xl border border-border bg-white p-6 md:p-8">
                <div className="mb-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Available Balance
                    </div>
                    <div className="text-4xl md:text-5xl font-black tracking-tight">
                        {isLoading ? '...' : balance ? formatUSDC(balance as bigint) : '$0.00'}
                    </div>
                </div>

                <WithdrawButton />
            </div>
        </div>
    );
}
