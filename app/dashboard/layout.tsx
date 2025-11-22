'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const handleLogout = () => {
        // Clear the authentication cookie
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        // Redirect to login page
        router.push('/login');
    };

    return (
        <div className={styles.dashboardLayout}>
            <div className="animated-bg"></div>

            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <div className={styles.logoText}>SMM Panel</div>
                </div>

                <nav>
                    <ul className={styles.nav}>
                        <li className={styles.navItem}>
                            <Link href="/" className={styles.navLink}>
                                🏠 Back to Home
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/dashboard" className={styles.navLink}>
                                📊 Dashboard
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/dashboard/new-order" className={styles.navLink}>
                                🛒 New Order
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/dashboard/orders" className={styles.navLink}>
                                📋 My Orders
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/dashboard/wallet" className={styles.navLink}>
                                💰 Wallet
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/dashboard/support" className={styles.navLink}>
                                💬 Support
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/dashboard/profile" className={styles.navLink}>
                                👤 Profile
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className={styles.logoutSection}>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                        🚪 Logout
                    </button>
                </div>
            </aside>

            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
