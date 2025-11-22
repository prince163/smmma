import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req: Request) {
    try {
        const { host, port, database, username, password } = await req.json();

        // Test database connection
        const connection = await mysql.createConnection({
            host,
            port: parseInt(port),
            user: username,
            password,
            database
        });

        // Test query
        await connection.query('SELECT 1');
        await connection.end();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Database connection error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to connect to database'
        }, { status: 400 });
    }
}
