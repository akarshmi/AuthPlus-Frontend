'use client';
import { useState, useEffect, useRef } from 'react';
import {
    Menu, X, Lock, Shield, Fingerprint, Users, Check, ChevronRight, Zap, Globe,
    Github, Twitter, Linkedin, ArrowRight, Code, Database, Key, Sun, Moon,
    Sparkles, FileText, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
// import { ServiceStatusCard } from "@/components/service-status-";
import { ArrowUpRight } from 'lucide-react';

interface NavbarProps {
    theme: string; // or 'light' | 'dark'
    toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeLink, setActiveLink] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);

            const sections = ['features', 'stats', 'enterprise', 'docs'];
            const scrollPos = window.scrollY + 100;

            sections.forEach(section => {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
                        setActiveLink(section);
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', href: '#features', icon: Sparkles },
        { name: 'Stats', href: '#stats', icon: TrendingUp },
        { name: 'Enterprise', href: '#enterprise', icon: Shield },
        { name: 'Docs', href: '/docs', icon: FileText }
    ];

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
            setIsOpen(false);
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-500 ${isScrolled
                ? 'bg-gray-50/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border-gray-200 dark:border-white/10 shadow-lg'
                : 'bg-transparent border-transparent'
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 cursor-pointer group"
                    >
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 5
                            }}
                            className="w-9 h-9 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center shadow-lg"
                        >
                            <Lock className="w-5 h-5 text-white dark:text-black" />
                        </motion.div>
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-lg font-bold text-gray-900 dark:text-white"
                        >
                            AuthPlus
                        </motion.span>
                    </motion.div>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link, index) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="ghost"
                                    onClick={() => scrollToSection(link.href)}
                                    className={`relative text-sm font-medium px-4 py-2 rounded-lg transition-all ${activeLink === link.href.substring(1)
                                        ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                                        }`}
                                >
                                    <link.icon className="w-4 h-4 mr-2" />
                                    {link.name}
                                </Button>
                            </motion.div>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 180 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? (
                                <Moon className="w-4 h-4 text-gray-700" />
                            ) : (
                                <Sun className="w-4 h-4 text-gray-300" />
                            )}
                        </motion.button>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                            >
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                size="sm"
                                className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                            >
                                <Link href="/login">Sign In</Link>
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </motion.div>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="md:hidden"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-700 dark:text-gray-300"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </motion.div>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-gray-200 dark:border-white/10 overflow-hidden"
                        >
                            <div className="py-4 space-y-2">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Button
                                            variant="ghost"
                                            onClick={() => scrollToSection(link.href)}
                                            className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                                        >
                                            <link.icon className="w-4 h-4 mr-3" />
                                            {link.name}
                                        </Button>
                                    </motion.div>
                                ))}
                                <div className="pt-4 space-y-3 border-t border-gray-200 dark:border-white/10">
                                    <Button
                                        variant="outline"
                                        className="w-full border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                                    >
                                        <Link href="/login">Sign In</Link>
                                    </Button>
                                    <Button
                                        className="w-full bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                                    >
                                        <Link href="/signup">Sign Up</Link>
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

const HeroSection = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        // set initial size after mount
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const parallaxX =
        windowSize.width > 0
            ? (mousePosition.x / windowSize.width - 0.5) * 20
            : 0;

    const parallaxY =
        windowSize.height > 0
            ? (mousePosition.y / windowSize.height - 0.5) * 20
            : 0;

    return (
        <section className="relative pt-32 pb-20 px-4">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 dark:from-blue-500/5 via-transparent to-transparent pointer-events-none" />

            <div className="container mx-auto max-w-5xl relative">
                <div className="text-center space-y-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 10, stiffness: 100 }}
                    >
                        <Badge className="px-4 py-1.5 text-sm font-medium bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-gray-300 border-0 shadow-lg">
                            <Shield className="w-3.5 h-3.5 mr-2" />
                            Trusted by 10,000+ developers worldwide
                        </Badge>
                    </motion.div>

                    <div className="space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white"
                        >
                            Authentication that
                            <motion.span
                                className="block bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
                                style={{
                                    transform: `translateX(${parallaxX}px) translateY(${parallaxY}px)`,
                                }}
                            >
                                just works
                            </motion.span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
                        >
                            Production-ready authentication infrastructure. Deploy in minutes with OAuth, MFA, passwordless, and advanced security features built-in.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button size="lg" className="text-base bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 shadow-xl min-w-[200px] group">
                                <span className="flex items-center">
                                    Start Building Free
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="ml-2"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </motion.div>
                                </span>
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button onClick={() => window.location.href = '/docs'} variant="outline" size="lg" className="text-base min-w-[200px] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400">
                                <Code className="mr-2 h-5 w-5" />
                                View Docs
                            </Button>
                        </motion.div>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-sm text-gray-500 dark:text-gray-500"
                    >
                        No credit card required · Open Source · Free forever
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="pt-8"
                    >
                        <Card className="border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {[
                                        { icon: Shield, text: 'SOC 2 Compliant', subtext: 'Type II' },
                                        { icon: Globe, text: 'OAuth 2.0 & OIDC', subtext: 'Full support' },
                                        { icon: Zap, text: '99.99% Uptime', subtext: 'SLA guarantee' },
                                        { icon: Database, text: 'GDPR Ready', subtext: 'EU compliant' }
                                    ].map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ delay: 1 + idx * 0.1, type: "spring" }}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all group"
                                        >
                                            <motion.div
                                                className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 dark:group-hover:bg-blue-500/20 transition-colors"
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                            </motion.div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.text}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500">{item.subtext}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>

            <motion.div
                animate={{
                    y: [0, -10, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            >
                <div className="w-6 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2" />
                </div>
            </motion.div>
        </section>
    );
};

const FeaturesSection = () => {
    const features = [
        {
            icon: Lock,
            title: 'Enterprise Security',
            description: 'Bank-level encryption with httpOnly cookies, short-lived JWTs, and automatic token rotation. OWASP compliant by default.',
            highlights: ['AES-256 encryption', 'Auto token refresh', 'Session management']
        },
        {
            icon: Fingerprint,
            title: 'Multi-Factor Authentication',
            description: 'Comprehensive MFA support including TOTP authenticators, SMS/Email OTP, biometric authentication, and recovery codes.',
            highlights: ['TOTP support', 'SMS & Email OTP', 'Backup codes']
        },
        {
            icon: Users,
            title: 'Universal Social Login',
            description: 'Pre-built integrations with 20+ OAuth providers. Google, GitHub, Microsoft, Apple, and more with zero configuration required.',
            highlights: ['20+ providers', 'One-click setup', 'Custom OAuth']
        },
        {
            icon: Key,
            title: 'Passwordless Authentication',
            description: 'Magic links, WebAuthn, and biometric login options. Improve conversion rates while enhancing security.',
            highlights: ['Magic links', 'WebAuthn/FIDO2', 'Biometric support']
        },
        {
            icon: Shield,
            title: 'Advanced Security',
            description: 'Rate limiting, brute force protection, device fingerprinting, and anomaly detection powered by machine learning.',
            highlights: ['Rate limiting', 'DDoS protection', 'Anomaly detection']
        },
        {
            icon: Code,
            title: 'Developer Experience',
            description: 'Clean SDKs for all major platforms. Comprehensive documentation, code examples, and dedicated developer support.',
            highlights: ['10+ SDKs', 'Full documentation', '24/7 support']
        }
    ];

    return (
        <section id="features" className="py-24 px-4 bg-gray-100 dark:bg-white/5">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center space-y-4 mb-16"
                >
                    <Badge className="text-sm border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300">
                        Features
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Everything you need to authenticate
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Complete authentication infrastructure with enterprise-grade security and developer-friendly APIs.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                            whileHover={{ y: -10 }}
                        >
                            <Card className="group hover:shadow-xl transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 h-full">
                                <CardHeader>
                                    <motion.div
                                        className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 dark:group-hover:bg-blue-500/20 transition-colors"
                                        whileHover={{
                                            rotate: 360,
                                            scale: 1.1
                                        }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <feature.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                    </motion.div>
                                    <CardTitle className="text-xl text-gray-900 dark:text-white">{feature.title}</CardTitle>
                                    <CardDescription className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
                                        {feature.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {feature.highlights.map((highlight, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ x: -20, opacity: 0 }}
                                                whileInView={{ x: 0, opacity: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.1 + idx * 0.05 }}
                                                className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                                            >
                                                <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                                                {highlight}
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const EnterpriseSection = () => {
    return (
        <section id="enterprise" className="py-24 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <Badge className="px-4 py-1.5 text-sm font-medium bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-gray-300">
                                <Shield className="w-3.5 h-3.5 mr-2" />
                                Enterprise Grade
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Trusted by teams building the future
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
                                From startups to Fortune 500 companies, AuthPlus provides the security and reliability your business needs.
                            </p>
                        </motion.div>

                        {/* Service Status Card placed here - integrates naturally */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            {/* <ServiceStatusCard
                                variant="compact"
                                className="max-w-md"
                                showCloseButton={false}
                            /> */}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="pt-4"
                        >
                            <div className="space-y-3">
                                {[
                                    'Dedicated support with 24/7 SLA',
                                    'Custom security requirements',
                                    'Enterprise onboarding & training',
                                    'Compliance assistance (SOC 2, GDPR, HIPAA)'
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center text-gray-700 dark:text-gray-300">
                                        <Check className="w-5 h-5 mr-3 text-green-500" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <Card className="border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-2xl">
                            <CardContent className="p-8">
                                <div className="space-y-6">
                                    <div className="text-center space-y-2">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Enterprise Plan</h3>
                                        <p className="text-gray-600 dark:text-gray-400">For large teams with advanced requirements</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/10">
                                            <div>
                                                <div className="text-4xl font-bold text-gray-900 dark:text-white">Custom</div>
                                                <div className="text-gray-600 dark:text-gray-400">Volume-based pricing</div>
                                            </div>
                                            <Badge variant="outline" className="text-sm">Contact Sales</Badge>
                                        </div>

                                        <div className="space-y-3">
                                            {[
                                                { feature: 'Unlimited MAUs', available: true },
                                                { feature: 'Custom OAuth providers', available: true },
                                                { feature: 'Advanced analytics', available: true },
                                                { feature: 'Priority support', available: true },
                                                { feature: 'SSO/SAML 2.0', available: true },
                                                { feature: 'Custom SLAs', available: true }
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between">
                                                    <span className="text-gray-700 dark:text-gray-300">{item.feature}</span>
                                                    {item.available ? (
                                                        <Check className="w-5 h-5 text-green-500" />
                                                    ) : (
                                                        <X className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button className="w-full bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
                                            Contact Sales
                                            <ArrowUpRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const StatsSection = () => {
    const [counts, setCounts] = useState([0, 0, 0, 0]);
    const targetCounts = [100, 99.99, 5, 50];
    const [hasAnimated, setHasAnimated] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);

                    const duration = 2000;
                    const steps = 60;
                    const stepDuration = duration / steps;

                    targetCounts.forEach((target, index) => {
                        let current = 0;
                        const increment = target / steps;

                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                current = target;
                                clearInterval(timer);
                            }

                            setCounts(prev => {
                                const newCounts = [...prev];
                                newCounts[index] = current;
                                return newCounts;
                            });
                        }, stepDuration);
                    });
                }
            },
            { threshold: 0.5 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [hasAnimated]);

    const stats = [
        {
            value: `${Math.round(counts[0])}K+`,
            label: 'Active Developers',
            subtext: 'Building with AuthPlus'
        },
        {
            value: `${counts[1].toFixed(2)}%`,
            label: 'Uptime SLA',
            subtext: 'Guaranteed reliability'
        },
        {
            value: `${Math.round(counts[2])}B+`,
            label: 'API Requests',
            subtext: 'Processed monthly'
        },
        {
            value: `<${Math.round(counts[3])}ms`,
            label: 'Response Time',
            subtext: 'Global average'
        }
    ];

    return (
        <section id="stats" ref={sectionRef} className="py-20 px-4">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Card className="border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
                        <CardContent className="p-8 md:p-12">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {stats.map((stat, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        whileHover={{ scale: 1.05 }}
                                        className="text-center space-y-2"
                                    >
                                        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                            {stat.value}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="font-semibold text-gray-900 dark:text-white">{stat.label}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-500">{stat.subtext}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
};

const CTASection = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!email || isSubmitting) return;

        setIsSubmitting(true);

        await new Promise(resolve => setTimeout(resolve, 1500));

        setHasSubmitted(true);
        setIsSubmitting(false);
        setEmail('');

        setTimeout(() => setHasSubmitted(false), 3000);
    };

    return (
        <section className="py-24 px-4 bg-gradient-to-b from-blue-500/5 dark:from-blue-500/5 to-transparent">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Card className="border-2 border-gray-200 dark:border-white/10 shadow-2xl bg-white dark:bg-white/5">
                        <CardContent className="p-12 text-center space-y-6">
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Ready to build secure apps?
                                </h2>
                                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                    Join thousands of developers who trust AuthPlus for their authentication needs. Start building in minutes.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" className="text-base bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 shadow-xl min-w-[200px] group">
                                        <span className="flex items-center">
                                            Start Free Trial
                                            <motion.div
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                                className="ml-2"
                                            >
                                                <ArrowRight className="h-5 w-5" />
                                            </motion.div>
                                        </span>
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button variant="outline" size="lg" className="text-base min-w-[200px] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400">
                                        Schedule Demo
                                    </Button>
                                </motion.div>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-500 pt-2">
                                Talk to our team · Custom enterprise pricing available
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
};

const Footer = () => {
    const [year] = useState(new Date().getFullYear());

    const footerLinks = {
        Product: ['Features', 'Pricing', 'Documentation', 'API Reference', 'Changelog', 'Status'],
        Company: ['About Us', 'Blog', 'Careers', 'Press Kit', 'Partners'],
        Resources: ['Community', 'Support', 'Tutorials', 'Guides', 'Examples'],
        Legal: ['Privacy Policy', 'Terms of Service', 'Security', 'Compliance', 'Licenses']
    };

    return (
        <footer className="border-t border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 py-16 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
                    <div className="col-span-2">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 mb-4"
                        >
                            <div className="w-9 h-9 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center shadow-lg">
                                <Lock className="w-5 h-5 text-white dark:text-black" />
                            </div>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">AuthPlus</span>
                        </motion.div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-xs">
                            Enterprise-grade authentication infrastructure for modern applications.
                        </p>
                        <div className="flex items-center gap-2">
                            {[Github, Twitter, Linkedin].map((Icon, idx) => (
                                <motion.a
                                    key={idx}
                                    whileHover={{ scale: 1.1 }}
                                    href="#"
                                    className="w-10 h-10 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                                >
                                    <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        © {year} AuthPlus, Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        {['Privacy', 'Terms', 'Cookies'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-sm text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};
export default function App() {
    const [theme, setTheme] = useState('dark');
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const savedTheme = 'dark';
        setTheme(savedTheme);
        document.documentElement.classList.add('dark');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors">
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 origin-left z-50"
                style={{ scaleX }}
            />

            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <HeroSection />
            <FeaturesSection />
            <StatsSection />
            <EnterpriseSection /> {/* Add this section */}
            <CTASection />
            <Footer />
        </div>
    );
}