'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Shield,
    Lock,
    Key,
    UserCheck,
    AlertTriangle,
    CheckCircle,
    XCircle,
    RefreshCw,
    Eye,
    EyeOff,
    Copy,
    Server,
    Network,
    Cpu,
    ShieldCheck,
    AlertCircle,
    Database,
    Clock,
    Hash,
    LogOut,
    Send,
    Trash2,
    Scan,
    TestTube,
    Code,
    Bug,
    Fingerprint,
    FileJson,
    Activity,
    Zap,
    CheckCheck,
    Cookie,
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Toaster, toast } from "sonner";

// API Configuration
const API_BASE_URL = 'https://authplus-backend.onrender.com';
const FRONTEND_URL = 'https://authplussecurities.vercel.app';

// Type Definitions
interface JWTHeader {
    alg: string;
    typ?: string;
}

interface JWTPayload {
    jti?: string;
    sub?: string;
    iss?: string;
    iat?: number;
    exp?: number;
    roles?: string[];
    email?: string;
    type?: string;
    [key: string]: any;
}

interface ParsedJWT {
    header: JWTHeader;
    payload: JWTPayload;
    signature: string;
    isValid: boolean;
    error?: string;
}

interface TestResult {
    id: number;
    name: string;
    status: 'success' | 'error' | 'warning';
    details: string;
    time: number;
    timestamp: string;
}

interface User {
    userId: string;
    email: string;
    name: string;
    password?: string | null;
    image?: string | null;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
    provider: 'LOCAL' | 'GITHUB' | 'GOOGLE';
    roles: string[];
}

interface SecurityMetrics {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    warningTests: number;
}

interface TokenStatus {
    status: 'valid' | 'expiring' | 'expired' | 'invalid';
    message: string;
    color: 'green' | 'yellow' | 'red';
}

// Utility function to parse JWT
const parseJWT = (token: string): ParsedJWT => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }

        const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'))) as JWTHeader;
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))) as JWTPayload;

        return {
            header,
            payload,
            signature: parts[2],
            isValid: true,
        };
    } catch (error) {
        return {
            header: {} as JWTHeader,
            payload: {} as JWTPayload,
            signature: '',
            isValid: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};

// Utility to check token expiry
const isTokenExpired = (exp: number): boolean => {
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
};

// Utility to get cookie
const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

export default function SecurityTestingDashboard() {
    const [activeTab, setActiveTab] = useState<string>('jwt-tester');
    const [loading, setLoading] = useState<boolean>(false);

    // JWT State
    const [jwtToken, setJwtToken] = useState<string>('');
    const [parsedToken, setParsedToken] = useState<ParsedJWT | null>(null);
    const [showToken, setShowToken] = useState<boolean>(false);
    const [usingCookie, setUsingCookie] = useState<boolean>(false);

    // Test Results
    const [testResults, setTestResults] = useState<TestResult[]>([]);

    // User State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]);

    // API Testing
    const [apiEndpoint, setApiEndpoint] = useState<string>(`${API_BASE_URL}/api/v1/auth/refresh`);
    const [testEmail, setTestEmail] = useState<string>('');

    // Security Metrics
    const [metrics, setMetrics] = useState<SecurityMetrics>({
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        warningTests: 0,
    });

    // Load JWT from cookie on mount
    useEffect(() => {
        const accessToken = getCookie('accessToken');
        if (accessToken) {
            setJwtToken(accessToken);
            setUsingCookie(true);
            toast.success('JWT token loaded from cookie');
        }
    }, []);

    // Parse JWT whenever token changes
    useEffect(() => {
        if (jwtToken) {
            const parsed = parseJWT(jwtToken);
            setParsedToken(parsed);

            if (parsed.isValid && parsed.payload.sub) {
                fetchCurrentUser(parsed.payload.sub);
            }
        }
    }, [jwtToken]);

    // Update metrics when test results change
    useEffect(() => {
        const passed = testResults.filter(r => r.status === 'success').length;
        const failed = testResults.filter(r => r.status === 'error').length;
        const warnings = testResults.filter(r => r.status === 'warning').length;

        setMetrics({
            totalTests: testResults.length,
            passedTests: passed,
            failedTests: failed,
            warningTests: warnings,
        });
    }, [testResults]);

    // Fetch current user data
    const fetchCurrentUser = async (userId: string): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const userData = await response.json() as User;
                setCurrentUser(userData);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    };

    // Fetch all users (admin only)
    const fetchAllUsers = async (): Promise<void> => {
        setLoading(true);
        const startTime = Date.now();

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            const time = Date.now() - startTime;

            if (response.ok) {
                setAllUsers(data as User[]);

                addTestResult({
                    name: 'Fetch All Users',
                    status: 'success',
                    details: `✅ Successfully fetched ${(data as User[]).length} users from the database`,
                    time,
                });
            } else {
                addTestResult({
                    name: 'Fetch All Users',
                    status: 'error',
                    details: `❌ Failed to fetch users: ${data.message || 'Unauthorized'}`,
                    time,
                });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            addTestResult({
                name: 'Fetch All Users',
                status: 'error',
                details: `❌ Network error: ${errorMessage}`,
                time: Date.now() - startTime,
            });
        } finally {
            setLoading(false);
        }
    };

    // Test 1: Parse and Validate JWT
    const testJWTParse = (): void => {
        setLoading(true);
        const startTime = Date.now();

        const parsed = parseJWT(jwtToken);
        setParsedToken(parsed);

        const result: Omit<TestResult, 'id' | 'timestamp'> = {
            name: 'JWT Token Analysis',
            status: parsed.isValid ? 'success' : 'error',
            details: parsed.isValid
                ? `✅ Valid JWT - Algorithm: ${parsed.header.alg}, Issuer: ${parsed.payload.iss || 'N/A'}, Subject: ${parsed.payload.sub || 'N/A'}`
                : `❌ Invalid JWT: ${parsed.error || 'Unknown error'}`,
            time: Date.now() - startTime,
        };

        addTestResult(result);
        toast[parsed.isValid ? 'success' : 'error'](
            parsed.isValid ? 'JWT parsed successfully' : 'Invalid JWT token'
        );

        setLoading(false);
    };

    // Test 2: Check Token Expiry
    const testTokenExpiry = (): void => {
        if (!parsedToken?.isValid) {
            toast.error('Please parse a valid JWT first');
            return;
        }

        setLoading(true);
        const startTime = Date.now();

        const exp = parsedToken.payload.exp || 0;
        const iat = parsedToken.payload.iat || 0;
        const isExpired = isTokenExpired(exp);
        const expiryDate = new Date(exp * 1000).toLocaleString();
        const issuedDate = new Date(iat * 1000).toLocaleString();
        const timeRemaining = exp - Math.floor(Date.now() / 1000);

        const result: Omit<TestResult, 'id' | 'timestamp'> = {
            name: 'Token Expiry Validation',
            status: isExpired ? 'error' : timeRemaining < 300 ? 'warning' : 'success',
            details: isExpired
                ? `❌ Token expired on ${expiryDate}`
                : timeRemaining < 300
                    ? `⚠️ Token expires soon (${Math.floor(timeRemaining / 60)} minutes remaining)`
                    : `✅ Token valid - Issued: ${issuedDate}, Expires: ${expiryDate}`,
            time: Date.now() - startTime,
        };

        addTestResult(result);
        setLoading(false);

        toast[isExpired ? 'error' : timeRemaining < 300 ? 'warning' : 'success'](
            isExpired ? 'Token has expired' : 'Token is valid'
        );
    };

    // Test 3: Verify Token with Backend
    const testTokenVerification = async (): Promise<void> => {
        if (!jwtToken) {
            toast.error('No JWT token available');
            return;
        }

        setLoading(true);
        const startTime = Date.now();

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            const time = Date.now() - startTime;

            const result: Omit<TestResult, 'id' | 'timestamp'> = {
                name: 'Backend Token Verification',
                status: response.ok ? 'success' : 'error',
                details: response.ok
                    ? `✅ Token verified - User: ${data.name} (${data.email}), Provider: ${data.provider}`
                    : `❌ Verification failed (${response.status}): ${data.message || 'Invalid token'}`,
                time,
            };

            if (response.ok) {
                setCurrentUser(data as User);
            }

            addTestResult(result);
            toast[response.ok ? 'success' : 'error'](
                response.ok ? 'Token verified successfully' : 'Token verification failed'
            );
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            addTestResult({
                name: 'Backend Token Verification',
                status: 'error',
                details: `❌ Network error: ${errorMessage}`,
                time: Date.now() - startTime,
            });
            toast.error('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Test 4: Refresh Token
    const testTokenRefresh = async (): Promise<void> => {
        const refreshToken = getCookie('refreshToken');

        if (!refreshToken) {
            toast.error('No refresh token found in cookies');
            return;
        }

        setLoading(true);
        const startTime = Date.now();

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            const time = Date.now() - startTime;

            const result: Omit<TestResult, 'id' | 'timestamp'> = {
                name: 'Token Refresh Test',
                status: response.ok ? 'success' : 'error',
                details: response.ok
                    ? `✅ Token refreshed successfully - New access token generated`
                    : `❌ Refresh failed (${response.status}): ${data.message || 'Invalid refresh token'}`,
                time,
            };

            if (response.ok && data.accessToken) {
                setJwtToken(data.accessToken);
                toast.success('New access token obtained');
            }

            addTestResult(result);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            addTestResult({
                name: 'Token Refresh Test',
                status: 'error',
                details: `❌ Network error: ${errorMessage}`,
                time: Date.now() - startTime,
            });
            toast.error('Token refresh failed');
        } finally {
            setLoading(false);
        }
    };

    // Test 5: User Data Integrity
    const testUserDataIntegrity = async (): Promise<void> => {
        if (!currentUser) {
            toast.error('No user data loaded. Verify token first.');
            return;
        }

        setLoading(true);
        const startTime = Date.now();

        const issues: string[] = [];
        const user = currentUser;

        // Validate required fields
        if (!user.userId) issues.push('Missing userId');
        if (!user.email) issues.push('Missing email');
        if (!user.name) issues.push('Missing name');
        if (!user.provider) issues.push('Missing provider');
        if (!user.createdAt) issues.push('Missing createdAt');

        // Provider-specific validation
        if (user.provider === 'LOCAL' && !user.password) {
            issues.push('LOCAL user missing password hash');
        }

        if (user.provider === 'LOCAL' && user.password && !user.password.startsWith('$2a$')) {
            issues.push('Password not properly hashed with BCrypt');
        }

        if (['GOOGLE', 'GITHUB'].includes(user.provider) && user.password) {
            issues.push('OAuth user should not have password');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (user.email && !emailRegex.test(user.email)) {
            issues.push('Invalid email format');
        }

        const isValid = issues.length === 0;

        const result: Omit<TestResult, 'id' | 'timestamp'> = {
            name: 'User Data Integrity Check',
            status: isValid ? 'success' : 'warning',
            details: isValid
                ? `✅ User data is valid - All required fields present and properly formatted`
                : `⚠️ Found ${issues.length} issue(s): ${issues.join(', ')}`,
            time: Date.now() - startTime,
        };

        addTestResult(result);
        setLoading(false);

        toast[isValid ? 'success' : 'warning'](
            isValid ? 'User data is valid' : `Found ${issues.length} issues`
        );
    };

    // Test 6: Email Lookup
    const testEmailLookup = async (): Promise<void> => {
        if (!testEmail) {
            toast.error('Please enter an email address');
            return;
        }

        setLoading(true);
        const startTime = Date.now();

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/users/email/${encodeURIComponent(testEmail)}`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            const time = Date.now() - startTime;

            const result: Omit<TestResult, 'id' | 'timestamp'> = {
                name: 'Email Lookup Test',
                status: response.ok ? 'success' : 'error',
                details: response.ok
                    ? `✅ User found - ${data.name} (${data.provider} account)`
                    : `❌ Lookup failed (${response.status}): ${data.message || 'User not found'}`,
                time,
            };

            addTestResult(result);
            toast[response.ok ? 'success' : 'error'](
                response.ok ? 'User found' : 'User not found'
            );
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            addTestResult({
                name: 'Email Lookup Test',
                status: 'error',
                details: `❌ Network error: ${errorMessage}`,
                time: Date.now() - startTime,
            });
            toast.error('Email lookup failed');
        } finally {
            setLoading(false);
        }
    };

    // Test 7: Security Headers Check
    const testSecurityHeaders = async (): Promise<void> => {
        setLoading(true);
        const startTime = Date.now();

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
                method: 'HEAD',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            const headers = Array.from(response.headers.entries());
            const securityHeaders: Record<string, string> = {
                'content-security-policy': 'CSP',
                'x-frame-options': 'X-Frame-Options',
                'x-content-type-options': 'X-Content-Type-Options',
                'strict-transport-security': 'HSTS',
                'x-xss-protection': 'XSS Protection',
            };

            const foundHeaders: string[] = [];
            const missingHeaders: string[] = [];

            Object.entries(securityHeaders).forEach(([header, name]) => {
                if (headers.some(([h]) => h.toLowerCase() === header)) {
                    foundHeaders.push(name);
                } else {
                    missingHeaders.push(name);
                }
            });

            const result: Omit<TestResult, 'id' | 'timestamp'> = {
                name: 'Security Headers Audit',
                status: missingHeaders.length === 0 ? 'success' : missingHeaders.length <= 2 ? 'warning' : 'error',
                details: missingHeaders.length === 0
                    ? `✅ All security headers present: ${foundHeaders.join(', ')}`
                    : `⚠️ Found ${foundHeaders.length}/5 headers. Missing: ${missingHeaders.join(', ')}`,
                time: Date.now() - startTime,
            };

            addTestResult(result);
            toast[missingHeaders.length === 0 ? 'success' : 'warning'](
                missingHeaders.length === 0 ? 'All security headers present' : 'Some headers missing'
            );
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            addTestResult({
                name: 'Security Headers Audit',
                status: 'error',
                details: `❌ Failed to check headers: ${errorMessage}`,
                time: Date.now() - startTime,
            });
            toast.error('Security headers check failed');
        } finally {
            setLoading(false);
        }
    };

    // Helper function to add test result
    const addTestResult = (result: Omit<TestResult, 'id' | 'timestamp'>): void => {
        setTestResults(prev => [{
            ...result,
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
        }, ...prev]);
    };

    // Clear all test results
    const clearResults = (): void => {
        setTestResults([]);
        setMetrics({
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            warningTests: 0,
        });
        toast.info('Cleared all test results');
    };

    // Copy to clipboard
    const copyToClipboard = (text: string): void => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    // Run all tests
    const runAllTests = async (): Promise<void> => {
        toast.info('Running comprehensive security audit...');

        await testJWTParse();
        await new Promise(r => setTimeout(r, 500));

        await testTokenExpiry();
        await new Promise(r => setTimeout(r, 500));

        await testTokenVerification();
        await new Promise(r => setTimeout(r, 500));

        await testUserDataIntegrity();
        await new Promise(r => setTimeout(r, 500));

        await testSecurityHeaders();

        toast.success('Security audit completed');
    };

    // Load token from cookie
    const loadTokenFromCookie = (): void => {
        const accessToken = getCookie('accessToken');
        if (accessToken) {
            setJwtToken(accessToken);
            setUsingCookie(true);
            toast.success('Token loaded from cookie');
        } else {
            toast.error('No access token found in cookies');
        }
    };

    // Get token status
    const getTokenStatus = (): TokenStatus => {
        if (!parsedToken?.isValid) return { status: 'invalid', message: 'Invalid token', color: 'red' };

        const exp = parsedToken.payload.exp || 0;
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = exp - now;

        if (timeLeft <= 0) return { status: 'expired', message: 'Token expired', color: 'red' };
        if (timeLeft < 300) return { status: 'expiring', message: `Expires in ${Math.floor(timeLeft / 60)}m`, color: 'yellow' };
        return { status: 'valid', message: `Valid for ${Math.floor(timeLeft / 3600)}h ${Math.floor((timeLeft % 3600) / 60)}m`, color: 'green' };
    };

    const tokenStatus = getTokenStatus();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950 p-4 md:p-8">
            <Toaster position="top-right" richColors />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                    <ShieldCheck className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    AuthPlus Security Dashboard
                                </h1>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Professional security testing and authentication flow validation
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="gap-1">
                                    <Server className="w-3 h-3" />
                                    {API_BASE_URL.replace('https://', '')}
                                </Badge>
                                <Badge variant="outline" className="gap-1">
                                    <Network className="w-3 h-3" />
                                    {FRONTEND_URL.replace('https://', '')}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={runAllTests} disabled={loading || !jwtToken} className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                <TestTube className="w-4 h-4" />
                                Run Full Audit
                            </Button>
                            <Button variant="outline" onClick={clearResults}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear
                            </Button>
                        </div>
                    </div>

                    {/* Status Banner */}
                    {currentUser && (
                        <Alert className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                            <UserCheck className="w-4 h-4 text-green-600" />
                            <AlertTitle className="text-green-900 dark:text-green-100">Authenticated Session</AlertTitle>
                            <AlertDescription className="text-green-800 dark:text-green-200">
                                Logged in as <strong>{currentUser.name}</strong> ({currentUser.email}) via {currentUser.provider}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Testing Tools */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* JWT Tester Card */}
                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Key className="w-5 h-5 text-blue-500" />
                                    JWT Token Analyzer
                                </CardTitle>
                                <CardDescription>
                                    Decode and validate JWT tokens from cookies or manual input
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Button
                                        onClick={loadTokenFromCookie}
                                        variant="outline"
                                        className="gap-2"
                                        disabled={loading}
                                    >
                                        <Cookie className="w-4 h-4" />
                                        Load from Cookie
                                    </Button>
                                    {usingCookie && (
                                        <Badge variant="secondary" className="gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            Using cookie token
                                        </Badge>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jwt-token">JWT Access Token</Label>
                                    <div className="relative">
                                        <Textarea
                                            id="jwt-token"
                                            value={showToken ? jwtToken : jwtToken.replace(/./g, '•')}
                                            onChange={(e) => {
                                                setJwtToken(e.target.value);
                                                setUsingCookie(false);
                                            }}
                                            className="font-mono text-sm min-h-[100px] pr-20"
                                            placeholder="Paste JWT token or load from cookie..."
                                        />
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setShowToken(!showToken)}
                                            >
                                                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => copyToClipboard(jwtToken)}
                                                disabled={!jwtToken}
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Button size="sm" onClick={testJWTParse} disabled={loading || !jwtToken}>
                                            <Scan className="w-4 h-4 mr-2" />
                                            Parse & Decode
                                        </Button>
                                        <Button size="sm" onClick={testTokenExpiry} disabled={!parsedToken?.isValid || loading}>
                                            <Clock className="w-4 h-4 mr-2" />
                                            Check Expiry
                                        </Button>
                                        <Button size="sm" onClick={testTokenVerification} disabled={!jwtToken || loading}>
                                            <ShieldCheck className="w-4 h-4 mr-2" />
                                            Verify Token
                                        </Button>
                                    </div>
                                </div>

                                {parsedToken && parsedToken.isValid && (
                                    <div className="space-y-4">
                                        <Separator />

                                        {/* Token Status Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div className={`p-3 rounded-lg border-2 ${tokenStatus.color === 'green' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
                                                tokenStatus.color === 'yellow' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' :
                                                    'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                                                }`}>
                                                <div className="flex items-center gap-2">
                                                    {tokenStatus.color === 'green' && <CheckCircle className="w-5 h-5 text-green-600" />}
                                                    {tokenStatus.color === 'yellow' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                                                    {tokenStatus.color === 'red' && <XCircle className="w-5 h-5 text-red-600" />}
                                                    <div>
                                                        <div className="text-xs text-gray-600 dark:text-gray-400">Status</div>
                                                        <div className="font-semibold text-sm">{tokenStatus.message}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-3 rounded-lg border-2 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                                                <div className="flex items-center gap-2">
                                                    <Hash className="w-5 h-5 text-blue-600" />
                                                    <div>
                                                        <div className="text-xs text-gray-600 dark:text-gray-400">Algorithm</div>
                                                        <div className="font-semibold text-sm">{parsedToken.header.alg}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-3 rounded-lg border-2 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-5 h-5 text-purple-600" />
                                                    <div>
                                                        <div className="text-xs text-gray-600 dark:text-gray-400">Type</div>
                                                        <div className="font-semibold text-sm">{parsedToken.payload.type || 'access'}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Token Details Tabs */}
                                        <Tabs defaultValue="payload" className="w-full">
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger value="payload">Payload</TabsTrigger>
                                                <TabsTrigger value="header">Header</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="payload" className="mt-4">
                                                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-[300px]">
                                                    <pre>{JSON.stringify(parsedToken.payload, null, 2)}</pre>
                                                </div>
                                            </TabsContent>
                                            <TabsContent value="header" className="mt-4">
                                                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-[300px]">
                                                    <pre>{JSON.stringify(parsedToken.header, null, 2)}</pre>
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* API Testing Card */}
                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Server className="w-5 h-5 text-green-500" />
                                    API Endpoint Testing
                                </CardTitle>
                                <CardDescription>
                                    Test AuthPlus backend endpoints and validate responses
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Button
                                        onClick={testTokenRefresh}
                                        disabled={loading}
                                        variant="outline"
                                        className="justify-start"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Test Token Refresh
                                    </Button>

                                    <Button
                                        onClick={fetchAllUsers}
                                        disabled={loading || !jwtToken}
                                        variant="outline"
                                        className="justify-start"
                                    >
                                        <Database className="w-4 h-4 mr-2" />
                                        Fetch All Users
                                    </Button>

                                    <Button
                                        onClick={testUserDataIntegrity}
                                        disabled={loading || !currentUser}
                                        variant="outline"
                                        className="justify-start"
                                    >
                                        <CheckCheck className="w-4 h-4 mr-2" />
                                        Validate User Data
                                    </Button>

                                    <Button
                                        onClick={testSecurityHeaders}
                                        disabled={loading || !jwtToken}
                                        variant="outline"
                                        className="justify-start"
                                    >
                                        <ShieldCheck className="w-4 h-4 mr-2" />
                                        Check Headers
                                    </Button>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label htmlFor="test-email">Email Lookup Test</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="test-email"
                                            value={testEmail}
                                            onChange={(e) => setTestEmail(e.target.value)}
                                            placeholder="user@example.com"
                                            type="email"
                                        />
                                        <Button
                                            onClick={testEmailLookup}
                                            disabled={loading || !testEmail || !jwtToken}
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            Lookup
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Test Results */}
                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-orange-500" />
                                    Test Results & Audit Log
                                </CardTitle>
                                <CardDescription>
                                    Real-time security test results and performance metrics
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {testResults.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                        <TestTube className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                        <p className="text-lg font-medium">No tests run yet</p>
                                        <p className="text-sm mt-2">Click &quot;Run Full Audit&quot; to start comprehensive testing</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                        {testResults.map((result) => (
                                            <div
                                                key={result.id}
                                                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${result.status === 'success'
                                                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                                                    : result.status === 'error'
                                                        ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                                                        : 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-3 flex-1">
                                                        {result.status === 'success' && (
                                                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                        )}
                                                        {result.status === 'error' && (
                                                            <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                                        )}
                                                        {result.status === 'warning' && (
                                                            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-sm mb-1">{result.name}</h4>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                                                                {result.details}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <span className="text-xs text-gray-500 block">{result.timestamp}</span>
                                                        <Badge variant="outline" className="mt-1 font-mono text-xs">
                                                            {result.time}ms
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Stats & Info */}
                    <div className="space-y-6">
                        {/* Current User Card */}
                        {currentUser && (
                            <Card className="border-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <UserCheck className="w-5 h-5 text-indigo-500" />
                                        Current User
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            {currentUser.image ? (
                                                <img
                                                    src={currentUser.image}
                                                    alt={currentUser.name}
                                                    className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                                    {currentUser.name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold">{currentUser.name}</p>
                                                <p className="text-sm text-gray-500">{currentUser.email}</p>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">User ID</span>
                                                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                    {currentUser.userId.split('-')[0]}...
                                                </code>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Provider</span>
                                                <Badge variant="secondary">{currentUser.provider}</Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Status</span>
                                                <Badge variant={currentUser.enabled ? "default" : "destructive"}>
                                                    {currentUser.enabled ? 'Active' : 'Disabled'}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Created</span>
                                                <span className="text-xs">
                                                    {new Date(currentUser.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {currentUser.password && (
                                                <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Password Hash</div>
                                                    <code className="text-xs break-all">
                                                        {currentUser.password.substring(0, 40)}...
                                                    </code>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Users Database */}
                        {allUsers.length > 0 && (
                            <Card className="border-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Database className="w-5 h-5 text-purple-500" />
                                        Users Database
                                    </CardTitle>
                                    <CardDescription>
                                        {allUsers.length} user{allUsers.length !== 1 ? 's' : ''} found
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Tabs defaultValue="all" className="w-full">
                                        <TabsList className="grid w-full grid-cols-4">
                                            <TabsTrigger value="all">All</TabsTrigger>
                                            <TabsTrigger value="local">Local</TabsTrigger>
                                            <TabsTrigger value="github">GitHub</TabsTrigger>
                                            <TabsTrigger value="google">Google</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="all" className="space-y-3 mt-4 max-h-[400px] overflow-y-auto">
                                            {allUsers.map((user) => (
                                                <div key={user.userId} className="p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        {user.image ? (
                                                            <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                                                                {user.name.charAt(0)}
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm truncate">{user.name}</p>
                                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                            <Badge variant="outline" className="mt-1 text-xs">
                                                                {user.provider}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </TabsContent>

                                        {['LOCAL', 'GITHUB', 'GOOGLE'].map((provider) => (
                                            <TabsContent key={provider} value={provider.toLowerCase()} className="space-y-3 mt-4">
                                                {allUsers.filter((u: User) => u.provider === provider).map((user) => (
                                                    <div key={user.userId} className="p-3 rounded-lg border">
                                                        <div className="flex items-center gap-3">
                                                            {user.image ? (
                                                                <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                                                                    {user.name.charAt(0)}
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="font-medium text-sm">{user.name}</p>
                                                                <p className="text-xs text-gray-500">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </TabsContent>
                                        ))}
                                    </Tabs>
                                </CardContent>
                            </Card>
                        )}

                        {/* Security Metrics */}
                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-amber-500" />
                                    Security Metrics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium">Tests Passed</span>
                                            <span className="text-sm font-bold text-green-600">
                                                {metrics.passedTests}/{metrics.totalTests}
                                            </span>
                                        </div>
                                        <Progress
                                            value={metrics.totalTests ? (metrics.passedTests / metrics.totalTests) * 100 : 0}
                                            className="h-2 bg-gray-200"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium">JWT Validity</span>
                                            <span className="text-sm font-bold">
                                                {parsedToken?.isValid ? '100%' : '0%'}
                                            </span>
                                        </div>
                                        <Progress
                                            value={parsedToken?.isValid ? 100 : 0}
                                            className="h-2"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium">Token Time Remaining</span>
                                            <span className="text-sm font-bold">
                                                {parsedToken?.payload?.exp
                                                    ? `${Math.max(0, Math.floor((parsedToken.payload.exp - Date.now() / 1000) / 60))}m`
                                                    : 'N/A'
                                                }
                                            </span>
                                        </div>
                                        <Progress
                                            value={
                                                parsedToken?.payload?.exp
                                                    ? Math.max(0, Math.min(100, ((parsedToken.payload.exp - Date.now() / 1000) / 1800) * 100))
                                                    : 0
                                            }
                                            className="h-2"
                                        />
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-3 gap-3 pt-2">
                                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">{metrics.passedTests}</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400">Passed</div>
                                        </div>
                                        <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-yellow-600">{metrics.warningTests}</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400">Warnings</div>
                                        </div>
                                        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-red-600">{metrics.failedTests}</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400">Failed</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle className="text-base">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={loadTokenFromCookie}
                                    size="sm"
                                >
                                    <Cookie className="w-4 h-4 mr-2" />
                                    Load Cookie Token
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={testJWTParse}
                                    disabled={!jwtToken}
                                    size="sm"
                                >
                                    <Hash className="w-4 h-4 mr-2" />
                                    Decode JWT
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={testTokenVerification}
                                    disabled={!jwtToken}
                                    size="sm"
                                >
                                    <ShieldCheck className="w-4 h-4 mr-2" />
                                    Verify with Backend
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={fetchAllUsers}
                                    disabled={!jwtToken}
                                    size="sm"
                                >
                                    <Database className="w-4 h-4 mr-2" />
                                    Fetch Users
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}