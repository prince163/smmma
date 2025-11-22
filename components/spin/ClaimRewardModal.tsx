'use client';

import { useState } from 'react';
import styles from './spin.module.css';

interface ClaimRewardModalProps {
    spinId: string;
    reward: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ClaimRewardModal({ spinId, reward, onClose, onSuccess }: ClaimRewardModalProps) {
    const [url, setUrl] = useState('');
    const [username, setUsername] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!url.trim()) {
            setError('Please enter a valid URL');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/spin/claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ spinId, url, username }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Failed to claim reward');
                setIsSubmitting(false);
                return;
            }

            const data = await res.json();
            alert(data.message || 'Reward claimed successfully!');
            onSuccess();
        } catch (error) {
            console.error('Error claiming reward:', error);
            setError('Failed to claim reward. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.claimModal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>×</button>

                <div className={styles.claimHeader}>
                    <div className={styles.claimIcon}>🎉</div>
                    <h2>Congratulations!</h2>
                    <p>You won <strong>{reward.rewardLabel}</strong> on {reward.platform}!</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.claimForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="url">Profile/Post URL *</label>
                        <input
                            type="url"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder={`https://${reward.platform.toLowerCase()}.com/...`}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="username">Username (Optional)</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="@yourusername"
                        />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <button
                        type="submit"
                        className={styles.claimButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Claiming...' : 'Claim Reward'}
                    </button>
                </form>

                <div className={styles.claimNote}>
                    <small>Your order will be created automatically and processed within 24-48 hours.</small>
                </div>
            </div>
        </div>
    );
}
