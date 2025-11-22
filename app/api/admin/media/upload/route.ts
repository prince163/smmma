import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
                error: 'Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed'
            }, { status: 400 });
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({
                error: 'File too large. Maximum size is 5MB'
            }, { status: 400 });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;

        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), 'public', 'uploads');
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
        }

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filepath = join(uploadsDir, filename);
        await writeFile(filepath, buffer);

        // Save to database
        const media = await prisma.media.create({
            data: {
                filename,
                originalName: file.name,
                mimeType: file.type,
                size: file.size,
                url: `/uploads/${filename}`,
                uploadedBy: session.userId,
            },
        });

        return NextResponse.json({
            success: true,
            media,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({
            error: 'Failed to upload file'
        }, { status: 500 });
    }
}
