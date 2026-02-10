import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';

export default function ProductsPage() {
    // Show both products
    const productIds = [1, 2];

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Header */}
            <header className="bg-white border-b border-border sticky top-0 z-50 backdrop-blur-md bg-white/80">
                <div className="max-w-7xl mx-auto px-6 py-[10px] flex justify-between items-center">
                    <Link href="/" className="py-2">
                        <img src="/assets/logo.png" alt="OWNED" className="w-[150px] h-[150px] object-contain hover:scale-105 transition-transform" />
                    </Link>
                    <ConnectButton />
                </div>
            </header>

            {/* Products Grid */}
            <main className="max-w-7xl mx-auto px-6 py-20">
                <div className="mb-16 text-center space-y-4">
                    <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                        Marketplace
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Available Products</h1>
                    <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
                        Discover knowledge and tools from your favorite creators. Secure checkout via USDC on Base.
                    </p>
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
                <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground font-medium">
                    <p>© 2026 OWNED · IT</p>
                </div>
            </footer>
        </div>
    );
}
