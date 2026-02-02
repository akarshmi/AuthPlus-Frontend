// lib/auth/permissions.ts
// Authorization and permission checking utilities

/**
 * Permission definitions
 * In production, these would be stored in database and checked against user roles
 */
export type Permission =
    | 'view:system_stats'
    | 'view:admin_insights'
    | 'role:admin'
    | 'role:manager'
    | 'role:user'
    | 'edit:projects'
    | 'delete:projects'
    | 'manage:users'
    | 'view:analytics';

/**
 * Role-based permissions mapping
 * In production: Fetch from database or configuration service
 */
const ROLE_PERMISSIONS: Record<string, Permission[]> = {
    admin: [
        'view:system_stats',
        'view:admin_insights',
        'role:admin',
        'edit:projects',
        'delete:projects',
        'manage:users',
        'view:analytics',
    ],
    manager: [
        'view:system_stats',
        'role:manager',
        'edit:projects',
        'view:analytics',
    ],
    user: [
        'role:user',
        'edit:projects',
    ],
};

/**
 * Get current user's role
 * In production: Extract from session/JWT token
 * For dev: Returns 'admin' to bypass all checks
 */
function getCurrentUserRole(): string {
    // DEV MODE: Always return admin for testing
    // In production, replace with actual session check:
    // const session = await getServerSession(authOptions);
    // return session?.user?.role || 'user';

    return 'admin'; // Dev testing bypass
}

/**
 * Get current user's permissions based on their role
 * In production: Query database for user-specific permissions
 */
function getUserPermissions(role: string): Permission[] {
    return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS['user'];
}

/**
 * Check if current user has a specific permission
 * This is the main authorization function used throughout the app
 * 
 * @param permission - The permission to check
 * @returns boolean - Whether the user has the permission
 * 
 * @example
 * ```tsx
 * // In a Server Component
 * const canViewStats = authorize('view:system_stats');
 * 
 * if (canViewStats) {
 *   // Render admin content
 * }
 * ```
 */
export function authorize(permission: Permission): boolean {
    // DEV MODE: Always return true for testing
    // Remove this return in production
    return true;

    // PRODUCTION CODE (uncomment when ready):
    // const role = getCurrentUserRole();
    // const permissions = getUserPermissions(role);
    // return permissions.includes(permission);
}

/**
 * Check if user has ANY of the provided permissions
 * Useful for OR logic in permission checks
 */
export function authorizeAny(permissions: Permission[]): boolean {
    return permissions.some(permission => authorize(permission));
}

/**
 * Check if user has ALL of the provided permissions
 * Useful for AND logic in permission checks
 */
export function authorizeAll(permissions: Permission[]): boolean {
    return permissions.every(permission => authorize(permission));
}

/**
 * Get all permissions for current user
 * Useful for debugging or UI that needs to show available features
 */
export function getCurrentPermissions(): Permission[] {
    const role = getCurrentUserRole();
    return getUserPermissions(role);
}

/**
 * Higher-order function to protect server actions
 * In production: Use this to wrap server actions that need authorization
 * 
 * @example
 * ```tsx
 * const deleteProject = withAuthorization('delete:projects', async (projectId: string) => {
 *   await db.project.delete({ where: { id: projectId } });
 * });
 * ```
 */
export function withAuthorization<T extends (...args: any[]) => any>(
    permission: Permission,
    action: T
): T {
    return (async (...args: Parameters<T>) => {
        if (!authorize(permission)) {
            throw new Error('Unauthorized: Missing required permission');
        }
        return action(...args);
    }) as T;
}

/**
 * Type guard for role checking
 * Useful for TypeScript type narrowing based on roles
 */
export function hasRole(role: 'admin' | 'manager' | 'user'): boolean {
    const userRole = getCurrentUserRole();
    return userRole === role;
}