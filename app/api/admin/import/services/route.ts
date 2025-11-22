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
        const requiredHeaders = ['platformSlug', 'name'];
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
            if (!row.platformSlug || !row.name) {
                results.errors.push(
                    `Line ${lineNumber}: Missing required fields (platformSlug, name)`
                );
                continue;
            }

            try {
                // Find platform by slug
                const platform = await prisma.platform.findUnique({
                    where: { slug: row.platformSlug },
                });

                if (!platform) {
                    results.errors.push(`Line ${lineNumber}: Platform with slug "${row.platformSlug}" not found`);
                    continue;
                }

                // Check if service exists
                const existing = await prisma.service.findFirst({
                    where: {
                        name: row.name,
                        platformId: platform.id,
                    },
                });

                const serviceData = {
                    name: row.name,
                    platformId: platform.id,
                };

                if (existing) {
                    // Update existing service (only name can be updated)
                    await prisma.service.update({
                        where: { id: existing.id },
                        data: {
                            name: serviceData.name,
                        },
                    });
                    results.updated++;
                } else {
                    // Create new service
                    const service = await prisma.service.create({
                        data: serviceData,
                    });
                    results.created.push(service);
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
        console.error('Service import error:', error);
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
