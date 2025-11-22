'use client';

import { useState, useEffect } from 'react';
import styles from '../management.module.css';
import adminStyles from '../admin.module.css';

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
    user: {
        email: string;
    };
    messages: TicketMessage[];
}

export default function AdminSupportPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await fetch('/api/admin/tickets');
            if (res.ok) {
                const data = await res.json();
                setTickets(data);
            }
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendReply = async () => {
        if (!selectedTicket || !replyMessage.trim()) return;

        setSending(true);
        try {
            const res = await fetch(`/api/admin/tickets/${selectedTicket.id}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: replyMessage }),
            });

            if (res.ok) {
                setReplyMessage('');
                fetchTickets();
                // Refresh selected ticket
                const updatedTicket = await fetch(`/api/admin/tickets/${selectedTicket.id}`).then(r => r.json());
                setSelectedTicket(updatedTicket);
            }
        } catch (error) {
            console.error('Failed to send reply:', error);
        } finally {
            setSending(false);
        }
    };

    const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/tickets/${ticketId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                fetchTickets();
                if (selectedTicket?.id === ticketId) {
                    setSelectedTicket({ ...selectedTicket, status: newStatus });
                }
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const filteredTickets = filterStatus === 'ALL'
        ? tickets
        : tickets.filter(t => t.status === filterStatus);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return '#10b981';
            case 'PENDING': return '#f59e0b';
            case 'SOLVED': return '#6366f1';
            default: return '#94a3b8';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>💬 Support Tickets</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Manage customer support requests
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{
                            padding: '0.75rem 1rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '10px',
                            color: 'var(--text-primary)',
                        }}
                    >
                        <option value="ALL">All Tickets</option>
                        <option value="OPEN">Open</option>
                        <option value="PENDING">Pending</option>
                        <option value="SOLVED">Solved</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedTicket ? '400px 1fr' : '1fr', gap: '2rem' }}>
                {/* Tickets List */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>
                        {filterStatus === 'ALL' ? 'All Tickets' : `${filterStatus} Tickets`} ({filteredTickets.length})
                    </h2>

                    {loading ? (
                        <div className={styles.loading}>Loading tickets...</div>
                    ) : filteredTickets.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>📭 No {filterStatus.toLowerCase()} tickets found</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {filteredTickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    style={{
                                        padding: '1rem',
                                        background: selectedTicket?.id === ticket.id
                                            ? 'rgba(99, 102, 241, 0.1)'
                                            : 'rgba(255, 255, 255, 0.02)',
                                        border: `1px solid ${selectedTicket?.id === ticket.id
                                            ? 'rgba(99, 102, 241, 0.3)'
                                            : 'rgba(255, 255, 255, 0.05)'}`,
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedTicket?.id !== ticket.id) {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedTicket?.id !== ticket.id) {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                                        }
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                                            {ticket.subject}
                                        </h3>
                                        <span
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                background: `${getStatusColor(ticket.status)}20`,
                                                color: getStatusColor(ticket.status),
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                                        👤 {ticket.user.email}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.25rem 0' }}>
                                        💬 {ticket.messages.length} messages • {new Date(ticket.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Ticket Details */}
                {selectedTicket && (
                    <div className={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                            <div>
                                <h2 className={styles.cardTitle}>{selectedTicket.subject}</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    From: {selectedTicket.user.email}
                                </p>
                            </div>
                            <select
                                value={selectedTicket.status}
                                onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: `${getStatusColor(selectedTicket.status)}20`,
                                    color: getStatusColor(selectedTicket.status),
                                    border: `1px solid ${getStatusColor(selectedTicket.status)}40`,
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                <option value="OPEN">Open</option>
                                <option value="PENDING">Pending</option>
                                <option value="SOLVED">Solved</option>
                            </select>
                        </div>

                        {/* Messages */}
                        <div style={{
                            maxHeight: '400px',
                            overflowY: 'auto',
                            marginBottom: '1.5rem',
                            padding: '1rem',
                            background: 'rgba(0, 0, 0, 0.2)',
                            borderRadius: '12px',
                        }}>
                            {selectedTicket.messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    style={{
                                        marginBottom: '1rem',
                                        padding: '1rem',
                                        background: msg.sender === 'ADMIN'
                                            ? 'rgba(99, 102, 241, 0.1)'
                                            : 'rgba(255, 255, 255, 0.05)',
                                        borderLeft: `3px solid ${msg.sender === 'ADMIN' ? '#6366f1' : '#10b981'}`,
                                        borderRadius: '8px',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 600, color: msg.sender === 'ADMIN' ? '#818cf8' : '#10b981' }}>
                                            {msg.sender === 'ADMIN' ? '🛡️ Admin' : '👤 User'}
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
                                    padding: '0.875rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '10px',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    resize: 'vertical',
                                    marginBottom: '1rem',
                                }}
                            />
                            <button
                                onClick={handleSendReply}
                                disabled={sending || !replyMessage.trim()}
                                className={styles.button}
                                style={{ opacity: sending || !replyMessage.trim() ? 0.5 : 1 }}
                            >
                                {sending ? 'Sending...' : '📤 Send Reply'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
