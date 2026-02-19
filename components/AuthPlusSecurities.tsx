"use client"

import { useEffect, ReactNode, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import useAuth from "@/store/authStore"

// These routes should never trigger auth redirect
const PUBLIC_PATHS = ['/login', '/register', '/oauth2/callback', '/auth/callback']

interface Props {
    children: ReactNode
}

export default function AuthPlusSecurities({ children }: Props) {
    const { isAuth, loading, initAuth } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [isInitialized, setIsInitialized] = useState(false)

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
    }, []) // ← empty deps

    useEffect(() => {
        if (!isInitialized || loading) return

        // ✅ Don't redirect if we're on a public/OAuth path
        const isPublicPath = PUBLIC_PATHS.some(p => pathname?.startsWith(p))
        if (isPublicPath) return

        if (!isAuth) {
            // ✅ Don't store /refresh or auth paths as returnUrl
            const isAuthPath = pathname?.includes('/refresh') || pathname?.includes('/auth/')
            const returnUrl = (!isAuthPath && pathname) ? pathname : '/dashboard'
            router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
        }
    }, [isAuth, loading, isInitialized, pathname])

    if (!isInitialized || loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
                <div className="flex flex-col items-center space-y-5">
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                            <span className="text-white dark:text-black font-bold text-sm">A+</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">AuthPlus</span>
                    </div>
                    <div className="relative">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 dark:border-white/20 dark:border-t-white"></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Verifying your session...</p>
                </div>
            </div>
        )
    }

    if (!isAuth) return null

    return <>{children}</>
}