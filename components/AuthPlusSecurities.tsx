"use client"

import { useEffect, ReactNode, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import useAuth from "@/store/authStore"

interface Props {
    children: ReactNode
}

export default function AuthPlusSecurities({ children }: Props) {
    const { isAuth, loading, initAuth } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [isInitialized, setIsInitialized] = useState(false)

    // Initialize auth on mount
    useEffect(() => {
        const init = async () => {
            try {
                await initAuth()
            } catch (error) {
                console.error("Auth initialization failed:", error)
            } finally {
                setIsInitialized(true)
            }
        }

        if (!isInitialized) {
            init()
        }
    }, [initAuth, isInitialized])

    // Redirect to login if not authenticated
    useEffect(() => {
        if (isInitialized && !loading && !isAuth) {
            // Store the intended destination
            const returnUrl = pathname || '/dashboard'
            router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
        }
    }, [isAuth, loading, isInitialized, router, pathname])

    // Show loading state while initializing or checking auth
    if (!isInitialized || loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
                <div className="flex flex-col items-center space-y-5">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                            <span className="text-white dark:text-black font-bold text-sm">A+</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            AuthPlus
                        </span>
                    </div>

                    {/* Spinner */}
                    <div className="relative">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 dark:border-white/20 dark:border-t-white"></div>
                    </div>

                    {/* Text */}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Verifying your session...
                    </p>
                </div>
            </div>
        )
    }

    // Don't render children if not authenticated
    if (!isAuth) {
        return null
    }

    return <>{children}</>
}