import prisma from './prisma';

export interface Currency {
    id: string;
    code: string;
    name: string;
    symbol: string;
    exchangeRate: number;
    isDefault: boolean;
    isActive: boolean;
}

// Get all active currencies
export async function getActiveCurrencies(): Promise<Currency[]> {
    return await prisma.currency.findMany({
        where: { isActive: true },
        orderBy: { isDefault: 'desc' }
    });
}

// Get default currency
export async function getDefaultCurrency(): Promise<Currency | null> {
    return await prisma.currency.findFirst({
        where: { isDefault: true, isActive: true }
    });
}

// Get currency by code
export async function getCurrencyByCode(code: string): Promise<Currency | null> {
    return await prisma.currency.findUnique({
        where: { code }
    });
}

// Convert amount between currencies
export async function convertCurrency(
    amount: number,
    fromCode: string,
    toCode: string
): Promise<number> {
    if (fromCode === toCode) return amount;

    const fromCurrency = await getCurrencyByCode(fromCode);
    const toCurrency = await getCurrencyByCode(toCode);

    if (!fromCurrency || !toCurrency) {
        throw new Error('Currency not found');
    }

    // Convert to base currency first, then to target currency
    const baseAmount = amount / fromCurrency.exchangeRate;
    return baseAmount * toCurrency.exchangeRate;
}

// Format currency for display
export function formatCurrency(amount: number, currency: Currency): string {
    const formatted = amount.toFixed(2);

    // For ZAR, symbol goes before (R 100.00)
    // For USD, symbol goes before ($ 100.00)
    if (currency.code === 'ZAR') {
        return `R ${formatted}`;
    } else if (currency.code === 'USD') {
        return `$${formatted}`;
    }

    return `${currency.symbol}${formatted}`;
}

// Initialize default currencies (ZAR and USD)
export async function initializeDefaultCurrencies() {
    const existingCurrencies = await prisma.currency.count();

    if (existingCurrencies === 0) {
        await prisma.currency.createMany({
            data: [
                {
                    code: 'ZAR',
                    name: 'South African Rand',
                    symbol: 'R',
                    exchangeRate: 1.0, // Base currency
                    isDefault: true,
                    isActive: true,
                },
                {
                    code: 'USD',
                    name: 'US Dollar',
                    symbol: '$',
                    exchangeRate: 0.054, // Example rate: 1 ZAR = 0.054 USD (adjust as needed)
                    isDefault: false,
                    isActive: true,
                },
            ],
        });
    }
}
