'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { ReferralsNotice } from '@/components/ReferralsNotice';

export default function AffiliatesPage() {
    return (
        <DashboardLayout>
            <div className="flex-1 flex items-center justify-center py-12">
                <ReferralsNotice />
            </div>
        </DashboardLayout>
    );
}
