import prisma from '@/lib/prisma';
import NewOrderForm from './NewOrderForm';

export default async function NewOrderPage() {
    const platforms = await prisma.platform.findMany({
        include: {
            services: {
                include: {
                    packages: true,
                },
            },
        },
    });

    return (
        <div>
            <h2>New Order</h2>
            <NewOrderForm platforms={platforms} />
        </div>
    );
}
