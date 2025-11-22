import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';

// GET /api/settings/public - Get public settings (no auth required)
export async function GET() {
    try {
        const settings = await prisma.setting.findMany({
            where: {
                key: {
                    in: ['signupBonus', 'tierDiscounts', 'siteName', 'siteDescription']
                }
            }
        });

        // Convert to key-value object
        const settingsObj: any = {};
        settings.forEach(setting => {
            // Parse JSON values
            if (setting.key === 'tierDiscounts') {
                try {
                    settingsObj[setting.key] = JSON.parse(setting.value);
                } catch {
                    settingsObj[setting.key] = [];
                }
            } else {
                settingsObj[setting.key] = setting.value;
            }
        });

        // Set defaults if not found
        if (!settingsObj.signupBonus) settingsObj.signupBonus = '0';
        if (!settingsObj.tierDiscounts) settingsObj.tierDiscounts = [];

        return NextResponse.json(settingsObj);
    } catch (error) {
        console.error('Error fetching public settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}
