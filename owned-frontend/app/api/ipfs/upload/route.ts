import { NextResponse } from 'next/server';

// Disabled for security remediation. This route previously proxied uploads to
// Pinata using a server-side JWT. It will be reintroduced in Phase 2 with a
// hardened design. Until then it returns 404.
export async function POST() {
    return new NextResponse('Not Found', { status: 404 });
}
