// CSV Parser Utility for Import System

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

export interface PlatformRow {
    name: string;
    description: string;
    icon?: string;
    isActive?: string;
}

export interface ServiceRow {
    platformName: string;
    name: string;
    description: string;
    isActive?: string;
}

export interface PackageRow {
    platformName: string;
    serviceName: string;
    name: string;
    quantity: string;
    price: string;
    description?: string;
    isActive?: string;
}

/**
 * Parse CSV file to JSON array
 */
export async function parseCSV(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text.split('\n').filter(line => line.trim());

                if (lines.length < 2) {
                    reject(new Error('CSV file must have at least a header row and one data row'));
                    return;
                }

                // Parse header
                const headers = lines[0].split(',').map(h => h.trim());

                // Parse data rows
                const data = lines.slice(1).map((line, index) => {
                    const values = parseCSVLine(line);
                    const row: any = {};

                    headers.forEach((header, i) => {
                        row[header] = values[i]?.trim() || '';
                    });

                    row._lineNumber = index + 2; // +2 because index starts at 0 and we skip header
                    return row;
                });

                resolve(data);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

/**
 * Parse a single CSV line, handling quoted values
 */
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

/**
 * Validate platform row data
 */
export function validatePlatformRow(row: PlatformRow): ValidationResult {
    const errors: string[] = [];

    if (!row.name || row.name.trim() === '') {
        errors.push('Name is required');
    }

    if (!row.description || row.description.trim() === '') {
        errors.push('Description is required');
    }

    if (row.isActive && !['true', 'false', ''].includes(row.isActive.toLowerCase())) {
        errors.push('isActive must be "true" or "false"');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validate service row data
 */
export function validateServiceRow(row: ServiceRow): ValidationResult {
    const errors: string[] = [];

    if (!row.platformName || row.platformName.trim() === '') {
        errors.push('Platform name is required');
    }

    if (!row.name || row.name.trim() === '') {
        errors.push('Service name is required');
    }

    if (!row.description || row.description.trim() === '') {
        errors.push('Description is required');
    }

    if (row.isActive && !['true', 'false', ''].includes(row.isActive.toLowerCase())) {
        errors.push('isActive must be "true" or "false"');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Validate package row data
 */
export function validatePackageRow(row: PackageRow): ValidationResult {
    const errors: string[] = [];

    if (!row.platformName || row.platformName.trim() === '') {
        errors.push('Platform name is required');
    }

    if (!row.serviceName || row.serviceName.trim() === '') {
        errors.push('Service name is required');
    }

    if (!row.name || row.name.trim() === '') {
        errors.push('Package name is required');
    }

    if (!row.quantity || row.quantity.trim() === '') {
        errors.push('Quantity is required');
    } else if (isNaN(Number(row.quantity)) || Number(row.quantity) <= 0) {
        errors.push('Quantity must be a positive number');
    }

    if (!row.price || row.price.trim() === '') {
        errors.push('Price is required');
    } else if (isNaN(Number(row.price)) || Number(row.price) < 0) {
        errors.push('Price must be a non-negative number');
    }

    if (row.isActive && !['true', 'false', ''].includes(row.isActive.toLowerCase())) {
        errors.push('isActive must be "true" or "false"');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Generate CSV template for download
 */
export function generateCSVTemplate(type: 'platforms' | 'services' | 'packages'): string {
    const templates = {
        platforms: `name,description,icon,isActive
Facebook,Facebook social media platform,📘,true
Instagram,Instagram photo sharing,📷,true
TikTok,TikTok short video platform,🎵,true
Twitter,Twitter microblogging,🐦,true
YouTube,YouTube video platform,📹,true`,

        services: `platformName,name,description,isActive
Facebook,Followers,Increase your Facebook followers,true
Facebook,Likes,Get more Facebook likes,true
Instagram,Followers,Grow your Instagram following,true
Instagram,Likes,Boost your Instagram likes,true
TikTok,Followers,Gain TikTok followers,true`,

        packages: `platformName,serviceName,name,quantity,price,description,isActive
Facebook,Followers,Starter Pack,1000,9.99,1000 Facebook followers,true
Facebook,Followers,Pro Pack,5000,39.99,5000 Facebook followers,true
Instagram,Likes,Basic,500,4.99,500 Instagram likes,true
Instagram,Likes,Premium,2000,14.99,2000 Instagram likes,true
TikTok,Followers,Growth Pack,3000,24.99,3000 TikTok followers,true`
    };

    return templates[type];
}

/**
 * Convert boolean string to actual boolean
 */
export function parseBooleanString(value: string | undefined): boolean {
    if (!value) return true; // Default to true if not specified
    return value.toLowerCase() === 'true';
}
