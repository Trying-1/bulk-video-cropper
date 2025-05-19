/**
 * Admin Settings Model
 * Represents global application settings managed by administrators
 */
export interface AdminSettings {
  id: string;
  appName: string;
  maxVideoSizeInMB: number;
  maxVideoCount: number;
  allowedFileTypes: string[];
  maintenanceMode: boolean;
  maintenanceMessage: string;
  lastUpdated: Date | string;
  updatedBy: string;
  // Security settings
  requireEmailVerification: boolean;
  loginAttemptLimit: number;
  // Contact information
  supportEmail: string;
  contactFormEnabled: boolean;
  // Social media links
  socialLinks: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
}

/**
 * Default Admin Settings
 */
export const defaultAdminSettings: Omit<AdminSettings, 'id' | 'lastUpdated' | 'updatedBy'> = {
  appName: 'Bulk Video Cropper',
  maxVideoSizeInMB: 500,
  maxVideoCount: 10,
  allowedFileTypes: ['mp4', 'mov', 'avi', 'webm'],
  maintenanceMode: false,
  maintenanceMessage: 'The system is currently under maintenance. Please try again later.',
  // Security settings
  requireEmailVerification: true,
  loginAttemptLimit: 5,
  // Contact information
  supportEmail: 'support@bulkvidcropper.com',
  contactFormEnabled: true,
  // Social media links
  socialLinks: {
    twitter: 'https://twitter.com/bulkvidcropper',
    instagram: 'https://instagram.com/bulkvidcropper',
  }
};
