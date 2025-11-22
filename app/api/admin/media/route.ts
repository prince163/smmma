import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { unlink } from 'fs/promises';
import { join } from 'path';

// Get all media files
export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const media = await prisma.media.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(media);
}

// Delete media file
export async function DELETE(request: Request) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await request.json();

        // Get media record
        const media = await prisma.media.findUnique({
            where: { id },
        });

        if (!media) {
            return NextResponse.json({ error: 'Media not found' }, { status: 404 });
        }

        // Delete file from filesystem
        const filepath = join(process.cwd(), 'public', 'uploads', media.filename);
        try {
            await unlink(filepath);
        } catch (error) {
            console.error('Error deleting file:', error);
            // Continue even if file deletion fails
        }

        // Delete from database
        await prisma.media.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({
            error: 'Failed to delete media'
        }, { status: 500 });
    }
}
