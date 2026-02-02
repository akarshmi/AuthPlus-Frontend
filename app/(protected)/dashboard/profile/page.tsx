'use client'

import React, { useEffect, useState } from 'react'
import { Sun, Moon, User, Shield, Mail, Calendar, ArrowLeft, Save, X, Check, AlertCircle, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import useAuth from "@/store/authStore"
import { toast } from 'sonner'

interface UpdateProfileData {
    name?: string
    email?: string
    image?: string
}

interface ApiError {
    response?: {
        status?: number
        data?: {
            message?: string
        }
    }
    message?: string
}

const Alert = ({ type, message, onRetry }: {
    type: 'success' | 'error' | 'warning';
    message: string;
    onRetry?: () => void;
}) => (
    <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className={`flex items-center justify-between gap-2 p-3 rounded-lg text-sm ${type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
            : type === 'warning'
                ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
            }`}
    >
        <div className="flex items-center gap-2">
            {type === 'success' ? (
                <Check className="w-4 h-4" />
            ) : type === 'warning' ? (
                <AlertCircle className="w-4 h-4" />
            ) : (
                <AlertCircle className="w-4 h-4" />
            )}
            <span>{message}</span>
        </div>
        {onRetry && (
            <Button
                variant="ghost"
                size="sm"
                onClick={onRetry}
                className="h-6 px-2 text-xs"
            >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
            </Button>
        )}
    </motion.div>
)

export default function DashboardProfilePage() {
    const router = useRouter()
    const { user, fetchProfile, loading, profileError } = useAuth()

    const [theme, setTheme] = useState<'light' | 'dark'>('dark')
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [alert, setAlert] = useState<{
        type: 'success' | 'error' | 'warning';
        message: string;
        onRetry?: () => void;
    } | null>(null)
    const { updateProfile } = useAuth()

    // State for image loading
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)

    // Editable form state
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    })

    const [errors, setErrors] = useState<{
        name?: string
        email?: string
    }>({})

    // Fetch profile data with retry logic
    const loadProfile = async (retryCount = 0) => {
        try {
            await fetchProfile()
            setImageLoaded(false)
            setImageError(false)
        } catch (error) {
            if (retryCount < 3) {
                // Auto-retry with exponential backoff
                setTimeout(() => loadProfile(retryCount + 1), 1000 * Math.pow(2, retryCount))
            } else {
                setAlert({
                    type: 'error',
                    message: 'Failed to load profile data. Please try again.',
                    onRetry: () => loadProfile()
                })
            }
        }
    }

    // Initialize user data
    useEffect(() => {
        if (!user && !loading) {
            loadProfile()
        }
    }, [user, loading])

    // Sync form data with user
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || ''
            })
            // Reset image state when user changes
            setImageLoaded(false)
            setImageError(false)
        }
    }, [user])

    // Theme initialization
    useEffect(() => {
        const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
        setTheme(savedTheme)
        document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }, [])

    // Auto-hide success alerts
    useEffect(() => {
        if (alert?.type === 'success') {
            const timer = setTimeout(() => setAlert(null), 5000)
            return () => clearTimeout(timer)
        }
    }, [alert])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleEdit = () => {
        setIsEditing(true)
        setErrors({})
        setAlert(null)
    }

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email
            })
        }
        setIsEditing(false)
        setErrors({})
        setAlert(null)
    }

    const handleSave = async () => {
        if (!user) return

        // Validation
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
            newErrors.email = 'Please enter a valid email'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setAlert({
                type: 'error',
                message: 'Please fix the errors in the form'
            })
            return
        }

        setIsSaving(true)
        setAlert(null)

        try {
            const updateData: UpdateProfileData = {}

            // Only send changed fields
            if (formData.name.trim() !== user.name) {
                updateData.name = formData.name.trim()
            }
            if (formData.email.trim().toLowerCase() !== user.email.toLowerCase()) {
                updateData.email = formData.email.trim().toLowerCase()
            }

            if (Object.keys(updateData).length === 0) {
                setAlert({
                    type: 'warning',
                    message: 'No changes to save'
                })
                setIsSaving(false)
                return
            }

            // API call to update profile
            await updateProfile(updateData)

            // Refresh profile data to get updated image if it was changed
            await loadProfile()

            setIsEditing(false)
            setAlert({
                type: 'success',
                message: 'Profile updated successfully!'
            })

            // Show success toast
            toast.success('Profile updated', {
                description: 'Your profile has been updated successfully.',
            })

        } catch (error: any) {
            console.error('Profile update error:', error)

            let errorMessage = 'Failed to update profile. Please try again.'
            const newErrors: typeof errors = {}

            if (error.response?.status === 409) {
                newErrors.email = 'This email is already taken'
                errorMessage = 'This email is already in use by another account.'
            } else if (error.response?.status === 400) {
                errorMessage = error.response?.data?.message || 'Invalid data provided.'
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message
            }

            setErrors(newErrors)
            setAlert({
                type: 'error',
                message: errorMessage,
                onRetry: handleSave
            })

            // Show error toast
            toast.error('Update failed', {
                description: errorMessage,
            })

        } finally {
            setIsSaving(false)
        }
    }

    // Handle image loading
    const handleImageLoad = () => {
        setImageLoaded(true)
        setImageError(false)
    }

    const handleImageError = () => {
        setImageError(true)
        setImageLoaded(false)
    }

    // Function to get image URL with cache busting
    const getImageUrl = () => {
        if (!user?.image) return ''
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime()
        return `${user.image}?t=${timestamp}`
    }

    // Retry loading image
    const retryImageLoad = () => {
        setImageError(false)
        setImageLoaded(false)
    }

    // Loading screen with better UX
    if (loading && !user) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-[#0a0a0a]">
                <div className="flex flex-col items-center space-y-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-10 w-10 rounded-full border-4 border-gray-300 border-t-gray-900 dark:border-white/20 dark:border-t-white"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Loading your profile...
                    </p>
                </div>
            </div>
        )
    }

    // Error screen with retry option
    if (profileError && !user) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-[#0a0a0a]">
                <div className="text-center space-y-6 max-w-md">
                    <div className="space-y-3">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                        <p className="text-red-500 font-medium">{profileError}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            We couldn't load your profile data. Please check your connection and try again.
                        </p>
                    </div>
                    <div className="flex gap-3 justify-center">
                        <Button
                            onClick={() => loadProfile()}
                            variant="default"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry
                        </Button>
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                        >
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // No user data
    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-[#0a0a0a]">
                <div className="text-center space-y-4">
                    <p className="text-gray-500">No profile data available</p>
                    <Button onClick={() => loadProfile()}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reload Profile
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-[#0a0a0a] transition-colors">
            {/* Topbar */}
            <header className="h-16 bg-white dark:bg-white/5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h1>
                </div>

                <div className="flex items-center gap-3">
                    {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => loadProfile()}
                        disabled={loading}
                        className="text-sm"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button> */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? (
                            <Moon className="w-4 h-4 text-gray-700" />
                        ) : (
                            <Sun className="w-4 h-4 text-gray-300" />
                        )}
                    </button>
                </div>
            </header>

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-black dark:to-gray-900 py-12"
            >
                <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative w-28 h-28 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center overflow-hidden border-4 border-white dark:border-[#0a0a0a]"
                    >
                        {user.image && !imageError ? (
                            <>
                                {!imageLoaded && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                                <img
                                    src={getImageUrl()}
                                    alt={`${user.name}'s avatar`}
                                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                    loading="lazy"
                                />
                            </>
                        ) : (
                            <User className="w-12 h-12 text-gray-400" />
                        )}

                        {imageError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/80 text-white p-2">
                                <AlertCircle className="w-6 h-6 mb-1" />
                                <span className="text-xs">Image failed to load</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={retryImageLoad}
                                    className="h-6 px-2 mt-1 text-xs"
                                >
                                    Retry
                                </Button>
                            </div>
                        )}
                    </motion.div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                        <p className="text-sm text-gray-300">{user.email}</p>
                    </div>

                    {!imageLoaded && !imageError && user.image && (
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                            <span>Loading image...</span>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Content */}
            <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Status */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Account Status</CardTitle>
                            <Badge
                                variant={user.enabled ? "default" : "destructive"}
                                className="animate-pulse"
                            >
                                {user.enabled ? 'Active' : 'Disabled'}
                            </Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Shield className="w-4 h-4 text-gray-400" />
                                    <span>{user.roles?.length ? user.roles.join(', ') : 'No roles assigned'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Last Updated
                                </Label>
                                <p className="text-sm">
                                    {new Date(user.updatedAt).toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Right Column - Editable Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Alert */}
                            {alert && (
                                <Alert
                                    type={alert.type}
                                    message={alert.message}
                                    onRetry={alert.onRetry}
                                />
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* User ID */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">User ID</Label>
                                    <Input
                                        value={user.userId || ''}
                                        disabled
                                        className="bg-gray-50 dark:bg-white/5"
                                    />
                                </div>

                                {/* Name */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                        Name {isEditing && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({ ...formData, name: e.target.value })
                                            setErrors({ ...errors, name: undefined })
                                        }}
                                        disabled={!isEditing || isSaving}
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                        Email {isEditing && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value })
                                            setErrors({ ...errors, email: undefined })
                                        }}
                                        disabled={!isEditing || isSaving}
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                {/* Provider */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Provider</Label>
                                    <Input
                                        value={user.provider || ''}
                                        disabled
                                        className="bg-gray-50 dark:bg-white/5"
                                    />
                                </div>

                                {/* Created At */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Created At</Label>
                                    <Input
                                        value={new Date(user.createdAt).toLocaleString()}
                                        disabled
                                        className="bg-gray-50 dark:bg-white/5"
                                    />
                                </div>

                                {/* Updated At */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Updated At</Label>
                                    <Input
                                        value={new Date(user.updatedAt).toLocaleString()}
                                        disabled
                                        className="bg-gray-50 dark:bg-white/5"
                                    />
                                </div>
                            </div>

                            <Separator />

                            {/* Actions */}
                            <div className="flex justify-end gap-3">
                                {!isEditing ? (
                                    <Button
                                        onClick={handleEdit}
                                        disabled={loading}
                                    >
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={handleCancel}
                                            disabled={isSaving}
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? (
                                                <>
                                                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    )
}