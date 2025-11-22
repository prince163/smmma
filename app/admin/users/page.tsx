'use client';

import { useState, useEffect } from 'react';
import styles from '../management.module.css';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    balance: number;
    createdAt: string;
    _count: { orders: number };
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        setUsers(data);
    };

    return (
        <div className={styles.managementPage}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Manage Users</h1>
                <p className={styles.pageDescription}>View and manage all registered users</p>
            </div>

            <div className={styles.tableSection}>
                <h2 className={styles.sectionTitle}>All Users ({users.length})</h2>
                {users.length > 0 ? (
                    <table className={styles.table}>
                        <thead className={styles.tableHeader}>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Balance</th>
                                <th>Orders</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tableBody}>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td style={{ fontWeight: '600' }}>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.375rem 0.75rem',
                                            background: user.role === 'ADMIN'
                                                ? 'rgba(236, 72, 153, 0.2)'
                                                : 'rgba(99, 102, 241, 0.2)',
                                            border: user.role === 'ADMIN'
                                                ? '1px solid rgba(236, 72, 153, 0.3)'
                                                : '1px solid rgba(99, 102, 241, 0.3)',
                                            borderRadius: '20px',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: user.role === 'ADMIN' ? '#f9a8d4' : 'var(--primary-light)',
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: '600', color: 'var(--primary-light)' }}>
                                        ${user.balance.toFixed(2)}
                                    </td>
                                    <td>{user._count.orders}</td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <p>No users found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
