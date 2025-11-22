'use client';

import { useState, useEffect } from 'react';
import styles from '../management.module.css';
import adminStyles from '../admin.module.css';

interface Page {
    id: string;
    title: string;
    slug: string;
    content: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function PagesPage() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPage, setEditingPage] = useState<Page | null>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [published, setPublished] = useState(true);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const res = await fetch('/api/admin/pages');
            if (res.ok) {
                const data = await res.json();
                setPages(data);
            }
        } catch (error) {
            console.error('Failed to fetch pages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const pageData = { title, slug, content, published };

        try {
            const url = editingPage
                ? `/api/admin/pages/${editingPage.slug}`
                : '/api/admin/pages';

            const method = editingPage ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pageData),
            });

            if (res.ok) {
                fetchPages();
                resetForm();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to save page');
            }
        } catch (error) {
            alert('Failed to save page');
        }
    };

    const handleEdit = (page: Page) => {
        setEditingPage(page);
        setTitle(page.title);
        setSlug(page.slug);
        setContent(page.content);
        setPublished(page.published);
        setShowForm(true);
    };

    const handleDelete = async (slug: string) => {
        if (!confirm('Are you sure you want to delete this page?')) return;

        try {
            const res = await fetch(`/api/admin/pages/${slug}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchPages();
            }
        } catch (error) {
            alert('Failed to delete page');
        }
    };

    const resetForm = () => {
        setTitle('');
        setSlug('');
        setContent('');
        setPublished(true);
        setEditingPage(null);
        setShowForm(false);
    };

    // Auto-generate slug from title
    const handleTitleChange = (value: string) => {
        setTitle(value);
        if (!editingPage) {
            const autoSlug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            setSlug(autoSlug);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>📄 Pages</h1>
                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        else setShowForm(true);
                    }}
                    className={styles.button}
                >
                    {showForm ? 'Cancel' : '+ Add Page'}
                </button>
            </div>

            {showForm && (
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>
                        {editingPage ? '✏️ Edit Page' : '📝 Create New Page'}
                    </h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formRow}>
                            <div className={adminStyles.formGroup}>
                                <label className={adminStyles.formLabel}>
                                    Page Title <span style={{ color: '#f87171' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    className={adminStyles.formInput}
                                    placeholder="e.g., Frequently Asked Questions"
                                    required
                                    style={{ fontSize: '1rem' }}
                                />
                            </div>

                            <div className={adminStyles.formGroup}>
                                <label className={adminStyles.formLabel}>
                                    URL Slug <span style={{ color: '#f87171' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className={adminStyles.formInput}
                                    placeholder="e.g., faq"
                                    required
                                    disabled={!!editingPage}
                                    style={{
                                        fontSize: '1rem',
                                        opacity: editingPage ? 0.6 : 1,
                                        cursor: editingPage ? 'not-allowed' : 'text'
                                    }}
                                />
                                <small style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.875rem',
                                    display: 'block',
                                    marginTop: '0.5rem'
                                }}>
                                    {slug ? `Page will be available at: /${slug}` : 'Auto-generated from title'}
                                </small>
                            </div>
                        </div>

                        <div className={adminStyles.formGroup}>
                            <label className={adminStyles.formLabel}>
                                Content <span style={{ color: '#f87171' }}>*</span>
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className={adminStyles.formInput}
                                placeholder="Enter page content (HTML supported)&#10;&#10;Example:&#10;<h2>Section Title</h2>&#10;<p>Your content here...</p>"
                                rows={20}
                                style={{
                                    fontFamily: 'monospace',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.6',
                                    resize: 'vertical'
                                }}
                            />
                            <small style={{
                                color: 'var(--text-muted)',
                                fontSize: '0.875rem',
                                display: 'block',
                                marginTop: '0.5rem'
                            }}>
                                💡 You can use HTML tags for formatting (h2, h3, p, ul, li, strong, em, etc.)
                            </small>
                        </div>

                        <div className={adminStyles.formGroup}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                cursor: 'pointer',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={published}
                                    onChange={(e) => setPublished(e.target.checked)}
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        cursor: 'pointer'
                                    }}
                                />
                                <div>
                                    <span className={adminStyles.formLabel} style={{ margin: 0, display: 'block' }}>
                                        Published
                                    </span>
                                    <small style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        {published ? 'Page is visible to public' : 'Page is hidden (draft)'}
                                    </small>
                                </div>
                            </label>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button type="submit" className={styles.button} style={{ flex: 1 }}>
                                {editingPage ? '💾 Update Page' : '✨ Create Page'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                style={{
                                    padding: '1rem 2rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className={styles.card}>
                <h2 className={styles.cardTitle}>All Pages ({pages.length})</h2>
                {loading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : pages.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>📭 No pages yet. Create your first page!</p>
                    </div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Slug</th>
                                    <th>Status</th>
                                    <th>Updated</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pages.map((page) => (
                                    <tr key={page.id}>
                                        <td>{page.title}</td>
                                        <td>
                                            <code style={{
                                                background: 'rgba(99, 102, 241, 0.1)',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                color: '#818cf8'
                                            }}>
                                                /{page.slug}
                                            </code>
                                        </td>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                background: page.published ? 'rgba(16, 185, 129, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                                                color: page.published ? '#10b981' : '#9ca3af',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                            }}>
                                                {page.published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td>{new Date(page.updatedAt).toLocaleDateString()}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleEdit(page)}
                                                    className={styles.editButton}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(page.slug)}
                                                    className={styles.deleteButton}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
