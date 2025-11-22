'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './install.module.css';

interface InstallStep {
    step: number;
    title: string;
}

const steps: InstallStep[] = [
    { step: 1, title: 'Requirements Check' },
    { step: 2, title: 'Database Configuration' },
    { step: 3, title: 'Admin Account' },
    { step: 4, title: 'Finalize' }
];

export default function InstallPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [requirements, setRequirements] = useState<any>(null);

    // Database config
    const [dbConfig, setDbConfig] = useState({
        host: 'localhost',
        port: '3306',
        database: '',
        username: '',
        password: ''
    });

    // Admin config
    const [adminConfig, setAdminConfig] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // Site config
    const [siteConfig, setSiteConfig] = useState({
        siteName: 'Lets Grow',
        siteUrl: typeof window !== 'undefined' ? window.location.origin : '',
        signupBonus: '10.00'
    });

    // Check requirements on mount
    useState(() => {
        checkRequirements();
    });

    const checkRequirements = async () => {
        try {
            const res = await fetch('/api/install/check');
            const data = await res.json();
            setRequirements(data);
        } catch (err) {
            setError('Failed to check requirements');
        }
    };

    const testDatabase = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/install/test-db', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dbConfig)
            });
            const data = await res.json();

            if (data.success) {
                alert('✅ Database connection successful!');
            } else {
                setError(data.error || 'Database connection failed');
            }
        } catch (err) {
            setError('Failed to test database connection');
        } finally {
            setLoading(false);
        }
    };

    const handleInstall = async () => {
        setLoading(true);
        setError('');

        try {
            // Validate admin password
            if (adminConfig.password !== adminConfig.confirmPassword) {
                setError('Passwords do not match');
                setLoading(false);
                return;
            }

            if (adminConfig.password.length < 8) {
                setError('Password must be at least 8 characters');
                setLoading(false);
                return;
            }

            // Run installation
            const res = await fetch('/api/install/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    database: dbConfig,
                    admin: adminConfig,
                    site: siteConfig
                })
            });

            const data = await res.json();

            if (data.success) {
                setCurrentStep(4);
            } else {
                setError(data.error || 'Installation failed');
            }
        } catch (err) {
            setError('Installation failed. Please check your configuration.');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className={styles.stepContent}>
                        <h2>System Requirements Check</h2>
                        {requirements ? (
                            <div className={styles.requirements}>
                                <div className={requirements.node ? styles.reqPass : styles.reqFail}>
                                    <span className={styles.icon}>{requirements.node ? '✅' : '❌'}</span>
                                    <span>Node.js {requirements.nodeVersion || 'Not detected'}</span>
                                    <span className={styles.reqNote}>Required: 18.0.0+</span>
                                </div>
                                <div className={requirements.writable ? styles.reqPass : styles.reqFail}>
                                    <span className={styles.icon}>{requirements.writable ? '✅' : '❌'}</span>
                                    <span>File System Writable</span>
                                    <span className={styles.reqNote}>Required for .env file</span>
                                </div>
                                <div className={requirements.prisma ? styles.reqPass : styles.reqFail}>
                                    <span className={styles.icon}>{requirements.prisma ? '✅' : '❌'}</span>
                                    <span>Prisma CLI Available</span>
                                    <span className={styles.reqNote}>Required for database setup</span>
                                </div>
                            </div>
                        ) : (
                            <p>Checking requirements...</p>
                        )}

                        {requirements && requirements.node && requirements.writable && requirements.prisma && (
                            <button
                                className={styles.btnPrimary}
                                onClick={() => setCurrentStep(2)}
                            >
                                Continue to Database Setup
                            </button>
                        )}
                    </div>
                );

            case 2:
                return (
                    <div className={styles.stepContent}>
                        <h2>Database Configuration</h2>
                        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                            <div className={styles.formGroup}>
                                <label>Database Host</label>
                                <input
                                    type="text"
                                    value={dbConfig.host}
                                    onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                                    placeholder="localhost"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Database Port</label>
                                <input
                                    type="text"
                                    value={dbConfig.port}
                                    onChange={(e) => setDbConfig({ ...dbConfig, port: e.target.value })}
                                    placeholder="3306"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Database Name</label>
                                <input
                                    type="text"
                                    value={dbConfig.database}
                                    onChange={(e) => setDbConfig({ ...dbConfig, database: e.target.value })}
                                    placeholder="letsgrow_db"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Database Username</label>
                                <input
                                    type="text"
                                    value={dbConfig.username}
                                    onChange={(e) => setDbConfig({ ...dbConfig, username: e.target.value })}
                                    placeholder="root"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Database Password</label>
                                <input
                                    type="password"
                                    value={dbConfig.password}
                                    onChange={(e) => setDbConfig({ ...dbConfig, password: e.target.value })}
                                    placeholder="Enter database password"
                                />
                            </div>

                            <div className={styles.buttonGroup}>
                                <button
                                    type="button"
                                    className={styles.btnSecondary}
                                    onClick={testDatabase}
                                    disabled={loading || !dbConfig.database || !dbConfig.username}
                                >
                                    {loading ? 'Testing...' : 'Test Connection'}
                                </button>
                                <button
                                    type="button"
                                    className={styles.btnPrimary}
                                    onClick={() => setCurrentStep(3)}
                                    disabled={!dbConfig.database || !dbConfig.username}
                                >
                                    Continue
                                </button>
                            </div>
                        </form>
                    </div>
                );

            case 3:
                return (
                    <div className={styles.stepContent}>
                        <h2>Create Admin Account</h2>
                        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                            <div className={styles.formGroup}>
                                <label>Admin Name</label>
                                <input
                                    type="text"
                                    value={adminConfig.name}
                                    onChange={(e) => setAdminConfig({ ...adminConfig, name: e.target.value })}
                                    placeholder="Admin"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Admin Email</label>
                                <input
                                    type="email"
                                    value={adminConfig.email}
                                    onChange={(e) => setAdminConfig({ ...adminConfig, email: e.target.value })}
                                    placeholder="admin@letsgrow.me"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={adminConfig.password}
                                    onChange={(e) => setAdminConfig({ ...adminConfig, password: e.target.value })}
                                    placeholder="Min 8 characters"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    value={adminConfig.confirmPassword}
                                    onChange={(e) => setAdminConfig({ ...adminConfig, confirmPassword: e.target.value })}
                                    placeholder="Confirm password"
                                    required
                                />
                            </div>

                            <h3 style={{ marginTop: '2rem' }}>Site Configuration</h3>
                            <div className={styles.formGroup}>
                                <label>Site Name</label>
                                <input
                                    type="text"
                                    value={siteConfig.siteName}
                                    onChange={(e) => setSiteConfig({ ...siteConfig, siteName: e.target.value })}
                                    placeholder="Lets Grow"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Site URL</label>
                                <input
                                    type="url"
                                    value={siteConfig.siteUrl}
                                    onChange={(e) => setSiteConfig({ ...siteConfig, siteUrl: e.target.value })}
                                    placeholder="https://letsgrow.me"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Signup Bonus ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={siteConfig.signupBonus}
                                    onChange={(e) => setSiteConfig({ ...siteConfig, signupBonus: e.target.value })}
                                    placeholder="10.00"
                                />
                            </div>

                            <button
                                type="button"
                                className={styles.btnPrimary}
                                onClick={handleInstall}
                                disabled={loading || !adminConfig.name || !adminConfig.email || !adminConfig.password}
                            >
                                {loading ? 'Installing...' : 'Install Now'}
                            </button>
                        </form>
                    </div>
                );

            case 4:
                return (
                    <div className={styles.stepContent}>
                        <div className={styles.success}>
                            <div className={styles.successIcon}>✅</div>
                            <h2>Installation Complete!</h2>
                            <p>Your Lets Grow SMM Panel has been successfully installed.</p>

                            <div className={styles.credentials}>
                                <h3>Admin Credentials</h3>
                                <p><strong>Email:</strong> {adminConfig.email}</p>
                                <p><strong>Password:</strong> (the one you entered)</p>
                            </div>

                            <div className={styles.nextSteps}>
                                <h3>Next Steps:</h3>
                                <ol>
                                    <li>Delete the <code>/install</code> folder for security</li>
                                    <li>Login to your admin panel</li>
                                    <li>Configure your services and packages</li>
                                    <li>Customize your site settings</li>
                                </ol>
                            </div>

                            <button
                                className={styles.btnPrimary}
                                onClick={() => router.push('/login')}
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.installer}>
                <div className={styles.header}>
                    <h1>🚀 Lets Grow Installation Wizard</h1>
                    <p>Follow the steps below to set up your SMM Panel</p>
                </div>

                <div className={styles.steps}>
                    {steps.map((step) => (
                        <div
                            key={step.step}
                            className={`${styles.step} ${currentStep === step.step ? styles.active : ''} ${currentStep > step.step ? styles.completed : ''}`}
                        >
                            <div className={styles.stepNumber}>{step.step}</div>
                            <div className={styles.stepTitle}>{step.title}</div>
                        </div>
                    ))}
                </div>

                {error && (
                    <div className={styles.error}>
                        ⚠️ {error}
                    </div>
                )}

                {renderStep()}
            </div>
        </div>
    );
}
