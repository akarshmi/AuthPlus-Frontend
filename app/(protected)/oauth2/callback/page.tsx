"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import useAuth from "@/store/authStore"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080"

function OAuth2CallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const returnUrl = searchParams.get('returnUrl') || '/dashboard'
                const token = searchParams.get('token')

                if (!token) {
                    // No token — try cookie fallback
                    await useAuth.getState().refresh()
                    router.replace(returnUrl)
                    return
                }

                const decoded: any = jwtDecode(token)
                // console.log("Decoded token:", decoded)

                // ✅ Set token in state first
                useAuth.setState({
                    token,
                    isAuth: true,
                    loggedOut: false,
                    loading: false,
                    refreshError: false,
                })

                // ✅ Fetch profile using native fetch (bypasses axios interceptor issues)
                try {
                    const profileRes = await fetch(`${BASE_URL}/api/v1/users/me`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include'
                    })

                    // console.log("Profile response status:", profileRes.status)

                    if (profileRes.ok) {
                        const userData = await profileRes.json()
                        // console.log("User data:", userData)
                        useAuth.setState({ user: userData })
                    } else {
                        const errData = await profileRes.json()
                        // console.error("Profile fetch error:", errData)

                        // Fallback: set basic user info from token
                        useAuth.setState({
                            user: {
                                userId: decoded.sub,
                                email: decoded.email,
                                name: decoded.email,
                                roles: decoded.roles || [],
                                enabled: true,
                                image: null,
                                provider: '',
                                createdAt: '',
                                updatedAt: ''
                            }
                        })
                    }
                } catch (fetchErr) {
                    // console.error("Profile fetch threw:", fetchErr)
                    // Fallback to token data
                    useAuth.setState({
                        user: {
                            userId: decoded.sub,
                            email: decoded.email,
                            name: decoded.email,
                            roles: decoded.roles || [],
                            enabled: true,
                            image: null,
                            provider: '',
                            createdAt: '',
                            updatedAt: ''
                        }
                    })
                }

                router.replace(returnUrl)

            } catch (error) {
                // console.error("OAuth2 callback failed:", error)
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