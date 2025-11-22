import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import styles from './dashboard.module.css';

export default async function UserDashboard() {
    const session = await getSession();
    if (!session) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.id as string },
        include: { _count: { select: { orders: true } } },
    });

    if (!user) redirect('/login');

    const completedOrders = await prisma.order.count({
        where: { userId: user.id, status: 'COMPLETED' },
    });

    // Calculate total spend
    const totalSpend = await prisma.order.aggregate({
        where: { userId: user.id },
        _sum: { price: true },
    });

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user.name}!</p>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Balance</div>
                    <div className={styles.statValue}>${user.balance.toFixed(2)}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Total Orders</div>
                    <div className={styles.statValue}>{user._count.orders}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Completed</div>
                    <div className={styles.statValue}>{completedOrders}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Total Spend</div>
                    <div className={styles.statValue}>${totalSpend._sum.price?.toFixed(2) || '0.00'}</div>
                </div>
            </div>

            <div style={{ marginTop: '3rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                    Quick Actions
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                    <a href="/dashboard/new-order" style={{
                        padding: '2rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        transition: 'all 0.3s ease',
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🛒</div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>Place New Order</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Order social media services</p>
                    </a>
                    <a href="/dashboard/wallet" style={{
                        padding: '2rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        transition: 'all 0.3s ease',
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💰</div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>Add Funds</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Top up your wallet balance</p>
                    </a>
                    <a href="/dashboard/orders" style={{
                        padding: '2rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        transition: 'all 0.3s ease',
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>View Orders</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Track your order status</p>
                    </a>
                </div>
            </div>
        </div>
    );
}
