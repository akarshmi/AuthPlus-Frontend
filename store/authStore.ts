"use client"

import { create } from "zustand"
import { jwtDecode } from "jwt-decode"
import api from "@/lib/axios"
import rawApi from "@/lib/rawApi"

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes in ms

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
    email?: string
    roles?: string[]
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

    isTokenExpired: () => {
        const { token } = get()
        if (!token) return true
        try {
            const decoded: DecodedToken = jwtDecode(token)
            return Date.now() >= decoded.exp * 1000
        } catch {
            return true
        }
    },

    shouldRefreshToken: () => {
        const { token, refreshError } = get()
        if (!token) return false
        if (refreshError) return false
        try {
            const decoded: DecodedToken = jwtDecode(token)
            const timeUntilExpiry = decoded.exp * 1000 - Date.now()
            return timeUntilExpiry <= TOKEN_REFRESH_THRESHOLD
        } catch {
            return true
        }
    },

    ensureValidToken: async () => {
        const { shouldRefreshToken, refresh, loggedOut, refreshing, refreshError } = get()

        if (loggedOut) return

        // Wait for ongoing refresh
        if (refreshing) {
            return new Promise<void>((resolve) => {
                const checkInterval = setInterval(() => {
                    if (!get().refreshing) {
                        clearInterval(checkInterval)
                        resolve()
                    }
                }, 100)
                setTimeout(() => {
                    clearInterval(checkInterval)
                    resolve()
                }, 10000)
            })
        }

        if (refreshError) {
            setTimeout(() => set({ refreshError: false }), 5000)
            return
        }

        if (shouldRefreshToken()) {
            try {
                await refresh()
            } catch (error) {
                console.error("Token refresh failed in ensureValidToken:", error)
            }
        }
    },

    initAuth: async () => {
        const { token, loggedOut, isTokenExpired, shouldRefreshToken } = get()

        if (loggedOut) {
            set({ loading: false })
            return
        }

        // Token exists and is still valid — no refresh needed
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

        // No token — try to get one from httpOnly cookie
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

    // ---------------- REGISTER ----------------
    register: async (data) => {
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
    login: async (credentials) => {
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

        if (loggedOut) throw new Error("User is logged out")

        // Prevent concurrent refresh calls
        if (refreshing) {
            return new Promise<string | undefined>((resolve, reject) => {
                const checkInterval = setInterval(() => {
                    const state = get()
                    if (!state.refreshing) {
                        clearInterval(checkInterval)
                        state.token ? resolve(state.token) : reject(new Error("Refresh failed"))
                    }
                }, 100)
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

            const isAuthError = error.response?.status === 400 || error.response?.status === 401

            if (isAuthError) {
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
                set({ refreshing: false, refreshError: true })
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
        window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/oauth2/authorization/${provider}`
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
    updateProfile: async (updateData) => {
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

            let errorMessage = "Failed to update profile"

            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        errorMessage = error.response.data?.message || "Invalid data provided"
                        break
                    case 401:
                        errorMessage = "Session expired"
                        set({ isAuth: false, token: null, user: null, loggedOut: true })
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

            set({ loadingProfile: false, profileError: errorMessage })

            const enhancedError = new Error(errorMessage);
            (enhancedError as any).response = error.response;
            (enhancedError as any).request = error.request

            throw enhancedError
        }
    }
}))

export default useAuth