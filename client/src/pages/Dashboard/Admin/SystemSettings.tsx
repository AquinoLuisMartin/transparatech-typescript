import { useState } from 'react';
import { 
  UserIcon,
  LockIcon,
  DocsIcon,
  TimeIcon,
  CheckCircleIcon
} from '../../../icons';

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  autoApprovalEnabled: boolean;
  emailNotificationsEnabled: boolean;
  maintenanceMode: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  requirePasswordComplexity: boolean;
  twoFactorEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  dataRetentionPeriod: number;
}

interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  description: string;
  userCount: number;
}

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'permissions' | 'maintenance'>('general');
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'TransparaTech Student Transparency System',
    siteDescription: 'A comprehensive transparency system for student organizations and document management',
    contactEmail: 'admin@pupsmb.edu.ph',
    maxFileSize: 100,
    allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png'],
    autoApprovalEnabled: false,
    emailNotificationsEnabled: true,
    maintenanceMode: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requirePasswordComplexity: true,
    twoFactorEnabled: false,
    backupFrequency: 'daily',
    dataRetentionPeriod: 365
  });

  const userRoles: UserRole[] = [
    {
      id: '1',
      name: 'Full Administrator',
      permissions: ['all_permissions'],
      description: 'Complete system access and control',
      userCount: 2
    },
    {
      id: '2',
      name: 'Approval Administrator',
      permissions: ['view_documents', 'approve_documents', 'view_reports'],
      description: 'Document approval and reporting access',
      userCount: 3
    },
    {
      id: '3',
      name: 'Officer',
      permissions: ['upload_documents', 'view_own_submissions', 'view_announcements'],
      description: 'Student organization officers',
      userCount: 25
    },
    {
      id: '4',
      name: 'Viewer',
      permissions: ['view_approved_documents', 'view_announcements'],
      description: 'General users and students',
      userCount: 1247
    }
  ];

  const handleSettingsChange = (key: keyof SystemSettings, value: SystemSettings[keyof SystemSettings]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    // Mock save functionality
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 3000);
  };

  const handleFileTypeToggle = (fileType: string) => {
    const newFileTypes = settings.allowedFileTypes.includes(fileType)
      ? settings.allowedFileTypes.filter(type => type !== fileType)
      : [...settings.allowedFileTypes, fileType];
    handleSettingsChange('allowedFileTypes', newFileTypes);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Site Information</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleSettingsChange('siteName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Site Description
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => handleSettingsChange('siteDescription', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleSettingsChange('contactEmail', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">File Upload Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maximum File Size (MB)
            </label>
            <input
              type="number"
              value={settings.maxFileSize}
              onChange={(e) => handleSettingsChange('maxFileSize', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="1"
              max="500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Allowed File Types
            </label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {['pdf', 'doc', 'docx', 'txt', 'jpg', 'png', 'xlsx', 'ppt', 'zip'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.allowedFileTypes.includes(type)}
                    onChange={() => handleFileTypeToggle(type)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">.{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Behavior</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.autoApprovalEnabled}
              onChange={(e) => handleSettingsChange('autoApprovalEnabled', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              Enable automatic approval for trusted organizations
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.emailNotificationsEnabled}
              onChange={(e) => handleSettingsChange('emailNotificationsEnabled', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              Send email notifications for important events
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => handleSettingsChange('maintenanceMode', e.target.checked)}
              className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
            />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-red-600 dark:text-red-400 font-medium">Maintenance Mode</span> - Disable system for maintenance
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Authentication Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingsChange('sessionTimeout', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="5"
              max="480"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maximum Login Attempts
            </label>
            <input
              type="number"
              value={settings.maxLoginAttempts}
              onChange={(e) => handleSettingsChange('maxLoginAttempts', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="3"
              max="10"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Password Policy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Password Length
            </label>
            <input
              type="number"
              value={settings.passwordMinLength}
              onChange={(e) => handleSettingsChange('passwordMinLength', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="6"
              max="20"
            />
          </div>
          <div className="flex items-center h-full">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.requirePasswordComplexity}
                onChange={(e) => handleSettingsChange('requirePasswordComplexity', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                Require password complexity (uppercase, lowercase, numbers, symbols)
              </span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Advanced Security</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.twoFactorEnabled}
              onChange={(e) => handleSettingsChange('twoFactorEnabled', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              Enable Two-Factor Authentication for admin accounts
            </span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Data Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Backup Frequency
            </label>
            <select
              value={settings.backupFrequency}
              onChange={(e) => handleSettingsChange('backupFrequency', e.target.value as typeof settings.backupFrequency)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Retention Period (days)
            </label>
            <input
              type="number"
              value={settings.dataRetentionPeriod}
              onChange={(e) => handleSettingsChange('dataRetentionPeriod', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              min="30"
              max="2555"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPermissionsSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">User Roles & Permissions</h3>
        <div className="space-y-4">
          {userRoles.map((role) => (
            <div key={role.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">{role.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{role.description}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded">
                  {role.userCount} users
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Permissions:</p>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission, index) => (
                    <span key={index} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium px-2 py-1 rounded">
                      {permission.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMaintenanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">System Status</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">
                  {settings.maintenanceMode ? 'Maintenance Mode' : 'Operational'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center">
              <TimeIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Uptime</p>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">99.8%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Maintenance Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Clear System Cache
          </button>
          <button className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Run Database Cleanup
          </button>
          <button className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            Generate System Report
          </button>
          <button className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Export System Logs
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Backup & Recovery</h3>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Last Backup</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">November 2, 2025 at 3:00 AM</p>
            </div>
            <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium px-2.5 py-0.5 rounded">
              Successful
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Create Manual Backup
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Restore from Backup
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          System Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure system behavior, security, and permissions
        </p>
      </div>

      {/* Save Confirmation */}
      {showSaveConfirmation && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm text-green-800">Settings saved successfully!</span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'general', name: 'General', icon: DocsIcon },
            { id: 'security', name: 'Security', icon: LockIcon },
            { id: 'permissions', name: 'Permissions', icon: UserIcon },
            { id: 'maintenance', name: 'Maintenance', icon: TimeIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'security' && renderSecuritySettings()}
        {activeTab === 'permissions' && renderPermissionsSettings()}
        {activeTab === 'maintenance' && renderMaintenanceSettings()}

        {/* Save Button */}
        {activeTab !== 'maintenance' && activeTab !== 'permissions' && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end">
              <button
                onClick={handleSaveSettings}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemSettings;