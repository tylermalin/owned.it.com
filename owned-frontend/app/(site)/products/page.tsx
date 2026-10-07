'use client';

import { PageHeader } from '@/components/site/PageHeader';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';
import {
    Search,
    ArrowRight,
    ShoppingBag,
} from 'lucide-react';
import { useAllProducts } from '@/lib/hooks';
import { useState, useEffect } from 'react';

export default function ProductsPage() {
    const { productIds: allProductIds, isLoading } = useAllProducts({ excludeLocal: true });
    const [searchQuery, setSearchQuery] = useState('');
    const [hiddenIds, setHiddenIds] = useState<number[]>([]);

    // Load hidden products from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem('hidden-products');
            if (stored) setHiddenIds(JSON.parse(stored));
        } catch { }
    }, []);

    const productIds = allProductIds.filter(id => !hiddenIds.includes(id));

    return (
        <>
            <PageHeader
                eyebrow="Marketplace"
                title="Products &"
                accent="Services"
                lede="Browse all products, digital assets, and services available on the OWNED platform. Every purchase is verified onchain."
            >
                {/* Search */}
                <div className="mt-8 w-full max-w-lg">
                    <label htmlFor="product-search" className="mb-2 block text-xs font-bold text-foreground">
                        Search
                    </label>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <input
                            id="product-search"
                            type="text"
                            placeholder="Search products & services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-12 w-full rounded-xl border border-border bg-white pl-12 pr-4 text-base font-medium placeholder:text-muted-foreground/50 focus:border-[var(--brand-magenta)] focus:outline-none focus:ring-2 focus:ring-[rgba(192,24,144,0.25)]"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                        <ShoppingBag className="h-3.5 w-3.5" />
                        {productIds.length} {productIds.length === 1 ? 'product' : 'products'} available
                    </span>
                    <div className="h-4 w-px bg-border" />
                    <Link href="/dashboard/deploy" className="link-draw flex items-center gap-1.5 pb-0.5 text-xs font-bold text-primary hover:text-foreground">
                        Sell yours <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
            </PageHeader>

            <div className="mx-auto max-w-7xl px-6 pb-16 md:pb-20">
                {/* Products Grid */}
                {isLoading ? (
                    <div className="py-32 text-center">
                        <p className="animate-pulse text-lg font-medium text-muted-foreground">Loading products...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {productIds.map((id) => (
                            <ProductCard key={id} productId={id} />
                        ))}
                    </div>
                )}

                {!isLoading && productIds.length === 0 && (
                    <div className="rounded-3xl border border-border bg-white py-32 text-center">
                        <p className="text-xl font-medium text-muted-foreground">
                            No products available yet.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
