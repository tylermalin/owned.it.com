import { useProduct, useAllProducts } from '@/lib/hooks';
import { useSetProductActive } from '@/lib/dashboardHooks';
import { formatUSDC } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

interface ProductListProps {
    onEdit?: (productId: number) => void;
}

export function ProductList({ onEdit }: ProductListProps) {
    const { productIds, isLoading: isLogsLoading } = useAllProducts();

    if (isLogsLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl">
                {[1, 2].map(id => (
                    <div key={id} className="bg-white border border-border p-8 rounded-4xl shadow-sm animate-pulse space-y-6">
                        <div className="h-40 bg-slate-50 rounded-3xl" />
                        <div className="space-y-3">
                            <div className="h-6 bg-slate-50 rounded-full w-3/4" />
                            <div className="h-4 bg-slate-50 rounded-full w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl">
            {productIds.map((id) => (
                <ProductCardItem key={id} productId={id} onEdit={onEdit} />
            ))}
            {productIds.length === 0 && (
                <div className="col-span-full py-12 text-center bg-slate-50 rounded-4xl border border-dashed border-border">
                    <p className="text-muted-foreground font-medium italic">No products launched yet. Launch your first product above.</p>
                </div>
            )}
        </div>
    );
}

function ProductCardItem({ productId, onEdit }: { productId: number; onEdit?: (id: number) => void }) {
    const { data: product, isLoading } = useProduct(productId);
    const { setProductActive, isPending, isSuccess, error } = useSetProductActive();

    useEffect(() => {
        if (isSuccess) {
            toast.success(`Store visibility updated.`);
        }
    }, [isSuccess]);

    useEffect(() => {
        if (error) {
            toast.error('Failed to update visibility.');
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

    if (!product) {
        return null;
    }

    const { price, ipfsHash, maxSupply, sold, active } = product as any;
    const supply = maxSupply > BigInt(0) ? maxSupply.toString() : '∞';

    const handleToggleActive = () => {
        setProductActive(productId, !active);
    };

    return (
        <div className="group bg-white border border-border p-8 rounded-4xl shadow-sm hover:shadow-saas hover:border-primary/30 transition-all flex flex-col space-y-6">
            <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-primary italic shadow-sm">
                    {productId}
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-1 mr-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-emerald-500' : 'text-slate-400'}`}>
                            {active ? 'Live on Store' : 'Hidden'}
                        </span>
                        <button
                            onClick={handleToggleActive}
                            disabled={isPending}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${active ? 'bg-emerald-500' : 'bg-slate-200'}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                        </button>
                    </div>
                    <button
                        onClick={() => onEdit?.(productId)}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary hover:bg-white border border-transparent hover:border-border rounded-xl transition-all"
                        title="Edit Product"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
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
