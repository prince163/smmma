'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './spin-history.module.css';

export default function SpinHistoryPage() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [spins, setSpins] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        checkAuthAndFetch();
    }, [page]);

    const checkAuthAndFetch = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                setIsAuthenticated(true);
                fetchHistory();
            } else {
                setIsAuthenticated(false);
                setIsLoading(false);
            }
        } catch (error) {
            setIsAuthenticated(false);
            setIsLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await fetch(`/api/spin/history?page=${page}&limit=20`);
            if (res.ok) {
                const data = await res.json();
                setSpins(data.spins);
                setTotalPages(data.pages);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { label: string; className: string }> = {
            WON_CLAIMED: { label: 'Claimed', className: styles.statusClaimed },
            WON_PENDING: { label: 'Pending Claim', className: styles.statusPending },
            EXPIRED: { label: 'Expired', className: styles.statusExpired },
            TRY_AGAIN: { label: 'Try Again', className: styles.statusTryAgain },
        };
        const badge = badges[status] || { label: status, className: '' };
        return <span className={`${styles.statusBadge} ${badge.className}`}>{badge.label}</span>;
    };

    if (isAuthenticated === false) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <h2>Login Required</h2>
                    <p>Please log in to view your spin history.</p>
                    <Link href="/login" className={styles.loginLink}>
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>🎰 Spin & Win History</h1>
                <p>View all your spin results and claim pending rewards</p>
            </div>

            {spins.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🎲</div>
                    <h3>No Spins Yet</h3>
                    <p>You haven't spun the wheel yet. Go to the homepage and try your luck!</p>
                    <Link href="/" className={styles.homeLink}>
                        Go to Homepage
                    </Link>
                </div>
            ) : (
                <>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Date & Time</th>
                                    <th>Platform</th>
                                    <th>Reward</th>
                                    <th>Status</th>
                                    <th>Order</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {spins.map((spin) => (
                                    <tr key={spin.id}>
                                        <td>{new Date(spin.spunAt).toLocaleString()}</td>
                                        <td>
                                            <span className={styles.platform}>{spin.platform}</span>
                                        </td>
                                        <td>
                                            <div className={styles.reward}>
                                                <div className={styles.rewardLabel}>{spin.rewardLabel}</div>
                                                {spin.discountCode && (
                                                    <div className={styles.discountCode}>Code: {spin.discountCode}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td>{getStatusBadge(spin.status)}</td>
                                        <td>
                                            {spin.order ? (
                                                <Link href={`/dashboard/orders`} className={styles.orderLink}>
                                                    View Order
                                                </Link>
                                            ) : (
                                                <span className={styles.noOrder}>-</span>
                                            )}
                                        </td>
                                        <td>
                                            {spin.canClaim && (
                                                <button className={styles.claimBtn}>
                                                    Claim Now
                                                </button>
                                            )}
                                            {spin.status === 'EXPIRED' && (
                                                <span className={styles.expiredText}>Expired</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className={styles.pageBtn}
                            >
                                Previous
                            </button>
                            <span className={styles.pageInfo}>
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className={styles.pageBtn}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
