'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
    Search,
    Plus,
    Filter,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    Download,
    RefreshCw,
    Bell,
    Shield,
    CheckCircle,
    XCircle,
    Calendar,
    Mail,
    Phone,
    Activity,
    TrendingUp,
    TrendingDown,
    ChevronRight,
    Menu,
    X,
    UserPlus,
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
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster, toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

// Mock data with more realistic fields
const mockUsers = [
    {
        id: 1,
        name: 'Akarsh Mishra',
        email: 'akarsh@example.com',
        role: 'Admin',
        status: 'active',
        lastActive: '2024-01-15T10:30:00Z',
        joinDate: '2023-06-15',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Akarsh',
        phone: '+1 234 567 8900'
    },
    {
        id: 2,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'User',
        status: 'active',
        lastActive: '2024-01-14T15:45:00Z',
        joinDate: '2023-08-22',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        phone: '+1 234 567 8901'
    },
    {
        id: 3,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'User',
        status: 'inactive',
        lastActive: '2024-01-10T09:20:00Z',
        joinDate: '2023-09-30',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        phone: '+1 234 567 8902'
    },
    {
        id: 4,
        name: 'Robert Johnson',
        email: 'robert@example.com',
        role: 'Moderator',
        status: 'active',
        lastActive: '2024-01-15T14:10:00Z',
        joinDate: '2023-07-12',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
        phone: '+1 234 567 8903'
    },
    {
        id: 5,
        name: 'Sarah Williams',
        email: 'sarah@example.com',
        role: 'User',
        status: 'pending',
        lastActive: '2024-01-13T11:25:00Z',
        joinDate: '2024-01-01',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        phone: '+1 234 567 8904'
    },
];

// Stats data
const stats = [
    { label: 'Total Users', value: '2,847', change: '+12.5%', icon: Users, trend: 'up', color: 'bg-blue-500' },
    { label: 'Active Users', value: '2,134', change: '+8.2%', icon: Activity, trend: 'up', color: 'bg-green-500' },
    { label: 'New Users', value: '143', change: '+23.1%', icon: UserPlus, trend: 'up', color: 'bg-purple-500' },
    { label: 'Inactive Users', value: '713', change: '-2.4%', icon: XCircle, trend: 'down', color: 'bg-red-500' },
];

export default function Dashboard() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Initialize theme
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
        toast.info(`Theme changed to ${newTheme} mode`);
    };

    // Filter users based on search and filters
    const filteredUsers = useMemo(() => {
        return mockUsers.filter(user => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [searchQuery, roleFilter, statusFilter]);

    // Get status badge
    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            active: { variant: 'default', label: 'Active', icon: CheckCircle },
            inactive: { variant: 'secondary', label: 'Inactive', icon: XCircle },
            pending: { variant: 'outline', label: 'Pending', icon: Bell },
        };
        const config = variants[status] || variants.inactive;
        return (
            <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
                <config.icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
            setTimeout(() => router.replace('/login'), 1000);
        } catch {
            toast.error("Logout failed. Please try again.");
        }
    };

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Data refreshed successfully");
        }, 1000);
    };

    const handleExport = () => {
        toast.success("Exporting user data...");
        // Add export logic here
    };

    const handleAddUser = () => {
        toast.success("Add user functionality would open a form here");
        setIsAddUserOpen(false);
    };

    const handleViewUser = (userId: number) => {
        router.push(`/dashboard/users/${userId}`);
    };

    const handleEditUser = (userId: number) => {
        toast.info(`Edit user ${userId}`);
    };

    const handleDeleteUser = (userId: number) => {
        toast.warning(`Delete user ${userId} - Are you sure?`);
    };

    const NavItem = ({ href, icon: Icon, label, badge }: any) => (
        <Link
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all hover:scale-[1.02] ${pathname === href
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
        >
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
            </div>
            {badge && (
                <Badge variant="secondary" className="text-xs">
                    {badge}
                </Badge>
            )}
        </Link>
    );

    return (
        <div className="min-h-screen flex bg-gray-100 dark:bg-[#0a0a0a] transition-colors">
            {/* Toaster */}
            <Toaster
                position="top-right"
                richColors
                toastOptions={{
                    classNames: {
                        toast: "rounded-xl shadow-lg border text-sm bg-white dark:bg-[#0f0f0f] dark:text-white",
                        title: "font-semibold",
                    },
                }}
            />

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
                bg-white dark:bg-[#0f0f0f] border-r border-gray-200 dark:border-white/10
                flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="text-lg font-bold">AuthPlus</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Admin Dashboard</p>
                        </div>
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
                        <Avatar className="w-12 h-12 border-2 border-white shadow-lg">
                            <AvatarImage src={user?.image || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                {user?.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold">{user?.name || 'User'}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.role || 'Admin'}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem href="/dashboard" icon={Home} label="Overview" />
                    <NavItem href="/dashboard/users" icon={Users} label="Users" badge="2,847" />
                    <NavItem href="/dashboard/analytics" icon={BarChart3} label="Analytics" badge="New" />
                    <NavItem href="/dashboard/profile" icon={Settings} label="Profile" />
                </nav>

                <div className="p-4 space-y-4 border-t border-gray-200 dark:border-white/10">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                        <p className="text-sm font-medium">Need help?</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Check our documentation</p>
                        <Button size="sm" className="w-full mt-3">View Docs</Button>
                    </div>
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
                <header className="h-20 bg-white dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold">User Management</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Manage your users and permissions
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Notifications */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        3
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="max-h-60 overflow-y-auto">
                                    {[1, 2, 3].map((i) => (
                                        <DropdownMenuItem key={i} className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                    <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">New user registered</p>
                                                    <p className="text-sm text-gray-500">2 minutes ago</p>
                                                </div>
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="justify-center text-blue-600 dark:text-blue-400">
                                    View all notifications
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="rounded-lg"
                        >
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </Button>

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-3 px-3 py-2">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={user?.image} />
                                        <AvatarFallback>
                                            {user?.name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium">{user?.name || 'User'}</p>
                                        <p className="text-xs text-gray-500">{user?.role || 'Admin'}</p>
                                    </div>
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                                    <UserCircle className="w-4 h-4 mr-2" /> Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="w-4 h-4 mr-2" /> Settings
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
                <main className="flex-1 p-6 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {stat.label}
                                            </p>
                                            <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                            <div className="flex items-center gap-1 mt-2">
                                                {stat.trend === 'up' ? (
                                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                                )}
                                                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                                    {stat.change}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center`}>
                                            <stat.icon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Filters and Actions */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Users</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleRefresh}
                                            disabled={isLoading}
                                        >
                                            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                            Refresh
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleExport}
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Export
                                        </Button>
                                        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                                            <DialogTrigger asChild>
                                                <Button size="sm">
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add User
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Add New User</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <Input placeholder="Full Name" />
                                                    <Input placeholder="Email" type="email" />
                                                    <Input placeholder="Phone" />
                                                    <Select>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="admin">Admin</SelectItem>
                                                            <SelectItem value="user">User</SelectItem>
                                                            <SelectItem value="moderator">Moderator</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={handleAddUser}>
                                                        Add User
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-4 mb-6">
                                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                                            <SelectTrigger className="w-[140px]">
                                                <Filter className="w-4 h-4 mr-2" />
                                                <SelectValue placeholder="Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Roles</SelectItem>
                                                <SelectItem value="Admin">Admin</SelectItem>
                                                <SelectItem value="User">User</SelectItem>
                                                <SelectItem value="Moderator">Moderator</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="w-[140px]">
                                                <Activity className="w-4 h-4 mr-2" />
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Status</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <div className="text-sm text-gray-500">
                                            Showing {filteredUsers.length} of {mockUsers.length} users
                                        </div>
                                    </div>

                                    <div className="rounded-lg border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>User</TableHead>
                                                    <TableHead>Role</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Last Active</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredUsers.map((user) => (
                                                    <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="w-8 h-8">
                                                                    <AvatarImage src={user.avatar} />
                                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="font-medium">{user.name}</p>
                                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">{user.role}</Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {getStatusBadge(user.status)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm">
                                                                {new Date(user.lastActive).toLocaleDateString()}
                                                                <p className="text-xs text-gray-500">
                                                                    {new Date(user.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon">
                                                                        <MoreVertical className="w-4 h-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem onClick={() => handleViewUser(user.id)}>
                                                                        <Eye className="w-4 h-4 mr-2" />
                                                                        View
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                                                                        <Edit className="w-4 h-4 mr-2" />
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleDeleteUser(user.id)}
                                                                        className="text-red-600"
                                                                    >
                                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Sidebar - Quick Stats */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Send Email to All
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Manage Permissions
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Shield className="w-4 h-4 mr-2" />
                                        Security Settings
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">New user registered</p>
                                                <p className="text-xs text-gray-500">2 minutes ago</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>User Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Active Users</span>
                                                <span className="font-medium">75%</span>
                                            </div>
                                            <Progress value={75} className="h-2" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Inactive Users</span>
                                                <span className="font-medium">20%</span>
                                            </div>
                                            <Progress value={20} className="h-2" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Pending</span>
                                                <span className="font-medium">5%</span>
                                            </div>
                                            <Progress value={5} className="h-2" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}