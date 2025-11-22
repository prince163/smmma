'use client';

import { useState, useEffect } from 'react';
import styles from '../management.module.css';

interface Service {
    id: string;
    name: string;
    platformId: string;
    platform?: { name: string };
    _count?: { packages: number };
}

interface Platform {
    id: string;
    name: string;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [name, setName] = useState('');
    const [platformId, setPlatformId] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchServices();
        fetchPlatforms();
    }, []);

    const fetchServices = async () => {
        const res = await fetch('/api/admin/services');
        const data = await res.json();
        setServices(data);
    };

    const fetchPlatforms = async () => {
        const res = await fetch('/api/admin/platforms');
        const data = await res.json();
        setPlatforms(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingId ? `/api/admin/services/${editingId}` : '/api/admin/services';
        const method = editingId ? 'PUT' : 'POST';

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, platformId }),
        });

        setName('');
        setPlatformId('');
        setEditingId(null);
        fetchServices();
    };

    const handleEdit = (service: Service) => {
        setName(service.name);
        setPlatformId(service.platformId);
        setEditingId(service.id);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this service?')) {
            await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
            fetchServices();
        }
    };

    return (
        <div className={styles.managementPage}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Manage Services</h1>
                <p className={styles.pageDescription}>Add and manage services for each platform</p>
            </div>

            <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>
                    {editingId ? 'Edit Service' : 'Add New Service'}
                </h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Service Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={styles.formInput}
                                placeholder="e.g., Followers"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Platform</label>
                            <select
                                value={platformId}
                                onChange={(e) => setPlatformId(e.target.value)}
                                className={styles.formSelect}
                                required
                            >
                                <option value="">Select Platform</option>
                                {platforms.map((platform) => (
                                    <option key={platform.id} value={platform.id}>
                                        {platform.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        {editingId ? 'Update Service' : 'Add Service'}
                    </button>
                </form>
            </div>

            <div className={styles.tableSection}>
                <h2 className={styles.sectionTitle}>Existing Services</h2>
                {services.length > 0 ? (
                    <table className={styles.table}>
                        <thead className={styles.tableHeader}>
                            <tr>
                                <th>Service Name</th>
                                <th>Platform</th>
                                <th>Packages</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tableBody}>
                            {services.map((service) => (
                                <tr key={service.id}>
                                    <td>{service.name}</td>
                                    <td><span className={styles.badge}>{service.platform?.name}</span></td>
                                    <td>{service._count?.packages || 0}</td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            <button
                                                onClick={() => handleEdit(service)}
                                                className={styles.editButton}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service.id)}
                                                className={styles.deleteButton}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <p>No services yet. Add your first service above.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
