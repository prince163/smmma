import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(request: Request) {
    const { cart, paymentMethod, user: guestUser } = await request.json();

    if (!cart || cart.length === 0) {
        return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!guestUser || !guestUser.email || !guestUser.password) {
        return NextResponse.json({ error: 'User information required' }, { status: 400 });
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: guestUser.email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Email already registered. Please login.' }, { status: 400 });
        }

        // Calculate total price
        const totalPrice = cart.reduce((sum: number, item: any) => sum + item.price, 0);

        // Create user and orders in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create new user
            const hashedPassword = await hashPassword(guestUser.password);
            const newUser = await tx.user.create({
                data: {
                    email: guestUser.email,
                    password: hashedPassword,
                    name: `${guestUser.firstName} ${guestUser.lastName}`,
                    role: 'USER',
                    balance: 0,
                },
            });

            // Create orders for each cart item
            const orders = [];
            for (const item of cart) {
                const order = await tx.order.create({
                    data: {
                        orderNumber: `ORD${Math.floor(1000000 + Math.random() * 9000000)}`,
                        userId: newUser.id,
                        packageId: item.packageId,
                        link: item.link,
                        quantity: item.quantity,
                        price: item.price,
                        status: 'PENDING',
                    },
                });
                orders.push(order);
            }

            return { user: newUser, orders };
        });

        // Generate JWT token for auto-login
        const token = await signToken({ id: result.user.id, email: result.user.email, role: result.user.role });

        return NextResponse.json({
            success: true,
            orderCount: result.orders.length,
            orders: result.orders,
            token,
            message: 'Account created successfully! Please complete payment.',
        });
    } catch (error) {
        console.error('Guest checkout error:', error);
        return NextResponse.json({ error: 'Failed to process checkout' }, { status: 500 });
    }
}
