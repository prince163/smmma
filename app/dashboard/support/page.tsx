'use client';

import { useState, useEffect } from 'react';
import styles from '../management.module.css';

interface TicketMessage {
    id: string;
    sender: string;
    message: string;
    createdAt: string;
}

interface Ticket {
    id: string;
    subject: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    messages: TicketMessage[];
}

export default function SupportPage() {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await fetch('/api/user/tickets');
            if (res.ok) {
                const data = await res.json();
                setTickets(data);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || !message) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const res = await fetch('/api/user/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, message }),
            });

            if (res.ok) {
                setSubmitted(true);
                setSubject('');
                setMessage('');
                fetchTickets();
                setTimeout(() => setSubmitted(false), 3000);
            } else {
                alert('Failed to create ticket');
            }
        } catch (error) {
            alert('Error creating ticket');
        }
    };

    const handleSendReply = async () => {
        if (!selectedTicket || !replyMessage.trim()) return;

        setSending(true);
        try {
            const res = await fetch(`/api/tickets/${selectedTicket.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: replyMessage }),
            });

            if (res.ok) {
                setReplyMessage('');
                await fetchTickets();
                // Refresh selected ticket
                const updatedTickets = await fetch('/api/user/tickets').then(r => r.json());
                const updatedTicket = updatedTickets.find((t: Ticket) => t.id === selectedTicket.id);
                if (updatedTicket) {
                    setSelectedTicket(updatedTicket);
                }
            }
        } catch (error) {
            console.error('Failed to send reply:', error);
        } finally {
            setSending(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return '#10b981';
            case 'PENDING': return '#f59e0b';
            case 'SOLVED': return '#6366f1';
            default: return '#94a3b8';
        }
    };

    return (
        <div className={styles.managementPage}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>💬 Support</h1>
                <p className={styles.pageDescription}>Get help from our support team</p>
            </div>

            {!selectedTicket ? (
                <>
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Create New Ticket</h2>
                        <p className={styles.sectionDescription}>
                            Describe your issue and we&apos;ll get back to you as soon as possible
                        </p>

                        {submitted && (
                            <div style={{
                                background: 'rgba(34, 197, 94, 0.15)',
                                border: '1px solid rgba(34, 197, 94, 0.4)',
                                color: '#86efac',
                                padding: '1rem',
                                borderRadius: '12px',
                                marginBottom: '1.5rem',
                            }}>
                                ✓ Ticket submitted successfully! We&apos;ll respond within 24 hours.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '600',
                                    color: 'var(--text-primary)',
                                }}>
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Brief description of your issue"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '600',
                                    color: 'var(--text-primary)',
                                }}>
                                    Message
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Provide detailed information about your issue..."
                                    rows={8}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                        resize: 'vertical',
                                        fontFamily: 'inherit',
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                style={{
                                    padding: '1.25rem 2.5rem',
                                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    fontSize: '1.125rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                                }}
                            >
                                📨 Submit Ticket
                            </button>
                        </form>
                    </div>

                    <div className={styles.tableSection}>
                        <h2 className={styles.sectionTitle}>Your Tickets</h2>
                        {loading ? (
                            <div className={styles.emptyState}>
                                <p>Loading tickets...</p>
                            </div>
                        ) : tickets.length > 0 ? (
                            <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                                {tickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        onClick={() => setSelectedTicket(ticket)}
                                        style={{
                                            padding: '1.5rem',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '16px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                                {ticket.subject}
                                            </h3>
                                            <span style={{
                                                padding: '0.375rem 0.75rem',
                                                background: `${getStatusColor(ticket.status)}20`,
                                                border: `1px solid ${getStatusColor(ticket.status)}40`,
                                                color: getStatusColor(ticket.status),
                                                borderRadius: '20px',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                            }}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                                            {ticket.messages[0]?.message.substring(0, 100)}{ticket.messages[0]?.message.length > 100 ? '...' : ''}
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                                                💬 {ticket.messages.length} message{ticket.messages.length !== 1 ? 's' : ''}
                                            </p>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <p>📋 No support tickets yet. Your ticket history will appear here.</p>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className={styles.formSection}>
                    <button
                        onClick={() => setSelectedTicket(null)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '10px',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            marginBottom: '1.5rem',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        }}
                    >
                        ← Back to Tickets
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                        <div>
                            <h2 className={styles.sectionTitle} style={{ marginBottom: '0.5rem' }}>
                                {selectedTicket.subject}
                            </h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                Created: {new Date(selectedTicket.createdAt).toLocaleString()}
                            </p>
                        </div>
                        <span style={{
                            padding: '0.5rem 1rem',
                            background: `${getStatusColor(selectedTicket.status)}20`,
                            color: getStatusColor(selectedTicket.status),
                            border: `1px solid ${getStatusColor(selectedTicket.status)}40`,
                            borderRadius: '8px',
                            fontWeight: 600,
                        }}>
                            {selectedTicket.status}
                        </span>
                    </div>

                    {/* Messages Thread */}
                    <div style={{
                        maxHeight: '500px',
                        overflowY: 'auto',
                        marginBottom: '1.5rem',
                        padding: '1.5rem',
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}>
                        {selectedTicket.messages.map((msg) => (
                            <div
                                key={msg.id}
                                style={{
                                    marginBottom: '1rem',
                                    padding: '1rem',
                                    background: msg.sender === 'ADMIN'
                                        ? 'rgba(99, 102, 241, 0.1)'
                                        : 'rgba(16, 185, 129, 0.1)',
                                    borderLeft: `3px solid ${msg.sender === 'ADMIN' ? '#6366f1' : '#10b981'}`,
                                    borderRadius: '8px',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 600, color: msg.sender === 'ADMIN' ? '#818cf8' : '#10b981' }}>
                                        {msg.sender === 'ADMIN' ? '🛡️ Support Team' : '👤 You'}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p style={{ color: 'var(--text-primary)', margin: 0, whiteSpace: 'pre-wrap' }}>
                                    {msg.message}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Reply Form */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            Reply to Ticket
                        </label>
                        <textarea
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            placeholder="Type your response..."
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                                resize: 'vertical',
                                marginBottom: '1rem',
                                fontFamily: 'inherit',
                            }}
                        />
                        <button
                            onClick={handleSendReply}
                            disabled={sending || !replyMessage.trim()}
                            style={{
                                padding: '1rem 2rem',
                                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: '700',
                                fontSize: '1rem',
                                cursor: sending || !replyMessage.trim() ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                                opacity: sending || !replyMessage.trim() ? 0.5 : 1,
                            }}
                        >
                            {sending ? 'Sending...' : '📤 Send Reply'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
