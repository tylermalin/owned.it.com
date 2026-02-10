import { useReadContract } from 'wagmi';
import { CREATOR_STORE_ADDRESS } from './constants';
import CreatorStoreABI from './CreatorStoreABI.json';

export function useContractOwner() {
    return useReadContract({
        address: CREATOR_STORE_ADDRESS,
        abi: CreatorStoreABI,
        functionName: 'owner',
    });
}
