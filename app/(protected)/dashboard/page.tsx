import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import {
    getDashboardMetrics,
    getRecentActivity,
    getSystemStats,
    getUserProfile
} from '@/lib/data/dashboard';
import { authorize } from '@/lib/auth/permissions';
import { KPICard } from '@/components/dashboard/kpi-card';
import { ActivityList } from '@/components/dashboard/activity-list';
import { AdminInsights } from '@/components/dashboard/admin-insights';
import { EmptyState } from '@/components/ui/empty-state';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard | Your App Name',
    description: 'Overview of your account activity and key metrics',
};

// Parallel data fetching with proper error boundaries
async function fetchDashboardData(userId: string) {
    try {
        const [userProfile, metrics, activity, systemStats] = await Promise.all([
            getUserProfile(userId),
            getDashboardMetrics(userId),
            getRecentActivity(userId, { limit: 10 }),
            // System stats only if user has permission
            authorize('view:system_stats')
                ? getSystemStats()
                : Promise.resolve(null),
        ]);

        return {
            userProfile,
            metrics,
            activity,
            systemStats,
        };
    } catch (error) {
        console.error('Dashboard data fetch error:', error);
        throw error;
    }
}

export default async function DashboardPage() {
    // For dev testing - replace with actual auth session
    const userId = 'dev-user-123';
    const userName = 'Developer';

    // Fetch all data in parallel
    const { userProfile, metrics, activity, systemStats } = await fetchDashboardData(userId);

    // Permission checks - computed once, used declaratively
    const canViewSystemStats = authorize('view:system_stats');
    const canViewAdminInsights = authorize('view:admin_insights');
    const isAdmin = authorize('role:admin');

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="border-b border-gray-200 pb-5">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {userProfile?.firstName || userName}
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Here's what's happening with your account today.
                </p>
            </div>

            {/* KPI Cards Grid */}
            <section aria-labelledby="metrics-heading">
                <h2 id="metrics-heading" className="sr-only">
                    Key Performance Indicators
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <KPICard
                        title="Total Projects"
                        value={metrics.totalProjects}
                        change={metrics.projectsChange}
                        trend={metrics.projectsTrend}
                        icon="folder"
                    />
                    <KPICard
                        title="Active Tasks"
                        value={metrics.activeTasks}
                        change={metrics.tasksChange}
                        trend={metrics.tasksTrend}
                        icon="checkCircle"
                    />
                    <KPICard
                        title="Team Members"
                        value={metrics.teamMembers}
                        change={metrics.membersChange}
                        trend={metrics.membersTrend}
                        icon="users"
                    />
                    <KPICard
                        title="Completion Rate"
                        value={`${metrics.completionRate}%`}
                        change={metrics.completionChange}
                        trend={metrics.completionTrend}
                        icon="trendingUp"
                    />
                </div>
            </section>

            {/* Two Column Layout for Activity & Insights */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Recent Activity - Takes 2 columns */}
                <section
                    aria-labelledby="activity-heading"
                    className="lg:col-span-2"
                >
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h2
                                id="activity-heading"
                                className="text-lg font-medium text-gray-900"
                            >
                                Recent Activity
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Your latest updates and interactions
                            </p>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            {activity && activity.length > 0 ? (
                                <ActivityList items={activity} />
                            ) : (
                                <EmptyState
                                    title="No recent activity"
                                    description="When you start working on projects, your activity will appear here."
                                    icon="activity"
                                />
                            )}
                        </div>
                    </div>
                </section>

                {/* Quick Stats Sidebar */}
                <aside aria-labelledby="stats-heading">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h2
                                id="stats-heading"
                                className="text-lg font-medium text-gray-900"
                            >
                                Quick Stats
                            </h2>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        This Week
                                    </dt>
                                    <dd className="mt-1 text-2xl font-semibold text-gray-900">
                                        {metrics.thisWeekTasks || 0}
                                    </dd>
                                    <dd className="mt-1 text-xs text-gray-500">
                                        tasks completed
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        Overdue
                                    </dt>
                                    <dd className="mt-1 text-2xl font-semibold text-red-600">
                                        {metrics.overdueTasks || 0}
                                    </dd>
                                    <dd className="mt-1 text-xs text-gray-500">
                                        tasks need attention
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">
                                        Upcoming
                                    </dt>
                                    <dd className="mt-1 text-2xl font-semibold text-gray-900">
                                        {metrics.upcomingDeadlines || 0}
                                    </dd>
                                    <dd className="mt-1 text-xs text-gray-500">
                                        deadlines this week
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Admin-Only Insights Section */}
            {canViewAdminInsights && systemStats && (
                <section aria-labelledby="admin-heading">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-1">
                        <div className="bg-white rounded-md shadow-sm">
                            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2
                                            id="admin-heading"
                                            className="text-lg font-medium text-gray-900"
                                        >
                                            System Insights
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Administrator view of platform-wide metrics
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Admin Only
                                    </span>
                                </div>
                            </div>
                            <div className="px-4 py-5 sm:p-6">
                                <AdminInsights
                                    stats={systemStats}
                                    isAdmin={isAdmin}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* System-Wide Stats for Privileged Users */}
            {canViewSystemStats && systemStats && !canViewAdminInsights && (
                <section aria-labelledby="system-heading">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h2
                                id="system-heading"
                                className="text-lg font-medium text-gray-900"
                            >
                                Platform Overview
                            </h2>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                                <div className="text-center">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Total Users
                                    </dt>
                                    <dd className="mt-2 text-3xl font-semibold text-gray-900">
                                        {systemStats.totalUsers.toLocaleString()}
                                    </dd>
                                </div>
                                <div className="text-center">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Active Today
                                    </dt>
                                    <dd className="mt-2 text-3xl font-semibold text-green-600">
                                        {systemStats.activeToday.toLocaleString()}
                                    </dd>
                                </div>
                                <div className="text-center">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Storage Used
                                    </dt>
                                    <dd className="mt-2 text-3xl font-semibold text-gray-900">
                                        {systemStats.storageUsedGB}GB
                                    </dd>
                                </div>
                                <div className="text-center">
                                    <dt className="text-sm font-medium text-gray-500">
                                        API Calls
                                    </dt>
                                    <dd className="mt-2 text-3xl font-semibold text-gray-900">
                                        {systemStats.apiCallsToday.toLocaleString()}
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}