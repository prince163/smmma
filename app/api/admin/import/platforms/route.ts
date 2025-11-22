import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session?.id) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Check if user is admin
        const user = await prisma.user.findUnique({
            where: { id: session.id as string },
        });

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Read file content
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
            return NextResponse.json(
                { error: 'CSV file must have at least a header row and one data row' },
                { status: 400 }
            );
        }

        // Parse CSV
        const headers = lines[0].split(',').map(h => h.trim());
        const requiredHeaders = ['name', 'slug'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

        if (missingHeaders.length > 0) {
            return NextResponse.json(
                { error: `Missing required columns: ${missingHeaders.join(', ')}` },
                { status: 400 }
            );
        }

        const results = {
            success: 0,
            updated: 0,
            errors: [] as string[],
            created: [] as any[],
        };

        // Process each row
        for (let i = 1; i < lines.length; i++) {
            const lineNumber = i + 1;
            const values = parseCSVLine(lines[i]);
            const row: any = {};

            headers.forEach((header, index) => {
                row[header] = values[index]?.trim() || '';
            });

            // Validate required fields
            if (!row.name || !row.slug) {
                results.errors.push(`Line ${lineNumber}: Missing required fields (name, slug)`);
                continue;
            }

            try {
                // Check if platform exists by slug
                const existing = await prisma.platform.findUnique({
                    where: { slug: row.slug },
                });

                const platformData = {
                    name: row.name,
                    slug: row.slug,
                    icon: row.icon || '📱',
                };

                if (existing) {
                    // Update existing platform
                    await prisma.platform.update({
                        where: { id: existing.id },
                        data: {
                            name: platformData.name,
                            icon: platformData.icon,
                        },
                    });
                    results.updated++;
                } else {
                    // Create new platform
                    const platform = await prisma.platform.create({
                        data: platformData,
                    });
                    results.created.push(platform);
                    results.success++;
                }
            } catch (error: any) {
                results.errors.push(`Line ${lineNumber}: ${error.message}`);
            }
        }

        return NextResponse.json({
            success: results.success,
            updated: results.updated,
            errors: results.errors,
            created: results.created,
            total: lines.length - 1,
        });
    } catch (error: any) {
        console.error('Platform import error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// Helper function to parse CSV line with quoted values
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current);
    return result;
}
