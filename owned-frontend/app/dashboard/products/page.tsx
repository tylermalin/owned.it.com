'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProductForm } from '@/components/ProductForm';
import { ProductList } from '@/components/ProductList';
import { BundleBuilder } from '@/components/BundleBuilder';
import Link from 'next/link';

export default function ProductsPage() {
    const [editProductId, setEditProductId] = useState<number | null>(null);
    const [isBundleMode, setIsBundleMode] = useState(false);

    return (
        <DashboardLayout>
            <div className="space-y-10">
                <div className="flex flex-wrap justify-between items-end gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight">Products</h1>
                        <p className="text-sm md:text-base text-muted-foreground font-medium">
                            Manage and scale your digital catalog.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {!editProductId && (
                            <button
                                onClick={() => setIsBundleMode(!isBundleMode)}
                                className={isBundleMode
                                    ? 'btn-brand rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em]'
                                    : 'btn-secondary rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em]'}
                            >
                                {isBundleMode ? 'List Single Item' : 'Create Bundle'}
                            </button>
                        )}
                        {editProductId && (
                            <button
                                onClick={() => setEditProductId(null)}
                                className="btn-secondary rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em]"
                            >
                                Back to Add
                            </button>
                        )}
                    </div>
                </div>

                {/* Test Mode Banner for non-owners */}
                <div className="bg-primary/5 border border-primary/10 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-2xl shrink-0">
                        🧪
                    </div>
                    <div className="flex-1 space-y-2 text-center md:text-left">
                        <h3 className="font-black text-xl tracking-tight">Try Selling (Test Mode)</h3>
                        <p className="text-muted-foreground font-medium">
                            You can create test products and build bundles locally. This helps you test the checkout flow before launching your own on-chain store.
                        </p>
                    </div>
                    <Link
                        href="/register"
                        className="btn-brand rounded-xl px-6 h-12 inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em] whitespace-nowrap"
                    >
                        Launch On-Chain Store
                    </Link>
                </div>

                <div>
                    <div className="p-6 md:p-8 bg-white rounded-3xl border border-border">
                        <div className="mb-8">
                            <h2 className="text-xl md:text-2xl font-black tracking-tight mb-2">
                                {editProductId ? `Edit Product #${editProductId}` : isBundleMode ? 'Create New Bundle' : 'Add New Product'}
                            </h2>
                            <div className="h-1 w-12 bg-primary rounded-full" />
                        </div>
                        {isBundleMode && !editProductId ? (
                            <BundleBuilder
                                onSuccess={() => setIsBundleMode(false)}
                                onCancel={() => setIsBundleMode(false)}
                            />
                        ) : (
                            <ProductForm
                                editProductId={editProductId}
                                onSuccess={() => setEditProductId(null)}
                                onCancel={() => setEditProductId(null)}
                            />
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl md:text-2xl font-black tracking-tight">Your Portfolio</h2>
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
