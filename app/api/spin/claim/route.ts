import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session?.id) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { spinId, url, username } = await req.json();

        // Get the spin record
        const spin = await prisma.userSpin.findUnique({
            where: { id: spinId },
            include: {
                user: true,
            },
        });

        if (!spin) {
            return NextResponse.json({ error: 'Spin not found' }, { status: 404 });
        }

        // Verify ownership
        if (spin.userId !== session.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Check if already claimed
        if (spin.status === 'WON_CLAIMED') {
            return NextResponse.json({ error: 'Reward already claimed' }, { status: 400 });
        }

        // Check if expired
        if (spin.expiresAt && new Date() > spin.expiresAt) {
            await prisma.userSpin.update({
                where: { id: spinId },
                data: { status: 'EXPIRED' },
            });
            return NextResponse.json({ error: 'Reward has expired' }, { status: 400 });
        }

        // Only service rewards need claiming
        if (spin.rewardType !== 'SERVICE') {
            return NextResponse.json({ error: 'This reward does not require claiming' }, { status: 400 });
        }

        // Get the slot to find service info
        const slot = await prisma.spinSlot.findUnique({
            where: { id: spin.slotId },
            include: {
                service: {
                    include: {
                        packages: true,
                    },
                },
            },
        });

        if (!slot || !slot.service) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        // Find a suitable package (preferably one that matches the reward value)
        const suitablePackage = slot.service.packages.find(
            (pkg) => pkg.quantity === spin.rewardValue
        ) || slot.service.packages[0];

        if (!suitablePackage) {
            return NextResponse.json({ error: 'No package available for this service' }, { status: 404 });
        }

        // Generate order number
        const orderCount = await prisma.order.count();
        const orderNumber = `ORD-${Date.now()}-${orderCount + 1}`;

        // Create order with price = 0 (free reward)
        const order = await prisma.order.create({
            data: {
                userId: session.id as string,
                packageId: suitablePackage.id,
                link: url,
                quantity: spin.rewardValue || suitablePackage.quantity || 1000,
                price: 0, // Free from spin reward
                status: 'PENDING',
            },
        });

        // Update spin record
        await prisma.userSpin.update({
            where: { id: spinId },
            data: {
                status: 'WON_CLAIMED',
                orderId: order.id,
                claimData: JSON.stringify({ url, username }),
                claimedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            orderId: order.id,
            message: 'Reward claimed successfully! Your order has been created.',
        });
    } catch (error) {
        console.error('Error claiming reward:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
