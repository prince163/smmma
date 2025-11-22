'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../management.module.css';

type Platform = {
    id: string;
    name: string;
    icon: string;
    services: Service[];
};

type Service = {
    id: string;
    name: string;
    packages: Package[];
};

type Package = {
    id: string;
    name: string;
    price: number;
    minQuantity: number;
    maxQuantity: number;
    description: string | null;
};

export default function NewOrderForm({ platforms }: { platforms: Platform[] }) {
    const [selectedPlatform, setSelectedPlatform] = useState<string>('');
    const [selectedService, setSelectedService] = useState<string>('');
    const [selectedPackage, setSelectedPackage] = useState<string>('');
    const [link, setLink] = useState('');
    const [quantity, setQuantity] = useState<number>(0);
    const [error, setError] = useState('');
    const router = useRouter();

    const platform = platforms.find((p) => p.id === selectedPlatform);
    const service = platform?.services.find((s) => s.id === selectedService);
    const pkg = service?.packages.find((p) => p.id === selectedPackage);

    const totalPrice = pkg ? (pkg.price / 1000) * quantity : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!pkg) return;

        // Add to cart instead of creating order directly
        const cartItem = {
            packageId: pkg.id,
            packageName: pkg.name,
            serviceName: service?.name || '',
            platformName: platform?.name || '',
            price: pkg.price,
            quantity,
            link,
        };

        try {
            const res = await fetch('/api/user/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cartItem),
            });

            if (res.ok) {
                const data = await res.json();
                // Redirect to checkout with order details
                if (data.redirectUrl) {
                    router.push(data.redirectUrl);
                } else {
                    router.push('/checkout');
                }
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to add to cart');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className={styles.managementPage}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>🛒 New Order</h1>
                <p className={styles.pageDescription}>Place a new order for social media services</p>
            </div>

            <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Place New Order</h2>
                <p className={styles.sectionDescription}>
                    Select a platform, service, and package to get started
                </p>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#fca5a5',
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.75rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            fontSize: '1rem',
                        }}>
                            Platform
                        </label>
                        <select
                            value={selectedPlatform}
                            onChange={(e) => {
                                setSelectedPlatform(e.target.value);
                                setSelectedService('');
                                setSelectedPackage('');
                            }}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                                cursor: 'pointer',
                            }}
                            required
                        >
                            <option value="" style={{ background: '#1a1a2e', color: '#fff' }}>Select Platform</option>
                            {platforms.map((p) => (
                                <option key={p.id} value={p.id} style={{ background: '#1a1a2e', color: '#fff' }}>
                                    {p.icon} {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {platform && (
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.75rem',
                                fontWeight: '600',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                            }}>
                                Service
                            </label>
                            <select
                                value={selectedService}
                                onChange={(e) => {
                                    setSelectedService(e.target.value);
                                    setSelectedPackage('');
                                }}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                }}
                                required
                            >
                                <option value="" style={{ background: '#1a1a2e', color: '#fff' }}>Select Service</option>
                                {platform.services.map((s) => (
                                    <option key={s.id} value={s.id} style={{ background: '#1a1a2e', color: '#fff' }}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {service && (
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.75rem',
                                fontWeight: '600',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                            }}>
                                Package
                            </label>
                            <select
                                value={selectedPackage}
                                onChange={(e) => setSelectedPackage(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                }}
                                required
                            >
                                <option value="" style={{ background: '#1a1a2e', color: '#fff' }}>Select Package</option>
                                {service.packages.map((p) => (
                                    <option key={p.id} value={p.id} style={{ background: '#1a1a2e', color: '#fff' }}>
                                        {p.name} - ${p.price}/1000
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {pkg && (
                        <>
                            <div style={{
                                padding: '1.5rem',
                                background: 'rgba(99, 102, 241, 0.1)',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                borderRadius: '16px',
                            }}>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                    {pkg.description}
                                </p>
                                <p style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                                    Min: {pkg.minQuantity?.toLocaleString() || 'N/A'} | Max: {pkg.maxQuantity?.toLocaleString() || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.75rem',
                                    fontWeight: '600',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                }}>
                                    Link
                                </label>
                                <input
                                    type="url"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    placeholder="https://example.com/your-profile"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                    }}
                                    required
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.75rem',
                                    fontWeight: '600',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                }}>
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    value={quantity || ''}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                    min={pkg.minQuantity || 1}
                                    max={pkg.maxQuantity || 999999}
                                    placeholder={`Enter quantity${pkg.minQuantity && pkg.maxQuantity ? ` (${pkg.minQuantity} - ${pkg.maxQuantity})` : ''}`}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                    }}
                                    required
                                />
                            </div>

                            <div style={{
                                padding: '1.5rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '2px solid var(--primary-light)',
                                borderRadius: '16px',
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    Total Price
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-light)' }}>
                                    ${totalPrice.toFixed(2)}
                                </div>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '1.25rem 2.5rem',
                                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    fontSize: '1.125rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                                }}
                            >
                                🛒 Add to Cart & Checkout
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
