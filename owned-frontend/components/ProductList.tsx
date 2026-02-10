'use client';

import { useProduct } from '@/lib/hooks';
import { formatUSDC } from '@/lib/utils';
import Link from 'next/link';

export function ProductList() {
    // Featured Amazing Demo Products
    const productIds = [1, 2];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl">
            {productIds.map((id) => (
                <ProductCardItem key={id} productId={id} />
            ))}
        </div>
    );
}

function ProductCardItem({ productId }: { productId: number }) {
    const { data: product, isLoading } = useProduct(productId);

    if (isLoading) {
        return (
            <div className="bg-white border border-border p-8 rounded-4xl shadow-sm animate-pulse space-y-6">
                <div className="h-40 bg-slate-50 rounded-3xl" />
                <div className="space-y-3">
                    <div className="h-6 bg-slate-50 rounded-full w-3/4" />
                    <div className="h-4 bg-slate-50 rounded-full w-1/2" />
                </div>
            </div>
        );
    }

    if (!product || !(product as any).active) {
        return null;
    }

    const { price, ipfsHash, maxSupply, sold } = product as any;
    const supply = maxSupply > BigInt(0) ? maxSupply.toString() : '∞';

    return (
        <div className="group bg-white border border-border p-8 rounded-4xl shadow-sm hover:shadow-saas hover:border-primary/30 transition-all flex flex-col space-y-6">
            <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-primary italic shadow-sm">
                    {productId}
                </div>
                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                    Active
                </span>
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Value</p>
                    <p className="text-3xl font-black italic tracking-tighter text-foreground">{formatUSDC(price)} USDC</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-border border-dashed">
                    <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-muted-foreground uppercase tracking-widest">Circulation</span>
                        <span className="text-foreground">{sold.toString()} / {supply}</span>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 block">Metadata CID</span>
                        <span className="text-[10px] font-mono text-muted-foreground break-all bg-slate-50 p-2 rounded-xl block border border-border/50">{ipfsHash}</span>
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-6 flex gap-3">
                <Link
                    href={`/products/${productId}/checkout`}
                    className="flex-1 text-center py-4 bg-slate-50 text-foreground text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-white transition-all border border-border shadow-sm"
                >
                    View Store
                </Link>
                <button className="px-5 py-4 bg-white border border-border rounded-2xl hover:border-primary/30 transition-all group-hover:shadow-sm">
                    <svg className="w-4 h-4 text-muted-foreground group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
            </div>
        </div>
    );
}
