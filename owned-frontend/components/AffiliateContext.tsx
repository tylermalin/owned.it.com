'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { storeReferral, getReferrer } from '@/lib/affiliateTracker';

interface AffiliateContextType {
    /** Get the active referrer address for a product ID */
    getReferrerForProduct: (productId: number) => string | null;
}

const AffiliateContext = createContext<AffiliateContextType>({
    getReferrerForProduct: () => null,
});

export function useAffiliate() {
    return useContext(AffiliateContext);
}

export function AffiliateProvider({ children }: { children: ReactNode }) {
    const searchParams = useSearchParams();

    // On mount, capture ?ref= param and store the referral
    useEffect(() => {
        const ref = searchParams.get('ref');
        if (!ref) return;

        // Try to extract productId from the URL path
        const pathMatch = window.location.pathname.match(/\/products\/(\d+)/);
        if (pathMatch) {
            const productId = parseInt(pathMatch[1]);
            storeReferral(productId, ref);
        }
    }, [searchParams]);

    const getReferrerForProduct = (productId: number): string | null => {
        return getReferrer(productId);
    };

    return (
        <AffiliateContext.Provider value={{ getReferrerForProduct }}>
            {children}
        </AffiliateContext.Provider>
    );
}
