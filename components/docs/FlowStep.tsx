'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FlowStepProps {
    number: number;
    title: string;
    description: string;
    children?: ReactNode;
}

export function FlowStep({ number, title, description, children }: FlowStepProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{number}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
            {children}
        </motion.div>
    );
}