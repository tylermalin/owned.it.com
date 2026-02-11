'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProductForm } from '@/components/ProductForm';
import { ProductList } from '@/components/ProductList';

export default function ProductsPage() {
    const [editProductId, setEditProductId] = useState<number | null>(null);

    return (
        <DashboardLayout>
            <div className="space-y-16">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Products</h1>
                        <p className="text-lg text-muted-foreground font-medium">
                            Manage and scale your digital catalog.
                        </p>
                    </div>
                    {editProductId && (
                        <button
                            onClick={() => setEditProductId(null)}
                            className="px-6 py-3 bg-slate-100 text-foreground rounded-2xl font-bold hover:bg-slate-200 transition-all"
                        >
                            Back to Add
                        </button>
                    )}
                </div>

                <div className="glass-card p-1">
                    <div className="p-8 md:p-12 bg-white rounded-[2.5rem] border border-border shadow-saas">
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold tracking-tight mb-2">
                                {editProductId ? `Edit Product #${editProductId}` : 'Add New Product'}
                            </h2>
                            <div className="h-1 w-12 bg-primary rounded-full" />
                        </div>
                        <ProductForm
                            editProductId={editProductId}
                            onSuccess={() => setEditProductId(null)}
                            onCancel={() => setEditProductId(null)}
                        />
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold tracking-tight">Your Portfolio</h2>
                        <div className="flex-1 h-px bg-border" />
                    </div>
                    <ProductList onEdit={(id) => {
                        setEditProductId(id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} />
                </div>
            </div>
        </DashboardLayout>
    );
}
