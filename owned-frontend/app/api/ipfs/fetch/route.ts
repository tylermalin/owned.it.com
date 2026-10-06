import { NextResponse } from 'next/server';

// Disabled for security remediation. This route previously proxied reads from
// public IPFS gateways. It will be reintroduced in Phase 2 with a hardened
// design. Until then it returns 404.
export async function GET() {
    return new NextResponse('Not Found', { status: 404 });
}
