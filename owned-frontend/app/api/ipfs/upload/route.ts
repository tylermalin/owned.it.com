import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const jwt = process.env.PINATA_JWT || process.env.NEXT_PUBLIC_PINATA_JWT;
        if (!jwt || jwt === 'your_pinata_jwt_here') {
            return NextResponse.json({
                error: 'Pinata JWT not configured. Please get a free JWT from https://pinata.cloud and add it to your .env.local as NEXT_PUBLIC_PINATA_JWT'
            }, { status: 500 });
        }

        const pinataFormData = new FormData();
        pinataFormData.append('file', file);

        // Optional: Add metadata to Pinata
        const metadata = JSON.stringify({
            name: (file as File).name || 'upload',
        });
        pinataFormData.append('pinataMetadata', metadata);

        // Optional: Pinata Options
        const options = JSON.stringify({
            cidVersion: 1,
        });
        pinataFormData.append('pinataOptions', options);

        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
            },
            body: pinataFormData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Pinata API Error:', errorText);
            return NextResponse.json({
                error: `Pinata Upload Failed: ${response.statusText}`,
                details: errorText
            }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({
            Hash: data.IpfsHash,
            PinSize: data.PinSize,
            Timestamp: data.Timestamp
        });
    } catch (error: any) {
        console.error('IPFS Proxy Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
