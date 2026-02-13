import { NextRequest, NextResponse } from 'next/server';

const GATEWAYS = [
    'https://gateway.pinata.cloud/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://ipfs.io/ipfs/',
    'https://nftstorage.link/ipfs/'
];

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const hash = searchParams.get('hash');

    if (!hash) {
        return NextResponse.json({ error: 'No hash provided' }, { status: 400 });
    }

    // Iterate through gateways until one succeeds
    for (const gateway of GATEWAYS) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout per gateway

            const response = await fetch(`${gateway}${hash}`, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                }
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const contentType = response.headers.get('content-type');
                const buffer = await response.arrayBuffer();

                return new NextResponse(buffer, {
                    headers: {
                        'Content-Type': contentType || 'application/octet-stream',
                        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
                    }
                });
            }
        } catch (error) {
            console.error(`Gateway ${gateway} failed for hash ${hash}:`, error);
        }
    }

    return NextResponse.json({ error: 'Failed to fetch from all gateways' }, { status: 502 });
}
