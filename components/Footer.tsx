import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '4rem 2rem 2rem',
            marginTop: '4rem'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '3rem',
                    marginBottom: '3rem'
                }}>
                    <div>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '1rem'
                        }}>
                            Lets Grow
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            AI-Driven Tools to Enhance Visibility & Improve Digital Engagement.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <Link href="/services" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.3s' }}>
                                    Services
                                </Link>
                            </li>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <Link href="/how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                                    How It Works
                                </Link>
                            </li>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <Link href="/faq" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Legal</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <Link href="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                                    Terms of Service
                                </Link>
                            </li>
                            <li style={{ marginBottom: '0.5rem' }}>
                                <Link href="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Contact</h4>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            support@letsgrow.me
                        </p>
                        {/* Conditional phone display - only show if phone number is set */}
                        {/* In production, this would come from settings/API */}
                    </div>
                </div>

                <div style={{
                    textAlign: 'center',
                    paddingTop: '2rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem'
                }}>
                    © {new Date().getFullYear()} Lets Grow. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
