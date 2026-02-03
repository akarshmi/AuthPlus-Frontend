'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, ArrowLeft, Sun, Moon, CheckCircle, AlertCircle, Shield, Lock, Sparkles, KeyRound } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

export default function ForgotPasswordClient() {
    const router = useRouter()

    const [isMounted, setIsMounted] = useState(false)
    const [theme, setTheme] = useState('dark')
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [error, setError] = useState('')
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const [hoveredField, setHoveredField] = useState(false)
    const [parallaxX, setParallaxX] = useState(0)
    const [parallaxY, setParallaxY] = useState(0)

    // Handle client-side mounting
    useEffect(() => {
        setIsMounted(true)
    }, [])

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setAlert(null)

        if (!email.trim()) {
            setError('Email is required')
            setAlert({ type: 'error', message: 'Please enter your email address' })
            return
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address')
            setAlert({ type: 'error', message: 'Please enter a valid email address' })
            return
        }

        setIsLoading(true)

        try {
            // Simulate API call - Replace with your actual API endpoint
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Mock successful response
            setEmailSent(true)
            setAlert({
                type: 'success',
                message: 'Password reset link sent! Check your email.'
            })

            // Reset form
            setEmail('')

        } catch (err: any) {
            console.error('Password reset error:', err)

            let errorMessage = 'Failed to send reset link. Please try again.'

            if (err.response?.status === 404) {
                errorMessage = 'No account found with this email address.'
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message
            } else if (err.message?.toLowerCase().includes('network')) {
                errorMessage = 'Network error. Please check your connection.'
            }

            setAlert({ type: 'error', message: errorMessage })
            setError(errorMessage)

        } finally {
            setIsLoading(false)
        }
    }

    const floatingIcons = [
        { icon: Shield, x: '10%', y: '20%', delay: 0 },
        { icon: Lock, x: '85%', y: '15%', delay: 0.5 },
        { icon: KeyRound, x: '15%', y: '75%', delay: 1 },
        { icon: Sparkles, x: '80%', y: '70%', delay: 1.5 },
    ]

    // Don't render anything until mounted on client
    if (!isMounted) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center px-6 py-10 transition-colors overflow-hidden relative">

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
                                href="/login"
                                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium group"
                            >
                                <motion.div
                                    animate={{ x: [0, -2, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="inline-block"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </motion.div>
                                <span>Back to login</span>
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

                                {!emailSent ? (
                                    <>
                                        <div className="mb-8">
                                            <motion.h1
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 }}
                                                className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                                            >
                                                Reset password
                                            </motion.h1>
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="text-sm text-gray-600 dark:text-gray-400"
                                            >
                                                Enter your email and we'll send you a link to reset your password
                                            </motion.p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 }}
                                                onMouseEnter={() => setHoveredField(true)}
                                                onMouseLeave={() => setHoveredField(false)}
                                                className="space-y-1.5"
                                            >
                                                <label className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                                                    Email address
                                                </label>
                                                <motion.div
                                                    animate={{
                                                        borderColor: error ? '#ef4444' :
                                                            hoveredField ? '#3b82f6' :
                                                                theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
                                                        scale: hoveredField ? 1.01 : 1
                                                    }}
                                                    className="relative border-2 rounded-lg h-12 flex items-center px-4 transition-all"
                                                >
                                                    <motion.div
                                                        animate={{
                                                            scale: hoveredField ? 1.1 : 1,
                                                            rotate: hoveredField ? 5 : 0
                                                        }}
                                                    >
                                                        <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                    </motion.div>
                                                    <input
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        value={email}
                                                        onChange={(e) => {
                                                            setEmail(e.target.value)
                                                            setError('')
                                                            setAlert(null)
                                                        }}
                                                        className="ml-3 flex-1 outline-none text-sm bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                                        disabled={isLoading}
                                                        autoComplete="email"
                                                        autoFocus
                                                    />
                                                </motion.div>
                                                <AnimatePresence>
                                                    {error && (
                                                        <motion.p
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="text-xs text-red-500 overflow-hidden"
                                                        >
                                                            {error}
                                                        </motion.p>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 }}
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
                                                            Sending reset link...
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <span className="relative z-10">Send reset link</span>
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
                                            transition={{ delay: 0.5 }}
                                            className="text-center text-xs text-gray-700 dark:text-gray-400 mt-6"
                                        >
                                            Remember your password?{' '}
                                            <motion.span whileHover={{ scale: 1.05 }} className="inline-block">
                                                <Link href="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                                                    Sign in
                                                </Link>
                                            </motion.span>
                                        </motion.p>
                                    </>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="text-center py-8"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                            className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
                                        >
                                            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                                        </motion.div>

                                        <motion.h2
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                                        >
                                            Check your email
                                        </motion.h2>

                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="text-sm text-gray-600 dark:text-gray-400 mb-6"
                                        >
                                            We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
                                        </motion.p>

                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="space-y-3"
                                        >
                                            <motion.button
                                                onClick={() => {
                                                    setEmailSent(false)
                                                    setEmail('')
                                                }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black font-medium rounded-lg transition-all relative overflow-hidden group"
                                            >
                                                <span className="relative z-10">Send another email</span>
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                    initial={false}
                                                />
                                            </motion.button>

                                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                <Link
                                                    href="/login"
                                                    className="block w-full h-12 border-2 border-gray-200 dark:border-white/10 rounded-lg flex items-center justify-center font-medium text-sm text-gray-900 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                                                >
                                                    Back to login
                                                </Link>
                                            </motion.div>
                                        </motion.div>

                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.6 }}
                                            className="text-xs text-gray-500 dark:text-gray-500 mt-6"
                                        >
                                            Didn't receive the email? Check your spam folder or try again.
                                        </motion.p>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}