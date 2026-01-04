const { query } = require('../config/database');

const getSettings = async (req, res) => {
  try {
    const result = await query('SELECT * FROM system_settings WHERE id = 1');
    
    if (result.rows.length === 0) {
      // Should not happen due to migration, but just in case
      return res.status(404).json({
        success: false,
        message: 'Settings not found'
      });
    }

    const settings = result.rows[0];
    
    // Parse JSON string for allowed_file_types if it's a string
    if (typeof settings.allowed_file_types === 'string') {
      try {
        settings.allowed_file_types = JSON.parse(settings.allowed_file_types);
      } catch (e) {
        settings.allowed_file_types = [];
      }
    }

    res.json({
      success: true,
      data: {
        siteName: settings.site_name,
        siteDescription: settings.site_description,
        contactEmail: settings.contact_email,
        maxFileSize: settings.max_file_size,
        allowedFileTypes: settings.allowed_file_types,
        autoApprovalEnabled: settings.auto_approval_enabled,
        emailNotificationsEnabled: settings.email_notifications_enabled,
        maintenanceMode: settings.maintenance_mode,
        sessionTimeout: settings.session_timeout,
        maxLoginAttempts: settings.max_login_attempts,
        passwordMinLength: settings.password_min_length,
        requirePasswordComplexity: settings.require_password_complexity,
        twoFactorEnabled: settings.two_factor_enabled,
        backupFrequency: settings.backup_frequency,
        dataRetentionPeriod: settings.data_retention_period
      }
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    const {
      siteName,
      siteDescription,
      contactEmail,
      maxFileSize,
      allowedFileTypes,
      autoApprovalEnabled,
      emailNotificationsEnabled,
      maintenanceMode,
      sessionTimeout,
      maxLoginAttempts,
      passwordMinLength,
      requirePasswordComplexity,
      twoFactorEnabled,
      backupFrequency,
      dataRetentionPeriod
    } = req.body;

    const allowedFileTypesJson = JSON.stringify(allowedFileTypes);

    const result = await query(
      `UPDATE system_settings 
       SET site_name = $1,
           site_description = $2,
           contact_email = $3,
           max_file_size = $4,
           allowed_file_types = $5,
           auto_approval_enabled = $6,
           email_notifications_enabled = $7,
           maintenance_mode = $8,
           session_timeout = $9,
           max_login_attempts = $10,
           password_min_length = $11,
           require_password_complexity = $12,
           two_factor_enabled = $13,
           backup_frequency = $14,
           data_retention_period = $15,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = 1
       RETURNING *`,
      [
        siteName,
        siteDescription,
        contactEmail,
        maxFileSize,
        allowedFileTypesJson,
        autoApprovalEnabled,
        emailNotificationsEnabled,
        maintenanceMode,
        sessionTimeout,
        maxLoginAttempts,
        passwordMinLength,
        requirePasswordComplexity,
        twoFactorEnabled,
        backupFrequency,
        dataRetentionPeriod
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Settings not found'
      });
    }

    const settings = result.rows[0];
    if (typeof settings.allowed_file_types === 'string') {
      try {
        settings.allowed_file_types = JSON.parse(settings.allowed_file_types);
      } catch (e) {
        settings.allowed_file_types = [];
      }
    }

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        siteName: settings.site_name,
        siteDescription: settings.site_description,
        contactEmail: settings.contact_email,
        maxFileSize: settings.max_file_size,
        allowedFileTypes: settings.allowed_file_types,
        autoApprovalEnabled: settings.auto_approval_enabled,
        emailNotificationsEnabled: settings.email_notifications_enabled,
        maintenanceMode: settings.maintenance_mode,
        sessionTimeout: settings.session_timeout,
        maxLoginAttempts: settings.max_login_attempts,
        passwordMinLength: settings.password_min_length,
        requirePasswordComplexity: settings.require_password_complexity,
        twoFactorEnabled: settings.two_factor_enabled,
        backupFrequency: settings.backup_frequency,
        dataRetentionPeriod: settings.data_retention_period
      }
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
