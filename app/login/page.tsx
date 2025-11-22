'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login failed');
                setLoading(false);
                return;
            }

            // Redirect based on role
            if (data.user.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <div className="animated-bg"></div>

            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <div className={styles.logoSection}>
                        <div className={styles.logo}>SMM Panel</div>
                        <h1 className={styles.authTitle}>Welcome Back</h1>
                        <p className={styles.authSubtitle}>Sign in to your account to continue</p>
                    </div>

                    {error && (
                        <div className={styles.errorMessage}>{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.authForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.formLabel}>Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.formInput}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password" className={styles.formLabel}>Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.formInput}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className={styles.authFooter}>
                        <p>Don't have an account?</p>
                        <Link href="/register" className={styles.authLink}>
                            Create an account →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
