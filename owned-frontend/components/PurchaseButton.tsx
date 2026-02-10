'use client';

import { usePurchaseProduct } from '@/lib/hooks';
import { USDC_ADDRESS } from '@/lib/constants';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { formatUSDC } from '@/lib/utils';

// Minimal ERC20 ABI for approve function
const ERC20_ABI = [
    {
        name: 'approve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
    },
] as const;

interface PurchaseButtonProps {
    productId: number;
    price: bigint;
}

export function PurchaseButton({ productId, price }: PurchaseButtonProps) {
    const [step, setStep] = useState<'idle' | 'approving' | 'purchasing'>('idle');

    const {
        data: approveHash,
        writeContract: approve,
        isPending: isApprovePending
    } = useWriteContract();

    const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } =
        useWaitForTransactionReceipt({ hash: approveHash });

    const {
        purchaseProduct,
        isPending: isPurchasePending,
        isConfirming: isPurchaseConfirming,
        isSuccess: isPurchaseSuccess,
        error: purchaseError,
        hash: purchaseHash,
    } = usePurchaseProduct();

    // Handle approval success
    useEffect(() => {
        if (isApproveSuccess && step === 'approving') {
            toast.success('USDC approved! Now purchasing...');
            setStep('purchasing');
            purchaseProduct(productId);
        }
    }, [isApproveSuccess, step, productId, purchaseProduct]);

    // Handle purchase success
    useEffect(() => {
        if (isPurchaseSuccess) {
            toast.success('Purchase successful! NFT minted.');
            setStep('idle');
        }
    }, [isPurchaseSuccess]);

    // Handle purchase error
    useEffect(() => {
        if (purchaseError) {
            toast.error('Purchase failed. Please try again.');
            setStep('idle');
        }
    }, [purchaseError]);

    const handlePurchase = () => {
        setStep('approving');
        toast.loading('Approving USDC...', { id: 'approve' });

        approve({
            address: USDC_ADDRESS,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`, price],
        });
    };

    const isLoading = isApprovePending || isApproveConfirming || isPurchasePending || isPurchaseConfirming;
    const buttonText = step === 'approving'
        ? 'Approving USDC...'
        : step === 'purchasing'
            ? 'Purchasing...'
            : `Purchase for ${formatUSDC(price)}`;

    return (
        <button
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full py-3 px-6 bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
            {buttonText}
        </button>
    );
}
