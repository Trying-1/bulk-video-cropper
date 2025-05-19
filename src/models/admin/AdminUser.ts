/**
 * Admin User Model
 * Represents users with administrative privileges
 */
export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: AdminRole;
  permissions: Permission[];
  lastLogin: Date | string;
  active: boolean;
  createdAt: Date | string;
  createdBy?: string;
  notes?: string;
}

/**
 * Admin Roles
 * Defines different levels of administrative access
 */
export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  SUPPORT = 'support',
  CONTENT_MANAGER = 'content_manager',
  ANALYTICS = 'analytics'
}

/**
 * Permissions
 * Granular permissions that can be assigned to admin users
 */
export enum Permission {
  // User management
  VIEW_USERS = 'view_users',
  EDIT_USERS = 'edit_users',
  DELETE_USERS = 'delete_users',
  
  // Subscription management
  VIEW_SUBSCRIPTIONS = 'view_subscriptions',
  EDIT_SUBSCRIPTIONS = 'edit_subscriptions',
  CREATE_PROMOTIONS = 'create_promotions',
  
  // Content management
  MODERATE_CONTENT = 'moderate_content',
  DELETE_CONTENT = 'delete_content',
  
  // System settings
  VIEW_SETTINGS = 'view_settings',
  EDIT_SETTINGS = 'edit_settings',
  
  // Analytics
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_DATA = 'export_data'
}

/**
 * Default admin permissions by role
 */
export const rolePermissions: Record<AdminRole, Permission[]> = {
  [AdminRole.SUPER_ADMIN]: Object.values(Permission),
  [AdminRole.ADMIN]: [
    Permission.VIEW_USERS,
    Permission.EDIT_USERS,
    Permission.VIEW_SUBSCRIPTIONS,
    Permission.EDIT_SUBSCRIPTIONS,
    Permission.CREATE_PROMOTIONS,
    Permission.MODERATE_CONTENT,
    Permission.DELETE_CONTENT,
    Permission.VIEW_SETTINGS,
    Permission.EDIT_SETTINGS,
    Permission.VIEW_ANALYTICS
  ],
  [AdminRole.SUPPORT]: [
    Permission.VIEW_USERS,
    Permission.VIEW_SUBSCRIPTIONS,
    Permission.MODERATE_CONTENT,
    Permission.VIEW_SETTINGS,
    Permission.VIEW_ANALYTICS
  ],
  [AdminRole.CONTENT_MANAGER]: [
    Permission.MODERATE_CONTENT,
    Permission.DELETE_CONTENT
  ],
  [AdminRole.ANALYTICS]: [
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA
  ]
};

/**
 * Default admin users (for development purposes only)
 */
export const defaultAdminUsers: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>[] = [
  {
    email: 'admin@bulkvidcropper.com',
    displayName: 'System Administrator',
    role: AdminRole.SUPER_ADMIN,
    permissions: rolePermissions[AdminRole.SUPER_ADMIN],
    active: true,
    notes: 'Primary system administrator account'
  }
];
