import Navbar from '@/components/Navbar';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './platform.module.css';

export default async function PlatformPage({ params }: { params: Promise<{ platform: string }> }) {
    const { platform: platformSlug } = await params;

    const platform = await prisma.platform.findUnique({
        where: { slug: platformSlug },
        include: {
            services: {
                include: {
                    _count: { select: { packages: true } },
                },
            },
        },
    });

    if (!platform) {
        notFound();
    }

    return (
        <div className={styles.platformPage}>
            <div className="animated-bg"></div>
            <Navbar />

            <div className={styles.pageHeader}>
                <Link href="/services" className={styles.backLink}>
                    ← Back to Platforms
                </Link>
                <div className={styles.platformTitle}>
                    <span className={styles.platformIcon}>{platform.icon}</span>
                    <h1>{platform.name} Services</h1>
                </div>
                <p className={styles.pageSubtitle}>
                    Choose a service to view available packages
                </p>
            </div>

            <div className={styles.servicesContainer}>
                <div className={styles.servicesGrid}>
                    {platform.services.map((service) => (
                        <Link
                            key={service.id}
                            href={`/services/${platformSlug}/${service.id}`}
                            className={styles.serviceCard}
                        >
                            <div className={styles.serviceIcon}>📊</div>
                            <h3 className={styles.serviceName}>{service.name}</h3>
                            <p className={styles.servicePackages}>
                                {service._count.packages} {service._count.packages === 1 ? 'Package' : 'Packages'} Available
                            </p>
                            <span className={styles.viewBtn}>
                                View Packages →
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
