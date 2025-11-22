'use client';

import { useState } from 'react';
import styles from './settings.module.css';
import adminStyles from '../admin.module.css';

type TabType = 'branding' | 'smtp' | 'email-templates' | 'payment-gateways';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('branding');
    const [saved, setSaved] = useState(false);

    // Branding settings
    const [siteName, setSiteName] = useState('SMM Panel');
    const [siteTagline, setSiteTagline] = useState('AI-Driven Social Media Growth');
    const [primaryColor, setPrimaryColor] = useState('#6366f1');
    const [secondaryColor, setSecondaryColor] = useState('#ec4899');
    const [logo, setLogo] = useState('');

    // Footer settings
    const [footerText, setFooterText] = useState('AI-Driven Tools to Enhance Visibility & Improve Digital Engagement.');
    const [copyrightText, setCopyrightText] = useState('© 2025 SMM Panel. All rights reserved.');
    const [facebookUrl, setFacebookUrl] = useState('');
    const [twitterUrl, setTwitterUrl] = useState('');
    const [instagramUrl, setInstagramUrl] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');

    // Dynamic footer links
    const [quickLinks, setQuickLinks] = useState([
        { label: 'Services', url: '/services' },
        { label: 'How It Works', url: '/how-it-works' },
        { label: 'FAQ', url: '/faq' },
        { label: 'Blog', url: '/blog' },
    ]);

    const [legalLinks, setLegalLinks] = useState([
        { label: 'Terms of Service', url: '/terms' },
        { label: 'Privacy Policy', url: '/privacy' },
    ]);

    const [contactEmail, setContactEmail] = useState('support@smmpanel.com');
    const [contactPhone, setContactPhone] = useState('');

    // Signup Bonus settings
    const [signupBonusEnabled, setSignupBonusEnabled] = useState(true);
    const [signupBonusAmount, setSignupBonusAmount] = useState('10.00');

    // SMTP settings
    const [smtpHost, setSmtpHost] = useState('');
    const [smtpPort, setSmtpPort] = useState('587');
    const [smtpUser, setSmtpUser] = useState('');
    const [smtpPassword, setSmtpPassword] = useState('');
    const [smtpFrom, setSmtpFrom] = useState('');

    // Payment gateway settings
    const [yocoEnabled, setYocoEnabled] = useState(false);
    const [yocoPublicKey, setYocoPublicKey] = useState('');
    const [yocoSecretKey, setYocoSecretKey] = useState('');

    const [zapperEnabled, setZapperEnabled] = useState(false);
    const [zapperMerchantId, setZapperMerchantId] = useState('');
    const [zapperSiteId, setZapperSiteId] = useState('');
    const [zapperApiKey, setZapperApiKey] = useState('');

    const [paygeniusEnabled, setPaygeniusEnabled] = useState(false);
    const [paygeniusMerchantId, setPaygeniusMerchantId] = useState('');
    const [paygeniusApiKey, setPaygeniusApiKey] = useState('');

    const handleSave = () => {
        // TODO: Save settings to database via API
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    // Quick Links management
    const addQuickLink = () => {
        setQuickLinks([...quickLinks, { label: '', url: '' }]);
    };

    const removeQuickLink = (index: number) => {
        setQuickLinks(quickLinks.filter((_, i) => i !== index));
    };

    const updateQuickLink = (index: number, field: 'label' | 'url', value: string) => {
        const updated = [...quickLinks];
        updated[index][field] = value;
        setQuickLinks(updated);
    };

    // Legal Links management
    const addLegalLink = () => {
        setLegalLinks([...legalLinks, { label: '', url: '' }]);
    };

    const removeLegalLink = (index: number) => {
        setLegalLinks(legalLinks.filter((_, i) => i !== index));
    };

    const updateLegalLink = (index: number, field: 'label' | 'url', value: string) => {
        const updated = [...legalLinks];
        updated[index][field] = value;
        setLegalLinks(updated);
    };

    return (
        <div className={styles.settingsPage}>
            <div className={adminStyles.pageHeader}>
                <h1 className={adminStyles.pageTitle}>Settings</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Configure your SMM panel</p>
            </div>

            <div className={styles.tabsContainer}>
                <button
                    className={`${styles.tab} ${activeTab === 'branding' ? styles.active : ''}`}
                    onClick={() => setActiveTab('branding')}
                >
                    🎨 Branding
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'smtp' ? styles.active : ''}`}
                    onClick={() => setActiveTab('smtp')}
                >
                    📧 SMTP Settings
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'email-templates' ? styles.active : ''}`}
                    onClick={() => setActiveTab('email-templates')}
                >
                    ✉️ Email Templates
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'payment-gateways' ? styles.active : ''}`}
                    onClick={() => setActiveTab('payment-gateways')}
                >
                    💳 Payment Gateways
                </button>
            </div>

            {saved && (
                <div className={styles.successMessage}>
                    <span>✓</span>
                    <span>Settings saved successfully!</span>
                </div>
            )}

            {/* Branding Tab */}
            {activeTab === 'branding' && (
                <div className={styles.settingsSection}>
                    <h2 className={styles.sectionTitle}>Branding & Appearance</h2>
                    <p className={styles.sectionDescription}>
                        Customize your panel&apos;s look and feel
                    </p>

                    <div className={styles.settingsGrid}>
                        <div className={adminStyles.formGroup}>
                            <label className={adminStyles.formLabel}>Site Name</label>
                            <input
                                type="text"
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                                className={adminStyles.formInput}
                                placeholder="SMM Panel"
                            />
                        </div>

                        <div className={adminStyles.formGroup}>
                            <label className={adminStyles.formLabel}>Site Tagline</label>
                            <input
                                type="text"
                                value={siteTagline}
                                onChange={(e) => setSiteTagline(e.target.value)}
                                className={adminStyles.formInput}
                                placeholder="AI-Driven Social Media Growth"
                            />
                        </div>

                        <div className={adminStyles.formGroup}>
                            <label className={adminStyles.formLabel}>Logo URL</label>
                            <input
                                type="text"
                                value={logo}
                                onChange={(e) => setLogo(e.target.value)}
                                className={adminStyles.formInput}
                                placeholder="https://example.com/logo.png"
                            />
                        </div>

                        <div className={adminStyles.formGroup}>
                            <label className={adminStyles.formLabel}>Primary Color</label>
                            <div className={styles.colorPicker}>
                                <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className={styles.colorInput}
                                />
                                <input
                                    type="text"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className={adminStyles.formInput}
                                    placeholder="#6366f1"
                                />
                            </div>
                        </div>

                        <div className={adminStyles.formGroup}>
                            <label className={adminStyles.formLabel}>Secondary Color</label>
                            <div className={styles.colorPicker}>
                                <input
                                    type="color"
                                    value={secondaryColor}
                                    onChange={(e) => setSecondaryColor(e.target.value)}
                                    className={styles.colorInput}
                                />
                                <input
                                    type="text"
                                    value={secondaryColor}
                                    onChange={(e) => setSecondaryColor(e.target.value)}
                                    className={adminStyles.formInput}
                                    placeholder="#ec4899"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <h3 className={styles.subsectionTitle}>Footer Settings</h3>
                    <div className={styles.settingsGrid}>
                        <div className={adminStyles.formGroup} style={{ gridColumn: '1 / -1' }}>
                            <label className={adminStyles.formLabel}>Footer Description</label>
                            <textarea
                                value={footerText}
                                onChange={(e) => setFooterText(e.target.value)}
                                className={adminStyles.formInput}
                                placeholder="AI-Driven Tools to Enhance Visibility & Improve Digital Engagement."
                                rows={3}
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <div className={adminStyles.formGroup} style={{ gridColumn: '1 / -1' }}>
                            <label className={adminStyles.formLabel}>Copyright Text</label>
                            <input
                                type="text"
                                value={copyrightText}
                                onChange={(e) => setCopyrightText(e.target.value)}
                                className={adminStyles.formInput}
                                placeholder="© 2025 SMM Panel. All rights reserved."
                            />
                        </div>

                        <div className={adminStyles.formGroup}>
                            <label className={adminStyles.formLabel}>Facebook URL</label>
                            <input
                                type="url"
                                value={facebookUrl}
                                onChange={(e) => setFacebookUrl(e.target.value)}
                                className={adminStyles.formInput}
                                placeholder="https://facebook.com/yourpage"
                            />
                        </div>

                        <div className={adminStyles.formGroup}>
                            <label className={adminStyles.formLabel}>Twitter URL</label>
                            <input
                                type="url"
                                value={twitterUrl}
                                onChange={(e) => setTwitterUrl(e.target.value)}
                                className={adminStyles.formInput}
                                placeholder="https://twitter.com/yourhandle"
                            />
                        </div>

                        <div className={adminStyles.formGroup}>
                            <label className={adminStyles.formLabel}>Instagram URL</label>
                            <input
                                type="url"
                                value={instagramUrl}
                                onChange={(e) => setInstagramUrl(e.target.value)}
                                className={adminStyles.formInput}
                                placeholder="https://instagram.com/yourprofile"
                            />
                        </div>

                        <div className={adminStyles.formGroup}>
                            <label className={adminStyles.formLabel}>LinkedIn URL</label>
                            <input
                                type="url"
                                value={linkedinUrl}
                                onChange={(e) => setLinkedinUrl(e.target.value)}
                                className={adminStyles.formInput}
                                placeholder="https://linkedin.com/company/yourcompany"
                            />
                        </div>
                    </div>


                    {/* Quick Links Management */}
                    <h3 className={styles.subsectionTitle}>Quick Links</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        Manage links displayed in the footer's Quick Links section
                    </p>
                    <div className={styles.linkManagementSection}>
                        {quickLinks.map((link, index) => (
                            <div key={index} className={styles.linkRow}>
                                <div className={adminStyles.formGroup} style={{ margin: 0 }}>
                                    <input
                                        type="text"
                                        value={link.label}
                                        onChange={(e) => updateQuickLink(index, 'label', e.target.value)}
                                        className={adminStyles.formInput}
                                        placeholder="Link Label (e.g., Services)"
                                    />
                                </div>
                                <div className={adminStyles.formGroup} style={{ margin: 0 }}>
                                    <input
                                        type="text"
                                        value={link.url}
                                        onChange={(e) => updateQuickLink(index, 'url', e.target.value)}
                                        className={adminStyles.formInput}
                                        placeholder="URL (e.g., /services)"
                                    />
                                </div>
                                <button
                                    onClick={() => removeQuickLink(index)}
                                    className={styles.deleteButton}
                                    title="Delete link"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                        <button onClick={addQuickLink} className={styles.addButton}>
                            + Add Quick Link
                        </button>
                    </div>


                    {/* Legal Links Management */}
                    <h3 className={styles.subsectionTitle}>Legal Links</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        Manage links displayed in the footer's Legal section
                    </p>
                    <div className={styles.linkManagementSection}>
                        {legalLinks.map((link, index) => (
                            <div key={index} className={styles.linkRow}>
                                <div className={adminStyles.formGroup} style={{ margin: 0 }}>
                                    <input
                                        type="text"
                                        value={link.label}
                                        onChange={(e) => updateLegalLink(index, 'label', e.target.value)}
                                        className={adminStyles.formInput}
                                        placeholder="Link Label (e.g., Terms of Service)"
                                    />
                                </div>
                                <div className={adminStyles.formGroup} style={{ margin: 0 }}>
                                    <input
                                        type="text"
                                        value={link.url}
                                        onChange={(e) => updateLegalLink(index, 'url', e.target.value)}
                                        className={adminStyles.formInput}
                                        placeholder="URL (e.g., /terms)"
                                    />
                                </div>
                                <button
                                    onClick={() => removeLegalLink(index)}
                                    className={styles.deleteButton}
                                    title="Delete link"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                        <button onClick={addLegalLink} className={styles.addButton}>
                            + Add Legal Link
                        </button>
                    </div>

                    {/* Contact Information */}
                    <h3 className={styles.subsectionTitle}>Contact Information</h3>
                    <div className={styles.settingsGrid}>
                        <div className={adminStyles.formGroup}>
                            <label className={adminStyles.formLabel}>Contact Email</label>
                            <input
                                type="email"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                className={adminStyles.formInput}
                                placeholder="support@smmpanel.com"
                            />
                        </div>
                        <div className={adminStyles.formGroup}>
                            <label className={adminStyles.formLabel}>Contact Phone (Optional)</label>
                            <input
                                type="tel"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                className={adminStyles.formInput}
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                    </div>

                    {/* Signup Bonus Settings */}
                    <h3 className={styles.subsectionTitle}>Signup Bonus</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        Reward new users with a bonus amount when they register
                    </p>
                    <div className={styles.settingsGrid}>
                        <div className={adminStyles.formGroup}>
                            <label className={adminStyles.formLabel}>
                                <input
                                    type="checkbox"
                                    checked={signupBonusEnabled}
                                    onChange={(e) => setSignupBonusEnabled(e.target.checked)}
                                    style={{ marginRight: '0.5rem' }}
                                />
                                Enable Signup Bonus
                            </label>
                        </div>
                        {signupBonusEnabled && (
                            <div className={adminStyles.formGroup}>
                                <label className={adminStyles.formLabel}>Bonus Amount ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={signupBonusAmount}
                                    onChange={(e) => setSignupBonusAmount(e.target.value)}
                                    className={adminStyles.formInput}
                                    placeholder="10.00"
                                />
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                    New users will receive this amount in their wallet upon registration
                                </p>
                            </div>
                        )}
                    </div>

                    <button onClick={handleSave} className={styles.saveButton}>
                        Save Branding Settings
                    </button>
                </div>
            )}

            {/* SMTP Tab */}
            {activeTab === 'smtp' && (
                <div className={styles.settingsSection}>
                    <h2 className={styles.sectionTitle}>SMTP Configuration</h2>
                    <p className={styles.sectionDescription}>
                        Configure email server settings for sending notifications
                    </p>

                    <div className={styles.settingsGrid}>
                        <div className={styles.settingRow}>
                            <div className={adminStyles.formGroup}>
                                <label className={adminStyles.formLabel}>SMTP Host</label>
                                <input
                                    type="text"
                                    value={smtpHost}
                                    onChange={(e) => setSmtpHost(e.target.value)}
                                    className={adminStyles.formInput}
                                    placeholder="smtp.gmail.com"
                                />
                            </div>

                            <div className={adminStyles.formGroup}>
                                <label className={adminStyles.formLabel}>SMTP Port</label>
                                <input
                                    type="text"
                                    value={smtpPort}
                                    onChange={(e) => setSmtpPort(e.target.value)}
                                    className={adminStyles.formInput}
                                    placeholder="587"
                                />
                            </div>
                        </div>

                        <div className={adminStyles.formGroup}>
                            <label className={adminStyles.formLabel}>SMTP Username</label>
                            <input
                                type="text"
                                value={smtpUser}
                                onChange={(e) => setSmtpUser(e.target.value)}
                                className={adminStyles.formInput}
                                placeholder="your-email@gmail.com"
                            />
                        </div>

                        <div className={adminStyles.formGroup}>
                            <label className={adminStyles.formLabel}>SMTP Password</label>
                            <input
                                type="password"
                                value={smtpPassword}
                                onChange={(e) => setSmtpPassword(e.target.value)}
                                className={adminStyles.formInput}
                                placeholder="••••••••"
                            />
                        </div>

                        <div className={adminStyles.formGroup}>
                            <label className={adminStyles.formLabel}>From Email Address</label>
                            <input
                                type="email"
                                value={smtpFrom}
                                onChange={(e) => setSmtpFrom(e.target.value)}
                                className={adminStyles.formInput}
                                placeholder="noreply@smmpanel.com"
                            />
                        </div>
                    </div>

                    <button onClick={handleSave} className={styles.saveButton}>
                        Save SMTP Settings
                    </button>
                </div>
            )}

            {/* Email Templates Tab */}
            {activeTab === 'email-templates' && (
                <div className={styles.settingsSection}>
                    <h2 className={styles.sectionTitle}>Email Templates</h2>
                    <p className={styles.sectionDescription}>
                        Customize email templates for different notifications
                    </p>

                    <div className={styles.settingsGrid}>
                        <div className={adminStyles.formGroup}>
                            <label className={adminStyles.formLabel}>Welcome Email Template</label>
                            <textarea
                                className={adminStyles.formTextarea}
                                placeholder="Welcome {{name}}! Thank you for joining..."
                                rows={6}
                            />
                        </div>

                        <div className={adminStyles.formGroup}>
                            <label className={adminStyles.formLabel}>Order Confirmation Template</label>
                            <textarea
                                className={adminStyles.formTextarea}
                                placeholder="Your order #{{orderId}} has been confirmed..."
                                rows={6}
                            />
                        </div>

                        <div className={adminStyles.formGroup}>
                            <label className={adminStyles.formLabel}>Order Completed Template</label>
                            <textarea
                                className={adminStyles.formTextarea}
                                placeholder="Your order #{{orderId}} has been completed..."
                                rows={6}
                            />
                        </div>
                    </div>

                    <button onClick={handleSave} className={styles.saveButton}>
                        Save Email Templates
                    </button>
                </div>
            )}

            {/* Payment Gateways Tab */}
            {activeTab === 'payment-gateways' && (
                <div>
                    {/* Yoco */}
                    <div className={styles.settingsSection}>
                        <div className={styles.gatewayHeader}>
                            <div className={styles.gatewayInfo}>
                                <h2 className={styles.gatewayName}>Yoco Payments</h2>
                                <p className={styles.gatewayDescription}>
                                    South African payment gateway - https://www.yoco.com
                                </p>
                            </div>
                            <label className={styles.toggleSwitch}>
                                <input
                                    type="checkbox"
                                    checked={yocoEnabled}
                                    onChange={(e) => setYocoEnabled(e.target.checked)}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>

                        {yocoEnabled && (
                            <div className={styles.gatewayFields}>
                                <div className={styles.settingsGrid}>
                                    <div className={adminStyles.formGroup}>
                                        <label className={adminStyles.formLabel}>Yoco Public Key</label>
                                        <input
                                            type="text"
                                            value={yocoPublicKey}
                                            onChange={(e) => setYocoPublicKey(e.target.value)}
                                            className={adminStyles.formInput}
                                            placeholder="pk_live_..."
                                        />
                                        <p className={styles.helpText}>Your Yoco public API key for client-side integration</p>
                                    </div>

                                    <div className={adminStyles.formGroup}>
                                        <label className={adminStyles.formLabel}>Yoco Secret Key</label>
                                        <input
                                            type="password"
                                            value={yocoSecretKey}
                                            onChange={(e) => setYocoSecretKey(e.target.value)}
                                            className={adminStyles.formInput}
                                            placeholder="sk_live_..."
                                        />
                                        <p className={styles.helpText}>Your Yoco secret API key for server-side operations</p>
                                    </div>
                                </div>

                                <button onClick={handleSave} className={styles.saveButton}>
                                    Save Yoco Settings
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Zapper */}
                    <div className={styles.settingsSection}>
                        <div className={styles.gatewayHeader}>
                            <div className={styles.gatewayInfo}>
                                <h2 className={styles.gatewayName}>Zapper Payments</h2>
                                <p className={styles.gatewayDescription}>
                                    QR code payment solution - https://www.zapper.com
                                </p>
                            </div>
                            <label className={styles.toggleSwitch}>
                                <input
                                    type="checkbox"
                                    checked={zapperEnabled}
                                    onChange={(e) => setZapperEnabled(e.target.checked)}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>

                        {zapperEnabled && (
                            <div className={styles.gatewayFields}>
                                <div className={styles.settingsGrid}>
                                    <div className={adminStyles.formGroup}>
                                        <label className={adminStyles.formLabel}>Merchant ID</label>
                                        <input
                                            type="text"
                                            value={zapperMerchantId}
                                            onChange={(e) => setZapperMerchantId(e.target.value)}
                                            className={adminStyles.formInput}
                                            placeholder="Your Zapper Merchant ID"
                                        />
                                    </div>

                                    <div className={adminStyles.formGroup}>
                                        <label className={adminStyles.formLabel}>Site ID</label>
                                        <input
                                            type="text"
                                            value={zapperSiteId}
                                            onChange={(e) => setZapperSiteId(e.target.value)}
                                            className={adminStyles.formInput}
                                            placeholder="Your Zapper Site ID"
                                        />
                                    </div>

                                    <div className={adminStyles.formGroup}>
                                        <label className={adminStyles.formLabel}>API Key</label>
                                        <input
                                            type="password"
                                            value={zapperApiKey}
                                            onChange={(e) => setZapperApiKey(e.target.value)}
                                            className={adminStyles.formInput}
                                            placeholder="Your Zapper API Key"
                                        />
                                    </div>
                                </div>

                                <button onClick={handleSave} className={styles.saveButton}>
                                    Save Zapper Settings
                                </button>
                            </div>
                        )}
                    </div>

                    {/* PayGenius */}
                    <div className={styles.settingsSection}>
                        <div className={styles.gatewayHeader}>
                            <div className={styles.gatewayInfo}>
                                <h2 className={styles.gatewayName}>PayGenius</h2>
                                <p className={styles.gatewayDescription}>
                                    South African payment gateway - https://www.paygenius.co.za
                                </p>
                            </div>
                            <label className={styles.toggleSwitch}>
                                <input
                                    type="checkbox"
                                    checked={paygeniusEnabled}
                                    onChange={(e) => setPaygeniusEnabled(e.target.checked)}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>

                        {paygeniusEnabled && (
                            <div className={styles.gatewayFields}>
                                <div className={styles.settingsGrid}>
                                    <div className={adminStyles.formGroup}>
                                        <label className={adminStyles.formLabel}>Merchant ID</label>
                                        <input
                                            type="text"
                                            value={paygeniusMerchantId}
                                            onChange={(e) => setPaygeniusMerchantId(e.target.value)}
                                            className={adminStyles.formInput}
                                            placeholder="Your PayGenius Merchant ID"
                                        />
                                    </div>

                                    <div className={adminStyles.formGroup}>
                                        <label className={adminStyles.formLabel}>API Key</label>
                                        <input
                                            type="password"
                                            value={paygeniusApiKey}
                                            onChange={(e) => setPaygeniusApiKey(e.target.value)}
                                            className={adminStyles.formInput}
                                            placeholder="Your PayGenius API Key"
                                        />
                                    </div>
                                </div>

                                <button onClick={handleSave} className={styles.saveButton}>
                                    Save PayGenius Settings
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
