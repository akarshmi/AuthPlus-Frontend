import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type IconType = 'folder' | 'checkCircle' | 'users' | 'trendingUp';

interface KPICardProps {
    title: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'neutral';
    icon?: IconType;
    subtitle?: string;
}

const iconMap = {
    folder: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
    ),
    checkCircle: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    users: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
    trendingUp: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
    ),
};

export function KPICard({
    title,
    value,
    change,
    trend = 'neutral',
    icon,
    subtitle
}: KPICardProps) {
    const hasChange = typeof change === 'number' && !isNaN(change);
    const isPositiveTrend = trend === 'up';
    const isNegativeTrend = trend === 'down';

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
                <div className="flex items-center">
                    {icon && (
                        <div className="flex-shrink-0">
                            <div className="rounded-md bg-blue-500 p-3 text-white">
                                {iconMap[icon]}
                            </div>
                        </div>
                    )}
                    <div className={cn("w-full", icon && "ml-5")}>
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                {title}
                            </dt>
                            <dd className="mt-1 flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">
                                    {typeof value === 'number' ? value.toLocaleString() : value}
                                </div>
                                {hasChange && (
                                    <div className={cn(
                                        "ml-2 flex items-baseline text-sm font-semibold",
                                        isPositiveTrend && "text-green-600",
                                        isNegativeTrend && "text-red-600",
                                        !isPositiveTrend && !isNegativeTrend && "text-gray-500"
                                    )}>
                                        {isPositiveTrend && (
                                            <ArrowUpIcon className="h-4 w-4 flex-shrink-0 self-center" aria-hidden="true" />
                                        )}
                                        {isNegativeTrend && (
                                            <ArrowDownIcon className="h-4 w-4 flex-shrink-0 self-center" aria-hidden="true" />
                                        )}
                                        <span className="ml-1">
                                            {Math.abs(change)}%
                                        </span>
                                        <span className="sr-only">
                                            {isPositiveTrend ? 'Increased' : isNegativeTrend ? 'Decreased' : 'Changed'} by
                                        </span>
                                    </div>
                                )}
                            </dd>
                            {subtitle && (
                                <dd className="mt-1 text-xs text-gray-500">
                                    {subtitle}
                                </dd>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}