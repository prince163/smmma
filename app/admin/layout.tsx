'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        // Clear the authentication cookie
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        // Redirect to login page
        router.push('/login');
    };

    return (
        <div className={styles.adminLayout}>
            <div className="animated-bg"></div>

            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <div className={styles.logoText}>Admin Panel</div>
                </div>

                <nav>
                    <Link href="/" className={styles.navLink}>
                        🏠 Back to Home
                    </Link>
                    <Link href="/admin" className={pathname === '/admin' ? styles.navLinkActive : styles.navLink}>
                        📊 Dashboard
                    </Link>
                    <Link href="/admin/platforms" className={pathname === '/admin/platforms' ? styles.navLinkActive : styles.navLink}>
                        🌐 Platforms
                    </Link>
                    <Link href="/admin/services" className={pathname === '/admin/services' ? styles.navLinkActive : styles.navLink}>
                        ⚙️ Services
                    </Link>
                    <Link href="/admin/packages" className={pathname === '/admin/packages' ? styles.navLinkActive : styles.navLink}>
                        📦 Packages
                    </Link>
                    <Link href="/admin/import" className={pathname === '/admin/import' ? styles.navLinkActive : styles.navLink}>
                        📥 CSV Import
                    </Link>
                    <Link href="/admin/orders" className={pathname === '/admin/orders' ? styles.navLinkActive : styles.navLink}>
                        📋 Orders
                    </Link>
                    <Link href="/admin/support" className={pathname === '/admin/support' ? styles.navLinkActive : styles.navLink}>
                        💬 Support
                    </Link>
                    <Link href="/admin/media" className={pathname === '/admin/media' ? styles.navLinkActive : styles.navLink}>
                        📁 Media
                    </Link>
                    <Link href="/admin/pages" className={pathname === '/admin/pages' ? styles.navLinkActive : styles.navLink}>
                        📄 Pages
                    </Link>
                    <Link href="/admin/currencies" className={pathname === '/admin/currencies' ? styles.navLinkActive : styles.navLink}>
                        💱 Currencies
                    </Link>
                    <Link href="/admin/discount-tiers" className={pathname === '/admin/discount-tiers' ? styles.navLinkActive : styles.navLink}>
                        🎯 Discount Tiers
                    </Link>
                    <Link href="/admin/settings" className={pathname === '/admin/settings' ? styles.navLinkActive : styles.navLink}>
                        ⚙️ Settings
                    </Link>
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
