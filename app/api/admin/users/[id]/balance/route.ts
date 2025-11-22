import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// POST /api/admin/users/[id]/balance - Adjust user balance
export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amount, type, note } = body; // type: 'add' or 'subtract'

    if (!amount || amount <= 0) {
        return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    try {
        // Get current user
        const user = await prisma.user.findUnique({
            where: { id: params.id },
            select: { balance: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Calculate new balance
        const currentBalance = parseFloat(user.balance.toString());
        const adjustAmount = parseFloat(amount);
        const newBalance = type === 'subtract'
            ? currentBalance - adjustAmount
            : currentBalance + adjustAmount;

        if (newBalance < 0) {
            return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
        }

        // Update balance
        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: { balance: newBalance },
            select: {
                id: true,
                name: true,
                email: true,
                balance: true
            }
        });

        // TODO: Log transaction in transaction history table when implemented
        console.log(`Balance adjusted for user ${params.id}: ${type} ${amount}. Note: ${note || 'N/A'}`);

        return NextResponse.json({
            success: true,
            user: updatedUser,
            previousBalance: currentBalance,
            newBalance
        });
    } catch (error) {
        console.error('Error adjusting balance:', error);
        return NextResponse.json({ error: 'Failed to adjust balance' }, { status: 500 });
    }
}
