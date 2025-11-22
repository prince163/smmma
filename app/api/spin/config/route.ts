import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();

        // Get settings
        const settings = await prisma.spinSettings.findFirst();

        if (!settings || !settings.isEnabled) {
            return NextResponse.json({ error: 'Spin feature is disabled' }, { status: 403 });
        }

        // Get active configuration based on platform assignment
        let config;
        if (settings.platformAssignment === 'RANDOM') {
            // Get a random active configuration
            const configs = await prisma.spinConfiguration.findMany({
                where: { isActive: true },
                include: {
                    slots: {
                        where: { isActive: true },
                        orderBy: { position: 'asc' },
                    },
                },
            });
            config = configs[Math.floor(Math.random() * configs.length)];
        } else {
            // Get the first active configuration (fixed)
            config = await prisma.spinConfiguration.findFirst({
                where: { isActive: true },
                include: {
                    slots: {
                        where: { isActive: true },
                        orderBy: { position: 'asc' },
                    },
                },
            });
        }

        if (!config || config.slots.length === 0) {
            return NextResponse.json({ error: 'No active spin configuration found' }, { status: 404 });
        }

        // Format slots for frontend
        const formattedSlots = config.slots.map((slot: any) => ({
            id: slot.id,
            position: slot.position,
            label: slot.rewardLabel,
            icon: slot.icon,
            color: slot.color,
        }));

        return NextResponse.json({
            configId: config.id,
            platform: config.platform,
            popupTitle: settings.popupTitle,
            popupSubtitle: settings.popupSubtitle,
            rulesText: settings.rulesText,
            slots: formattedSlots,
        });
    } catch (error) {
        console.error('Error fetching spin config:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
