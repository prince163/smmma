import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        // Fetch signup bonus from settings
        const signupBonusSetting = await prisma.setting.findUnique({
            where: { key: 'signupBonus' }
        });
        const signupBonus = signupBonusSetting ? parseFloat(signupBonusSetting.value) : 0;

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'USER', // Default role
                balance: signupBonus, // Credit signup bonus
            },
        });

        const token = await signToken({ id: user.id, email: user.email, role: user.role });
        const cookieStore = await cookies();
        cookieStore.set('token', token, { httpOnly: true, path: '/' });

        return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
