// app/unauthorized/page.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowLeft, Mail } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';
import Image from 'next/image';

// Minimal dark theme with black color scheme
// Using CSS modules for styling
import styles from './page.module.css';

export default function UnauthorizedPage() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    // React Spring animations
    const [fadeIn] = useSpring(() => ({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 600 }
    }), []);

    const [floatAnimation] = useSpring(() => ({
        from: { y: 0 },
        to: async (next) => {
            while (true) {
                await next({ y: -10 });
                await next({ y: 0 });
            }
        },
        config: { duration: 3000 },
        delay: 300,
    }), []);

    const handleGoToDashboard = () => {
        router.push('/dashboard');
    };

    const handleContactAdmin = () => {
        window.location.href = 'mailto:admin@example.com?subject=Access%20Request';
    };

    return (
        <animated.div style={fadeIn} className={styles.container}>
            <div className={styles.content}>
                {/* Animated GIF/Image for visual interest */}
                <animated.div style={floatAnimation} className={styles.imageContainer}>
                    <div className={styles.imageWrapper}>
                        {/* Using a gradient animation instead of actual GIF */}
                        <div className={styles.gradientAnimation}></div>
                        <Lock className={styles.lockIcon} />
                    </div>
                </animated.div>

                <div className={styles.textContent}>
                    <h1 className={styles.title}>
                        Access Restricted
                    </h1>

                    <p className={styles.description}>
                        Your current role doesn&apos;t include permissions for this area.
                        This is an intentional restriction based on your account&apos;s access level.
                    </p>

                    <div className={styles.actions}>
                        <button
                            onClick={handleGoToDashboard}
                            className={styles.primaryButton}
                            aria-label="Return to dashboard"
                        >
                            <ArrowLeft size={18} />
                            Back to Dashboard
                        </button>

                        <button
                            onClick={handleContactAdmin}
                            className={styles.secondaryButton}
                            aria-label="Contact administrator"
                        >
                            <Mail size={18} />
                            Request Access
                        </button>
                    </div>

                    <div className={styles.footer}>
                        <p className={styles.footerText}>
                            If you believe this is incorrect, contact your administrator
                            to discuss role adjustments.
                        </p>
                    </div>
                </div>
            </div>
        </animated.div>
    );
}