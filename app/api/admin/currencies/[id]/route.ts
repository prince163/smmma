import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Update currency
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { code, name, symbol, exchangeRate, isDefault, isActive } = await request.json();

    try {
        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.currency.updateMany({
                where: {
                    isDefault: true,
                    id: { not: id }
                },
                data: { isDefault: false }
            });
        }

        const currency = await prisma.currency.update({
            where: { id },
            data: {
                code: code?.toUpperCase(),
                name,
                symbol,
                exchangeRate: exchangeRate ? parseFloat(exchangeRate) : undefined,
                isDefault,
                isActive,
            },
        });

        return NextResponse.json(currency);
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to update currency'
        }, { status: 500 });
    }
}

// Delete currency
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
        // Don't allow deleting default currency
        const currency = await prisma.currency.findUnique({ where: { id } });
        if (currency?.isDefault) {
            return NextResponse.json({
                error: 'Cannot delete default currency'
            }, { status: 400 });
        }

        await prisma.currency.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to delete currency'
        }, { status: 500 });
    }
}
