'use client';

import { useState, useEffect } from 'react';
import styles from '../management.module.css';
import adminStyles from '../admin.module.css';

interface Media {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    createdAt: string;
}

export default function MediaPage() {
    const [media, setMedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        try {
            const res = await fetch('/api/admin/media');
            if (res.ok) {
                const data = await res.json();
                setMedia(data);
            }
        } catch (error) {
            console.error('Failed to fetch media:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const res = await fetch('/api/admin/media/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setSelectedFile(null);
                setPreviewUrl(null);
                fetchMedia();
                alert('File uploaded successfully!');
            } else {
                const error = await res.json();
                alert(error.error || 'Upload failed');
            }
        } catch (error) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            const res = await fetch('/api/admin/media', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                fetchMedia();
            }
        } catch (error) {
            alert('Delete failed');
        }
    };

    const copyUrl = (url: string) => {
        const fullUrl = `${window.location.origin}${url}`;
        navigator.clipboard.writeText(fullUrl);
        alert('URL copied to clipboard!');
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>📁 Media Library</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Upload and manage images for your site
                </p>
            </div>

            {/* Upload Section */}
            <div className={styles.card}>
                <h2 className={styles.cardTitle}>Upload New File</h2>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                            onChange={handleFileSelect}
                            style={{
                                padding: '0.875rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '10px',
                                color: 'var(--text-primary)',
                                width: '100%',
                                marginBottom: '1rem',
                            }}
                        />
                        {selectedFile && (
                            <div style={{ marginBottom: '1rem' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                                </p>
                            </div>
                        )}
                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || uploading}
                            className={styles.button}
                            style={{ opacity: !selectedFile || uploading ? 0.5 : 1 }}
                        >
                            {uploading ? 'Uploading...' : '📤 Upload File'}
                        </button>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                            Supported formats: JPG, PNG, WEBP, GIF (Max 5MB)
                        </p>
                    </div>
                    {previewUrl && (
                        <div style={{
                            width: '200px',
                            height: '200px',
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Media Gallery */}
            <div className={styles.card}>
                <h2 className={styles.cardTitle}>Uploaded Files ({media.length})</h2>
                {loading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : media.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>📭 No files uploaded yet</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: '1.5rem',
                    }}>
                        {media.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                }}
                            >
                                <div style={{
                                    width: '100%',
                                    height: '200px',
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <img
                                        src={item.url}
                                        alt={item.originalName}
                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                                <div style={{ padding: '1rem' }}>
                                    <h3 style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        color: 'var(--text-primary)',
                                        marginBottom: '0.5rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {item.originalName}
                                    </h3>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                        {formatFileSize(item.size)} • {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => copyUrl(item.url)}
                                            className={styles.editButton}
                                            style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem' }}
                                        >
                                            📋 Copy URL
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className={styles.deleteButton}
                                            style={{ fontSize: '0.75rem', padding: '0.5rem' }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
