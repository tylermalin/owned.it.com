'use client';

import { useEffect } from 'react';
import { useWithdrawCreator } from '@/lib/dashboardHooks';
import { useCreatorBalance } from '@/lib/hooks';
import toast from 'react-hot-toast';

export function WithdrawButton() {
    const { data: balance } = useCreatorBalance();
    const { withdraw, isPending, isConfirming, isSuccess, error } = useWithdrawCreator();

    useEffect(() => {
        if (isSuccess) {
            toast.success('Withdrawal successful! USDC transferred to your wallet.');
        }
    }, [isSuccess]);

    useEffect(() => {
        if (error) {
            toast.error('Withdrawal failed. Please try again.');
        }
    }, [error]);

    const handleWithdraw = () => {
        if (!balance || balance === BigInt(0)) {
            toast.error('No balance to withdraw');
            return;
        }
        withdraw();
    };

    const isLoading = isPending || isConfirming;
    const hasBalance = balance && (balance as bigint) > BigInt(0);

    return (
        <button
            onClick={handleWithdraw}
            disabled={isLoading || !hasBalance}
            className="w-full py-3 px-6 bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
            {isPending
                ? 'Confirming...'
                : isConfirming
                    ? 'Withdrawing...'
                    : !hasBalance
                        ? 'No Balance to Withdraw'
                        : 'Withdraw to Wallet'}
        </button>
    );
}
