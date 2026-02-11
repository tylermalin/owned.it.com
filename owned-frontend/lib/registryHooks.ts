import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { USDC_ADDRESS, PROTOCOL_TREASURY, SUBSCRIPTION_MANAGER } from './constants';
import { parseUnits, erc20Abi } from 'viem';

// Simplified ERC20 Approval & Action Hook
export function useOnchainAction(targetAddress: `0x${string}`, amountUSD: string) {
    const amount = parseUnits(amountUSD, 6); // USDC has 6 decimals

    // Approval Hook
    const { writeContract: approve, data: approveHash, isPending: isApprovePending } = useWriteContract();
    const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });

    // Action Hook
    const { writeContract: performAction, data: actionHash, isPending: isActionPending, error: actionError } = useWriteContract();
    const { isLoading: isActionConfirming, isSuccess: isActionSuccess } = useWaitForTransactionReceipt({ hash: actionHash });

    const handleAction = async (actionFn: () => void) => {
        // In a real app, we'd check allowance first. For this simplified flow:
        approve({
            address: USDC_ADDRESS,
            abi: erc20Abi,
            functionName: 'approve',
            args: [targetAddress, amount],
        });
    };

    return {
        handleAction,
        isApprovePending: isApprovePending || isApproveConfirming,
        isApproveSuccess,
        performAction,
        isActionPending: isActionPending || isActionConfirming,
        isActionSuccess,
        actionHash,
        actionError
    };
}

// Own It Once deployment flow
export function useDeployStore() {
    const { handleAction, isApprovePending, isApproveSuccess, performAction, isActionPending, isActionSuccess, actionHash, actionError } = useOnchainAction(PROTOCOL_TREASURY, "299.00");

    const deploy = () => {
        if (isApproveSuccess) {
            // In a real scenario, this would call a Factory contract. 
            // For now, it's a direct USDC transfer to the treasury to signal intent.
            performAction({
                address: USDC_ADDRESS,
                abi: erc20Abi,
                functionName: 'transfer',
                args: [PROTOCOL_TREASURY, parseUnits("299.00", 6)],
            });
        } else {
            handleAction(() => { });
        }
    };

    return { deploy, isApprovePending, isApproveSuccess, isActionPending, isActionSuccess, actionHash, actionError };
}

// Pro Seller subscription flow
export function useSubscribePro() {
    const { handleAction, isApprovePending, isApproveSuccess, performAction, isActionPending, isActionSuccess, actionHash, actionError } = useOnchainAction(SUBSCRIPTION_MANAGER, "9.00");

    const subscribe = () => {
        if (isApproveSuccess) {
            // Mocking subscription call
            performAction({
                address: USDC_ADDRESS,
                abi: erc20Abi,
                functionName: 'transfer',
                args: [SUBSCRIPTION_MANAGER, parseUnits("9.00", 6)],
            });
        } else {
            handleAction(() => { });
        }
    };

    return { subscribe, isApprovePending, isApproveSuccess, isActionPending, isActionSuccess, actionHash, actionError };
}
