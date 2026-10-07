'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { ReferralsNotice } from '@/components/ReferralsNotice';

export default function AffiliatesPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight">Affiliates</h1>
                </div>
                <div className="flex justify-center">
                    <ReferralsNotice />
                </div>
            </div>
        </DashboardLayout>
    );
}
