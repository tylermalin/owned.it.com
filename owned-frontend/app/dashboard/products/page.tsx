'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { AddProductForm } from '@/components/AddProductForm';
import { ProductList } from '@/components/ProductList';

export default function ProductsPage() {
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
                    <div className="hidden md:block">
                        <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-border shadow-sm">
                            <span className="text-xs font-black uppercase tracking-widest text-primary">Live on Base</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-1">
                    <div className="p-8 md:p-12 bg-white rounded-[2.5rem] border border-border shadow-saas">
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold tracking-tight mb-2">Add New Product</h2>
                            <div className="h-1 w-12 bg-primary rounded-full" />
                        </div>
                        <AddProductForm />
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold tracking-tight">Your Portfolio</h2>
                        <div className="flex-1 h-px bg-border" />
                    </div>
                    <ProductList />
                </div>
            </div>
        </DashboardLayout>
    );
}
