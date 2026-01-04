CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  site_name VARCHAR(255) NOT NULL DEFAULT 'TransparaTech Student Transparency System',
  site_description TEXT DEFAULT 'A comprehensive transparency system for student organizations and document management',
  contact_email VARCHAR(255) NOT NULL DEFAULT 'admin@pupsmb.edu.ph',
  max_file_size INTEGER NOT NULL DEFAULT 100, -- in MB
  allowed_file_types TEXT NOT NULL DEFAULT '["pdf", "doc", "docx", "txt", "jpg", "png"]', -- JSON array
  auto_approval_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  email_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
  session_timeout INTEGER NOT NULL DEFAULT 30, -- in minutes
  max_login_attempts INTEGER NOT NULL DEFAULT 5,
  password_min_length INTEGER NOT NULL DEFAULT 8,
  require_password_complexity BOOLEAN NOT NULL DEFAULT TRUE,
  two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  backup_frequency VARCHAR(50) NOT NULL DEFAULT 'daily',
  data_retention_period INTEGER NOT NULL DEFAULT 365, -- in days
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings if not exists
INSERT INTO system_settings (id)
SELECT 1
WHERE NOT EXISTS (SELECT 1 FROM system_settings WHERE id = 1);
