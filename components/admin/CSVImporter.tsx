'use client';

import { useState, useRef } from 'react';
import styles from './CSVImporter.module.css';

interface CSVImporterProps {
    entityType: 'platforms' | 'services' | 'packages';
    onImportComplete?: (results: ImportResults) => void;
}

interface ImportResults {
    success: number;
    updated: number;
    errors: string[];
    created: any[];
    total: number;
}

export default function CSVImporter({ entityType, onImportComplete }: CSVImporterProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [results, setResults] = useState<ImportResults | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === 'text/csv') {
            setFile(droppedFile);
            setResults(null);
        } else {
            alert('Please drop a CSV file');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setResults(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setResults(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`/api/admin/import/${entityType}`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Import failed');
            }

            setResults(data);
            if (onImportComplete) {
                onImportComplete(data);
            }
        } catch (error: any) {
            setResults({
                success: 0,
                updated: 0,
                errors: [error.message],
                created: [],
                total: 0,
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownloadTemplate = () => {
        const templates = {
            platforms: `name,slug,icon
Facebook,facebook,📘
Instagram,instagram,📷
TikTok,tiktok,🎵`,
            services: `platformSlug,name
facebook,Followers
instagram,Likes`,
            packages: `platformSlug,serviceName,name,quantity,price,description,minQuantity,maxQuantity
facebook,Followers,Starter Pack,1000,9.99,1000 Facebook followers,500,5000
instagram,Likes,Basic,500,4.99,500 Instagram likes,100,2000`,
        };

        const template = templates[entityType];
        const blob = new Blob([template], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${entityType}_template.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className={styles.importer}>
            <div className={styles.header}>
                <h3>Import {entityType.charAt(0).toUpperCase() + entityType.slice(1)}</h3>
                <button onClick={handleDownloadTemplate} className={styles.templateBtn}>
                    📥 Download Template
                </button>
            </div>

            <div
                className={`${styles.dropzone} ${isDragging ? styles.dragging : ''} ${file ? styles.hasFile : ''
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className={styles.fileInput}
                />

                {file ? (
                    <div className={styles.fileInfo}>
                        <span className={styles.fileIcon}>📄</span>
                        <span className={styles.fileName}>{file.name}</span>
                        <span className={styles.fileSize}>
                            ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                    </div>
                ) : (
                    <div className={styles.dropzoneContent}>
                        <span className={styles.uploadIcon}>📤</span>
                        <p>Drag & drop CSV file here or click to browse</p>
                        <p className={styles.hint}>Only .csv files are accepted</p>
                    </div>
                )}
            </div>

            {file && (
                <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className={styles.uploadBtn}
                >
                    {isUploading ? '⏳ Uploading...' : '🚀 Upload & Import'}
                </button>
            )}

            {results && (
                <div className={styles.results}>
                    <h4>Import Results</h4>
                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <span className={styles.statLabel}>Total Rows:</span>
                            <span className={styles.statValue}>{results.total}</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statLabel}>Created:</span>
                            <span className={`${styles.statValue} ${styles.success}`}>
                                {results.success}
                            </span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statLabel}>Updated:</span>
                            <span className={`${styles.statValue} ${styles.info}`}>
                                {results.updated}
                            </span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statLabel}>Errors:</span>
                            <span className={`${styles.statValue} ${styles.error}`}>
                                {results.errors.length}
                            </span>
                        </div>
                    </div>

                    {results.errors.length > 0 && (
                        <div className={styles.errors}>
                            <h5>Errors:</h5>
                            <ul>
                                {results.errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
