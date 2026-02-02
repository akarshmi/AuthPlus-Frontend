'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
    code: string;
    language: string;
    title?: string;
}

export function CodeBlock({ code, language, title }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg"
        >
            {title && (
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {title}
                    </span>
                    <button
                        onClick={handleCopy}
                        className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4" />
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                </div>
            )}
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    fontSize: '0.875rem',
                    background: '#1a1b26',
                }}
            >
                {code}
            </SyntaxHighlighter>
        </motion.div>
    );
}