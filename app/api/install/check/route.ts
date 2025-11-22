import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export async function GET() {
    try {
        const requirements = {
            node: false,
            nodeVersion: '',
            writable: false,
            prisma: false
        };

        // Check Node.js version
        try {
            const nodeVersion = process.version;
            const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
            requirements.node = majorVersion >= 18;
            requirements.nodeVersion = nodeVersion;
        } catch (err) {
            requirements.node = false;
        }

        // Check if we can write to the project root
        try {
            const testFile = path.join(process.cwd(), '.install-test');
            await fs.writeFile(testFile, 'test');
            await fs.unlink(testFile);
            requirements.writable = true;
        } catch (err) {
            requirements.writable = false;
        }

        // Check if Prisma is available
        try {
            await execAsync('npx prisma --version');
            requirements.prisma = true;
        } catch (err) {
            requirements.prisma = false;
        }

        return NextResponse.json(requirements);
    } catch (error) {
        console.error('Error checking requirements:', error);
        return NextResponse.json({ error: 'Failed to check requirements' }, { status: 500 });
    }
}
