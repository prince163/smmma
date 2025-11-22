'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import styles from './cart.module.css';

export default function CartPage() {
    const router = useRouter();
    const { cart, removeFromCart, updateLink, getTotalPrice } = useCart();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
            const data = await res.json();
            setUser(data);
        }
    };

    const handleCheckout = () => {
        // Validate all links are filled
        const missingLinks = cart.filter((item) => !item.link);
        if (missingLinks.length > 0) {
            alert('Please provide links for all items in your cart');
            return;
        }
        router.push('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div className={styles.emptyCart}>
                <div className="animated-bg"></div>
                <div className={styles.emptyContent}>
                    <h1>🛒 Your Cart is Empty</h1>
                    <p>Add some packages to get started!</p>
                    <button onClick={() => router.push('/')} className={styles.shopButton}>
                        Browse Packages
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.cartPage}>
            <div className="animated-bg"></div>

            <div className={styles.container}>
                <h1 className={styles.title}>🛒 Shopping Cart</h1>
                <p className={styles.subtitle}>{cart.length} item(s) in your cart</p>

                <div className={styles.cartGrid}>
                    <div className={styles.cartItems}>
                        {cart.map((item) => (
                            <div key={item.packageId} className={styles.cartItem}>
                                <div className={styles.itemHeader}>
                                    <div className={styles.itemInfo}>
                                        <span className={styles.platformIcon}>{item.platformIcon}</span>
                                        <div>
                                            <h3 className={styles.itemName}>{item.packageName}</h3>
                                            <p className={styles.itemService}>
                                                {item.platformName} • {item.serviceName}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.packageId)}
                                        className={styles.removeButton}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className={styles.itemDetails}>
                                    <div className={styles.detailRow}>
                                        <span>Quantity:</span>
                                        <strong>{item.quantity.toLocaleString()}</strong>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span>Price:</span>
                                        <strong className={styles.price}>${item.price.toFixed(2)}</strong>
                                    </div>
                                </div>

                                <div className={styles.linkInput}>
                                    <label>Target Link/URL</label>
                                    <input
                                        type="url"
                                        value={item.link}
                                        onChange={(e) => updateLink(item.packageId, e.target.value)}
                                        placeholder="https://example.com/your-profile"
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.cartSummary}>
                        <h2>Order Summary</h2>

                        <div className={styles.summaryRow}>
                            <span>Subtotal ({cart.length} items)</span>
                            <span>${getTotalPrice().toFixed(2)}</span>
                        </div>

                        {user && user.balance !== undefined && (
                            <div className={styles.balanceInfo}>
                                <span>Your Balance:</span>
                                <span className={styles.balance}>${user.balance.toFixed(2)}</span>
                            </div>
                        )}

                        <div className={styles.totalRow}>
                            <span>Total</span>
                            <span className={styles.totalPrice}>${getTotalPrice().toFixed(2)}</span>
                        </div>

                        <button onClick={handleCheckout} className={styles.checkoutButton}>
                            Proceed to Checkout
                        </button>

                        <button
                            onClick={() => router.push('/')}
                            className={styles.continueButton}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
