'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import styles from './Navbar.module.css';

interface Currency {
    id: string;
    code: string;
    symbol: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function Navbar() {
    const router = useRouter();
    const { getItemCount } = useCart();
    const itemCount = getItemCount();
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState('ZAR');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchCurrencies();
        checkAuth();
        // Load saved currency preference
        const saved = localStorage.getItem('selectedCurrency');
        if (saved) setSelectedCurrency(saved);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCurrencies = async () => {
        try {
            const res = await fetch('/api/admin/currencies');
            if (res.ok) {
                const data = await res.json();
                setCurrencies(data.filter((c: Currency & { isActive: boolean }) => c.isActive));
            }
        } catch (error) {
            console.error('Failed to fetch currencies');
        }
    };

    const handleCurrencyChange = (code: string) => {
        setSelectedCurrency(code);
        localStorage.setItem('selectedCurrency', code);
        setIsDropdownOpen(false);
        // Trigger a custom event for other components to listen to
        window.dispatchEvent(new CustomEvent('currencyChange', { detail: code }));
    };

    const handleLogout = () => {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        setUser(null);
        setIsUserMenuOpen(false);
        router.push('/');
        router.refresh();
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                <Link href="/" className={styles.logo}>
                    <Image src="/logo.png" alt="Lets Grow" width={48} height={48} style={{ marginRight: '0.85rem' }} />
                    <span className={styles.logoText}>Lets Grow</span>
                </Link>

                <ul className={styles.navLinks}>
                    <li><Link href="/services" className={styles.navLink}>Services</Link></li>
                    <li><Link href="/how-it-works" className={styles.navLink}>How It Works</Link></li>
                    <li><Link href="/faq" className={styles.navLink}>FAQ</Link></li>
                </ul>

                <div className={styles.navButtons}>
                    {/* Currency Selector */}
                    <div className={styles.currencyWrapper} ref={dropdownRef}>
                        <div
                            className={styles.currencyButton}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span className={styles.currencyIcon}>🌐</span>
                            <span className={styles.currencyText}>
                                {currencies.find(c => c.code === selectedCurrency)?.code || 'ZAR'}
                            </span>
                            <span className={styles.dropdownArrow}>{isDropdownOpen ? '▲' : '▼'}</span>
                        </div>

                        {isDropdownOpen && (
                            <div className={styles.currencyDropdown}>
                                {currencies.map((currency) => (
                                    <div
                                        key={currency.id}
                                        className={`${styles.currencyOption} ${currency.code === selectedCurrency ? styles.currencyOptionActive : ''
                                            }`}
                                        onClick={() => handleCurrencyChange(currency.code)}
                                    >
                                        <span className={styles.currencySymbol}>{currency.symbol}</span>
                                        <span className={styles.currencyCode}>{currency.code}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link href="/cart" className={styles.cartBtn}>
                        <span className={styles.cartIcon}>🛒</span>
                        Cart
                        {itemCount > 0 && (
                            <span className={styles.cartBadge}>{itemCount}</span>
                        )}
                    </Link>

                    {/* User Menu or Login/Register */}
                    {!isLoading && (
                        <>
                            {user ? (
                                <div className={styles.userMenuWrapper} ref={userMenuRef}>
                                    <button
                                        className={styles.userMenuButton}
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    >
                                        <span className={styles.userIcon}>👤</span>
                                        <span className={styles.userName}>{user.name}</span>
                                        <span className={styles.dropdownArrow}>{isUserMenuOpen ? '▲' : '▼'}</span>
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className={styles.userDropdown}>
                                            <Link
                                                href="/dashboard"
                                                className={styles.userDropdownItem}
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                📊 Dashboard
                                            </Link>
                                            {user.role === 'ADMIN' && (
                                                <Link
                                                    href="/admin"
                                                    className={styles.userDropdownItem}
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    ⚙️ Admin Panel
                                                </Link>
                                            )}
                                            <Link
                                                href="/dashboard/profile"
                                                className={styles.userDropdownItem}
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                👤 Profile
                                            </Link>
                                            <div className={styles.userDropdownDivider}></div>
                                            <button
                                                className={styles.userDropdownItem}
                                                onClick={handleLogout}
                                            >
                                                🚪 Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link href="/login" className={styles.loginBtn}>Login</Link>
                                    <Link href="/register" className={styles.registerBtn}>Get Started</Link>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
