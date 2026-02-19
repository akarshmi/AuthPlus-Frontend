"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import useAuth from "@/store/authStore"

function OAuth2CallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const returnUrl = searchParams.get('returnUrl') || '/dashboard'
                const token = searchParams.get('token')

                if (token) {
                    const decoded: any = jwtDecode(token)

                    // ✅ Set token AND basic user data from token immediately
                    useAuth.setState({
                        token,
                        isAuth: true,
                        loggedOut: false,
                        loading: false,
                        refreshError: false,
                        user: {
                            userId: decoded.sub,
                            email: decoded.email,
                            name: decoded.email, // fallback until profile loads
                            roles: decoded.roles || [],
                            enabled: true,
                            image: null,
                            provider: '',
                            createdAt: '',
                            updatedAt: ''
                        }
                    })

                    // ✅ Now fetch full profile with token already in state
                    try {
                        await useAuth.getState().fetchProfile()
                    } catch (e) {
                        console.error("Profile fetch failed, using token data:", e)
                        // User still has basic data from token — don't block login
                    }

                    router.replace(returnUrl)
                } else {
                    // No token in URL — try cookie fallback
                    await useAuth.getState().refresh()
                    router.replace(returnUrl)
                }
            } catch (error) {
                console.error("OAuth2 callback failed:", error)
                router.replace('/login?error=oauth_failed')
            }
        }

        handleCallback()
    }, [])

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="flex flex-col items-center space-y-5">
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                        <span className="text-white dark:text-black font-bold text-sm">A+</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">AuthPlus</span>
                </div>
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 dark:border-white/20 dark:border-t-white" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Completing sign in...</p>
            </div>
        </div>
    )
}

export default function OAuth2CallbackPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 dark:border-white/20 dark:border-t-white" />
            </div>
        }>
            <OAuth2CallbackContent />
        </Suspense>
    )
}