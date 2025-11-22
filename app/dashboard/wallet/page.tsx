'use client';
'use client';

import { useState } from 'react';
import styles from '../management.module.css';
import dashboardStyles from '../dashboard.module.css';

export default function WalletPage() {
    const [amount, setAmount] = useState('');
    const [selectedGateway, setSelectedGateway] = useState('');

    const handleTopUp = () => {
        if (!amount || !selectedGateway) {
            alert('Please enter amount and select a payment gateway');
            return;
        }
        // TODO: Implement payment gateway integration
        alert(`Processing $${amount} payment via ${selectedGateway}`);
    };

    const gateways = [
        { id: 'yoco', name: 'Yoco', icon: '💳', desc: 'Credit/Debit Card' },
        { id: 'zapper', name: 'Zapper', icon: '📱', desc: 'QR Code Payment' },
        { id: 'paygenius', name: 'PayGenius', icon: '🏦', desc: 'Bank Transfer' },
    ];

    return (
        <div className={styles.managementPage}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>💰 Wallet</h1>
                <p className={styles.pageDescription}>Add funds to your account</p>
            </div>

            <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Top Up Balance</h2>
                <p className={styles.sectionDescription}>
                    Add funds to your wallet to place orders
                </p>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div className={dashboardStyles.formGroup}>
                        <label className={dashboardStyles.formLabel}>Amount (USD)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={dashboardStyles.formInput}
                            placeholder="Enter amount"
                            min="1"
                            step="0.01"
                            style={{
                                fontSize: '1.25rem',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '2px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                            }}
                        />
                    </div>

                    <div>
                        <label className={dashboardStyles.formLabel} style={{ marginBottom: '1rem', display: 'block' }}>
                            Select Payment Method
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            {gateways.map((gateway) => (
                                <button
                                    key={gateway.id}
                                    onClick={() => setSelectedGateway(gateway.id)}
                                    style={{
                                        padding: '1.5rem',
                                        background: selectedGateway === gateway.id
                                            ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)'
                                            : 'rgba(255, 255, 255, 0.03)',
                                        border: selectedGateway === gateway.id
                                            ? '2px solid var(--primary-light)'
                                            : '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        textAlign: 'left',
                                    }}
                                >
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{gateway.icon}</div>
                                    <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                        {gateway.name}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {gateway.desc}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleTopUp}
                    style={{
                        width: '100%',
                        padding: '1.25rem 2.5rem',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '700',
                        fontSize: '1.125rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        marginTop: '2rem',
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                    }}
                >
                    💰 Add Funds
                </button>
            </div>

            <div className={styles.tableSection}>
                <h2 className={styles.sectionTitle}>Quick Top-Up Options</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '1rem',
                    marginTop: '1.5rem',
                }}>
                    {[10, 25, 50, 100, 250, 500].map((value) => (
                        <button
                            key={value}
                            onClick={() => setAmount(value.toString())}
                            style={{
                                padding: '1.5rem',
                                background: amount === value.toString()
                                    ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)'
                                    : 'rgba(255, 255, 255, 0.03)',
                                border: amount === value.toString()
                                    ? '2px solid var(--primary-light)'
                                    : '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '16px',
                                color: 'var(--text-primary)',
                                fontWeight: '700',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            ${value}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.tableSection}>
                <h2 className={styles.sectionTitle}>Transaction History</h2>
                <div className={styles.emptyState}>
                    <p>💳 No transactions yet. Your top-up history will appear here.</p>
                </div>
            </div>
        </div>
    );
}
