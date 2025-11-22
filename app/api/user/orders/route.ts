import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
        where: { userId: session.id as string },
        orderBy: { createdAt: 'desc' },
        include: { package: { include: { service: { include: { platform: true } } } } },
    });
    return NextResponse.json(orders);
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { packageId, link, quantity } = await request.json();

    // Fetch package to calculate price
    const pkg = await prisma.package.findUnique({ where: { id: packageId } });
    if (!pkg) {
        return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    if (quantity < pkg.minQuantity || quantity > pkg.maxQuantity) {
        return NextResponse.json({ error: `Quantity must be between ${pkg.minQuantity} and ${pkg.maxQuantity}` }, { status: 400 });
    }

    const price = (pkg.price / 1000) * quantity; // Assuming rate is per 1000

    // Check balance
    const user = await prisma.user.findUnique({ where: { id: session.id as string } });
    if (!user || user.balance < price) {
        return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    try {
        // Transaction: Deduct balance and create order
        const order = await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: user.id },
                data: { balance: { decrement: price } },
            });

            return await tx.order.create({
                data: {
                    orderNumber: `ORD${Math.floor(1000000 + Math.random() * 9000000)}`,
                    userId: user.id,
                    packageId,
                    link,
                    quantity,
                    price,
                    status: 'PENDING',
                },
            });
        });

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
    }
}
