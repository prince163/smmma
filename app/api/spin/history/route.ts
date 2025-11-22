import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session?.id) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        // Get user's spin history
        const [spins, total] = await Promise.all([
            prisma.userSpin.findMany({
                where: { userId: session.id as string },
                orderBy: { spunAt: 'desc' },
                skip,
                take: limit,
                include: {
                    order: {
                        select: {
                            id: true,
                            status: true,
                        },
                    },
                },
            }),
            prisma.userSpin.count({
                where: { userId: session.id as string },
            }),
        ]);

        const formattedSpins = spins.map((spin) => ({
            id: spin.id,
            spunAt: spin.spunAt,
            platform: spin.platform,
            rewardLabel: spin.rewardLabel,
            rewardType: spin.rewardType,
            rewardValue: spin.rewardValue,
            status: spin.status,
            discountCode: spin.discountCode,
            expiresAt: spin.expiresAt,
            claimedAt: spin.claimedAt,
            order: spin.order,
            canClaim: spin.status === 'WON_PENDING' && spin.expiresAt && new Date() < spin.expiresAt,
        }));

        return NextResponse.json({
            spins: formattedSpins,
            total,
            page,
            pages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error fetching spin history:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
