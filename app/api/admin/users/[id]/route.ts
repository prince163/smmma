import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// GET /api/admin/users/[id] - Get single user
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: params.id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            balance: true,
            createdAt: true,
            _count: {
                select: { orders: true }
            }
        }
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
        ...user,
        orderCount: user._count.orders
    });
}

// PUT /api/admin/users/[id] - Update user
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, role, status, password } = body;

    // Build update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (status !== undefined) updateData.status = status;
    if (password) {
        updateData.password = await bcrypt.hash(password, 10);
    }

    try {
        const user = await prisma.user.update({
            where: { id: params.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                balance: true,
                createdAt: true
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Prevent admin from deleting themselves
    if (session.id === params.id) {
        return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    try {
        await prisma.user.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
