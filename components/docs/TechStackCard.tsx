'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface TechStackCardProps {
    title: string;
    icon: ReactNode;
    items: { name: string; description: string }[];
    gradient: string;
}

export function TechStackCard({ title, icon, items, gradient }: TechStackCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`rounded-2xl p-6 ${gradient} bg-opacity-10 dark:bg-opacity-20 border border-gray-200 dark:border-gray-800 backdrop-blur-sm`}
        >
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">{icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {title}
                </h3>
            </div>
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.name} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                {item.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}