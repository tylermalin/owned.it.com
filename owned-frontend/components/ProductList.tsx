import { useProduct } from '@/lib/hooks';
import { useDeactivateProduct } from '@/lib/dashboardHooks';
import { formatUSDC } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

interface ProductListProps {
    onEdit?: (productId: number) => void;
}

export function ProductList({ onEdit }: ProductListProps) {
    // Featured Amazing Demo Products
    const productIds = [1, 2];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl">
            {productIds.map((id) => (
                <ProductCardItem key={id} productId={id} onEdit={onEdit} />
            ))}
        </div>
    );
}

function ProductCardItem({ productId, onEdit }: { productId: number; onEdit?: (id: number) => void }) {
    const { data: product, isLoading } = useProduct(productId);
    const { deactivateProduct, isPending, isSuccess, error } = useDeactivateProduct();

    useEffect(() => {
        if (isSuccess) {
            toast.success(`Product #${productId} deactivated.`);
        }
    }, [isSuccess]);

    useEffect(() => {
        if (error) {
            toast.error('Failed to deactivate product.');
        }
    }, [error]);

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

    const handleDeactivate = () => {
        if (confirm('Are you sure you want to deactivate this product? It will no longer be available for sale.')) {
            deactivateProduct(productId);
        }
    };

    return (
        <div className="group bg-white border border-border p-8 rounded-4xl shadow-sm hover:shadow-saas hover:border-primary/30 transition-all flex flex-col space-y-6">
            <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-primary italic shadow-sm">
                    {productId}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit?.(productId)}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary hover:bg-white border border-transparent hover:border-border rounded-xl transition-all"
                        title="Edit Product"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button
                        onClick={handleDeactivate}
                        disabled={isPending}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white border border-transparent hover:border-border rounded-xl transition-all"
                        title="Deactivate Product"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16"></path></svg>
                    </button>
                </div>
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
                </div>
            </div>

            <div className="mt-auto pt-6">
                <Link
                    href={`/products/${productId}/checkout`}
                    target="_blank"
                    className="block w-full text-center py-4 bg-slate-50 text-foreground text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-white transition-all border border-border shadow-sm"
                >
                    View Storefront
                </Link>
            </div>
        </div>
    );
}
