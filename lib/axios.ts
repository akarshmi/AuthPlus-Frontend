"use client"

import axios from "axios"
import useAuth from "@/store/authStore"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080"
const api = axios.create({
    baseURL: `${BASE_URL}/api/v1`,
    withCredentials: true
})

// ============ REQUEST INTERCEPTOR ============
api.interceptors.request.use(
    async (config) => {
        const state = useAuth.getState()

        // Skip auth for public endpoints
        if (config.url?.includes('/auth/')) {
            return config
        }

        // ✅ Ensure token is valid before request
        await state.ensureValidToken()

        const token = useAuth.getState().token

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

// ============ RESPONSE INTERCEPTOR ============
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const original = err.config
        const state = useAuth.getState()

        if (!original) return Promise.reject(err)

        // ❌ Never refresh after logout
        if (state.loggedOut) {
            return Promise.reject(err)
        }

        // 🔐 Access token expired → refresh once
        if (err.response?.status === 401 && !original._retry) {
            original._retry = true

            try {
                const newToken = await state.refresh()

                if (newToken && original.headers) {
                    original.headers.Authorization = `Bearer ${newToken}`
                    return api(original) // Retry original request
                }
            } catch (refreshError) {
                // Refresh token expired → HARD LOGOUT
                await state.logout()

                // Redirect to login
                if (typeof window !== 'undefined') {
                    window.location.href = "/login"
                }

                return Promise.reject(err)
            }
        }

        return Promise.reject(err)
    }
)

export default api