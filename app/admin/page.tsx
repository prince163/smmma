export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import prisma from '@/lib/prisma';
import styles from './admin.module.css';

export default async function AdminDashboard() {
    const userCount = await prisma.user.count();
    const orderCount = await prisma.order.count();
    const platformCount = await prisma.platform.count();

    // Calculate total revenue (completed orders)
    const revenue = await prisma.order.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { price: true },
    });

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome to your admin panel</p>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Total Users</div>
                    <div className={styles.statValue}>{userCount}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Total Orders</div>
                    <div className={styles.statValue}>{orderCount}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Total Revenue</div>
                    <div className={styles.statValue}>${revenue._sum.price?.toFixed(2) || '0.00'}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Platforms</div>
                    <div className={styles.statValue}>{platformCount}</div>
                </div>
            </div>

            <div style={{ marginTop: '3rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                    Recent Orders
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>Order management coming soon...</p>
            </div>
        </div>
    );
}
