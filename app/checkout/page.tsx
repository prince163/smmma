'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import styles from './checkout.module.css';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, getTotalPrice, clearCart } = useCart();
    const [user, setUser] = useState<any>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('wallet');
    const [processing, setProcessing] = useState(false);

    const [guestForm, setGuestForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        countryCode: '+27',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (cart.length === 0) {
            router.push('/cart');
            return;
        }
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
            const data = await res.json();
            setUser(data);
            setIsLoggedIn(true);

            if (data.balance >= getTotalPrice()) {
                setPaymentMethod('wallet');
            }
        } else {
            setIsLoggedIn(false);
        }
        setLoading(false);
    };

    const handleGuestCheckout = async () => {
        if (!guestForm.firstName || !guestForm.lastName || !guestForm.email || !guestForm.phone || !guestForm.password) {
            alert('Please fill in all fields');
            return;
        }

        if (guestForm.password !== guestForm.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (guestForm.password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        setProcessing(true);

        try {
            const res = await fetch('/api/user/cart/guest-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cart,
                    paymentMethod,
                    user: {
                        firstName: guestForm.firstName,
                        lastName: guestForm.lastName,
                        email: guestForm.email,
                        phone: `${guestForm.countryCode}${guestForm.phone}`,
                        password: guestForm.password,
                    },
                }),
            });

            if (res.ok) {
                const data = await res.json();
                clearCart();

                if (data.token) {
                    document.cookie = `token=${data.token}; path=/`;
                }

                router.push(`/dashboard/orders?success=true&count=${data.orderCount}&new=true`);
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to complete checkout');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const handleLoggedInCheckout = async () => {
        setProcessing(true);

        try {
            if (paymentMethod === 'wallet') {
                const res = await fetch('/api/user/cart/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cart, paymentMethod: 'wallet' }),
                });

                if (res.ok) {
                    const data = await res.json();
                    clearCart();
                    router.push(`/dashboard/orders?success=true&count=${data.orderCount}`);
                } else {
                    const error = await res.json();
                    alert(error.error || 'Failed to place order');
                }
            } else {
                alert(`Payment gateway integration for ${paymentMethod} coming soon!`);
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <p>Loading...</p>
            </div>
        );
    }

    const totalPrice = getTotalPrice();
    const hasEnoughBalance = user?.balance !== undefined && user.balance >= totalPrice;

    return (
        <div className={styles.checkoutPage}>
            <div className="animated-bg"></div>

            <div className={styles.container}>
                <h1 className={styles.title}>💳 Checkout</h1>

                <div className={styles.checkoutGrid}>
                    {/* LEFT SIDE - User Info / Payment Form */}
                    <div className={styles.paymentSection}>
                        {isLoggedIn && user ? (
                            <>
                                <h2>Payment Method</h2>

                                <div className={styles.userInfo}>
                                    <p><strong>Logged in as:</strong> {user.email}</p>
                                    {user.name && <p><strong>Name:</strong> {user.name}</p>}
                                </div>

                                <div className={styles.balanceCard}>
                                    <div className={styles.balanceInfo}>
                                        <span>Your Balance:</span>
                                        <span className={styles.balance}>
                                            ${user.balance !== undefined ? user.balance.toFixed(2) : '0.00'}
                                        </span>
                                    </div>
                                    {hasEnoughBalance ? (
                                        <p className={styles.balanceStatus}>✓ Sufficient balance</p>
                                    ) : (
                                        <p className={styles.balanceStatusLow}>⚠️ Insufficient balance</p>
                                    )}
                                </div>

                                <div className={styles.paymentOptions}>
                                    <label className={`${styles.paymentOption} ${paymentMethod === 'wallet' ? styles.selected : ''} ${!hasEnoughBalance ? styles.disabled : ''}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="wallet"
                                            checked={paymentMethod === 'wallet'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            disabled={!hasEnoughBalance}
                                        />
                                        <div className={styles.optionContent}>
                                            <span className={styles.optionIcon}>💰</span>
                                            <div>
                                                <h3>Wallet Balance</h3>
                                                <p>Pay using your account balance</p>
                                            </div>
                                        </div>
                                    </label>

                                    <label className={`${styles.paymentOption} ${paymentMethod === 'yoco' ? styles.selected : ''}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="yoco"
                                            checked={paymentMethod === 'yoco'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <div className={styles.optionContent}>
                                            <span className={styles.optionIcon}>💳</span>
                                            <div>
                                                <h3>Yoco</h3>
                                                <p>Pay with credit/debit card</p>
                                            </div>
                                        </div>
                                    </label>

                                    <label className={`${styles.paymentOption} ${paymentMethod === 'zapper' ? styles.selected : ''}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="zapper"
                                            checked={paymentMethod === 'zapper'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <div className={styles.optionContent}>
                                            <span className={styles.optionIcon}>📱</span>
                                            <div>
                                                <h3>Zapper</h3>
                                                <p>Scan QR code to pay</p>
                                            </div>
                                        </div>
                                    </label>

                                    <label className={`${styles.paymentOption} ${paymentMethod === 'paygenius' ? styles.selected : ''}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="paygenius"
                                            checked={paymentMethod === 'paygenius'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <div className={styles.optionContent}>
                                            <span className={styles.optionIcon}>🏦</span>
                                            <div>
                                                <h3>PayGenius</h3>
                                                <p>Instant EFT payment</p>
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                <button
                                    onClick={handleLoggedInCheckout}
                                    disabled={processing || (paymentMethod === 'wallet' && !hasEnoughBalance)}
                                    className={styles.placeOrderButton}
                                >
                                    {processing ? 'Processing...' : `Place Order - $${totalPrice.toFixed(2)}`}
                                </button>
                            </>
                        ) : (
                            <>
                                <h2>Create Account & Checkout</h2>
                                <p className={styles.guestNote}>Create an account to complete your purchase</p>

                                <div className={styles.guestForm}>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>First Name *</label>
                                            <input
                                                type="text"
                                                value={guestForm.firstName}
                                                onChange={(e) => setGuestForm({ ...guestForm, firstName: e.target.value })}
                                                placeholder="John"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Last Name *</label>
                                            <input
                                                type="text"
                                                value={guestForm.lastName}
                                                onChange={(e) => setGuestForm({ ...guestForm, lastName: e.target.value })}
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            value={guestForm.email}
                                            onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Phone / WhatsApp *</label>
                                        <div className={styles.phoneInput}>
                                            <select
                                                value={guestForm.countryCode}
                                                onChange={(e) => setGuestForm({ ...guestForm, countryCode: e.target.value })}
                                                className={styles.countryCode}
                                            >
                                                <option value="+27">🇿🇦 +27 South Africa</option>
                                                <option value="+1">🇺🇸 +1 USA/Canada</option>
                                                <option value="+44">🇬🇧 +44 UK</option>
                                                <option value="+234">🇳🇬 +234 Nigeria</option>
                                                <option value="+91">🇮🇳 +91 India</option>
                                                <option value="+86">🇨🇳 +86 China</option>
                                                <option value="+81">🇯🇵 +81 Japan</option>
                                                <option value="+82">🇰🇷 +82 South Korea</option>
                                                <option value="+61">🇦🇺 +61 Australia</option>
                                                <option value="+33">🇫🇷 +33 France</option>
                                                <option value="+49">🇩🇪 +49 Germany</option>
                                                <option value="+39">🇮🇹 +39 Italy</option>
                                                <option value="+34">🇪🇸 +34 Spain</option>
                                                <option value="+7">🇷🇺 +7 Russia</option>
                                                <option value="+55">🇧🇷 +55 Brazil</option>
                                                <option value="+52">🇲🇽 +52 Mexico</option>
                                                <option value="+62">🇮🇩 +62 Indonesia</option>
                                                <option value="+63">🇵🇭 +63 Philippines</option>
                                                <option value="+84">🇻🇳 +84 Vietnam</option>
                                                <option value="+66">🇹🇭 +66 Thailand</option>
                                                <option value="+60">🇲🇾 +60 Malaysia</option>
                                                <option value="+65">🇸🇬 +65 Singapore</option>
                                                <option value="+971">🇦🇪 +971 UAE</option>
                                                <option value="+966">🇸🇦 +966 Saudi Arabia</option>
                                                <option value="+20">🇪🇬 +20 Egypt</option>
                                                <option value="+254">🇰🇪 +254 Kenya</option>
                                                <option value="+233">🇬🇭 +233 Ghana</option>
                                                <option value="+92">🇵🇰 +92 Pakistan</option>
                                                <option value="+880">🇧🇩 +880 Bangladesh</option>
                                                <option value="+90">🇹🇷 +90 Turkey</option>
                                                <option value="+31">🇳🇱 +31 Netherlands</option>
                                                <option value="+46">🇸🇪 +46 Sweden</option>
                                                <option value="+47">🇳🇴 +47 Norway</option>
                                                <option value="+45">🇩🇰 +45 Denmark</option>
                                                <option value="+358">🇫🇮 +358 Finland</option>
                                                <option value="+48">🇵🇱 +48 Poland</option>
                                                <option value="+351">🇵🇹 +351 Portugal</option>
                                                <option value="+30">🇬🇷 +30 Greece</option>
                                                <option value="+64">🇳🇿 +64 New Zealand</option>
                                                <option value="+353">🇮🇪 +353 Ireland</option>
                                                <option value="+41">🇨🇭 +41 Switzerland</option>
                                                <option value="+43">🇦🇹 +43 Austria</option>
                                                <option value="+32">🇧🇪 +32 Belgium</option>
                                            </select>
                                            <input
                                                type="tel"
                                                value={guestForm.phone}
                                                onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                                                placeholder="812345678"
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Password *</label>
                                        <input
                                            type="password"
                                            value={guestForm.password}
                                            onChange={(e) => setGuestForm({ ...guestForm, password: e.target.value })}
                                            placeholder="Minimum 6 characters"
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Confirm Password *</label>
                                        <input
                                            type="password"
                                            value={guestForm.confirmPassword}
                                            onChange={(e) => setGuestForm({ ...guestForm, confirmPassword: e.target.value })}
                                            placeholder="Re-enter password"
                                        />
                                    </div>

                                    <div className={styles.paymentMethodSelect}>
                                        <label>Payment Method</label>
                                        <select
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className={styles.paymentSelect}
                                        >
                                            <option value="yoco">💳 Yoco (Card Payment)</option>
                                            <option value="zapper">📱 Zapper (QR Code)</option>
                                            <option value="paygenius">🏦 PayGenius (EFT)</option>
                                        </select>
                                    </div>

                                    <div className={styles.totalDisplay}>
                                        <span>Total:</span>
                                        <span className={styles.totalAmount}>${totalPrice.toFixed(2)}</span>
                                    </div>

                                    <button
                                        onClick={handleGuestCheckout}
                                        disabled={processing}
                                        className={styles.placeOrderButton}
                                    >
                                        {processing ? 'Processing...' : `Create Account & Pay $${totalPrice.toFixed(2)}`}
                                    </button>

                                    <p className={styles.loginLink}>
                                        Already have an account? <a href="/login">Login here</a>
                                    </p>
                                </div>
                            </>
                        )}

                        <button
                            onClick={() => router.push('/cart')}
                            className={styles.backButton}
                        >
                            ← Back to Cart
                        </button>
                    </div>

                    {/* RIGHT SIDE - Order Summary */}
                    <div className={styles.orderReview}>
                        <h2>Order Summary</h2>

                        <div className={styles.orderItems}>
                            {cart.map((item) => (
                                <div key={item.packageId} className={styles.orderItem}>
                                    <div className={styles.itemHeader}>
                                        <span className={styles.icon}>{item.platformIcon}</span>
                                        <div>
                                            <h3>{item.packageName}</h3>
                                            <p>{item.platformName} • {item.serviceName}</p>
                                        </div>
                                    </div>
                                    <div className={styles.itemDetails}>
                                        <div className={styles.detail}>
                                            <span>Quantity:</span>
                                            <strong>{item.quantity.toLocaleString()}</strong>
                                        </div>
                                        <div className={styles.detail}>
                                            <span>Link:</span>
                                            <span className={styles.link}>{item.link}</span>
                                        </div>
                                        <div className={styles.detail}>
                                            <span>Price:</span>
                                            <strong className={styles.price}>${item.price.toFixed(2)}</strong>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.orderSummary}>
                            <div className={styles.summaryRow}>
                                <span>Total ({cart.length} items)</span>
                                <span className={styles.totalPrice}>${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
