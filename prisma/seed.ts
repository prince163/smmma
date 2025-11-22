import prisma from '../lib/prisma';
import { hashPassword } from '../lib/auth';

async function seed() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminPassword = await hashPassword('admin123');
    const admin = await prisma.user.upsert({
        where: { email: 'admin@smmpanel.com' },
        update: {},
        create: {
            email: 'admin@smmpanel.com',
            password: adminPassword,
            name: 'Admin User',
            role: 'ADMIN',
            balance: 0,
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // Create demo user
    const userPassword = await hashPassword('user123');
    const user = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            email: 'user@example.com',
            password: userPassword,
            name: 'Demo User',
            role: 'USER',
            balance: 100.00,
        },
    });
    console.log('✅ Demo user created:', user.email);

    // Create platforms
    const instagram = await prisma.platform.upsert({
        where: { slug: 'instagram' },
        update: {},
        create: {
            name: 'Instagram',
            slug: 'instagram',
            icon: '📷',
        },
    });

    const youtube = await prisma.platform.upsert({
        where: { slug: 'youtube' },
        update: {},
        create: {
            name: 'YouTube',
            slug: 'youtube',
            icon: '▶️',
        },
    });

    const tiktok = await prisma.platform.upsert({
        where: { slug: 'tiktok' },
        update: {},
        create: {
            name: 'TikTok',
            slug: 'tiktok',
            icon: '🎵',
        },
    });

    console.log('✅ Platforms created');

    // Create Instagram services
    const igFollowers = await prisma.service.create({
        data: {
            name: 'Followers',
            platformId: instagram.id,
        },
    });

    const igLikes = await prisma.service.create({
        data: {
            name: 'Likes',
            platformId: instagram.id,
        },
    });

    const igViews = await prisma.service.create({
        data: {
            name: 'Views',
            platformId: instagram.id,
        },
    });

    // Create YouTube services
    const ytSubscribers = await prisma.service.create({
        data: {
            name: 'Subscribers',
            platformId: youtube.id,
        },
    });

    const ytViews = await prisma.service.create({
        data: {
            name: 'Views',
            platformId: youtube.id,
        },
    });

    // Create TikTok services
    const ttFollowers = await prisma.service.create({
        data: {
            name: 'Followers',
            platformId: tiktok.id,
        },
    });

    const ttLikes = await prisma.service.create({
        data: {
            name: 'Likes',
            platformId: tiktok.id,
        },
    });

    console.log('✅ Services created');

    // Create Instagram packages with fixed quantities
    await prisma.package.createMany({
        data: [
            {
                name: '1000 Followers',
                description: 'Perfect for beginners',
                price: 5.00,
                quantity: 1000,
                serviceId: igFollowers.id,
            },
            {
                name: '5000 Followers',
                description: 'Boost your presence',
                price: 15.00,
                quantity: 5000,
                serviceId: igFollowers.id,
            },
            {
                name: '10000 Followers',
                description: 'Maximum growth',
                price: 25.00,
                quantity: 10000,
                serviceId: igFollowers.id,
            },
            {
                name: '1000 Likes',
                description: 'Instant engagement',
                price: 3.00,
                quantity: 1000,
                serviceId: igLikes.id,
            },
            {
                name: '10000 Views',
                description: 'Increase visibility',
                price: 2.00,
                quantity: 10000,
                serviceId: igViews.id,
            },
        ],
    });

    // Create YouTube packages
    await prisma.package.createMany({
        data: [
            {
                name: '1000 Subscribers',
                description: 'Grow your channel',
                price: 10.00,
                quantity: 1000,
                serviceId: ytSubscribers.id,
            },
            {
                name: '5000 Subscribers',
                description: 'Rapid channel growth',
                price: 40.00,
                quantity: 5000,
                serviceId: ytSubscribers.id,
            },
            {
                name: '10000 Views',
                description: 'High retention views',
                price: 5.00,
                quantity: 10000,
                serviceId: ytViews.id,
            },
        ],
    });

    // Create TikTok packages
    await prisma.package.createMany({
        data: [
            {
                name: '1000 Followers',
                description: 'Quick follower growth',
                price: 8.00,
                quantity: 1000,
                serviceId: ttFollowers.id,
            },
            {
                name: '5000 Likes',
                description: 'Boost your content',
                price: 4.00,
                quantity: 5000,
                serviceId: ttLikes.id,
            },
        ],
    });

    console.log('✅ Packages created');
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('Admin: admin@smmpanel.com / admin123');
    console.log('User: user@example.com / user123');
}

seed()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
