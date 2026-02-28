'use client';

import { Nav } from '@/components/Nav';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';
import {
    Search,
    ArrowRight,
    ShoppingBag,
    Sparkles
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
        <div className="min-h-screen bg-slate-50/50">
            <Nav />

            <main className="max-w-7xl mx-auto px-6 py-20">
                <div className="mb-16 space-y-10">
                    {/* Marketplace Header */}
                    <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-border shadow-saas">
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-primary/10">
                                <Sparkles className="w-3 h-3" /> Marketplace
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                                Products & Services
                            </h1>
                            <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
                                Browse all products, digital assets, and services available on the OWNED platform. Every purchase is verified onchain.
                            </p>

                            {/* Search */}
                            <div className="relative w-full max-w-lg mt-4">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search products & services..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-border rounded-2xl text-sm font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/30 focus:bg-white transition-all"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    {productIds.length} {productIds.length === 1 ? 'product' : 'products'} available
                                </span>
                                <div className="h-4 w-px bg-border" />
                                <Link href="/dashboard/deploy" className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                                    Sell yours <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="text-center py-32">
                        <p className="text-lg text-muted-foreground font-medium animate-pulse">Loading products...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {productIds.map((id) => (
                            <ProductCard key={id} productId={id} />
                        ))}
                    </div>
                )}

                {!isLoading && productIds.length === 0 && (
                    <div className="text-center py-32 bg-white rounded-4xl border border-border shadow-saas">
                        <p className="text-xl text-muted-foreground font-medium">
                            No products available yet.
                        </p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="py-20 border-t border-border bg-white mt-20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-sm text-muted-foreground font-medium">© 2026 OWNED · IT</p>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-all">
                        <Link href="/pricing" className="hover:text-primary transition-colors text-primary">Pricing</Link>
                        <Link href="/investors" className="hover:text-primary transition-colors">Investors</Link>
                        <Link href="https://x.com/owneditxyz" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Twitter</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
