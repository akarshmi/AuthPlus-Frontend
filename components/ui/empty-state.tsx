import { LucideIcon, Inbox, Activity, FolderOpen, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

type IconName = 'inbox' | 'activity' | 'folder' | 'file';

interface EmptyStateProps {
    icon?: IconName;
    title: string;
    description: string;
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
    className?: string;
}

const iconMap: Record<IconName, LucideIcon> = {
    inbox: Inbox,
    activity: Activity,
    folder: FolderOpen,
    file: FileText,
};

export function EmptyState({
    icon = 'inbox',
    title,
    description,
    action,
    className
}: EmptyStateProps) {
    const Icon = iconMap[icon];

    return (
        <div className={cn(
            "text-center py-12",
            className
        )}>
            <Icon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-sm font-medium text-gray-900">
                {title}
            </h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                {description}
            </p>
            {action && (
                <div className="mt-6">
                    {action.href ? (
                        <a
                            href={action.href}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {action.label}
                        </a>
                    ) : action.onClick ? (
                        <button
                            type="button"
                            onClick={action.onClick}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {action.label}
                        </button>
                    ) : null}
                </div>
            )}
        </div>
    );
}