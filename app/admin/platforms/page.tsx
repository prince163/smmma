'use client';

import { useState, useEffect } from 'react';
import styles from '../management.module.css';

interface Platform {
    id: string;
    name: string;
    slug: string;
    icon: string;
    _count?: { services: number };
}

export default function PlatformsPage() {
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [icon, setIcon] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchPlatforms();
    }, []);

    const fetchPlatforms = async () => {
        const res = await fetch('/api/admin/platforms');
        const data = await res.json();
        setPlatforms(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingId ? `/api/admin/platforms/${editingId}` : '/api/admin/platforms';
        const method = editingId ? 'PUT' : 'POST';

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, slug, icon }),
        });

        setName('');
        setSlug('');
        setIcon('');
        setEditingId(null);
        fetchPlatforms();
    };

    const handleEdit = (platform: Platform) => {
        setName(platform.name);
        setSlug(platform.slug);
        setIcon(platform.icon);
        setEditingId(platform.id);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this platform?')) {
            await fetch(`/api/admin/platforms/${id}`, { method: 'DELETE' });
            fetchPlatforms();
        }
    };

    return (
        <div className={styles.managementPage}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Manage Platforms</h1>
                <p className={styles.pageDescription}>Add and manage social media platforms</p>
            </div>

            <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>
                    {editingId ? 'Edit Platform' : 'Add New Platform'}
                </h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Platform Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={styles.formInput}
                                placeholder="e.g., Instagram"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Slug</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className={styles.formInput}
                                placeholder="e.g., instagram"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Icon (Emoji)</label>
                            <input
                                type="text"
                                value={icon}
                                onChange={(e) => setIcon(e.target.value)}
                                className={styles.formInput}
                                placeholder="e.g., 📷"
                            />
                        </div>
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        {editingId ? 'Update Platform' : 'Add Platform'}
                    </button>
                </form>
            </div>

            <div className={styles.tableSection}>
                <h2 className={styles.sectionTitle}>Existing Platforms</h2>
                {platforms.length > 0 ? (
                    <table className={styles.table}>
                        <thead className={styles.tableHeader}>
                            <tr>
                                <th>Icon</th>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Services</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tableBody}>
                            {platforms.map((platform) => (
                                <tr key={platform.id}>
                                    <td className={styles.iconCell}>{platform.icon}</td>
                                    <td>{platform.name}</td>
                                    <td><span className={styles.badge}>{platform.slug}</span></td>
                                    <td>{platform._count?.services || 0}</td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            <button
                                                onClick={() => handleEdit(platform)}
                                                className={styles.editButton}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(platform.id)}
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
                        <p>No platforms yet. Add your first platform above.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
