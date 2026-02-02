'use client';

import { ReactNode, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
    id: string;
    title: string;
    subtitle?: string;
    children: ReactNode;
    className?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
    ({ id, title, subtitle, children, className = '' }, ref) => {
        return (
            <motion.section
                ref={ref}
                id={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5 }}
                className={`py-12 scroll-mt-24 ${className}`}
            >
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-lg text-gray-600 dark:text-gray-400">{subtitle}</p>
                    )}
                </div>
                <div className="space-y-6">{children}</div>
            </motion.section>
        );
    }
);

Section.displayName = 'Section';