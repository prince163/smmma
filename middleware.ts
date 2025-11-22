import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Middleware simplified for Vercel Edge Runtime compatibility
    // Installation protection will be handled by the installer itself
    return NextResponse.next();
}

export const config = {
    matcher: ['/install/:path*', '/api/install/:path*']
};
