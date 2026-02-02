'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Key, Shield, Database, Globe } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

interface EnvironmentVariable {
    name: string;
    description: string;
    type: 'string' | 'number' | 'boolean' | 'secret';
    required: boolean;
    default?: string;
}

interface EnvironmentVariableGroupProps {
    title: string;
    variables: EnvironmentVariable[];
}

const groupIcons = {
    'JWT Configuration': Shield,
    'OAuth Providers': Globe,
    'Database': Database,
    'Frontend': Key,
};

export function EnvironmentVariableGroup({ title, variables }: EnvironmentVariableGroupProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const Icon = groupIcons[title as keyof typeof groupIcons] || Key;

    const getTypeColor = (type: EnvironmentVariable['type']) => {
        switch (type) {
            case 'string': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'number': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'boolean': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'secret': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        }
    };

    return (
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {title}
                    </span>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''
                        }`}
                />
            </button>

            <motion.div
                initial={false}
                animate={{ height: isExpanded ? 'auto' : 0 }}
                className="overflow-hidden"
            >
                <div className="p-4 space-y-4">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800">
                                    <th className="py-2 px-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        Variable
                                    </th>
                                    <th className="py-2 px-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        Description
                                    </th>
                                    <th className="py-2 px-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        Type
                                    </th>
                                    <th className="py-2 px-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        Required
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {variables.map((variable) => (
                                    <tr key={variable.name} className="border-b border-gray-100 dark:border-gray-800/50">
                                        <td className="py-3 px-3 font-mono text-sm text-gray-900 dark:text-gray-100">
                                            {variable.name}
                                        </td>
                                        <td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-400">
                                            {variable.description}
                                            {variable.default && (
                                                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                    Default: {variable.default}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3 px-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(variable.type)}`}>
                                                {variable.type}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3">
                                            {variable.required ? (
                                                <span className="text-sm text-red-600 dark:text-red-400">Required</span>
                                            ) : (
                                                <span className="text-sm text-gray-500 dark:text-gray-500">Optional</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Example Configuration
                        </h4>
                        <CodeBlock
                            language="env"
                            code={`# ${title}
${variables.map(v => `${v.name}=${v.type === 'secret' ? 'your-secret-here' : v.default || 'value'}`).join('\n')}`}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}