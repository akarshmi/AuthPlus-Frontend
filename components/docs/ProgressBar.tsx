'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export function ProgressBar() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <motion.div
            className="fixed top-16 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-40"
            style={{
                scaleX,
                transformOrigin: '0%'
            }}
        />
    );
}