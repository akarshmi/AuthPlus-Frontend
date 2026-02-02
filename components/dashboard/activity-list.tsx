import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export interface ActivityItem {
    id: string;
    type: 'task_completed' | 'project_created' | 'member_added' | 'comment_posted' | 'file_uploaded';
    title: string;
    description?: string;
    timestamp: Date | string;
    user?: {
        name: string;
        avatar?: string;
    };
    metadata?: {
        projectName?: string;
        taskName?: string;
        fileName?: string;
    };
}

interface ActivityListProps {
    items: ActivityItem[];
    maxItems?: number;
}

const activityTypeConfig = {
    task_completed: {
        icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ),
        color: 'text-green-600 bg-green-100',
        label: 'Completed',
    },
    project_created: {
        icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
        ),
        color: 'text-blue-600 bg-blue-100',
        label: 'Created',
    },
    member_added: {
        icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
        ),
        color: 'text-purple-600 bg-purple-100',
        label: 'Added',
    },
    comment_posted: {
        icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
        ),
        color: 'text-yellow-600 bg-yellow-100',
        label: 'Commented',
    },
    file_uploaded: {
        icon: (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
        ),
        color: 'text-indigo-600 bg-indigo-100',
        label: 'Uploaded',
    },
};

function ActivityItemComponent({ item }: { item: ActivityItem }) {
    const config = activityTypeConfig[item.type];
    const timestamp = typeof item.timestamp === 'string'
        ? new Date(item.timestamp)
        : item.timestamp;

    const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

    return (
        <li className="relative pb-8">
            {/* Timeline connector line */}
            <div className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />

            <div className="relative flex space-x-3">
                {/* Icon */}
                <div>
                    <span className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white',
                        config.color
                    )}>
                        {config.icon}
                    </span>
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                            {item.title}
                        </p>
                        {item.description && (
                            <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">
                                {item.description}
                            </p>
                        )}
                        {item.metadata && (
                            <div className="mt-1 flex flex-wrap gap-2">
                                {item.metadata.projectName && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                        {item.metadata.projectName}
                                    </span>
                                )}
                                {item.metadata.taskName && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                        {item.metadata.taskName}
                                    </span>
                                )}
                                {item.metadata.fileName && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                        {item.metadata.fileName}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time dateTime={timestamp.toISOString()}>
                            {timeAgo}
                        </time>
                    </div>
                </div>
            </div>
        </li>
    );
}

export function ActivityList({ items, maxItems }: ActivityListProps) {
    const displayItems = maxItems ? items.slice(0, maxItems) : items;

    return (
        <div className="flow-root">
            <ul role="list" className="-mb-8">
                {displayItems.map((item, itemIdx) => (
                    <ActivityItemComponent
                        key={item.id}
                        item={item}
                    />
                ))}
            </ul>
        </div>
    );
}