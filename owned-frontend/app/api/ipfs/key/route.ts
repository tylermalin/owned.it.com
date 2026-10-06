import { NextResponse } from 'next/server';

// Disabled for security remediation. This route previously minted temporary
// Pinata upload keys from a server-side JWT. It will be reintroduced in Phase 2
// with a hardened design. Until then it returns 404.
export async function GET() {
    return new NextResponse('Not Found', { status: 404 });
}
