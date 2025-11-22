import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getSession } from '@/lib/auth';
import { testSmtpConnection } from '@/lib/email';

// Test SMTP connection
export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const result = await testSmtpConnection();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || 'Test failed'
        }, { status: 500 });
    }
}
