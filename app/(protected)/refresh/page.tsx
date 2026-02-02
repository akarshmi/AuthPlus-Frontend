"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import useAuth from "@/store/authStore"

export default function RefreshPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { initAuth } = useAuth()

    useEffect(() => {
        const run = async () => {
            try {
                await initAuth() // this should call /refresh internally

                const returnUrl = searchParams.get("returnUrl") || "/dashboard"
                router.replace(returnUrl)
            } catch (err) {
                console.error("Refresh failed:", err)
                router.replace("/login")
            }
        }

        run()
    }, [initAuth, router, searchParams])

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="flex flex-col items-center space-y-5">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 dark:border-white/20 dark:border-t-white"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Completing sign in...
                </p>
            </div>
        </div>
    )
}
