import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getSession } from '@/lib/auth';

// Add item to cart (for custom orders)
export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { packageId, packageName, serviceName, platformName, price, quantity, link } = await request.json();

        // Store in session/cookie or redirect with query params
        // For now, redirect to checkout with data
        return NextResponse.json({
            success: true,
            redirectUrl: `/checkout?packageId=${packageId}&quantity=${quantity}&link=${encodeURIComponent(link)}`
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
    }
}
