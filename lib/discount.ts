import prisma from './prisma';

export interface DiscountTier {
    id: string;
    name: string;
    minQuantity: number;
    discountPercent: number;
    isActive: boolean;
}

// Get applicable discount tier for a quantity
export async function getDiscountTier(quantity: number): Promise<DiscountTier | null> {
    const tiers = await prisma.discountTier.findMany({
        where: { isActive: true },
        orderBy: { minQuantity: 'desc' } // Highest quantity first
    });

    // Find the highest tier that applies
    for (const tier of tiers) {
        if (quantity >= tier.minQuantity) {
            return tier;
        }
    }

    return null;
}

// Calculate price with discount
export function calculateDiscountedPrice(
    basePrice: number,
    quantity: number,
    discountPercent: number
): { originalPrice: number; discountedPrice: number; savings: number } {
    // Base price is per 1000 units
    const originalPrice = (basePrice / 1000) * quantity;
    const discount = (originalPrice * discountPercent) / 100;
    const discountedPrice = originalPrice - discount;

    return {
        originalPrice,
        discountedPrice,
        savings: discount
    };
}

// Get price with automatic discount tier
export async function getPriceWithDiscount(
    basePricePer1000: number,
    quantity: number
): Promise<{
    originalPrice: number;
    finalPrice: number;
    savings: number;
    discountPercent: number;
    tierName: string | null;
}> {
    const tier = await getDiscountTier(quantity);
    const discountPercent = tier?.discountPercent || 0;

    const prices = calculateDiscountedPrice(basePricePer1000, quantity, discountPercent);

    return {
        originalPrice: prices.originalPrice,
        finalPrice: prices.discountedPrice,
        savings: prices.savings,
        discountPercent,
        tierName: tier?.name || null
    };
}

// Initialize default discount tiers
export async function initializeDefaultDiscountTiers() {
    const existingTiers = await prisma.discountTier.count();

    if (existingTiers === 0) {
        await prisma.discountTier.createMany({
            data: [
                {
                    name: 'Bronze',
                    minQuantity: 5000,
                    discountPercent: 5,
                    isActive: true,
                },
                {
                    name: 'Silver',
                    minQuantity: 10000,
                    discountPercent: 10,
                    isActive: true,
                },
                {
                    name: 'Gold',
                    minQuantity: 25000,
                    discountPercent: 15,
                    isActive: true,
                },
            ],
        });
    }
}
