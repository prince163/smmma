import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Get all discount tiers
export async function GET() {
    const tiers = await prisma.discountTier.findMany({
        orderBy: { minQuantity: 'asc' }
    });

    return NextResponse.json(tiers);
}

// Create new discount tier
export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, minQuantity, discountPercent, isActive } = await request.json();

        const tier = await prisma.discountTier.create({
            data: {
                name,
                minQuantity: parseInt(minQuantity),
                discountPercent: parseFloat(discountPercent),
                isActive: isActive ?? true,
            },
        });

        return NextResponse.json(tier);
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to create discount tier'
        }, { status: 500 });
    }
}
