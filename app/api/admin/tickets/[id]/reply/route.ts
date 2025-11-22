import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Admin reply to ticket
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { message } = await request.json();

    if (!message || !message.trim()) {
        return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Create the reply message
    const ticketMessage = await prisma.ticketMessage.create({
        data: {
            ticketId: id,
            sender: 'ADMIN',
            message: message.trim(),
        },
    });

    // Update ticket status to PENDING if it was OPEN
    await prisma.ticket.update({
        where: { id },
        data: {
            status: 'PENDING',
            updatedAt: new Date(),
        },
    });

    return NextResponse.json(ticketMessage);
}
