'use client';

import { useState, useEffect } from 'react';
import styles from './TestimonialSlider.module.css';

const testimonials = [
    {
        stars: 5,
        quote: "Amazing service! Got instant results for my Instagram page. The quality is outstanding and my engagement has skyrocketed!",
        author: "Sarah Johnson",
        platform: "Instagram Growth"
    },
    {
        stars: 5,
        quote: "Increased my Facebook page likes by 500% in just one week. The engagement is real and my business is thriving!",
        author: "Thabo Mbeki",
        platform: "Facebook Marketing"
    },
    {
        stars: 5,
        quote: "Best TikTok growth service ever! My videos are now reaching millions and my follower count is growing daily.",
        author: "Emily Rodriguez",
        platform: "TikTok Growth"
    },
    {
        stars: 5,
        quote: "My LinkedIn profile went from zero to hero! Got hundreds of connections and multiple job offers. Highly recommend!",
        author: "David van der Merwe",
        platform: "LinkedIn Growth"
    },
    {
        stars: 5,
        quote: "Snapchat views increased by 1000%! My stories are now trending and I'm getting brand deals left and right.",
        author: "Jessica Williams",
        platform: "Snapchat Views"
    },
    {
        stars: 5,
        quote: "X (Twitter) growth was phenomenal! My tweets are getting massive engagement and my follower count doubled in days.",
        author: "Sipho Nkosi",
        platform: "X (Twitter) Growth"
    },
    {
        stars: 5,
        quote: "Instagram reels are now viral! The service delivered exactly what they promised. My brand visibility is through the roof!",
        author: "Lerato Mokoena",
        platform: "Instagram Reels"
    },
    {
        stars: 5,
        quote: "Facebook ads are performing better than ever! The engagement boost helped my ROI increase by 300%.",
        author: "Michael Thompson",
        platform: "Facebook Ads"
    },
    {
        stars: 5,
        quote: "TikTok live streams are getting thousands of viewers now! The growth has been incredible and consistent.",
        author: "Zanele Dlamini",
        platform: "TikTok Live"
    },
    {
        stars: 5,
        quote: "LinkedIn company page is booming! We're getting quality leads and our B2B sales have increased significantly.",
        author: "James Anderson",
        platform: "LinkedIn Business"
    },
    {
        stars: 5,
        quote: "Snapchat premium content is selling like crazy! The subscriber boost was exactly what I needed to scale my business.",
        author: "Nomsa Khumalo",
        platform: "Snapchat Premium"
    },
    {
        stars: 5,
        quote: "X engagement is off the charts! My tweets are getting retweeted by influencers and my reach has expanded globally.",
        author: "Christopher Lee",
        platform: "X Engagement"
    },
    {
        stars: 5,
        quote: "Instagram story views went from 100 to 10,000! The growth is organic and my brand awareness has skyrocketed.",
        author: "Precious Ndlovu",
        platform: "Instagram Stories"
    },
    {
        stars: 5,
        quote: "Facebook group members increased by 5000 in a month! The community is active and engaged. Best investment ever!",
        author: "Robert Martinez",
        platform: "Facebook Groups"
    },
    {
        stars: 5,
        quote: "TikTok duets and stitches are trending! My content is being shared by thousands and I'm gaining followers daily.",
        author: "Ayanda Zulu",
        platform: "TikTok Engagement"
    },
    {
        stars: 5,
        quote: "LinkedIn articles are getting massive views! I'm now recognized as a thought leader in my industry.",
        author: "Amanda Foster",
        platform: "LinkedIn Content"
    },
    {
        stars: 5,
        quote: "Snapchat discover content is viral! My channel is growing exponentially and brands are reaching out for partnerships.",
        author: "Mandla Sithole",
        platform: "Snapchat Discover"
    },
    {
        stars: 5,
        quote: "X spaces are packed with listeners! The growth in my audio content has been phenomenal. Thank you!",
        author: "Daniel Brown",
        platform: "X Spaces"
    },
    {
        stars: 5,
        quote: "Instagram IGTV views are incredible! My long-form content is finally getting the attention it deserves.",
        author: "Thandiwe Mthembu",
        platform: "Instagram IGTV"
    },
    {
        stars: 5,
        quote: "Facebook watch videos are trending! My video content is reaching millions and monetization is through the roof!",
        author: "Pieter Botha",
        platform: "Facebook Watch"
    }
];

export default function TestimonialSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-slide every 5 seconds
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000); // Resume after 10s
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    // Show 3 testimonials at a time
    const visibleTestimonials = [
        testimonials[currentIndex],
        testimonials[(currentIndex + 1) % testimonials.length],
        testimonials[(currentIndex + 2) % testimonials.length],
    ];

    return (
        <div className={styles.sliderContainer}>
            <button onClick={prevSlide} className={styles.navButton} style={{ left: '0' }}>
                ‹
            </button>

            <div className={styles.testimonialTrack}>
                {visibleTestimonials.map((testimonial, index) => (
                    <div key={currentIndex + index} className={styles.testimonialCard}>
                        <div className={styles.stars}>
                            {'⭐'.repeat(testimonial.stars)}
                        </div>
                        <p className={styles.quote}>"{testimonial.quote}"</p>
                        <div className={styles.author}>
                            <strong>{testimonial.author}</strong>
                            <span>{testimonial.platform}</span>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={nextSlide} className={styles.navButton} style={{ right: '0' }}>
                ›
            </button>

            <div className={styles.dots}>
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
                    />
                ))}
            </div>
        </div>
    );
}
