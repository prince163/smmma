'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../management.module.css';

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    price: number;
    quantity: number;
    link: string;
    createdAt: string;
    package: {
        name: string;
        service: {
            name: string;
            platform: {
                name: string;
                icon: string;
            };
        };
    };
}

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/user/orders');
            if (!res.ok) {
                router.push('/login');
                return;
            }
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'rgba(251, 191, 36, 0.2)';
            case 'PROCESSING': return 'rgba(59, 130, 246, 0.2)';
            case 'COMPLETED': return 'rgba(34, 197, 94, 0.2)';
            case 'FAILED': return 'rgba(239, 68, 68, 0.2)';
            default: return 'rgba(255, 255, 255, 0.1)';
        }
    };

    const getStatusBorder = (status: string) => {
        switch (status) {
            case 'PENDING': return 'rgba(251, 191, 36, 0.4)';
            case 'PROCESSING': return 'rgba(59, 130, 246, 0.4)';
            case 'COMPLETED': return 'rgba(34, 197, 94, 0.4)';
            case 'FAILED': return 'rgba(239, 68, 68, 0.4)';
            default: return 'rgba(255, 255, 255, 0.2)';
        }
    };

    const filteredOrders = filter === 'ALL'
        ? orders
        : orders.filter(order => order.status === filter);

    return (
        <div className={styles.managementPage}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>📋 My Orders</h1>
                <p className={styles.pageDescription}>Track and manage your orders</p>
            </div>

            <div className={styles.formSection}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {['ALL', 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: filter === status ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' : 'rgba(255, 255, 255, 0.05)',
                                border: filter === status ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '10px',
                                color: 'var(--text-primary)',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.tableSection}>
                <h2 className={styles.sectionTitle}>Orders ({filteredOrders.length})</h2>
                {loading ? (
                    <div className={styles.emptyState}>
                        <p>Loading orders...</p>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    <table className={styles.table}>
                        <thead className={styles.tableHeader}>
                            <tr>
                                <th>Order #</th>
                                <th>Platform</th>
                                <th>Service</th>
                                <th>Package</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tableBody}>
                            {filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>
                                        <span style={{
                                            fontWeight: '700',
                                            color: 'var(--primary-light)',
                                            fontFamily: 'monospace',
                                            fontSize: '0.95rem',
                                        }}>
                                            {order.orderNumber}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '1.5rem' }}>{order.package.service.platform.icon}</span>
                                            <span>{order.package.service.platform.name}</span>
                                        </div>
                                    </td>
                                    <td>{order.package.service.name}</td>
                                    <td><span className={styles.badge}>{order.package.name}</span></td>
                                    <td>{order.quantity.toLocaleString()}</td>
                                    <td style={{ fontWeight: '600', color: 'var(--primary-light)' }}>${order.price.toFixed(2)}</td>
                                    <td>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.375rem 0.75rem',
                                            background: getStatusColor(order.status),
                                            border: `1px solid ${getStatusBorder(order.status)}`,
                                            borderRadius: '20px',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <p>📦 No orders found. Place your first order to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
