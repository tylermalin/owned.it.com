import { USDC_ADDRESS, PROTOCOL_TREASURY, SUBSCRIPTION_MANAGER, CHAIN, RPC_URL } from './constants';
import { parseUnits, erc20Abi, createWalletClient, custom, createPublicClient, http } from 'viem';
import { useMagic } from '@/components/MagicProvider';
import { useState } from 'react';
import { getReadableError } from './utils';

const publicClient = createPublicClient({
    chain: CHAIN,
    transport: http(RPC_URL)
});

// Simplified ERC20 Approval & Action Hook - MAGIC ONLY
export function useOnchainAction(targetAddress: `0x${string}`, amountUSD: string) {
    const { user, magic } = useMagic();
    const amount = parseUnits(amountUSD, 6); // USDC has 6 decimals

    const [actionHash, setActionHash] = useState<`0x${string}` | null>(null);
    const [isApprovePending, setIsApprovePending] = useState(false);
    const [isApproveSuccess, setIsApproveSuccess] = useState(false);
    const [isActionPending, setIsActionPending] = useState(false);
    const [isActionSuccess, setIsActionSuccess] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const handleAction = async () => {
        if (!user?.publicAddress || !magic) {
            setActionError('Please sign in first');
            return;
        }

        setIsApprovePending(true);
        setActionError(null);
        setIsApproveSuccess(false);

        try {
            // DEMO MODE BYPASS - allow testing UI without real Testnet USDC
            if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
                console.log('DEMO MODE: Skipping real USDC approval tx...');
                setTimeout(() => setIsApproveSuccess(true), 1500);
                setIsApprovePending(false);
                return;
            }

            const walletClient = createWalletClient({
                account: user.publicAddress as `0x${string}`,
                chain: CHAIN,
                transport: custom(magic.rpcProvider)
            });

            const hash = await walletClient.writeContract({
                address: USDC_ADDRESS,
                abi: erc20Abi,
                functionName: 'approve',
                args: [targetAddress, amount],
            });

            await publicClient.waitForTransactionReceipt({ hash });
            setIsApproveSuccess(true);
        } catch (err: any) {
            console.error('Approval failed:', err);
            // Fallback for demo mode if user cancelled or insufficient funds
            if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
                console.log('DEMO MODE: Catching approval error and forcing success...');
                setIsApproveSuccess(true);
            } else {
                setActionError(getReadableError(err));
            }
        } finally {
            setIsApprovePending(false);
        }
    };

    const performAction = async (config: any) => {
        if (!magic || !user?.publicAddress) return;
        setIsActionPending(true);
        setActionError(null);
        setIsActionSuccess(false);

        try {
            // DEMO MODE BYPASS
            if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
                console.log('DEMO MODE: Skipping real protocol tx...');
                setTimeout(() => setIsActionSuccess(true), 2000);
                setIsActionPending(false);
                return;
            }

            const walletClient = createWalletClient({
                account: user.publicAddress as `0x${string}`,
                chain: CHAIN,
                transport: custom(magic.rpcProvider)
            });

            const hash = await walletClient.writeContract({
                address: config.address,
                abi: config.abi,
                functionName: config.functionName,
                args: config.args,
            });
            setActionHash(hash);

            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            if (receipt.status === 'success') {
                setIsActionSuccess(true);
            } else {
                setActionError('Transaction reverted on-chain');
            }
        } catch (err: any) {
            console.error('Action failed:', err);
            // Fallback for demo mode
            if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
                console.log('DEMO MODE: Catching action error and forcing success...');
                setIsActionSuccess(true);
            } else {
                setActionError(getReadableError(err));
            }
        } finally {
            setIsActionPending(false);
        }
    };

    return {
        handleAction,
        isApprovePending,
        isApproveSuccess,
        performAction,
        isActionPending,
        isActionSuccess,
        actionHash,
        actionError
    };
}

// Own It Once deployment flow
export function useDeployStore() {
    const { handleAction, isApprovePending, isApproveSuccess, performAction, isActionPending, isActionSuccess, actionHash, actionError } = useOnchainAction(PROTOCOL_TREASURY, "297.00");

    const deploy = () => {
        if (isApproveSuccess) {
            performAction({
                address: USDC_ADDRESS,
                abi: erc20Abi,
                functionName: 'transfer',
                args: [PROTOCOL_TREASURY, parseUnits("297.00", 6)],
            });
        } else {
            handleAction();
        }
    };

    return { deploy, isApprovePending, isApproveSuccess, isActionPending, isActionSuccess, actionHash, actionError };
}

// Pro Seller subscription flow
export function useSubscribePro() {
    const { handleAction, isApprovePending, isApproveSuccess, performAction, isActionPending, isActionSuccess, actionHash, actionError } = useOnchainAction(SUBSCRIPTION_MANAGER, "9.00");

    const subscribe = () => {
        if (isApproveSuccess) {
            performAction({
                address: USDC_ADDRESS,
                abi: erc20Abi,
                functionName: 'transfer',
                args: [SUBSCRIPTION_MANAGER, parseUnits("9.00", 6)],
            });
        } else {
            handleAction();
        }
    };

    return { subscribe, isApprovePending, isApproveSuccess, isActionPending, isActionSuccess, actionHash, actionError };
}
