import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const services = await prisma.service.findMany({
        include: { platform: true, _count: { select: { packages: true } } },
    });
    return NextResponse.json(services);
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, platformId } = await request.json();
    try {
        const service = await prisma.service.create({
            data: { name, platformId },
        });
        return NextResponse.json(service);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }
}
