import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Get all pages
export async function GET() {
    const pages = await prisma.page.findMany({
        orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(pages);
}

// Create new page
export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { title, slug, content, published } = await request.json();

        if (!title || !slug) {
            return NextResponse.json({
                error: 'Title and slug are required'
            }, { status: 400 });
        }

        const page = await prisma.page.create({
            data: {
                title,
                slug,
                content: content || '',
                published: published ?? true,
            },
        });

        return NextResponse.json(page);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({
                error: 'A page with this slug already exists'
            }, { status: 400 });
        }
        return NextResponse.json({
            error: 'Failed to create page'
        }, { status: 500 });
    }
}
