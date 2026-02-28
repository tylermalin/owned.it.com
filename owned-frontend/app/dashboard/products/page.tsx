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
            <div className="space-y-16">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Products</h1>
                        <p className="text-lg text-muted-foreground font-medium">
                            Manage and scale your digital catalog.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        {!editProductId && (
                            <button
                                onClick={() => setIsBundleMode(!isBundleMode)}
                                className={`px-6 py-3 rounded-2xl font-bold transition-all border ${isBundleMode
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-white text-foreground border-border hover:bg-slate-50'}`}
                            >
                                {isBundleMode ? 'List Single Item' : 'Create Bundle'}
                            </button>
                        )}
                        {editProductId && (
                            <button
                                onClick={() => setEditProductId(null)}
                                className="px-6 py-3 bg-slate-100 text-foreground rounded-2xl font-bold hover:bg-slate-200 transition-all"
                            >
                                Back to Add
                            </button>
                        )}
                    </div>
                </div>

                {/* Test Mode Banner for non-owners */}
                <div className="bg-primary/5 border border-primary/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 shadow-sm">
                    <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-3xl">
                        🧪
                    </div>
                    <div className="flex-1 space-y-2 text-center md:text-left">
                        <h3 className="font-bold text-xl tracking-tight">Try Selling (Test Mode)</h3>
                        <p className="text-muted-foreground font-medium">
                            You can create test products and build bundles locally. This helps you test the checkout flow before launching your own on-chain store.
                        </p>
                    </div>
                    <Link
                        href="/register"
                        className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-saas hover:scale-105 transition-all whitespace-nowrap"
                    >
                        Launch On-Chain Store
                    </Link>
                </div>

                <div className="glass-card p-1">
                    <div className="p-8 md:p-12 bg-white rounded-[2.5rem] border border-border shadow-saas">
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold tracking-tight mb-2">
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
