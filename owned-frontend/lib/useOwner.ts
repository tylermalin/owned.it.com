import { CREATOR_STORE_ADDRESS, CHAIN, RPC_URL } from './constants';
import CreatorStoreABI from './CreatorStoreABI.json';
import { createPublicClient, http } from 'viem';
import { useState, useEffect } from 'react';

const publicClient = createPublicClient({
    chain: CHAIN,
    transport: http(RPC_URL)
});

export function useContractOwner() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!CREATOR_STORE_ADDRESS || CREATOR_STORE_ADDRESS === '0x') {
            setIsLoading(false);
            return;
        }

        const fetch = async () => {
            try {
                const res = await publicClient.readContract({
                    address: CREATOR_STORE_ADDRESS,
                    abi: CreatorStoreABI,
                    functionName: 'owner',
                });
                setData(res);
                setError(null);
            } catch (err: any) {
                console.warn('Contract owner fetch failed (likely address mismatch or undeployed):', err.message);
                setError(err);
                setData(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetch();
    }, []);

    return { data, isLoading, error };
}
