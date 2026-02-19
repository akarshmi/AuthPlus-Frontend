"use client"

import { useEffect, ReactNode } from "react"
import useAuth from "../store/authStore"

interface Props {
    children: ReactNode
}

export default function AuthProvider({ children }: Props) {
    const initAuth = useAuth(state => state.initAuth)
    const loggedOut = useAuth(state => state.loggedOut)

    useEffect(() => {
        if (!loggedOut) {
            initAuth() // initAuth already handles the "should I refresh?" logic
        }
    }, []) // ← empty deps, run once only

    return <>{children}</>
}