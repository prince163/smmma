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
        const requiredHeaders = ['platformSlug', 'serviceName', 'name', 'quantity', 'price'];
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
            if (!row.platformSlug || !row.serviceName || !row.name || !row.quantity || !row.price) {
                results.errors.push(
                    `Line ${lineNumber}: Missing required fields (platformSlug, serviceName, name, quantity, price)`
                );
                continue;
            }

            // Validate numeric fields
            const quantity = parseInt(row.quantity);
            const price = parseFloat(row.price);
            const minQuantity = row.minQuantity ? parseInt(row.minQuantity) : quantity;
            const maxQuantity = row.maxQuantity ? parseInt(row.maxQuantity) : quantity * 10;

            if (isNaN(quantity) || quantity <= 0) {
                results.errors.push(`Line ${lineNumber}: Invalid quantity "${row.quantity}"`);
                continue;
            }

            if (isNaN(price) || price < 0) {
                results.errors.push(`Line ${lineNumber}: Invalid price "${row.price}"`);
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

                // Find service
                const service = await prisma.service.findFirst({
                    where: {
                        name: row.serviceName,
                        platformId: platform.id,
                    },
                });

                if (!service) {
                    results.errors.push(
                        `Line ${lineNumber}: Service "${row.serviceName}" not found for platform "${row.platformSlug}"`
                    );
                    continue;
                }

                // Check if package exists
                const existing = await prisma.package.findFirst({
                    where: {
                        name: row.name,
                        serviceId: service.id,
                    },
                });

                const packageData = {
                    name: row.name,
                    quantity,
                    price,
                    description: row.description || '',
                    serviceId: service.id,
                    minQuantity,
                    maxQuantity,
                    packageType: 'PREBUILT',
                };

                if (existing) {
                    // Update existing package
                    await prisma.package.update({
                        where: { id: existing.id },
                        data: packageData,
                    });
                    results.updated++;
                } else {
                    // Create new package
                    const pkg = await prisma.package.create({
                        data: packageData,
                    });
                    results.created.push(pkg);
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
        console.error('Package import error:', error);
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
