import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const platforms = await prisma.platform.findMany({
        include: { _count: { select: { services: true } } },
    });
    return NextResponse.json(platforms);
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, slug, icon } = await request.json();
    try {
        const platform = await prisma.platform.create({
            data: { name, slug, icon },
        });
        return NextResponse.json(platform);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create platform' }, { status: 500 });
    }
}
