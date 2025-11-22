import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session?.id) {
            return NextResponse.json({ canSpin: false, error: 'Not authenticated' }, { status: 401 });
        }

        // Get spin settings
        const settings = await prisma.spinSettings.findFirst();

        if (!settings || !settings.isEnabled) {
            return NextResponse.json({ canSpin: false, error: 'Spin feature is disabled' }, { status: 403 });
        }

        // Get user's last spin
        const lastSpin = await prisma.userSpin.findFirst({
            where: { userId: session.id as string },
            orderBy: { spunAt: 'desc' },
        });

        if (!lastSpin) {
            return NextResponse.json({
                canSpin: true,
                nextSpinAt: null,
                hoursRemaining: 0,
                minutesRemaining: 0,
                lastSpin: null,
            });
        }

        // Calculate next available spin time
        const nextSpinAt = new Date(lastSpin.spunAt.getTime() + settings.spinFrequencyHrs * 60 * 60 * 1000);
        const now = new Date();
        const canSpin = now >= nextSpinAt;

        const timeRemaining = nextSpinAt.getTime() - now.getTime();
        const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

        return NextResponse.json({
            canSpin,
            nextSpinAt: nextSpinAt.toISOString(),
            hoursRemaining: canSpin ? 0 : hoursRemaining,
            minutesRemaining: canSpin ? 0 : minutesRemaining,
            lastSpin: {
                spunAt: lastSpin.spunAt,
                rewardLabel: lastSpin.rewardLabel,
                status: lastSpin.status,
            },
        });
    } catch (error) {
        console.error('Error checking spin status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
