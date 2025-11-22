import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true } }, package: { include: { service: { include: { platform: true } } } } },
    });
    return NextResponse.json(orders);
}
