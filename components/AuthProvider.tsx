"use client"

import { useEffect, ReactNode } from "react"
import { usePathname } from "next/navigation"
import useAuth from "../store/authStore"

interface Props {
    children: ReactNode
}

export default function AuthProvider({ children }: Props) {
    const initAuth = useAuth(state => state.initAuth)
    const loggedOut = useAuth(state => state.loggedOut)
    const pathname = usePathname()

    useEffect(() => {

        if (pathname?.startsWith('/oauth2/callback')) return

        if (!loggedOut) {
            initAuth()
        }
    }, [])

    return <>{children}</>
}