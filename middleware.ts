import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if accessing install page
    if (pathname.startsWith('/install')) {
        // Check if already installed
        const lockFile = path.join(process.cwd(), '.installed');

        try {
            if (fs.existsSync(lockFile)) {
                // Already installed, redirect to home
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch (error) {
            // If error checking file, allow access
            console.error('Error checking installation status:', error);
        }
    }

    // Check if accessing API install routes
    if (pathname.startsWith('/api/install')) {
        const lockFile = path.join(process.cwd(), '.installed');

        try {
            if (fs.existsSync(lockFile) && !pathname.includes('/check')) {
                // Already installed, block API access
                return NextResponse.json(
                    { error: 'Application is already installed' },
                    { status: 403 }
                );
            }
        } catch (error) {
            console.error('Error checking installation status:', error);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/install/:path*', '/api/install/:path*']
};
