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

// Utility function to parse JWT
const parseJWT = (token: string) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }

        const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

        return {
            header,
            payload,
            signature: parts[2],
            isValid: true,
        };
    } catch (error) {
        return {
            header: {},
            payload: {},
            signature: '',
            isValid: false,
            error: error.message,
        };
    }
};

// Utility to check token expiry
const isTokenExpired = (exp: number) => {
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
};

export default function SecurityTestingDashboard() {
    const [activeTab, setActiveTab] = useState('jwt-tester');
    const [loading, setLoading] = useState(false);

    // Test data
    const [jwtToken, setJwtToken] = useState('eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwMTJjNWQ3Ny05YTJlLTQ0MzQtYjI5My1lYjQ0OGVkYjhmNGMiLCJzdWIiOiIxODFjMWQ3MS1kNTZjLTQwNWQtYjcxNi0wZDBiOGRjNGM2NzciLCJpc3MiOiJzZWN1cml0aWVzLmF1dGhwbHVzLmNvbSIsImlhdCI6MTc2OTUyMzAxMywiZXhwIjoxNzY5NTI0ODEzLCJyb2xlcyI6W10sImVtYWlsIjoiYWthcnNoQG1haWwuY29tIiwidHlwZSI6ImFjY2VzcyJ9.YklHKnKwPEN86h9xoSGDhgsAFhqwVg_uq4k4YFSMgMY');
    const [parsedToken, setParsedToken] = useState<any>(null);
    const [testResults, setTestResults] = useState<any[]>([]);
    const [apiEndpoint, setApiEndpoint] = useState('http://localhost:8080/api/auth/verify');
    const [showToken, setShowToken] = useState(false);

    // User data for testing
    const [userData, setUserData] = useState([
        {
            "userId": "181c1d71-d56c-405d-b716-0d0b8dc4c677",
            "email": "akarsh@mail.com",
            "name": "Akarsh Mishra",
            "password": "$2a$10$CLXGo2QVfDwtfdooGSeNCO6vfTuXxMmUFq26.Kabf/eC0lZFfQfqG",
            "image": null,
            "enabled": true,
            "createdAt": "2026-01-27T14:10:01.517981Z",
            "updatedAt": "2026-01-27T14:10:01.656146Z",
            "provider": "LOCAL",
            "roles": []
        },
        {
            "userId": "4b33db0a-e26c-48c4-aff0-76dc43495c2d",
            "email": "akarshmi@github.com",
            "name": "Akarsh Mishra",
            "password": null,
            "image": "https://avatars.githubusercontent.com/u/155228025?v=4",
            "enabled": true,
            "createdAt": "2026-01-27T13:50:12.460489Z",
            "updatedAt": "2026-01-27T13:50:12.460489Z",
            "provider": "GITHUB",
            "roles": []
        },
        {
            "userId": "922b372c-19ca-494e-a5ec-300e61772a2d",
            "email": "algorithmiclyricist@gmail.com",
            "name": "Lyrical Coder",
            "password": null,
            "image": "https://lh3.googleusercontent.com/a/ACg8ocJIMZyw2pemNoOOYBBHIMyDyUjoQD0xUPj9jcshbxp0HkYloNI=s96-c",
            "enabled": true,
            "createdAt": "2026-01-27T13:39:45.037900Z",
            "updatedAt": "2026-01-27T13:39:45.037900Z",
            "provider": "GOOGLE",
            "roles": []
        }
    ]);

    // Parse JWT on token change
    useEffect(() => {
        if (jwtToken) {
            const parsed = parseJWT(jwtToken);
            setParsedToken(parsed);
        }
    }, [jwtToken]);

    // Test 1: Parse and Validate JWT
    const testJWTParse = () => {
        setLoading(true);
        const startTime = Date.now();

        const parsed = parseJWT(jwtToken);
        setParsedToken(parsed);

        const result = {
            id: Date.now(),
            name: 'JWT Token Analysis',
            status: parsed.isValid ? 'success' : 'error',
            details: parsed.isValid
                ? `✅ Token parsed successfully. Algorithm: ${parsed.header.alg}, Issuer: ${parsed.payload.iss}`
                : `❌ Invalid JWT: ${parsed.error}`,
            time: Date.now() - startTime,
            timestamp: new Date().toLocaleTimeString(),
        };

        setTestResults(prev => [result, ...prev]);
        setLoading(false);

        toast[parsed.isValid ? 'success' : 'error'](
            parsed.isValid ? 'JWT parsed successfully' : 'Invalid JWT token'
        );
    };

    // Test 2: Check Token Expiry
    const testTokenExpiry = () => {
        if (!parsedToken?.isValid) {
            toast.error('Please parse a valid JWT first');
            return;
        }

        setLoading(true);
        const startTime = Date.now();

        const exp = parsedToken.payload.exp;
        const isExpired = isTokenExpired(exp);
        const expiryDate = new Date(exp * 1000).toLocaleString();

        const result = {
            id: Date.now(),
            name: 'Token Expiry Check',
            status: isExpired ? 'error' : 'success',
            details: isExpired
                ? `❌ Token expired on ${expiryDate}`
                : `✅ Token valid until ${expiryDate}`,
            time: Date.now() - startTime,
            timestamp: new Date().toLocaleTimeString(),
        };

        setTestResults(prev => [result, ...prev]);
        setLoading(false);

        toast[isExpired ? 'warning' : 'success'](
            isExpired ? 'Token has expired' : 'Token is valid'
        );
    };

    // Test 3: Test API Endpoint
    const testApiEndpoint = async () => {
        setLoading(true);
        const startTime = Date.now();

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
                body: JSON.stringify({ token: jwtToken }),
            });

            const data = await response.json();

            const result = {
                id: Date.now(),
                name: 'API Endpoint Test',
                status: response.ok ? 'success' : 'error',
                details: response.ok
                    ? `✅ API returned ${response.status}: ${JSON.stringify(data)}`
                    : `❌ API error ${response.status}: ${JSON.stringify(data)}`,
                time: Date.now() - startTime,
                timestamp: new Date().toLocaleTimeString(),
            };

            setTestResults(prev => [result, ...prev]);
            toast.success(`API responded with ${response.status}`);
        } catch (error) {
            const result = {
                id: Date.now(),
                name: 'API Endpoint Test',
                status: 'error',
                details: `❌ Network error: ${error.message}`,
                time: Date.now() - startTime,
                timestamp: new Date().toLocaleTimeString(),
            };

            setTestResults(prev => [result, ...prev]);
            toast.error('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Test 4: Validate User Data Structure
    const testUserDataStructure = () => {
        setLoading(true);
        const startTime = Date.now();

        let isValid = true;
        let issues: string[] = [];

        userData.forEach((user, index) => {
            if (!user.userId) issues.push(`User ${index}: Missing userId`);
            if (!user.email) issues.push(`User ${index}: Missing email`);
            if (!user.createdAt) issues.push(`User ${index}: Missing createdAt`);
            if (!user.provider) issues.push(`User ${index}: Missing provider`);

            // Check if password is hashed for LOCAL provider
            if (user.provider === 'LOCAL' && !user.password?.startsWith('$2a$')) {
                issues.push(`User ${index}: LOCAL user password not properly hashed`);
            }
        });

        isValid = issues.length === 0;

        const result = {
            id: Date.now(),
            name: 'User Data Validation',
            status: isValid ? 'success' : 'error',
            details: isValid
                ? `✅ All ${userData.length} users have valid data structure`
                : `❌ Found ${issues.length} issues: ${issues.join(', ')}`,
            time: Date.now() - startTime,
            timestamp: new Date().toLocaleTimeString(),
        };

        setTestResults(prev => [result, ...prev]);
        setLoading(false);

        toast[isValid ? 'success' : 'warning'](
            isValid ? 'User data is valid' : `Found ${issues.length} issues`
        );
    };

    // Test 5: Security Headers Check
    const testSecurityHeaders = async () => {
        setLoading(true);
        const startTime = Date.now();

        try {
            const response = await fetch(apiEndpoint, {
                method: 'HEAD',
            });

            const headers = Array.from(response.headers.entries());
            const securityHeaders = [
                'content-security-policy',
                'x-frame-options',
                'x-content-type-options',
                'strict-transport-security',
                'x-xss-protection',
            ];

            const missingHeaders = securityHeaders.filter(
                header => !headers.some(([h]) => h.toLowerCase() === header)
            );

            const result = {
                id: Date.now(),
                name: 'Security Headers Check',
                status: missingHeaders.length === 0 ? 'success' : 'warning',
                details: missingHeaders.length === 0
                    ? '✅ All security headers present'
                    : `⚠️ Missing headers: ${missingHeaders.join(', ')}`,
                time: Date.now() - startTime,
                timestamp: new Date().toLocaleTimeString(),
            };

            setTestResults(prev => [result, ...prev]);
            toast[missingHeaders.length === 0 ? 'success' : 'warning'](
                missingHeaders.length === 0 ? 'Security headers OK' : 'Some headers missing'
            );
        } catch (error) {
            toast.error('Failed to check headers');
        } finally {
            setLoading(false);
        }
    };

    // Clear all test results
    const clearResults = () => {
        setTestResults([]);
        toast.info('Cleared all test results');
    };

    // Copy JWT to clipboard
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    // Run all tests
    const runAllTests = async () => {
        await testJWTParse();
        await testTokenExpiry();
        await testUserDataStructure();
        await testSecurityHeaders();
        toast.info('All tests completed');
    };

    // Get token expiry status
    const getTokenStatus = () => {
        if (!parsedToken?.isValid) return { status: 'invalid', message: 'Invalid token' };

        const exp = parsedToken.payload.exp;
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = exp - now;

        if (timeLeft <= 0) return { status: 'expired', message: 'Token expired' };
        if (timeLeft < 300) return { status: 'expiring', message: 'Expires soon' };
        return { status: 'valid', message: 'Valid token' };
    };

    const tokenStatus = getTokenStatus();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-4 md:p-8">
            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Security Testing Dashboard
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Test JWT tokens, API security, and authentication flows in real-time
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={runAllTests} disabled={loading} className="gap-2">
                                <TestTube className="w-4 h-4" />
                                Run All Tests
                            </Button>
                            <Button variant="outline" onClick={clearResults}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear Results
                            </Button>
                        </div>
                    </div>

                    <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <Shield className="w-4 h-4" />
                        <AlertTitle>Security Testing Environment</AlertTitle>
                        <AlertDescription>
                            This dashboard allows you to test authentication tokens, validate API security,
                            and check user data integrity. All operations are performed client-side for security.
                        </AlertDescription>
                    </Alert>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Testing Tools */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* JWT Tester Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Key className="w-5 h-5 text-blue-500" />
                                    JWT Token Tester
                                </CardTitle>
                                <CardDescription>
                                    Paste your JWT token to analyze its contents and validity
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="jwt-token">JWT Token</Label>
                                    <div className="relative">
                                        <Textarea
                                            id="jwt-token"
                                            value={jwtToken}
                                            onChange={(e) => setJwtToken(e.target.value)}
                                            className="font-mono text-sm min-h-[100px]"
                                            placeholder="Paste your JWT token here..."
                                        />
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="absolute top-2 right-2"
                                            onClick={() => setShowToken(!showToken)}
                                        >
                                            {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Button size="sm" onClick={testJWTParse} disabled={loading}>
                                            <Scan className="w-4 h-4 mr-2" />
                                            Parse JWT
                                        </Button>
                                        <Button size="sm" onClick={testTokenExpiry} disabled={!parsedToken?.isValid || loading}>
                                            <Clock className="w-4 h-4 mr-2" />
                                            Check Expiry
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(jwtToken)}>
                                            <Copy className="w-4 h-4 mr-2" />
                                            Copy Token
                                        </Button>
                                    </div>
                                </div>

                                {parsedToken && (
                                    <div className="space-y-4">
                                        <Separator />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Token Status</Label>
                                                <div className={`p-3 rounded-lg ${tokenStatus.status === 'valid' ? 'bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
                                                    tokenStatus.status === 'expiring' ? 'bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
                                                        'bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                                                    }`}>
                                                    <div className="flex items-center gap-2">
                                                        {tokenStatus.status === 'valid' && <CheckCircle className="w-5 h-5 text-green-600" />}
                                                        {tokenStatus.status === 'expiring' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                                                        {tokenStatus.status === 'invalid' && <XCircle className="w-5 h-5 text-red-600" />}
                                                        <span className="font-medium">{tokenStatus.message}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Token Type</Label>
                                                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="w-5 h-5 text-blue-500" />
                                                        <span className="font-medium">{parsedToken.payload?.type || 'access'} token</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {parsedToken.isValid && (
                                            <Tabs defaultValue="header">
                                                <TabsList className="grid w-full grid-cols-2">
                                                    <TabsTrigger value="header">Header</TabsTrigger>
                                                    <TabsTrigger value="payload">Payload</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="header" className="mt-4">
                                                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-auto">
                                                        <pre>{JSON.stringify(parsedToken.header, null, 2)}</pre>
                                                    </div>
                                                </TabsContent>
                                                <TabsContent value="payload" className="mt-4">
                                                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-auto">
                                                        <pre>{JSON.stringify(parsedToken.payload, null, 2)}</pre>
                                                    </div>
                                                </TabsContent>
                                            </Tabs>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* API Testing Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Server className="w-5 h-5 text-green-500" />
                                    API Security Testing
                                </CardTitle>
                                <CardDescription>
                                    Test API endpoints with your JWT token
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="api-endpoint">API Endpoint</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="api-endpoint"
                                            value={apiEndpoint}
                                            onChange={(e) => setApiEndpoint(e.target.value)}
                                            placeholder="https://api.example.com/auth/verify"
                                        />
                                        <Button onClick={testApiEndpoint} disabled={loading}>
                                            <Send className="w-4 h-4 mr-2" />
                                            Test
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Button size="sm" onClick={testSecurityHeaders} disabled={loading}>
                                        <ShieldCheck className="w-4 h-4 mr-2" />
                                        Check Headers
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={testUserDataStructure}>
                                        <Database className="w-4 h-4 mr-2" />
                                        Validate Data
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Test Results */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bug className="w-5 h-5 text-orange-500" />
                                    Test Results
                                </CardTitle>
                                <CardDescription>
                                    Real-time results from security tests
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {testResults.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Run tests to see results here</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                        {testResults.map((result) => (
                                            <div
                                                key={result.id}
                                                className={`p-4 rounded-lg border ${result.status === 'success'
                                                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                                                    : result.status === 'error'
                                                        ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                                                        : 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {result.status === 'success' && (
                                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                                        )}
                                                        {result.status === 'error' && (
                                                            <XCircle className="w-5 h-5 text-red-600" />
                                                        )}
                                                        {result.status === 'warning' && (
                                                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                                        )}
                                                        <div>
                                                            <h4 className="font-semibold">{result.name}</h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                {result.details}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xs text-gray-500">{result.timestamp}</span>
                                                        <p className="text-sm font-mono">{result.time}ms</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - User Data & Info */}
                    <div className="space-y-6">
                        {/* User Data Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="w-5 h-5 text-purple-500" />
                                    User Database
                                </CardTitle>
                                <CardDescription>
                                    Sample user data for testing
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="local">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="local">Local</TabsTrigger>
                                        <TabsTrigger value="github">GitHub</TabsTrigger>
                                        <TabsTrigger value="google">Google</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="local" className="space-y-3">
                                        {userData
                                            .filter(u => u.provider === 'LOCAL')
                                            .map((user) => (
                                                <div key={user.userId} className="p-3 rounded-lg border">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                            <UserCheck className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{user.name}</p>
                                                            <p className="text-sm text-gray-500">{user.email}</p>
                                                            <Badge variant="outline" className="mt-1">
                                                                {user.provider}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    {user.password && (
                                                        <div className="mt-2 text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                                                            Hash: {user.password.substring(0, 20)}...
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                    </TabsContent>
                                    <TabsContent value="github">
                                        {userData
                                            .filter(u => u.provider === 'GITHUB')
                                            .map((user) => (
                                                <div key={user.userId} className="p-3 rounded-lg border">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={user.image!}
                                                            alt={user.name}
                                                            className="w-10 h-10 rounded-full"
                                                        />
                                                        <div>
                                                            <p className="font-medium">{user.name}</p>
                                                            <p className="text-sm text-gray-500">{user.email}</p>
                                                            <Badge variant="outline" className="mt-1">
                                                                {user.provider}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 text-xs text-gray-500">
                                                        No password stored (OAuth)
                                                    </div>
                                                </div>
                                            ))}
                                    </TabsContent>
                                    <TabsContent value="google">
                                        {userData
                                            .filter(u => u.provider === 'GOOGLE')
                                            .map((user) => (
                                                <div key={user.userId} className="p-3 rounded-lg border">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={user.image!}
                                                            alt={user.name}
                                                            className="w-10 h-10 rounded-full"
                                                        />
                                                        <div>
                                                            <p className="font-medium">{user.name}</p>
                                                            <p className="text-sm text-gray-500">{user.email}</p>
                                                            <Badge variant="outline" className="mt-1">
                                                                {user.provider}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        {/* Security Metrics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Cpu className="w-5 h-5 text-orange-500" />
                                    Security Metrics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">JWT Validity</span>
                                        <span className="font-medium">{parsedToken?.isValid ? 'Valid' : 'Invalid'}</span>
                                    </div>
                                    <Progress value={parsedToken?.isValid ? 100 : 0} className="h-2" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Token Expiry</span>
                                        <span className="font-medium">{tokenStatus.status}</span>
                                    </div>
                                    <Progress
                                        value={
                                            parsedToken?.payload?.exp
                                                ? Math.max(0, Math.min(100,
                                                    (parsedToken.payload.exp - Math.floor(Date.now() / 1000)) / 1800 * 100
                                                ))
                                                : 0
                                        }
                                        className="h-2"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Data Integrity</span>
                                        <span className="font-medium">3/3 Users</span>
                                    </div>
                                    <Progress value={100} className="h-2" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Test Coverage</span>
                                        <span className="font-medium">{testResults.length}/5 Tests</span>
                                    </div>
                                    <Progress value={(testResults.length / 5) * 100} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full justify-start" onClick={testJWTParse}>
                                    <Hash className="w-4 h-4 mr-2" />
                                    Decode JWT
                                </Button>
                                <Button variant="outline" className="w-full justify-start" onClick={testTokenExpiry}>
                                    <Clock className="w-4 h-4 mr-2" />
                                    Check Token Expiry
                                </Button>
                                <Button variant="outline" className="w-full justify-start" onClick={testApiEndpoint}>
                                    <Network className="w-4 h-4 mr-2" />
                                    Test API Endpoint
                                </Button>
                                <Button variant="outline" className="w-full justify-start" onClick={testUserDataStructure}>
                                    <Database className="w-4 h-4 mr-2" />
                                    Validate User Data
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}