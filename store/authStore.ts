"use client"

import { create } from "zustand"
import { jwtDecode } from "jwt-decode"
import api from "@/lib/axios"
import rawApi from "@/lib/rawApi"

// Token will refresh if expiring within 5 minutes
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000 // in ms 

export interface User {
    userId: string
    email: string
    name: string
    image?: string | null
    enabled: boolean
    createdAt: string
    updatedAt: string
    provider: string
    roles: string[]
}

interface DecodedToken {
    exp: number
    iat: number
    sub: string
}

interface UpdateProfileData {
    [key: string]: any
}

interface AuthState {
    user: User | null
    token: string | null
    isAuth: boolean
    loading: boolean
    loadingProfile?: boolean
    profileError?: string | null
    loggedOut?: boolean
    refreshing: boolean
    refreshError?: boolean

    // Methods
    register: (data: { email: string; password: string; name: string }) => Promise<any>
    login: (data: { email: string; password: string }) => Promise<any>
    updateProfile: (updateData: UpdateProfileData) => Promise<any>
    refresh: () => Promise<string | undefined>
    logout: () => Promise<void>
    socialLogin: (provider: string) => Promise<void>
    fetchProfile: () => Promise<User>
    isTokenExpired: () => boolean
    shouldRefreshToken: () => boolean
    ensureValidToken: () => Promise<void>
    initAuth: () => Promise<void>
}

const useAuth = create<AuthState>((set, get) => ({
    // ---------------- STATE ----------------
    user: null,
    token: null,
    isAuth: false,
    loading: true,
    refreshing: false,
    refreshError: false,

    // ---------------- HELPERS ----------------

    /**
     * Check if current token is expired
     */
    isTokenExpired: () => {
        const { token } = get()
        if (!token) return true

        try {
            const decoded: DecodedToken = jwtDecode(token)
            const now = Date.now()
            const expiration = decoded.exp * 1000 // Convert to ms

            return now >= expiration
        } catch (error) {
            console.error("Error decoding token:", error)
            return true
        }
    },

    /**
     * Check if token should be refreshed (expired or expiring soon)
     */
    shouldRefreshToken: () => {
        const { token, refreshError } = get()
        if (!token) return false
        if (refreshError) return false // Don't try to refresh if it just failed

        try {
            const decoded: DecodedToken = jwtDecode(token)
            const now = Date.now()
            const expiration = decoded.exp * 1000
            const timeUntilExpiry = expiration - now

            // Refresh if expired or expiring within threshold
            return timeUntilExpiry <= TOKEN_REFRESH_THRESHOLD
        } catch (error) {
            console.error("Error decoding token:", error)
            return true
        }
    },

    /**
     * Ensure token is valid, refresh if needed
     */
    ensureValidToken: async () => {
        const { shouldRefreshToken, refresh, loggedOut, refreshing, refreshError } = get()

        if (loggedOut) return
        if (refreshing) {
            // Wait for ongoing refresh to complete
            return new Promise<void>((resolve) => {
                const checkInterval = setInterval(() => {
                    const state = get()
                    if (!state.refreshing) {
                        clearInterval(checkInterval)
                        resolve()
                    }
                }, 100)

                // Timeout after 10 seconds
                setTimeout(() => {
                    clearInterval(checkInterval)
                    resolve()
                }, 10000)
            })
        }

        if (refreshError) {
            // Clear refresh error after some time
            setTimeout(() => {
                set({ refreshError: false })
            }, 5000)
            return
        }

        if (shouldRefreshToken()) {
            try {
                await refresh()
            } catch (error) {
                console.error("Token refresh failed in ensureValidToken:", error)
                // Don't throw error here, let the API call handle it
            }
        }
    },

    /**
     * Initialize auth on app startup
     */
    initAuth: async () => {
        const { token, loggedOut, shouldRefreshToken, isTokenExpired } = get()

        if (loggedOut) {
            set({ loading: false })
            return
        }

        // Token exists and is still valid — no need to refresh
        if (token && !isTokenExpired()) {
            set({ loading: false })
            return
        }

        // Token exists but expiring soon — refresh proactively
        if (token && shouldRefreshToken()) {
            try {
                await get().refresh()
            } catch {
                set({ loading: false, isAuth: false, user: null, token: null })
            }
            return
        }

        // No token — try refresh from httpOnly cookie (covers page reload case)
        if (!token) {
            try {
                await get().refresh()
            } catch {
                set({ loading: false, isAuth: false, user: null })
            }
            return
        }

        set({ loading: false })
    },

    // ---------------- REGISTRATION ----------------
    register: async (data: {
        email: string
        password: string
        name: string
    }) => {
        try {
            const res = await rawApi.post("/auth/register", data)

            if (res.data.accessToken) {
                set({
                    token: res.data.accessToken,
                    user: res.data.user,
                    isAuth: true,
                    loggedOut: false,
                    refreshError: false
                })
            }

            return res.data
        } catch (error) {
            throw error
        }
    },

    // ---------------- LOGIN ----------------
    login: async (credentials: { email: string; password: string }) => {
        try {
            const res = await rawApi.post("/auth/login", credentials)

            set({
                token: res.data.accessToken,
                user: res.data.user,
                isAuth: true,
                loggedOut: false,
                loading: false,
                refreshError: false
            })

            return res.data
        } catch (error) {
            throw error
        }
    },

    // ---------------- REFRESH ----------------
    refresh: async () => {
        const { loggedOut, refreshing } = get()

        if (loggedOut) {
            throw new Error("User is logged out")
        }

        // 🔒 Prevent concurrent refresh calls
        if (refreshing) {
            // Wait for ongoing refresh
            return new Promise<string | undefined>((resolve, reject) => {
                const checkInterval = setInterval(() => {
                    const state = get()
                    if (!state.refreshing) {
                        clearInterval(checkInterval)
                        if (state.token) {
                            resolve(state.token)
                        } else {
                            reject(new Error("Refresh failed"))
                        }
                    }
                }, 100)

                // Timeout after 10 seconds
                setTimeout(() => {
                    clearInterval(checkInterval)
                    reject(new Error("Refresh timeout"))
                }, 10000)
            })
        }

        set({ refreshing: true, refreshError: false })

        try {
            const res = await rawApi.post("/auth/refresh")

            set({
                token: res.data.accessToken,
                user: res.data.user,
                isAuth: true,
                loggedOut: false,
                loading: false,
                refreshing: false,
                refreshError: false
            })

            return res.data.accessToken
        } catch (error: any) {
            console.error("Refresh token error:", error)

            // Check if it's a 400 or 401 error (invalid/expired refresh token)
            const isAuthError = error.response?.status === 400 || error.response?.status === 401

            if (isAuthError) {
                // Refresh token expired or invalid - clear everything
                set({
                    token: null,
                    user: null,
                    isAuth: false,
                    loggedOut: true,
                    loading: false,
                    refreshing: false,
                    refreshError: true
                })
            } else {
                // Other errors (network, server) - don't logout immediately
                set({
                    refreshing: false,
                    refreshError: true
                })
            }

            throw error
        }
    },

    // ---------------- LOGOUT ----------------
    logout: async () => {
        try {
            await rawApi.post("/auth/logout")
        } catch (error) {
            console.error("Logout request failed:", error)
        } finally {
            set({
                token: null,
                user: null,
                isAuth: false,
                loggedOut: true,
                loading: false,
                refreshing: false,
                refreshError: false
            })
        }
    },

    // ---------------- SOCIAL LOGIN ----------------
    socialLogin: async (provider: string) => {
        provider = provider.toLowerCase()
        window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/oauth2/authorization/${provider}`;
    },

    // ---------------- FETCH PROFILE ----------------
    fetchProfile: async () => {
        set({ loadingProfile: true, profileError: null })

        try {
            const res = await api.get("/users/me")

            set({
                user: res.data,
                loadingProfile: false,
                profileError: null
            })

            return res.data
        } catch (error: any) {
            console.error("Error fetching profile:", error)

            // Check if it's an authentication error
            if (error.response?.status === 401) {
                set({
                    user: null,
                    loadingProfile: false,
                    profileError: "Session expired",
                    isAuth: false,
                    token: null,
                    loggedOut: true
                })

                throw new Error("Session expired. Please log in again.")
            }

            set({
                loadingProfile: false,
                profileError: error.response?.data?.message || "Failed to load profile"
            })

            throw error
        }
    },

    // ---------------- UPDATE PROFILE ----------------
    updateProfile: async (updateData: UpdateProfileData) => {
        set({ loadingProfile: true, profileError: null })

        try {
            const res = await api.put('/users/me', updateData)

            set({
                user: res.data,
                loadingProfile: false,
                profileError: null
            })

            return res.data
        } catch (error: any) {
            console.error("Error updating profile:", error)

            // Enhanced error messages
            let errorMessage = "Failed to update profile"

            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        errorMessage = error.response.data?.message || "Invalid data provided"
                        break
                    case 401:
                        errorMessage = "Session expired"
                        set({
                            isAuth: false,
                            token: null,
                            user: null,
                            loggedOut: true
                        })
                        break
                    case 409:
                        errorMessage = "Email already in use"
                        break
                    case 422:
                        errorMessage = "Validation failed"
                        break
                    default:
                        errorMessage = error.response.data?.message || errorMessage
                }
            } else if (error.request) {
                errorMessage = "Network error. Please check your connection."
            }

            set({
                loadingProfile: false,
                profileError: errorMessage
            })

            // Create enhanced error object
            const enhancedError = new Error(errorMessage)
                ; (enhancedError as any).response = error.response
                ; (enhancedError as any).request = error.request

            throw enhancedError
        }
    }

}))

export default useAuth