'use client';

import React, { useState, useEffect } from 'react';

interface AdminSettings {
  applicationName: string;
  contactEmail: string;
  maxStoragePerUserGB: number;
  maintenanceMode: boolean;
  requireEmailVerification: boolean;
  allowAccountDeletion: boolean;
  notificationEmails: string[];
  autoBackups: boolean;
  backupFrequency: string;
  maxVideoProcessingConcurrent: number;
}

interface SecuritySettings {
  minPasswordLength: number;
  requireSpecialCharacters: boolean;
  requireNumbers: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number; // minutes
  adminIps: string[];
}

export default function AdminSettingsPage() {
  const [generalSettings, setGeneralSettings] = useState<AdminSettings>({
    applicationName: 'Bulk Video Cropper',
    contactEmail: 'admin@bulkvidcropper.com',
    maxStoragePerUserGB: 10,
    maintenanceMode: false,
    requireEmailVerification: true,
    allowAccountDeletion: true,
    notificationEmails: ['admin@bulkvidcropper.com', 'support@bulkvidcropper.com'],
    autoBackups: true,
    backupFrequency: 'daily',
    maxVideoProcessingConcurrent: 5
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    minPasswordLength: 8,
    requireSpecialCharacters: true,
    requireNumbers: true,
    maxLoginAttempts: 5,
    sessionTimeout: 60,
    adminIps: ['All IPs']
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveGeneralSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // In a real application, you would save these settings to Firebase
      // await updateDoc(doc(db, 'adminSettings', 'general'), generalSettings);
      
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('General settings updated successfully');
    } catch (error) {
      console.error('Error saving general settings:', error);
      setErrorMessage('Failed to save general settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecuritySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // In a real application, you would save these settings to Firebase
      // await updateDoc(doc(db, 'adminSettings', 'security'), securitySettings);
      
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Security settings updated successfully');
    } catch (error) {
      console.error('Error saving security settings:', error);
      setErrorMessage('Failed to save security settings');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to update general settings
  const updateGeneralSetting = (key: keyof AdminSettings, value: any) => {
    setGeneralSettings(prev => ({ ...prev, [key]: value }));
  };

  // Helper function to update security settings
  const updateSecuritySetting = (key: keyof SecuritySettings, value: any) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };

  // Helper function to add notification email
  const addNotificationEmail = () => {
    const email = prompt('Enter a new notification email:');
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      updateGeneralSetting('notificationEmails', [...generalSettings.notificationEmails, email]);
    } else if (email) {
      alert('Please enter a valid email address');
    }
  };

  // Helper function to remove notification email
  const removeNotificationEmail = (email: string) => {
    updateGeneralSetting(
      'notificationEmails', 
      generalSettings.notificationEmails.filter(e => e !== email)
    );
  };

  // Helper function to add admin IP
  const addAdminIp = () => {
    const ip = prompt('Enter a new admin IP address:');
    if (ip) {
      updateSecuritySetting('adminIps', [...securitySettings.adminIps, ip]);
    }
  };

  // Helper function to remove admin IP
  const removeAdminIp = (ip: string) => {
    updateSecuritySetting(
      'adminIps', 
      securitySettings.adminIps.filter(i => i !== ip)
    );
  };

  return (
    <div className="pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Configure global settings for the Bulk Video Cropper platform.
        </p>
      </div>

      {successMessage && (
        <div className="mb-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700 dark:text-green-300">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">General Settings</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Configure basic application settings.
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600">
            <form onSubmit={handleSaveGeneralSettings} className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="applicationName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Application Name
                  </label>
                  <input
                    type="text"
                    name="applicationName"
                    id="applicationName"
                    value={generalSettings.applicationName}
                    onChange={(e) => updateGeneralSetting('applicationName', e.target.value)}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    id="contactEmail"
                    value={generalSettings.contactEmail}
                    onChange={(e) => updateGeneralSetting('contactEmail', e.target.value)}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="maxStoragePerUserGB" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max Storage Per User (GB)
                  </label>
                  <input
                    type="number"
                    name="maxStoragePerUserGB"
                    id="maxStoragePerUserGB"
                    min="1"
                    max="100"
                    value={generalSettings.maxStoragePerUserGB}
                    onChange={(e) => updateGeneralSetting('maxStoragePerUserGB', parseInt(e.target.value))}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="maxVideoProcessingConcurrent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max Concurrent Video Processing
                  </label>
                  <input
                    type="number"
                    name="maxVideoProcessingConcurrent"
                    id="maxVideoProcessingConcurrent"
                    min="1"
                    max="20"
                    value={generalSettings.maxVideoProcessingConcurrent}
                    onChange={(e) => updateGeneralSetting('maxVideoProcessingConcurrent', parseInt(e.target.value))}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="maintenanceMode"
                    name="maintenanceMode"
                    type="checkbox"
                    checked={generalSettings.maintenanceMode}
                    onChange={(e) => updateGeneralSetting('maintenanceMode', e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Maintenance Mode
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="requireEmailVerification"
                    name="requireEmailVerification"
                    type="checkbox"
                    checked={generalSettings.requireEmailVerification}
                    onChange={(e) => updateGeneralSetting('requireEmailVerification', e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="requireEmailVerification" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Require Email Verification
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="allowAccountDeletion"
                    name="allowAccountDeletion"
                    type="checkbox"
                    checked={generalSettings.allowAccountDeletion}
                    onChange={(e) => updateGeneralSetting('allowAccountDeletion', e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="allowAccountDeletion" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Allow Users to Delete Accounts
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notification Emails
                  </label>
                  <div className="space-y-2">
                    {generalSettings.notificationEmails.map((email) => (
                      <div key={email} className="flex items-center">
                        <span className="flex-grow text-sm text-gray-700 dark:text-gray-300">{email}</span>
                        <button
                          type="button"
                          onClick={() => removeNotificationEmail(email)}
                          className="ml-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addNotificationEmail}
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      Add Email
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Backup Frequency
                  </label>
                  <select
                    id="backupFrequency"
                    name="backupFrequency"
                    value={generalSettings.backupFrequency}
                    onChange={(e) => updateGeneralSetting('backupFrequency', e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Security Settings</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Configure security and access controls.
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600">
            <form onSubmit={handleSaveSecuritySettings} className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="minPasswordLength" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    name="minPasswordLength"
                    id="minPasswordLength"
                    min="6"
                    max="32"
                    value={securitySettings.minPasswordLength}
                    onChange={(e) => updateSecuritySetting('minPasswordLength', parseInt(e.target.value))}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="requireSpecialCharacters"
                    name="requireSpecialCharacters"
                    type="checkbox"
                    checked={securitySettings.requireSpecialCharacters}
                    onChange={(e) => updateSecuritySetting('requireSpecialCharacters', e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="requireSpecialCharacters" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Require Special Characters in Password
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="requireNumbers"
                    name="requireNumbers"
                    type="checkbox"
                    checked={securitySettings.requireNumbers}
                    onChange={(e) => updateSecuritySetting('requireNumbers', e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="requireNumbers" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Require Numbers in Password
                  </label>
                </div>

                <div>
                  <label htmlFor="maxLoginAttempts" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max Login Attempts Before Lockout
                  </label>
                  <input
                    type="number"
                    name="maxLoginAttempts"
                    id="maxLoginAttempts"
                    min="1"
                    max="10"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => updateSecuritySetting('maxLoginAttempts', parseInt(e.target.value))}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    name="sessionTimeout"
                    id="sessionTimeout"
                    min="5"
                    max="1440"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => updateSecuritySetting('sessionTimeout', parseInt(e.target.value))}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Admin IP Whitelist
                  </label>
                  <div className="space-y-2">
                    {securitySettings.adminIps.map((ip) => (
                      <div key={ip} className="flex items-center">
                        <span className="flex-grow text-sm text-gray-700 dark:text-gray-300">{ip}</span>
                        {ip !== 'All IPs' && (
                          <button
                            type="button"
                            onClick={() => removeAdminIp(ip)}
                            className="ml-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addAdminIp}
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      Add IP Address
                    </button>
                  </div>
                </div>
              </div>
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
