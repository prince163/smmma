import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma';

export default async function PageView({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const page = await prisma.page.findUnique({
        where: { slug },
    });

    if (!page || !page.published) {
        notFound();
    }

    return (
        <>
            <Navbar />
            <div className="animated-bg"></div>

            <main style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '4rem 2rem',
                minHeight: '70vh',
            }}>
                <article style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '3rem',
                }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '2rem',
                    }}>
                        {page.title}
                    </h1>

                    <div
                        style={{
                            color: 'var(--text-secondary)',
                            lineHeight: '1.8',
                            fontSize: '1.1rem',
                        }}
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />

                    <div style={{
                        marginTop: '3rem',
                        paddingTop: '2rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'var(--text-muted)',
                        fontSize: '0.875rem',
                    }}>
                        Last updated: {new Date(page.updatedAt).toLocaleDateString()}
                    </div>
                </article>
            </main>

            <Footer />
        </>
    );
}
