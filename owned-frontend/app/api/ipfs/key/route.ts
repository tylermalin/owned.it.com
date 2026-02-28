import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const jwt = process.env.PINATA_JWT || process.env.NEXT_PUBLIC_PINATA_JWT;

    if (!jwt || jwt === 'your_pinata_jwt_here') {
        return NextResponse.json({
            error: 'Pinata JWT not configured. Please get a free JWT from https://pinata.cloud and add it to your .env.local as PINATA_JWT'
        }, { status: 500 });
    }

    try {
        const response = await fetch('https://api.pinata.cloud/users/generateApiKey', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                keyName: `Temp-Upload-Key-${Date.now()}`,
                permissions: {
                    endpoints: {
                        data: {
                            pinList: false,
                            userPinnedDataTotal: false
                        },
                        pinning: {
                            pinFileToIPFS: true,
                            pinJSONToIPFS: true,
                            pinJobs: false,
                            unpin: false,
                            userPinPolicy: false
                        }
                    }
                },
                maxUses: 2 // Allow a retry if the first upload fails
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to generate Pinata key:', errorText);
            throw new Error(`Pinata key generation failed: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json({ JWT: data.JWT });
    } catch (error: any) {
        console.error('IPFS Key Generation Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
