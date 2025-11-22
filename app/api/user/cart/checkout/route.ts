import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cart, paymentMethod } = await request.json();

    if (!cart || cart.length === 0) {
        return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate total price
    const totalPrice = cart.reduce((sum: number, item: any) => sum + item.price, 0);

    // Get user
    const user = await prisma.user.findUnique({ where: { id: session.id as string } });
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (paymentMethod === 'wallet') {
        // Check balance
        if (user.balance < totalPrice) {
            return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
        }

        try {
            // Transaction: Deduct balance and create all orders
            const result = await prisma.$transaction(async (tx) => {
                // Deduct balance
                await tx.user.update({
                    where: { id: user.id },
                    data: { balance: { decrement: totalPrice } },
                });

                // Create orders for each cart item
                const orders = [];
                for (const item of cart) {
                    const order = await tx.order.create({
                        data: {
                            orderNumber: `ORD${Math.floor(1000000 + Math.random() * 9000000)}`,
                            userId: user.id,
                            packageId: item.packageId,
                            link: item.link,
                            quantity: item.quantity,
                            price: item.price,
                            status: 'PENDING',
                        },
                    });
                    orders.push(order);
                }

                return orders;
            });

            return NextResponse.json({
                success: true,
                orderCount: result.length,
                orders: result
            });
        } catch (error) {
            console.error('Checkout error:', error);
            return NextResponse.json({ error: 'Failed to process checkout' }, { status: 500 });
        }
    } else {
        // Handle other payment methods (Yoco, Zapper, PayGenius)
        // TODO: Implement payment gateway integration
        return NextResponse.json({ error: 'Payment method not yet implemented' }, { status: 501 });
    }
}
