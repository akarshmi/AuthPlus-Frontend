"use client"

import { useEffect, ReactNode, useRef } from "react"
import useAuth from "../store/authStore"

interface Props {
    children: ReactNode
}

export default function AuthProvider({ children }: Props) {
    
    const refresh = useAuth(state => state.refresh);
    const loggedOut = useAuth(state => state.loggedOut);

    useEffect(() => {
        if (!loggedOut) {
            refresh();
        }
    }, [refresh, loggedOut]);


    return <>{children}</>
}
