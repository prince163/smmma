'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../management.module.css';

interface User {
    id: string;
    name: string;
    email: string;
    balance: number;
    createdAt: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (!res.ok) {
                router.push('/login');
                return;
            }
            const data = await res.json();
            setUser(data);
            setName(data.name);
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement profile update API
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        // TODO: Implement password change API
        alert('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    if (loading) {
        return (
            <div className={styles.managementPage}>
                <div className={styles.emptyState}>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.managementPage}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>👤 Profile</h1>
                <p className={styles.pageDescription}>Manage your account settings</p>
            </div>

            {saved && (
                <div style={{
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                    color: '#86efac',
                    padding: '1rem',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                }}>
                    ✓ Profile updated successfully!
                </div>
            )}

            <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Account Information</h2>
                <p className={styles.sectionDescription}>
                    View and update your account details
                </p>

                <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                        }}>
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '12px',
                                color: 'var(--text-secondary)',
                                fontSize: '1rem',
                                cursor: 'not-allowed',
                            }}
                        />
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            Email cannot be changed
                        </p>
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                        }}>
                            Member Since
                        </label>
                        <input
                            type="text"
                            value={user ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) : ''}
                            disabled
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '12px',
                                color: 'var(--text-secondary)',
                                fontSize: '1rem',
                                cursor: 'not-allowed',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: '1.25rem 2.5rem',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: '700',
                            fontSize: '1.125rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                        }}
                    >
                        💾 Save Changes
                    </button>
                </form>
            </div>

            <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Change Password</h2>
                <p className={styles.sectionDescription}>
                    Update your password to keep your account secure
                </p>

                <form onSubmit={handleChangePassword} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                        }}>
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                        }}>
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                        }}>
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: '1.25rem 2.5rem',
                            background: 'linear-gradient(135deg, var(--secondary) 0%, #be185d 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: '700',
                            fontSize: '1.125rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
                        }}
                    >
                        🔒 Change Password
                    </button>
                </form>
            </div>
        </div>
    );
}
