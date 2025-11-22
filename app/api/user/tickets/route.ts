import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Get all tickets for current user
export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tickets = await prisma.ticket.findMany({
        where: { userId: session.id as string },
        orderBy: { createdAt: 'desc' },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    return NextResponse.json(tickets);
}

// Create new ticket
export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subject, message } = await request.json();

    if (!subject || !message) {
        return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    try {
        const ticket = await prisma.ticket.create({
            data: {
                userId: session.id as string,
                subject,
                status: 'OPEN',
                messages: {
                    create: {
                        sender: 'USER',
                        message,
                    },
                },
            },
            include: { messages: true },
        });

        return NextResponse.json(ticket);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
    }
}
