'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Mail, Eye, EyeOff, Github, Chrome, User, ArrowLeft, Sun, Moon, CheckCircle, AlertCircle, Sparkles, Shield, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useAuth from "@/store/authStore"
// import { ServiceBanner } from "@/components/service-banner"

export const dynamic = 'force-dynamic';

const Alert = ({ type, message, onClose }: { type: 'success' | 'error'; message: string; onClose: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 right-4 z-50 max-w-md w-full mx-auto px-4"
        >
            <div className={`rounded-lg p-4 shadow-2xl border ${type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}>
                <div className="flex items-start">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="flex-shrink-0"
                    >
                        {type === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                    </motion.div>
                    <div className="ml-3 flex-1">
                        <p className={`text-sm font-medium ${type === 'success'
                            ? 'text-green-800 dark:text-green-200'
                            : 'text-red-800 dark:text-red-200'
                            }`}>
                            {message}
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="ml-3 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}

export default function SignUpPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { register, socialLogin, isAuth } = useAuth()

    const [isMounted, setIsMounted] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [theme, setTheme] = useState('dark')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [agreeToTerms, setAgreeToTerms] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<{
        name?: string
        email?: string
        password?: string
        terms?: string
        general?: string
    }>({})
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null)
    const [hoveredField, setHoveredField] = useState<string | null>(null)
    const [parallaxX, setParallaxX] = useState(0)
    const [parallaxY, setParallaxY] = useState(0)
    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    })

    const returnUrl = searchParams.get('returnUrl') || '/dashboard'

    // Handle client-side mounting
    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (isAuth) {
            router.push(returnUrl)
        }
    }, [isAuth, router, returnUrl])

    useEffect(() => {
        if (!isMounted) return

        const savedTheme = typeof window !== 'undefined'
            ? localStorage.getItem('theme') || 'dark'
            : 'dark'
        setTheme(savedTheme)
        if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', savedTheme === 'dark')
        }
    }, [isMounted])

    useEffect(() => {
        if (!isMounted) return

        const handleMouseMove = (e: MouseEvent) => {
            if (typeof window !== 'undefined') {
                const x = (e.clientX / window.innerWidth - 0.5) * 10
                const y = (e.clientY / window.innerHeight - 0.5) * 10
                setParallaxX(x)
                setParallaxY(y)
            }
        }

        if (typeof window !== 'undefined') {
            window.addEventListener('mousemove', handleMouseMove)
            return () => window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [isMounted])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', newTheme)
        }
        if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', newTheme === 'dark')
        }
    }

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const checkPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
        if (password.length < 8) return 'weak'

        const hasUpper = /[A-Z]/.test(password)
        const hasLower = /[a-z]/.test(password)
        const hasNumber = /\d/.test(password)
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

        const conditions = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length

        if (conditions >= 4 && password.length >= 12) return 'strong'
        if (conditions >= 3 && password.length >= 8) return 'medium'
        return 'weak'
    }

    const updatePasswordChecks = (password: string) => {
        setPasswordChecks({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        })
    }

    const handlePasswordChange = (password: string) => {
        setFormData({ ...formData, password })
        setPasswordStrength(password ? checkPasswordStrength(password) : null)
        updatePasswordChecks(password)
        setErrors({ ...errors, password: undefined, general: undefined })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setAlert(null)

        const newErrors: typeof errors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters'
        } else if (formData.name.trim().length > 50) {
            newErrors.name = 'Name must be less than 50 characters'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and number'
        }

        if (!agreeToTerms) {
            newErrors.terms = 'You must agree to the terms and privacy policy'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setAlert({ type: 'error', message: 'Please fix the errors in the form' })
            return
        }

        setIsLoading(true)

        try {
            const result = await register({
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            })

            if (result?.accessToken) {
                setAlert({ type: 'success', message: 'Account created! Redirecting...' })
                setTimeout(() => {
                    router.push(returnUrl)
                }, 500)
            } else {
                setAlert({ type: 'success', message: 'Account created! Please sign in.' })
                setTimeout(() => {
                    router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
                }, 1500)
            }

            setFormData({ name: '', email: '', password: '' })
            setAgreeToTerms(false)
            setPasswordStrength(null)
            setPasswordChecks({
                length: false,
                uppercase: false,
                lowercase: false,
                number: false,
                special: false
            })

        } catch (error: any) {
            console.error('Registration error:', error)

            let errorMessage = 'Registration failed. Please try again.'

            if (error.response?.status === 409) {
                setErrors({ email: 'This email is already registered' })
                errorMessage = 'This email is already registered. Please sign in instead.'
            } else if (error.response?.status === 400) {
                errorMessage = error.response?.data?.message || 'Invalid data. Please check your inputs.'
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message
            } else if (error.message?.toLowerCase().includes('network')) {
                errorMessage = 'Network error. Please check your connection.'
            }

            setAlert({ type: 'error', message: errorMessage })
            setErrors({ ...errors, general: errorMessage })

        } finally {
            setIsLoading(false)
        }
    }

    const handleSocialSignup = async (provider: string) => {
        try {
            setIsLoading(true)
            await socialLogin(provider.toLowerCase())

            setTimeout(() => {
                router.push(returnUrl)
            }, 500)

        } catch (error: any) {
            console.error(`${provider} signup error:`, error)
            setAlert({
                type: 'error',
                message: `${provider} signup failed. Please try again.`
            })
        } finally {
            setIsLoading(false)
        }
    }

    const floatingIcons = [
        { icon: Shield, x: '10%', y: '20%', delay: 0 },
        { icon: Lock, x: '85%', y: '15%', delay: 0.5 },
        { icon: User, x: '15%', y: '75%', delay: 1 },
        { icon: Sparkles, x: '80%', y: '70%', delay: 1.5 },
    ]

    const passwordRequirements = [
        { key: 'length', label: 'At least 8 characters', met: passwordChecks.length },
        { key: 'uppercase', label: 'One uppercase letter', met: passwordChecks.uppercase },
        { key: 'lowercase', label: 'One lowercase letter', met: passwordChecks.lowercase },
        { key: 'number', label: 'One number', met: passwordChecks.number },
        { key: 'special', label: 'One special character', met: passwordChecks.special },
    ]

    // Don't render anything until mounted on client
    if (!isMounted) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center px-6 py-10 transition-colors overflow-hidden relative">
                dismissible={true}
                autoDismiss={8000}
                position="center"
            /{'>'}

            <AnimatePresence>
                {alert && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                    />
                )}
            </AnimatePresence>

            {floatingIcons.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: [0.05, 0.1, 0.05],
                        y: [0, -15, 0]
                    }}
                    transition={{
                        duration: 3,
                        delay: item.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute pointer-events-none"
                    style={{ left: item.x, top: item.y }}
                >
                    <item.icon className="w-6 h-6 text-blue-600/10 dark:text-blue-400/10" />
                </motion.div>
            ))}

            <div className="w-full max-w-md relative">
                <motion.div
                    style={{
                        transform: `translate(${parallaxX * 0.3}px, ${parallaxY * 0.3}px)`,
                    }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <motion.div
                            whileHover={{ x: -3 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/"
                                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium group"
                            >
                                <motion.div
                                    animate={{ x: [0, -2, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="inline-block"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </motion.div>
                                <span>Back to home</span>
                            </Link>
                        </motion.div>

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
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="bg-white dark:bg-white/5 rounded-2xl shadow-2xl dark:shadow-none dark:border dark:border-white/10 p-8 relative overflow-hidden">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
                                initial={false}
                            />

                            <div className="relative z-10">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center space-x-2 mb-8"
                                >
                                    <motion.div
                                        animate={{
                                            rotate: [0, 10, -10, 0],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            repeatDelay: 5
                                        }}
                                        className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center shadow-lg"
                                    >
                                        <Lock className="w-5 h-5 text-white dark:text-black" />
                                    </motion.div>
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-xl font-bold text-gray-900 dark:text-white"
                                    >
                                        AuthPlus
                                    </motion.span>
                                </motion.div>

                                <div className="mb-8">
                                    <motion.h1
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                                    >
                                        Create account
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-sm text-gray-600 dark:text-gray-400"
                                    >
                                        Get started with your free account
                                    </motion.p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        onMouseEnter={() => setHoveredField('name')}
                                        onMouseLeave={() => setHoveredField(null)}
                                        className="space-y-1.5"
                                    >
                                        <label className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                                            Full name
                                        </label>
                                        <motion.div
                                            animate={{
                                                borderColor: errors.name ? '#ef4444' :
                                                    hoveredField === 'name' ? '#3b82f6' :
                                                        theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
                                                scale: hoveredField === 'name' ? 1.01 : 1
                                            }}
                                            className="relative border-2 rounded-lg h-12 flex items-center px-4 transition-all"
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: hoveredField === 'name' ? 1.1 : 1,
                                                    rotate: hoveredField === 'name' ? 5 : 0
                                                }}
                                            >
                                                <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                            </motion.div>
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, name: e.target.value })
                                                    setErrors({ ...errors, name: undefined, general: undefined })
                                                }}
                                                className="ml-3 flex-1 outline-none text-sm bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                                disabled={isLoading}
                                                autoComplete="name"
                                            />
                                        </motion.div>
                                        <AnimatePresence>
                                            {errors.name && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="text-xs text-red-500 overflow-hidden"
                                                >
                                                    {errors.name}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        onMouseEnter={() => setHoveredField('email')}
                                        onMouseLeave={() => setHoveredField(null)}
                                        className="space-y-1.5"
                                    >
                                        <label className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                                            Email
                                        </label>
                                        <motion.div
                                            animate={{
                                                borderColor: errors.email ? '#ef4444' :
                                                    hoveredField === 'email' ? '#3b82f6' :
                                                        theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
                                                scale: hoveredField === 'email' ? 1.01 : 1
                                            }}
                                            className="relative border-2 rounded-lg h-12 flex items-center px-4 transition-all"
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: hoveredField === 'email' ? 1.1 : 1,
                                                    rotate: hoveredField === 'email' ? 5 : 0
                                                }}
                                            >
                                                <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                            </motion.div>
                                            <input
                                                type="email"
                                                placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, email: e.target.value })
                                                    setErrors({ ...errors, email: undefined, general: undefined })
                                                }}
                                                className="ml-3 flex-1 outline-none text-sm bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                                disabled={isLoading}
                                                autoComplete="email"
                                            />
                                        </motion.div>
                                        <AnimatePresence>
                                            {errors.email && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="text-xs text-red-500 overflow-hidden"
                                                >
                                                    {errors.email}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 }}
                                        onMouseEnter={() => setHoveredField('password')}
                                        onMouseLeave={() => setHoveredField(null)}
                                        className="space-y-1.5"
                                    >
                                        <label className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                                            Password
                                        </label>
                                        <motion.div
                                            animate={{
                                                borderColor: errors.password ? '#ef4444' :
                                                    hoveredField === 'password' ? '#3b82f6' :
                                                        theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
                                                scale: hoveredField === 'password' ? 1.01 : 1
                                            }}
                                            className="relative border-2 rounded-lg h-12 flex items-center px-4 transition-all"
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: hoveredField === 'password' ? 1.1 : 1,
                                                    rotate: hoveredField === 'password' ? 5 : 0
                                                }}
                                            >
                                                <Lock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                            </motion.div>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Create a strong password"
                                                value={formData.password}
                                                onChange={(e) => handlePasswordChange(e.target.value)}
                                                className="ml-3 flex-1 outline-none text-sm bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                                disabled={isLoading}
                                                autoComplete="new-password"
                                            />
                                            <motion.button
                                                type="button"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                                disabled={isLoading}
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </motion.button>
                                        </motion.div>

                                        <AnimatePresence>
                                            {formData.password && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-2 space-y-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{
                                                                        width: passwordStrength === 'weak' ? '33%' :
                                                                            passwordStrength === 'medium' ? '66%' : '100%'
                                                                    }}
                                                                    transition={{ duration: 0.5 }}
                                                                    className={`h-full ${passwordStrength === 'weak' ? 'bg-red-500' :
                                                                        passwordStrength === 'medium' ? 'bg-yellow-500' :
                                                                            'bg-green-500'}`}
                                                                />
                                                            </div>
                                                            <motion.span
                                                                key={passwordStrength}
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                className={`text-xs font-medium ${passwordStrength === 'weak' ? 'text-red-500' :
                                                                    passwordStrength === 'medium' ? 'text-yellow-500' :
                                                                        'text-green-500'}`}
                                                            >
                                                                {passwordStrength && (passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1))}
                                                            </motion.span>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-1">
                                                            {passwordRequirements.map((req) => (
                                                                <motion.div
                                                                    key={req.key}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    className="flex items-center gap-1.5 text-xs"
                                                                >
                                                                    <motion.div
                                                                        animate={{ scale: req.met ? [1, 1.2, 1] : 1 }}
                                                                        transition={{ duration: 0.3 }}
                                                                    >
                                                                        <Check className={`w-3 h-3 ${req.met
                                                                            ? 'text-green-500 dark:text-green-400'
                                                                            : 'text-gray-300 dark:text-gray-600'}`}
                                                                        />
                                                                    </motion.div>
                                                                    <span className={req.met
                                                                        ? 'text-green-600 dark:text-green-400'
                                                                        : 'text-gray-500 dark:text-gray-400'}>
                                                                        {req.label}
                                                                    </span>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <AnimatePresence>
                                            {errors.password && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="text-xs text-red-500 overflow-hidden"
                                                >
                                                    {errors.password}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="pt-2"
                                    >
                                        <label className="flex items-start space-x-2 cursor-pointer group">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={agreeToTerms}
                                                    onChange={(e) => {
                                                        setAgreeToTerms(e.target.checked)
                                                        setErrors({ ...errors, terms: undefined })
                                                    }}
                                                    className={`w-4 h-4 mt-0.5 rounded border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 ${errors.terms ? 'border-red-500' : ''
                                                        }`}
                                                    disabled={isLoading}
                                                />
                                            </motion.div>
                                            <span className="text-xs text-gray-700 dark:text-gray-400 leading-relaxed">
                                                I agree to the{' '}
                                                <motion.span
                                                    whileHover={{ scale: 1.05 }}
                                                    className="inline-block"
                                                >
                                                    <Link href="/terms" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                                                        Terms
                                                    </Link>
                                                </motion.span>{' '}
                                                and{' '}
                                                <motion.span
                                                    whileHover={{ scale: 1.05 }}
                                                    className="inline-block"
                                                >
                                                    <Link href="/privacy" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                                                        Privacy Policy
                                                    </Link>
                                                </motion.span>
                                            </span>
                                        </label>
                                        <AnimatePresence>
                                            {errors.terms && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="text-xs text-red-500 ml-6 mt-1 overflow-hidden"
                                                >
                                                    {errors.terms}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <motion.button
                                            type="submit"
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center justify-center">
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full mr-2"
                                                    />
                                                    Creating account...
                                                </span>
                                            ) : (
                                                <>
                                                    <span className="relative z-10">Create account</span>
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                        initial={false}
                                                    />
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                </form>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="text-center text-xs text-gray-700 dark:text-gray-400 mt-6"
                                >
                                    Already have an account?{' '}
                                    <motion.span whileHover={{ scale: 1.05 }} className="inline-block">
                                        <Link href="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                                            Sign in
                                        </Link>
                                    </motion.span>
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                    className="relative my-6"
                                >
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-2 bg-white dark:bg-transparent text-gray-500">Or continue with</span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                    className="flex gap-3"
                                >
                                    <motion.button
                                        type="button"
                                        onClick={() => handleSocialSignup('Google')}
                                        whileHover={{ y: -3, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 h-12 border-2 border-gray-200 dark:border-white/10 rounded-lg flex items-center justify-center gap-2 font-medium text-sm text-gray-900 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                                        disabled={isLoading}
                                    >
                                        <motion.div
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <Chrome className="w-5 h-5" />
                                        </motion.div>
                                        Google
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                            initial={false}
                                        />
                                    </motion.button>

                                    <motion.button
                                        type="button"
                                        onClick={() => handleSocialSignup('GitHub')}
                                        whileHover={{ y: -3, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 h-12 border-2 border-gray-200 dark:border-white/10 rounded-lg flex items-center justify-center gap-2 font-medium text-sm text-gray-900 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                                        disabled={isLoading}
                                    >
                                        <motion.div
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <Github className="w-5 h-5" />
                                        </motion.div>
                                        GitHub
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                            initial={false}
                                        />
                                    </motion.button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}