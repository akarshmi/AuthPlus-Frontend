'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Shield,
    Key,
    Users,
    Globe,
    Github,
    Database,
    Cpu,
    Cloud,
    Zap,
    CheckCircle,
    ChevronRight,
    Lock,
    RefreshCw,
    LogOut,
    Mail,
    Server,
    Dock,
    Terminal,
    ShieldCheck,
    AlertTriangle,
    Clock,
    GitBranch,
    Package,
    Settings,
    FileText,
    Folder,
    File,
    ExternalLink,
    Smartphone,
    Monitor,
    Tablet,
} from 'lucide-react';
import { Section } from '@/components/docs/Section';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { TechStackCard } from '@/components/docs/TechStackCard';
import { FlowStep } from '@/components/docs/FlowStep';
import { APITable } from '@/components/docs/APITable';
import { ProjectStructure } from '@/components/docs/ProjectStructure';
import { EnvironmentVariableGroup } from '@/components/docs/EnvironmentVariableGroup';

export default function DocsPage() {
    const [activeTab, setActiveTab] = useState<'backend' | 'frontend'>('backend');
    const [activeAuthTab, setActiveAuthTab] = useState<'login' | 'oauth' | 'refresh'>('login');

    return (
        <div className="pb-32">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
            >
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full mb-6">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Production Ready Authentication
                    </span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        AuthPlus
                    </span>{' '}
                    Documentation
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
                    Enterprise-grade authentication solution built with Next.js + Spring Boot.
                    Features JWT, OAuth2, Social Logins, and secure session management.
                </p>

                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {[
                        { label: 'JWT', icon: <Key className="w-3 h-3" />, color: 'from-blue-500 to-blue-600' },
                        { label: 'OAuth2', icon: <Globe className="w-3 h-3" />, color: 'from-green-500 to-green-600' },
                        { label: 'Google', icon: <Globe className="w-3 h-3" />, color: 'from-red-500 to-red-600' },
                        { label: 'GitHub', icon: <Github className="w-3 h-3" />, color: 'from-gray-800 to-gray-900' },
                        { label: 'Spring Boot', icon: <Database className="w-3 h-3" />, color: 'from-green-600 to-green-700' },
                        { label: 'Next.js', icon: <Cpu className="w-3 h-3" />, color: 'from-gray-900 to-black' },
                    ].map((badge) => (
                        <span
                            key={badge.label}
                            className={`inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${badge.color} rounded-full text-sm font-medium text-white shadow-sm`}
                        >
                            {badge.icon}
                            <span>{badge.label}</span>
                        </span>
                    ))}
                </div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                >
                    <span>Get Started in 5 Minutes</span>
                    <ChevronRight className="w-5 h-5" />
                </motion.div>
            </motion.div>

            {/* Introduction */}
            <Section id="introduction" title="Introduction" subtitle="What is AuthPlus?">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                        AuthPlus is a comprehensive, production-ready authentication system that combines
                        the power of Next.js on the frontend with Spring Boot on the backend. It provides
                        everything you need for secure user authentication in modern web applications.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 mt-10">
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Enterprise Security</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Bank-level security with industry best practices</p>
                                </div>
                            </div>

                            <ul className="space-y-4">
                                <FeatureItem icon={<CheckCircle className="w-5 h-5 text-green-500" />}>
                                    JWT-based authentication with refresh tokens
                                </FeatureItem>
                                <FeatureItem icon={<CheckCircle className="w-5 h-5 text-green-500" />}>
                                    OAuth2 integration with Google, GitHub, and more
                                </FeatureItem>
                                <FeatureItem icon={<CheckCircle className="w-5 h-5 text-green-500" />}>
                                    Role-based access control (RBAC) with fine-grained permissions
                                </FeatureItem>
                                <FeatureItem icon={<CheckCircle className="w-5 h-5 text-green-500" />}>
                                    Session management and persistence across devices
                                </FeatureItem>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-gradient-to-br from-green-500 to-cyan-600 rounded-xl">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Developer Experience</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Built for developers, by developers</p>
                                </div>
                            </div>

                            <ul className="space-y-4">
                                <FeatureItem icon={<CheckCircle className="w-5 h-5 text-green-500" />}>
                                    Lightning-fast authentication flows with optimized performance
                                </FeatureItem>
                                <FeatureItem icon={<CheckCircle className="w-5 h-5 text-green-500" />}>
                                    Multi-provider social login with unified API
                                </FeatureItem>
                                <FeatureItem icon={<CheckCircle className="w-5 h-5 text-green-500" />}>
                                    Easy deployment to any cloud platform or on-premises
                                </FeatureItem>
                                <FeatureItem icon={<CheckCircle className="w-5 h-5 text-green-500" />}>
                                    Comprehensive documentation and TypeScript support
                                </FeatureItem>
                            </ul>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Tech Stack */}
            <Section id="tech-stack" title="Tech Stack" subtitle="Modern technologies powering AuthPlus">
                <div className="grid md:grid-cols-2 gap-8">
                    <TechStackCard
                        title="Frontend Stack"
                        icon={<Cpu className="w-8 h-8 text-blue-600" />}
                        gradient="from-blue-500 to-cyan-500"
                        items={[
                            {
                                name: 'Next.js 14 (App Router)',
                                description: 'React framework with server-side rendering and API routes',
                            },
                            {
                                name: 'TypeScript',
                                description: 'Type-safe JavaScript for better developer experience',
                            },
                            {
                                name: 'Tailwind CSS',
                                description: 'Utility-first CSS framework for rapid UI development',
                            },
                            {
                                name: 'Axios + React Query',
                                description: 'Data fetching and state management for API calls',
                            },
                            {
                                name: 'ShadCN UI',
                                description: 'Beautiful, accessible UI components',
                            },
                            {
                                name: 'Framer Motion',
                                description: 'Production-ready animations and interactions',
                            },
                        ]}
                    />
                    <TechStackCard
                        title="Backend Stack"
                        icon={<Database className="w-8 h-8 text-purple-600" />}
                        gradient="from-purple-500 to-pink-500"
                        items={[
                            {
                                name: 'Spring Boot 3',
                                description: 'Enterprise Java framework for microservices',
                            },
                            {
                                name: 'Spring Security 6',
                                description: 'Comprehensive security framework with OAuth2',
                            },
                            {
                                name: 'Spring Data JPA',
                                description: 'Object-relational mapping and data access',
                            },
                            {
                                name: 'JWT + JJWT',
                                description: 'JSON Web Token creation and validation',
                            },
                            {
                                name: 'Redis',
                                description: 'In-memory data store for sessions and caching',
                            },
                            {
                                name: 'PostgreSQL/MySQL',
                                description: 'Relational database for user data storage',
                            },
                        ]}
                    />
                </div>
            </Section>

            {/* Project Structure */}
            <Section id="project-structure" title="Project Structure">
                <ProjectStructure />
            </Section>

            {/* Setup Guide */}
            <Section id="setup-guide" title="Setup Guide" subtitle="Get started in minutes">
                <div className="space-y-8">
                    <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-800">
                        <TabButton
                            active={activeTab === 'backend'}
                            onClick={() => setActiveTab('backend')}
                            icon={<Server className="w-4 h-4" />}
                        >
                            Backend Setup
                        </TabButton>
                        <TabButton
                            active={activeTab === 'frontend'}
                            onClick={() => setActiveTab('frontend')}
                            icon={<Monitor className="w-4 h-4" />}
                        >
                            Frontend Setup
                        </TabButton>
                    </div>

                    {activeTab === 'backend' ? (
                        <div className="space-y-8">
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Backend Setup</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Set up the Spring Boot backend with database configuration and security setup.
                                </p>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Prerequisites</h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <PrerequisiteItem
                                                icon={<Terminal className="w-5 h-5" />}
                                                title="Java 17+"
                                                description="Oracle JDK or OpenJDK"
                                            />
                                            <PrerequisiteItem
                                                icon={<Package className="w-5 h-5" />}
                                                title="Maven 3.8+"
                                                description="Build automation tool"
                                            />
                                            <PrerequisiteItem
                                                icon={<Database className="w-5 h-5" />}
                                                title="PostgreSQL 14+"
                                                description="Or MySQL 8.0+"
                                            />
                                            <PrerequisiteItem
                                                icon={<Database className="w-5 h-5" />}
                                                title="Redis 7.0+"
                                                description="Session storage and caching"
                                            />
                                        </div>
                                    </div>

                                    <CodeBlock
                                        title="Clone & Setup"
                                        language="bash"
                                        code={`# Clone the repository
git clone https://github.com/akarshmi/authplus.git
cd authplus/backend

# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run`}
                                    />

                                    <CodeBlock
                                        title="application.yml Configuration"
                                        language="yaml"
                                        code={`spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/authplus
    username: ${'${DB_USERNAME:postgres}'}
    password: ${'${DB_PASSWORD:password}'}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
  
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
    show-sql: false
  
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${'${GOOGLE_CLIENT_ID:}'}
            client-secret: ${'${GOOGLE_CLIENT_SECRET:}'}
            scope:
              - email
              - profile
          github:
            client-id: ${'${GITHUB_CLIENT_ID:}'}
            client-secret: ${'${GITHUB_CLIENT_SECRET:}'}
            scope:
              - user:email
              - read:user
  
  redis:
    host: localhost
    port: 6379
    password: ${'${REDIS_PASSWORD:}'}
    timeout: 2000ms

jwt:
  secret: ${'${JWT_SECRET:your-256-bit-secret}'}
  expiration: 86400000  # 24 hours
  refresh-expiration: 604800000  # 7 days

server:
  port: 8080
  servlet:
    context-path: /api`}
                                    />

                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                        <div className="flex items-start space-x-3">
                                            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">Important Security Note</h4>
                                                <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-1">
                                                    Never commit your actual secrets to version control. Use environment variables
                                                    or a secrets management service in production.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Frontend Setup</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Set up the Next.js frontend with TypeScript and authentication components.
                                </p>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Prerequisites</h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <PrerequisiteItem
                                                icon={<Terminal className="w-5 h-5" />}
                                                title="Node.js 18+"
                                                description="LTS version recommended"
                                            />
                                            <PrerequisiteItem
                                                icon={<Package className="w-5 h-5" />}
                                                title="npm/yarn/pnpm"
                                                description="Package manager"
                                            />
                                            <PrerequisiteItem
                                                icon={<Smartphone className="w-5 h-5" />}
                                                title="Modern Browser"
                                                description="Chrome, Firefox, Safari, Edge"
                                            />
                                            <PrerequisiteItem
                                                icon={<GitBranch className="w-5 h-5" />}
                                                title="Git"
                                                description="Version control"
                                            />
                                        </div>
                                    </div>

                                    <CodeBlock
                                        title="Installation"
                                        language="bash"
                                        code={`# Clone the repository
git clone https://github.com/akarshmi/authplus.git
cd authplus/frontend

# Install dependencies (choose one)
npm install
# or
yarn install
# or
pnpm install

# Run development server
npm run dev
# or
yarn dev
# or
pnpm dev`}
                                    />

                                    <CodeBlock
                                        title="Environment Configuration (.env.local)"
                                        language="env"
                                        code={`# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws

# OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id_here
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback

# App Configuration
NEXT_PUBLIC_APP_NAME=AuthPlus
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_SSR=true`}
                                    />

                                    <CodeBlock
                                        title="Package.json Scripts"
                                        language="json"
                                        code={`{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "test": "jest",
    "test:watch": "jest --watch",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}`}
                                    />

                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                        <div className="flex items-start space-x-3">
                                            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-blue-800 dark:text-blue-300">Development Tips</h4>
                                                <ul className="text-blue-700 dark:text-blue-400 text-sm mt-1 space-y-1">
                                                    <li>• Use <code className="bg-blue-100 dark:bg-blue-800 px-1 py-0.5 rounded">npm run dev</code> for hot reload development</li>
                                                    <li>• Run <code className="bg-blue-100 dark:bg-blue-800 px-1 py-0.5 rounded">npm run lint</code> before committing code</li>
                                                    <li>• Check TypeScript types with <code className="bg-blue-100 dark:bg-blue-800 px-1 py-0.5 rounded">npm run type-check</code></li>
                                                    <li>• Format code with <code className="bg-blue-100 dark:bg-blue-800 px-1 py-0.5 rounded">npm run format</code></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Section>

            {/* Environment Variables */}
            <Section id="environment-variables" title="Environment Variables" subtitle="Configuration for different environments">
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 rounded-xl p-6">
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Configure your environment variables based on your deployment scenario.
                            Variables are grouped by functionality for easier management.
                        </p>

                        <div className="space-y-4">
                            <EnvironmentVariableGroup
                                title="JWT Configuration"
                                variables={[
                                    { name: 'JWT_SECRET', description: 'Secret key for signing JWT tokens (min 256 bits)', type: 'secret', required: true },
                                    { name: 'JWT_EXPIRATION', description: 'Access token expiration in milliseconds', type: 'number', default: '86400000 (24h)', required: false },
                                    { name: 'JWT_REFRESH_EXPIRATION', description: 'Refresh token expiration in milliseconds', type: 'number', default: '604800000 (7d)', required: false },
                                    { name: 'JWT_ISSUER', description: 'Token issuer claim', type: 'string', default: 'authplus-api', required: false },
                                ]}
                            />

                            <EnvironmentVariableGroup
                                title="OAuth Providers"
                                variables={[
                                    { name: 'GOOGLE_CLIENT_ID', description: 'Google OAuth 2.0 Client ID from Google Cloud Console', type: 'string', required: true },
                                    { name: 'GOOGLE_CLIENT_SECRET', description: 'Google OAuth 2.0 Client Secret', type: 'secret', required: true },
                                    { name: 'GITHUB_CLIENT_ID', description: 'GitHub OAuth App Client ID', type: 'string', required: true },
                                    { name: 'GITHUB_CLIENT_SECRET', description: 'GitHub OAuth App Client Secret', type: 'secret', required: true },
                                    { name: 'FACEBOOK_CLIENT_ID', description: 'Facebook App ID', type: 'string', required: false },
                                    { name: 'FACEBOOK_CLIENT_SECRET', description: 'Facebook App Secret', type: 'secret', required: false },
                                ]}
                            />

                            <EnvironmentVariableGroup
                                title="Database Configuration"
                                variables={[
                                    { name: 'DB_URL', description: 'Database connection URL', type: 'string', required: true },
                                    { name: 'DB_USERNAME', description: 'Database username', type: 'string', required: true },
                                    { name: 'DB_PASSWORD', description: 'Database password', type: 'secret', required: true },
                                    { name: 'DB_DRIVER', description: 'Database driver class', type: 'string', default: 'org.postgresql.Driver', required: false },
                                    { name: 'DB_POOL_SIZE', description: 'Connection pool size', type: 'number', default: '10', required: false },
                                ]}
                            />

                            <EnvironmentVariableGroup
                                title="Redis Configuration"
                                variables={[
                                    { name: 'REDIS_HOST', description: 'Redis server hostname', type: 'string', default: 'localhost', required: false },
                                    { name: 'REDIS_PORT', description: 'Redis server port', type: 'number', default: '6379', required: false },
                                    { name: 'REDIS_PASSWORD', description: 'Redis server password', type: 'secret', required: false },
                                    { name: 'REDIS_TIMEOUT', description: 'Redis connection timeout in milliseconds', type: 'number', default: '2000', required: false },
                                ]}
                            />

                            <EnvironmentVariableGroup
                                title="Frontend Configuration"
                                variables={[
                                    { name: 'NEXT_PUBLIC_API_URL', description: 'Backend API base URL', type: 'string', required: true },
                                    { name: 'NEXT_PUBLIC_GOOGLE_CLIENT_ID', description: 'Frontend Google OAuth Client ID', type: 'string', required: true },
                                    { name: 'NEXT_PUBLIC_REDIRECT_URI', description: 'OAuth 2.0 redirect URI', type: 'string', required: true },
                                    { name: 'NEXT_PUBLIC_APP_NAME', description: 'Application name displayed in UI', type: 'string', default: 'AuthPlus', required: false },
                                    { name: 'NEXT_PUBLIC_APP_URL', description: 'Application URL for CORS and links', type: 'string', required: true },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </Section>

            {/* Authentication Flow */}
            <Section id="authentication-flow" title="Authentication Flow" subtitle="How AuthPlus handles user authentication">
                <div className="space-y-8">
                    <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-800">
                        <AuthTabButton
                            active={activeAuthTab === 'login'}
                            onClick={() => setActiveAuthTab('login')}
                            icon={<Key className="w-4 h-4" />}
                        >
                            Login Flow
                        </AuthTabButton>
                        <AuthTabButton
                            active={activeAuthTab === 'oauth'}
                            onClick={() => setActiveAuthTab('oauth')}
                            icon={<Globe className="w-4 h-4" />}
                        >
                            OAuth Flow
                        </AuthTabButton>
                        <AuthTabButton
                            active={activeAuthTab === 'refresh'}
                            onClick={() => setActiveAuthTab('refresh')}
                            icon={<RefreshCw className="w-4 h-4" />}
                        >
                            Token Refresh
                        </AuthTabButton>
                    </div>

                    {activeAuthTab === 'login' && (
                        <div className="grid md:grid-cols-4 gap-6">
                            <FlowStep
                                number={1}
                                title="User Login"
                                description="User submits credentials via login form"
                            >
                                <div className="mt-4">
                                    <CodeBlock
                                        code={`POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "********"
}`}
                                        language="http"
                                    />
                                </div>
                            </FlowStep>

                            <FlowStep
                                number={2}
                                title="Credential Validation"
                                description="Backend validates credentials against database"
                            >
                                <div className="mt-4">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>Password hashing with bcrypt</span>
                                    </div>
                                </div>
                            </FlowStep>

                            <FlowStep
                                number={3}
                                title="Token Generation"
                                description="JWT access and refresh tokens generated"
                            >
                                <div className="mt-4">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Lock className="w-4 h-4 text-blue-500" />
                                        <span>Signed with RSA256</span>
                                    </div>
                                </div>
                            </FlowStep>

                            <FlowStep
                                number={4}
                                title="Response & Storage"
                                description="Tokens returned and stored securely"
                            >
                                <div className="mt-4">
                                    <CodeBlock
                                        code={`{
  "accessToken": "eyJhbGciOiJIUz...",
  "refreshToken": "eyJhbGciOiJIUz...",
  "expiresIn": 86400000
}`}
                                        language="json"
                                    />
                                </div>
                            </FlowStep>
                        </div>
                    )}

                    {activeAuthTab === 'oauth' && (
                        <div className="grid md:grid-cols-3 gap-6">
                            <FlowStep
                                number={1}
                                title="OAuth Initiation"
                                description="User clicks social login button"
                            >
                                <div className="mt-4">
                                    <div className="flex space-x-2">
                                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
                                            <Globe className="w-4 h-4 text-red-600 dark:text-red-400" />
                                        </div>
                                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                            <Github className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </FlowStep>

                            <FlowStep
                                number={2}
                                title="Provider Authentication"
                                description="Redirect to OAuth provider (Google, GitHub, etc.)"
                            >
                                <div className="mt-4">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        User authenticates with provider and grants permissions
                                    </div>
                                </div>
                            </FlowStep>

                            <FlowStep
                                number={3}
                                title="Token Exchange & User Creation"
                                description="Exchange code for tokens and create/update user"
                            >
                                <div className="mt-4">
                                    <CodeBlock
                                        code={`POST /api/auth/oauth/callback
{
  "code": "authorization_code",
  "provider": "google"
}`}
                                        language="http"
                                    />
                                </div>
                            </FlowStep>
                        </div>
                    )}

                    {activeAuthTab === 'refresh' && (
                        <div className="grid md:grid-cols-3 gap-6">
                            <FlowStep
                                number={1}
                                title="Access Token Expires"
                                description="Client detects expired access token"
                            >
                                <div className="mt-4">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Clock className="w-4 h-4 text-yellow-500" />
                                        <span>Token expired after 24h</span>
                                    </div>
                                </div>
                            </FlowStep>

                            <FlowStep
                                number={2}
                                title="Refresh Token Request"
                                description="Client sends refresh token to get new access token"
                            >
                                <div className="mt-4">
                                    <CodeBlock
                                        code={`POST /api/auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUz..."
}`}
                                        language="http"
                                    />
                                </div>
                            </FlowStep>

                            <FlowStep
                                number={3}
                                title="New Tokens Issued"
                                description="New access token issued, refresh token rotated"
                            >
                                <div className="mt-4">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                        <RefreshCw className="w-4 h-4 text-green-500" />
                                        <span>Refresh token rotation for security</span>
                                    </div>
                                </div>
                            </FlowStep>
                        </div>
                    )}
                </div>
            </Section>

            {/* API Reference */}
            <Section id="api-reference" title="API Reference" subtitle="Complete API documentation">
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">REST API Endpoints</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    All endpoints are prefixed with <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">/api</code>
                                </p>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <ExternalLink className="w-4 h-4" />
                                <span>Base URL: https://api.authplus.com</span>
                            </div>
                        </div>

                        <APITable />

                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Authentication</h4>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Most endpoints require authentication via Bearer token. Include the token in the Authorization header:
                            </p>
                            <CodeBlock
                                code={`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
                                language="http"
                            />
                        </div>
                    </div>
                </div>
            </Section>

            {/* Deployment */}
            <Section id="deployment" title="Deployment" subtitle="Deploy AuthPlus to production">
                <div className="grid md:grid-cols-3 gap-6">
                    <DeploymentCard
                        title="Docker Deployment"
                        description="Containerized deployment with Docker Compose"
                        icon={<Dock className="w-8 h-8 text-blue-600" />}
                        features={['Multi-container setup', 'Easy scaling', 'Portable']}
                        command="docker-compose up -d"
                    />

                    <DeploymentCard
                        title="Cloud Platforms"
                        description="Deploy to AWS, GCP, Azure, or Vercel"
                        icon={<Cloud className="w-8 h-8 text-green-600" />}
                        features={['Managed services', 'Auto-scaling', 'High availability']}
                        command="vercel --prod"
                    />

                    <DeploymentCard
                        title="Traditional Server"
                        description="Deploy on traditional VPS or dedicated server"
                        icon={<Server className="w-8 h-8 text-purple-600" />}
                        features={['Full control', 'Custom configuration', 'On-premises']}
                        command="./deploy.sh production"
                    />
                </div>

                <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Production Security Checklist</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        <SecurityCheckItem
                            icon={<CheckCircle className="w-5 h-5 text-green-500" />}
                            title="Use HTTPS"
                            description="Enable SSL/TLS for all endpoints"
                        />
                        <SecurityCheckItem
                            icon={<CheckCircle className="w-5 h-5 text-green-500" />}
                            title="Strong JWT Secrets"
                            description="Use 256-bit+ secrets for signing"
                        />
                        <SecurityCheckItem
                            icon={<CheckCircle className="w-5 h-5 text-green-500" />}
                            title="Database Encryption"
                            description="Enable TDE or field-level encryption"
                        />
                        <SecurityCheckItem
                            icon={<CheckCircle className="w-5 h-5 text-green-500" />}
                            title="Rate Limiting"
                            description="Implement request throttling"
                        />
                        <SecurityCheckItem
                            icon={<CheckCircle className="w-5 h-5 text-green-500" />}
                            title="CORS Configuration"
                            description="Restrict allowed origins"
                        />
                        <SecurityCheckItem
                            icon={<CheckCircle className="w-5 h-5 text-green-500" />}
                            title="Logging & Monitoring"
                            description="Set up audit logs and alerts"
                        />
                    </div>
                </div>
            </Section>

            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">AuthPlus</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Production-ready Authentication</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 mb-4">
                            <SocialLink href="https://github.com/akarshmi" icon={<Github className="w-5 h-5" />}>
                                GitHub
                            </SocialLink>
                            <span className="text-gray-400">•</span>
                            <SocialLink href="https://youtube.com/@akarshmi" icon={<ExternalLink className="w-5 h-5" />}>
                                YouTube
                            </SocialLink>
                            <span className="text-gray-400">•</span>
                            <SocialLink href="https://akarshmi.com" icon={<ExternalLink className="w-5 h-5" />}>
                                Website
                            </SocialLink>
                            <span className="text-gray-400">•</span>
                            <SocialLink href="https://t.me/akarshmi" icon={<ExternalLink className="w-5 h-5" />}>
                                Telegram
                            </SocialLink>
                        </div>

                        <p className="text-sm text-gray-500">
                            © {new Date().getFullYear()} AuthPlus by Akarsh Mishra. MIT Licensed.
                        </p>
                    </div>

                    <div className="flex flex-col items-start md:items-end">
                        <div className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                ⭐ Star on GitHub if you find this helpful!
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">Version 2.1.0</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
                        </div>

                        <div className="mt-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Actively Maintained
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Helper Components
function FeatureItem({ icon, children }: { icon: React.ReactNode; children: string }) {
    return (
        <li className="flex items-center space-x-3">
            <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                {icon}
            </div>
            <span className="text-gray-700 dark:text-gray-300">{children}</span>
        </li>
    );
}

function TabButton({
    active,
    onClick,
    children,
    icon,
}: {
    active: boolean;
    onClick: () => void;
    children: string;
    icon?: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center space-x-2 px-4 py-3 font-medium text-sm border-b-2 transition-all ${active
                    ? 'text-blue-600 dark:text-blue-400 border-blue-500'
                    : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200'
                }`}
        >
            {icon}
            <span>{children}</span>
        </button>
    );
}

function AuthTabButton({
    active,
    onClick,
    children,
    icon,
}: {
    active: boolean;
    onClick: () => void;
    children: string;
    icon?: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center space-x-2 px-4 py-3 font-medium text-sm border-b-2 transition-all ${active
                    ? 'text-purple-600 dark:text-purple-400 border-purple-500'
                    : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200'
                }`}
        >
            {icon}
            <span>{children}</span>
        </button>
    );
}

function PrerequisiteItem({ icon, title, description }: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                {icon}
            </div>
            <div>
                <h5 className="font-medium text-gray-900 dark:text-gray-100">{title}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
            </div>
        </div>
    );
}

function DeploymentCard({
    title,
    description,
    icon,
    features,
    command,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
    command?: string;
}) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg">
                    {icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {title}
                </h3>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>

            <ul className="space-y-2 mb-4">
                {features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                    </li>
                ))}
            </ul>

            {command && (
                <div className="mt-4">
                    <CodeBlock
                        code={command}
                        language="bash"
                    />
                </div>
            )}
        </motion.div>
    );
}

function SecurityCheckItem({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex items-start space-x-3">
            <div className="p-1 bg-white dark:bg-gray-800 rounded">
                {icon}
            </div>
            <div>
                <h5 className="font-medium text-gray-900 dark:text-gray-100">{title}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
            </div>
        </div>
    );
}

function SocialLink({ href, icon, children }: {
    href: string;
    icon: React.ReactNode;
    children: string;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
            {icon}
            <span>{children}</span>
        </a>
    );
}