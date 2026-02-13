'use client';

import { Nav } from '@/components/Nav';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';
import {
    Twitter,
    Globe,
    MessageSquare,
    ArrowRight
} from 'lucide-react';
import { useAllProducts } from '@/lib/hooks';

export default function ProductsPage() {
    const { productIds, isLoading } = useAllProducts();

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Nav />

            {/* Products Grid */}
            <main className="max-w-7xl mx-auto px-6 py-20">
                <div className="mb-20 space-y-12">
                    {/* Store Info */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 bg-white p-12 rounded-[3.5rem] border border-border shadow-saas">
                        <div className="flex-1 space-y-6">
                            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-primary/10">
                                Verified Creator Store
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-5xl font-black tracking-tight">Tyler Malin</h2>
                                <h1 className="text-2xl font-bold text-muted-foreground italic">OWNED IT Official Store</h1>
                                <p className="text-lg text-muted-foreground font-medium max-w-xl leading-relaxed">
                                    Welcome to the official OWNED IT storefront. Here you'll find a curated selection of digital assets, tools, and services designed for the sovereign creator.
                                </p>

                                <div className="flex items-center gap-4 pt-4">
                                    <Link href="https://x.com/tylermalin" target="_blank" className="p-3 bg-slate-50 rounded-2xl border border-border hover:border-primary/30 hover:bg-white text-muted-foreground hover:text-primary transition-all group">
                                        <Twitter className="w-5 h-5" />
                                    </Link>
                                    <Link href="https://tylermalin.com" target="_blank" className="p-3 bg-slate-50 rounded-2xl border border-border hover:border-primary/30 hover:bg-white text-muted-foreground hover:text-primary transition-all">
                                        <Globe className="w-5 h-5" />
                                    </Link>
                                    <Link href="https://blog.ownedit.xyz" target="_blank" className="p-3 bg-slate-50 rounded-2xl border border-border hover:border-primary/30 hover:bg-white text-muted-foreground hover:text-primary transition-all">
                                        <MessageSquare className="w-5 h-5" />
                                    </Link>
                                    <div className="h-6 w-px bg-border mx-2" />
                                    <Link href="/deploy" className="flex items-center gap-2 px-6 py-3 bg-primary/5 hover:bg-primary/10 text-primary rounded-2xl border border-primary/10 text-[10px] font-black uppercase tracking-widest transition-all">
                                        OWN AUDIENCE <ArrowRight className="w-3 h-3 text-primary/50" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="w-48 h-48 rounded-[3rem] overflow-hidden border-4 border-white shadow-saas">
                            <img src="/assets/logo.png" alt="Tyler Malin" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Catalog Header */}
                    <div className="text-center space-y-4">
                        <h3 className="text-3xl font-extrabold tracking-tight">Product Catalog</h3>
                        <p className="text-muted-foreground font-medium">Verify your ownership of these exclusive assets on Base.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {productIds.map((id) => (
                        <ProductCard key={id} productId={id} />
                    ))}
                </div>

                {productIds.length === 0 && (
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
