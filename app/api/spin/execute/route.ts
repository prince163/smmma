import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Probability algorithm to select winning slot
function selectWinningSlot(slots: any[]): any {
    const activeSlots = slots.filter((s) => s.isActive);
    const totalWeight = activeSlots.reduce((sum, s) => sum + s.probability, 0);

    let random = Math.random() * totalWeight;

    for (const slot of activeSlots) {
        random -= slot.probability;
        if (random <= 0) {
            return slot;
        }
    }

    return activeSlots[activeSlots.length - 1];
}

// Generate discount code
function generateDiscountCode(): string {
    return `SPIN${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session?.id) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { configId } = await req.json();

        // Get settings
        const settings = await prisma.spinSettings.findFirst();

        if (!settings || !settings.isEnabled) {
            return NextResponse.json({ error: 'Spin feature is disabled' }, { status: 403 });
        }

        // Check if user can spin
        const lastSpin = await prisma.userSpin.findFirst({
            where: { userId: session.id as string },
            orderBy: { spunAt: 'desc' },
        });

        if (lastSpin) {
            const nextSpinAt = new Date(lastSpin.spunAt.getTime() + settings.spinFrequencyHrs * 60 * 60 * 1000);
            const now = new Date();

            if (now < nextSpinAt) {
                return NextResponse.json({ error: 'You must wait before spinning again' }, { status: 429 });
            }
        }

        // Get configuration with slots
        const config = await prisma.spinConfiguration.findUnique({
            where: { id: configId, isActive: true },
            include: {
                slots: {
                    where: { isActive: true },
                },
            },
        });

        if (!config || config.slots.length === 0) {
            return NextResponse.json({ error: 'Invalid configuration' }, { status: 404 });
        }

        // Select winning slot using probability algorithm
        const winningSlot = selectWinningSlot(config.slots);

        // Determine platform
        const platforms = ['FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'YOUTUBE', 'TWITTER'];
        const assignedPlatform = config.platform || platforms[Math.floor(Math.random() * platforms.length)];

        // Calculate expiration for claimable rewards
        const expiresAt = winningSlot.rewardType !== 'NONE'
            ? new Date(Date.now() + settings.claimWindowHrs * 60 * 60 * 1000)
            : null;

        // Generate discount code if applicable
        const discountCode = winningSlot.rewardType === 'DISCOUNT' ? generateDiscountCode() : null;

        // Determine status
        let status = 'TRY_AGAIN';
        if (winningSlot.rewardType === 'SERVICE') {
            status = 'WON_PENDING';
        } else if (winningSlot.rewardType === 'DISCOUNT') {
            status = 'WON_PENDING';
        }

        // Record the spin
        const userSpin = await prisma.userSpin.create({
            data: {
                userId: session.id as string,
                configId: config.id,
                slotId: winningSlot.id,
                platform: assignedPlatform,
                rewardType: winningSlot.rewardType,
                rewardLabel: winningSlot.rewardLabel,
                rewardValue: winningSlot.rewardValue,
                status,
                discountCode,
                expiresAt,
            },
        });

        // Calculate next spin time
        const nextSpinAt = new Date(Date.now() + settings.spinFrequencyHrs * 60 * 60 * 1000);

        return NextResponse.json({
            success: true,
            spinId: userSpin.id,
            result: {
                slotId: winningSlot.id,
                position: winningSlot.position,
                rewardType: winningSlot.rewardType,
                rewardLabel: winningSlot.rewardLabel,
                rewardValue: winningSlot.rewardValue,
                platform: assignedPlatform,
                requiresClaim: winningSlot.rewardType !== 'NONE',
                discountCode: discountCode,
                expiresAt: expiresAt?.toISOString(),
            },
            nextSpinAt: nextSpinAt.toISOString(),
        });
    } catch (error) {
        console.error('Error executing spin:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
