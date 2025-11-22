'use client';

import { useState, useEffect } from 'react';
import styles from '../management.module.css';

interface Order {
    id: string;
    status: string;
    price: number;
    quantity: number;
    targetUrl: string;
    createdAt: string;
    user: { name: string; email: string };
    package: { name: string; service: { name: string; platform: { name: string } } };
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const res = await fetch('/api/admin/orders');
        const data = await res.json();
        setOrders(data);
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        await fetch(`/api/admin/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        fetchOrders();
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
                <h1 className={styles.pageTitle}>Manage Orders</h1>
                <p className={styles.pageDescription}>View and manage all customer orders</p>
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
                {filteredOrders.length > 0 ? (
                    <table className={styles.table}>
                        <thead className={styles.tableHeader}>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Service</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tableBody}>
                            {filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td><span className={styles.badge}>{order.id.slice(0, 8)}</span></td>
                                    <td>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{order.user.name}</div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{order.user.email}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.875rem' }}>
                                            {order.package.service.platform.name} - {order.package.service.name}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.package.name}</div>
                                    </td>
                                    <td>{order.quantity.toLocaleString()}</td>
                                    <td>${order.price.toFixed(2)}</td>
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
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                            style={{
                                                padding: '0.5rem',
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '8px',
                                                color: 'var(--text-primary)',
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="PROCESSING">Processing</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="FAILED">Failed</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <p>No orders found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
