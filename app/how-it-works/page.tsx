import Navbar from '@/components/Navbar';

export default function HowItWorksPage() {
    return (
        <main>
            <Navbar />
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1rem' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>How It Works</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>1</div>
                        <div>
                            <h3>Choose a Platform & Service</h3>
                            <p>Browse our wide range of supported platforms and select the service that fits your needs. We offer tools for various social media networks.</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>2</div>
                        <div>
                            <h3>Select a Package</h3>
                            <p>Choose a package that suits your goals. Review the details, including price per unit and minimum/maximum quantities.</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>3</div>
                        <div>
                            <h3>Submit Order & Track Results</h3>
                            <p>Enter the link to your post or profile, confirm the details, and place your order. You can track the status in your dashboard.</p>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--secondary)', borderRadius: '8px' }}>
                    <h4>Disclaimer</h4>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                        Results vary based on platform algorithms and audience activity. Our tools are designed to enhance visibility and engagement potential, but specific outcomes depend on many factors.
                    </p>
                </div>
            </div>
        </main>
    );
}
