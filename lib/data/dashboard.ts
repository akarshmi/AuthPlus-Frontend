// lib/data/dashboard.ts
// Mock data fetching functions for demonstration
// Replace with actual database queries or API calls

import type { ActivityItem } from '@/components/dashboard/activity-list';
import type { SystemStats } from '@/components/dashboard/admin-insights';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    role: string;
}

export interface DashboardMetrics {
    totalProjects: number;
    projectsChange: number;
    projectsTrend: 'up' | 'down' | 'neutral';
    activeTasks: number;
    tasksChange: number;
    tasksTrend: 'up' | 'down' | 'neutral';
    teamMembers: number;
    membersChange: number;
    membersTrend: 'up' | 'down' | 'neutral';
    completionRate: number;
    completionChange: number;
    completionTrend: 'up' | 'down' | 'neutral';
    thisWeekTasks: number;
    overdueTasks: number;
    upcomingDeadlines: number;
}

/**
 * Fetch user profile information
 * In production: SELECT * FROM users WHERE id = ?
 */
export async function getUserProfile(userId: string): Promise<UserProfile> {
    await delay(50); // Simulate DB query

    return {
        id: userId,
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex.johnson@company.com',
        avatar: '/avatars/user-1.jpg',
        role: 'admin',
    };
}

/**
 * Fetch dashboard metrics for a specific user
 * In production: Complex queries aggregating from multiple tables
 */
export async function getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
    await delay(100); // Simulate DB query

    // Mock data - replace with actual queries
    return {
        totalProjects: 24,
        projectsChange: 12,
        projectsTrend: 'up',
        activeTasks: 156,
        tasksChange: 8,
        tasksTrend: 'up',
        teamMembers: 18,
        membersChange: 2,
        membersTrend: 'up',
        completionRate: 87,
        completionChange: 5,
        completionTrend: 'up',
        thisWeekTasks: 42,
        overdueTasks: 7,
        upcomingDeadlines: 12,
    };
}

/**
 * Fetch recent activity for a user
 * In production: SELECT * FROM activities WHERE user_id = ? ORDER BY created_at DESC LIMIT ?
 */
export async function getRecentActivity(
    userId: string,
    options: { limit?: number } = {}
): Promise<ActivityItem[]> {
    await delay(80); // Simulate DB query

    const { limit = 10 } = options;

    // Mock data - replace with actual queries
    const mockActivities: ActivityItem[] = [
        {
            id: '1',
            type: 'task_completed',
            title: 'Completed "Implement user authentication"',
            description: 'Successfully implemented OAuth 2.0 with social login support',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            metadata: {
                projectName: 'Q1 Platform Rebuild',
                taskName: 'AUTH-123',
            },
        },
        {
            id: '2',
            type: 'comment_posted',
            title: 'Commented on "API Rate Limiting"',
            description: 'Suggested using Redis for distributed rate limiting instead of in-memory solution',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
            metadata: {
                projectName: 'Backend Services',
                taskName: 'API-456',
            },
        },
        {
            id: '3',
            type: 'member_added',
            title: 'Added Sarah Chen to Marketing Team',
            description: 'New team member onboarded with contributor access',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
            user: {
                name: 'Sarah Chen',
                avatar: '/avatars/user-2.jpg',
            },
        },
        {
            id: '4',
            type: 'file_uploaded',
            title: 'Uploaded design mockups',
            description: 'New UI designs for the dashboard redesign project',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            metadata: {
                projectName: 'Design System',
                fileName: 'dashboard-mockups-v2.fig',
            },
        },
        {
            id: '5',
            type: 'project_created',
            title: 'Created "Mobile App MVP"',
            description: 'New project for iOS and Android mobile application development',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            metadata: {
                projectName: 'Mobile App MVP',
            },
        },
        {
            id: '6',
            type: 'task_completed',
            title: 'Completed "Database migration"',
            description: 'Successfully migrated from MySQL to PostgreSQL with zero downtime',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            metadata: {
                projectName: 'Infrastructure',
                taskName: 'INFRA-789',
            },
        },
        {
            id: '7',
            type: 'comment_posted',
            title: 'Commented on "Performance optimization"',
            description: 'Identified bottleneck in data fetching layer, suggested caching strategy',
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
            metadata: {
                projectName: 'Q1 Platform Rebuild',
            },
        },
        {
            id: '8',
            type: 'file_uploaded',
            title: 'Uploaded API documentation',
            description: 'Comprehensive API reference for v2 endpoints',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            metadata: {
                projectName: 'Backend Services',
                fileName: 'api-docs-v2.pdf',
            },
        },
    ];

    return mockActivities.slice(0, limit);
}

/**
 * Fetch system-wide statistics (admin only)
 * In production: Complex aggregations across the entire database
 */
export async function getSystemStats(): Promise<SystemStats> {
    await delay(150); // Simulate complex DB query

    // Mock data - replace with actual queries
    return {
        totalUsers: 1547,
        activeToday: 423,
        activeThisWeek: 892,
        activeThisMonth: 1234,
        storageUsedGB: 847,
        storageCapacityGB: 1000,
        apiCallsToday: 45678,
        apiCallsThisMonth: 1234567,
        averageResponseTime: 145,
        errorRate: 0.3,
        systemHealth: 'healthy',
        recentSignups: 87,
        churnRate: 2.4,
        revenueThisMonth: 145890,
        activeSubscriptions: 892,
    };
}