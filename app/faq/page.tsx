import Navbar from '@/components/Navbar';

export default function FAQPage() {
    return (
        <main>
            <Navbar />
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1rem' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>Frequently Asked Questions</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                        <h3>How do orders work?</h3>
                        <p>Once you place an order, our system processes it and initiates the service. You can track the progress in your dashboard.</p>
                    </div>

                    <div>
                        <h3>How long does processing take?</h3>
                        <p>Processing times vary depending on the service and package selected. Most orders start within a few minutes to a few hours.</p>
                    </div>

                    <div>
                        <h3>What payment methods do you accept?</h3>
                        <p>We accept various payment methods including credit cards and manual transfers. Please check the dashboard for available options.</p>
                    </div>

                    <div>
                        <h3>How do I track my order?</h3>
                        <p>Log in to your account and visit the "Orders" section in your dashboard to see real-time status updates.</p>
                    </div>

                    <div>
                        <h3>What is your refund policy?</h3>
                        <p>Refunds are handled on a case-by-case basis. If an order cannot be completed, the funds are typically returned to your account balance.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
