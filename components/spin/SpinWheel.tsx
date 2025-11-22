'use client';

import { useState } from 'react';
import styles from './spin.module.css';

interface SpinWheelProps {
    config: any;
    canSpin: boolean;
    onSpinComplete: (result: any) => void;
}

export default function SpinWheel({ config, canSpin, onSpinComplete }: SpinWheelProps) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);

    const handleSpin = async () => {
        if (!canSpin || isSpinning) return;

        setIsSpinning(true);

        try {
            const res = await fetch('/api/spin/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ configId: config.configId }),
            });

            if (!res.ok) {
                const error = await res.json();
                alert(error.error || 'Failed to spin');
                setIsSpinning(false);
                return;
            }

            const result = await res.json();

            // Calculate rotation to land on winning slot
            const winningSlot = config.slots.find((s: any) => s.id === result.result.slotId);
            const slotIndex = config.slots.indexOf(winningSlot);
            const degreesPerSlot = 360 / config.slots.length;
            const targetRotation = 360 * 5 + (slotIndex * degreesPerSlot); // 5 full rotations + target

            setRotation(targetRotation);

            // Wait for animation to complete
            setTimeout(() => {
                setIsSpinning(false);
                onSpinComplete({
                    ...result.result,
                    spinId: result.spinId,
                });
            }, 4000);
        } catch (error) {
            console.error('Error spinning:', error);
            setIsSpinning(false);
            alert('Failed to spin. Please try again.');
        }
    };

    const slotCount = config.slots.length;
    const degreesPerSlot = 360 / slotCount;

    return (
        <div className={styles.wheelContainer}>
            <div className={styles.wheelPointer}>▼</div>

            <div
                className={styles.wheel}
                style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                }}
            >
                {config.slots.map((slot: any, index: number) => {
                    const rotation = index * degreesPerSlot;
                    return (
                        <div
                            key={slot.id}
                            className={styles.wheelSlot}
                            style={{
                                transform: `rotate(${rotation}deg)`,
                                background: slot.color || '#6366f1',
                            }}
                        >
                            <div className={styles.slotContent}>
                                <div className={styles.slotIcon}>{slot.icon}</div>
                                <div className={styles.slotLabel}>{slot.label}</div>
                            </div>
                        </div>
                    );
                })}

                <div className={styles.wheelCenter}>
                    <div className={styles.centerIcon}>🎰</div>
                </div>
            </div>

            <button
                className={styles.spinButton}
                onClick={handleSpin}
                disabled={!canSpin || isSpinning}
            >
                {isSpinning ? 'Spinning...' : canSpin ? 'SPIN NOW!' : 'Come Back Later'}
            </button>
        </div>
    );
}
