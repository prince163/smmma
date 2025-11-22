import Navbar from '@/components/Navbar';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './service.module.css';
import AddToCartButton from './AddToCartButton';

export default async function ServicePage({ params }: { params: Promise<{ platform: string; service: string }> }) {
    const { platform: platformSlug, service: serviceId } = await params;

    const platform = await prisma.platform.findUnique({
        where: { slug: platformSlug },
    });

    const service = await prisma.service.findUnique({
        where: { id: serviceId },
        include: {
            packages: true,
            platform: true,
        },
    });

    if (!platform || !service) {
        notFound();
    }

    return (
        <div className={styles.servicePage}>
            <div className="animated-bg"></div>
            <Navbar />

            <div className={styles.pageHeader}>
                <Link href={`/services/${platformSlug}`} className={styles.backLink}>
                    ← Back to {platform.name} Services
                </Link>
                <div className={styles.serviceTitle}>
                    <span className={styles.platformIcon}>{platform.icon}</span>
                    <h1>{service.name} Packages</h1>
                </div>
                <p className={styles.pageSubtitle}>
                    Choose the perfect package for your needs
                </p>
            </div>

            <div className={styles.packagesContainer}>
                <div className={styles.packagesGrid}>
                    {service.packages.map((pkg) => (
                        <div key={pkg.id} className={styles.packageCard}>
                            <h3 className={styles.packageName}>{pkg.name}</h3>
                            <div className={styles.packagePrice}>${pkg.price.toFixed(2)}</div>

                            {pkg.description && (
                                <p className={styles.packageDescription}>{pkg.description}</p>
                            )}

                            <div className={styles.packageDetails}>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>QUANTITY</span>
                                    <span className={styles.detailValue}>{pkg.quantity.toLocaleString()}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>PRICE/1000</span>
                                    <span className={styles.detailValue}>${pkg.price.toFixed(2)}</span>
                                </div>
                            </div>

                            <AddToCartButton
                                pkg={pkg}
                                serviceName={service.name}
                                platformName={platform.name}
                                platformIcon={platform.icon}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
