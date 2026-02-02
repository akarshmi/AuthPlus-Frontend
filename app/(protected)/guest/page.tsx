'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
    Sun,
    Moon,
    Home,
    Users,
    BarChart3,
    Settings,
    LogOut,
    ChevronDown,
    UserCircle,
    TestTube,
    Bell,
    Activity,
    Shield,
    Database,
    Zap,
    Menu,
    X,
    Check,
    X as XIcon,
    AlertTriangle,
    Server,
} from 'lucide-react';

import useAuth from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toaster, toast } from "sonner";

export default function SimpleDashboard() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
            setTimeout(() => router.push('/login'), 1000);
        } catch {
            toast.error("Logout failed. Please try again.");
        }
    };

    const NavItem = ({ href, icon: Icon, label, active }: any) => (
        <Link
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${pathname === href
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
        >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
        </Link>
    );

    const handleGoToTesting = () => {
        router.push('/dashboard/testing');
        toast.info("Taking you to the testing page...");
    };

    return (
        <div className="min-h-screen flex bg-gray-100 dark:bg-[#0a0a0a] transition-colors">
            <Toaster position="top-right" />

            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:relative inset-y-0 left-0 z-50
                w-64 transform transition-transform duration-300 ease-in-out
                bg-white dark:bg-white/5 border-r border-gray-200 dark:border-white/10
                flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold">AuthPlus</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* User info */}
                <div className="p-6 border-b border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={user?.image} />
                            <AvatarFallback className="bg-blue-500 text-white">
                                {user?.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold">{user?.name || 'User'}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'No email'}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem href="/dashboard" icon={Home} label="Dashboard" active={pathname === '/dashboard'} />
                    <NavItem href="/dashboard/users" icon={Users} label="Users" active={pathname === '/dashboard/users'} />
                    <NavItem href="/dashboard/analytics" icon={BarChart3} label="Analytics" active={pathname === '/dashboard/analytics'} />
                    <NavItem href="/dashboard/profile" icon={Settings} label="Profile" active={pathname === '/dashboard/profile'} />

                    {/* Testing Page Link */}
                    <button
                        onClick={handleGoToTesting}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <TestTube className="w-5 h-5" />
                        <span className="font-medium">Test Security</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-white/10">
                    <Button
                        onClick={handleLogout}
                        variant="destructive"
                        className="w-full flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </Button>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <header className="h-16 bg-white dark:bg-white/5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-lg font-semibold">Dashboard</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20"
                        >
                            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        </button>

                        {/* Notifications */}
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                3
                            </span>
                        </button>

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-100 dark:hover:bg-white/10">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={user?.image} />
                                        <AvatarFallback>
                                            {user?.name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                                    <UserCircle className="w-4 h-4 mr-2" /> Profile
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                    <LogOut className="w-4 h-4 mr-2" /> Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Welcome Section */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'User'}! 👋</h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Here's what's happening with your account today.
                            </p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Account Status</p>
                                            <p className="text-2xl font-bold mt-1">
                                                {user?.enabled ? 'Active' : 'Inactive'}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                                            {user?.enabled ? (
                                                <Check className="w-6 h-6 text-green-600" />
                                            ) : (
                                                <XIcon className="w-6 h-6 text-red-600" />
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Login Provider</p>
                                            <p className="text-2xl font-bold mt-1">{user?.provider || 'Unknown'}</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                                            <p className="text-2xl font-bold mt-1">
                                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                                            <Database className="w-6 h-6 text-purple-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Last Active</p>
                                            <p className="text-2xl font-bold mt-1">Just now</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                                            <Activity className="w-6 h-6 text-orange-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Testing Section */}
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TestTube className="w-5 h-5 text-blue-500" />
                                    Security Testing
                                </CardTitle>
                                <CardDescription>
                                    Test the security features of your application
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="p-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border border-blue-200 dark:border-blue-800">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2">API Security Testing</h3>
                                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                    Test JWT tokens, API endpoints, and security configurations in a safe environment.
                                                    Perfect for developers and testers.
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="outline">JWT Testing</Badge>
                                                    <Badge variant="outline">API Security</Badge>
                                                    <Badge variant="outline">Token Validation</Badge>
                                                    <Badge variant="outline">Data Integrity</Badge>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <Button
                                                    onClick={handleGoToTesting}
                                                    size="lg"
                                                    className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                                                >
                                                    <Zap className="w-5 h-5" />
                                                    Go to Testing Page
                                                </Button>
                                                <p className="text-sm text-gray-500 text-center">
                                                    Opens in new page
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                                                        <Shield className="w-5 h-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">JWT Testing</h4>
                                                        <p className="text-sm text-gray-500">Validate tokens</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                                        <Server className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">API Testing</h4>
                                                        <p className="text-sm text-gray-500">Test endpoints</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                                                        <Database className="w-5 h-5 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">Data Validation</h4>
                                                        <p className="text-sm text-gray-500">Check integrity</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}