'use client';

import { useState } from 'react';
import CSVImporter from '@/components/admin/CSVImporter';
import styles from './import.module.css';

type TabType = 'platforms' | 'services' | 'packages';

export default function ImportPage() {
    const [activeTab, setActiveTab] = useState<TabType>('platforms');

    const handleImportComplete = (results: any) => {
        console.log('Import completed:', results);
        // Could add toast notification here
    };

    return (
        <div className={styles.importPage}>
            <div className={styles.header}>
                <h1>📥 CSV Import</h1>
                <p>Bulk import platforms, services, and packages from CSV files</p>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'platforms' ? styles.active : ''}`}
                    onClick={() => setActiveTab('platforms')}
                >
                    🌐 Platforms
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'services' ? styles.active : ''}`}
                    onClick={() => setActiveTab('services')}
                >
                    ⚙️ Services
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'packages' ? styles.active : ''}`}
                    onClick={() => setActiveTab('packages')}
                >
                    📦 Packages
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === 'platforms' && (
                    <div className={styles.tabContent}>
                        <div className={styles.info}>
                            <h3>Import Platforms</h3>
                            <p>
                                Upload a CSV file to import social media platforms. The CSV should include:
                                <strong> name, slug, icon</strong>
                            </p>
                            <div className={styles.example}>
                                <strong>Example:</strong>
                                <code>Facebook,facebook,📘</code>
                            </div>
                            <div className={styles.note}>
                                ⚠️ Note: The slug must be unique and URL-friendly (lowercase, no spaces).
                            </div>
                        </div>
                        <CSVImporter entityType="platforms" onImportComplete={handleImportComplete} />
                    </div>
                )}

                {activeTab === 'services' && (
                    <div className={styles.tabContent}>
                        <div className={styles.info}>
                            <h3>Import Services</h3>
                            <p>
                                Upload a CSV file to import services. The CSV should include:
                                <strong> platformSlug, name</strong>
                            </p>
                            <div className={styles.example}>
                                <strong>Example:</strong>
                                <code>facebook,Followers</code>
                            </div>
                            <div className={styles.note}>
                                ⚠️ Note: The platform must exist before importing services. Use the platform's slug.
                            </div>
                        </div>
                        <CSVImporter entityType="services" onImportComplete={handleImportComplete} />
                    </div>
                )}

                {activeTab === 'packages' && (
                    <div className={styles.tabContent}>
                        <div className={styles.info}>
                            <h3>Import Packages</h3>
                            <p>
                                Upload a CSV file to import packages. The CSV should include:
                                <strong> platformSlug, serviceName, name, quantity, price, description, minQuantity, maxQuantity</strong>
                            </p>
                            <div className={styles.example}>
                                <strong>Example:</strong>
                                <code>facebook,Followers,Starter Pack,1000,9.99,1000 followers,500,5000</code>
                            </div>
                            <div className={styles.note}>
                                ⚠️ Note: Both platform and service must exist before importing packages. Use the platform's slug.
                            </div>
                        </div>
                        <CSVImporter entityType="packages" onImportComplete={handleImportComplete} />
                    </div>
                )}
            </div>
        </div>
    );
}
