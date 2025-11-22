'use client';

import { useState, useEffect } from 'react';
import styles from '../management.module.css';
import adminStyles from '../admin.module.css';

interface Currency {
    id: string;
    code: string;
    name: string;
    symbol: string;
    exchangeRate: number;
    isDefault: boolean;
    isActive: boolean;
}

export default function CurrenciesPage() {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);

    // Form state
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [exchangeRate, setExchangeRate] = useState('1.0');
    const [isDefault, setIsDefault] = useState(false);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        fetchCurrencies();
    }, []);

    const fetchCurrencies = async () => {
        try {
            const res = await fetch('/api/admin/currencies');
            if (res.ok) {
                const data = await res.json();
                setCurrencies(data);
            }
        } catch (error) {
            console.error('Failed to fetch currencies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const currencyData = {
            code: code.toUpperCase(),
            name,
            symbol,
            exchangeRate: parseFloat(exchangeRate),
            isDefault,
            isActive,
        };

        try {
            const url = editingCurrency
                ? `/api/admin/currencies/${editingCurrency.id}`
                : '/api/admin/currencies';

            const method = editingCurrency ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currencyData),
            });

            if (res.ok) {
                fetchCurrencies();
                resetForm();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to save currency');
            }
        } catch (error) {
            alert('Failed to save currency');
        }
    };

    const handleEdit = (currency: Currency) => {
        setEditingCurrency(currency);
        setCode(currency.code);
        setName(currency.name);
        setSymbol(currency.symbol);
        setExchangeRate(currency.exchangeRate.toString());
        setIsDefault(currency.isDefault);
        setIsActive(currency.isActive);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this currency?')) return;

        try {
            const res = await fetch(`/api/admin/currencies/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchCurrencies();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to delete currency');
            }
        } catch (error) {
            alert('Failed to delete currency');
        }
    };

    const resetForm = () => {
        setCode('');
        setName('');
        setSymbol('');
        setExchangeRate('1.0');
        setIsDefault(false);
        setIsActive(true);
        setEditingCurrency(null);
        setShowForm(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>💱 Currency Management</h1>
                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        else setShowForm(true);
                    }}
                    className={styles.button}
                >
                    {showForm ? 'Cancel' : '+ Add Currency'}
                </button>
            </div>

            {showForm && (
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>
                        {editingCurrency ? '✏️ Edit Currency' : '➕ Add New Currency'}
                    </h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formRow}>
                            <div className={adminStyles.formGroup}>
                                <label className={adminStyles.formLabel}>
                                    Currency Code <span style={{ color: '#f87171' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    className={adminStyles.formInput}
                                    placeholder="e.g., ZAR, USD, EUR"
                                    required
                                    maxLength={3}
                                    disabled={!!editingCurrency}
                                    style={{ textTransform: 'uppercase' }}
                                />
                            </div>

                            <div className={adminStyles.formGroup}>
                                <label className={adminStyles.formLabel}>
                                    Currency Name <span style={{ color: '#f87171' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={adminStyles.formInput}
                                    placeholder="e.g., South African Rand"
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={adminStyles.formGroup}>
                                <label className={adminStyles.formLabel}>
                                    Symbol <span style={{ color: '#f87171' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={symbol}
                                    onChange={(e) => setSymbol(e.target.value)}
                                    className={adminStyles.formInput}
                                    placeholder="e.g., R, $, €"
                                    required
                                    maxLength={3}
                                />
                            </div>

                            <div className={adminStyles.formGroup}>
                                <label className={adminStyles.formLabel}>
                                    Exchange Rate <span style={{ color: '#f87171' }}>*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.000001"
                                    value={exchangeRate}
                                    onChange={(e) => setExchangeRate(e.target.value)}
                                    className={adminStyles.formInput}
                                    placeholder="1.0"
                                    required
                                />
                                <small style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    Rate relative to base currency (ZAR = 1.0)
                                </small>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                cursor: 'pointer',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                flex: 1
                            }}>
                                <input
                                    type="checkbox"
                                    checked={isDefault}
                                    onChange={(e) => setIsDefault(e.target.checked)}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                                <div>
                                    <span className={adminStyles.formLabel} style={{ margin: 0, display: 'block' }}>
                                        Default Currency
                                    </span>
                                    <small style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        Used as base for conversions
                                    </small>
                                </div>
                            </label>

                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                cursor: 'pointer',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                flex: 1
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
                                        Available for users
                                    </small>
                                </div>
                            </label>
                        </div>

                        <button type="submit" className={styles.button} style={{ marginTop: '1.5rem' }}>
                            {editingCurrency ? '💾 Update Currency' : '✨ Add Currency'}
                        </button>
                    </form>
                </div>
            )}

            <div className={styles.card}>
                <h2 className={styles.cardTitle}>All Currencies ({currencies.length})</h2>
                {loading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : currencies.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>💱 No currencies yet. Add your first currency!</p>
                    </div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Name</th>
                                    <th>Symbol</th>
                                    <th>Exchange Rate</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currencies.map((currency) => (
                                    <tr key={currency.id}>
                                        <td>
                                            <code style={{
                                                background: 'rgba(99, 102, 241, 0.1)',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                color: '#818cf8',
                                                fontWeight: 600
                                            }}>
                                                {currency.code}
                                            </code>
                                        </td>
                                        <td>{currency.name}</td>
                                        <td style={{ fontSize: '1.25rem', fontWeight: 600 }}>{currency.symbol}</td>
                                        <td>{currency.exchangeRate.toFixed(6)}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {currency.isDefault && (
                                                    <span style={{
                                                        padding: '0.25rem 0.75rem',
                                                        background: 'rgba(99, 102, 241, 0.1)',
                                                        color: '#818cf8',
                                                        borderRadius: '6px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                    }}>
                                                        Default
                                                    </span>
                                                )}
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    background: currency.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                                                    color: currency.isActive ? '#10b981' : '#9ca3af',
                                                    borderRadius: '6px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                }}>
                                                    {currency.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleEdit(currency)}
                                                    className={styles.editButton}
                                                >
                                                    Edit
                                                </button>
                                                {!currency.isDefault && (
                                                    <button
                                                        onClick={() => handleDelete(currency.id)}
                                                        className={styles.deleteButton}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
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
