import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Update discount tier
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { name, minQuantity, discountPercent, isActive } = await request.json();

    try {
        const tier = await prisma.discountTier.update({
            where: { id },
            data: {
                name,
                minQuantity: minQuantity ? parseInt(minQuantity) : undefined,
                discountPercent: discountPercent ? parseFloat(discountPercent) : undefined,
                isActive,
            },
        });

        return NextResponse.json(tier);
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to update discount tier'
        }, { status: 500 });
    }
}

// Delete discount tier
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        await prisma.discountTier.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to delete discount tier'
        }, { status: 500 });
    }
}
