import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const packages = await prisma.package.findMany({
        include: { service: { include: { platform: true } } },
    });
    return NextResponse.json(packages);
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, price, quantity, serviceId } = await request.json();
    try {
        const pkg = await prisma.package.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                serviceId,
            },
        });
        return NextResponse.json(pkg);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
    }
}
