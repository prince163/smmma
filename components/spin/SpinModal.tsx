'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SpinWheel from './SpinWheel';
import ClaimRewardModal from './ClaimRewardModal';
import styles from './spin.module.css';

interface SpinModalProps {
    onClose: () => void;
    canSpin: boolean;
}

export default function SpinModal({ onClose, canSpin }: SpinModalProps) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [config, setConfig] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [spinResult, setSpinResult] = useState<any>(null);
    const [showClaimModal, setShowClaimModal] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                setIsAuthenticated(true);
                fetchConfig();
            } else {
                setIsAuthenticated(false);
                setIsLoading(false);
            }
        } catch (error) {
            setIsAuthenticated(false);
            setIsLoading(false);
        }
    };

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/spin/config');
            if (res.ok) {
                const data = await res.json();
                setConfig(data);
            }
        } catch (error) {
            console.error('Error fetching config:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSpinComplete = (result: any) => {
        setSpinResult(result);
        if (result.requiresClaim && result.rewardType === 'SERVICE') {
            setTimeout(() => setShowClaimModal(true), 1500);
        }
    };

    const handleClaimSuccess = () => {
        setShowClaimModal(false);
        onClose();
    };

    const handleLoginRedirect = () => {
        router.push('/login?redirect=/');
    };

    if (isAuthenticated === false) {
        return (
            <div className={styles.modalOverlay} onClick={onClose}>
                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                    <div className={styles.loginPrompt}>
                        <h2>🎰 Login Required</h2>
                        <p>You need to be logged in to spin the wheel!</p>
                        <button className={styles.loginBtn} onClick={handleLoginRedirect}>
                            Login / Register
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading || !config) {
        return (
            <div className={styles.modalOverlay} onClick={onClose}>
                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                    <div className={styles.loading}>Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={styles.modalOverlay} onClick={onClose}>
                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>

                    <div className={styles.header}>
                        <h2 className={styles.title}>{config.popupTitle}</h2>
                        <p className={styles.subtitle}>{config.popupSubtitle}</p>
                    </div>

                    <SpinWheel
                        config={config}
                        canSpin={canSpin}
                        onSpinComplete={handleSpinComplete}
                    />

                    {spinResult && (
                        <div className={styles.resultDisplay}>
                            <div className={styles.resultIcon}>{spinResult.rewardType === 'NONE' ? '😔' : '🎉'}</div>
                            <div className={styles.resultText}>{spinResult.rewardLabel}</div>
                            {spinResult.discountCode && (
                                <div className={styles.discountCode}>
                                    Code: <strong>{spinResult.discountCode}</strong>
                                </div>
                            )}
                        </div>
                    )}

                    <div className={styles.rules}>
                        <h4>Rules & Terms</h4>
                        <p>{config.rulesText}</p>
                    </div>
                </div>
            </div>

            {showClaimModal && spinResult && (
                <ClaimRewardModal
                    spinId={spinResult.spinId}
                    reward={spinResult}
                    onClose={() => setShowClaimModal(false)}
                    onSuccess={handleClaimSuccess}
                />
            )}
        </>
    );
}
