'use client';

import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import styles from './service.module.css';

interface AddToCartButtonProps {
    pkg: {
        id: string;
        name: string;
        price: number;
        quantity: number;
    };
    serviceName: string;
    platformName: string;
    platformIcon: string;
}

export default function AddToCartButton({ pkg, serviceName, platformName, platformIcon }: AddToCartButtonProps) {
    const { addToCart } = useCart();
    const router = useRouter();

    const handleAddToCart = () => {
        addToCart({
            packageId: pkg.id,
            packageName: pkg.name,
            serviceName,
            platformName,
            platformIcon,
            quantity: pkg.quantity,
            price: pkg.price,
        });

        // Show success message and redirect to cart
        alert(`✓ ${pkg.name} added to cart!`);
        router.push('/cart');
    };

    return (
        <button onClick={handleAddToCart} className={styles.addToCartButton}>
            🛒 Add to Cart
        </button>
    );
}
