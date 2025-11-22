'use client';

import { useState, useEffect } from 'react';
import SpinModal from './SpinModal';
import styles from './spin.module.css';

export default function FloatingSpinIcon() {
    const [isOpen, setIsOpen] = useState(false);
    const [canSpin, setCanSpin] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkSpinStatus();
        const interval = setInterval(checkSpinStatus, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    const checkSpinStatus = async () => {
        try {
            const res = await fetch('/api/spin/status');
            if (res.ok) {
                const data = await res.json();
                setCanSpin(data.canSpin);
                setTimeRemaining({
                    hours: data.hoursRemaining || 0,
                    minutes: data.minutesRemaining || 0,
                });
            }
        } catch (error) {
            console.error('Error checking spin status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClick = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        checkSpinStatus(); // Refresh status after closing
    };

    if (isLoading) return null;

    return (
        <>
            <div className={styles.floatingIcon} onClick={handleClick}>
                <div className={`${styles.iconContent} ${canSpin ? styles.canSpin : ''}`}>
                    <div className={styles.iconEmoji}>🎰</div>
                    <div className={styles.iconText}>Daily Spin</div>
                    {!canSpin && (
                        <div className={styles.countdown}>
                            {timeRemaining.hours}h {timeRemaining.minutes}m
                        </div>
                    )}
                </div>
                {canSpin && <div className={styles.pulseRing}></div>}
            </div>

            {isOpen && <SpinModal onClose={handleClose} canSpin={canSpin} />}
        </>
    );
}
