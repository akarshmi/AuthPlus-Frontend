'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Home,
    Zap,
    Layers,
    Server,
    Globe,
    Key,
    Database,
    Cpu,
    Cloud,
    ChevronDown,
    BookOpen,
    Code,
    Settings,
    FileText,
    Lock,
    RefreshCw,
    Github,
    ExternalLink,
} from 'lucide-react';

interface SidebarItem {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    subsections?: Array<{ title: string; href: string }>;
}

const sections: SidebarItem[] = [
    {
        title: 'Introduction',
        icon: Home,
        href: '#introduction',
        subsections: [
            { title: 'Overview', href: '#introduction' },
            { title: 'Features', href: '#introduction' },
        ],
    },
    {
        title: 'Tech Stack',
        icon: Layers,
        href: '#tech-stack',
    },
    {
        title: 'Project Structure',
        icon: BookOpen,
        href: '#project-structure',
    },
    {
        title: 'Setup Guide',
        icon: Cpu,
        href: '#setup-guide',
        subsections: [
            { title: 'Backend', href: '#setup-guide' },
            { title: 'Frontend', href: '#setup-guide' },
            { title: 'Environment Variables', href: '#environment-variables' },
        ],
    },
    {
        title: 'Authentication Flow',
        icon: Key,
        href: '#authentication-flow',
        subsections: [
            { title: 'Login', href: '#authentication-flow' },
            { title: 'OAuth', href: '#authentication-flow' },
            { title: 'Refresh Token', href: '#authentication-flow' },
            { title: 'Logout', href: '#authentication-flow' },
        ],
    },
    {
        title: 'API Reference',
        icon: Database,
        href: '#api-reference',
        subsections: [
            { title: 'Endpoints', href: '#api-reference' },
            { title: 'Request/Response', href: '#api-reference' },
        ],
    },
    {
        title: 'Deployment',
        icon: Cloud,
        href: '#deployment',
        subsections: [
            { title: 'Production', href: '#deployment' },
            { title: 'Security', href: '#deployment' },
        ],
    },
];

export function Sidebar() {
    const [expandedSection, setExpandedSection] = useState<string | null>('Introduction');
    const [activeSection, setActiveSection] = useState<string>('#introduction');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        const handleScroll = () => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 100;

            sections.forEach((section) => {
                const sectionTop = (section as HTMLElement).offsetTop;
                const sectionHeight = (section as HTMLElement).offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    setActiveSection(`#${sectionId}`);

                    // Auto-expand the parent section
                    const parentSection = sections.find(s =>
                        s.href === `#${sectionId}` ||
                        s.subsections?.some(sub => sub.href === `#${sectionId}`)
                    );
                    if (parentSection) {
                        setExpandedSection(parentSection.title);
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = useCallback((href: string) => {
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

            // Update URL hash without scrolling
            if (isClient) {
                window.history.pushState(null, '', href);
            }
        }
    }, [isClient]);

    const isActive = useCallback((href: string) => {
        return activeSection === href;
    }, [activeSection]);

    const toggleSection = useCallback((title: string) => {
        setExpandedSection(expandedSection === title ? null : title);
    }, [expandedSection]);

    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                    Documentation
                </span>
            </div>

            <nav className="space-y-1">
                {sections.map((section) => {
                    const Icon = section.icon;
                    const isExpanded = expandedSection === section.title;
                    const sectionActive = isActive(section.href);

                    return (
                        <div key={section.title} className="space-y-1">
                            <button
                                onClick={() => {
                                    if (section.subsections) {
                                        toggleSection(section.title);
                                    }
                                    scrollToSection(section.href);
                                }}
                                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${sectionActive
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon className={`w-4 h-4 ${sectionActive
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-gray-500 dark:text-gray-400'
                                        }`} />
                                    <span className="text-sm font-medium">
                                        {section.title}
                                    </span>
                                </div>
                                {section.subsections && (
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                                            } ${sectionActive ? 'text-blue-600' : 'text-gray-400'}`}
                                    />
                                )}
                            </button>

                            {/* Subsection */}
                            {isExpanded && section.subsections && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="ml-8 space-y-1 overflow-hidden"
                                >
                                    {section.subsections.map((subsection) => {
                                        const subsectionActive = isActive(subsection.href);

                                        return (
                                            <button
                                                key={subsection.title}
                                                onClick={() => scrollToSection(subsection.href)}
                                                className={`w-full text-left py-2 px-3 text-sm rounded transition-all duration-200 ${subsectionActive
                                                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                                    }`}
                                            >
                                                {subsection.title}
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Quick Links */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Quick Links
                </h4>
                <div className="space-y-2">
                    <a
                        href="https://github.com/akarshmi/authplus"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                    >
                        <div className="flex items-center space-x-2">
                            <Github className="w-4 h-4" />
                            <span>GitHub Repository</span>
                        </div>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>

                    <button
                        onClick={() => scrollToSection('#api-reference')}
                        className="flex items-center justify-between p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors w-full text-left group"
                    >
                        <div className="flex items-center space-x-2">
                            <Code className="w-4 h-4" />
                            <span>API Examples</span>
                        </div>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <button
                        onClick={() => scrollToSection('#deployment')}
                        className="flex items-center justify-between p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors w-full text-left group"
                    >
                        <div className="flex items-center space-x-2">
                            <Cloud className="w-4 h-4" />
                            <span>Deployment Guide</span>
                        </div>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>

            {/* Version Info */}
            <div className="pt-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <div className="flex items-center justify-between">
                        <span>Version</span>
                        <span className="font-medium">2.1.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Last updated</span>
                        <span>{new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}