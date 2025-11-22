import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';

export async function GET() {
    const platforms = await prisma.platform.findMany({
        include: {
            services: {
                include: {
                    packages: true,
                },
            },
        },
    });
    return NextResponse.json(platforms);
}
