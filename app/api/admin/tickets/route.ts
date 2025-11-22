import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tickets = await prisma.ticket.findMany({
        include: {
            user: { select: { email: true } },
            messages: true
        },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(tickets);
}
