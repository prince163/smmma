const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@smmpanel.com' },
        update: {},
        create: {
            email: 'admin@smmpanel.com',
            password: hashedPassword,
            name: 'Admin User',
            role: 'ADMIN',
            balance: 10000.0,
        },
    });
    console.log('✅ Created admin:', admin.email);

    // Create test user
    const testPassword = await bcrypt.hash('test123', 10);
    const testUser = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            email: 'test@example.com',
            password: testPassword,
            name: 'Test User',
            role: 'USER',
            balance: 500.0,
        },
    });
    console.log('✅ Created test user:', testUser.email);

    // Create platforms
    const youtube = await prisma.platform.upsert({
        where: { slug: 'youtube' },
        update: {},
        create: { name: 'YouTube', slug: 'youtube', icon: '▶️' },
    });

    const instagram = await prisma.platform.upsert({
        where: { slug: 'instagram' },
        update: {},
        create: { name: 'Instagram', slug: 'instagram', icon: '📷' },
    });

    const facebook = await prisma.platform.upsert({
        where: { slug: 'facebook' },
        update: {},
        create: { name: 'Facebook', slug: 'facebook', icon: '👍' },
    });

    const twitter = await prisma.platform.upsert({
        where: { slug: 'twitter' },
        update: {},
        create: { name: 'X (Twitter)', slug: 'twitter', icon: '𝕏' },
    });

    const tiktok = await prisma.platform.upsert({
        where: { slug: 'tiktok' },
        update: {},
        create: { name: 'TikTok', slug: 'tiktok', icon: '🎵' },
    });

    console.log('✅ Created platforms');

    // YouTube Services
    const ytSubscribers = await prisma.service.create({
        data: { name: 'Subscribers', platformId: youtube.id },
    });
    const ytViews = await prisma.service.create({
        data: { name: 'Views', platformId: youtube.id },
    });
    const ytLikes = await prisma.service.create({
        data: { name: 'Likes', platformId: youtube.id },
    });
    const ytWatchTime = await prisma.service.create({
        data: { name: 'Watch Time', platformId: youtube.id },
    });

    // Instagram Services
    const igFollowers = await prisma.service.create({
        data: { name: 'Followers', platformId: instagram.id },
    });
    const igLikes = await prisma.service.create({
        data: { name: 'Likes', platformId: instagram.id },
    });
    const igViews = await prisma.service.create({
        data: { name: 'Views', platformId: instagram.id },
    });

    // Facebook Services
    const fbLikes = await prisma.service.create({
        data: { name: 'Page Likes', platformId: facebook.id },
    });
    const fbFollowers = await prisma.service.create({
        data: { name: 'Followers', platformId: facebook.id },
    });
    const fbViews = await prisma.service.create({
        data: { name: 'Video Views', platformId: facebook.id },
    });

    // Twitter Services
    const twFollowers = await prisma.service.create({
        data: { name: 'Followers', platformId: twitter.id },
    });
    const twLikes = await prisma.service.create({
        data: { name: 'Likes', platformId: twitter.id },
    });
    const twRetweets = await prisma.service.create({
        data: { name: 'Retweets', platformId: twitter.id },
    });

    // TikTok Services
    const ttFollowers = await prisma.service.create({
        data: { name: 'Followers', platformId: tiktok.id },
    });
    const ttLikes = await prisma.service.create({
        data: { name: 'Likes', platformId: tiktok.id },
    });
    const ttViews = await prisma.service.create({
        data: { name: 'Views', platformId: tiktok.id },
    });

    console.log('✅ Created services');

    // YouTube Packages
    await prisma.package.createMany({
        data: [
            { name: 'Starter', description: 'Perfect for new channels', price: 9.99, minQuantity: 100, maxQuantity: 1000, serviceId: ytSubscribers.id },
            { name: 'Growth', description: 'Boost your channel', price: 24.99, minQuantity: 500, maxQuantity: 5000, serviceId: ytSubscribers.id },
            { name: 'Pro', description: 'Professional growth', price: 49.99, minQuantity: 1000, maxQuantity: 10000, serviceId: ytSubscribers.id },
            { name: 'Basic Views', description: 'Standard video views', price: 4.99, minQuantity: 1000, maxQuantity: 50000, serviceId: ytViews.id },
            { name: 'Premium Views', description: 'High retention views', price: 14.99, minQuantity: 5000, maxQuantity: 100000, serviceId: ytViews.id },
            { name: 'Likes Package', description: 'Boost engagement', price: 7.99, minQuantity: 100, maxQuantity: 10000, serviceId: ytLikes.id },
            { name: 'Watch Time Hours', description: 'Monetization ready', price: 99.99, minQuantity: 100, maxQuantity: 4000, serviceId: ytWatchTime.id },
        ],
    });

    // Instagram Packages
    await prisma.package.createMany({
        data: [
            { name: 'Starter', description: 'Grow your profile', price: 8.99, minQuantity: 100, maxQuantity: 2000, serviceId: igFollowers.id },
            { name: 'Premium', description: 'High quality followers', price: 19.99, minQuantity: 500, maxQuantity: 10000, serviceId: igFollowers.id },
            { name: 'Post Likes', description: 'Instant engagement', price: 5.99, minQuantity: 100, maxQuantity: 10000, serviceId: igLikes.id },
            { name: 'Story Views', description: 'Boost visibility', price: 3.99, minQuantity: 500, maxQuantity: 50000, serviceId: igViews.id },
        ],
    });

    // Facebook Packages
    await prisma.package.createMany({
        data: [
            { name: 'Page Growth', description: 'Increase page likes', price: 12.99, minQuantity: 100, maxQuantity: 5000, serviceId: fbLikes.id },
            { name: 'Followers Boost', description: 'Real followers', price: 15.99, minQuantity: 100, maxQuantity: 10000, serviceId: fbFollowers.id },
            { name: 'Video Views', description: 'Viral potential', price: 6.99, minQuantity: 1000, maxQuantity: 100000, serviceId: fbViews.id },
        ],
    });

    // Twitter Packages
    await prisma.package.createMany({
        data: [
            { name: 'Follower Pack', description: 'Grow your audience', price: 11.99, minQuantity: 100, maxQuantity: 5000, serviceId: twFollowers.id },
            { name: 'Engagement Boost', description: 'More likes', price: 7.99, minQuantity: 100, maxQuantity: 10000, serviceId: twLikes.id },
            { name: 'Retweet Package', description: 'Amplify reach', price: 9.99, minQuantity: 50, maxQuantity: 5000, serviceId: twRetweets.id },
        ],
    });

    // TikTok Packages
    await prisma.package.createMany({
        data: [
            { name: 'Starter Pack', description: 'Begin your journey', price: 8.99, minQuantity: 100, maxQuantity: 2000, serviceId: ttFollowers.id },
            { name: 'Viral Boost', description: 'Trending potential', price: 4.99, minQuantity: 1000, maxQuantity: 100000, serviceId: ttViews.id },
            { name: 'Likes Bundle', description: 'Instant popularity', price: 6.99, minQuantity: 100, maxQuantity: 50000, serviceId: ttLikes.id },
        ],
    });

    console.log('✅ Created packages');
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   👤 Admin: admin@smmpanel.com / admin123');
    console.log('   👤 User:  test@example.com / test123');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
