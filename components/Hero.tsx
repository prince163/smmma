import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.heroContent}>
                <div className={styles.badge}>
                    ✨ AI-Powered Social Media Growth
                </div>

                <h1 className={styles.title}>
                    Boost Your <span className={styles.gradient}>Social Presence</span> with Smart Tools
                </h1>

                <p className={styles.subtitle}>
                    Enhance your digital visibility with our AI-driven platform. Professional tools designed to help you grow across all major social media platforms.
                </p>

                <div className={styles.ctaButtons}>
                    <Link href="/services" className="btn btn-primary">
                        Explore Services
                    </Link>
                    <Link href="/how-it-works" className="btn btn-secondary">
                        How It Works
                    </Link>
                </div>
            </div>

            <div className={styles.floatingElements}>
                <div className={styles.floatingElement}></div>
                <div className={styles.floatingElement}></div>
                <div className={styles.floatingElement}></div>
            </div>
        </section>
    );
}
