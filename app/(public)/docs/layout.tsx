'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Search } from 'lucide-react';
import { Sidebar } from '@/components/docs/Sidebar';
import { Navbar } from '@/components/docs/Navbar';
import { ProgressBar } from '@/components/docs/ProgressBar';

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setIsClient(true);
    }, []);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const sidebar = document.getElementById('mobile-sidebar');
            const toggleButton = document.querySelector('[aria-label="Open sidebar"]');

            if (sidebarOpen &&
                sidebar &&
                !sidebar.contains(event.target as Node) &&
                toggleButton &&
                !toggleButton.contains(event.target as Node)) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [sidebarOpen]);

    // Close sidebar when window is resized to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
            <Navbar />
            <ProgressBar />

            <div className="container mx-auto px-4 pt-24">
                {/* Mobile sidebar toggle */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden fixed top-20 left-4 z-40 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                    aria-label="Open sidebar"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Breadcrumb */}
                <div className="mb-8 hidden lg:flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <button
                        onClick={scrollToTop}
                        className="hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer transition-colors"
                    >
                        Docs
                    </button>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <button
                        onClick={scrollToTop}
                        className="hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer transition-colors"
                    >
                        AuthPlus
                    </button>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="text-gray-900 dark:text-gray-200 font-medium">Documentation</span>
                </div>

                <div className="flex">
                    {/* Sidebar for desktop */}
                    <div className="hidden lg:block w-64 flex-shrink-0 pr-8">
                        <div className="sticky top-32 h-[calc(100vh-8rem)] overflow-y-auto py-2">
                            <Sidebar />

                            {/* Desktop search */}
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                                    <Search className="w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search docs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="ml-2 bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile sidebar overlay */}
                    <AnimatePresence>
                        {sidebarOpen && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                                    onClick={() => setSidebarOpen(false)}
                                />
                                <motion.div
                                    id="mobile-sidebar"
                                    initial={{ x: -300 }}
                                    animate={{ x: 0 }}
                                    exit={{ x: -300 }}
                                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                                    className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 z-50 lg:hidden shadow-2xl overflow-y-auto flex flex-col"
                                >
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center space-x-2">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                    <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 rotate-180" />
                                                </div>
                                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                    Navigation
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setSidebarOpen(false)}
                                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <Sidebar />
                                    </div>

                                    {/* Mobile search */}
                                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
                                        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                                            <Search className="w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search docs..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="ml-2 bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Main content */}
                    <main className="flex-1 max-w-4xl mx-auto animate-in">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}