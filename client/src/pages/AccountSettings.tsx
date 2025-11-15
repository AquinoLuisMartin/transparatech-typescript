import React, { useState } from 'react';
import PageMeta from '../components/common/PageMeta';
import { 
  UserIcon,
  LockIcon,
  DocsIcon,
  TimeIcon,
  CheckCircleIcon
} from '../icons';

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

const AccountSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [activeSystemTab, setActiveSystemTab] = useState<'general' | 'security' | 'permissions' | 'maintenance'>('general');

  const [formData, setFormData] = useState({
    firstName: 'Chiz',
    lastName: 'Escudero',
    email: 'forthwith@gmail.com',
    phone: '+63 912 345 6789',
    organization: 'PUPSMB TransparaTech',
    position: 'Senator',
    bio: 'Dedicated to transparency and good governance.',
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      announcements: true,
      reports: true,
      systemUpdates: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      dataSharing: false
    }
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      if (section === 'notifications') {
        setFormData(prev => ({
          ...prev,
          notifications: {
            ...prev.notifications,
            [field]: type === 'checkbox' ? checked : value
          }
        }));
      } else if (section === 'privacy') {
        setFormData(prev => ({
          ...prev,
          privacy: {
            ...prev.privacy,
            [field]: type === 'checkbox' ? checked : value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSave = () => {
    // Here you would typically save the data to your backend
    console.log('Saving profile data:', formData);
    setIsEditing(false);
    // Show success message
  };

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

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy & Security', icon: '🔒' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' }
  ];

  return (
    <>
      <PageMeta 
        title="Account Settings | PUPSMB TransparaTech" 
        description="Manage your account settings and preferences"
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Account Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account information, notifications, and privacy settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="mr-3 text-lg">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                
                {/* Profile Information Tab */}
                {activeTab === 'profile' && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Profile Information
                      </h2>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          isEditing
                            ? 'bg-gray-600 text-white hover:bg-gray-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </button>
                    </div>

                    {/* Profile Photo */}
                    <div className="flex items-center mb-8">
                      <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mr-6">
                        <img 
                          src="/images/user/owner.jpg" 
                          alt="Profile" 
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      </div>
                      {isEditing && (
                        <div>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2">
                            Change Photo
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Organization
                        </label>
                        <input
                          type="text"
                          name="organization"
                          value={formData.organization}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Position
                        </label>
                        <input
                          type="text"
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-600"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-600"
                      />
                    </div>

                    {isEditing && (
                      <div className="flex justify-end mt-6 space-x-3">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Notification Preferences
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notifications.emailNotifications"
                            checked={formData.notifications.emailNotifications}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">SMS Notifications</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via SMS</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notifications.smsNotifications"
                            checked={formData.notifications.smsNotifications}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Announcements</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about new announcements</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notifications.announcements"
                            checked={formData.notifications.announcements}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Reports</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when new reports are published</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notifications.reports"
                            checked={formData.notifications.reports}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-4">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">System Updates</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about system maintenance and updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notifications.systemUpdates"
                            checked={formData.notifications.systemUpdates}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy & Security Tab */}
                {activeTab === 'privacy' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Privacy & Security
                    </h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-4">Password</h3>
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Last changed: 30 days ago</p>
                          </div>
                          <button
                            onClick={() => setShowPasswordModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Change Password
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-4">Profile Visibility</h3>
                        <select
                          name="privacy.profileVisibility"
                          value={formData.privacy.profileVisibility}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                          <option value="organization">Organization Only</option>
                        </select>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Show Email Address</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Allow others to see your email address</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="privacy.showEmail"
                              checked={formData.privacy.showEmail}
                              onChange={handleInputChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Show Phone Number</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Allow others to see your phone number</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="privacy.showPhone"
                              checked={formData.privacy.showPhone}
                              onChange={handleInputChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Data Sharing</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Allow data sharing for analytics and improvements</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="privacy.dataSharing"
                              checked={formData.privacy.dataSharing}
                              onChange={handleInputChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Preferences & System Settings
                      </h2>
                      {showSaveConfirmation && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center">
                            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-sm text-green-800">Settings saved successfully!</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* System Settings Tab Navigation */}
                    <div className="mb-6">
                      <nav className="flex space-x-4">
                        {[
                          { id: 'general', name: 'General Settings', icon: DocsIcon },
                          { id: 'security', name: 'Security Settings', icon: LockIcon },
                          { id: 'permissions', name: 'User Permissions', icon: UserIcon },
                          { id: 'maintenance', name: 'System Maintenance', icon: TimeIcon }
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveSystemTab(tab.id as typeof activeSystemTab)}
                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              activeSystemTab === tab.id
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                          >
                            <tab.icon className="h-4 w-4 mr-2" />
                            {tab.name}
                          </button>
                        ))}
                      </nav>
                    </div>

                    {/* General Settings */}
                    {activeSystemTab === 'general' && (
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

                    {/* Security Settings */}
                    {activeSystemTab === 'security' && (
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
                                  Require password complexity
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

                    {/* Permissions Settings */}
                    {activeSystemTab === 'permissions' && (
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
                    )}

                    {/* Maintenance Settings */}
                    {activeSystemTab === 'maintenance' && (
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
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Change Password
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountSettings;