'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, FileCode } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

interface APIEndpoint {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    endpoint: string;
    description: string;
    authRequired: boolean;
    request?: string;
    response?: string;
}

const apiEndpoints: APIEndpoint[] = [
    {
        method: 'POST',
        endpoint: '/api/auth/login',
        description: 'Authenticate user with credentials',
        authRequired: false,
        request: `{
  "email": "user@example.com",
  "password": "password123"
}`,
        response: `{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "roles": ["USER"]
  }
}`
    },
    {
        method: 'POST',
        endpoint: '/api/auth/register',
        description: 'Register new user',
        authRequired: false,
        request: `{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "John Doe"
}`,
        response: `{
  "message": "User registered successfully",
  "userId": 2
}`
    },
    {
        method: 'POST',
        endpoint: '/api/auth/refresh',
        description: 'Refresh access token',
        authRequired: true,
        request: `{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`,
        response: `{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`
    },
    {
        method: 'GET',
        endpoint: '/api/auth/profile',
        description: 'Get current user profile',
        authRequired: true,
        response: `{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "roles": ["USER"],
  "createdAt": "2024-01-15T10:30:00Z"
}`
    },
    {
        method: 'POST',
        endpoint: '/api/auth/logout',
        description: 'Invalidate user session',
        authRequired: true,
        request: `{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`
    },
    {
        method: 'GET',
        endpoint: '/api/auth/oauth/google',
        description: 'Initiate Google OAuth flow',
        authRequired: false
    }
];

export function APITable() {
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const getMethodColor = (method: APIEndpoint['method']) => {
        switch (method) {
            case 'GET': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'POST': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'PUT': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case 'PATCH': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Method
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Endpoint
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Description
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Auth
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {apiEndpoints.map((endpoint, index) => (
                            <motion.tr
                                key={endpoint.endpoint}
                                initial={false}
                                className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                            >
                                <td className="py-3 px-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                                        {endpoint.method}
                                    </span>
                                </td>
                                <td className="py-3 px-4 font-mono text-sm text-gray-900 dark:text-gray-100">
                                    {endpoint.endpoint}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                    {endpoint.description}
                                </td>
                                <td className="py-3 px-4">
                                    {endpoint.authRequired ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                            Required
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                            Optional
                                        </span>
                                    )}
                                </td>
                                <td className="py-3 px-4">
                                    <button
                                        onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                                        className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                    >
                                        <FileCode className="w-4 h-4 mr-2" />
                                        <span>Show details</span>
                                        <ChevronDown
                                            className={`w-4 h-4 ml-1 transition-transform ${expandedRow === index ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Expanded row content */}
            <AnimatePresence>
                {expandedRow !== null && apiEndpoints[expandedRow] && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-200 dark:border-gray-800 overflow-hidden"
                    >
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    API Details
                                </h4>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Base URL: https://api.authplus.com
                                    </span>
                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {apiEndpoints[expandedRow].request && (
                                    <div>
                                        <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                            Request Body
                                        </h5>
                                        <CodeBlock
                                            code={apiEndpoints[expandedRow].request!}
                                            language="json"
                                        />
                                    </div>
                                )}
                                {apiEndpoints[expandedRow].response && (
                                    <div>
                                        <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                            Response
                                        </h5>
                                        <CodeBlock
                                            code={apiEndpoints[expandedRow].response!}
                                            language="json"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}