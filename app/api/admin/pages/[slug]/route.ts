import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Get single page
export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const page = await prisma.page.findUnique({
        where: { slug },
    });

    if (!page) {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(page);
}

// Update page
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const { title, content, published } = await request.json();

    try {
        const page = await prisma.page.update({
            where: { slug },
            data: {
                title,
                content,
                published,
            },
        });

        return NextResponse.json(page);
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to update page'
        }, { status: 500 });
    }
}

// Delete page
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;

    try {
        await prisma.page.delete({
            where: { slug },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to delete page'
        }, { status: 500 });
    }
}
