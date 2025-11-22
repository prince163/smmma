import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const execAsync = promisify(exec);

export async function POST(req: Request) {
    try {
        const { database, admin, site } = await req.json();

        // 1. Create .env file
        const envContent = `# Database
DATABASE_URL="mysql://${database.username}:${database.password}@${database.host}:${database.port}/${database.database}"

# NextAuth
NEXTAUTH_SECRET="${generateSecret()}"
NEXTAUTH_URL="${site.siteUrl}"

# Environment
NODE_ENV="production"
`;

        const envPath = path.join(process.cwd(), '.env');
        await fs.writeFile(envPath, envContent);

        // 2. Run Prisma migrations
        try {
            await execAsync('npx prisma generate');
            await execAsync('npx prisma migrate deploy');
        } catch (error: any) {
            console.error('Prisma migration error:', error);
            return NextResponse.json({
                success: false,
                error: 'Failed to run database migrations: ' + error.message
            }, { status: 500 });
        }

        // 3. Create admin user and settings
        const prisma = new PrismaClient();

        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(admin.password, 10);

            // Create admin user
            await prisma.user.create({
                data: {
                    name: admin.name,
                    email: admin.email,
                    password: hashedPassword,
                    role: 'ADMIN',
                    status: 'active',
                    balance: 0
                }
            });

            // Create settings
            await prisma.setting.createMany({
                data: [
                    { key: 'siteName', value: site.siteName, category: 'general' },
                    { key: 'siteUrl', value: site.siteUrl, category: 'general' },
                    { key: 'signupBonus', value: site.signupBonus, category: 'promotions' },
                    {
                        key: 'tierDiscounts',
                        value: JSON.stringify([
                            { minQty: 100, discount: 5 },
                            { minQty: 500, discount: 10 },
                            { minQty: 1000, discount: 15 },
                            { minQty: 5000, discount: 20 }
                        ]),
                        category: 'pricing'
                    }
                ]
            });

            await prisma.$disconnect();

            // 4. Create installation lock file
            const lockPath = path.join(process.cwd(), '.installed');
            await fs.writeFile(lockPath, new Date().toISOString());

            return NextResponse.json({ success: true });
        } catch (error: any) {
            console.error('Database setup error:', error);
            await prisma.$disconnect();
            return NextResponse.json({
                success: false,
                error: 'Failed to create admin user: ' + error.message
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error('Installation error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Installation failed'
        }, { status: 500 });
    }
}

function generateSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let secret = '';
    for (let i = 0; i < 32; i++) {
        secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
}
