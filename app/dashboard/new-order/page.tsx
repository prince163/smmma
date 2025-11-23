export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import NewOrderForm from './NewOrderForm';

export default async function NewOrderPage() {
    let platforms = [];

    try {
        platforms = await prisma.platform.findMany({
            include: {
                services: {
                    include: {
                        packages: true,
                    },
                },
            },
        });
    } catch (error) {
        console.log('Database not accessible');
    }

    return (
        <div>
            <h2>New Order</h2>
            <NewOrderForm platforms={platforms} />
        </div>
    );
}
