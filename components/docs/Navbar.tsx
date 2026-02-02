'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Github, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

const navItems = [
    { label: 'Overview', href: '#introduction' },
    { label: 'Setup', href: '#setup-guide' },
    { label: 'Authentication Flow', href: '#authentication-flow' },
    { label: 'API', href: '#api-reference' },
    { label: 'Deployment', href: '#deployment' },
];

export function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setMounted(true);

        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (href: string) => {
        const id = href.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            setMobileMenuOpen(false);
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg'
                    : 'bg-white dark:bg-gray-900'
                } border-b border-gray-200 dark:border-gray-800`}
        >
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <Link
                            href="/docs"
                            className="flex items-center space-x-3 no-underline hover:opacity-80 transition-opacity"
                            onClick={(e) => {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        >
                            <div className="relative">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                AuthPlus
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-6 ml-8">
                            {navItems.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => scrollToSection(item.href)}
                                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all group-hover:w-full" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search docs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="ml-2 bg-transparent outline-none text-sm w-48 placeholder:text-gray-400"
                            />
                        </div>

                        {/* Theme toggle */}
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {!mounted ? (
                                <div className="w-5 h-5 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                            ) : theme === 'dark' ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>

                        {/* GitHub */}
                        <a
                            href="https://github.com/akarshmi/authplus"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="GitHub repository"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden mt-4 pb-2 overflow-hidden"
                    >
                        <div className="space-y-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => scrollToSection(item.href)}
                                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Mobile search */}
                        <div className="mt-3 px-3">
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
                )}
            </div>
        </motion.nav>
    );
}