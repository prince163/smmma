import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSpinFeature() {
    console.log('🎰 Seeding Spin & Win feature...');

    // Create default spin settings
    const settings = await prisma.spinSettings.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            isEnabled: true,
            spinFrequencyHrs: 24,
            requireLogin: true,
            claimWindowHrs: 24,
            rulesText: `
• 1 spin per user every 24 hours
• Rewards are non-transferable and locked to your account
• Service rewards must be claimed within 24 hours
• Discount rewards are valid only on the next order within 24 hours
• Platforms and rewards may change daily
• Abuse or multi-account usage may result in reward cancellation
      `.trim(),
            platformMode: 'RANDOM',
            showOnHomepage: true,
            showOnDashboard: true,
            enableSounds: true,
            enableConfetti: true,
            floatingIconText: 'Daily Spin',
            popupTitle: 'Daily Spin & Win',
            popupSubtitle: 'Spin the wheel for amazing rewards!',
        },
    });

    console.log('✅ Spin settings created');

    // Create default spin configuration
    const defaultConfig = await prisma.spinConfiguration.upsert({
        where: { id: 'default-config' },
        update: {},
        create: {
            id: 'default-config',
            name: 'Default Wheel',
            description: 'Standard spin wheel with mixed rewards',
            platform: null, // Random platform
            isActive: true,
        },
    });

    console.log('✅ Default configuration created');

    // Create 6 default slots
    const slots = [
        {
            position: 1,
            rewardType: 'NONE',
            rewardLabel: 'Try Again',
            probability: 3,
            color: '#6366f1',
            icon: '🎯',
        },
        {
            position: 2,
            rewardType: 'SERVICE',
            rewardLabel: '1000 Views',
            rewardValue: 1000,
            probability: 1,
            color: '#ec4899',
            icon: '👁️',
        },
        {
            position: 3,
            rewardType: 'NONE',
            rewardLabel: 'Try Again',
            probability: 3,
            color: '#8b5cf6',
            icon: '🎯',
        },
        {
            position: 4,
            rewardType: 'DISCOUNT',
            rewardLabel: '10% Off Views',
            rewardValue: 10,
            discountType: 'PERCENTAGE',
            probability: 2,
            color: '#10b981',
            icon: '💰',
        },
        {
            position: 5,
            rewardType: 'SERVICE',
            rewardLabel: '1000 Followers',
            rewardValue: 1000,
            probability: 1,
            color: '#f59e0b',
            icon: '👥',
        },
        {
            position: 6,
            rewardType: 'SERVICE',
            rewardLabel: '200 Likes',
            rewardValue: 200,
            probability: 2,
            color: '#ef4444',
            icon: '❤️',
        },
    ];

    for (const slot of slots) {
        await prisma.spinSlot.upsert({
            where: { id: `default-slot-${slot.position}` },
            update: {},
            create: {
                id: `default-slot-${slot.position}`,
                configId: defaultConfig.id,
                ...slot,
                isActive: true,
            },
        });
    }

    console.log('✅ 6 default slots created');
    console.log('🎉 Spin & Win feature seeded successfully!');
}

seedSpinFeature()
    .catch((e) => {
        console.error('❌ Error seeding spin feature:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
