import { NextResponse } from 'next/server';
import { minikitConfig } from '../../../minikit.config';

export async function GET() {
    const manifest = {
        accountAssociation: minikitConfig.accountAssociation.header ? minikitConfig.accountAssociation : undefined,
        ...minikitConfig.miniapp
    };

    return NextResponse.json(manifest);
}
