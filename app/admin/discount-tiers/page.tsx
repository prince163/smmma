'use client';

import { useState, useEffect } from 'react';
import styles from '../management.module.css';
import adminStyles from '../admin.module.css';

interface DiscountTier {
    id: string;
    name: string;
    minQuantity: number;
    discountPercent: number;
    isActive: boolean;
}

export default function DiscountTiersPage() {
    const [tiers, setTiers] = useState<DiscountTier[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTier, setEditingTier] = useState<DiscountTier | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [minQuantity, setMinQuantity] = useState('');
    const [discountPercent, setDiscountPercent] = useState('');
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        fetchTiers();
    }, []);

    const fetchTiers = async () => {
        try {
            const res = await fetch('/api/admin/discount-tiers');
            if (res.ok) {
                const data = await res.json();
                setTiers(data);
            }
        } catch (error) {
            console.error('Failed to fetch discount tiers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const tierData = {
            name,
            minQuantity: parseInt(minQuantity),
            discountPercent: parseFloat(discountPercent),
            isActive,
        };

        try {
            const url = editingTier
                ? `/api/admin/discount-tiers/${editingTier.id}`
                : '/api/admin/discount-tiers';

            const method = editingTier ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tierData),
            });

            if (res.ok) {
                fetchTiers();
                resetForm();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to save discount tier');
            }
        } catch (error) {
            alert('Failed to save discount tier');
        }
    };

    const handleEdit = (tier: DiscountTier) => {
        setEditingTier(tier);
        setName(tier.name);
        setMinQuantity(tier.minQuantity.toString());
        setDiscountPercent(tier.discountPercent.toString());
        setIsActive(tier.isActive);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this discount tier?')) return;

        try {
            const res = await fetch(`/api/admin/discount-tiers/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchTiers();
            }
        } catch (error) {
            alert('Failed to delete discount tier');
        }
    };

    const resetForm = () => {
        setName('');
        setMinQuantity('');
        setDiscountPercent('');
        setIsActive(true);
        setEditingTier(null);
        setShowForm(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>🎯 Discount Tiers</h1>
                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        else setShowForm(true);
                    }}
                    className={styles.button}
                >
                    {showForm ? 'Cancel' : '+ Add Tier'}
                </button>
            </div>

            <div className={styles.card} style={{ marginBottom: '2rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                    💡 <strong>Global Discount System:</strong> These tiers apply automatically to ALL platforms and services based on quantity purchased.
                    When a user orders a certain quantity, they automatically get the highest applicable discount.
                </p>
            </div>

            {showForm && (
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>
                        {editingTier ? '✏️ Edit Discount Tier' : '➕ Add New Tier'}
                    </h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formRow}>
                            <div className={adminStyles.formGroup}>
                                <label className={adminStyles.formLabel}>
                                    Tier Name <span style={{ color: '#f87171' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={adminStyles.formInput}
                                    placeholder="e.g., Bronze, Silver, Gold"
                                    required
                                />
                            </div>

                            <div className={adminStyles.formGroup}>
                                <label className={adminStyles.formLabel}>
                                    Minimum Quantity <span style={{ color: '#f87171' }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    value={minQuantity}
                                    onChange={(e) => setMinQuantity(e.target.value)}
                                    className={adminStyles.formInput}
                                    placeholder="e.g., 5000"
                                    required
                                    min="1"
                                />
                                <small style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'block', marginTop: '0.5rem' }}>
                                    Minimum quantity to trigger this discount
                                </small>
                            </div>
                        </div>

                        <div className={adminStyles.formGroup}>
                            <label className={adminStyles.formLabel}>
                                Discount Percentage <span style={{ color: '#f87171' }}>*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={discountPercent}
                                onChange={(e) => setDiscountPercent(e.target.value)}
                                className={adminStyles.formInput}
                                placeholder="e.g., 5, 10, 15"
                                required
                                min="0"
                                max="100"
                            />
                            <small style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'block', marginTop: '0.5rem' }}>
                                Percentage discount (0-100%)
                            </small>
                        </div>

                        <div className={adminStyles.formGroup}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                cursor: 'pointer',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                                <div>
                                    <span className={adminStyles.formLabel} style={{ margin: 0, display: 'block' }}>
                                        Active
                                    </span>
                                    <small style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        {isActive ? 'Tier is active and will be applied' : 'Tier is disabled'}
                                    </small>
                                </div>
                            </label>
                        </div>

                        <button type="submit" className={styles.button} style={{ marginTop: '1.5rem' }}>
                            {editingTier ? '💾 Update Tier' : '✨ Create Tier'}
                        </button>
                    </form>
                </div>
            )}

            <div className={styles.card}>
                <h2 className={styles.cardTitle}>All Discount Tiers ({tiers.length})</h2>
                {loading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : tiers.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>🎯 No discount tiers yet. Create your first tier!</p>
                    </div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Tier Name</th>
                                    <th>Min Quantity</th>
                                    <th>Discount %</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tiers.map((tier) => (
                                    <tr key={tier.id}>
                                        <td style={{ fontWeight: 600 }}>{tier.name}</td>
                                        <td>{tier.minQuantity.toLocaleString()}</td>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                background: 'rgba(16, 185, 129, 0.1)',
                                                color: '#10b981',
                                                borderRadius: '6px',
                                                fontSize: '0.875rem',
                                                fontWeight: 600,
                                            }}>
                                                {tier.discountPercent}%
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                background: tier.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                                                color: tier.isActive ? '#10b981' : '#9ca3af',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                            }}>
                                                {tier.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleEdit(tier)}
                                                    className={styles.editButton}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tier.id)}
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
                    </div>
                )}
            </div>
        </div>
    );
}
