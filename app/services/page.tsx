import Navbar from '@/components/Navbar';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import styles from './page.module.css';

export default async function ServicesPage() {
    const platforms = await prisma.platform.findMany({
        include: {
            _count: { select: { services: true } },
        },
        orderBy: { name: 'asc' },
    });

    return (
        <div className={styles.servicesPage}>
            <div className="animated-bg"></div>
            <Navbar />

            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Choose Your Platform</h1>
                <p className={styles.pageSubtitle}>
                    Select a platform to view available services and packages
                </p>
            </div>

            <div className={styles.platformsContainer}>
                <div className={styles.platformsGrid}>
                    {platforms.map((platform) => (
                        <Link
                            key={platform.id}
                            href={`/services/${platform.slug}`}
                            className={styles.platformCard}
                        >
                            <span className={styles.platformIcon}>{platform.icon}</span>
                            <h3 className={styles.platformName}>{platform.name}</h3>
                            <p className={styles.platformServices}>
                                {platform._count.services} {platform._count.services === 1 ? 'Service' : 'Services'}
                            </p>
                            <span className={styles.viewBtn}>
                                View Services →
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
