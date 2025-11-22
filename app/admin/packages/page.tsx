'use client';

import { useState, useEffect } from 'react';
import styles from '../management.module.css';
import adminStyles from '../admin.module.css';

interface Package {
    id: string;
    name: string;
    description: string | null;
    price: number;
    quantity: number;
    service: {
        id: string;
        name: string;
        platform: {
            name: string;
            icon: string;
        };
    };
}

interface Service {
    id: string;
    name: string;
    platformId: string;
}

export default function PackagesPage() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        serviceId: '',
    });

    useEffect(() => {
        fetchPackages();
        fetchServices();
    }, []);

    const fetchPackages = async () => {
        const res = await fetch('/api/admin/packages');
        if (res.ok) {
            const data = await res.json();
            setPackages(data);
        }
        setLoading(false);
    };

    const fetchServices = async () => {
        const res = await fetch('/api/admin/services');
        if (res.ok) {
            const data = await res.json();
            setServices(data);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingId ? `/api/admin/packages/${editingId}` : '/api/admin/packages';
        const method = editingId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            fetchPackages();
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', description: '', price: '', quantity: '', serviceId: '' });
        }
    };

    const handleEdit = (pkg: Package) => {
        setFormData({
            name: pkg.name,
            description: pkg.description || '',
            price: pkg.price.toString(),
            quantity: pkg.quantity.toString(),
            serviceId: pkg.service.id || '',
        });
        setEditingId(pkg.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this package?')) return;

        const res = await fetch(`/api/admin/packages/${id}`, { method: 'DELETE' });
        if (res.ok) {
            fetchPackages();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>📦 Packages</h1>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingId(null);
                        setFormData({ name: '', description: '', price: '', quantity: '', serviceId: '' });
                    }}
                    className={styles.button}
                >
                    {showForm ? 'Cancel' : '+ Add Package'}
                </button>
            </div>

            {showForm && (
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>{editingId ? 'Edit Package' : 'New Package'}</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>Service</label>
                            <select
                                value={formData.serviceId}
                                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                required
                                style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)' }}
                            >
                                <option value="" style={{ background: '#1a1a2e', color: '#fff' }}>Select Service</option>
                                {services.map((s: any) => (
                                    <option key={s.id} value={s.id} style={{ background: '#1a1a2e', color: '#fff' }}>
                                        {s.platform.icon} {s.platform.name} - {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Package Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., 1000 Followers"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description"
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Price (per 1000)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="5.00"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Fixed Quantity</label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    placeholder="1000"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className={styles.button}>
                            {editingId ? 'Update Package' : 'Create Package'}
                        </button>
                    </form>
                </div>
            )}

            <div className={styles.card}>
                <h2 className={styles.cardTitle}>All Packages ({packages.length})</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Platform</th>
                                <th>Service</th>
                                <th>Package Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.map((pkg) => (
                                <tr key={pkg.id}>
                                    <td>
                                        <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>
                                            {pkg.service.platform.icon}
                                        </span>
                                        {pkg.service.platform.name}
                                    </td>
                                    <td>{pkg.service.name}</td>
                                    <td>
                                        <strong>{pkg.name}</strong>
                                        {pkg.description && (
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                {pkg.description}
                                            </div>
                                        )}
                                    </td>
                                    <td>{pkg.quantity.toLocaleString()}</td>
                                    <td>${pkg.price.toFixed(2)}</td>
                                    <td>
                                        <button
                                            onClick={() => handleEdit(pkg)}
                                            className={styles.editButton}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pkg.id)}
                                            className={styles.deleteButton}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
