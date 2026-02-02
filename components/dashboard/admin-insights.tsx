import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SystemStats {
    totalUsers: number;
    activeToday: number;
    activeThisWeek: number;
    activeThisMonth: number;
    storageUsedGB: number;
    storageCapacityGB: number;
    apiCallsToday: number;
    apiCallsThisMonth: number;
    averageResponseTime: number;
    errorRate: number;
    systemHealth: 'healthy' | 'warning' | 'critical';
    recentSignups: number;
    churnRate: number;
    revenueThisMonth?: number;
    activeSubscriptions?: number;
}

interface AdminInsightsProps {
    stats: SystemStats;
    isAdmin: boolean;
}

function HealthBadge({ status }: { status: SystemStats['systemHealth'] }) {
    const config = {
        healthy: {
            label: 'Healthy',
            icon: CheckCircle,
            className: 'bg-green-100 text-green-800',
        },
        warning: {
            label: 'Warning',
            icon: AlertTriangle,
            className: 'bg-yellow-100 text-yellow-800',
        },
        critical: {
            label: 'Critical',
            icon: AlertTriangle,
            className: 'bg-red-100 text-red-800',
        },
    };

    const { label, icon: Icon, className } = config[status];

    return (
        <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            className
        )}>
            <Icon className="mr-1 h-3 w-3" />
            {label}
        </span>
    );
}

function MetricCard({
    title,
    value,
    subtitle,
    trend,
    trendValue,
    format = 'number'
}: {
    title: string;
    value: number | string;
    subtitle?: string;
    trend?: 'up' | 'down';
    trendValue?: number;
    format?: 'number' | 'percentage' | 'currency';
}) {
    const formattedValue = typeof value === 'number'
        ? format === 'currency'
            ? `$${value.toLocaleString()}`
            : format === 'percentage'
                ? `${value}%`
                : value.toLocaleString()
        : value;

    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
            </dt>
            <dd className="mt-1 flex items-baseline justify-between">
                <div className="flex items-baseline text-2xl font-semibold text-gray-900">
                    {formattedValue}
                    {trend && trendValue !== undefined && (
                        <span className={cn(
                            "ml-2 flex items-center text-sm font-medium",
                            trend === 'up' ? 'text-green-600' : 'text-red-600'
                        )}>
                            {trend === 'up' ? (
                                <TrendingUp className="h-4 w-4 mr-0.5" />
                            ) : (
                                <TrendingDown className="h-4 w-4 mr-0.5" />
                            )}
                            {trendValue}%
                        </span>
                    )}
                </div>
            </dd>
            {subtitle && (
                <dd className="mt-1 text-xs text-gray-500">
                    {subtitle}
                </dd>
            )}
        </div>
    );
}

export function AdminInsights({ stats, isAdmin }: AdminInsightsProps) {
    const storagePercentage = Math.round((stats.storageUsedGB / stats.storageCapacityGB) * 100);
    const isStorageCritical = storagePercentage > 90;
    const isStorageWarning = storagePercentage > 75;

    return (
        <div className="space-y-6">
            {/* System Health Overview */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-gray-900">System Status</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Current platform health and performance
                    </p>
                </div>
                <HealthBadge status={stats.systemHealth} />
            </div>

            {/* Key Metrics Grid */}
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <MetricCard
                    title="Active Users Today"
                    value={stats.activeToday}
                    subtitle={`${stats.activeThisWeek.toLocaleString()} this week`}
                />
                <MetricCard
                    title="API Calls Today"
                    value={stats.apiCallsToday}
                    subtitle={`${stats.apiCallsThisMonth.toLocaleString()} this month`}
                />
                <MetricCard
                    title="Avg Response Time"
                    value={`${stats.averageResponseTime}ms`}
                    trend={stats.averageResponseTime < 200 ? 'up' : 'down'}
                    subtitle="Last 24 hours"
                />
                <MetricCard
                    title="Error Rate"
                    value={stats.errorRate}
                    format="percentage"
                    trend={stats.errorRate < 1 ? 'up' : 'down'}
                    subtitle="Last 24 hours"
                />
                <MetricCard
                    title="New Signups"
                    value={stats.recentSignups}
                    subtitle="Last 7 days"
                    trend="up"
                    trendValue={12}
                />
                <MetricCard
                    title="Churn Rate"
                    value={stats.churnRate}
                    format="percentage"
                    trend={stats.churnRate < 5 ? 'up' : 'down'}
                    subtitle="Last 30 days"
                />
            </dl>

            {/* Revenue Metrics (Admin Only) */}
            {isAdmin && stats.revenueThisMonth !== undefined && (
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">
                        Financial Metrics
                    </h3>
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <MetricCard
                            title="Revenue This Month"
                            value={stats.revenueThisMonth}
                            format="currency"
                            trend="up"
                            trendValue={8}
                        />
                        <MetricCard
                            title="Active Subscriptions"
                            value={stats.activeSubscriptions || 0}
                            subtitle={`${stats.totalUsers.toLocaleString()} total users`}
                        />
                    </dl>
                </div>
            )}

            {/* Storage Usage Bar */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">Storage Usage</h3>
                    <span className={cn(
                        "text-sm font-medium",
                        isStorageCritical ? "text-red-600" :
                            isStorageWarning ? "text-yellow-600" :
                                "text-gray-600"
                    )}>
                        {stats.storageUsedGB}GB / {stats.storageCapacityGB}GB
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                        className={cn(
                            "h-3 rounded-full transition-all duration-500",
                            isStorageCritical ? "bg-red-600" :
                                isStorageWarning ? "bg-yellow-500" :
                                    "bg-blue-600"
                        )}
                        style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                    />
                </div>
                {isStorageCritical && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Critical: Storage capacity nearly full
                    </p>
                )}
            </div>

            {/* User Distribution */}
            <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                    User Activity Distribution
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Active Today</span>
                        <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                <div
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${Math.round((stats.activeToday / stats.totalUsers) * 100)}%` }}
                                />
                            </div>
                            <span className="font-medium text-gray-900 w-12 text-right">
                                {Math.round((stats.activeToday / stats.totalUsers) * 100)}%
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Active This Week</span>
                        <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${Math.round((stats.activeThisWeek / stats.totalUsers) * 100)}%` }}
                                />
                            </div>
                            <span className="font-medium text-gray-900 w-12 text-right">
                                {Math.round((stats.activeThisWeek / stats.totalUsers) * 100)}%
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Active This Month</span>
                        <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                <div
                                    className="bg-purple-600 h-2 rounded-full"
                                    style={{ width: `${Math.round((stats.activeThisMonth / stats.totalUsers) * 100)}%` }}
                                />
                            </div>
                            <span className="font-medium text-gray-900 w-12 text-right">
                                {Math.round((stats.activeThisMonth / stats.totalUsers) * 100)}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}