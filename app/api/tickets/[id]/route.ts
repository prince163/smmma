import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await request.json();
    const sender = session.role === 'ADMIN' ? 'ADMIN' : 'USER';

    // Verify ownership if user
    if (session.role !== 'ADMIN') {
        const ticket = await prisma.ticket.findUnique({ where: { id } });
        if (!ticket || ticket.userId !== session.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    const ticketMessage = await prisma.ticketMessage.create({
        data: {
            ticketId: id,
            sender,
            message,
        },
    });

    // Update ticket updated_at
    await prisma.ticket.update({
        where: { id },
        data: { updatedAt: new Date() },
    });

    return NextResponse.json(ticketMessage);
}
