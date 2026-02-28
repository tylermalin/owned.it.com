import { NextRequest, NextResponse } from 'next/server';

const GATEWAYS = [
    'https://gateway.pinata.cloud/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://ipfs.io/ipfs/',
    'https://nftstorage.link/ipfs/'
];

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    let hash = searchParams.get('hash');

    if (!hash) {
        return NextResponse.json({ error: 'No hash provided' }, { status: 400 });
    }

    // Clean leading colon if present
    hash = hash.startsWith(':') ? hash.substring(1) : hash;

    // Basic CID validation: check for common prefixes and a minimum length
    // CIDv0 starts with 'Qm' and is 46 chars. CIDv1 starts with 'b' (base32/base36/base58)
    // A very basic check for common IPFS CID formats.
    if (hash.length < 40 || (!hash.startsWith('Qm') && !hash.startsWith('b'))) {
        return NextResponse.json({ error: 'Invalid hash format' }, { status: 400 });
    }

    let lastStatus = 502;
    let any404 = false;

    // Iterate through gateways until one succeeds
    for (const gateway of GATEWAYS) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout per gateway

            const response = await fetch(`${gateway}${hash}`, {
                signal: controller.signal,
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
            } else {
                if (response.status === 404) any404 = true;
                lastStatus = response.status;
            }
        } catch (error) {
            console.error(`Gateway ${gateway} failed for hash ${hash}:`, error);
        }
    }

    // If any gateway returned 404, return 404. Otherwise return the last status seen or 502.
    const finalStatus = any404 ? 404 : lastStatus;
    return NextResponse.json({
        error: finalStatus === 404 ? 'Content not found' : 'Failed to fetch from all gateways',
        status: finalStatus
    }, { status: finalStatus });
}
