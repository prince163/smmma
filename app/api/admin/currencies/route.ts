import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Get all currencies
export async function GET() {
    const currencies = await prisma.currency.findMany({
        orderBy: [
            { isDefault: 'desc' },
            { code: 'asc' }
        ]
    });

    return NextResponse.json(currencies);
}

// Create new currency
export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { code, name, symbol, exchangeRate, isDefault, isActive } = await request.json();

        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.currency.updateMany({
                where: { isDefault: true },
                data: { isDefault: false }
            });
        }

        const currency = await prisma.currency.create({
            data: {
                code: code.toUpperCase(),
                name,
                symbol,
                exchangeRate: parseFloat(exchangeRate),
                isDefault: isDefault ?? false,
                isActive: isActive ?? true,
            },
        });

        return NextResponse.json(currency);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({
                error: 'Currency code already exists'
            }, { status: 400 });
        }
        return NextResponse.json({
            error: 'Failed to create currency'
        }, { status: 500 });
    }
}
