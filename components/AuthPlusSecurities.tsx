"use client"

import { useEffect, ReactNode, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import useAuth from "@/store/authStore"

const PUBLIC_PATHS = ['/login', '/register', '/oauth2/callback']

interface Props {
    children: ReactNode
}

export default function AuthPlusSecurities({ children }: Props) {
    const { isAuth, loading, initAuth } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [isInitialized, setIsInitialized] = useState(false)

    const isPublicPath = PUBLIC_PATHS.some(p => pathname?.startsWith(p))

    useEffect(() => {
        const init = async () => {
            try {
                // ✅ Skip initAuth on public paths — they handle their own auth
                if (!isPublicPath) {
                    await initAuth()
                }
            } catch (error) {
                console.error("Auth initialization failed:", error)
            } finally {
                setIsInitialized(true)
            }
        }

        if (!isInitialized) {
            init()
        }
    }, [])

    useEffect(() => {
        if (!isInitialized || loading) return
        if (isPublicPath) return
        if (!isAuth) {
            const isAuthPath = pathname?.includes('/oauth2/') || pathname?.includes('/auth/')
            const returnUrl = (!isAuthPath && pathname) ? pathname : '/dashboard'
            router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
        }
    }, [isAuth, loading, isInitialized, pathname])

    // ✅ Don't block public paths with spinner — let them render immediately
    if (!isPublicPath && (!isInitialized || loading)) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
                <div className="flex flex-col items-center space-y-5">
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                            <span className="text-white dark:text-black font-bold text-sm">A+</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            AuthPlus
                        </span>
                    </div>
                    <div className="relative">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 dark:border-white/20 dark:border-t-white"></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Verifying your session...
                    </p>
                </div>
            </div>
        )
    }

    // ✅ Don't block public paths even if not authenticated
    if (!isPublicPath && !isAuth) return null

    return <>{children}</>
}