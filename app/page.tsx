export const dynamic = 'force-dynamic';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TestimonialSlider from '@/components/TestimonialSlider';
import FloatingSpinIcon from '@/components/spin/FloatingSpinIcon';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import styles from './page.module.css';

export default async function Home() {
  let platforms = [];

  try {
    platforms = await prisma.platform.findMany({
      include: { _count: { select: { services: true } } },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    // Database not set up yet - show empty state
    console.log('Database not accessible, showing empty state');
  }

  return (
    <div className={styles.homePage}>
      <div className="animated-bg"></div>
      <Navbar />
      <Hero />

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>50,000+</div>
            <div className={styles.statLabel}>Orders Completed</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>10,000+</div>
            <div className={styles.statLabel}>Happy Customers</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>99.9%</div>
            <div className={styles.statLabel}>Success Rate</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>24/7</div>
            <div className={styles.statLabel}>Support</div>
          </div>
        </div>
      </section>

      {/* Platforms Section - MOVED UP */}
      <section className={styles.platformsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Supported Platforms</h2>
          <p className={styles.sectionSubtitle}>
            Grow your presence across all major social media platforms
          </p>
        </div>

        {platforms.length > 0 ? (
          <div className={styles.platformsGrid}>
            {platforms.map((platform) => (
              <Link
                key={platform.id}
                href={`/services/${platform.slug}`}
                className={styles.platformCard}
              >
                <span className={styles.platformIcon}>{platform.icon}</span>
                <h3 className={styles.platformName}>{platform.name}</h3>
                <p className={styles.platformServices}>
                  {platform._count.services} {platform._count.services === 1 ? 'Service' : 'Services'} Available
                </p>
                <span className={styles.viewServicesBtn}>
                  Explore Services →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyStateTitle}>No platforms available yet</h3>
            <p className={styles.emptyStateText}>
              Please contact the administrator to set up services.
            </p>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorksSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSubtitle}>
            ✨ AI-Powered Social Media Growth in 3 Simple Steps
          </p>
        </div>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepIcon}>🎯</div>
            <h3 className={styles.stepTitle}>Choose Service</h3>
            <p className={styles.stepDescription}>
              Select platform & package that fits your needs
            </p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepIcon}>📝</div>
            <h3 className={styles.stepTitle}>Enter Details</h3>
            <p className={styles.stepDescription}>
              Provide link & quantity for your order
            </p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepIcon}>⚡</div>
            <h3 className={styles.stepTitle}>Instant Results</h3>
            <p className={styles.stepDescription}>
              Get instant delivery powered by AI technology
            </p>
          </div>
        </div>
      </section>

      {/* Features Section - FIXED TO 3x2 GRID */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why Choose Us</h2>
          <p className={styles.sectionSubtitle}>
            Premium features designed for your success
          </p>
        </div>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3 className={styles.featureTitle}>Instant Delivery</h3>
            <p className={styles.featureDescription}>
              Get results immediately after order placement
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3 className={styles.featureTitle}>Secure & Private</h3>
            <p className={styles.featureDescription}>
              Your data is protected with enterprise-grade security
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💯</div>
            <h3 className={styles.featureTitle}>High Quality</h3>
            <p className={styles.featureDescription}>
              No effect on account - 100% safe and natural
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💰</div>
            <h3 className={styles.featureTitle}>Best Prices</h3>
            <p className={styles.featureDescription}>
              Competitive pricing with quantity discounts
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📈</div>
            <h3 className={styles.featureTitle}>Real Growth</h3>
            <p className={styles.featureDescription}>
              Authentic engagement from real users
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎯</div>
            <h3 className={styles.featureTitle}>Targeted Results</h3>
            <p className={styles.featureDescription}>
              Results tailored according to your profile
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner - Website Traffic */}
      <section className={styles.ctaBanner} style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4), inset 0 0 100px rgba(255, 255, 255, 0.1)'
      }}>
        <div className={styles.ctaContent}>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.25)',
            borderRadius: '50px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: 'white',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            🚀 BOOST YOUR TRAFFIC
          </div>
          <h2 className={styles.ctaTitle}>Ready to Skyrocket Your Website Traffic?</h2>
          <p className={styles.ctaDescription}>
            Drive massive traffic to your website with our premium services. Get real visitors, dominate SEO rankings, and watch your conversions soar!
          </p>
          <div className={styles.ctaBenefits}>
            <div className={styles.ctaBenefit}>✓ 100% Real Human Traffic</div>
            <div className={styles.ctaBenefit}>✓ Geo-Targeted Visitors</div>
            <div className={styles.ctaBenefit}>✓ Boost SEO Rankings</div>
            <div className={styles.ctaBenefit}>✓ Increase Conversions</div>
          </div>
          <Link href="/services/website-traffic" className={styles.ctaButton}>
            Get Started Now →
          </Link>
        </div>
      </section>

      {/* CTA Banner - Coin Market Cap */}
      <section className={styles.ctaBanner} style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        boxShadow: '0 20px 60px rgba(240, 147, 251, 0.4), inset 0 0 100px rgba(255, 255, 255, 0.1)'
      }}>
        <div className={styles.ctaContent}>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.25)',
            borderRadius: '50px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: 'white',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            💎 CRYPTO GROWTH
          </div>
          <h2 className={styles.ctaTitle}>Dominate CoinMarketCap Rankings!</h2>
          <p className={styles.ctaDescription}>
            Skyrocket your crypto project's visibility on CoinMarketCap. Get more votes, followers, and massive community engagement to stand out from the crowd!
          </p>
          <div className={styles.ctaBenefits}>
            <div className={styles.ctaBenefit}>✓ CMC Votes & Watchlists</div>
            <div className={styles.ctaBenefit}>✓ Massive Visibility Boost</div>
            <div className={styles.ctaBenefit}>✓ Build Strong Community</div>
            <div className={styles.ctaBenefit}>✓ Dominate Rankings</div>
          </div>
          <Link href="/services/coinmarketcap" className={styles.ctaButton}>
            Get Started Now →
          </Link>
        </div>
      </section>

      {/* Testimonials Section - AUTO SLIDER */}
      <section className={styles.testimonialsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
          <p className={styles.sectionSubtitle}>
            Trusted by thousands of satisfied customers worldwide
          </p>
        </div>
        <TestimonialSlider />
      </section>

      {/* Trust Badges Section */}
      <section className={styles.trustSection}>
        <div className={styles.trustGrid}>
          <div className={styles.trustBadge}>
            <div className={styles.trustIcon}>🔒</div>
            <h4 className={styles.trustTitle}>Secure Payment</h4>
            <p className={styles.trustText}>SSL encrypted transactions</p>
          </div>
          <div className={styles.trustBadge}>
            <div className={styles.trustIcon}>💰</div>
            <h4 className={styles.trustTitle}>Money-Back Guarantee</h4>
            <p className={styles.trustText}>30-day refund policy</p>
          </div>
          <div className={styles.trustBadge}>
            <div className={styles.trustIcon}>💬</div>
            <h4 className={styles.trustTitle}>24/7 Support</h4>
            <p className={styles.trustText}>Always here to help</p>
          </div>
          <div className={styles.trustBadge}>
            <div className={styles.trustIcon}>⚡</div>
            <h4 className={styles.trustTitle}>Instant Results</h4>
            <p className={styles.trustText}>Fast delivery guaranteed</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionSubtitle}>
            Everything you need to know about our services
          </p>
        </div>
        <div className={styles.faqGrid}>
          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>How long does delivery take?</h3>
            <p className={styles.faqAnswer}>
              Most orders are delivered within 24 hours. Some services offer instant delivery, while others may take up to 48 hours depending on the quantity.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>Is it safe to use?</h3>
            <p className={styles.faqAnswer}>
              100% safe! We use industry-standard security measures and our services comply with platform guidelines. Your account will never be at risk.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>What payment methods do you accept?</h3>
            <p className={styles.faqAnswer}>
              We accept multiple payment gateways including credit cards, PayPal, cryptocurrency, and other popular payment methods for your convenience.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>What is your refund policy?</h3>
            <p className={styles.faqAnswer}>
              We offer a 30-day money-back guarantee. If you're not satisfied with our service, contact our support team for a full refund within 30 days of purchase.
            </p>
          </div>
        </div>
      </section>

      {/* Floating Spin Icon */}
      <FloatingSpinIcon />
    </div>
  );
}
